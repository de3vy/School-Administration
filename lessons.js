const express = require('express');
const router = express.Router();
const { 
  getLessons, 
  getGroupLessons, 
  getTeacherLessons, 
  getLesson, 
  createLesson, 
  updateLesson, 
  deleteLesson 
} = require('../controllers/lessonController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Routes with specific authorization
router.route('/')
  .get(authorize('student', 'teacher', 'admin'), getLessons)
  .post(authorize('teacher', 'admin'), createLesson);

router.route('/group/:groupId')
  .get(authorize('student', 'teacher', 'admin'), getGroupLessons);

router.route('/teacher/:teacherId')
  .get(authorize('teacher', 'admin'), getTeacherLessons);

router.route('/:id')
  .get(authorize('student', 'teacher', 'admin'), getLesson)
  .put(authorize('teacher', 'admin'), updateLesson)
  .delete(authorize('admin'), deleteLesson);

module.exports = router;
