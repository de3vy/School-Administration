import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout Components
import MainLayout from './components/layouts/MainLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentGroups from './pages/student/Groups';
import StudentProgress from './pages/student/Progress';
import StudentAttendance from './pages/student/Attendance';
import StudentAssignments from './pages/student/Assignments';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherGroups from './pages/teacher/Groups';
import TeacherGroupDetail from './pages/teacher/GroupDetail';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminModules from './pages/admin/Modules';
import AdminReports from './pages/admin/Reports';

// Shared Components
import NotFound from './pages/NotFound';
import Loading from './components/common/Loading';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate dashboard based on role
    if (currentUser.role === 'student') {
      return <Navigate to="/student/dashboard" />;
    } else if (currentUser.role === 'teacher') {
      return <Navigate to="/teacher/dashboard" />;
    } else if (currentUser.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/login" />;
    }
  }
  
  return children;
};

const App = () => {
  const { currentUser, loading } = useAuth();
  
  // Determine home route based on user role
  const getHomeRoute = () => {
    if (!currentUser) return '/login';
    
    switch (currentUser.role) {
      case 'student':
        return '/student/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={currentUser ? <Navigate to={getHomeRoute()} /> : <Login />} />
      <Route path="/register" element={currentUser ? <Navigate to={getHomeRoute()} /> : <Register />} />
      
      {/* Home Route Redirect */}
      <Route path="/" element={<Navigate to={getHomeRoute()} />} />
      
      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']}>
          <MainLayout userRole="student" />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="groups" element={<StudentGroups />} />
        <Route path="progress" element={<StudentProgress />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="assignments" element={<StudentAssignments />} />
      </Route>
      
      {/* Teacher Routes */}
      <Route path="/teacher" element={
        <ProtectedRoute allowedRoles={['teacher', 'admin']}>
          <MainLayout userRole="teacher" />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="groups" element={<TeacherGroups />} />
        <Route path="groups/:id" element={<TeacherGroupDetail />} />
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <MainLayout userRole="admin" />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="modules" element={<AdminModules />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
