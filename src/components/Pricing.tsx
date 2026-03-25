import { useState } from 'react';
import { Check, Star, Zap, ShieldCheck } from 'lucide-react';
import { Button } from './Button';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { SubscriptionPeriod } from '@/src/types';

const plans = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: '0',
    annualPrice: '0',
    description: 'Comece sua jornada empreendedora sem custos.',
    features: [
      'Acesso a conteúdos introdutórios',
      'Aulas limitadas selecionadas',
      'Acesso à comunidade básica',
      'Suporte via fórum'
    ],
    buttonText: 'Começar Grátis',
    icon: Zap,
    highlight: false
  },
  {
    id: 'grow',
    name: 'Grow',
    monthlyPrice: '49,90',
    annualPrice: '39,90',
    description: 'Tudo o que você precisa para estruturar seu negócio.',
    features: [
      'Acesso total às trilhas essenciais',
      'Aulas práticas e detalhadas',
      'Checklists e planos de ação',
      'Acesso à comunidade Grow'
    ],
    buttonText: 'Assinar Grow',
    icon: Star,
    highlight: true
  },
  {
    id: 'grow_pro',
    name: 'Grow Pro',
    monthlyPrice: '97,00',
    annualPrice: '77,00',
    description: 'Acelere seu crescimento com ferramentas avançadas.',
    features: [
      'Acesso total à plataforma',
      'Conteúdo premium de negócios',
      'Templates e materiais estratégicos',
      'Suporte prioritário',
      'Mentorias mensais em grupo'
    ],
    buttonText: 'Assinar Grow Pro',
    icon: ShieldCheck,
    highlight: false
  }
];

export const Pricing = () => {
  const [period, setPeriod] = useState<SubscriptionPeriod>('monthly');
  const navigate = useNavigate();

  const handleSelectPlan = (planId: string, price: string) => {
    if (planId === 'free') {
      navigate('/login');
      return;
    }
    navigate(`/checkout?plan=${planId}&period=${period}&amount=${price.replace(',', '.')}`);
  };

  return (
    <section id="pricing" className="py-40 px-8 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 space-y-8">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-accent font-extrabold uppercase tracking-[0.3em] text-[10px] mb-4 block"
          >
            Investimento
          </motion.span>
          <h2 className="text-5xl md:text-7xl font-bold text-primary italic mb-6 tracking-tight">Escolha seu plano</h2>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-6">
            <span className={`text-sm font-bold uppercase tracking-widest ${period === 'monthly' ? 'text-primary' : 'text-ink/30'}`}>Mensal</span>
            <button 
              onClick={() => setPeriod(period === 'monthly' ? 'annual' : 'monthly')}
              className="w-20 h-10 bg-primary/5 rounded-full p-1 relative border border-primary/10 transition-all"
            >
              <motion.div 
                animate={{ x: period === 'monthly' ? 0 : 40 }}
                className="w-8 h-8 bg-primary rounded-full shadow-lg flex items-center justify-center"
              >
                <div className="w-1 h-3 bg-white/20 rounded-full" />
              </motion.div>
            </button>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold uppercase tracking-widest ${period === 'annual' ? 'text-primary' : 'text-ink/30'}`}>Anual</span>
              <span className="px-3 py-1 bg-accent text-primary text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-accent/20">
                -20% OFF
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-12 rounded-[4rem] border transition-all duration-700 hover:scale-[1.02] ${
                plan.highlight 
                  ? 'border-primary bg-primary text-white shadow-[0_40px_100px_rgba(20,69,36,0.15)]' 
                  : 'border-primary/5 bg-light-green/5 text-primary'
              } flex flex-col`}
            >
              {plan.highlight && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-accent text-primary text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full shadow-2xl shadow-accent/40">
                  Mais Popular
                </div>
              )}

              <div className="mb-12">
                <plan.icon className={`w-14 h-14 mb-8 ${plan.highlight ? 'text-accent' : 'text-primary'}`} />
                <h3 className="text-4xl font-bold italic mb-4 tracking-tight">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-sm font-bold opacity-40">R$</span>
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={period}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-6xl font-black tracking-tighter"
                    >
                      {period === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                    </motion.span>
                  </AnimatePresence>
                  <span className={`text-sm font-bold opacity-60`}>/mês</span>
                </div>
                <p className={`text-lg font-medium leading-relaxed ${plan.highlight ? 'text-white/70' : 'text-ink/50'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="flex-1 space-y-6 mb-12">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-start gap-4">
                    <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? 'bg-white/10' : 'bg-primary/5'}`}>
                      <Check className={`w-3 h-3 ${plan.highlight ? 'text-accent' : 'text-primary'}`} />
                    </div>
                    <span className="text-sm font-bold leading-tight uppercase tracking-wider opacity-80">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => handleSelectPlan(plan.id, period === 'monthly' ? plan.monthlyPrice : plan.annualPrice)}
                className={`w-full py-8 rounded-3xl text-lg font-bold transition-all duration-500 shadow-2xl ${
                  plan.highlight 
                    ? 'bg-white text-primary hover:bg-accent hover:text-primary shadow-white/10' 
                    : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                }`}
              >
                {plan.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-light-green/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-accent/5 to-transparent pointer-events-none" />
    </section>
  );
};
