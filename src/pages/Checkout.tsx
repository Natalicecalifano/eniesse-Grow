import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  Zap, 
  Star,
  Lock,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '@/src/services/api';
import { auth } from '@/src/firebase';
import { toast } from 'sonner';
import { PlanType, Payment, Subscription } from '@/src/types';

export const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Get params from URL
  const trilhaId = searchParams.get('trilhaId');
  const trilhaTitle = searchParams.get('trilhaTitle');
  const plan = searchParams.get('plan') as PlanType || 'grow';
  const amount = parseFloat(searchParams.get('amount') || (plan === 'grow_pro' ? '49.90' : '29.90'));

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error('Você precisa estar logado para realizar uma compra.');
      navigate('/login');
      return;
    }

    setLoading(true);
    
    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const now = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(now.getMonth() + 1);

      // 1. Create Payment Record
      const payment: Payment = {
        id: `pay_${Math.random().toString(36).substr(2, 9)}`,
        uid: auth.currentUser.uid,
        amount,
        currency: 'BRL',
        status: 'succeeded',
        type: trilhaId ? 'course_purchase' : 'subscription',
        courseId: trilhaId || undefined,
        stripePaymentIntentId: `pi_${Math.random().toString(36).substr(2, 15)}`,
        createdAt: now.toISOString()
      };
      await api.payments.save(payment);

      // 2. If subscription, update subscription record
      if (!trilhaId) {
        const subscription: Subscription = {
          id: `sub_${Math.random().toString(36).substr(2, 9)}`,
          uid: auth.currentUser.uid,
          plan: plan,
          period: 'monthly',
          status: 'active',
          currentPeriodStart: now.toISOString(),
          currentPeriodEnd: nextMonth.toISOString(),
          cancelAtPeriodEnd: false,
          createdAt: now.toISOString()
        };
        await api.subscriptions.update(subscription);
      } else {
        // If course purchase, update user profile with purchased course
        const profile = await api.users.getProfile(auth.currentUser.uid);
        if (profile) {
          const purchasedCourses = [...(profile.purchasedCourses || []), trilhaId];
          await api.users.saveProfile({
            ...profile,
            purchasedCourses
          });
        }
      }

      setSuccess(true);
      toast.success('Pagamento realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-accent flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-primary/20">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-black text-primary italic tracking-tighter">Sucesso!</h1>
            <p className="text-xl text-ink/60 font-medium">
              Seu acesso foi liberado. Prepare-se para transformar seu negócio.
            </p>
          </div>
          <Button 
            onClick={() => navigate(trilhaId ? `/aula/${trilhaId}` : '/dashboard')}
            className="w-full py-6 text-xl rounded-2xl shadow-2xl shadow-primary/20"
          >
            Começar Agora
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent p-8 md:p-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left Side - Summary */}
        <div className="space-y-12">
          <Link to={trilhaId ? `/trilhas` : '/pricing'} className="flex items-center gap-2 text-primary/40 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Voltar</span>
          </Link>

          <div className="space-y-4">
            <h1 className="text-6xl font-black text-primary italic tracking-tighter">Finalizar Compra</h1>
            <p className="text-xl text-ink/40 font-medium">Você está a um passo de desbloquear seu potencial.</p>
          </div>

          <Card className="p-10 bg-white rounded-[3rem] border-none shadow-2xl shadow-primary/5 space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center">
                {trilhaId ? <Zap className="w-10 h-10 text-primary" /> : <Star className="w-10 h-10 text-accent" />}
              </div>
              <div>
                <p className="text-[10px] text-accent font-extrabold uppercase tracking-widest mb-1">
                  {trilhaId ? 'Curso Individual' : 'Plano de Assinatura'}
                </p>
                <h3 className="text-3xl font-bold text-primary italic">{trilhaTitle || (plan === 'grow_pro' ? 'Plano Grow Pro' : 'Plano Grow')}</h3>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-primary/5">
              <div className="flex justify-between items-center text-lg font-medium text-ink/60">
                <span>Subtotal</span>
                <span>R$ {amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-medium text-ink/60">
                <span>Taxas</span>
                <span>R$ 0,00</span>
              </div>
              <div className="flex justify-between items-center text-3xl font-black text-primary italic pt-4">
                <span>Total</span>
                <span>R$ {amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-light-green/5 p-6 rounded-2xl flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <p className="text-sm font-bold text-primary/60 uppercase tracking-widest">Pagamento 100% Seguro</p>
            </div>
          </Card>
        </div>

        {/* Right Side - Payment Form */}
        <div className="space-y-12">
          <Card className="p-12 bg-white rounded-[3rem] border-none shadow-2xl shadow-primary/5">
            <form onSubmit={handlePayment} className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-primary italic flex items-center gap-3">
                  <CreditCard className="w-6 h-6" />
                  Dados de Pagamento
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-4">Número do Cartão</label>
                    <div className="relative group">
                      <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/20 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full pl-16 pr-8 py-5 bg-accent/30 rounded-2xl border border-transparent focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-lg font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-4">Validade</label>
                      <div className="relative group">
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/20 group-focus-within:text-primary transition-colors" />
                        <input
                          type="text"
                          placeholder="MM/AA"
                          className="w-full pl-16 pr-8 py-5 bg-accent/30 rounded-2xl border border-transparent focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-lg font-medium"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-4">CVV</label>
                      <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/20 group-focus-within:text-primary transition-colors" />
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full pl-16 pr-8 py-5 bg-accent/30 rounded-2xl border border-transparent focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-lg font-medium"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-4">Nome no Cartão</label>
                    <input
                      type="text"
                      placeholder="NOME COMO NO CARTÃO"
                      className="w-full px-8 py-5 bg-accent/30 rounded-2xl border border-transparent focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-lg font-medium uppercase"
                      required
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-6 text-xl rounded-2xl shadow-2xl shadow-primary/20 flex items-center justify-center gap-3"
              >
                {loading ? 'Processando...' : `Pagar R$ ${amount.toFixed(2)}`}
                {!loading && <ArrowRight className="w-6 h-6" />}
              </Button>

              <p className="text-center text-xs text-ink/30 font-bold uppercase tracking-widest">
                Ao clicar em pagar, você concorda com nossos termos de uso.
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
