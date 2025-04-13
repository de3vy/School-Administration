import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const StudentProfile = () => {
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      first_name: userProfile?.first_name || '',
      last_name: userProfile?.last_name || '',
      email: userProfile?.email || '',
      phone: userProfile?.phone || '',
      address: userProfile?.address || '',
      date_of_birth: userProfile?.date_of_birth ? new Date(userProfile.date_of_birth).toISOString().split('T')[0] : ''
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required('First name is required'),
      last_name: Yup.string().required('Last name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string(),
      address: Yup.string(),
      date_of_birth: Yup.date().nullable()
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        setSuccess('');
        
        // In a real app, this would be an API call
        // await axios.put(`/api/students/${userProfile._id}`, values);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setSuccess('Profile updated successfully!');
        setEditMode(false);
      } catch (err) {
        setError('Failed to update profile. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2>My Profile</h2>
          <p>View and manage your personal information.</p>
        </Col>
      </Row>
      
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Personal Information</h5>
              {!editMode && (
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              {editMode ? (
                <Form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          id="first_name"
                          name="first_name"
                          value={formik.values.first_name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={formik.touched.first_name && formik.errors.first_name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.first_name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          id="last_name"
                          name="last_name"
                          value={formik.values.last_name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={formik.touched.last_name && formik.errors.last_name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.last_name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          id="email"
                          name="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={formik.touched.email && formik.errors.email}
                          disabled
                        />
                        <Form.Text className="text-muted">
                          Email cannot be changed. Contact administrator for assistance.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="text"
                          id="phone"
                          name="phone"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={formik.touched.phone && formik.errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.phone}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      id="address"
                      name="address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.address && formik.errors.address}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.address}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      id="date_of_birth"
                      name="date_of_birth"
                      value={formik.values.date_of_birth}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.date_of_birth && formik.errors.date_of_birth}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.date_of_birth}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <div className="d-flex gap-2">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setEditMode(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              ) : (
                <Table borderless>
                  <tbody>
                    <tr>
                      <th style={{ width: '30%' }}>Full Name</th>
                      <td>{userProfile?.first_name} {userProfile?.last_name}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{userProfile?.email}</td>
                    </tr>
                    <tr>
                      <th>Phone</th>
                      <td>{userProfile?.phone || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <th>Address</th>
                      <td>{userProfile?.address || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <th>Date of Birth</th>
                      <td>
                        {userProfile?.date_of_birth 
                          ? new Date(userProfile.date_of_birth).toLocaleDateString() 
                          : 'Not provided'}
                      </td>
                    </tr>
                    <tr>
                      <th>Enrollment Date</th>
                      <td>
                        {userProfile?.enrollment_date 
                          ? new Date(userProfile.enrollment_date).toLocaleDateString() 
                          : 'Not available'}
                      </td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <td>{userProfile?.status || 'Active'}</td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Account Settings</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button variant="outline-primary">
                  Change Password
                </Button>
                <Button variant="outline-secondary">
                  Notification Preferences
                </Button>
                <Button variant="outline-danger">
                  Privacy Settings
                </Button>
              </div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header>
              <h5 className="mb-0">Account Information</h5>
            </Card.Header>
            <Card.Body>
              <Table borderless size="sm">
                <tbody>
                  <tr>
                    <th>Account Type</th>
                    <td>Student</td>
                  </tr>
                  <tr>
                    <th>Last Login</th>
                    <td>{new Date().toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>Account Created</th>
                    <td>{userProfile?.created_at 
                      ? new Date(userProfile.created_at).toLocaleDateString() 
                      : new Date().toLocaleDateString()}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentProfile;
