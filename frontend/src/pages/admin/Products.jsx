import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, X, ShieldAlert, Loader } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [activeProductId, setActiveProductId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${backendUrl}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Could not retrieve products. Check backend connectivity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [backendUrl]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setStock('');
    setImageUrl('');
    setActiveProductId(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setModalMode('add');
    setShowModal(true);
  };

  const handleOpenEditModal = (product) => {
    setName(product.name);
    setDescription(product.description || '');
    setPrice(product.price);
    setStock(product.stock);
    setImageUrl(product.image_url || '');
    setActiveProductId(product.id);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || price === undefined || stock === undefined) {
      setError('Please fill in name, price, and stock levels.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        image_url: imageUrl || undefined
      };

      if (modalMode === 'add') {
        await axios.post(`${backendUrl}/api/products`, payload);
      } else {
        await axios.put(`${backendUrl}/api/products/${activeProductId}`, payload);
      }

      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error('Submission failed:', err);
      setError(err.response?.data?.message || 'Error occurred during product submission.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you absolutely sure you want to delete this product? This action is permanent.')) {
      return;
    }

    setError('');
    try {
      await axios.delete(`${backendUrl}/api/products/${productId}`);
      fetchProducts();
    } catch (err) {
      console.error('Deletion failed:', err);
      setError('Could not delete product. Check credentials.');
    }
  };

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
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800 }}>Manage Catalog</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Add, modify, or remove items from the digital marketplace catalog.</p>
        </div>

        <button onClick={handleOpenAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} />
          New Product
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
          <ShieldAlert size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Main product loader/table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader size={36} className="animate-spin" style={{ color: 'var(--accent-secondary)' }} />
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No items in the catalog. Press "New Product" to seed one.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Pricing</th>
                  <th>Stock Available</th>
                  <th>Action Hooks</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    {/* Details Column */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          style={{
                            width: '50px',
                            height: '40px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            background: 'var(--bg-tertiary)'
                          }}
                        />
                        <div>
                          <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>{product.name}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '280px' }}>
                            {product.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Price Column */}
                    <td style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>
                      ₹{parseFloat(product.price).toFixed(2)}
                    </td>

                    {/* Stock Column */}
                    <td>
                      <span className={`badge ${product.stock <= 0 ? 'badge-cancelled' : product.stock <= 5 ? 'badge-pending' : 'badge-delivered'}`}>
                        {product.stock} units
                      </span>
                    </td>

                    {/* Controls Column */}
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleOpenEditModal(product)} 
                          className="btn-secondary" 
                          style={{
                            padding: '0.4rem', 
                            borderRadius: '6px', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--glass-border)',
                            background: 'var(--bg-tertiary)',
                            color: 'var(--text-primary)'
                          }}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)} 
                          className="btn-danger" 
                          style={{
                            padding: '0.4rem', 
                            borderRadius: '6px', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444'
                          }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modern Dialog/Modal for Add/Edit */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(5, 7, 13, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="glass-panel animate-fade-in" style={{
            maxWidth: '500px',
            width: '100%',
            padding: '2.5rem',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            position: 'relative'
          }}>
            {/* Modal Exit */}
            <button 
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }} className="text-gradient">
              {modalMode === 'add' ? 'Add New Product' : 'Modify Product'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label" htmlFor="pname">Product Name</label>
                <input 
                  id="pname"
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Cyberpunk Mechanical Keyboard"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="pdesc">Description</label>
                <textarea 
                  id="pdesc"
                  className="form-input" 
                  placeholder="Enter details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label" htmlFor="pprice">Price (₹)</label>
                  <input 
                    id="pprice"
                    type="number" 
                    step="0.01"
                    className="form-input" 
                    placeholder="99.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label" htmlFor="pstock">Stock Quantity</label>
                  <input 
                    id="pstock"
                    type="number" 
                    className="form-input" 
                    placeholder="20"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="pimage">Image URL</label>
                <input 
                  id="pimage"
                  type="text" 
                  className="form-input" 
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="btn btn-secondary" 
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
