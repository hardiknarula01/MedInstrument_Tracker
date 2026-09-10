import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const UsageRecords = () => {
  const [records, setRecords] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/usage');
      setRecords(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load usage records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); api.get('/products').then((res) => setProducts(res.data)); }, [load]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Usage Records</h2>
        <button onClick={() => setShowForm(true)}>+ Record Usage</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={th}>Date</th><th style={th}>Product</th><th style={th}>Batch</th>
              <th style={th}>Qty Used</th><th style={th}>Hospital</th><th style={th}>Used By</th><th style={th}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 16, textAlign: 'center', color: '#94a3b8' }}>No usage records</td></tr>
            ) : records.map((r) => (
              <tr key={r._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={td}>{new Date(r.usageDate).toLocaleDateString()}</td>
                <td style={td}>{r.product?.name}</td>
                <td style={td}>{r.batch?.batchNumber}</td>
                <td style={td}>{r.quantityUsed}</td>
                <td style={td}>{r.hospital?.name || '-'}</td>
                <td style={td}>{r.usedBy?.name || '-'}</td>
                <td style={td}>{r.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && <UsageForm products={products} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />}
    </div>
  );
};

const UsageForm = ({ products, onClose, onSaved }) => {
  const [productId, setProductId] = useState('');
  const [inventoryOptions, setInventoryOptions] = useState([]);
  const [inventoryId, setInventoryId] = useState('');
  const [quantityUsed, setQuantityUsed] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!productId) { setInventoryOptions([]); return; }
    api.get(`/inventory?product=${productId}`).then((res) => setInventoryOptions(res.data));
  }, [productId]);

  const selectedInv = inventoryOptions.find((i) => i._id === inventoryId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/usage', {
        product: productId,
        batch: selectedInv?.batch?._id,
        inventory: inventoryId,
        quantityUsed: Number(quantityUsed),
        hospital: selectedInv?.hospital?._id,
        notes
      });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record usage');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 10, width: 380 }}>
        <h3>Record Usage</h3>
        <form onSubmit={handleSubmit}>
          <label>Product</label>
          <select value={productId} onChange={(e) => { setProductId(e.target.value); setInventoryId(''); }} required style={inputStyle}>
            <option value="">Select product</option>
            {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>

          <label>Batch / Inventory</label>
          <select value={inventoryId} onChange={(e) => setInventoryId(e.target.value)} required disabled={!productId} style={inputStyle}>
            <option value="">Select batch</option>
            {inventoryOptions.map((i) => (
              <option key={i._id} value={i._id}>{i.batch?.batchNumber} — {i.quantityInStock} in stock</option>
            ))}
          </select>

          <label>Quantity Used</label>
          <input type="number" value={quantityUsed} onChange={(e) => setQuantityUsed(e.target.value)} required style={inputStyle} />

          <label>Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={{ ...inputStyle, height: 50 }} />

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const th = { padding: '10px 12px', fontSize: '0.85rem', color: '#475569' };
const td = { padding: '10px 12px', fontSize: '0.9rem' };
const inputStyle = { display: 'block', width: '100%', marginBottom: 10, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' };

export default UsageRecords;