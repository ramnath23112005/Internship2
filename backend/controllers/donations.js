const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const { paginateResults } = require('../utils/helpers');
const { createNotification } = require('../socket');
const { sendDonationReceipt } = require('../services/email');

exports.createDonation = async (req, res) => {
  try {
    const { campaignId, amount, paymentMethod, isAnonymous, message } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const donation = await Donation.create({
      campaign: campaignId,
      donor: req.user._id,
      amount,
      paymentMethod,
      isAnonymous,
      message,
    });

    campaign.raisedAmount += amount;
    await campaign.save();

    createNotification({
      recipient: campaign.createdBy,
      type: 'donation_received',
      title: 'New Donation!',
      message: `$${amount} donated to "${campaign.title}"`,
      data: { campaignId: campaign._id, amount },
    });

    sendDonationReceipt(req.user, donation, campaign);

    res.status(201).json({ donation, campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDonations = async (req, res) => {
  try {
    const { page = 1, limit = 10, campaignId } = req.query;
    const { skip, limit: limitNum } = paginateResults(page, limit);

    const filter = {};
    if (campaignId) filter.campaign = campaignId;

    if (req.user.role === 'volunteer') {
      filter.donor = req.user._id;
    } else if (req.user.role === 'ngo_admin') {
      const campaigns = await Campaign.find({ createdBy: req.user._id }).select('_id');
      filter.campaign = { $in: campaigns.map((c) => c._id) };
    }

    const [donations, total] = await Promise.all([
      Donation.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(limitNum)
        .populate('donor', 'name email')
        .populate('campaign', 'title'),
      Donation.countDocuments(filter),
    ]);

    res.json({ donations, total, page: parseInt(page), pages: Math.ceil(total / limitNum) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDonationStats = async (req, res) => {
  try {
    const stats = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalDonations: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
        },
      },
    ]);

    const monthlyStats = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      stats: stats[0] || { totalAmount: 0, totalDonations: 0, avgAmount: 0 },
      monthlyStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
