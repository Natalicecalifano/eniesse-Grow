import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Zap, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/src/components/Button';
import { Card } from '@/src/components/Card';

export const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '0',
      icon: Zap,
      color: 'text-ink/40',
      bgColor: 'bg-ink/5',
      features: [
        'Acesso a trilhas básicas',
        'Comunidade aberta',
        'Certificados básicos',
        'Materiais de apoio limitados'
      ],
      cta: 'Começar Agora',
      path: '/signup'
    },
    {
      name: 'Grow',
      price: '97',
      icon: Star,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      popular: true,
      features: [
        'Todas as trilhas premium',
        'Mentorias mensais ao vivo',
        'Comunidade exclusiva Discord',
        'Certificados profissionais',
        'Materiais de apoio completos',
        'Suporte prioritário'
      ],
      cta: 'Assinar Grow',
      path: '/checkout?plan=grow'
    },
    {
      name: 'Grow Pro',
      price: '197',
      icon: ShieldCheck,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      features: [
        'Tudo do plano Grow',
        'Consultoria 1-on-1 trimestral',
        'Acesso antecipado a cursos',
        'Networking com especialistas',
        'Badge exclusivo no perfil',
        'Suporte VIP 24/7'
      ],
      cta: 'Assinar Pro',
      path: '/checkout?plan=grow_pro'
    }
  ];

  return (
    <div className="min-h-screen bg-accent selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 group">
          <ArrowLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest text-primary">Voltar</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black italic">E</div>
          <span className="text-xl font-bold text-primary italic tracking-tight">Eniesse Grow</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-20 space-y-24">
        {/* Header */}
        <section className="text-center space-y-8 max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-8xl font-black text-primary italic tracking-tighter leading-none"
          >
            Escolha seu <br />
            <span className="text-accent">Nível de Jogo.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-ink/60 font-medium leading-relaxed"
          >
            Planos flexíveis para cada estágio da sua jornada empreendedora. Cancele quando quiser.
          </motion.p>
        </section>

        {/* Pricing Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-accent text-primary px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-accent/20 z-10">
                  Mais Popular
                </div>
              )}
              <Card className={`h-full p-12 rounded-[4rem] border-none shadow-2xl shadow-primary/5 bg-white flex flex-col space-y-10 ${plan.popular ? 'ring-4 ring-accent/20' : ''}`}>
                <div className="space-y-6">
                  <div className={`w-16 h-16 ${plan.bgColor} rounded-3xl flex items-center justify-center ${plan.color}`}>
                    <plan.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-primary italic tracking-tight">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-primary italic tracking-tighter">R$ {plan.price}</span>
                      <span className="text-sm text-ink/40 font-bold uppercase tracking-widest">/ mês</span>
                    </div>
                  </div>
                </div>

                <ul className="flex-1 space-y-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm font-medium text-ink/60">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link to={plan.path}>
                  <Button className={`w-full py-6 text-xl rounded-2xl shadow-2xl shadow-primary/10 ${plan.popular ? 'bg-accent text-primary hover:bg-primary hover:text-white' : ''}`}>
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* FAQ Preview */}
        <section className="bg-white p-16 md:p-24 rounded-[4rem] shadow-2xl shadow-primary/5 text-center space-y-12">
          <h2 className="text-4xl font-black text-primary italic tracking-tighter">Dúvidas Frequentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left max-w-4xl mx-auto">
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-primary italic tracking-tight">Posso cancelar a qualquer momento?</h4>
              <p className="text-ink/60 font-medium leading-relaxed">Sim, não temos contratos de fidelidade. Você pode cancelar sua assinatura com um clique no seu painel.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-primary italic tracking-tight">Quais as formas de pagamento?</h4>
              <p className="text-ink/60 font-medium leading-relaxed">Aceitamos cartões de crédito, PIX e boleto bancário (apenas para planos anuais).</p>
            </div>
          </div>
          <div className="pt-8">
            <Link to="/about" className="text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition-colors flex items-center justify-center gap-2">
              Saiba mais sobre nós <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="p-12 text-center border-t border-primary/5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/30">© 2026 Eniesse Grow Platform</p>
      </footer>
    </div>
  );
};
