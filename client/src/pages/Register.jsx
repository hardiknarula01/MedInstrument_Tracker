import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'hospital_staff' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '5rem auto' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} style={{ width: '100%', marginBottom: 8 }} />
        <input name="email" placeholder="Email" onChange={handleChange} style={{ width: '100%', marginBottom: 8 }} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} style={{ width: '100%', marginBottom: 8 }} />
        <select name="role" onChange={handleChange} style={{ width: '100%', marginBottom: 8 }}>
          <option value="hospital_staff">Hospital Staff</option>
          <option value="sales">Sales</option>
          <option value="admin">Admin</option>
        </select>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%' }}>Register</button>
      </form>
    </div>
  );
};

export default Register;