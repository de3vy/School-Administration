const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentProgressSchema = new Schema({
  student_id: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  module_id: {
    type: Schema.Types.ObjectId,
    ref: 'LearningModule',
    required: true
  },
  start_date: {
    type: Date,
    default: Date.now
  },
  completion_date: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'Deferred'],
    default: 'Not Started'
  },
  assessment_score: {
    type: Number,
    min: 0,
    max: 100
  },
  assessment_date: {
    type: Date
  },
  feedback: {
    type: String
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

// Create a compound index for student_id and module_id to ensure uniqueness
StudentProgressSchema.index({ student_id: 1, module_id: 1 }, { unique: true });

module.exports = mongoose.model('StudentProgress', StudentProgressSchema);
