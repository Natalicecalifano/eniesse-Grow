import { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  CreditCard,
  Calendar,
  Zap,
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { getAllUsers } from '@/src/services/firestoreService';
import { UserProfile } from '@/src/types';

export const AdminSubscriptions = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllUsers();
      setUsers(data.filter(u => u.plan !== 'free'));
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-16">Carregando assinaturas...</div>;

  return (
    <div className="p-16 max-w-7xl mx-auto space-y-16">
      <header className="space-y-4">
        <h1 className="text-6xl font-bold text-primary italic tracking-tight">Gerenciar Assinaturas</h1>
        <p className="text-2xl text-ink/40 font-medium">Acompanhe os pagamentos e planos ativos.</p>
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
      </div>

      {/* Subscriptions Table */}
      <Card className="overflow-hidden rounded-[3rem] border-none shadow-2xl shadow-primary/5 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5">
                <th className="px-10 py-8 text-[10px] font-extrabold uppercase tracking-widest text-primary/40">Assinante</th>
                <th className="px-10 py-8 text-[10px] font-extrabold uppercase tracking-widest text-primary/40">Plano</th>
                <th className="px-10 py-8 text-[10px] font-extrabold uppercase tracking-widest text-primary/40">Período</th>
                <th className="px-10 py-8 text-[10px] font-extrabold uppercase tracking-widest text-primary/40">Status</th>
                <th className="px-10 py-8 text-[10px] font-extrabold uppercase tracking-widest text-primary/40 text-right">Valor</th>
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
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                      user.plan === 'grow' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                    }`}>
                      {user.plan === 'grow' ? <Star className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                      {user.plan}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-sm font-bold text-primary italic uppercase tracking-widest">
                      {user.subscriptionPeriod || 'monthly'}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2 text-green-500 font-bold uppercase tracking-widest text-[10px]">
                      <CheckCircle2 className="w-4 h-4" />
                      Ativo
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <p className="text-xl font-bold text-primary italic">
                      R$ {user.plan === 'grow' ? (user.subscriptionPeriod === 'annual' ? '970,00' : '97,00') : (user.subscriptionPeriod === 'annual' ? '1970,00' : '197,00')}
                    </p>
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
