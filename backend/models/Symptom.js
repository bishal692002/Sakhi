const mongoose = require('mongoose');

const SymptomSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Please add symptom date'],
    default: Date.now
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'anxious', 'neutral', 'other'],
  },
  cramps: {
    type: String,
    enum: ['none', 'mild', 'moderate', 'severe'],
  },
  flow: {
    type: String,
    enum: ['none', 'light', 'medium', 'heavy'],
  },
  headache: {
    type: Boolean,
    default: false
  },
  backache: {
    type: Boolean,
    default: false
  },
  bloating: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
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
SymptomSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Symptom', SymptomSchema);
