const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Student = require('../models/Student');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('Student API', () => {
  let token;
  let adminToken;
  let studentId;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/progress_app_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // Clear collections
    await Student.deleteMany({});
    
    // Create test user (teacher role)
    const teacher = await User.create({
      firstName: 'Teacher',
      lastName: 'Test',
      email: 'teacher@example.com',
      password: 'password123',
      role: 'teacher'
    });
    
    // Create test user (admin role)
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'Test',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    
    // Generate tokens
    token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
    
    adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
    
    // Create test student
    const student = await Student.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      dateOfBirth: '2010-01-01',
      grade: '8',
      guardianName: 'Jane Doe',
      guardianContact: '123-456-7890',
      address: '123 Main St',
      interests: ['Math', 'Science'],
      notes: 'Test student'
    });
    
    studentId = student._id;
  });

  afterAll(async () => {
    // Disconnect from test database
    await mongoose.connection.close();
  });

  describe('GET /api/students', () => {
    it('should get all students', async () => {
      const res = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should filter students by name', async () => {
      const res = await request(app)
        .get('/api/students?name=John')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('firstName', 'John');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/students');
      
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/students/:id', () => {
    it('should get a student by ID', async () => {
      const res = await request(app)
        .get(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id', studentId.toString());
      expect(res.body).toHaveProperty('firstName', 'John');
      expect(res.body).toHaveProperty('lastName', 'Doe');
    });

    it('should return 404 for non-existent student', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/students/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Student not found');
    });
  });

  describe('POST /api/students', () => {
    it('should create a new student', async () => {
      const newStudent = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        dateOfBirth: '2011-02-02',
        grade: '7',
        guardianName: 'John Smith',
        guardianContact: '987-654-3210',
        address: '456 Oak St',
        interests: ['Art', 'Music'],
        notes: 'New test student'
      };
      
      const res = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newStudent);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('firstName', 'Jane');
      expect(res.body).toHaveProperty('lastName', 'Smith');
    });

    it('should validate required fields', async () => {
      const invalidStudent = {
        // Missing firstName
        lastName: 'Invalid',
        email: 'invalid@example.com'
      };
      
      const res = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidStudent);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should require admin role', async () => {
      const newStudent = {
        firstName: 'Test',
        lastName: 'Student',
        email: 'test.student@example.com'
      };
      
      const res = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${token}`) // Using teacher token
        .send(newStudent);
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('message', 'Not authorized to perform this action');
    });
  });

  describe('PUT /api/students/:id', () => {
    it('should update a student', async () => {
      const updateData = {
        grade: '9',
        notes: 'Updated test student'
      };
      
      const res = await request(app)
        .put(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id', studentId.toString());
      expect(res.body).toHaveProperty('grade', '9');
      expect(res.body).toHaveProperty('notes', 'Updated test student');
    });

    it('should return 404 for non-existent student', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/students/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ grade: '10' });
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Student not found');
    });
  });

  describe('DELETE /api/students/:id', () => {
    it('should delete a student', async () => {
      // First create a student to delete
      const newStudent = await Student.create({
        firstName: 'Delete',
        lastName: 'Me',
        email: 'delete.me@example.com',
        grade: '6'
      });
      
      const res = await request(app)
        .delete(`/api/students/${newStudent._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Student removed');
      
      // Verify student was deleted
      const deletedStudent = await Student.findById(newStudent._id);
      expect(deletedStudent).toBeNull();
    });

    it('should return 404 for non-existent student', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/students/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Student not found');
    });

    it('should require admin role', async () => {
      const res = await request(app)
        .delete(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${token}`); // Using teacher token
      
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('message', 'Not authorized to perform this action');
    });
  });
});
