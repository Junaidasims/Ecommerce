import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to requested page after authentication, or default to home
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    const res = await login(username, password);
    setLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '2rem 1.5rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        maxWidth: '420px',
        width: '100%',
        padding: '2.5rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }} className="text-gradient">
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Access your Nexus Store account
          </p>
        </div>

        {/* Error panel */}
        {error && (
          <div className="glass-card" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            color: '#f87171'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label" htmlFor="username">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input 
                id="username"
                type="text" 
                placeholder="Enter username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input 
                id="password"
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? (
              <span>Connecting...</span>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Info panel for demo */}
        <div style={{
          marginTop: '1.5rem',
          padding: '0.75rem',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--glass-border)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Demo Accounts:</p>
          <p>• Admin: <b>admin</b> / <b>adminpassword</b></p>
          <p>• User: <b>user</b> / <b>userpassword</b></p>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)'
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
