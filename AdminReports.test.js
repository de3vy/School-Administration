import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import AdminReports from '../../pages/admin/Reports';
import { reportAPI } from '../../utils/api';

// Mock the API
jest.mock('../../utils/api', () => ({
  reportAPI: {
    getAttendanceReport: jest.fn(),
    getProgressReport: jest.fn(),
    getAssessmentReport: jest.fn(),
    exportReport: jest.fn()
  }
}));

// Mock the Chart.js components
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="mock-bar-chart" />,
  Pie: () => <div data-testid="mock-pie-chart" />
}));

// Mock the auth context
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    userProfile: { id: 'test-admin-id', role: 'admin' }
  }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));

describe('AdminReports Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    // Mock API to return a promise that doesn't resolve immediately
    reportAPI.getAttendanceReport.mockReturnValue(new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <AdminReports />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders attendance report when data is loaded', async () => {
    // Mock API response
    const mockReportData = {
      chartData: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Math Group A',
            data: [95, 92, 88, 94],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          }
        ]
      },
      detailedReport: [
        {
          group: 'Math Group A',
          averageRate: 92,
          totalSessions: 12,
          presentCount: 10,
          lateCount: 1,
          absentCount: 1,
          trend: 'Stable'
        }
      ]
    };
    
    reportAPI.getAttendanceReport.mockResolvedValue({ data: mockReportData });
    
    render(
      <BrowserRouter>
        <AdminReports />
      </BrowserRouter>
    );
    
    // Wait for the report to load
    await waitFor(() => {
      expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
      expect(screen.getByText('Math Group A')).toBeInTheDocument();
      expect(screen.getByText('92%')).toBeInTheDocument();
    });
    
    // Check that API was called with correct parameters
    expect(reportAPI.getAttendanceReport).toHaveBeenCalledWith({ 
      period: 'month', 
      groupId: undefined 
    });
  });

  test('renders error message when API call fails', async () => {
    // Mock API to throw an error
    reportAPI.getAttendanceReport.mockRejectedValue(new Error('API Error'));
    
    render(
      <BrowserRouter>
        <AdminReports />
      </BrowserRouter>
    );
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to load report data. Please try again later.')).toBeInTheDocument();
    });
  });

  test('changes report type when dropdown is changed', async () => {
    // Mock API responses
    const mockAttendanceData = {
      chartData: { labels: [], datasets: [] },
      detailedReport: []
    };
    
    const mockProgressData = {
      chartData: { labels: [], datasets: [] },
      detailedReport: [
        {
          group: 'Math Group A',
          completionRate: 75,
          modulesCompleted: 3,
          totalModules: 4,
          onTrack: 12,
          behind: 2,
          trend: 'Improving'
        }
      ]
    };
    
    reportAPI.getAttendanceReport.mockResolvedValue({ data: mockAttendanceData });
    reportAPI.getProgressReport.mockResolvedValue({ data: mockProgressData });
    
    render(
      <BrowserRouter>
        <AdminReports />
      </BrowserRouter>
    );
    
    // Wait for the initial report to load
    await waitFor(() => {
      expect(reportAPI.getAttendanceReport).toHaveBeenCalled();
    });
    
    // Change report type to progress
    const reportTypeSelect = screen.getByDisplayValue('Attendance Report');
    fireEvent.change(reportTypeSelect, { target: { value: 'progress' } });
    
    // Wait for the progress report to load
    await waitFor(() => {
      expect(reportAPI.getProgressReport).toHaveBeenCalled();
      expect(screen.getByText('Completion Rate')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });
  });

  test('exports report when export button is clicked', async () => {
    // Mock API responses
    const mockReportData = {
      chartData: { labels: [], datasets: [] },
      detailedReport: []
    };
    
    // Mock the export function
    const mockBlob = new Blob(['test'], { type: 'application/pdf' });
    reportAPI.getAttendanceReport.mockResolvedValue({ data: mockReportData });
    reportAPI.exportReport.mockResolvedValue({ data: mockBlob });
    
    // Mock URL and link creation
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    global.URL.revokeObjectURL = jest.fn();
    
    const mockLink = {
      href: '',
      setAttribute: jest.fn(),
      click: jest.fn()
    };
    document.createElement = jest.fn().mockImplementation((tag) => {
      if (tag === 'a') return mockLink;
      return document.createElement(tag);
    });
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
    
    render(
      <BrowserRouter>
        <AdminReports />
      </BrowserRouter>
    );
    
    // Wait for the report to load
    await waitFor(() => {
      expect(reportAPI.getAttendanceReport).toHaveBeenCalled();
    });
    
    // Click the export button
    const exportButton = screen.getByText('Export Report');
    fireEvent.click(exportButton);
    
    // Wait for the export to complete
    await waitFor(() => {
      expect(reportAPI.exportReport).toHaveBeenCalledWith('attendance', {
        period: 'month',
        groupId: undefined,
        format: 'pdf'
      });
      expect(mockLink.click).toHaveBeenCalled();
    });
  });
});
