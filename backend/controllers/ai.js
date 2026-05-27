const { generateCampaignTips, generateCampaignDescription } = require('../services/ai');
const Campaign = require('../models/Campaign');

exports.getAITips = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const tips = await generateCampaignTips(campaign);
    res.json({ tips });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.generateDescription = async (req, res) => {
  try {
    const { title, category, keywords } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const description = await generateCampaignDescription(title, category, keywords);
    res.json({ description });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
