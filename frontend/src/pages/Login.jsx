// src/pages/Login.jsx - UPDATED with validation and error handling
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, field === 'email' ? email : password);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validate = () => {
    const newErrors = {};
    const emailError = validateField('email', email);
    if (emailError) newErrors.email = emailError;
    const passwordError = validateField('password', password);
    if (passwordError) newErrors.password = passwordError;
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setTouched({ email: true, password: true });
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ submit: 'Invalid email or password' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
            TaxPal
          </h1>
          <p className="text-gray-400 mt-2">Welcome back</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email) {
                  const error = validateField('email', e.target.value);
                  setErrors(prev => ({ ...prev, email: error }));
                }
              }}
              onBlur={() => handleBlur('email')}
              className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white input-focus ${
                errors.email && touched.email ? 'border-red-400' : 'border-white/10'
              }`}
              placeholder="hello@example.com"
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (touched.password) {
                  const error = validateField('password', e.target.value);
                  setErrors(prev => ({ ...prev, password: error }));
                }
              }}
              onBlur={() => handleBlur('password')}
              className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white input-focus ${
                errors.password && touched.password ? 'border-red-400' : 'border-white/10'
              }`}
              placeholder="••••••••"
            />
            {errors.password && touched.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400 text-center">{errors.submit}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3"
          >
            {isLoading ? <LoadingSpinner /> : 'Sign In'}
          </button>

          <p className="text-center text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent hover:text-accent/80 transition-colors">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}