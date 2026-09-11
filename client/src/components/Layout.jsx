import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Boxes, ClipboardList, BarChart3,
  Menu, X, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/inventory', label: 'Inventory', icon: Boxes },
  { to: '/usage', label: 'Usage Records', icon: ClipboardList },
  { to: '/reports', label: 'Reports', icon: BarChart3 }
];

const roleLabel = (role) => {
  if (!role) return '';
  return role.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const SidebarContent = ({ user, onLogout, onNavigate }) => (
  <div className="flex h-full flex-col">
    <div className="flex items-center gap-2.5 px-5 pt-6 pb-8">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 4v16M4 12h16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className="font-display text-sm font-semibold leading-none text-white">
          MED <span className="text-brand-blue">INSTRUMENT</span>
        </p>
        <p className="mt-1 text-[11px] text-white/40">Tracker</p>
      </div>
    </div>

    <nav className="flex-1 space-y-1 px-3">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <item.icon className="h-4 w-4 shrink-0" strokeWidth={2} />
          {item.label}
        </NavLink>
      ))}
    </nav>

    <div className="border-t border-white/10 px-5 py-5">
      <p className="truncate text-sm font-medium text-white">{user?.name}</p>
      <p className="mb-3 text-xs text-white/40">{roleLabel(user?.role)}</p>
      <button
        onClick={onLogout}
        className="flex w-full items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
      >
        <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
        Logout
      </button>
    </div>
  </div>
);

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-mist lg:flex">
      <aside className="hidden w-64 shrink-0 bg-navy-900 lg:block">
        <div className="fixed h-screen w-64">
          <SidebarContent user={user} onLogout={handleLogout} onNavigate={() => {}} />
        </div>
      </aside>

      <div className="flex items-center justify-between border-b border-slate-200 bg-navy-900 px-4 py-3 lg:hidden">
        <img src={logo} alt="Med Instrument" className="h-7 w-auto" />
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-white/80 hover:bg-white/5"
        >
          <Menu className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[80%] bg-navy-900 shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 rounded-lg p-1.5 text-white/60 hover:bg-white/5 hover:text-white"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
            <SidebarContent user={user} onLogout={handleLogout} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <main className="flex-1 p-5 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;