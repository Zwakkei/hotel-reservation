import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    general: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const savedUsername = localStorage.getItem('remembered_username');
    if (savedUsername) {
      setFormData(prev => ({ ...prev, username: savedUsername }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ username: '', password: '', general: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setErrors({ username: '', password: '', general: '' });
    
    if (!formData.username && !formData.password) {
      setErrors({ 
        username: 'Username is required', 
        password: 'Password is required', 
        general: '' 
      });
      return;
    }
    
    if (!formData.username) {
      setErrors(prev => ({ ...prev, username: 'Username is required' }));
      return;
    }
    
    if (!formData.password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      return;
    }
    
    setLoading(true);
    
    const result = await login(formData);
    
    if (result.success) {
      if (rememberMe) {
        localStorage.setItem('remembered_username', formData.username);
      } else {
        localStorage.removeItem('remembered_username');
      }
      navigate('/dashboard');
    } else {
      console.log('Login failed:', result.error);
      const errorMsg = result.error.toLowerCase();
      if (errorMsg.includes('username') || errorMsg.includes('account')) {
        setErrors(prev => ({ ...prev, username: result.error }));
      } else if (errorMsg.includes('password')) {
        setErrors(prev => ({ ...prev, password: result.error }));
      } else {
        setErrors(prev => ({ ...prev, general: result.error }));
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="flex-1 flex items-center justify-center relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-blue-900/40 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-amber-500/20 relative z-10"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🏨</div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-amber-400">Sign in to your account</p>
        </div>

        {successMessage && (
          <div className="mt-4 bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {errors.general && (
          <div className="mt-4 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
            {errors.general}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-amber-400 mb-2">
              Username or Email
            </label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-blue-950/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400 transition ${
                errors.username ? 'border-red-500' : 'border-cyan-800'
              }`}
              placeholder="Enter your username"
              disabled={loading}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-400">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-400 mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-blue-950/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400 transition ${
                errors.password ? 'border-red-500' : 'border-cyan-800'
              }`}
              placeholder="Enter your password"
              disabled={loading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-amber-600 rounded border-cyan-800 bg-blue-950/50 focus:ring-amber-500"
              />
              <span className="ml-2 text-sm text-gray-300">Remember me</span>
            </label>
            <a href="#" className="text-sm text-amber-400 hover:text-amber-300 transition">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          <p className="text-center text-sm text-gray-300">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-amber-400 hover:text-amber-300 transition">
              Create an account
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;