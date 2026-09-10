import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CategoryDetail from './pages/CategoryDetail';
import Products from './pages/Product';
import Inventory from './pages/Inventory';
import UsageRecords from './pages/UsageRecords';
import Reports from './pages/Reports';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>

            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/category/:id" element={<CategoryDetail />} />
            <Route path="/products" element={<Products />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/usage" element={<UsageRecords />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;