import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, PlayCircle } from 'lucide-react';
import api from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-bg" />
      <div className="auth-page">
        <div className="auth-card glass-strong">

          {/* Brand */}
          <div className="brand-logo">
            <div className="brand-logo-icon">💰</div>
            <div className="brand-logo-title">True Online Earning</div>
            <div className="brand-logo-sub">Your Path to Financial Freedom</div>
          </div>

          {/* Header */}
          <div className="auth-header">
            <h2>Welcome Back 👋</h2>
            <p>Sign in to continue your learning journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  id="login-email"
                  placeholder="your@email.com"
                  style={{ paddingLeft: '2.75rem' }}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  id="login-password"
                  placeholder="••••••••"
                  style={{ paddingLeft: '2.75rem' }}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button type="submit" className="btn" id="login-btn" disabled={loading}>
              {loading
                ? <Loader2 size={18} className="animate-spin" />
                : <><PlayCircle size={18} /> Sign In &amp; Learn</>
              }
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/signup">Create account</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
