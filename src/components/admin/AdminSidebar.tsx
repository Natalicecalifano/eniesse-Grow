import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  ArrowLeft,
  GraduationCap
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: BookOpen, label: 'Trilhas', path: '/admin/trilhas' },
  { icon: GraduationCap, label: 'Aulas', path: '/admin/aulas' },
  { icon: Users, label: 'Usuários', path: '/admin/usuarios' },
  { icon: CreditCard, label: 'Assinaturas', path: '/admin/assinaturas' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: Settings, label: 'Configurações', path: '/admin/configuracoes' },
];

export const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-white border-r border-black/5 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8 border-b border-black/5">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black italic">E</div>
          <span className="text-xl font-bold text-primary italic tracking-tight">Admin Panel</span>
        </div>
        
        <Link 
          to="/dashboard" 
          className="flex items-center justify-center gap-3 w-full py-4 bg-accent/10 text-accent hover:bg-accent hover:text-primary transition-all rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border border-accent/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Área do Aluno
        </Link>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-ink/60 hover:bg-accent hover:text-primary'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-primary'}`} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-8 border-t border-black/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-accent" />
          <div>
            <p className="text-sm font-bold text-primary italic">Admin</p>
            <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
