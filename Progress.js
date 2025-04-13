import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../utils/api';
import { Container, Row, Col, Card, Table, Badge, Button, Form, InputGroup, Tab, Nav } from 'react-bootstrap';
import Loading from '../../components/common/Loading';

const StudentProgress = () => {
  const { userProfile } = useAuth();
  const [moduleProgress, setModuleProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const response = await progressAPI.getByStudent(userProfile.id);
        setModuleProgress(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching progress:', err);
        setError('Failed to load progress data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (userProfile && userProfile.id) {
      fetchProgress();
    }
  }, [userProfile]);
  
  // Calculate overall progress
  const completedModules = moduleProgress.filter(module => module.status === 'Completed').length;
  const totalModules = moduleProgress.length;
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  
  // Calculate average score
  const completedWithScores = moduleProgress.filter(module => module.assessmentScore !== null);
  const averageScore = completedWithScores.length > 0 
    ? Math.round(completedWithScores.reduce((sum, module) => sum + module.assessmentScore, 0) / completedWithScores.length) 
    : null;

  if (loading) return <Loading />;

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>My Progress</h2>
          <p>Track your learning journey and module completion.</p>
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
        <Col md={4} className="mb-4">
          <Card className="h-100 dashboard-card">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Overall Progress</h5>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="display-1 mb-3">{overallProgress}%</div>
              <ProgressBar 
                now={overallProgress} 
                variant="primary" 
                className="mb-3" 
                style={{ height: '10px' }} 
              />
              <p className="mb-0">
                <strong>{completedModules}</strong> of <strong>{totalModules}</strong> modules completed
              </p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 dashboard-card">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Average Assessment Score</h5>
            </Card.Header>
            <Card.Body className="text-center">
              {averageScore !== null ? (
                <>
                  <div className="display-1 mb-3">{averageScore}%</div>
                  <ProgressBar 
                    now={averageScore} 
                    variant={
                      averageScore >= 90 ? 'success' :
                      averageScore >= 70 ? 'info' :
                      averageScore >= 60 ? 'warning' : 'danger'
                    } 
                    className="mb-3" 
                    style={{ height: '10px' }} 
                  />
                  <p className="mb-0">
                    Based on <strong>{completedWithScores.length}</strong> completed assessments
                  </p>
                </>
              ) : (
                <div className="text-muted py-4">
                  <i className="bi bi-clipboard-data fs-1 d-block mb-3"></i>
                  <p>No assessments completed yet</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 dashboard-card">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">Learning Status</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <div className="text-center">
                  <div className="display-6">{moduleProgress.filter(m => m.status === 'Completed').length}</div>
                  <div className="text-muted">Completed</div>
                </div>
                <div className="text-center">
                  <div className="display-6">{moduleProgress.filter(m => m.status === 'In Progress').length}</div>
                  <div className="text-muted">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="display-6">{moduleProgress.filter(m => m.status === 'Not Started').length}</div>
                  <div className="text-muted">Not Started</div>
                </div>
              </div>
              <div className="text-center mt-4">
                <Button variant="outline-info" href="/student/learning-journey">
                  View Learning Journey
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Learning Modules</h5>
            </Card.Header>
            <Card.Body>
              <Tab.Container defaultActiveKey="all">
                <Nav variant="tabs" className="mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="all">All Modules</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="completed">Completed</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="in-progress">In Progress</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="not-started">Not Started</Nav.Link>
                  </Nav.Item>
                </Nav>
                
                <Tab.Content>
                  <Tab.Pane eventKey="all">
                    {renderModulesList(moduleProgress)}
                  </Tab.Pane>
                  <Tab.Pane eventKey="completed">
                    {renderModulesList(moduleProgress.filter(m => m.status === 'Completed'))}
                  </Tab.Pane>
                  <Tab.Pane eventKey="in-progress">
                    {renderModulesList(moduleProgress.filter(m => m.status === 'In Progress'))}
                  </Tab.Pane>
                  <Tab.Pane eventKey="not-started">
                    {renderModulesList(moduleProgress.filter(m => m.status === 'Not Started'))}
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Helper function to render modules list
const renderModulesList = (modules) => {
  if (modules.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-journal-x fs-1 text-muted mb-3"></i>
        <h5>No modules found</h5>
        <p className="text-muted">There are no modules in this category.</p>
      </div>
    );
  }
  
  return modules.map(module => (
    <Card key={module._id} className="mb-3">
      <Card.Body>
        <Row>
          <Col md={8}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5>{module.title}</h5>
                <p className="text-muted mb-2">{module.description}</p>
                <div className="mb-2">
                  <Badge bg="secondary" className="me-2">
                    {module.difficulty}
                  </Badge>
                  <Badge bg={
                    module.status === 'Completed' ? 'success' :
                    module.status === 'In Progress' ? 'info' : 'secondary'
                  }>
                    {module.status}
                  </Badge>
                </div>
                <small className="text-muted">
                  Started: {new Date(module.startDate).toLocaleDateString()}
                  {module.completionDate && ` • Completed: ${new Date(module.completionDate).toLocaleDateString()}`}
                </small>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="d-flex flex-column h-100 justify-content-between align-items-end">
              <div className="w-100 mb-2">
                <div className="d-flex justify-content-between mb-1">
                  <small>Progress</small>
                  <small>{module.progress}%</small>
                </div>
                <ProgressBar 
                  now={module.progress} 
                  variant={
                    module.status === 'Completed' ? 'success' :
                    module.status === 'In Progress' ? 'info' : 'secondary'
                  } 
                  style={{ height: '8px' }} 
                />
              </div>
              {module.assessmentScore !== null && (
                <div className="text-end mb-2">
                  <div className="text-muted">Assessment Score</div>
                  <h5 className={
                    module.assessmentScore >= 90 ? 'text-success' :
                    module.assessmentScore >= 70 ? 'text-info' :
                    module.assessmentScore >= 60 ? 'text-warning' : 'text-danger'
                  }>
                    {module.assessmentScore}%
                  </h5>
                </div>
              )}
              <Button variant="outline-primary" size="sm">
                View Details
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ));
};

export default StudentProgress;
