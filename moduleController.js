const LearningModule = require('../models/LearningModule');

// @desc    Get all learning modules
// @route   GET /api/modules
// @access  Private
exports.getModules = async (req, res) => {
  try {
    const modules = await LearningModule.find();
    
    res.status(200).json({
      success: true,
      count: modules.length,
      data: modules
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// @desc    Get single learning module
// @route   GET /api/modules/:id
// @access  Private
exports.getModule = async (req, res) => {
  try {
    const module = await LearningModule.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Learning module not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: module
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// @desc    Create learning module
// @route   POST /api/modules
// @access  Private
exports.createModule = async (req, res) => {
  try {
    const module = await LearningModule.create(req.body);
    
    res.status(201).json({
      success: true,
      data: module
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// @desc    Update learning module
// @route   PUT /api/modules/:id
// @access  Private
exports.updateModule = async (req, res) => {
  try {
    const module = await LearningModule.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Learning module not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: module
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// @desc    Delete learning module
// @route   DELETE /api/modules/:id
// @access  Private
exports.deleteModule = async (req, res) => {
  try {
    const module = await LearningModule.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Learning module not found'
      });
    }
    
    await module.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};
