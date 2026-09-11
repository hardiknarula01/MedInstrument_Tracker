import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TestTube, Wind, Radiation, Activity, CreditCard, Package,
  Boxes, AlertTriangle, TrendingUp, Layers, ArrowUpRight
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const ACCENT_CLASSES = {
  'brand-blue': { badge: 'bg-brand-blue', iconText: 'text-brand-blue', tint: 'bg-brand-blue/10', ring: 'ring-brand-blue/15', chip: 'bg-brand-blue/10 text-brand-blue' },
  'brand-teal': { badge: 'bg-brand-teal', iconText: 'text-brand-teal', tint: 'bg-brand-teal/10', ring: 'ring-brand-teal/15', chip: 'bg-brand-teal/10 text-brand-teal' },
  'navy-900':   { badge: 'bg-navy-900',   iconText: 'text-navy-900',   tint: 'bg-navy-900/5',  ring: 'ring-navy-900/10',  chip: 'bg-navy-900/5 text-navy-900' }
};

// "image" is a SAMPLE path, not an import — nothing breaks if the file
// doesn't exist yet. Drop a real file at that exact path in client/public/products/
// and it appears automatically, no code change needed. Rename the string
// here any time if you prefer a different filename.
const CATEGORY_META = {
  'ABG Reagent Pack':    { icon: TestTube,   accent: 'brand-blue', image: '/product/abg-reagent-pack.png' },
  'Circuit':             { icon: Wind,       accent: 'brand-teal', image: '/product/breathing-circuit.png' },
  'Radiation Drape':     { icon: Radiation,  accent: 'navy-900',   image: '/products/radiation-drape.jpg' },
  'Monitor Accessories': { icon: Activity,   accent: 'brand-blue', image: '/product/monitor.png' },
  'Cartridges':          { icon: CreditCard, accent: 'brand-teal', image: '/product/cartridges.png' }
};
const DEFAULT_META = { icon: Package, accent: 'navy-900', image: null };

// Falls back to the branded icon panel if the sample path has no real file yet.
const CategoryImage = ({ src, alt, Icon, accent }) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`flex h-full w-full items-center justify-center ${accent.tint}`}>
        <Icon className={`h-10 w-10 ${accent.iconText} opacity-70`} strokeWidth={1.5} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
  );
};

const StatCard = ({ icon: Icon, label, value, accent, warn }) => {
  const cls = ACCENT_CLASSES[accent] || ACCENT_CLASSES['navy-900'];
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${cls.tint}`}>
        <Icon className={`h-5 w-5 ${cls.iconText}`} strokeWidth={2} />
      </div>
      <p className={`font-display text-xl font-semibold ${warn ? 'text-red-600' : 'text-ink'}`}>{value ?? 0}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, subRes, statsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/subcategories'),
          api.get('/reports/dashboard-stats')
        ]);
        setCategories(catRes.data);
        setSubcategories(subRes.data);
        setStats(statsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const subsFor = (categoryId) => subcategories.filter((s) => (s.category?._id || s.category) === categoryId);

  if (loading) return <div className="flex h-64 items-center justify-center text-sm text-muted">Loading dashboard…</div>;
  if (error) return <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>;

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </p>
          <p className="mt-1 text-sm text-muted">Manage products, track inventory, and monitor usage across every hospital you supply.</p>
        </div>
        <img src={logo} alt="Med Instrument" className="hidden h-9 w-auto opacity-90 sm:block" />
      </div>

      {stats && (
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard icon={Boxes} label="Total Products" value={stats.totalProducts} accent="brand-blue" />
          <StatCard icon={AlertTriangle} label="Low Stock Items" value={stats.lowStockCount} accent="navy-900" warn={stats.lowStockCount > 0} />
          <StatCard icon={TrendingUp} label="Usage This Month" value={stats.usageThisMonth} accent="brand-teal" />
          <StatCard icon={Layers} label="Inventory Units" value={stats.totalInventoryUnits} accent="brand-blue" />
        </div>
      )}

      <p className="font-display mb-4 text-lg font-semibold text-ink">Product Categories</p>

      {categories.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-mist px-4 py-6 text-center text-sm text-muted">
          No categories found. Run <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">npm run seed</code> in the server folder.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat.name] || DEFAULT_META;
            const Icon = meta.icon;
            const accent = ACCENT_CLASSES[meta.accent] || ACCENT_CLASSES['navy-900'];
            const subs = subsFor(cat._id);

            return (
              <button
                key={cat._id}
                onClick={() => navigate(`/category/${cat._id}`)}
                className="group relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                <div className="relative h-32 w-full overflow-hidden bg-mist">
                  <CategoryImage src={meta.image} alt={cat.name} Icon={Icon} accent={accent} />
                  <div className={`absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-xl ${accent.badge} shadow-md ring-4 ${accent.ring}`}>
                    <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-display text-base font-semibold text-ink">{cat.name}</p>
                    <ArrowUpRight className="h-4 w-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                  </div>

                  {subs.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {subs.slice(0, 3).map((s) => (
                        <span key={s._id} className={`rounded-full px-2.5 py-1 text-xs font-medium ${accent.chip}`}>{s.name}</span>
                      ))}
                      {subs.length > 3 && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-muted">+{subs.length - 3} more</span>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted">Sub-cards to be defined</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;