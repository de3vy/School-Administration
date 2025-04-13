const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommunicationLogSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  sender_type: {
    type: String,
    enum: ['Student', 'Teacher', 'Volunteer', 'Admin'],
    required: true
  },
  sender_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  recipient_type: {
    type: String,
    enum: ['Student', 'Teacher', 'Volunteer', 'Admin', 'Group'],
    required: true
  },
  recipient_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Sent', 'Delivered', 'Read'],
    default: 'Sent'
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

module.exports = mongoose.model('CommunicationLog', CommunicationLogSchema);
