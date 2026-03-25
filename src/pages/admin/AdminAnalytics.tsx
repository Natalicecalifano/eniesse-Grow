import React, { useEffect, useState } from 'react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Play, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  Star,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { api } from '@/src/services/api';
import { UserProfile, Trilha, Payment } from '@/src/types';
import { motion } from 'motion/react';

export const AdminAnalytics = () => {
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
        
        const allPayments: Payment[] = [];
        for (const user of usersData.slice(0, 10)) {
          const userPayments = await api.payments.getByUser(user.uid);
          allPayments.push(...userPayments);
        }
        setPayments(allPayments);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-12 text-center text-ink/40 font-bold uppercase tracking-widest">Carregando analytics...</div>;

  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-1 bg-accent rounded-full" />
            <span className="text-[10px] font-extrabold text-accent uppercase tracking-[0.3em]">Métricas</span>
          </div>
          <h1 className="text-6xl font-bold text-primary italic tracking-tight leading-none">Analytics</h1>
          <p className="text-xl text-ink/40 font-medium">Acompanhe o crescimento e o engajamento da plataforma.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" className="px-8 py-4 rounded-xl border-primary/10 text-primary font-bold uppercase tracking-widest text-xs">
            <Calendar className="w-4 h-4 mr-2" />
            Últimos 30 dias
          </Button>
          <Button className="px-8 py-4 rounded-xl bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-widest text-xs">
            Exportar CSV
          </Button>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Novos Usuários', value: users.length, icon: Users, color: 'primary', trend: '+12%' },
          { label: 'Tempo Médio Assistido', value: '45 min', icon: Clock, color: 'accent', trend: '+8%' },
          { label: 'Taxa de Conversão', value: '3.2%', icon: TrendingUp, color: 'primary', trend: '+1.5%' },
          { label: 'Receita Total', value: `R$ ${payments.reduce((acc, p) => acc + p.amount, 0).toFixed(2)}`, icon: Zap, color: 'accent', trend: '+22%' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-8 bg-white rounded-[2.5rem] border-none shadow-xl shadow-primary/5 space-y-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color === 'primary' ? 'bg-primary/5 text-primary' : 'bg-accent/10 text-accent'}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-ink/30">{stat.label}</p>
                <div className="flex items-end gap-3">
                  <h3 className="text-4xl font-black text-primary italic tracking-tighter leading-none">{stat.value}</h3>
                  <span className="text-xs font-bold text-accent mb-1">{stat.trend}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Engagement Chart Placeholder */}
        <div className="lg:col-span-8 space-y-10">
          <h2 className="text-3xl font-bold text-primary italic tracking-tight">Engajamento por Trilha</h2>
          <Card className="p-12 bg-white rounded-[3rem] border-none shadow-2xl shadow-primary/5 h-[400px] flex items-end gap-6 justify-around">
            {trilhas.slice(0, 6).map((trilha, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="w-full bg-primary/5 rounded-t-2xl relative overflow-hidden flex flex-col justify-end" style={{ height: `${Math.random() * 80 + 20}%` }}>
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="h-1/2 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                <p className="text-[8px] font-black uppercase tracking-widest text-ink/30 text-center truncate w-full">{trilha.title}</p>
              </div>
            ))}
          </Card>
        </div>

        {/* Top Content */}
        <div className="lg:col-span-4 space-y-10">
          <h2 className="text-3xl font-bold text-primary italic tracking-tight">Conteúdo em Alta</h2>
          <div className="space-y-4">
            {trilhas.slice(0, 4).map((trilha, i) => (
              <Card key={i} className="p-6 rounded-2xl border-none shadow-lg shadow-primary/5 hover:bg-light-green/5 transition-colors cursor-pointer group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center overflow-hidden">
                    {trilha.thumbnail ? (
                      <img src={trilha.thumbnail} alt={trilha.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <Play className="w-5 h-5 text-primary/20" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-primary italic leading-tight">{trilha.title}</h4>
                    <p className="text-[10px] text-ink/30 font-bold uppercase tracking-widest">{Math.floor(Math.random() * 500 + 100)} visualizações</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
