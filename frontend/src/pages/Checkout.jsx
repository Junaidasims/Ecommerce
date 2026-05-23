import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { CreditCard, Truck, ShieldCheck, ArrowLeft, Loader, CheckCircle2 } from 'lucide-react';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !address || !city || !postalCode) {
      setError('Please provide all shipping address details.');
      return;
    }

    if (!cardNumber || !cardExpiry || !cardCvv) {
      setError('Please provide credit card billing details for mock checkout.');
      return;
    }

    setLoading(true);

    try {
      const items = cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }));

      const res = await axios.post(`${backendUrl}/api/orders`, { items });
      
      setSuccess(true);
      clearCart();
    } catch (err) {
      console.error('Checkout failed:', err);
      setError(err.response?.data?.message || 'Failed to place the order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container" style={{
        padding: '5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '1.5rem',
        animation: 'fadeIn var(--transition-slow) forwards'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: 'var(--success)'
        }}>
          <CheckCircle2 size={40} />
        </div>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }} className="text-gradient">
            Order Placed Successfully!
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', fontSize: '1.05rem' }}>
            Thank you for your purchase. We are processing your request. You can track your purchase order status in your dashboard.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/orders" className="btn btn-primary">
            View My Orders
          </Link>
          <Link to="/" className="btn btn-secondary">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
          No items in your cart to checkout.
        </p>
        <Link to="/" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <Link to="/cart" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          marginBottom: '1rem',
          transition: 'color var(--transition-fast)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={16} />
          Return to Cart
        </Link>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800 }}>Secure Checkout</h1>
      </div>

      {error && (
        <div className="glass-card" style={{
          padding: '1rem',
          color: '#f87171',
          borderLeft: '4px solid var(--error)',
          marginBottom: '2rem',
          background: 'rgba(239, 68, 68, 0.05)'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2.5rem',
        alignItems: 'start'
      }}
      className="checkout-layout"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Shipping details */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Truck size={20} style={{ color: 'var(--accent-secondary)' }} />
              Shipping Address
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label" htmlFor="fullName">Full Name</label>
                <input 
                  id="fullName"
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="address">Street Address</label>
                <input 
                  id="address"
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. 123 Cyberpunk Ave, Suite 404"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label className="form-label" htmlFor="city">City</label>
                  <input 
                    id="city"
                    type="text" 
                    className="form-input" 
                    placeholder="Neo City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label className="form-label" htmlFor="postalCode">Postal Code</label>
                  <input 
                    id="postalCode"
                    type="text" 
                    className="form-input" 
                    placeholder="90001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment details */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <CreditCard size={20} style={{ color: 'var(--accent-primary)' }} />
              Payment Details (Mock)
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label" htmlFor="cardNumber">Credit Card Number</label>
                <input 
                  id="cardNumber"
                  type="text" 
                  className="form-input" 
                  placeholder="4000 1234 5678 9010"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label className="form-label" htmlFor="cardExpiry">Expiration Date</label>
                  <input 
                    id="cardExpiry"
                    type="text" 
                    className="form-input" 
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    maxLength={5}
                    required
                  />
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label className="form-label" htmlFor="cardCvv">CVV</label>
                  <input 
                    id="cardCvv"
                    type="password" 
                    className="form-input" 
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    maxLength={4}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total details summary */}
        <div className="glass-panel" style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          maxWidth: '420px',
          width: '100%',
          marginLeft: 'auto'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Checkout Summary</h2>

          {/* Mini list */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxHeight: '200px',
            overflowY: 'auto',
            borderBottom: '1px solid var(--glass-border)',
            paddingBottom: '1rem',
            paddingRight: '4px'
          }}>
            {cartItems.map(item => (
              <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                  {item.product.name} <b style={{ color: 'var(--text-primary)' }}>x{item.quantity}</b>
                </span>
                <span style={{ fontWeight: 600 }}>
                  ₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Items Total:</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Shipping Fee:</span>
              <span style={{ color: 'var(--success)' }}>Free</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 700,
              fontSize: '1.25rem',
              borderTop: '1px solid var(--glass-border)',
              paddingTop: '1rem',
              marginTop: '0.25rem'
            }}>
              <span>Total Bill:</span>
              <span style={{ color: 'var(--accent-secondary)' }}>₹{getCartTotal().toFixed(2)}</span>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Loader size={16} className="animate-spin" />
                Processing Order...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} />
                Pay & Complete Order
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
