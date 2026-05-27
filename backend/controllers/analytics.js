const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'volunteer' });
    const totalCampaigns = await Campaign.countDocuments();
    const totalDonations = await Donation.countDocuments({ paymentStatus: 'completed' });
    const donationAgg = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const activeCampaigns = await Campaign.countDocuments({ status: 'active' });

    const categoryStats = await Campaign.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const monthlyDonations = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    const recentCampaigns = await Campaign.find().sort('-createdAt').limit(5).populate('createdBy', 'name');

    res.json({
      stats: {
        totalUsers,
        totalCampaigns,
        totalDonations,
        totalRevenue: donationAgg[0]?.total || 0,
        activeCampaigns,
      },
      categoryStats,
      monthlyDonations,
      recentCampaigns,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVolunteerStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const joinedCampaigns = await Campaign.countDocuments({ 'volunteers.user': userId });
    const donations = await Donation.find({ donor: userId, paymentStatus: 'completed' });
    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
    const donationCount = donations.length;

    const activeCampaigns = await Campaign.find({ 'volunteers.user': userId, status: 'active' }).populate(
      'createdBy',
      'name organization'
    );

    const recentDonations = await Donation.find({ donor: userId })
      .sort('-createdAt')
      .limit(5)
      .populate('campaign', 'title');

    res.json({
      stats: { joinedCampaigns, totalDonated, donationCount },
      activeCampaigns,
      recentDonations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
