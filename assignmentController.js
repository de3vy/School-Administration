const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('module_id', 'title')
      .populate('group_id', 'name')
      .populate('created_by', 'first_name last_name');
    
    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
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

// @desc    Get assignments for a specific group
// @route   GET /api/assignments/group/:groupId
// @access  Private
exports.getGroupAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ group_id: req.params.groupId })
      .populate('module_id', 'title')
      .populate('created_by', 'first_name last_name');
    
    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
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

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private
exports.getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('module_id', 'title objectives')
      .populate('group_id', 'name')
      .populate('created_by', 'first_name last_name');
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: assignment
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

// @desc    Create assignment
// @route   POST /api/assignments
// @access  Private
exports.createAssignment = async (req, res) => {
  try {
    // Add the current user as the creator
    req.body.created_by = req.user.profile_id;
    
    const assignment = await Assignment.create(req.body);
    
    res.status(201).json({
      success: true,
      data: assignment
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

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private
exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: assignment
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

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }
    
    // Check if the user is the creator of the assignment or an admin
    if (req.user.role !== 'admin' && 
        assignment.created_by.toString() !== req.user.profile_id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this assignment'
      });
    }
    
    await assignment.remove();
    
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

// @desc    Get all submissions for an assignment
// @route   GET /api/assignments/:id/submissions
// @access  Private
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const submissions = await AssignmentSubmission.find({ assignment_id: req.params.id })
      .populate('student_id', 'first_name last_name email')
      .populate('graded_by', 'first_name last_name');
    
    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
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

// @desc    Submit assignment
// @route   POST /api/assignments/:id/submit
// @access  Private (Student only)
exports.submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }
    
    // Check if student has already submitted
    const existingSubmission = await AssignmentSubmission.findOne({
      assignment_id: req.params.id,
      student_id: req.user.profile_id
    });
    
    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted this assignment'
      });
    }
    
    // Create submission
    const submission = await AssignmentSubmission.create({
      assignment_id: req.params.id,
      student_id: req.user.profile_id,
      content: req.body.content,
      file_path: req.body.file_path,
      url: req.body.url,
      status: 'Submitted'
    });
    
    res.status(201).json({
      success: true,
      data: submission
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

// @desc    Grade assignment submission
// @route   PUT /api/assignments/submissions/:id/grade
// @access  Private (Teacher, Admin)
exports.gradeSubmission = async (req, res) => {
  try {
    const submission = await AssignmentSubmission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    // Update submission with grade
    submission.grade = req.body.grade;
    submission.feedback = req.body.feedback;
    submission.graded_by = req.user.profile_id;
    submission.graded_date = Date.now();
    submission.status = 'Graded';
    
    await submission.save();
    
    res.status(200).json({
      success: true,
      data: submission
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
