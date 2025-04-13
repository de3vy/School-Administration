import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, reportAPI } from '../../utils/api';
import { Container, Row, Col, Card, Table, Badge, Button, Form, InputGroup, Tab, Nav, Alert } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import Loading from '../../components/common/Loading';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminReports = () => {
  const { userProfile } = useAuth();
  const [reportType, setReportType] = useState('attendance');
  const [period, setPeriod] = useState('month');
  const [groupFilter, setGroupFilter] = useState('all');
  const [reportData, setReportData] = useState(null);
  const [detailedReport, setDetailedReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        
        let response;
        if (reportType === 'attendance') {
          response = await reportAPI.getAttendanceReport({ 
            period, 
            groupId: groupFilter !== 'all' ? groupFilter : undefined 
          });
        } else if (reportType === 'progress') {
          response = await reportAPI.getProgressReport({ 
            period, 
            groupId: groupFilter !== 'all' ? groupFilter : undefined 
          });
        } else if (reportType === 'assessment') {
          response = await reportAPI.getAssessmentReport({ 
            period, 
            groupId: groupFilter !== 'all' ? groupFilter : undefined 
          });
        }
        
        setReportData(response.data.chartData);
        setDetailedReport(response.data.detailedReport);
        setError(null);
      } catch (err) {
        console.error('Error fetching report data:', err);
        setError('Failed to load report data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, [reportType, period, groupFilter]);
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - ${period.charAt(0).toUpperCase() + period.slice(1)}ly`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: reportType === 'attendance' || reportType === 'assessment' ? 50 : 0,
        max: 100,
      },
    },
  };

  const handleExportReport = async () => {
    try {
      const response = await reportAPI.exportReport(reportType, {
        period,
        groupId: groupFilter !== 'all' ? groupFilter : undefined,
        format: 'pdf'
      });
      
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a link element and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report_${period}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting report:', err);
      setError('Failed to export report. Please try again later.');
    }
  };

  if (loading) return <Loading />;

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>Reports</h2>
          <p>Generate and view reports on attendance, progress, and assessments.</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleExportReport}>
            <i className="bi bi-download me-2"></i>
            Export Report
          </Button>
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
        <Col md={4}>
          <Form.Group>
            <InputGroup>
              <InputGroup.Text>Report Type</InputGroup.Text>
              <Form.Select 
                value={reportType} 
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="attendance">Attendance Report</option>
                <option value="progress">Progress Report</option>
                <option value="assessment">Assessment Report</option>
              </Form.Select>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <InputGroup>
              <InputGroup.Text>Time Period</InputGroup.Text>
              <Form.Select 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
                <option value="quarter">Quarterly</option>
                <option value="year">Yearly</option>
              </Form.Select>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <InputGroup>
              <InputGroup.Text>Group</InputGroup.Text>
              <Form.Select 
                value={groupFilter} 
                onChange={(e) => setGroupFilter(e.target.value)}
              >
                <option value="all">All Groups</option>
                {/* This would be populated from an API call in a real implementation */}
                <option value="group1">Math Group A</option>
                <option value="group2">Science Group B</option>
                <option value="group3">History Group C</option>
              </Form.Select>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Trends</h5>
            </Card.Header>
            <Card.Body>
              {reportData ? (
                <div style={{ height: '400px', position: 'relative' }}>
                  <Bar data={reportData} options={{ ...chartOptions, maintainAspectRatio: false }} />
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-graph-up fs-1 text-muted mb-3"></i>
                  <h5>No Data Available</h5>
                  <p className="text-muted">There is no data available for the selected report parameters.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Detailed Report</h5>
            </Card.Header>
            <Card.Body>
              {detailedReport.length > 0 ? (
                <>
                  {reportType === 'attendance' && (
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Group</th>
                          <th>Average Rate</th>
                          <th>Total Sessions</th>
                          <th>Present</th>
                          <th>Late</th>
                          <th>Absent</th>
                          <th>Trend</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailedReport.map((report, index) => (
                          <tr key={index}>
                            <td>{report.group}</td>
                            <td>
                              <span className={
                                report.averageRate >= 90 ? 'text-success' :
                                report.averageRate >= 80 ? 'text-info' :
                                report.averageRate >= 70 ? 'text-warning' : 'text-danger'
                              }>
                                {report.averageRate}%
                              </span>
                            </td>
                            <td>{report.totalSessions}</td>
                            <td>{report.presentCount}</td>
                            <td>{report.lateCount}</td>
                            <td>{report.absentCount}</td>
                            <td>
                              <Badge bg={
                                report.trend === 'Improving' ? 'success' :
                                report.trend === 'Stable' ? 'info' : 'warning'
                              }>
                                {report.trend}
                              </Badge>
                            </td>
                            <td>
                              <Button variant="outline-primary" size="sm">
                                <i className="bi bi-eye"></i> Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                  
                  {reportType === 'progress' && (
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Group</th>
                          <th>Completion Rate</th>
                          <th>Modules Completed</th>
                          <th>On Track</th>
                          <th>Behind</th>
                          <th>Trend</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailedReport.map((report, index) => (
                          <tr key={index}>
                            <td>{report.group}</td>
                            <td>
                              <span className={
                                report.completionRate >= 80 ? 'text-success' :
                                report.completionRate >= 60 ? 'text-info' :
                                report.completionRate >= 40 ? 'text-warning' : 'text-danger'
                              }>
                                {report.completionRate}%
                              </span>
                            </td>
                            <td>{report.modulesCompleted} / {report.totalModules}</td>
                            <td>{report.onTrack}</td>
                            <td>{report.behind}</td>
                            <td>
                              <Badge bg={
                                report.trend === 'Improving' ? 'success' :
                                report.trend === 'Stable' ? 'info' : 'warning'
                              }>
                                {report.trend}
                              </Badge>
                            </td>
                            <td>
                              <Button variant="outline-primary" size="sm">
                                <i className="bi bi-eye"></i> Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                  
                  {reportType === 'assessment' && (
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Group</th>
                          <th>Average Score</th>
                          <th>Assessments Completed</th>
                          <th>Exceeding</th>
                          <th>Meeting</th>
                          <th>Below</th>
                          <th>Trend</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailedReport.map((report, index) => (
                          <tr key={index}>
                            <td>{report.group}</td>
                            <td>
                              <span className={
                                report.averageScore >= 90 ? 'text-success' :
                                report.averageScore >= 80 ? 'text-info' :
                                report.averageScore >= 70 ? 'text-warning' : 'text-danger'
                              }>
                                {report.averageScore}%
                              </span>
                            </td>
                            <td>{report.assessmentsCompleted} / {report.totalAssessments}</td>
                            <td>{report.exceeding}</td>
                            <td>{report.meeting}</td>
                            <td>{report.below}</td>
                            <td>
                              <Badge bg={
                                report.trend === 'Improving' ? 'success' :
                                report.trend === 'Stable' ? 'info' : 'warning'
                              }>
                                {report.trend}
                              </Badge>
                            </td>
                            <td>
                              <Button variant="outline-primary" size="sm">
                                <i className="bi bi-eye"></i> Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-table fs-1 text-muted mb-3"></i>
                  <h5>No Detailed Data Available</h5>
                  <p className="text-muted">There is no detailed data available for the selected report parameters.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminReports;
