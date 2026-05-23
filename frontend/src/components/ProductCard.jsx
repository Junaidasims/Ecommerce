import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, CheckCircle, AlertTriangle } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="glass-card animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Product Image */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '70%',
        overflow: 'hidden',
        background: 'var(--bg-tertiary)'
      }}>
        <img 
          src={product.image_url} 
          alt={product.name} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-slow)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
        
        {/* Stock Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10
        }}>
          {isOutOfStock ? (
            <span className="badge badge-cancelled" style={{ fontSize: '0.7rem' }}>
              Out of stock
            </span>
          ) : isLowStock ? (
            <span className="badge badge-pending" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <AlertTriangle size={10} />
              Only {product.stock} left
            </span>
          ) : (
            <span className="badge badge-delivered" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <CheckCircle size={10} />
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
            lineHeight: 1.3
          }}>
            {product.name}
          </h3>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.description}
          </p>
        </div>

        {/* Footer actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid var(--glass-border)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Price</span>
            <span style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: 'var(--accent-secondary)'
            }}>
              ₹{parseFloat(product.price).toFixed(2)}
            </span>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="btn btn-primary"
            style={{
              padding: '0.6rem 1.1rem',
              fontSize: '0.85rem',
              opacity: isOutOfStock ? 0.5 : 1,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
          >
            <ShoppingCart size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
