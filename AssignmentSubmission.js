const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssignmentSubmissionSchema = new Schema({
  assignment_id: {
    type: Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  student_id: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  submission_date: {
    type: Date,
    default: Date.now,
    required: true
  },
  content: {
    type: String
  },
  file_path: {
    type: String
  },
  url: {
    type: String
  },
  grade: {
    type: Number,
    min: 0
  },
  feedback: {
    type: String
  },
  graded_by: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  graded_date: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Submitted', 'Late', 'Graded', 'Returned'],
    default: 'Submitted'
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

// Create a compound index for assignment_id and student_id to ensure uniqueness
AssignmentSubmissionSchema.index({ assignment_id: 1, student_id: 1 }, { unique: true });

module.exports = mongoose.model('AssignmentSubmission', AssignmentSubmissionSchema);
