const Attendance = require('../models/Attendance');
const Lesson = require('../models/Lesson');
const Student = require('../models/Student');
const StudentGroup = require('../models/StudentGroup');

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private
exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('lesson_id', 'title date')
      .populate('student_id', 'first_name last_name');
    
    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
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

// @desc    Get attendance records for a specific lesson
// @route   GET /api/attendance/lesson/:lessonId
// @access  Private
exports.getLessonAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ lesson_id: req.params.lessonId })
      .populate('student_id', 'first_name last_name email');
    
    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
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

// @desc    Get attendance records for a specific student
// @route   GET /api/attendance/student/:studentId
// @access  Private
exports.getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ student_id: req.params.studentId })
      .populate('lesson_id', 'title date start_time end_time group_id');
    
    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
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

// @desc    Get single attendance record
// @route   GET /api/attendance/:id
// @access  Private
exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('lesson_id', 'title date start_time end_time')
      .populate('student_id', 'first_name last_name email');
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: attendance
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

// @desc    Create attendance record
// @route   POST /api/attendance
// @access  Private
exports.createAttendance = async (req, res) => {
  try {
    // Check if attendance record already exists for this student and lesson
    const existingAttendance = await Attendance.findOne({
      student_id: req.body.student_id,
      lesson_id: req.body.lesson_id
    });
    
    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance record already exists for this student and lesson'
      });
    }
    
    const attendance = await Attendance.create(req.body);
    
    res.status(201).json({
      success: true,
      data: attendance
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

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private
exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: attendance
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

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }
    
    await attendance.remove();
    
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

// @desc    Create attendance records for all students in a group for a lesson
// @route   POST /api/attendance/lesson/:lessonId/group/:groupId
// @access  Private
exports.createGroupAttendance = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    // Get all students in the group
    const studentGroups = await StudentGroup.find({ 
      group_id: req.params.groupId,
      status: 'Active'
    });
    
    if (studentGroups.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active students found in this group'
      });
    }
    
    const studentIds = studentGroups.map(sg => sg.student_id);
    
    // Create attendance records for each student
    const attendanceRecords = [];
    const defaultStatus = req.body.defaultStatus || 'Present';
    
    for (const studentId of studentIds) {
      // Check if attendance record already exists
      const existingAttendance = await Attendance.findOne({
        student_id: studentId,
        lesson_id: req.params.lessonId
      });
      
      if (!existingAttendance) {
        const attendance = await Attendance.create({
          lesson_id: req.params.lessonId,
          student_id: studentId,
          status: defaultStatus
        });
        
        attendanceRecords.push(attendance);
      }
    }
    
    res.status(201).json({
      success: true,
      count: attendanceRecords.length,
      data: attendanceRecords
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
