// src/pages/Login.jsx
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

  const validate = () => {
    const newErrors = {};
    const emailError = validateField('email', email);
    const passwordError = validateField('password', password);

    if (emailError) newErrors.email = emailError;
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

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ submit: result.error || 'Invalid email or password' });
    }
  };

  return (
    <div className="min-h-screen ultra-bg flex items-center justify-center p-4 relative overflow-hidden selection:bg-indigo-300">
      {/* Animated Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob animation-delay-2000 pointer-events-none z-0"></div>

      <div className="glass-card w-full max-w-md p-8 relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-purple-600 tracking-tight drop-shadow-sm pb-1">TaxPal</h1>
          <p className="text-slate-500 mt-2">Welcome back</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="hello@example.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <p className="text-red-400 text-sm text-center">
              {errors.submit}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? <LoadingSpinner /> : 'Sign In'}
          </button>

          <p className="text-center text-slate-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
