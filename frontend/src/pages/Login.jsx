// src/pages/Login.jsx - FIXED
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ submit: 'Invalid credentials' });
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
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: null });
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white input-focus"
              placeholder="hello@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: null });
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white input-focus"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {errors.submit && (
            <p className="text-sm text-red-400 text-center">{errors.submit}</p>
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