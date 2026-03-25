import { useEffect, useState } from 'react';
import { auth } from '@/src/firebase';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { CreditCard, Zap, Star, ShieldCheck, CheckCircle2, ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { getUserProfile, saveUserProfile } from '@/src/services/firestoreService';
import { UserProfile, PlanType } from '@/src/types';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export const Assinatura = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        const data = await getUserProfile(auth.currentUser.uid);
        setProfile(data);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getPlanName = (plan?: PlanType) => {
    switch (plan) {
      case 'grow': return 'Grow';
      case 'grow_pro': return 'Grow Pro';
      default: return 'Gratuito';
    }
  };

  if (loading) return <div className="p-12">Carregando assinatura...</div>;

  return (
    <div className="p-12 max-w-6xl mx-auto space-y-16">
      <header className="space-y-4">
        <h1 className="text-6xl font-bold text-primary italic tracking-tight">Minha Assinatura</h1>
        <p className="text-2xl text-ink/40 font-medium">Gerencie seu plano e histórico de pagamentos.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Current Plan Card */}
        <Card className="lg:col-span-2 p-12 rounded-[3rem] border-none shadow-2xl shadow-primary/5 bg-white space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                <CreditCard className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-primary italic tracking-tight">Plano Atual</h2>
                <p className="text-sm text-ink/40 font-bold uppercase tracking-widest">Status: Ativo</p>
              </div>
            </div>
            <div className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
              profile?.plan === 'free' ? 'bg-ink/5 text-ink/40' : 'bg-accent/10 text-accent'
            }`}>
              {getPlanName(profile?.plan)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-black/5">
            <div className="space-y-2">
              <p className="text-[10px] text-ink/30 font-bold uppercase tracking-widest">Próxima Cobrança</p>
              <div className="flex items-center gap-2 text-xl font-bold text-primary italic">
                <Calendar className="w-5 h-5 text-primary/20" />
                15 de Abril, 2026
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-ink/30 font-bold uppercase tracking-widest">Valor da Assinatura</p>
              <div className="text-xl font-bold text-primary italic">
                {profile?.plan === 'grow' ? 'R$ 97,00' : profile?.plan === 'grow_pro' ? 'R$ 197,00' : 'R$ 0,00'}
                <span className="text-sm text-ink/40 font-medium ml-2">/ mês</span>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-black/5 flex flex-col md:flex-row gap-4">
            <Button className="flex-1 py-6 text-lg rounded-2xl shadow-xl shadow-primary/20">
              Alterar Plano
            </Button>
            <Button variant="outline" className="flex-1 py-6 text-lg rounded-2xl border-red-100 text-red-500 hover:bg-red-50">
              Cancelar Assinatura
            </Button>
          </div>
        </Card>

        {/* Plan Benefits */}
        <Card className="p-10 bg-primary text-white rounded-[3rem] shadow-2xl shadow-primary/20 space-y-8">
          <h3 className="text-2xl font-bold italic tracking-tight">Seus Benefícios</h3>
          <ul className="space-y-6">
            {[
              'Acesso a todas as trilhas premium',
              'Mentorias mensais ao vivo',
              'Comunidade exclusiva no Discord',
              'Certificados de conclusão',
              'Materiais de apoio em PDF'
            ].map((benefit, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-medium text-white/80">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
          <div className="pt-8 border-t border-white/10">
            <Link to="/trilhas" className="flex items-center justify-between group">
              <span className="text-xs font-bold uppercase tracking-widest">Explorar Conteúdo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Payment History */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-primary italic tracking-tight">Histórico de Faturas</h2>
        <Card className="overflow-hidden rounded-[3rem] border-none shadow-2xl shadow-primary/5 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary/5">
                <th className="px-10 py-6 text-[10px] font-extrabold uppercase tracking-widest text-primary/40">Data</th>
                <th className="px-10 py-6 text-[10px] font-extrabold uppercase tracking-widest text-primary/40">Descrição</th>
                <th className="px-10 py-6 text-[10px] font-extrabold uppercase tracking-widest text-primary/40">Valor</th>
                <th className="px-10 py-6 text-[10px] font-extrabold uppercase tracking-widest text-primary/40 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[
                { date: '15/03/2026', desc: 'Assinatura Grow - Mensal', value: 'R$ 97,00', status: 'Pago' },
                { date: '15/02/2026', desc: 'Assinatura Grow - Mensal', value: 'R$ 97,00', status: 'Pago' },
                { date: '15/01/2026', desc: 'Assinatura Grow - Mensal', value: 'R$ 97,00', status: 'Pago' },
              ].map((invoice, i) => (
                <tr key={i} className="hover:bg-accent/5 transition-colors">
                  <td className="px-10 py-6 text-sm font-bold text-primary italic">{invoice.date}</td>
                  <td className="px-10 py-6 text-sm font-medium text-ink/60">{invoice.desc}</td>
                  <td className="px-10 py-6 text-sm font-bold text-primary italic">{invoice.value}</td>
                  <td className="px-10 py-6 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-green-500">
                      <CheckCircle2 className="w-3 h-3" />
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};
