import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, TestTube, Wind, Radiation, Activity, CreditCard, Package } from 'lucide-react';
import api from '../api/axios';

const CATEGORY_STYLE = {
  'ABG Reagent Pack':    { icon: TestTube,   accent: 'brand-blue' },
  'Circuit':             { icon: Wind,       accent: 'brand-teal' },
  'Radiation Drape':     { icon: Radiation,  accent: 'navy-900' },
  'Monitor Accessories': { icon: Activity,   accent: 'brand-blue' },
  'Cartridges':          { icon: CreditCard, accent: 'brand-teal' }
};
const DEFAULT_STYLE = { icon: Package, accent: 'navy-900' };

const ACCENT_CLASSES = {
  'brand-blue': { badge: 'bg-brand-blue', tint: 'bg-brand-blue/10', iconText: 'text-brand-blue' },
  'brand-teal': { badge: 'bg-brand-teal', tint: 'bg-brand-teal/10', iconText: 'text-brand-teal' },
  'navy-900':   { badge: 'bg-navy-900',   tint: 'bg-navy-900/5',   iconText: 'text-navy-900' }
};

// Sample paths — safe to keep even before the files exist, since the
// fallback below catches a missing image with no console error or broken icon.
const SUBCATEGORY_IMAGES = {
  '150 Pack': '/product/reagent-pack/150pack.png',
  '300 Pack': '/product/reagent-pack/300pack.png',
  'Heated Breathing Circuit': '/product/breathing-circuit.png',
  'Pediatric': '/product/circuit/pedatric.png',
  'Neonatal': '/product/circuit/neonate.png',
  'Adult': '/product/circuit/adult.png',
  'ECG Cable': '/product/Monitor/ECG-cabel.png',
  'BP': '/product/Monitor/BP-cabel.png',
  'Cuff': '/product/Monitor/cuff-cabel.png',
  'SpO₂ Sensor': '/product/Monitor/Spo2-cabel.png',
  'Temperature Cable': '/product/Monitor/Temp-cabel.png',
  'CG4+ Cartridge': '/product/catridge/CG4.png',
  'EG7+ Cartridge': '/product/catridge/EG7+.png',
  'cTnI Cartridge': '/product/catridge/cTNI.png',
  'PT/INR Cartridge': '/product/catridge/PT-INR.png'
};

const SubImage = ({ src, alt, accent }) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`flex h-full w-full items-center justify-center ${accent.tint}`}>
        <Package className={`h-8 w-8 ${accent.iconText} opacity-60`} strokeWidth={1.5} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
    />
  );
};

const CategoryDetail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
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

  if (loading) return <div className="flex h-64 items-center justify-center text-sm text-muted">Loading…</div>;
  if (error) return <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>;

  const style = CATEGORY_STYLE[category?.name] || DEFAULT_STYLE;
  const Icon = style.icon;
  const accent = ACCENT_CLASSES[style.accent] || ACCENT_CLASSES['navy-900'];

  return (
    <div>
     <button
        onClick={() => navigate('/')}
         className="group mb-6 inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 text-sm font-medium text-muted shadow-sm transition-all hover:border-brand-blue/25 hover:bg-brand-blue/5 hover:text-brand-blue hover:shadow-md"
      >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mist transition-colors group-hover:bg-white">
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={2.5} />
      </span>
     Back to Dashboard
     </button> 

      <div className="mb-8 flex items-center gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent.badge}`}>
          <Icon className="h-6 w-6 text-white" strokeWidth={2} />
        </div>
        <div>
          <p className="font-display text-2xl font-semibold text-ink sm:text-3xl">{category?.name}</p>
          <p className="mt-0.5 text-sm text-muted">
            {subcategories.length} {subcategories.length === 1 ? 'subcategory' : 'subcategories'}
          </p>
        </div>
      </div>

      {subcategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-mist px-6 py-16 text-center">
          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${accent.tint}`}>
            <Icon className={`h-6 w-6 ${accent.iconText}`} strokeWidth={2} />
          </div>
          <p className="font-medium text-ink">Sub-cards to be defined</p>
          <p className="mt-1 max-w-xs text-sm text-muted">Subcategories for {category?.name} haven't been added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {subcategories.map((sub) => (
            <Link
              key={sub._id}
              to={`/products?subcategory=${sub._id}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-32 w-full overflow-hidden bg-mist sm:h-36">
                <SubImage src={SUBCATEGORY_IMAGES[sub.name]} alt={sub.name} accent={accent} />
              </div>
              <div className="flex items-center justify-between gap-2 p-3.5">
                <p className="text-sm font-medium text-ink">{sub.name}</p>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDetail;