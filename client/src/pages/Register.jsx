import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const ROLES = [
  { value: 'hospital_staff', label: 'Hospital Staff' },
  { value: 'sales', label: 'Sales' },
  { value: 'admin', label: 'Admin' }
];

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'hospital_staff' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-ink lg:flex-row">
      <aside className="relative overflow-hidden bg-navy-900 px-7 py-10 text-white lg:flex lg:w-[42%] lg:flex-col lg:justify-center lg:px-14 lg:py-16">
        <span className="hidden lg:block absolute -top-36 -right-40 h-[480px] w-[480px] border border-white/[0.08] [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]" />
        <span className="hidden lg:block absolute -bottom-24 right-16 h-80 w-80 border border-white/5 [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]" />
        <span className="hidden lg:block absolute top-[55%] left-[12%] h-56 w-56 border border-brand-teal/20 [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]" />

        <div className="relative z-10 max-w-[380px]">
          <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 4v16M4 12h16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <p className="font-display mb-1 text-xl font-semibold tracking-tight">
            MED <span className="text-brand-blue">INSTRUMENT</span>
          </p>
          <p className="mb-11 text-sm text-white/55">Innovate for health</p>

          <h2 className="font-display mb-4 hidden text-3xl font-semibold leading-snug lg:block">
            Set up access for your team.
          </h2>
          <p className="hidden max-w-[34ch] text-[0.95rem] leading-relaxed text-white/65 lg:block">
            Create an account to start tracking products, inventory and usage across every hospital you supply.
          </p>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-sm animate-rise motion-reduce:animate-none">
          <img src={logo} alt="Med Instrument" className="mb-8 h-10 w-auto" />
          <h1 className="font-display mb-1 text-2xl font-semibold text-ink">Create your account</h1>
          <p className="mb-8 text-sm text-muted">Fill in your details to get started.</p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">Full Name</label>
              <input
                id="name" name="name" type="text" value={form.name} onChange={handleChange}
                required autoComplete="name"
                className="w-full rounded-lg border border-slate-200 bg-mist px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">Email</label>
              <input
                id="email" name="email" type="email" value={form.email} onChange={handleChange}
                required autoComplete="email"
                className="w-full rounded-lg border border-slate-200 bg-mist px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">Password</label>
              <input
                id="password" name="password" type="password" value={form.password} onChange={handleChange}
                required autoComplete="new-password"
                className="w-full rounded-lg border border-slate-200 bg-mist px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-ink">Role</label>
              <div className="relative">
                <select
                  id="role" name="role" value={form.role} onChange={handleChange}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-mist px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                >
                  {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full rounded-lg bg-brand-blue py-3 text-sm font-semibold text-white transition-colors enabled:hover:bg-brand-blue-dark disabled:cursor-default disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-dark"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-muted">
            Already have an account? <Link to="/login" className="font-medium text-brand-blue hover:underline">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;