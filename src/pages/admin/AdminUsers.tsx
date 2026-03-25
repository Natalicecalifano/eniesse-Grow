import { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical,
  User,
  Mail,
  Calendar,
  Shield,
  Zap,
  Star,
  ShieldCheck
} from 'lucide-react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { getAllUsers, saveUserProfile } from '@/src/services/firestoreService';
import { UserProfile, PlanType } from '@/src/types';
import { toast } from 'sonner';

export const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllUsers();
      setUsers(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleUpdatePlan = async (uid: string, plan: PlanType) => {
    const user = users.find(u => u.uid === uid);
    if (!user) return;

    try {
      const updatedUser = { ...user, plan };
      await saveUserProfile(updatedUser);
      setUsers(prev => prev.map(u => u.uid === uid ? updatedUser : u));
      toast.success(`Plano de ${user.displayName || user.email} atualizado!`);
    } catch (error) {
      toast.error('Erro ao atualizar plano.');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.displayName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'free' && u.plan === 'free') || 
                         (filter === 'paid' && u.plan !== 'free');
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="p-16">Carregando usuários...</div>;

  return (
    <div className="p-16 max-w-7xl mx-auto space-y-16">
      <header className="space-y-4">
        <h1 className="text-6xl font-bold text-primary italic tracking-tight">Gerenciar Usuários</h1>
        <p className="text-2xl text-ink/40 font-medium">Visualize e gerencie os membros da plataforma.</p>
      </header>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-20 pr-10 py-6 bg-white rounded-[2rem] border border-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-lg font-medium shadow-xl shadow-primary/5 placeholder:text-primary/30"
          />
        </div>
        <div className="flex gap-4">
          {(['all', 'free', 'paid'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'primary' : 'outline'}
              onClick={() => setFilter(f)}
              className="px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest"
            >
              {f === 'all' ? 'Todos' : f === 'free' ? 'Gratuitos' : 'Pagos'}
            </Button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden rounded-[3rem] border-none shadow-2xl shadow-primary/5 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5">
                <th className="px-10 py-8 text-[10px] font-extrabold uppercase tracking-widest text-primary/40">Usuário</th>
                <th className="px-10 py-8 text-[10px] font-extrabold uppercase tracking-widest text-primary/40">Plano Atual</th>
                <th className="px-10 py-8 text-[10px] font-extrabold uppercase tracking-widest text-primary/40">Data Cadastro</th>
                <th className="px-10 py-8 text-[10px] font-extrabold uppercase tracking-widest text-primary/40">Role</th>
                <th className="px-10 py-8 text-[10px] font-extrabold uppercase tracking-widest text-primary/40 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredUsers.map((user) => (
                <tr key={user.uid} className="hover:bg-accent/5 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold">
                        {user.displayName?.[0] || user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xl font-bold text-primary italic">{user.displayName || 'Usuário'}</p>
                        <p className="text-xs text-ink/40 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                        user.plan === 'free' ? 'bg-ink/5 text-ink/40' : 
                        user.plan === 'grow' ? 'bg-accent/10 text-accent' : 
                        'bg-primary/10 text-primary'
                      }`}>
                        {user.plan === 'free' ? <Zap className="w-3 h-3" /> : 
                         user.plan === 'grow' ? <Star className="w-3 h-3" /> : 
                         <ShieldCheck className="w-3 h-3" />}
                        {user.plan}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2 text-sm font-bold text-primary italic">
                      <Calendar className="w-4 h-4 text-ink/20" />
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest ${
                      user.role === 'admin' ? 'text-accent' : 'text-ink/30'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-2">
                      <select 
                        onChange={(e) => handleUpdatePlan(user.uid, e.target.value as PlanType)}
                        className="bg-accent/10 text-primary text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl border-none focus:ring-2 focus:ring-primary/20"
                        value={user.plan}
                      >
                        <option value="free">Free</option>
                        <option value="grow">Grow</option>
                        <option value="grow_pro">Grow Pro</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
