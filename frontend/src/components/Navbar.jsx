import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Package, Shield, Layers } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: isActive ? 'var(--accent-secondary)' : 'var(--text-secondary)',
    fontWeight: isActive ? '600' : '500',
    transition: 'color var(--transition-fast)',
    fontSize: '0.95rem',
  });

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
      padding: '1.25rem 0',
      borderBottom: '1px solid var(--glass-border)',
      background: 'rgba(11, 15, 25, 0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1.5rem',
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          letterSpacing: '-0.03em'
        }}>
          <Layers style={{ color: 'var(--accent-secondary)' }} size={24} />
          <span className="text-gradient">NEXUS</span>
          <span style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', border: '1px solid rgba(99,102,241,0.3)', padding: '0.1rem 0.4rem', borderRadius: '4px', marginLeft: '0.2rem' }}>
            STORE
          </span>
        </Link>

        {/* Desktop Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2.5rem'
        }}>
          <NavLink to="/" style={navLinkStyle}>
            Products
          </NavLink>
          
          {user && (
            <NavLink to="/orders" style={navLinkStyle}>
              <Package size={18} />
              My Orders
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin" style={navLinkStyle}>
              <Shield size={18} style={{ color: 'var(--accent-primary)' }} />
              Admin
            </NavLink>
          )}
        </div>

        {/* User Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          {/* Cart Icon */}
          <Link to="/cart" style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
            transition: 'var(--transition-fast)'
          }}
          className="cart-btn"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-secondary)';
            e.currentTarget.style.color = 'var(--accent-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--glass-border)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          >
            <ShoppingCart size={18} />
            {getCartCount() > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, #4f46e5 100%)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)'
              }}>
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* User Profile / Login */}
          {user ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                lineHeight: 1.2
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.username}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }} className={`badge-${user.role}`}>
                  {user.role}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
                title="Logout"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.color = '#ef4444';
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.9rem',
              borderRadius: '6px'
            }}>
              <User size={16} />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
