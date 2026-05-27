const Certificate = require('../models/Certificate');
const Campaign = require('../models/Campaign');
const { generateCertificateId } = require('../utils/helpers');
const { createNotification } = require('../socket');

exports.generateCertificate = async (req, res) => {
  try {
    const { campaignId, type, hoursContributed, amountDonated } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const certificate = await Certificate.create({
      user: req.user._id,
      campaign: campaignId,
      type,
      certificateId: generateCertificateId(),
      metadata: { hoursContributed, amountDonated },
    });

    const populatedCert = await Certificate.findById(certificate._id)
      .populate('user', 'name email')
      .populate('campaign', 'title category');

    createNotification({
      recipient: req.user._id,
      type: 'certificate',
      title: 'Certificate Generated!',
      message: `Your ${type} certificate for "${campaign.title}" is ready`,
      data: { certificateId: certificate.certificateId },
    });

    res.status(201).json({ certificate: populatedCert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCertificates = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'volunteer') {
      filter.user = req.user._id;
    }

    const certificates = await Certificate.find(filter)
      .sort('-issuedDate')
      .populate('user', 'name email')
      .populate('campaign', 'title category');

    res.json({ certificates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.id })
      .populate('user', 'name email')
      .populate('campaign', 'title category');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json({ certificate, valid: certificate.isVerified });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
