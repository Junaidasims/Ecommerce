import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Lock, ShieldCheck, AlertCircle } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'admin' for sandbox/testing convenience
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await register(username, password, role);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '85vh',
      padding: '2rem 1.5rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '2.5rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }} className="text-gradient">
            Create Account
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Register to start purchasing tech products
          </p>
        </div>

        {/* Error Panel */}
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
            <label className="form-label" htmlFor="password">Password (min 6 characters)</label>
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

          <div>
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input 
                id="confirmPassword"
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Account Role (Testing Mode)</label>
            <div style={{
              display: 'flex',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '8px',
              padding: '4px',
              border: '1px solid var(--glass-border)',
              gap: '4px'
            }}>
              <button
                type="button"
                onClick={() => setRole('user')}
                style={{
                  flex: 1,
                  background: role === 'user' ? 'var(--bg-tertiary)' : 'transparent',
                  border: 'none',
                  color: role === 'user' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '0.6rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <User size={14} />
                Standard User
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                style={{
                  flex: 1,
                  background: role === 'admin' ? 'var(--accent-primary)' : 'transparent',
                  border: 'none',
                  color: role === 'admin' ? '#ffffff' : 'var(--text-secondary)',
                  padding: '0.6rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <ShieldCheck size={14} />
                Administrator
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? (
              <span>Registering...</span>
            ) : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
