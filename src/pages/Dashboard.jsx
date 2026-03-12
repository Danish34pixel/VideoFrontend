import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="auth-card glass" style={{ textAlign: 'center' }}>
      <CheckCircle size={64} style={{ color: '#22c55e', marginBottom: '1.5rem', margin: '0 auto 1.5rem' }} />
      <h1>Success!</h1>
      <p style={{ margin: '1rem 0 2rem' }}>Welcome back, <strong>{user.fullName}</strong>. You are now logged in.</p>
      
      <button onClick={handleLogout} className="btn" style={{ background: '#334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <LogOut size={18} />
          Sign Out
        </div>
      </button>
    </div>
  );
};

export default Dashboard;
