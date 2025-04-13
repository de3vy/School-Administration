const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VolunteerLogSchema = new Schema({
  volunteer_id: {
    type: Schema.Types.ObjectId,
    ref: 'Volunteer',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  hours: {
    type: Number,
    required: true,
    min: 0
  },
  activity_description: {
    type: String,
    required: true
  },
  group_id: {
    type: Schema.Types.ObjectId,
    ref: 'Group'
  },
  location_id: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
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

module.exports = mongoose.model('VolunteerLog', VolunteerLogSchema);
