import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Navbar, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

// Navigation configurations for different user roles
const navigationConfig = {
  student: [
    { path: '/student/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/student/profile', label: 'My Profile', icon: 'bi-person' },
    { path: '/student/groups', label: 'My Groups', icon: 'bi-people' },
    { path: '/student/learning-journey', label: 'Learning Journey', icon: 'bi-map' },
    { path: '/student/progress', label: 'My Progress', icon: 'bi-graph-up' },
    { path: '/student/attendance', label: 'Attendance', icon: 'bi-calendar-check' },
    { path: '/student/assignments', label: 'Assignments', icon: 'bi-file-earmark-text' },
    { path: '/student/interests', label: 'My Interests', icon: 'bi-star' },
    { path: '/student/communication', label: 'Communication', icon: 'bi-chat-dots' }
  ],
  teacher: [
    { path: '/teacher/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/teacher/groups', label: 'My Groups', icon: 'bi-people' },
    { path: '/teacher/lessons', label: 'Lessons', icon: 'bi-book' },
    { path: '/teacher/assignments', label: 'Assignments', icon: 'bi-file-earmark-text' },
    { path: '/teacher/student-progress', label: 'Student Progress', icon: 'bi-graph-up' },
    { path: '/teacher/communication', label: 'Communication', icon: 'bi-chat-dots' },
    { path: '/teacher/reports', label: 'Reports', icon: 'bi-file-earmark-bar-graph' }
  ],
  admin: [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/admin/users', label: 'User Management', icon: 'bi-people' },
    { path: '/admin/students', label: 'Students', icon: 'bi-person-badge' },
    { path: '/admin/teachers', label: 'Teachers', icon: 'bi-person-workspace' },
    { path: '/admin/volunteers', label: 'Volunteers', icon: 'bi-person-heart' },
    { path: '/admin/groups', label: 'Groups', icon: 'bi-collection' },
    { path: '/admin/locations', label: 'Locations', icon: 'bi-geo-alt' },
    { path: '/admin/modules', label: 'Learning Modules', icon: 'bi-book' },
    { path: '/admin/reports', label: 'Reports', icon: 'bi-file-earmark-bar-graph' },
    { path: '/admin/settings', label: 'System Settings', icon: 'bi-gear' }
  ]
};

const MainLayout = ({ userRole }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const navigation = navigationConfig[userRole] || [];
  
  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className={sidebarCollapsed ? 'd-none' : ''}>Progress App</h4>
          <Button 
            variant="link" 
            className="text-light p-0" 
            onClick={toggleSidebar}
          >
            <i className={`bi ${sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
          </Button>
        </div>
        
        <Nav className="flex-column">
          {navigation.map((item, index) => (
            <Nav.Link 
              key={index} 
              href={item.path} 
              className="text-light"
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
            >
              <i className={`bi ${item.icon} me-2`}></i>
              <span className={sidebarCollapsed ? 'd-none' : ''}>{item.label}</span>
            </Nav.Link>
          ))}
        </Nav>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Top Navbar */}
        <Navbar bg="primary" variant="dark" className="mb-4">
          <Container fluid>
            <Navbar.Brand>
              {userRole === 'student' && 'Student Portal'}
              {userRole === 'teacher' && 'Teacher Portal'}
              {userRole === 'admin' && 'Admin Portal'}
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text className="me-3">
                Signed in as: <strong>{currentUser?.email}</strong>
              </Navbar.Text>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        
        {/* Page Content */}
        <Container fluid>
          <Row>
            <Col>
              <Outlet />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default MainLayout;
