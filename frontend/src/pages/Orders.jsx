import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, Calendar, Tag, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const { user } = useAuth();
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${backendUrl}/api/orders/my`);
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError('Could not retrieve orders history. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [backendUrl]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(prevId => prevId === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading order history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#f87171', fontWeight: 600 }}>{error}</p>
        <button onClick={fetchOrders} className="btn btn-primary" style={{ marginTop: '1rem' }}>Retry</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2.5rem' }}>
        Your Purchase Orders
      </h1>

      {orders.length === 0 ? (
        <div className="glass-panel" style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            color: 'var(--text-muted)'
          }}>
            <Package size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Orders Found</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
              You haven't placed any orders yet. Check our premium product catalog to buy items.
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => {
            const isExpanded = expandedOrderId === order.id;
            return (
              <div 
                key={order.id} 
                className="glass-panel" 
                style={{
                  overflow: 'hidden',
                  transition: 'var(--transition-normal)',
                  border: isExpanded ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)'
                }}
              >
                {/* Header summary of order */}
                <div 
                  onClick={() => toggleOrderDetails(order.id)}
                  style={{
                    padding: '1.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1.5rem',
                    background: isExpanded ? 'rgba(99, 102, 241, 0.03)' : 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Order ID</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>#NEX-{order.id}</span>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Placed On</span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {formatDate(order.created_at)}
                      </span>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Order Total</span>
                      <span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>
                        ₹{parseFloat(order.total).toFixed(2)}
                      </span>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Status</span>
                      <span className={`badge badge-${order.status}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <span style={{ fontSize: '0.85rem' }}>{isExpanded ? 'Hide Details' : 'Show Details'}</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{
                    padding: '1.5rem',
                    borderTop: '1px solid var(--glass-border)',
                    background: 'rgba(0, 0, 0, 0.15)'
                  }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                      Purchased Items ({order.items?.length || 0})
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {order.items?.map(item => (
                        <div 
                          key={item.id} 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            paddingBottom: '1rem',
                            borderBottom: '1px solid rgba(255,255,255,0.05)'
                          }}
                        >
                          <img 
                            src={item.product?.image_url} 
                            alt={item.product?.name} 
                            style={{
                              width: '60px',
                              height: '45px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              background: 'var(--bg-tertiary)'
                            }}
                          />
                          <div style={{ flexGrow: 1 }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.product?.name || 'Unknown Product'}</h4>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              Quantity: {item.quantity}
                            </span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                              (₹{parseFloat(item.price).toFixed(2)} each)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '1.5rem',
                      paddingTop: '0.5rem'
                    }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CreditCard size={14} />
                        Paid via Mock Gateway
                      </span>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Shipping Total: </span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{parseFloat(order.total).toFixed(2)}</span>
                      </div>
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
