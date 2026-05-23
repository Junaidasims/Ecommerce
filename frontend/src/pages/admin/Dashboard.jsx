import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, IndianRupee, ArrowRight, ShieldCheck, Settings, ShoppingBag } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    activeUsersCount: 0,
    pendingOrdersCount: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch products and all orders to compile metrics
      const [productsRes, ordersRes] = await Promise.all([
        axios.get(`${backendUrl}/api/products`),
        axios.get(`${backendUrl}/api/orders`)
      ]);

      const products = productsRes.data;
      const orders = ordersRes.data;

      // Compute statistics
      const revenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + parseFloat(o.total), 0);

      const pending = orders.filter(o => o.status === 'pending').length;

      // Deduplicate users from orders for simple metrics
      const uniqueUsers = new Set(orders.map(o => o.user_id)).size;

      setStats({
        totalRevenue: revenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        activeUsersCount: Math.max(uniqueUsers, 1),
        pendingOrdersCount: pending
      });

      // Grab first 5 recent orders
      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
      setError('Could not retrieve dashboard statistics. Ensure your server is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Compiling admin insights...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      {/* Title */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={32} style={{ color: 'var(--accent-primary)' }} />
            Admin Control Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Operational metrics, order tracking, and inventory control.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/products" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            <Package size={16} />
            Manage Products
          </Link>
          <Link to="/admin/orders" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            <ShoppingCart size={16} />
            Process Orders
          </Link>
        </div>
      </div>

      {error && (
        <div className="glass-card" style={{ padding: '1rem', color: '#f87171', borderLeft: '4px solid var(--error)', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {/* KPI 1 */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            background: 'rgba(0, 242, 254, 0.1)',
            color: 'var(--accent-secondary)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <IndianRupee size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Total Revenue</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>₹{stats.totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--accent-primary)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Total Orders</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.totalOrders}</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--success)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Package size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Catalog Items</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.totalProducts}</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            color: 'var(--warning)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Pending Orders</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.pendingOrdersCount}</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Quick Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2.5rem',
        alignItems: 'start'
      }}
      className="admin-dashboard-grid"
      >
        {/* Recent orders */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Purchases</h2>
            <Link to="/admin/orders" style={{
              fontSize: '0.85rem',
              color: 'var(--accent-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontWeight: 600
            }}>
              View All Orders
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No orders have been received yet.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>User</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>#NEX-{order.id}</td>
                      <td>{order.user?.username || `ID: ${order.user_id}`}</td>
                      <td style={{ fontWeight: 600, color: 'var(--accent-secondary)' }}>₹{parseFloat(order.total).toFixed(2)}</td>
                      <td>
                        <span className={`badge badge-${order.status}`} style={{ fontSize: '0.7rem' }}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick controls panel */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/admin/products" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', padding: '0.85rem' }}>
              <Package size={18} style={{ color: 'var(--accent-secondary)' }} />
              Add New Product Catalog
            </Link>
            <Link to="/admin/orders" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', padding: '0.85rem' }}>
              <ShoppingCart size={18} style={{ color: 'var(--accent-primary)' }} />
              Process Pending Deliveries
            </Link>
            <button onClick={fetchDashboardData} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', padding: '0.85rem' }}>
              <Settings size={18} style={{ color: 'var(--text-muted)' }} />
              Sync Dashboard System
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
