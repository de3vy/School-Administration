const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
  lesson_id: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  student_id: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Excused'],
    default: 'Present',
    required: true
  },
  arrival_time: {
    type: String
  },
  departure_time: {
    type: String
  },
  notes: {
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

// Virtual fields for calculated properties
AttendanceSchema.virtual('is_present').get(function() {
  return this.status === 'Present';
});

AttendanceSchema.virtual('is_absent').get(function() {
  return this.status === 'Absent';
});

// Ensure virtuals are included in JSON output
AttendanceSchema.set('toJSON', { virtuals: true });
AttendanceSchema.set('toObject', { virtuals: true });

// Create a compound index for lesson_id and student_id to ensure uniqueness
AttendanceSchema.index({ lesson_id: 1, student_id: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
