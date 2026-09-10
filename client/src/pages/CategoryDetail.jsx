import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const CategoryDetail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          api.get(`/categories/${id}`),
          api.get(`/subcategories?category=${id}`)
        ]);
        setCategory(catRes.data);
        setSubcategories(subRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load category');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <button onClick={() => navigate('/')} style={{ marginBottom: '1rem' }}>&larr; Back to Dashboard</button>
      <h2>{category?.name}</h2>
      <p style={{ color: '#64748b' }}>{subcategories.length} subcategories</p>

      {subcategories.length === 0 ? (
        <p>No subcategories yet. Sub-cards to be defined.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {subcategories.map((sub) => (
            <Link
              key={sub._id}
              to={`/products?subcategory=${sub._id}`}
              style={{
                display: 'block', padding: '1rem', background: '#fff',
                border: '1px solid #e2e8f0', borderRadius: 8,
                textDecoration: 'none', color: '#0f2542', fontWeight: 500
              }}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDetail;