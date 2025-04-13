const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LearningModuleSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  objectives: {
    type: String
  },
  prerequisites: {
    type: String
  },
  estimated_duration: {
    type: Number,  // in hours
    default: 1
  },
  difficulty_level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('LearningModule', LearningModuleSchema);
