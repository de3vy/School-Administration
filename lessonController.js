const Lesson = require('../models/Lesson');

// @desc    Get all lessons
// @route   GET /api/lessons
// @access  Private
exports.getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find()
      .populate('group_id', 'name')
      .populate('teacher_id', 'first_name last_name')
      .populate('location_id', 'name address')
      .populate('module_id', 'title');
    
    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons
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

// @desc    Get lessons for a specific group
// @route   GET /api/lessons/group/:groupId
// @access  Private
exports.getGroupLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ group_id: req.params.groupId })
      .populate('teacher_id', 'first_name last_name')
      .populate('location_id', 'name address')
      .populate('module_id', 'title');
    
    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons
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

// @desc    Get lessons for a specific teacher
// @route   GET /api/lessons/teacher/:teacherId
// @access  Private
exports.getTeacherLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ teacher_id: req.params.teacherId })
      .populate('group_id', 'name')
      .populate('location_id', 'name address')
      .populate('module_id', 'title');
    
    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons
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

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Private
exports.getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('group_id', 'name')
      .populate('teacher_id', 'first_name last_name')
      .populate('location_id', 'name address')
      .populate('module_id', 'title objectives')
      .populate('activities')
      .populate('resources');
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: lesson
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

// @desc    Create lesson
// @route   POST /api/lessons
// @access  Private
exports.createLesson = async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    
    res.status(201).json({
      success: true,
      data: lesson
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

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private
exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: lesson
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

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    await lesson.remove();
    
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
