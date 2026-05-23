import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';

// Auth Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const App = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Stick navbar */}
      <Navbar />

      {/* Main Pages viewport */}
      <main style={{ flexGrow: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />

          {/* User Protected Routes */}
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } 
          />

          {/* Admin Protected Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            } 
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Futuristic footer */}
      <footer style={{
        padding: '2.5rem 0',
        borderTop: '1px solid var(--glass-border)',
        background: 'rgba(11, 15, 25, 0.9)',
        marginTop: 'auto',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <span>© 2026 Nexus E-commerce. Built with React & Node.js SQL database integration.</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ transition: 'color var(--transition-fast)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Privacy Policy</a>
            <a href="#" style={{ transition: 'color var(--transition-fast)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Terms of Service</a>
            <a href="#" style={{ transition: 'color var(--transition-fast)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
