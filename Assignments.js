import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../utils/api';
import { Container, Row, Col, Card, Table, Badge, Button, Form, InputGroup, Tab, Nav, Alert } from 'react-bootstrap';
import Loading from '../../components/common/Loading';

const StudentAssignments = () => {
  const { userProfile } = useAuth();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const response = await studentAPI.getAssignments(userProfile.id, { status: filter !== 'all' ? filter : undefined });
        setAssignments(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setError('Failed to load assignments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (userProfile && userProfile.id) {
      fetchAssignments();
    }
  }, [userProfile, filter]);
  
  // Filter assignments based on search term
  const filteredAssignments = assignments.filter(assignment => 
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate statistics
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'completed').length;
  const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
  const inProgressAssignments = assignments.filter(a => a.status === 'in progress').length;
  const notStartedAssignments = assignments.filter(a => a.status === 'not started').length;
  
  // Calculate average score
  const completedWithScores = assignments.filter(a => a.score !== null);
  const averageScore = completedWithScores.length > 0 
    ? Math.round(completedWithScores.reduce((sum, a) => sum + (a.score / a.points * 100), 0) / completedWithScores.length) 
    : null;

  if (loading) return <Loading />;

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>My Assignments</h2>
          <p>View and manage your assignments across all groups.</p>
        </Col>
      </Row>
      
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}
      
      <Row className="mb-4">
        <Col md={3} className="mb-4">
          <Card className="h-100 dashboard-card text-center">
            <Card.Body>
              <h2 className="display-4">{totalAssignments}</h2>
              <p className="text-muted mb-0">Total Assignments</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100 dashboard-card text-center">
            <Card.Body>
              <h2 className="display-4">{pendingAssignments + inProgressAssignments + notStartedAssignments}</h2>
              <p className="text-muted mb-0">Upcoming</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100 dashboard-card text-center">
            <Card.Body>
              <h2 className="display-4">{completedAssignments}</h2>
              <p className="text-muted mb-0">Completed</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100 dashboard-card text-center">
            <Card.Body>
              <h2 className="display-4">{averageScore !== null ? `${averageScore}%` : '-'}</h2>
              <p className="text-muted mb-0">Average Score</p>
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
              placeholder="Search assignments..."
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
                <option value="all">All Assignments</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="not started">Not Started</option>
                <option value="completed">Completed</option>
              </Form.Select>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
      
      <Row>
        <Col>
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map(assignment => (
              <Card key={assignment._id} className="mb-3">
                <Card.Body>
                  <Row>
                    <Col md={8}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5>{assignment.title}</h5>
                          <p className="text-muted mb-2">{assignment.description}</p>
                          <div className="mb-2">
                            <Badge bg="secondary" className="me-2">
                              {assignment.type}
                            </Badge>
                            <Badge bg={
                              assignment.status === 'completed' ? 'success' :
                              assignment.status === 'pending' ? 'warning' :
                              assignment.status === 'in progress' ? 'info' : 'secondary'
                            }>
                              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                            </Badge>
                          </div>
                          <small className="text-muted d-block">
                            Group: {assignment.group.name} • Teacher: {assignment.teacher.name}
                          </small>
                          <small className="text-muted d-block">
                            Assigned: {new Date(assignment.assignedDate).toLocaleDateString()} • 
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="d-flex flex-column h-100 justify-content-between align-items-end">
                        {assignment.score !== null ? (
                          <div className="text-end mb-3">
                            <div className="text-muted">Score</div>
                            <h5 className={
                              (assignment.score / assignment.points * 100) >= 90 ? 'text-success' :
                              (assignment.score / assignment.points * 100) >= 70 ? 'text-info' :
                              (assignment.score / assignment.points * 100) >= 60 ? 'text-warning' : 'text-danger'
                            }>
                              {assignment.score} / {assignment.points} ({Math.round(assignment.score / assignment.points * 100)}%)
                            </h5>
                          </div>
                        ) : (
                          <div className="text-end mb-3">
                            <div className="text-muted">Points</div>
                            <h5>{assignment.points}</h5>
                          </div>
                        )}
                        
                        {assignment.feedback && (
                          <Alert variant="info" className="w-100 mb-3 py-2">
                            <small>
                              <strong>Feedback:</strong> {assignment.feedback}
                            </small>
                          </Alert>
                        )}
                        
                        <div className="d-flex gap-2">
                          {assignment.attachments && assignment.attachments.length > 0 && (
                            <Button variant="outline-secondary" size="sm">
                              <i className="bi bi-paperclip me-1"></i>
                              {assignment.attachments.length} {assignment.attachments.length === 1 ? 'File' : 'Files'}
                            </Button>
                          )}
                          <Button variant="primary" size="sm">
                            {assignment.status === 'completed' ? 'View Submission' : 'View Details'}
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          ) : (
            <Card className="text-center p-5">
              <Card.Body>
                <i className="bi bi-clipboard-x fs-1 text-muted mb-3"></i>
                <h4>No Assignments Found</h4>
                <p className="text-muted">
                  {searchTerm 
                    ? `No assignments match your search term "${searchTerm}"`
                    : `No assignments with status "${filter}"`}
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  {searchTerm && (
                    <Button variant="outline-primary" onClick={() => setSearchTerm('')}>
                      Clear Search
                    </Button>
                  )}
                  {filter !== 'all' && (
                    <Button variant="outline-primary" onClick={() => setFilter('all')}>
                      Show All Assignments
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StudentAssignments;
