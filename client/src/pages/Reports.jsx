import { useEffect, useState } from 'react';
import api from '../api/axios';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/reports/dashboard-stats'),
      api.get('/reports/low-stock'),
      api.get('/reports/category-breakdown')
    ]).then(([s, l, b]) => {
      setStats(s.data); setLowStock(l.data); setBreakdown(b.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading reports...</p>;

  const maxUsed = Math.max(...breakdown.map((b) => b.totalUsed), 1);

  return (
    <div>
      <h2>Reports</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, margin: '1rem 0' }}>
        <StatCard label="Total Products" value={stats.totalProducts} />
        <StatCard label="Low Stock Items" value={stats.lowStockCount} color="#dc2626" />
        <StatCard label="Usage This Month" value={stats.usageThisMonth} />
        <StatCard label="Total Inventory Units" value={stats.totalInventoryUnits} />
      </div>

      <h3>Category Breakdown (Usage)</h3>
      {breakdown.map((b) => (
        <div key={b._id} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span>{b.categoryName}</span><span>{b.totalUsed}</span>
          </div>
          <div style={{ background: '#e2e8f0', borderRadius: 4, height: 8 }}>
            <div style={{ width: `${(b.totalUsed / maxUsed) * 100}%`, background: '#2563eb', height: 8, borderRadius: 4 }} />
          </div>
        </div>
      ))}

      <h3 style={{ marginTop: '1.5rem' }}>Low Stock Items</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead><tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
          <th style={th}>Product</th><th style={th}>SKU</th><th style={th}>Stock</th><th style={th}>Reorder Level</th><th style={th}>Shortfall</th>
        </tr></thead>
        <tbody>
          {lowStock.length === 0 ? (
            <tr><td colSpan={5} style={{ padding: 16, textAlign: 'center', color: '#94a3b8' }}>No low stock items</td></tr>
          ) : lowStock.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={td}>{item.productName}</td><td style={td}>{item.sku}</td>
              <td style={td}>{item.quantityInStock}</td><td style={td}>{item.reorderLevel}</td>
              <td style={{ ...td, color: '#dc2626', fontWeight: 600 }}>{item.shortfall}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StatCard = ({ label, value, color = '#0f2542' }) => (
  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '1rem' }}>
    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{label}</p>
    <p style={{ margin: '4px 0 0', fontSize: '1.5rem', fontWeight: 700, color }}>{value}</p>
  </div>
);

const th = { padding: '10px 12px', fontSize: '0.85rem', color: '#475569' };
const td = { padding: '10px 12px', fontSize: '0.9rem' };

export default Reports;