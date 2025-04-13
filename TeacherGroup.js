const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeacherGroupSchema = new Schema({
  teacher_id: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  group_id: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  role: {
    type: String,
    enum: ['Primary', 'Assistant', 'Substitute'],
    default: 'Primary'
  },
  start_date: {
    type: Date,
    default: Date.now,
    required: true
  },
  end_date: {
    type: Date
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

// Create a compound index for teacher_id and group_id to ensure uniqueness
TeacherGroupSchema.index({ teacher_id: 1, group_id: 1 }, { unique: true });

module.exports = mongoose.model('TeacherGroup', TeacherGroupSchema);
