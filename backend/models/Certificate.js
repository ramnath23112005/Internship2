const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    type: {
      type: String,
      enum: ['volunteer', 'donation', 'appreciation'],
      required: true,
    },
    certificateId: {
      type: String,
      unique: true,
      required: true,
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      hoursContributed: Number,
      amountDonated: Number,
      role: String,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

certificateSchema.index({ user: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);
