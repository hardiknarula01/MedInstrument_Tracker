import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TestTube, Wind, Radiation, Monitor, CreditCard, Package } from 'lucide-react';
import api from '../api/axios';

const CATEGORY_META = {
  'ABG Reagent Pack': { icon: TestTube, color: '#2563eb', bg: '#eff6ff' },
  'Circuit': { icon: Wind, color: '#16a34a', bg: '#f0fdf4' },
  'Radiation Drape': { icon: Radiation, color: '#ca8a04', bg: '#fefce8' },
  'Monitor Accessories': { icon: Monitor, color: '#dc2626', bg: '#fef2f2' },
  'Cartridges': { icon: CreditCard, color: '#7c3aed', bg: '#f5f3ff' }
};
const DEFAULT_META = { icon: Package, color: '#475569', bg: '#f8fafc' };

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          api.get('/categories'),
          api.get('/subcategories')
        ]);
        setCategories(catRes.data);
        setSubcategories(subRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const subsFor = (categoryId) =>
    subcategories.filter((s) => (s.category?._id || s.category) === categoryId);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2 style={{ marginBottom: 4 }}>Dashboard</h2>
      <p style={{ color: '#64748b', marginTop: 0 }}>
        Manage Products | Track Inventory | Record Usage | Generate Reports
      </p>

      {categories.length === 0 && (
        <p>No categories found. Run <code>npm run seed</code> in the server folder.</p>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginTop: '1.5rem'
      }}>
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat.name] || DEFAULT_META;
          const Icon = meta.icon;
          const subs = subsFor(cat._id);

          return (
            <div
              key={cat._id}
              onClick={() => navigate(`/category/${cat._id}`)}
              style={{
                background: meta.bg,
                border: `1px solid ${meta.color}22`,
                borderRadius: 12,
                padding: '1.25rem',
                cursor: 'pointer'
              }}
            >
              <Icon size={32} color={meta.color} />
              <h3 style={{ margin: '0.75rem 0 0.5rem', color: '#0f2542' }}>{cat.name}</h3>
              {subs.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#475569', fontSize: '0.9rem' }}>
                  {subs.slice(0, 5).map((s) => <li key={s._id}>{s.name}</li>)}
                </ul>
              ) : (
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Sub-cards to be defined</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;