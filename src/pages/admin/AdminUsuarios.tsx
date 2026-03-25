import React, { useEffect, useState } from 'react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { 
  Search, 
  User, 
  ShieldCheck, 
  Star, 
  Zap, 
  MoreVertical, 
  Edit2, 
  Trash2,
  Mail,
  Calendar
} from 'lucide-react';
import { api } from '@/src/services/api';
import { UserProfile, UserRole } from '@/src/types';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export const AdminUsuarios = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.users.getAll();
        setUsers(data);
      } catch (error) {
        toast.error('Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUpdateRole = async (uid: string, newRole: UserRole) => {
    try {
      const user = users.find(u => u.uid === uid);
      if (!user) return;
      const updatedUser = { ...user, role: newRole };
      await api.users.saveProfile(updatedUser);
      setUsers(users.map(u => u.uid === uid ? updatedUser : u));
      toast.success(`Papel do usuário atualizado para ${newRole}`);
    } catch (error) {
      toast.error('Erro ao atualizar papel do usuário');
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <span className="px-3 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-full border border-primary/20">Admin</span>;
      case 'specialist':
        return <span className="px-3 py-1 bg-accent/10 text-accent text-[8px] font-black uppercase tracking-widest rounded-full border border-accent/20">Especialista</span>;
      case 'producer':
        return <span className="px-3 py-1 bg-light-green/20 text-primary text-[8px] font-black uppercase tracking-widest rounded-full border border-primary/10">Produtor</span>;
      default:
        return <span className="px-3 py-1 bg-ink/5 text-ink/40 text-[8px] font-black uppercase tracking-widest rounded-full border border-ink/10">Aluno</span>;
    }
  };

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-1 bg-accent rounded-full" />
            <span className="text-[10px] font-extrabold text-accent uppercase tracking-[0.3em]">Gerenciamento</span>
          </div>
          <h1 className="text-6xl font-bold text-primary italic tracking-tight leading-none">Usuários</h1>
          <p className="text-xl text-ink/40 font-medium">Gerencie o acesso e os papéis de todos os usuários da plataforma.</p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/20 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Buscar usuários por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-20 pr-10 py-6 bg-white rounded-[2rem] border border-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-lg font-medium shadow-xl shadow-primary/5"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-ink/40 font-bold uppercase tracking-widest">Carregando usuários...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-8 bg-white rounded-[2.5rem] border-none shadow-xl shadow-primary/5 flex flex-col md:flex-row items-center gap-8 group">
                <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center overflow-hidden shrink-0">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-10 h-10 text-primary/10" />
                  )}
                </div>

                <div className="flex-1 space-y-2 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <h3 className="text-3xl font-bold text-primary italic">{user.displayName || 'Usuário Sem Nome'}</h3>
                    {getRoleBadge(user.role)}
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-ink/40 font-bold text-[10px] uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Mail className="w-3 h-3" /> {user.email}</span>
                    <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> Membro desde {new Date(user.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-2"><Zap className="w-3 h-3" /> Plano {user.plan?.toUpperCase() || 'FREE'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select 
                    value={user.role} 
                    onChange={(e) => handleUpdateRole(user.uid, e.target.value as UserRole)}
                    className="px-6 py-3 bg-accent/30 rounded-xl border border-transparent focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-xs font-bold uppercase tracking-widest cursor-pointer"
                  >
                    <option value="student">Aluno</option>
                    <option value="producer">Produtor</option>
                    <option value="specialist">Especialista</option>
                    <option value="admin">Admin</option>
                  </select>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-12 h-12 p-0 rounded-2xl border border-primary/5 hover:bg-primary/5"
                  >
                    <Edit2 className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
