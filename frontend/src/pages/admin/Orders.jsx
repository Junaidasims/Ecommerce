import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Eye, EyeOff, Loader, RefreshCw, AlertCircle } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${backendUrl}/api/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError('Could not retrieve orders database. Ensure backend server is active.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [backendUrl]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setError('');
    try {
      await axios.put(`${backendUrl}/api/orders/${orderId}/status`, { status: newStatus });
      // Update local state instead of reloading completely
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Status update failed:', err);
      setError('Could not update status. Ensure you have administrator rights.');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(prevId => prevId === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading client orders ledger...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800 }}>Purchases Processing</h1>
          <p style={{ color: 'var(--text-secondary)' }}>View details, inspect items, and update customer order shipment statuses.</p>
        </div>

        <button onClick={fetchOrders} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <RefreshCw size={16} />
          Reload
        </button>
      </div>

      {error && (
        <div className="glass-card" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          color: '#f87171',
          borderLeft: '4px solid var(--error)',
          marginBottom: '2rem',
          background: 'rgba(239, 68, 68, 0.05)'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No orders have been received yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => {
            const isExpanded = expandedOrderId === order.id;
            const isUpdating = updatingId === order.id;

            return (
              <div 
                key={order.id} 
                className="glass-panel animate-fade-in" 
                style={{
                  border: isExpanded ? '1px solid var(--accent-secondary)' : '1px solid var(--glass-border)',
                  overflow: 'hidden'
                }}
              >
                {/* Main Row summary */}
                <div style={{
                  padding: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.5rem'
                }}>
                  {/* Grid fields */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '1.5rem',
                    flexGrow: 1
                  }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Order ID</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>#NEX-{order.id}</span>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>User Account</span>
                      <span style={{ fontWeight: 600 }}>{order.user?.username || `ID: ${order.user_id}`}</span>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Price</span>
                      <span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>
                        ₹{parseFloat(order.total).toFixed(2)}
                      </span>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Placed Date</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{formatDate(order.created_at)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    {/* Status Update dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status:</span>
                      <select 
                        id={`status-select-${order.id}`}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={isUpdating}
                        className="form-input"
                        style={{
                          padding: '0.4rem 2rem 0.4rem 0.75rem',
                          fontSize: '0.85rem',
                          background: 'var(--bg-tertiary)',
                          borderRadius: '6px',
                          border: '1px solid var(--glass-border)',
                          cursor: 'pointer',
                          color: 'var(--text-primary)',
                          width: '140px'
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* View Details trigger */}
                    <button 
                      onClick={() => toggleOrderDetails(order.id)}
                      className="btn btn-secondary"
                      style={{
                        padding: '0.45rem 0.9rem',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      {isExpanded ? <EyeOff size={14} /> : <Eye size={14} />}
                      Items
                    </button>
                  </div>
                </div>

                {/* Sub items expansion details */}
                {isExpanded && (
                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(0, 0, 0, 0.25)',
                    borderTop: '1px solid var(--glass-border)'
                  }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      Line Items Details ({order.items?.length || 0})
                    </h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {order.items?.map(item => (
                        <div 
                          key={item.id} 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            paddingBottom: '0.75rem',
                            borderBottom: '1px solid rgba(255,255,255,0.03)'
                          }}
                        >
                          <img 
                            src={item.product?.image_url} 
                            alt={item.product?.name} 
                            style={{
                              width: '50px',
                              height: '38px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                              background: 'var(--bg-tertiary)'
                            }}
                          />
                          <div style={{ flexGrow: 1 }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block' }}>{item.product?.name || 'Deleted Product'}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quantity: {item.quantity}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 600 }}>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                              (₹{parseFloat(item.price).toFixed(2)} each)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
