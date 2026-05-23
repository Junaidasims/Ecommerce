import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      // Redirect to login but save cart intent
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{
        padding: '5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--glass-border)',
          color: 'var(--text-muted)'
        }}>
          <ShoppingBag size={32} />
        </div>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
            Explore our state-of-the-art tech selections and find something premium to add to your list.
          </p>
        </div>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2.5rem' }}>
        Your Shopping Cart
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2.5rem',
        alignItems: 'start',
      }}
      className="cart-layout"
      >
        {/* Cart items list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {cartItems.map((item) => (
            <div 
              key={item.product.id} 
              className="glass-panel" 
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1.25rem',
                gap: '1.5rem',
                flexWrap: 'wrap'
              }}
            >
              {/* Product Image */}
              <img 
                src={item.product.image_url} 
                alt={item.product.name} 
                style={{
                  width: '90px',
                  height: '70px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  background: 'var(--bg-tertiary)'
                }}
              />

              {/* Title & Stock Info */}
              <div style={{ flexGrow: 1, minWidth: '180px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{item.product.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Stock available: {item.product.stock}
                </span>
              </div>

              {/* Quantity Selector */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                padding: '2px',
                gap: '0.5rem'
              }}>
                <button 
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Minus size={14} />
                </button>
                <span style={{ width: '24px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>
                  {item.quantity}
                </span>
                <button 
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: item.quantity >= item.product.stock ? 'not-allowed' : 'pointer',
                    opacity: item.quantity >= item.product.stock ? 0.3 : 1,
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => { if (item.quantity < item.product.stock) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Price Calculation */}
              <div style={{
                textAlign: 'right',
                minWidth: '100px'
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Total</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                  ₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                  (₹{parseFloat(item.product.price).toFixed(2)} each)
                </span>
              </div>

              {/* Remove Trigger */}
              <button 
                onClick={() => removeFromCart(item.product.id)}
                className="btn-danger"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  borderRadius: '8px',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ef4444';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.color = '#ef4444';
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {/* Quick Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <Link to="/" className="btn btn-secondary">
              Continue Shopping
            </Link>
            <button onClick={clearCart} className="btn btn-danger" style={{ padding: '0.6rem 1.25rem' }}>
              Clear Cart
            </button>
          </div>
        </div>

        {/* Summary Side Card */}
        <div className="glass-panel" style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          maxWidth: '420px',
          width: '100%',
          marginLeft: 'auto'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Order Summary</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Items Total:</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Shipping:</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Tax (computed):</span>
              <span>₹0.00</span>
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
              <span>Total Price:</span>
              <span style={{ color: 'var(--accent-secondary)' }}>₹{getCartTotal().toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout} 
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
          >
            Proceed to Checkout
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
