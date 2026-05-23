import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Search, Loader, SlidersHorizontal, RefreshCw } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'instock', 'outofstock'

  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${backendUrl}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Could not connect to the store API. Ensure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [backendUrl]);

  // Filter products based on search and stock filter
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (stockFilter === 'instock') {
      return matchesSearch && product.stock > 0;
    }
    if (stockFilter === 'outofstock') {
      return matchesSearch && product.stock <= 0;
    }
    return matchesSearch;
  });

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3.5rem',
        animation: 'fadeIn var(--transition-slow) forwards'
      }}>
        <h1 className="text-gradient-neon" style={{
          fontSize: '3rem',
          fontWeight: 800,
          marginBottom: '1rem',
          letterSpacing: '-0.04em'
        }}>
          Next-Gen Tech Hub
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Discover elite performance mechanical keyboards, headsets, workspaces, and premium gadgets selected for designers and builders.
        </p>
      </div>

      {/* Control bar */}
      <div className="glass-panel" style={{
        padding: '1.25rem',
        marginBottom: '2.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.25rem',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Search */}
        <div style={{
          position: 'relative',
          flexGrow: 1,
          maxWidth: '450px',
          width: '100%'
        }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input 
            type="text" 
            placeholder="Search premium products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{
              paddingLeft: '2.75rem'
            }}
          />
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem'
          }}>
            <SlidersHorizontal size={16} />
            <span>Availability:</span>
          </div>

          <div style={{
            display: 'flex',
            background: 'var(--bg-tertiary)',
            borderRadius: '8px',
            padding: '2px',
            border: '1px solid var(--glass-border)'
          }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'instock', label: 'In Stock' },
              { id: 'outofstock', label: 'Out of Stock' }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setStockFilter(filter.id)}
                style={{
                  background: stockFilter === filter.id ? 'var(--accent-primary)' : 'transparent',
                  border: 'none',
                  color: stockFilter === filter.id ? '#ffffff' : 'var(--text-secondary)',
                  padding: '0.4rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'var(--transition-fast)'
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <button 
            onClick={fetchProducts} 
            className="btn btn-secondary" 
            style={{
              padding: '0.5rem',
              borderRadius: '8px'
            }}
            title="Reload products"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Main product states */}
      {loading ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          gap: '1rem'
        }}>
          <Loader size={40} className="animate-spin" style={{ color: 'var(--accent-secondary)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Retrieving products collection...</p>
        </div>
      ) : error ? (
        <div className="glass-panel" style={{
          padding: '2.5rem',
          textAlign: 'center',
          borderLeft: '4px solid var(--error)'
        }}>
          <p style={{ color: '#f87171', fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchProducts} className="btn btn-primary">Try Again</button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass-panel" style={{
          padding: '4rem 2rem',
          textAlign: 'center'
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>No premium products match your query.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
