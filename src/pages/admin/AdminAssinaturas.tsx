import React, { useEffect, useState } from 'react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { 
  Search, 
  CreditCard, 
  ShieldCheck, 
  Star, 
  Zap, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  User
} from 'lucide-react';
import { api } from '@/src/services/api';
import { Payment, UserProfile } from '@/src/types';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export const AdminAssinaturas = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we'd have a specific endpoint for all payments
        // For now, we'll fetch all users and then their payments
        const allUsers = await api.users.getAll();
        setUsers(allUsers);
        
        const allPayments: Payment[] = [];
        for (const user of allUsers) {
          const userPayments = await api.payments.getByUser(user.uid);
          allPayments.push(...userPayments);
        }
        setPayments(allPayments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (error) {
        toast.error('Erro ao carregar dados financeiros');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
  const monthlyRevenue = payments
    .filter(p => new Date(p.createdAt).getMonth() === new Date().getMonth())
    .reduce((acc, p) => acc + p.amount, 0);

  const filteredPayments = payments.filter(p => {
    const user = users.find(u => u.uid === p.uid);
    return user?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           p.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-1 bg-accent rounded-full" />
            <span className="text-[10px] font-extrabold text-accent uppercase tracking-[0.3em]">Financeiro</span>
          </div>
          <h1 className="text-6xl font-bold text-primary italic tracking-tight leading-none">Assinaturas & Pagamentos</h1>
          <p className="text-xl text-ink/40 font-medium">Monitore a receita e gerencie as transações da plataforma.</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-10 bg-primary text-white rounded-[3rem] border-none shadow-2xl shadow-primary/20 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Receita Total</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-5xl font-black italic tracking-tighter">R$ {totalRevenue.toFixed(2)}</h3>
            <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest">
              <ArrowUpRight className="w-4 h-4" />
              +12.5% vs mês anterior
            </div>
          </div>
        </Card>

        <Card className="p-10 bg-white rounded-[3rem] border-none shadow-xl shadow-primary/5 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-ink/30">Receita Mensal</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-5xl font-black text-primary italic tracking-tighter">R$ {monthlyRevenue.toFixed(2)}</h3>
            <div className="flex items-center gap-2 text-primary/40 text-xs font-bold uppercase tracking-widest">
              <Clock className="w-4 h-4" />
              Atualizado agora
            </div>
          </div>
        </Card>

        <Card className="p-10 bg-accent text-primary rounded-[3rem] border-none shadow-xl shadow-accent/20 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Assinantes Ativos</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-5xl font-black italic tracking-tighter">1,284</h3>
            <div className="flex items-center gap-2 text-primary/60 text-xs font-bold uppercase tracking-widest">
              <Zap className="w-4 h-4" />
              85% Retenção
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/20 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Buscar por usuário ou ID da transação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-20 pr-10 py-6 bg-white rounded-[2rem] border border-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-lg font-medium shadow-xl shadow-primary/5"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-ink/40 font-bold uppercase tracking-widest">Carregando transações...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPayments.map((payment, index) => {
            const user = users.find(u => u.uid === payment.uid);
            return (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 bg-white rounded-2xl border-none shadow-lg shadow-primary/5 flex items-center gap-6 group">
                  <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User className="w-6 h-6 text-primary/10" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-xl font-bold text-primary italic">{user?.displayName || 'Usuário Desconhecido'}</h4>
                      <span className="text-ink/10">•</span>
                      <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-light-green/20 text-primary rounded-full">
                        {payment.type === 'subscription' ? 'Assinatura' : 'Curso'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-ink/30 font-bold text-[10px] uppercase tracking-widest">
                      <span className="flex items-center gap-2"><CreditCard className="w-3 h-3" /> {payment.id}</span>
                      <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> {new Date(payment.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-black text-primary italic">R$ {payment.amount.toFixed(2)}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-primary/40">Succeeded</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
