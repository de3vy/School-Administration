import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login?session=expired';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/password', passwordData)
};

// Student API calls
export const studentAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (studentData) => api.post('/students', studentData),
  update: (id, studentData) => api.put(`/students/${id}`, studentData),
  delete: (id) => api.delete(`/students/${id}`),
  getProgress: (id) => api.get(`/students/${id}/progress`),
  getAttendance: (id, params) => api.get(`/students/${id}/attendance`, { params }),
  getAssignments: (id, params) => api.get(`/students/${id}/assignments`, { params }),
  getGroups: (id) => api.get(`/students/${id}/groups`)
};

// Teacher API calls
export const teacherAPI = {
  getAll: (params) => api.get('/teachers', { params }),
  getById: (id) => api.get(`/teachers/${id}`),
  create: (teacherData) => api.post('/teachers', teacherData),
  update: (id, teacherData) => api.put(`/teachers/${id}`, teacherData),
  delete: (id) => api.delete(`/teachers/${id}`),
  getGroups: (id) => api.get(`/teachers/${id}/groups`)
};

// Group API calls
export const groupAPI = {
  getAll: (params) => api.get('/groups', { params }),
  getById: (id) => api.get(`/groups/${id}`),
  create: (groupData) => api.post('/groups', groupData),
  update: (id, groupData) => api.put(`/groups/${id}`, groupData),
  delete: (id) => api.delete(`/groups/${id}`),
  getStudents: (id) => api.get(`/groups/${id}/students`),
  getTeachers: (id) => api.get(`/groups/${id}/teachers`),
  addStudent: (id, studentId) => api.post(`/groups/${id}/students`, { studentId }),
  removeStudent: (id, studentId) => api.delete(`/groups/${id}/students/${studentId}`),
  addTeacher: (id, teacherId) => api.post(`/groups/${id}/teachers`, { teacherId }),
  removeTeacher: (id, teacherId) => api.delete(`/groups/${id}/teachers/${teacherId}`)
};

// Learning Module API calls
export const moduleAPI = {
  getAll: (params) => api.get('/modules', { params }),
  getById: (id) => api.get(`/modules/${id}`),
  create: (moduleData) => api.post('/modules', moduleData),
  update: (id, moduleData) => api.put(`/modules/${id}`, moduleData),
  delete: (id) => api.delete(`/modules/${id}`),
  getResources: (id) => api.get(`/modules/${id}/resources`),
  addResource: (id, resourceData) => api.post(`/modules/${id}/resources`, resourceData),
  removeResource: (id, resourceId) => api.delete(`/modules/${id}/resources/${resourceId}`)
};

// Lesson API calls
export const lessonAPI = {
  getAll: (params) => api.get('/lessons', { params }),
  getById: (id) => api.get(`/lessons/${id}`),
  create: (lessonData) => api.post('/lessons', lessonData),
  update: (id, lessonData) => api.put(`/lessons/${id}`, lessonData),
  delete: (id) => api.delete(`/lessons/${id}`)
};

// Assignment API calls
export const assignmentAPI = {
  getAll: (params) => api.get('/assignments', { params }),
  getById: (id) => api.get(`/assignments/${id}`),
  create: (assignmentData) => api.post('/assignments', assignmentData),
  update: (id, assignmentData) => api.put(`/assignments/${id}`, assignmentData),
  delete: (id) => api.delete(`/assignments/${id}`),
  getSubmissions: (id) => api.get(`/assignments/${id}/submissions`),
  submitAssignment: (id, submissionData) => api.post(`/assignments/${id}/submissions`, submissionData),
  gradeSubmission: (assignmentId, submissionId, gradeData) => 
    api.put(`/assignments/${assignmentId}/submissions/${submissionId}/grade`, gradeData)
};

// Attendance API calls
export const attendanceAPI = {
  getAll: (params) => api.get('/attendance', { params }),
  getById: (id) => api.get(`/attendance/${id}`),
  create: (attendanceData) => api.post('/attendance', attendanceData),
  update: (id, attendanceData) => api.put(`/attendance/${id}`, attendanceData),
  delete: (id) => api.delete(`/attendance/${id}`),
  recordBulk: (attendanceData) => api.post('/attendance/bulk', attendanceData),
  getByGroup: (groupId, date) => api.get(`/attendance/group/${groupId}`, { params: { date } }),
  getByStudent: (studentId, params) => api.get(`/attendance/student/${studentId}`, { params })
};

// Progress API calls
export const progressAPI = {
  getAll: (params) => api.get('/progress', { params }),
  getById: (id) => api.get(`/progress/${id}`),
  create: (progressData) => api.post('/progress', progressData),
  update: (id, progressData) => api.put(`/progress/${id}`, progressData),
  delete: (id) => api.delete(`/progress/${id}`),
  getByStudent: (studentId) => api.get(`/progress/student/${studentId}`),
  getByModule: (moduleId) => api.get(`/progress/module/${moduleId}`)
};

// Report API calls
export const reportAPI = {
  getAttendanceReport: (params) => api.get('/reports/attendance', { params }),
  getProgressReport: (params) => api.get('/reports/progress', { params }),
  getAssessmentReport: (params) => api.get('/reports/assessment', { params }),
  getStudentReport: (studentId, params) => api.get(`/reports/student/${studentId}`, { params }),
  getGroupReport: (groupId, params) => api.get(`/reports/group/${groupId}`, { params }),
  getTeacherReport: (teacherId, params) => api.get(`/reports/teacher/${teacherId}`, { params }),
  exportReport: (reportType, params) => api.get(`/reports/export/${reportType}`, { 
    params,
    responseType: 'blob'
  })
};

export default api;
