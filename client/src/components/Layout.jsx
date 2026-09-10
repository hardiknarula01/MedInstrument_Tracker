import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 220, background: '#0f2542', color: '#fff', padding: '1rem' }}>
        <h3>MedInstrument Tracker</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '2rem' }}>
          <Link to="/" style={{ color: '#fff' }}>Dashboard</Link>
          <Link to="/products" style={{ color: '#fff' }}>Products</Link>
          <Link to="/inventory" style={{ color: '#fff' }}>Inventory</Link>
          <Link to="/usage" style={{ color: '#fff' }}>Usage Records</Link>
          <Link to="/reports" style={{ color: '#fff' }}>Reports</Link>
        </nav>
        <div style={{ marginTop: '3rem' }}>
          <p>{user?.name} ({user?.role})</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: '1.5rem', background: '#f5f7fa' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;