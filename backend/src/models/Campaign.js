const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Campaign name is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed'],
    default: 'active'
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: 0
  },
  spent: {
    type: Number,
    default: 0,
    min: 0
  },
  metrics: {
    clicks: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 }
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  }
}, { timestamps: true });

// Indexes for common query patterns
campaignSchema.index({ user: 1, status: 1 });  // filter by user + status
campaignSchema.index({ user: 1, createdAt: -1 }); // sort by newest per user

// Virtual: CTR (click through rate) — computed, not stored
campaignSchema.virtual('ctr').get(function () {
  if (this.metrics.impressions === 0) return 0;
  return ((this.metrics.clicks / this.metrics.impressions) * 100).toFixed(2);
});

// Include virtuals when converting to JSON (for API responses)
campaignSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Campaign', campaignSchema);