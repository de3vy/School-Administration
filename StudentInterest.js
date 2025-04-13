const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentInterestSchema = new Schema({
  student_id: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  lesson_id: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  interest_level: {
    type: String,
    enum: ['Very Interested', 'Interested', 'Somewhat Interested'],
    default: 'Interested'
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

// Create a compound index for student_id and lesson_id to ensure uniqueness
StudentInterestSchema.index({ student_id: 1, lesson_id: 1 }, { unique: true });

module.exports = mongoose.model('StudentInterest', StudentInterestSchema);
