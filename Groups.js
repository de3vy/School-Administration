import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StudentGroups = () => {
  const { userProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for student groups - in a real app, this would come from API calls
  const myGroups = [
    { 
      id: 1, 
      name: 'Math Group A', 
      description: 'Advanced algebra and calculus concepts',
      teacher: 'Ms. Johnson',
      startDate: '2025-01-15',
      endDate: '2025-06-30',
      status: 'Active',
      location: 'Room 101',
      meetingDays: 'Monday, Wednesday',
      meetingTime: '10:00 AM - 11:30 AM',
      students: 18
    },
    { 
      id: 2, 
      name: 'Science Group B', 
      description: 'Physics and chemistry fundamentals',
      teacher: 'Mr. Smith',
      startDate: '2025-01-15',
      endDate: '2025-06-30',
      status: 'Active',
      location: 'Lab 203',
      meetingDays: 'Tuesday, Thursday',
      meetingTime: '1:30 PM - 3:00 PM',
      students: 15
    },
    { 
      id: 3, 
      name: 'History Group C', 
      description: 'World history and cultural studies',
      teacher: 'Mrs. Williams',
      startDate: '2025-01-15',
      endDate: '2025-06-30',
      status: 'Active',
      location: 'Room 105',
      meetingDays: 'Friday',
      meetingTime: '9:00 AM - 12:00 PM',
      students: 20
    }
  ];
  
  // Filter groups based on search term
  const filteredGroups = myGroups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>My Groups</h2>
          <p>View all the groups you are currently enrolled in.</p>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>
      
      <Row>
        {filteredGroups.length > 0 ? (
          filteredGroups.map(group => (
            <Col md={6} lg={4} className="mb-4" key={group.id}>
              <Card className="h-100 dashboard-card">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{group.name}</h5>
                  <Badge bg={
                    group.status === 'Active' ? 'success' :
                    group.status === 'Completed' ? 'secondary' : 'warning'
                  }>
                    {group.status}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <p>{group.description}</p>
                  <Table borderless size="sm">
                    <tbody>
                      <tr>
                        <th style={{ width: '40%' }}>Teacher</th>
                        <td>{group.teacher}</td>
                      </tr>
                      <tr>
                        <th>Location</th>
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
                    </tbody>
                  </Table>
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                  <div className="d-grid">
                    <Button variant="outline-primary" size="sm">
                      View Group Details
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Card className="text-center p-5">
              <Card.Body>
                <i className="bi bi-search fs-1 text-muted mb-3"></i>
                <h4>No Groups Found</h4>
                <p className="text-muted">
                  {searchTerm 
                    ? `No groups match your search term "${searchTerm}"`
                    : "You are not currently enrolled in any groups"}
                </p>
                {searchTerm && (
                  <Button variant="outline-primary" onClick={() => setSearchTerm('')}>
                    Clear Search
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default StudentGroups;
