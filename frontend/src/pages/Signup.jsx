// src/pages/Signup.jsx - UPDATED with validation and error handling
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
    // Also validate confirmPassword when password changes
    if (field === 'password' && touched.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const validate = () => {
    const newErrors = {};
    ['name', 'email', 'password', 'confirmPassword'].forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => { allTouched[key] = true; });
    setTouched(allTouched);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await signup(formData.email, formData.password, formData.name);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    }
  };

  const isFormValid = Object.keys(validate()).length === 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
            TaxPal
          </h1>
          <p className="text-gray-400 mt-2">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white input-focus ${
                errors.name && touched.name ? 'border-red-400' : 'border-white/10'
              }`}
              placeholder="John Doe"
            />
            {errors.name && touched.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
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
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white input-focus ${
                errors.confirmPassword && touched.confirmPassword ? 'border-red-400' : 'border-white/10'
              }`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400 text-center">{errors.submit}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full btn-primary py-3 disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner /> : 'Create Account'}
          </button>

          <p className="text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-accent/80 transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}