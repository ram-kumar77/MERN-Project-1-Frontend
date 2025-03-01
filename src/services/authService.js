import axiosInstance from '../api/axiosConfig';

// Add request interceptor to include token in headers
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  console.log('Adding token to request:', token);
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  return config;
});

// Interceptor for logging and error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials) {
    try {
      // Validate input before sending
      this.validateLoginInput(credentials);

const response = await axiosInstance.post('/api/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      const { user, token } = response.data;
      
      if (!user || !token) {
        throw new Error('Invalid response from server');
      }

      console.log('Received token:', token);
      localStorage.setItem('token', token);
      console.log('Stored token:', localStorage.getItem('token'));

      return { 
        user: {
          ...user,
          role: user.role || 'user' // Default to 'user' if role not specified
        }, 
        token 
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message || 
                         'Login failed';
      console.error('Login Error:', errorMessage);
      throw new Error(errorMessage);
    }

  },

  async register(userData) {
    try {
      // Validate input before sending
      this.validateRegisterInput(userData);

      const response = await axiosInstance.post('/api/auth/register', userData);

      const { user, token } = response.data;
      
      if (!user || !token) {
        throw new Error('Invalid response from server');
      }

      return { user, token };
    } catch (error) {
      console.error('Registration Error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  },

  // Input validation methods
  validateLoginInput(credentials) {
    const { email, password } = credentials;
    
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  },

  validateRegisterInput(userData) {
    const { name, email, password } = userData;
    
    if (!name) throw new Error('Name is required');
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    
    // Password strength validation
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
  },

  // Error handling method
  handleError(error) {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      errorMessage = error.response.data?.message || 
                    error.response.data?.error || 
                    error.message || 
                    'An error occurred';
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from server';
    } else {
      // Something happened in setting up the request
      errorMessage = error.message || 'An unexpected error occurred';
    }
    
    console.error('Error:', errorMessage);
    return new Error(errorMessage);
  },


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token);
    
    if (!token) {
      console.log('No token found in localStorage');
      return null;
    }

    try {
      console.log('Making /me request with token:', token);
const response = await axiosInstance.get('/api/auth/me', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      console.log('/me response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getCurrentUser:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

};
