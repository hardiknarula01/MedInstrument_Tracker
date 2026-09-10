import { useState, useEffect } from 'react';
import api from '../api/axios';

const emptyForm = {
  category: '', subcategory: '', name: '', sku: '', description: '', unit: 'pcs', price: ''
};

const ProductForm = ({ categories, product, onClose, onSaved }) => {
  const [form, setForm] = useState(emptyForm);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        category: product.category?._id || product.category || '',
        subcategory: product.subcategory?._id || product.subcategory || '',
        name: product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        unit: product.unit || 'pcs',
        price: product.price ?? ''
      });
    } else {
      setForm(emptyForm);
    }
  }, [product]);

  useEffect(() => {
    if (!form.category) { setSubcategories([]); return; }
    api.get(`/subcategories?category=${form.category}`).then((res) => setSubcategories(res.data));
  }, [form.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'category' ? { subcategory: '' } : {}) // reset dependent field
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...form, price: form.price ? Number(form.price) : undefined };
      if (product) {
        await api.put(`/products/${product._id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>{product ? 'Edit Product' : 'Add Product'}</h3>
        <form onSubmit={handleSubmit}>
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange} required style={inputStyle}>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>

          <label>Subcategory</label>
          <select name="subcategory" value={form.subcategory} onChange={handleChange} required style={inputStyle} disabled={!form.category}>
            <option value="">Select subcategory</option>
            {subcategories.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>

          <label>Product Name</label>
          <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />

          <label>SKU</label>
          <input name="sku" value={form.sku} onChange={handleChange} required style={inputStyle} />

          <label>Unit</label>
          <input name="unit" value={form.unit} onChange={handleChange} style={inputStyle} />

          <label>Price</label>
          <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} style={inputStyle} />

          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} style={{ ...inputStyle, height: 60 }} />

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
};
const modalStyle = { background: '#fff', padding: '1.5rem', borderRadius: 10, width: 400, maxHeight: '90vh', overflowY: 'auto' };
const inputStyle = { display: 'block', width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' };

export default ProductForm;