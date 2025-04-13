const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['Document', 'Video', 'Audio', 'Link', 'Other'],
    default: 'Document'
  },
  url: {
    type: String,
    trim: true
  },
  file_path: {
    type: String,
    trim: true
  },
  module_id: {
    type: Schema.Types.ObjectId,
    ref: 'LearningModule'
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher'
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

module.exports = mongoose.model('Resource', ResourceSchema);
