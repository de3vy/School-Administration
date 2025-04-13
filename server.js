const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/progress_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const groupRoutes = require('./routes/groups');
const teacherRoutes = require('./routes/teachers');
const volunteerRoutes = require('./routes/volunteers');
const locationRoutes = require('./routes/locations');
const activityRoutes = require('./routes/activities');
const moduleRoutes = require('./routes/modules');
const progressRoutes = require('./routes/progress');
const assignmentRoutes = require('./routes/assignments');
const resourceRoutes = require('./routes/resources');
const lessonRoutes = require('./routes/lessons');
const volunteerLogRoutes = require('./routes/volunteerLogs');
const communicationRoutes = require('./routes/communications');
const attendanceRoutes = require('./routes/attendance');
const feedbackRoutes = require('./routes/feedback');
const reportRoutes = require('./routes/reports');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/volunteer-logs', volunteerLogRoutes);
app.use('/api/communications', communicationRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/reports', reportRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Progress & Activity Reporting API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
