const Campaign = require('../models/Campaign');
const { paginateResults } = require('../utils/helpers');
const { createNotification } = require('../socket');
const { generateCampaignTips, generateCampaignDescription } = require('../services/ai');

exports.createCampaign = async (req, res) => {
  try {
    const campaignData = { ...req.body, createdBy: req.user._id };

    if (!campaignData.description && campaignData.title) {
      const aiDescription = await generateCampaignDescription(
        campaignData.title,
        campaignData.category,
        campaignData.keywords
      );
      if (aiDescription) campaignData.description = aiDescription;
    }

    const campaign = await Campaign.create(campaignData);
    res.status(201).json({ campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, search } = req.query;
    const { skip, limit: limitNum } = paginateResults(page, limit);

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    if (req.user.role === 'ngo_admin') {
      filter.createdBy = req.user._id;
    }

    const [campaigns, total] = await Promise.all([
      Campaign.find(filter).sort('-createdAt').skip(skip).limit(limitNum).populate('createdBy', 'name email avatar'),
      Campaign.countDocuments(filter),
    ]);

    res.json({ campaigns, total, page: parseInt(page), pages: Math.ceil(total / limitNum) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('createdBy', 'name email avatar organization')
      .populate('volunteers.user', 'name email avatar');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const aiTips = await generateCampaignTips(campaign);

    res.json({ campaign, aiTips });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ campaign: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await campaign.deleteOne();
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.joinCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const alreadyJoined = campaign.volunteers.find((v) => v.user.toString() === req.user._id.toString());
    if (alreadyJoined) {
      return res.status(400).json({ message: 'Already joined this campaign' });
    }

    campaign.volunteers.push({ user: req.user._id });
    campaign.volunteersJoined += 1;
    await campaign.save();

    createNotification({
      recipient: campaign.createdBy,
      type: 'volunteer_joined',
      title: 'New Volunteer!',
      message: `${req.user.name} has joined "${campaign.title}"`,
      data: { campaignId: campaign._id },
    });

    res.json({ campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAITips = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const tips = await generateCampaignTips(campaign);
    res.json({ tips });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
