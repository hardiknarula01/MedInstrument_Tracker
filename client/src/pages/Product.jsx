import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../components/ProductForm';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const subcategory = searchParams.get('subcategory') || '';
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (!category) { setSubcategories([]); return; }
    api.get(`/subcategories?category=${category}`).then((res) => setSubcategories(res.data));
  }, [category]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (subcategory) params.set('subcategory', subcategory);
      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [search, category, subcategory]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key === 'category') next.delete('subcategory');
    setSearchParams(next);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleEdit = (product) => { setEditingProduct(product); setShowForm(true); };
  const handleAdd = () => { setEditingProduct(null); setShowForm(true); };
  const handleSaved = () => { setShowForm(false); setEditingProduct(null); loadProducts(); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Products</h2>
        {isAdmin && <button onClick={handleAdd}>+ Add Product</button>}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', margin: '1rem 0', flexWrap: 'wrap' }}>
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => updateParam('search', e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
        />
        <select value={category} onChange={(e) => updateParam('category', e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select value={subcategory} onChange={(e) => updateParam('subcategory', e.target.value)} disabled={!category} style={{ padding: 8, borderRadius: 6 }}>
          <option value="">All Subcategories</option>
          {subcategories.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={th}>Name</th>
              <th style={th}>SKU</th>
              <th style={th}>Category</th>
              <th style={th}>Subcategory</th>
              <th style={th}>Unit</th>
              <th style={th}>Price</th>
              {isAdmin && <th style={th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan={isAdmin ? 7 : 6} style={{ padding: 16, textAlign: 'center', color: '#94a3b8' }}>No products found</td></tr>
            ) : products.map((p) => (
              <tr key={p._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={td}>{p.name}</td>
                <td style={td}>{p.sku}</td>
                <td style={td}>{p.category?.name}</td>
                <td style={td}>{p.subcategory?.name}</td>
                <td style={td}>{p.unit}</td>
                <td style={td}>{p.price ?? '-'}</td>
                {isAdmin && (
                  <td style={td}>
                    <button onClick={() => handleEdit(p)} style={{ marginRight: 6 }}>Edit</button>
                    <button onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <ProductForm categories={categories} product={editingProduct} onClose={() => setShowForm(false)} onSaved={handleSaved} />
      )}
    </div>
  );
};

const th = { padding: '10px 12px', fontSize: '0.85rem', color: '#475569' };
const td = { padding: '10px 12px', fontSize: '0.9rem' };

export default Products;