import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, InputGroup, Tab, Nav, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TeacherGroupDetail = () => {
  const { id } = useParams();
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for group details - in a real app, this would come from API calls
  const group = {
    id: 1, 
    name: 'Math Group A', 
    description: 'Advanced algebra and calculus concepts',
    location: 'Room 101',
    meetingDays: 'Monday, Wednesday',
    meetingTime: '10:00 AM - 11:30 AM',
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    status: 'Active',
    students: 18,
    nextLesson: '2025-04-10',
    completedLessons: 12,
    totalLessons: 24,
    averageAttendance: 92,
    learningModules: [
      { id: 1, title: 'Algebra Fundamentals', progress: 100, status: 'Completed' },
      { id: 2, title: 'Linear Equations', progress: 100, status: 'Completed' },
      { id: 3, title: 'Quadratic Equations', progress: 75, status: 'In Progress' },
      { id: 4, title: 'Functions and Graphs', progress: 0, status: 'Not Started' }
    ]
  };
  
  const students = [
    { id: 1, name: 'John Smith', email: 'john.smith@example.com', attendance: 95, progress: 85, lastAttended: '2025-04-07' },
    { id: 2, name: 'Emily Johnson', email: 'emily.johnson@example.com', attendance: 88, progress: 92, lastAttended: '2025-04-07' },
    { id: 3, name: 'Michael Brown', email: 'michael.brown@example.com', attendance: 100, progress: 78, lastAttended: '2025-04-07' },
    { id: 4, name: 'Sarah Davis', email: 'sarah.davis@example.com', attendance: 92, progress: 88, lastAttended: '2025-04-07' },
    { id: 5, name: 'David Wilson', email: 'david.wilson@example.com', attendance: 75, progress: 65, lastAttended: '2025-04-05' }
  ];
  
  const lessons = [
    { id: 1, title: 'Introduction to Algebra', date: '2025-01-20', status: 'Completed', attendance: 95 },
    { id: 2, title: 'Variables and Constants', date: '2025-01-27', status: 'Completed', attendance: 90 },
    { id: 3, title: 'Linear Equations I', date: '2025-02-03', status: 'Completed', attendance: 92 },
    { id: 4, title: 'Linear Equations II', date: '2025-02-10', status: 'Completed', attendance: 88 },
    { id: 5, title: 'Quadratic Equations I', date: '2025-04-10', status: 'Upcoming', attendance: null }
  ];
  
  const assignments = [
    { id: 1, title: 'Algebra Basics Quiz', dueDate: '2025-02-05', status: 'Completed', submissions: 18, averageScore: 85 },
    { id: 2, title: 'Linear Equations Homework', dueDate: '2025-02-15', status: 'Completed', submissions: 18, averageScore: 92 },
    { id: 3, title: 'Quadratic Equations Worksheet', dueDate: '2025-04-15', status: 'Active', submissions: 5, averageScore: null },
    { id: 4, title: 'Mid-term Assessment', dueDate: '2025-04-20', status: 'Active', submissions: 0, averageScore: null }
  ];

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <Link to="/teacher/groups" className="me-3">
              <Button variant="outline-secondary" size="sm">
                <i className="bi bi-arrow-left"></i> Back to Groups
              </Button>
            </Link>
            <h2 className="mb-0">{group.name}</h2>
            <Badge 
              bg={
                group.status === 'Active' ? 'success' :
                group.status === 'Completed' ? 'secondary' : 'warning'
              }
              className="ms-3"
            >
              {group.status}
            </Badge>
          </div>
          <p className="text-muted mt-2">{group.description}</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary">
            <i className="bi bi-pencil me-2"></i>
            Edit Group
          </Button>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Nav variant="tabs" className="mb-3" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Nav.Item>
                  <Nav.Link eventKey="overview">Overview</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="students">Students</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="lessons">Lessons</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="assignments">Assignments</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="modules">Learning Modules</Nav.Link>
                </Nav.Item>
              </Nav>
              
              {activeTab === 'overview' && (
                <div>
                  <Row>
                    <Col md={6}>
                      <Card className="mb-4">
                        <Card.Header>
                          <h5 className="mb-0">Group Information</h5>
                        </Card.Header>
                        <Card.Body>
                          <Table borderless>
                            <tbody>
                              <tr>
                                <th style={{ width: '30%' }}>Location</th>
                                <td>{group.location}</td>
                              </tr>
                              <tr>
                                <th>Meeting Schedule</th>
                                <td>{group.meetingDays}<br />{group.meetingTime}</td>
                              </tr>
                              <tr>
                                <th>Duration</th>
                                <td>{group.startDate} to {group.endDate}</td>
                              </tr>
                              <tr>
                                <th>Students</th>
                                <td>{group.students}</td>
                              </tr>
                              <tr>
                                <th>Next Lesson</th>
                                <td>{group.nextLesson}</td>
                              </tr>
                              <tr>
                                <th>Progress</th>
                                <td>
                                  {group.completedLessons} of {group.totalLessons} lessons
                                  <div className="progress mt-1" style={{ height: '6px' }}>
                                    <div 
                                      className="progress-bar" 
                                      role="progressbar" 
                                      style={{ width: `${(group.completedLessons / group.totalLessons) * 100}%` }} 
                                      aria-valuenow={(group.completedLessons / group.totalLessons) * 100} 
                                      aria-valuemin="0" 
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <th>Average Attendance</th>
                                <td>{group.averageAttendance}%</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col md={6}>
                      <Card className="mb-4">
                        <Card.Header>
                          <h5 className="mb-0">Quick Actions</h5>
                        </Card.Header>
                        <Card.Body>
                          <div className="d-grid gap-2">
                            <Button variant="outline-primary">
                              <i className="bi bi-calendar-plus me-2"></i>
                              Schedule New Lesson
                            </Button>
                            <Button variant="outline-primary">
                              <i className="bi bi-file-earmark-plus me-2"></i>
                              Create Assignment
                            </Button>
                            <Button variant="outline-primary">
                              <i className="bi bi-person-plus me-2"></i>
                              Add Students
                            </Button>
                            <Button variant="outline-primary">
                              <i className="bi bi-chat-dots me-2"></i>
                              Send Group Message
                            </Button>
                            <Button variant="outline-primary">
                              <i className="bi bi-file-earmark-bar-graph me-2"></i>
                              Generate Progress Report
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                      
                      <Card>
                        <Card.Header>
                          <h5 className="mb-0">Upcoming Activities</h5>
                        </Card.Header>
                        <Card.Body>
                          <div className="mb-3 pb-2 border-bottom">
                            <div className="d-flex justify-content-between">
                              <h6>Quadratic Equations I</h6>
                              <Badge bg="info">Lesson</Badge>
                            </div>
                            <small className="text-muted">April 10, 2025 • 10:00 AM</small>
                          </div>
                          <div className="mb-3 pb-2 border-bottom">
                            <div className="d-flex justify-content-between">
                              <h6>Quadratic Equations Worksheet</h6>
                              <Badge bg="warning">Due</Badge>
                            </div>
                            <small className="text-muted">April 15, 2025</small>
                          </div>
                          <div>
                            <div className="d-flex justify-content-between">
                              <h6>Mid-term Assessment</h6>
                              <Badge bg="warning">Due</Badge>
                            </div>
                            <small className="text-muted">April 20, 2025</small>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}
              
              {activeTab === 'students' && (
                <div>
                  <div className="d-flex justify-content-between mb-3">
                    <InputGroup className="w-50">
                      <InputGroup.Text>
                        <i className="bi bi-search"></i>
                      </InputGroup.Text>
                      <Form.Control placeholder="Search students..." />
                    </InputGroup>
                    <Button variant="primary">
                      <i className="bi bi-person-plus me-2"></i>
                      Add Student
                    </Button>
                  </div>
                  
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Attendance</th>
                        <th>Progress</th>
                        <th>Last Attended</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => (
                        <tr key={student.id}>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-2">{student.attendance}%</div>
                              <div className="progress flex-grow-1" style={{ height: '6px' }}>
                                <div 
                                  className="progress-bar bg-success" 
                                  role="progressbar" 
                                  style={{ width: `${student.attendance}%` }} 
                                  aria-valuenow={student.attendance} 
                                  aria-valuemin="0" 
                                  aria-valuemax="100"
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-2">{student.progress}%</div>
                              <div className="progress flex-grow-1" style={{ height: '6px' }}>
                                <div 
                                  className="progress-bar" 
                                  role="progressbar" 
                                  style={{ width: `${student.progress}%` }} 
                                  aria-valuenow={student.progress} 
                                  aria-valuemin="0" 
                                  aria-valuemax="100"
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td>{student.lastAttended}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button variant="outline-primary" size="sm">
                                <i className="bi bi-graph-up"></i>
                              </Button>
                              <Button variant="outline-secondary" size="sm">
                                <i className="bi bi-chat-dots"></i>
                              </Button>
                              <Button variant="outline-danger" size="sm">
                                <i className="bi bi-person-dash"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
              
              {activeTab === 'lessons' && (
                <div>
                  <div className="d-flex justify-content-between mb-3">
                    <InputGroup className="w-50">
                      <InputGroup.Text>
                        <i className="bi bi-search"></i>
                      </InputGroup.Text>
                      <Form.Control placeholder="Search lessons..." />
                    </InputGroup>
                    <Button variant="primary">
                      <i className="bi bi-calendar-plus me-2"></i>
                      Schedule Lesson
                    </Button>
                  </div>
                  
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Attendance</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lessons.map(lesson => (
                        <tr key={lesson.id}>
                          <td>{lesson.title}</td>
                          <td>{lesson.date}</td>
                          <td>

(Content truncated due to size limit. Use line ranges to read in chunks)