const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssignmentSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  module_id: {
    type: Schema.Types.ObjectId,
    ref: 'LearningModule'
  },
  group_id: {
    type: Schema.Types.ObjectId,
    ref: 'Group'
  },
  due_date: {
    type: Date,
    required: true
  },
  points_possible: {
    type: Number,
    default: 100
  },
  submission_type: {
    type: String,
    enum: ['Text', 'File', 'Link', 'Multiple'],
    default: 'Text'
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher',
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

module.exports = mongoose.model('Assignment', AssignmentSchema);
