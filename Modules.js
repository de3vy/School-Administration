import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, InputGroup, Tab, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminModules = () => {
  const { userProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Mock data for learning modules - in a real app, this would come from API calls
  const modules = [
    { 
      id: 1, 
      title: 'Algebra Fundamentals', 
      description: 'Fundamental concepts of algebra including variables, equations, and functions',
      subject: 'Mathematics',
      level: 'Intermediate',
      status: 'Active',
      enrolledStudents: 45,
      completionRate: 85,
      averageScore: 88,
      createdBy: 'Michael Davis',
      createdAt: '2025-01-10'
    },
    { 
      id: 2, 
      title: 'Scientific Method', 
      description: 'Understanding the process of scientific inquiry and experimentation',
      subject: 'Science',
      level: 'Intermediate',
      status: 'Active',
      enrolledStudents: 38,
      completionRate: 72,
      averageScore: 84,
      createdBy: 'Sarah Wilson',
      createdAt: '2025-01-15'
    },
    { 
      id: 3, 
      title: 'World History Overview', 
      description: 'Overview of major historical events and civilizations',
      subject: 'History',
      level: 'Advanced',
      status: 'Active',
      enrolledStudents: 32,
      completionRate: 65,
      averageScore: 79,
      createdBy: 'Sarah Wilson',
      createdAt: '2025-01-20'
    },
    { 
      id: 4, 
      title: 'English Literature', 
      description: 'Analysis of classic and contemporary literary works',
      subject: 'English',
      level: 'Advanced',
      status: 'Active',
      enrolledStudents: 28,
      completionRate: 60,
      averageScore: 82,
      createdBy: 'Michael Davis',
      createdAt: '2025-01-25'
    },
    { 
      id: 5, 
      title: 'Basic Arithmetic', 
      description: 'Fundamental arithmetic operations and number sense',
      subject: 'Mathematics',
      level: 'Beginner',
      status: 'Draft',
      enrolledStudents: 0,
      completionRate: 0,
      averageScore: 0,
      createdBy: 'Michael Davis',
      createdAt: '2025-04-01'
    }
  ];
  
  // Filter modules based on search term and filter
  const filteredModules = modules.filter(module => {
    const matchesSearch = 
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || module.status.toLowerCase() === filter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });
  
  // Chart data for subject distribution
  const subjectData = {
    labels: ['Mathematics', 'Science', 'History', 'English'],
    datasets: [
      {
        label: 'Modules by Subject',
        data: [
          modules.filter(m => m.subject === 'Mathematics').length,
          modules.filter(m => m.subject === 'Science').length,
          modules.filter(m => m.subject === 'History').length,
          modules.filter(m => m.subject === 'English').length
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Chart data for level distribution
  const levelData = {
    labels: ['Beginner', 'Intermediate', 'Advanced'],
    datasets: [
      {
        label: 'Modules by Level',
        data: [
          modules.filter(m => m.level === 'Beginner').length,
          modules.filter(m => m.level === 'Intermediate').length,
          modules.filter(m => m.level === 'Advanced').length
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Learning Modules</h2>
          <p>Manage all learning modules in the system.</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary">
            <i className="bi bi-plus-circle me-2"></i>
            Create New Module
          </Button>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={6} className="mb-4">
          <Card className="h-100 dashboard-card">
            <Card.Header>
              <h5 className="mb-0">Modules by Subject</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '250px', position: 'relative' }}>
                <Pie data={subjectData} options={{ maintainAspectRatio: false }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="h-100 dashboard-card">
            <Card.Header>
              <h5 className="mb-0">Modules by Level</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '250px', position: 'relative' }}>
                <Pie data={levelData} options={{ maintainAspectRatio: false }} />
              </div>
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
              placeholder="Search modules..."
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
              <InputGroup.Text>Status</InputGroup.Text>
              <Form.Select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Modules</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </Form.Select>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card>
            <Card.Body>
              {filteredModules.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Subject</th>
                      <th>Level</th>
                      <th>Status</th>
                      <th>Enrolled</th>
                      <th>Completion</th>
                      <th>Avg. Score</th>
                      <th>Created By</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredModules.map(module => (
                      <tr key={module.id}>
                        <td>
                          <div className="fw-bold">{module.title}</div>
                          <small className="text-muted text-truncate-2">{module.description}</small>
                        </td>
                        <td>{module.subject}</td>
                        <td>{module.level}</td>
                        <td>
                          <Badge bg={
                            module.status === 'Active' ? 'success' :
                            module.status === 'Draft' ? 'warning' : 'secondary'
                          }>
                            {module.status}
                          </Badge>
                        </td>
                        <td>{module.enrolledStudents}</td>
                        <td>
                          {module.status === 'Active' ? (
                            <div className="d-flex align-items-center">
                              <div className="me-2">{module.completionRate}%</div>
                              <div className="progress flex-grow-1" style={{ height: '6px' }}>
                                <div 
                                  className="progress-bar" 
                                  role="progressbar" 
                                  style={{ width: `${module.completionRate}%` }} 
                                  aria-valuenow={module.completionRate} 
                                  aria-valuemin="0" 
                                  aria-valuemax="100"
                                ></div>
                              </div>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>
                          {module.status === 'Active' && module.averageScore > 0 ? (
                            <span className={
                              module.averageScore >= 90 ? 'text-success' :
                              module.averageScore >= 70 ? 'text-info' :
                              module.averageScore >= 60 ? 'text-warning' : 'text-danger'
                            }>
                              {module.averageScore}%
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>{module.createdBy}<br /><small className="text-muted">{module.createdAt}</small></td>
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
                  <h4>No Modules Found</h4>
                  <p className="text-muted">
                    {searchTerm 
                      ? `No modules match your search term "${searchTerm}"`
                      : `No modules with status "${filter}"`}
                  </p>
                  <div className="d-flex gap-2 justify-content-center">
                    {searchTerm && (
                      <Button variant="outline-primary" onClick={() => setSearchTerm('')}>
                        Clear Search
                      </Button>
                    )}
                    {filter !== 'all' && (
                      <Button variant="outline-primary" onClick={() => setFilter('all')}>
                        Show All Modules
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

export default AdminModules;
