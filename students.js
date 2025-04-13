const express = require('express');
const router = express.Router();
const { getStudents, getStudent, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes with specific authorization
router.route('/')
  .get(authorize('teacher', 'admin'), getStudents)
  .post(authorize('admin'), createStudent);

router.route('/:id')
  .get(authorize('student', 'teacher', 'admin'), getStudent)
  .put(authorize('admin'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

module.exports = router;
