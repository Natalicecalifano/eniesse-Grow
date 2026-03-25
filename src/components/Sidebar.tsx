import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  User, 
  Users, 
  LogOut, 
  LayoutDashboard, 
  ShieldCheck,
  CreditCard,
  Settings
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { auth } from '@/src/firebase';
import { api } from '@/src/services/api';
import { UserProfile } from '@/src/types';

const ADMIN_EMAIL = "sousanaty09@gmail.com";

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'Trilhas', path: '/trilhas' },
  { icon: Users, label: 'Especialistas', path: '/especialistas' },
  { icon: User, label: 'Meu Perfil', path: '/perfil' },
  { icon: CreditCard, label: 'Minha Assinatura', path: '/assinatura' },
];

export const Sidebar = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.currentUser) {
        const p = await api.users.getProfile(auth.currentUser.uid);
        setProfile(p);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  const isAdmin = profile?.role === 'admin' || auth.currentUser?.email === ADMIN_EMAIL;

  return (
    <aside className="w-64 h-screen bg-white border-r border-primary/5 flex flex-col fixed left-0 top-0 z-40">
      <div className="p-10">
        <Link to="/dashboard">
          <h1 className="text-3xl font-bold text-primary italic tracking-tight">Eniesse</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent mt-1">Grow Platform</p>
        </Link>
      </div>

      <nav className="flex-1 px-6 space-y-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group',
                isActive
                  ? 'bg-primary text-white shadow-[0_10px_20px_rgba(20,69,36,0.15)]'
                  : 'text-ink/60 hover:bg-light-green/10 hover:text-primary'
              )
            }
          >
            <item.icon className={cn("w-5 h-5 transition-transform duration-300", "group-hover:scale-110")} />
            <span className="font-semibold text-sm tracking-wide">{item.label}</span>
          </NavLink>
        ))}

        {isAdmin && (
          <div className="mt-12 pt-8 border-t border-primary/5">
            <p className="px-5 text-[10px] font-black uppercase tracking-widest text-primary/30 mb-4">Administração</p>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group border border-accent/20',
                  isActive
                    ? 'bg-accent text-primary shadow-[0_10px_20px_rgba(255,99,33,0.15)]'
                    : 'text-accent hover:bg-accent/10'
                )
              }
            >
              <ShieldCheck className={cn("w-5 h-5 transition-transform duration-300", "group-hover:scale-110")} />
              <span className="font-bold text-sm tracking-wide uppercase italic">Painel Admin</span>
            </NavLink>
          </div>
        )}
      </nav>

      <div className="p-6 border-t border-primary/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl text-ink/60 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm tracking-wide">Sair</span>
        </button>
      </div>
    </aside>
  );
};
