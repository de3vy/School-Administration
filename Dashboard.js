import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { userProfile } = useAuth();
  
  // Mock data for dashboard - in a real app, this would come from API calls
  const upcomingAssignments = [
    { id: 1, title: 'Math Quiz', dueDate: '2025-04-15', status: 'Pending' },
    { id: 2, title: 'Science Project', dueDate: '2025-04-20', status: 'In Progress' },
    { id: 3, title: 'History Essay', dueDate: '2025-04-25', status: 'Not Started' }
  ];
  
  const recentAttendance = [
    { id: 1, date: '2025-04-07', status: 'Present', lesson: 'Mathematics' },
    { id: 2, date: '2025-04-06', status: 'Present', lesson: 'Science' },
    { id: 3, date: '2025-04-05', status: 'Absent', lesson: 'History' }
  ];
  
  const moduleProgress = [
    { id: 1, title: 'Algebra Basics', progress: 75, status: 'In Progress' },
    { id: 2, title: 'Scientific Method', progress: 100, status: 'Completed' },
    { id: 3, title: 'World History', progress: 30, status: 'In Progress' }
  ];
  
  const recentCommunications = [
    { id: 1, date: '2025-04-07', from: 'Ms. Johnson', subject: 'Assignment Feedback' },
    { id: 2, date: '2025-04-05', from: 'Mr. Smith', subject: 'Upcoming Field Trip' }
  ];

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Welcome, {userProfile?.first_name || 'Student'}</h2>
          <p>Here's an overview of your academic progress and activities.</p>
        </Col>
      </Row>
      
      <Row>
        {/* Upcoming Assignments */}
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100 dashboard-card">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Upcoming Assignments</h5>
            </Card.Header>
            <Card.Body>
              {upcomingAssignments.length > 0 ? (
                upcomingAssignments.map(assignment => (
                  <div key={assignment.id} className="mb-3 pb-2 border-bottom">
                    <div className="d-flex justify-content-between">
                      <h6>{assignment.title}</h6>
                      <Badge bg={
                        assignment.status === 'Pending' ? 'warning' :
                        assignment.status === 'In Progress' ? 'info' : 'secondary'
                      }>
                        {assignment.status}
                      </Badge>
                    </div>
                    <small className="text-muted">Due: {assignment.dueDate}</small>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">No upcoming assignments</p>
              )}
            </Card.Body>
            <Card.Footer className="bg-white border-0">
              <Link to="/student/assignments">
                <Button variant="outline-primary" size="sm" className="w-100">
                  View All Assignments
                </Button>
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        
        {/* Recent Attendance */}
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100 dashboard-card">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Recent Attendance</h5>
            </Card.Header>
            <Card.Body>
              {recentAttendance.length > 0 ? (
                recentAttendance.map(record => (
                  <div key={record.id} className="mb-3 pb-2 border-bottom">
                    <div className="d-flex justify-content-between">
                      <h6>{record.lesson}</h6>
                      <Badge bg={
                        record.status === 'Present' ? 'success' :
                        record.status === 'Late' ? 'warning' : 'danger'
                      }>
                        {record.status}
                      </Badge>
                    </div>
                    <small className="text-muted">Date: {record.date}</small>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">No recent attendance records</p>
              )}
            </Card.Body>
            <Card.Footer className="bg-white border-0">
              <Link to="/student/attendance">
                <Button variant="outline-success" size="sm" className="w-100">
                  View Attendance History
                </Button>
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        
        {/* Module Progress */}
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100 dashboard-card">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">Learning Progress</h5>
            </Card.Header>
            <Card.Body>
              {moduleProgress.length > 0 ? (
                moduleProgress.map(module => (
                  <div key={module.id} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <h6>{module.title}</h6>
                      <small>{module.progress}%</small>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ width: `${module.progress}%` }} 
                        aria-valuenow={module.progress} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <small className="text-muted">{module.status}</small>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">No modules in progress</p>
              )}
            </Card.Body>
            <Card.Footer className="bg-white border-0">
              <Link to="/student/progress">
                <Button variant="outline-info" size="sm" className="w-100">
                  View Learning Journey
                </Button>
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        
        {/* Recent Communications */}
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100 dashboard-card">
            <Card.Header className="bg-secondary text-white">
              <h5 className="mb-0">Recent Communications</h5>
            </Card.Header>
            <Card.Body>
              {recentCommunications.length > 0 ? (
                recentCommunications.map(message => (
                  <div key={message.id} className="mb-3 pb-2 border-bottom">
                    <h6>{message.subject}</h6>
                    <div className="d-flex justify-content-between">
                      <small>From: {message.from}</small>
                      <small className="text-muted">{message.date}</small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted">No recent communications</p>
              )}
            </Card.Body>
            <Card.Footer className="bg-white border-0">
              <Link to="/student/communication">
                <Button variant="outline-secondary" size="sm" className="w-100">
                  View All Messages
                </Button>
              </Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      
      {/* Quick Links */}
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Links</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col xs={6} md={3} className="mb-2">
                  <Link to="/student/profile">
                    <Button variant="light" className="w-100 py-3">
                      <i className="bi bi-person fs-4 d-block mb-2"></i>
                      My Profile
                    </Button>
                  </Link>
                </Col>
                <Col xs={6} md={3} className="mb-2">
                  <Link to="/student/groups">
                    <Button variant="light" className="w-100 py-3">
                      <i className="bi bi-people fs-4 d-block mb-2"></i>
                      My Groups
                    </Button>
                  </Link>
                </Col>
                <Col xs={6} md={3} className="mb-2">
                  <Link to="/student/assignments">
                    <Button variant="light" className="w-100 py-3">
                      <i className="bi bi-file-earmark-text fs-4 d-block mb-2"></i>
                      Assignments
                    </Button>
                  </Link>
                </Col>
                <Col xs={6} md={3} className="mb-2">
                  <Link to="/student/interests">
                    <Button variant="light" className="w-100 py-3">
                      <i className="bi bi-star fs-4 d-block mb-2"></i>
                      My Interests
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDashboard;
