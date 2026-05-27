const express = require('express');
const router = express.Router();
const {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  joinCampaign,
  getAITips,
} = require('../controllers/campaigns');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

router.get('/', protect, getCampaigns);
router.post('/', protect, checkRole('ngo_admin', 'super_admin'), createCampaign);
router.get('/:id', protect, getCampaign);
router.put('/:id', protect, updateCampaign);
router.delete('/:id', protect, deleteCampaign);
router.post('/:id/join', protect, joinCampaign);
router.get('/:id/ai-tips', protect, getAITips);

module.exports = router;
