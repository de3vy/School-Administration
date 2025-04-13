import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Login from '../../pages/auth/Login';
import { authAPI } from '../../utils/api';

// Mock the API
jest.mock('../../utils/api', () => ({
  authAPI: {
    login: jest.fn()
  }
}));

describe('Login Component', () => {
  const mockLogin = jest.fn();
  const mockSetUser = jest.fn();
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  const renderLoginWithContext = () => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={{ login: mockLogin, setUser: mockSetUser }}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  test('renders login form correctly', () => {
    renderLoginWithContext();
    
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  test('handles form submission correctly', async () => {
    // Mock successful login
    const mockUserData = { 
      id: 'user123', 
      name: 'Test User', 
      email: 'test@example.com', 
      role: 'student' 
    };
    const mockToken = 'test-token';
    
    authAPI.login.mockResolvedValue({ 
      data: { 
        user: mockUserData, 
        token: mockToken 
      } 
    });
    
    renderLoginWithContext();
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    // Check that the API was called with correct parameters
    expect(authAPI.login).toHaveBeenCalledWith('test@example.com', 'password123');
    
    // Wait for the login process to complete
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(mockToken);
      expect(mockSetUser).toHaveBeenCalledWith(mockUserData);
    });
  });

  test('displays error message on login failure', async () => {
    // Mock failed login
    authAPI.login.mockRejectedValue({ 
      response: { 
        data: { 
          message: 'Invalid credentials' 
        } 
      } 
    });
    
    renderLoginWithContext();
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpassword' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
    
    // Check that login was not called
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockSetUser).not.toHaveBeenCalled();
  });

  test('validates form inputs', async () => {
    renderLoginWithContext();
    
    // Submit the form without filling it
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    
    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
    
    // Check that API was not called
    expect(authAPI.login).not.toHaveBeenCalled();
  });
});
