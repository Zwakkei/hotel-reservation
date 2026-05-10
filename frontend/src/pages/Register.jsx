import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
  });

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (!acceptedTerms) {
      setError('Please accept the Terms and Conditions');
      return false;
    }
    return true;
  };

  const getPasswordStrengthColor = () => {
    const strength = Object.values(passwordStrength).filter(Boolean).length;
    if (strength === 4) return 'bg-amber-500';
    if (strength >= 2) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPasswordStrengthText = () => {
    const strength = Object.values(passwordStrength).filter(Boolean).length;
    if (strength === 4) return 'Strong';
    if (strength >= 2) return 'Medium';
    return 'Weak';
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  setLoading(true);
  setError('');
  
  try {
    const response = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } else {
      // 🔴 IMPROVED ERROR HANDLING - Show specific error messages
      if (data.email) {
        setError(data.email[0]);  // "Email already exists"
      } else if (data.username) {
        setError(data.username[0]);  // "Username already exists"
      } else if (data.password) {
        setError(data.password[0]);
      } else if (data.non_field_errors) {
        setError(data.non_field_errors[0]);
      } else if (typeof data === 'string') {
        setError(data);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  } catch (error) {
    console.error('Network error:', error);
    setError('Cannot connect to server. Make sure Django backend is running on port 8000');
  } finally {
    setLoading(false);
  }
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
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-amber-400">Join us and start your journey</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="mt-4 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-amber-400 mb-2">Username</label>
            <input
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-blue-950/50 border border-cyan-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400"
              placeholder="Choose a username"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-400 mb-2">Email Address</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-blue-950/50 border border-cyan-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-amber-400 mb-2">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-blue-950/50 border border-cyan-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400"
                placeholder="Create a password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-400"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {formData.password && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300">Password Strength:</span>
                <span className={`font-semibold ${
                  getPasswordStrengthText() === 'Strong' ? 'text-amber-400' : 
                  getPasswordStrengthText() === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>{getPasswordStrengthText()}</span>
              </div>
              <div className="h-2 bg-blue-800/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                  style={{ width: `${(Object.values(passwordStrength).filter(Boolean).length / 4) * 100}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center gap-1 ${passwordStrength.length ? 'text-amber-400' : 'text-gray-500'}`}>
                  {passwordStrength.length ? '✓' : '○'} 8+ characters
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength.upper ? 'text-amber-400' : 'text-gray-500'}`}>
                  {passwordStrength.upper ? '✓' : '○'} Uppercase
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength.lower ? 'text-amber-400' : 'text-gray-500'}`}>
                  {passwordStrength.lower ? '✓' : '○'} Lowercase
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength.number ? 'text-amber-400' : 'text-gray-500'}`}>
                  {passwordStrength.number ? '✓' : '○'} Number
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-amber-400 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-blue-950/50 border border-cyan-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400"
                placeholder="Confirm your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-400"
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="h-4 w-4 text-amber-600 rounded border-cyan-800 bg-blue-950/50 focus:ring-amber-500"
            />
            <span className="ml-2 text-sm text-gray-300">
              I agree to the <a href="#" className="text-amber-400 hover:text-amber-300">Terms and Conditions</a>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/20 transition disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-amber-400 hover:text-amber-300 transition">
              Sign in here
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;