import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Smartphone, ShieldCheck, LogOut, Copy, ExternalLink, Zap } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [status] = useState(user?.paymentStatus || 'pending');
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);

  const upiId = "danishkhaannn34@okhdfcbank";
  const upiLink = `upi://pay?pa=${upiId}&pn=Danish%20Khan&am=350&cu=INR&tn=Premium%20Tutorial%20Access`;

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      return /android|iphone|ipad|ipod/i.test(userAgent);
    };
    setIsMobile(checkMobile());

    if (!user) {
      navigate('/login');
    }
    if (user?.isApproved) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAction = () => {
    if (isMobile) {
      window.location.href = upiLink;
    } else {
      copyToClipboard();
    }
  };

  return (
    <>
      <div className="page-bg" />
      <div className="auth-container">
        <div className="auth-card glass" style={{ maxWidth: '500px' }}>
          <div className="auth-header">
            <div className="auth-icon"><Zap size={24} color="#f59e0b" /></div>
            <h1>Premium Access</h1>
            <p>Complete your payment of <strong>₹350</strong> to unlock the tutorial dashboard.</p>
          </div>

          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <div className="qr-container glass" style={{ padding: '1.25rem', borderRadius: '1.25rem', display: 'inline-block', background: 'white', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
              <img 
                src="/qr.jpeg" 
                alt="Payment QR Code" 
                style={{ width: '200px', height: '200px', display: 'block' }} 
              />
            </div>
            
            <div style={{ marginTop: '1.25rem' }}>
                <div 
                  onClick={copyToClipboard}
                  style={{ 
                    cursor: 'pointer',
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    background: 'rgba(139, 92, 246, 0.08)', 
                    padding: '0.75rem 1.25rem', 
                    borderRadius: '1rem', 
                    border: '1px dashed rgba(139, 92, 246, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  className="upi-pill"
                >
                  <span style={{ fontSize: '0.9rem', color: '#8b5cf6', fontWeight: 600 }}>{upiId}</span>
                  <Copy size={16} color="#8b5cf6" />
                </div>
              {copied && <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.5rem', fontWeight: 600 }}>UPI ID Copied!</p>}
            </div>
          </div>

          <div className="features-list" style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '1rem' }}>
            <div className="feature-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
              <ShieldCheck size={20} color="#10b981" />
              <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Verified & Secure Payment</p>
            </div>
            <div className="feature-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Clock size={20} color="#f59e0b" />
              <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Fast Admin Approval</p>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <button 
              onClick={handleAction}
              className="btn btn-primary" 
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.75rem',
                padding: '1.1rem',
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                color: 'white',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Zap size={20} /> Pay ₹350 Now
            </button>
            <p style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '0.75rem', opacity: 0.6 }}>
              {isMobile 
                ? "Tapping above will open your default payment app." 
                : "Scan the QR code or copy the UPI ID above to pay."}
            </p>
          </div>

          <div className="status-box glass" style={{ padding: '1.1rem', borderRadius: '1rem', background: 'rgba(16, 185, 129, 0.05)', marginBottom: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              {status === 'pending' ? <Clock className="animate-pulse" color="#f59e0b" size={18} /> : <CheckCircle color="#10b981" size={18} />}
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Payment {status.charAt(0).toUpperCase() + status.slice(1)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => window.location.reload()} className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', height: '45px', borderRadius: '0.75rem' }}>
              Refresh Status
            </button>
            <button onClick={handleLogout} className="btn" style={{ background: '#334155', width: '50px', height: '45px', padding: 0, borderRadius: '0.75rem' }}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
