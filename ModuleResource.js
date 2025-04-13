const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModuleResourceSchema = new Schema({
  module_id: {
    type: Schema.Types.ObjectId,
    ref: 'LearningModule',
    required: true
  },
  resource_id: {
    type: Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  order: {
    type: Number,
    default: 0
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

// Create a compound index for module_id and resource_id to ensure uniqueness
ModuleResourceSchema.index({ module_id: 1, resource_id: 1 }, { unique: true });

module.exports = mongoose.model('ModuleResource', ModuleResourceSchema);
