import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import TeacherGroups from '../../pages/teacher/Groups';
import { teacherAPI } from '../../utils/api';

// Mock the API
jest.mock('../../utils/api', () => ({
  teacherAPI: {
    getGroups: jest.fn()
  }
}));

// Mock the auth context
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    userProfile: { id: 'test-teacher-id', role: 'teacher' }
  }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));

describe('TeacherGroups Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    // Mock API to return a promise that doesn't resolve immediately
    teacherAPI.getGroups.mockReturnValue(new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <TeacherGroups />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders groups when data is loaded', async () => {
    // Mock API response
    const mockGroups = [
      {
        _id: '1',
        name: 'Math Group A',
        description: 'Advanced algebra and calculus concepts',
        location: 'Room 101',
        meetingDays: 'Monday, Wednesday',
        meetingTime: '10:00 AM - 11:30 AM',
        status: 'Active',
        students: [{ id: '1', name: 'John' }, { id: '2', name: 'Emily' }],
        nextLesson: '2025-04-10',
        completedLessons: 12,
        totalLessons: 24,
        averageAttendance: 92
      },
      {
        _id: '2',
        name: 'Math Group B',
        description: 'Intermediate algebra and geometry',
        location: 'Room 102',
        meetingDays: 'Tuesday, Thursday',
        meetingTime: '9:00 AM - 10:30 AM',
        status: 'Active',
        students: [{ id: '3', name: 'Michael' }, { id: '4', name: 'Sarah' }],
        nextLesson: '2025-04-09',
        completedLessons: 11,
        totalLessons: 24,
        averageAttendance: 88
      }
    ];
    
    teacherAPI.getGroups.mockResolvedValue({ data: mockGroups });
    
    render(
      <BrowserRouter>
        <TeacherGroups />
      </BrowserRouter>
    );
    
    // Wait for the groups to load
    await waitFor(() => {
      expect(screen.getByText('Math Group A')).toBeInTheDocument();
      expect(screen.getByText('Math Group B')).toBeInTheDocument();
    });
    
    // Check that API was called with correct parameters
    expect(teacherAPI.getGroups).toHaveBeenCalledWith('test-teacher-id');
  });

  test('renders error message when API call fails', async () => {
    // Mock API to throw an error
    teacherAPI.getGroups.mockRejectedValue(new Error('API Error'));
    
    render(
      <BrowserRouter>
        <TeacherGroups />
      </BrowserRouter>
    );
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to load groups. Please try again later.')).toBeInTheDocument();
    });
  });

  test('filters groups based on search term', async () => {
    // Mock API response
    const mockGroups = [
      {
        _id: '1',
        name: 'Math Group A',
        description: 'Advanced algebra and calculus concepts',
        location: 'Room 101',
        meetingDays: 'Monday, Wednesday',
        meetingTime: '10:00 AM - 11:30 AM',
        status: 'Active',
        students: [{ id: '1', name: 'John' }, { id: '2', name: 'Emily' }],
        nextLesson: '2025-04-10',
        completedLessons: 12,
        totalLessons: 24,
        averageAttendance: 92
      },
      {
        _id: '2',
        name: 'Science Group B',
        description: 'Biology and chemistry concepts',
        location: 'Room 102',
        meetingDays: 'Tuesday, Thursday',
        meetingTime: '9:00 AM - 10:30 AM',
        status: 'Active',
        students: [{ id: '3', name: 'Michael' }, { id: '4', name: 'Sarah' }],
        nextLesson: '2025-04-09',
        completedLessons: 11,
        totalLessons: 24,
        averageAttendance: 88
      }
    ];
    
    teacherAPI.getGroups.mockResolvedValue({ data: mockGroups });
    
    render(
      <BrowserRouter>
        <TeacherGroups />
      </BrowserRouter>
    );
    
    // Wait for the groups to load
    await waitFor(() => {
      expect(screen.getByText('Math Group A')).toBeInTheDocument();
      expect(screen.getByText('Science Group B')).toBeInTheDocument();
    });
    
    // Type in the search box
    const searchInput = screen.getByPlaceholderText('Search groups...');
    fireEvent.change(searchInput, { target: { value: 'Math' } });
    
    // Check that only the Math group is visible
    expect(screen.getByText('Math Group A')).toBeInTheDocument();
    expect(screen.queryByText('Science Group B')).not.toBeInTheDocument();
  });
});
