import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Usage: <ProtectedRoute roles={['admin']}><AdminPage /></ProtectedRoute>
const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;