import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-ink lg:flex-row">
      <aside className="relative overflow-hidden bg-navy-900 px-7 py-10 text-white lg:flex lg:w-[42%] lg:flex-col lg:justify-center lg:px-14 lg:py-16">
        <span className="hidden lg:block absolute -top-36 -left-40 h-[480px] w-[480px] border border-white/[0.08] [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]" />
        <span className="hidden lg:block absolute -bottom-24 left-16 h-80 w-80 border border-white/5 [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]" />
        <span className="hidden lg:block absolute top-[58%] left-[68%] h-56 w-56 border border-brand-blue/20 [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0%_50%)]" />

        <div className="relative z-10 max-w-[380px]">
          <div className="mb-7 flex w-fit items-center">
              <img
                  src={logo}
                   alt="Med Instrument"
                   className="h-auto w-40 max-w-full object-contain sm:w-48 lg:w-64"
              />
           </div>
          <p className="font-display mb-1 text-xl font-semibold tracking-tight">
            MED <span className="text-brand-blue">INSTRUMENT</span>
          </p>
          <p className="mb-11 text-sm text-white/55">Innovate for health</p>

          <h2 className="font-display mb-4 hidden text-3xl font-semibold leading-snug lg:block">
            Every instrument, accounted for.
          </h2>
          <p className="hidden max-w-[34ch] text-[0.95rem] leading-relaxed text-white/65 lg:block">
            Track inventory, usage and reports across every hospital your team supplies — in one place.
          </p>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-sm animate-rise motion-reduce:animate-none">
          <img src={logo} alt="Med Instrument" className="mb-8 h-10 w-auto" />
          <h1 className="font-display mb-1 text-2xl font-semibold text-ink">Sign in</h1>
          <p className="mb-8 text-sm text-muted">Enter your details to access your dashboard.</p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">Email</label>
              <input
                id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required autoComplete="email"
                className="w-full rounded-lg border border-slate-200 bg-mist px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">Password</label>
              <input
                id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required autoComplete="current-password"
                className="w-full rounded-lg border border-slate-200 bg-mist px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full rounded-lg bg-brand-blue py-3 text-sm font-semibold text-white transition-colors enabled:hover:bg-brand-blue-dark disabled:cursor-default disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-dark"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-muted">
            New here? <Link to="/register" className="font-medium text-brand-blue hover:underline">Create an account</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;