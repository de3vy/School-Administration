import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import StudentAssignments from '../../pages/student/Assignments';
import { studentAPI } from '../../utils/api';

// Mock the API
jest.mock('../../utils/api', () => ({
  studentAPI: {
    getAssignments: jest.fn()
  }
}));

// Mock the auth context
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    userProfile: { id: 'test-student-id', role: 'student' }
  }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));

describe('StudentAssignments Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    // Mock API to return a promise that doesn't resolve immediately
    studentAPI.getAssignments.mockReturnValue(new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <StudentAssignments />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders assignments when data is loaded', async () => {
    // Mock API response
    const mockAssignments = [
      {
        _id: '1',
        title: 'Math Quiz',
        description: 'Quiz covering algebra fundamentals',
        group: { name: 'Math Group A' },
        teacher: { name: 'Ms. Johnson' },
        dueDate: '2025-04-15',
        assignedDate: '2025-04-01',
        status: 'pending',
        type: 'Quiz',
        points: 50,
        score: null,
        feedback: null,
        attachments: []
      },
      {
        _id: '2',
        title: 'Science Project',
        description: 'Research project on renewable energy',
        group: { name: 'Science Group B' },
        teacher: { name: 'Mr. Smith' },
        dueDate: '2025-04-20',
        assignedDate: '2025-03-20',
        status: 'in progress',
        type: 'Project',
        points: 100,
        score: null,
        feedback: null,
        attachments: []
      }
    ];
    
    studentAPI.getAssignments.mockResolvedValue({ data: mockAssignments });
    
    render(
      <BrowserRouter>
        <StudentAssignments />
      </BrowserRouter>
    );
    
    // Wait for the assignments to load
    await waitFor(() => {
      expect(screen.getByText('Math Quiz')).toBeInTheDocument();
      expect(screen.getByText('Science Project')).toBeInTheDocument();
    });
    
    // Check that API was called with correct parameters
    expect(studentAPI.getAssignments).toHaveBeenCalledWith('test-student-id', { status: undefined });
  });

  test('renders error message when API call fails', async () => {
    // Mock API to throw an error
    studentAPI.getAssignments.mockRejectedValue(new Error('API Error'));
    
    render(
      <BrowserRouter>
        <StudentAssignments />
      </BrowserRouter>
    );
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to load assignments. Please try again later.')).toBeInTheDocument();
    });
  });

  test('filters assignments based on search term', async () => {
    // Mock API response
    const mockAssignments = [
      {
        _id: '1',
        title: 'Math Quiz',
        description: 'Quiz covering algebra fundamentals',
        group: { name: 'Math Group A' },
        teacher: { name: 'Ms. Johnson' },
        dueDate: '2025-04-15',
        assignedDate: '2025-04-01',
        status: 'pending',
        type: 'Quiz',
        points: 50,
        score: null,
        feedback: null,
        attachments: []
      },
      {
        _id: '2',
        title: 'Science Project',
        description: 'Research project on renewable energy',
        group: { name: 'Science Group B' },
        teacher: { name: 'Mr. Smith' },
        dueDate: '2025-04-20',
        assignedDate: '2025-03-20',
        status: 'in progress',
        type: 'Project',
        points: 100,
        score: null,
        feedback: null,
        attachments: []
      }
    ];
    
    studentAPI.getAssignments.mockResolvedValue({ data: mockAssignments });
    
    render(
      <BrowserRouter>
        <StudentAssignments />
      </BrowserRouter>
    );
    
    // Wait for the assignments to load
    await waitFor(() => {
      expect(screen.getByText('Math Quiz')).toBeInTheDocument();
      expect(screen.getByText('Science Project')).toBeInTheDocument();
    });
    
    // Type in the search box
    const searchInput = screen.getByPlaceholderText('Search assignments...');
    fireEvent.change(searchInput, { target: { value: 'Math' } });
    
    // Check that only the Math assignment is visible
    expect(screen.getByText('Math Quiz')).toBeInTheDocument();
    expect(screen.queryByText('Science Project')).not.toBeInTheDocument();
  });
});
