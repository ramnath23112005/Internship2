const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    category: {
      type: String,
      enum: ['education', 'health', 'environment', 'poverty', 'disaster', 'animal', 'community', 'other'],
      default: 'other',
    },
    targetAmount: {
      type: Number,
      required: [true, 'Target amount is required'],
      min: 0,
    },
    raisedAmount: {
      type: Number,
      default: 0,
    },
    volunteersNeeded: {
      type: Number,
      default: 0,
    },
    volunteersJoined: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    location: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'completed', 'cancelled'],
      default: 'active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    volunteers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        joinedAt: { type: Date, default: Date.now },
        role: { type: String, default: 'volunteer' },
      },
    ],
    updates: [
      {
        title: String,
        content: String,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

campaignSchema.virtual('progress').get(function () {
  if (this.targetAmount === 0) return 0;
  return Math.min((this.raisedAmount / this.targetAmount) * 100, 100);
});

campaignSchema.set('toJSON', { virtuals: true });
campaignSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Campaign', campaignSchema);
