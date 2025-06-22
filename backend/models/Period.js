const mongoose = require('mongoose');

const PeriodSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: [true, 'Please add period start date']
  },
  cycleLength: {
    type: Number,
    required: [true, 'Please add cycle length'],
    min: [20, 'Cycle length should be at least 20 days'],
    max: [45, 'Cycle length should not exceed 45 days'],
    default: 28
  },
  periodLength: {
    type: Number,
    min: [1, 'Period length should be at least 1 day'],
    max: [10, 'Period length should not exceed 10 days'],
    default: 5
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index to optimize queries by user
PeriodSchema.index({ user: 1, startDate: -1 });

module.exports = mongoose.model('Period', PeriodSchema);
