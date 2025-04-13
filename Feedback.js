const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
  source_type: {
    type: String,
    enum: ['Student', 'Teacher', 'Volunteer', 'Admin'],
    required: true
  },
  source_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  target_type: {
    type: String,
    enum: ['Lesson', 'Module', 'Assignment', 'Teacher', 'Group'],
    required: true
  },
  target_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comments: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
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

module.exports = mongoose.model('Feedback', FeedbackSchema);
