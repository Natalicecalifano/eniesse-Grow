import { auth } from '@/src/firebase';
import { User, Bell, Search, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/src/services/api';
import { UserProfile } from '@/src/types';
import { Link } from 'react-router-dom';

const ADMIN_EMAIL = "sousanaty09@gmail.com";

export const Header = () => {
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

  const isAdmin = profile?.role === 'admin' || auth.currentUser?.email === ADMIN_EMAIL;

  return (
    <header className="h-24 bg-white/80 backdrop-blur-md border-b border-primary/5 flex items-center justify-between px-16 sticky top-0 z-30">
      <div className="relative w-[400px] group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30 group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Pesquisar aulas, trilhas..."
          className="w-full pl-14 pr-6 py-3 bg-light-green/10 rounded-2xl border border-transparent focus:outline-none focus:bg-white focus:border-primary/10 transition-all text-sm font-medium placeholder:text-primary/30"
        />
      </div>

      <div className="flex items-center gap-8">
        {isAdmin && (
          <Link 
            to="/admin" 
            className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent hover:bg-accent hover:text-primary transition-all rounded-xl text-[10px] font-black uppercase tracking-widest border border-accent/20"
          >
            <ShieldCheck className="w-4 h-4" />
            Painel Admin
          </Link>
        )}
        
        <button className="relative p-3 text-primary/40 hover:text-primary hover:bg-light-green/10 rounded-xl transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-accent rounded-full border-2 border-white" />
        </button>
        
        <div className="flex items-center gap-4 pl-8 border-l border-primary/10">
          <div className="text-right">
            <p className="text-sm font-bold text-primary tracking-tight">{auth.currentUser?.displayName}</p>
            <p className="text-[10px] text-accent uppercase tracking-widest font-extrabold mt-0.5">
              {isAdmin ? 'Administrador' : (profile?.role === 'student' ? 'Aluno' : 'Produtor')}
            </p>
          </div>
          <div className="w-12 h-12 bg-light-green/20 rounded-2xl overflow-hidden border border-primary/5 shadow-sm">
            {auth.currentUser?.photoURL ? (
              <img src={auth.currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary/20" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
