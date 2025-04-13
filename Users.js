import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, InputGroup, Tab, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminUsers = () => {
  const { userProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [userType, setUserType] = useState('all');
  
  // Mock data for users - in a real app, this would come from API calls
  const users = [
    { 
      id: 1, 
      firstName: 'John', 
      lastName: 'Smith',
      email: 'john.smith@example.com',
      role: 'student',
      status: 'active',
      lastLogin: '2025-04-07 10:23 AM',
      createdAt: '2025-01-15'
    },
    { 
      id: 2, 
      firstName: 'Emily', 
      lastName: 'Johnson',
      email: 'emily.johnson@example.com',
      role: 'student',
      status: 'active',
      lastLogin: '2025-04-08 09:15 AM',
      createdAt: '2025-01-20'
    },
    { 
      id: 3, 
      firstName: 'Michael', 
      lastName: 'Davis',
      email: 'michael.davis@example.com',
      role: 'teacher',
      status: 'active',
      lastLogin: '2025-04-08 08:45 AM',
      createdAt: '2025-01-10'
    },
    { 
      id: 4, 
      firstName: 'Sarah', 
      lastName: 'Wilson',
      email: 'sarah.wilson@example.com',
      role: 'teacher',
      status: 'active',
      lastLogin: '2025-04-07 03:30 PM',
      createdAt: '2025-01-05'
    },
    { 
      id: 5, 
      firstName: 'Robert', 
      lastName: 'Brown',
      email: 'robert.brown@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-04-08 11:10 AM',
      createdAt: '2025-01-01'
    },
    { 
      id: 6, 
      firstName: 'Jennifer', 
      lastName: 'Miller',
      email: 'jennifer.miller@example.com',
      role: 'volunteer',
      status: 'active',
      lastLogin: '2025-04-06 02:45 PM',
      createdAt: '2025-02-15'
    },
    { 
      id: 7, 
      firstName: 'David', 
      lastName: 'Anderson',
      email: 'david.anderson@example.com',
      role: 'student',
      status: 'inactive',
      lastLogin: '2025-03-15 11:30 AM',
      createdAt: '2025-01-25'
    }
  ];
  
  // Filter users based on search term and user type
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = userType === 'all' || user.role === userType;
    
    return matchesSearch && matchesType;
  });
  
  // Count users by role
  const studentCount = users.filter(user => user.role === 'student').length;
  const teacherCount = users.filter(user => user.role === 'teacher').length;
  const adminCount = users.filter(user => user.role === 'admin').length;
  const volunteerCount = users.filter(user => user.role === 'volunteer').length;

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>User Management</h2>
          <p>Manage all users in the system.</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary">
            <i className="bi bi-person-plus me-2"></i>
            Add New User
          </Button>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="h-100 dashboard-card text-center">
            <Card.Body>
              <h2 className="display-4">{studentCount}</h2>
              <p className="text-muted mb-0">Students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 dashboard-card text-center">
            <Card.Body>
              <h2 className="display-4">{teacherCount}</h2>
              <p className="text-muted mb-0">Teachers</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 dashboard-card text-center">
            <Card.Body>
              <h2 className="display-4">{adminCount}</h2>
              <p className="text-muted mb-0">Administrators</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 dashboard-card text-center">
            <Card.Body>
              <h2 className="display-4">{volunteerCount}</h2>
              <p className="text-muted mb-0">Volunteers</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button 
                variant="outline-secondary" 
                onClick={() => setSearchTerm('')}
              >
                Clear
              </Button>
            )}
          </InputGroup>
        </Col>
        <Col md={6} className="d-flex justify-content-md-end mt-3 mt-md-0">
          <Form.Group>
            <InputGroup>
              <InputGroup.Text>User Type</InputGroup.Text>
              <Form.Select 
                value={userType} 
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="all">All Users</option>
                <option value="student">Students</option>
                <option value="teacher">Teachers</option>
                <option value="admin">Administrators</option>
                <option value="volunteer">Volunteers</option>
              </Form.Select>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card>
            <Card.Body>
              {filteredUsers.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Last Login</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>
                          <Badge bg={
                            user.role === 'admin' ? 'danger' :
                            user.role === 'teacher' ? 'primary' :
                            user.role === 'student' ? 'success' : 'info'
                          }>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={user.status === 'active' ? 'success' : 'secondary'}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                        </td>
                        <td>{user.lastLogin}</td>
                        <td>{user.createdAt}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button variant="outline-primary" size="sm">
                              <i className="bi bi-eye"></i>
                            </Button>
                            <Button variant="outline-secondary" size="sm">
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button variant="outline-danger" size="sm">
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-search fs-1 text-muted mb-3"></i>
                  <h4>No Users Found</h4>
                  <p className="text-muted">
                    {searchTerm 
                      ? `No users match your search term "${searchTerm}"`
                      : `No users with role "${userType}"`}
                  </p>
                  <div className="d-flex gap-2 justify-content-center">
                    {searchTerm && (
                      <Button variant="outline-primary" onClick={() => setSearchTerm('')}>
                        Clear Search
                      </Button>
                    )}
                    {userType !== 'all' && (
                      <Button variant="outline-primary" onClick={() => setUserType('all')}>
                        Show All Users
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminUsers;
