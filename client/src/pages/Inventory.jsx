import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Inventory = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const isAdmin = user?.role === 'admin';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = lowStockOnly ? '?lowStock=true' : '';
      const res = await api.get(`/inventory${params}`);
      setInventory(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  }, [lowStockOnly]);

  useEffect(() => { load(); }, [load]);

  const startEdit = (inv) => { setEditingId(inv._id); setEditValue(inv.quantityInStock); };

  const saveEdit = async (id) => {
    try {
      await api.put(`/inventory/${id}`, { quantityInStock: Number(editValue) });
      setEditingId(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <div>
      <h2>Inventory</h2>
      <label style={{ display: 'block', margin: '1rem 0' }}>
        <input type="checkbox" checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)} />
        {' '}Show low stock only
      </label>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={th}>Product</th>
              <th style={th}>Batch</th>
              <th style={th}>Expiry</th>
              <th style={th}>Hospital</th>
              <th style={th}>Stock</th>
              <th style={th}>Reorder Level</th>
              {isAdmin && <th style={th}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 16, textAlign: 'center', color: '#94a3b8' }}>No inventory records</td></tr>
            ) : inventory.map((inv) => {
              const low = inv.quantityInStock <= inv.reorderLevel;
              return (
                <tr key={inv._id} style={{ borderBottom: '1px solid #e2e8f0', background: low ? '#fef2f2' : 'transparent' }}>
                  <td style={td}>{inv.product?.name}</td>
                  <td style={td}>{inv.batch?.batchNumber}</td>
                  <td style={td}>{inv.batch?.expiryDate ? new Date(inv.batch.expiryDate).toLocaleDateString() : '-'}</td>
                  <td style={td}>{inv.hospital?.name || '-'}</td>
                  <td style={td}>
                    {editingId === inv._id ? (
                      <input type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)} style={{ width: 70 }} />
                    ) : (
                      <span style={{ fontWeight: low ? 700 : 400, color: low ? '#dc2626' : 'inherit' }}>{inv.quantityInStock}</span>
                    )}
                  </td>
                  <td style={td}>{inv.reorderLevel}</td>
                  {isAdmin && (
                    <td style={td}>
                      {editingId === inv._id ? (
                        <>
                          <button onClick={() => saveEdit(inv._id)} style={{ marginRight: 6 }}>Save</button>
                          <button onClick={() => setEditingId(null)}>Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => startEdit(inv)}>Adjust</button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

const th = { padding: '10px 12px', fontSize: '0.85rem', color: '#475569' };
const td = { padding: '10px 12px', fontSize: '0.9rem' };

export default Inventory;