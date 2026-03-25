import React, { useEffect, useState } from 'react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  Star,
  ShieldCheck,
  Play,
  Clock
} from 'lucide-react';
import { api } from '@/src/services/api';
import { UserProfile, Trilha, Payment } from '@/src/types';
import { motion } from 'motion/react';

export const AdminDashboard = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, trilhasData] = await Promise.all([
          api.users.getAll(),
          api.trilhas.getAll()
        ]);
        setUsers(usersData);
        setTrilhas(trilhasData);
        
        // Fetch some payments
        const allPayments: Payment[] = [];
        for (const user of usersData.slice(0, 10)) {
          const userPayments = await api.payments.getByUser(user.uid);
          allPayments.push(...userPayments);
        }
        setPayments(allPayments);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total de Usuários', value: users.length, icon: Users, color: 'primary', trend: '+12%' },
    { label: 'Trilhas Ativas', value: trilhas.filter(t => t.published).length, icon: BookOpen, color: 'accent', trend: '+2' },
    { label: 'Assinantes Pro', value: users.filter(u => u.plan === 'grow_pro').length, icon: ShieldCheck, color: 'primary', trend: '+5%' },
    { label: 'Receita Mensal', value: `R$ ${payments.reduce((acc, p) => acc + p.amount, 0).toFixed(2)}`, icon: CreditCard, color: 'accent', trend: '+18%' },
  ];

  if (loading) return <div className="p-12 text-center text-ink/40 font-bold uppercase tracking-widest">Carregando estatísticas...</div>;

  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="w-12 h-1 bg-accent rounded-full" />
          <span className="text-[10px] font-extrabold text-accent uppercase tracking-[0.3em]">Visão Geral</span>
        </div>
        <h1 className="text-7xl font-bold text-primary italic tracking-tight leading-none">Admin Dashboard</h1>
        <p className="text-2xl text-ink/40 font-medium">Bem-vindo ao centro de controle da Eniesse Grow.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-8 bg-white rounded-[2.5rem] border-none shadow-xl shadow-primary/5 space-y-6 group hover:bg-primary hover:text-white transition-all duration-500">
              <div className="flex justify-between items-start">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color === 'primary' ? 'bg-primary/5 text-primary group-hover:bg-white/10 group-hover:text-white' : 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-primary'}`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold text-accent group-hover:text-white/60">{stat.trend}</span>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{stat.label}</p>
                <h3 className="text-4xl font-black italic tracking-tighter">{stat.value}</h3>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Recent Activity */}
        <div className="lg:col-span-8 space-y-10">
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-bold text-primary italic tracking-tight">Atividade Recente</h2>
            <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-accent">Ver Tudo</Button>
          </div>
          <Card className="p-0 bg-white rounded-[3rem] border-none shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="divide-y divide-primary/5">
              {users.slice(0, 5).map((user, i) => (
                <div key={i} className="p-8 flex items-center gap-6 hover:bg-light-green/5 transition-colors">
                  <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Users className="w-6 h-6 text-primary/10" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-primary italic">{user.displayName || 'Novo Usuário'}</p>
                    <p className="text-[10px] text-ink/30 font-bold uppercase tracking-widest">Registrou-se na plataforma</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-ink/20 uppercase tracking-widest">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-4 space-y-10">
          <h2 className="text-3xl font-bold text-primary italic tracking-tight">Ações Rápidas</h2>
          <div className="grid grid-cols-1 gap-4">
            <Button className="w-full py-6 rounded-2xl bg-primary text-white hover:bg-primary/90 flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest shadow-xl shadow-primary/20">
              <Zap className="w-5 h-5" />
              Enviar Notificação
            </Button>
            <Button variant="outline" className="w-full py-6 rounded-2xl border-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest">
              <TrendingUp className="w-5 h-5" />
              Gerar Relatório
            </Button>
            <Button variant="outline" className="w-full py-6 rounded-2xl border-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest">
              <Star className="w-5 h-5" />
              Destaques do Mês
            </Button>
          </div>

          <Card className="p-10 bg-accent text-primary rounded-[3rem] border-none shadow-2xl shadow-accent/20 relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl font-bold italic tracking-tight">Suporte Técnico</h3>
              <p className="text-primary/60 font-medium leading-relaxed">Existem 3 tickets pendentes aguardando sua resposta.</p>
              <Button className="w-full py-4 rounded-xl bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-widest text-[10px]">Ver Tickets</Button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          </Card>
        </div>
      </div>
    </div>
  );
};
