import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, Hash, Loader2, Sparkles } from 'lucide-react';
import api from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    mobileNumber: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/signup', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || navigator.vendor || window.opera);
      const isTouch = navigator.maxTouchPoints > 0;
      
      if (isMobile && isTouch) {
        const upiId = "mohd.aeiaz@ybl";
        const upiLink = `upi://pay?pa=${upiId}&pn=Aijaz%20Khan&am=300&cu=INR&tn=Premium%20Tutorial%20Access`;
        
        try {
          const link = document.createElement('a');
          link.href = upiLink;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (e) {
          console.error("UPI launch failed:", e);
        }
        
        setTimeout(() => {
          navigate('/payment');
        }, 800);
      } else {
        navigate('/payment');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-bg" />
      <div className="auth-page">
        <div className="auth-card auth-card-wide glass-strong">

          {/* Brand */}
          <div className="brand-logo">
            <div className="brand-logo-icon">🎓</div>
            <div className="brand-logo-title">Aijaz Khan Tutorials</div>
            <div className="brand-logo-sub">Premium Learning Platform</div>
          </div>

          {/* Header */}
          <div className="auth-header">
            <h2>Create Your Account ✨</h2>
            <p>Join thousands of students leveling up their skills</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  id="signup-name"
                  placeholder="Aijaz Khan"
                  style={{ paddingLeft: '2.75rem' }}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="input-group">
                <label>Age</label>
                <div className="input-wrapper">
                  <Hash size={16} className="input-icon" />
                  <input
                    type="number"
                    id="signup-age"
                    placeholder="25"
                    min="10"
                    max="100"
                    style={{ paddingLeft: '2.75rem' }}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Mobile Number</label>
                <div className="input-wrapper">
                  <Phone size={16} className="input-icon" />
                  <input
                    type="tel"
                    id="signup-mobile"
                    placeholder="+92 300 0000000"
                    style={{ paddingLeft: '2.75rem' }}
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  id="signup-email"
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
              <label>Account Type</label>
              <div className="input-wrapper">
                <select
                  id="signup-role"
                  className="no-icon"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{ paddingLeft: '1rem', appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="user">🎓 Student / Learner</option>
                  <option value="admin">⚙️ Administrator</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  id="signup-password"
                  placeholder="Create a strong password"
                  style={{ paddingLeft: '2.75rem' }}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button type="submit" className="btn" id="signup-btn" disabled={loading}>
              {loading
                ? <Loader2 size={18} className="animate-spin" />
                : <><Sparkles size={18} /> Start Learning Today</>
              }
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
