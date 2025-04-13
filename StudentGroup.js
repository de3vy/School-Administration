const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentGroupSchema = new Schema({
  student_id: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  group_id: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  join_date: {
    type: Date,
    default: Date.now,
    required: true
  },
  exit_date: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Completed'],
    default: 'Active'
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

// Create a compound index for student_id and group_id to ensure uniqueness
StudentGroupSchema.index({ student_id: 1, group_id: 1 }, { unique: true });

module.exports = mongoose.model('StudentGroup', StudentGroupSchema);
