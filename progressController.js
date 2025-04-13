const StudentProgress = require('../models/StudentProgress');

// @desc    Get all student progress records
// @route   GET /api/progress
// @access  Private
exports.getAllProgress = async (req, res) => {
  try {
    const progress = await StudentProgress.find()
      .populate('student_id', 'first_name last_name email')
      .populate('module_id', 'title difficulty_level');
    
    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress
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

// @desc    Get progress records for a specific student
// @route   GET /api/progress/student/:studentId
// @access  Private
exports.getStudentProgress = async (req, res) => {
  try {
    const progress = await StudentProgress.find({ student_id: req.params.studentId })
      .populate('module_id', 'title difficulty_level objectives');
    
    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress
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

// @desc    Get progress records for a specific module
// @route   GET /api/progress/module/:moduleId
// @access  Private
exports.getModuleProgress = async (req, res) => {
  try {
    const progress = await StudentProgress.find({ module_id: req.params.moduleId })
      .populate('student_id', 'first_name last_name email');
    
    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress
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

// @desc    Get single progress record
// @route   GET /api/progress/:id
// @access  Private
exports.getProgress = async (req, res) => {
  try {
    const progress = await StudentProgress.findById(req.params.id)
      .populate('student_id', 'first_name last_name email')
      .populate('module_id', 'title difficulty_level objectives');
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: progress
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

// @desc    Create progress record
// @route   POST /api/progress
// @access  Private
exports.createProgress = async (req, res) => {
  try {
    // Check if progress record already exists for this student and module
    const existingProgress = await StudentProgress.findOne({
      student_id: req.body.student_id,
      module_id: req.body.module_id
    });
    
    if (existingProgress) {
      return res.status(400).json({
        success: false,
        message: 'Progress record already exists for this student and module'
      });
    }
    
    const progress = await StudentProgress.create(req.body);
    
    res.status(201).json({
      success: true,
      data: progress
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

// @desc    Update progress record
// @route   PUT /api/progress/:id
// @access  Private
exports.updateProgress = async (req, res) => {
  try {
    const progress = await StudentProgress.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: progress
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

// @desc    Delete progress record
// @route   DELETE /api/progress/:id
// @access  Private
exports.deleteProgress = async (req, res) => {
  try {
    const progress = await StudentProgress.findById(req.params.id);
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress record not found'
      });
    }
    
    await progress.remove();
    
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
