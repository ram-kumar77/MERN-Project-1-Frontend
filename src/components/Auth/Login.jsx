import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { setUser } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    isAdmin: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate email and password
      if (!credentials.email || !credentials.password) {
        setError('Please enter both email and password');
        setIsLoading(false);
        return;
      }

      const { user, token } = await authService.login({
        email: credentials.email,
        password: credentials.password,
        isAdmin: credentials.isAdmin || credentials.email.endsWith('@admin.com')
      });

      // Store token and user data
      if (!token) {
        throw new Error('No token received from server');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('Token stored in localStorage:', token);
      console.log('User data stored in localStorage:', user);

      // Verify token is stored correctly
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        throw new Error('Failed to store token in localStorage');
      }

      // Update AuthContext state
      setUser(user);
      
      // Navigate based on user role after state update
      if (user.role === 'admin') {
        navigate('/adashboard');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-6 text-center font-bold text-gray-800">
          Login to Your Account
        </h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="email" 
              className="block text-gray-700 mb-2 font-medium"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className="block text-gray-700 mb-2 font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter your password"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              checked={credentials.isAdmin}
              onChange={handleChange}
              className="mr-2"
            />
            <label 
              htmlFor="isAdmin" 
              className="text-gray-700"
            >
              Login as Admin
            </label>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md text-white font-semibold transition-colors ${
              isLoading 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="text-center mt-4 text-gray-600">
          Don't have an account? 
          <Link 
            to="/register" 
            className="text-blue-500 ml-1 hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
