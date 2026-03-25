import { Link } from 'react-router-dom';
import { Button } from '@/src/components/Button';
import { Leaf, Sprout, Users, ArrowRight, Lock, PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Pricing } from '@/src/components/Pricing';

const PublicHeader = () => (
  <nav className="fixed top-0 left-0 w-full h-24 bg-white/80 backdrop-blur-md border-b border-primary/5 z-50 px-8 flex items-center justify-between">
    <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-primary italic tracking-tight">
        Eniesse <span className="text-accent">Grow</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-12">
        <Link to="/about" className="text-sm font-bold text-primary/60 hover:text-primary transition-colors uppercase tracking-widest">Sobre</Link>
        <Link to="/trilhas" className="text-sm font-bold text-primary/60 hover:text-primary transition-colors uppercase tracking-widest">Trilhas</Link>
        <Link to="/pricing" className="text-sm font-bold text-primary/60 hover:text-primary transition-colors uppercase tracking-widest">Preços</Link>
      </div>

      <div className="flex items-center gap-6">
        <Link to="/login" className="text-sm font-bold text-primary/60 hover:text-primary transition-colors uppercase tracking-widest hidden sm:block">Entrar</Link>
        <Link to="/signup">
          <Button className="bg-primary text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
            Começar Grátis
          </Button>
        </Link>
      </div>
    </div>
  </nav>
);

export const Home = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden font-sans">
      <PublicHeader />
      
      {/* Hero Section */}
      <header className="relative pt-48 pb-56 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-primary/5 text-primary text-[10px] font-extrabold uppercase tracking-[0.4em] shadow-sm border border-primary/5"
              >
                <Sprout className="w-4 h-4 text-accent" />
                Cresça com Propósito
              </motion.span>
              
              <h1 className="text-5xl md:text-7xl font-bold text-primary italic tracking-tight">
                Eniesse <span className="text-accent">Grow</span>
              </h1>
            </div>

            <div className="space-y-8 max-w-5xl mx-auto">
              <h2 className="text-5xl md:text-8xl font-bold text-primary leading-[1.05] italic tracking-tight">
                Transforme seu produto artesanal em um negócio digital <span className="text-accent">estruturado e lucrativo</span>
              </h2>
              
              <p className="text-xl md:text-2xl text-ink/50 max-w-3xl mx-auto leading-relaxed font-medium">
                Aprenda passo a passo como vender online, organizar sua operação e escalar suas vendas no e-commerce, mesmo começando do zero.
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8"
            >
              <Link to="/signup">
                <Button size="lg" className="group px-12 py-6 text-xl rounded-2xl shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all duration-500">
                  Começar Grátis
                  <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-2" />
                </Button>
              </Link>
              <Link to="/trilhas">
                <Button variant="outline" size="lg" className="px-12 py-6 text-xl rounded-2xl border-primary/10 text-primary font-bold uppercase tracking-widest text-sm hover:bg-primary hover:text-white transition-all duration-500 shadow-xl shadow-primary/5">
                  Ver Trilhas
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] bg-light-green/15 rounded-full blur-[160px] animate-pulse duration-[10s]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] bg-accent/10 rounded-full blur-[160px] animate-pulse duration-[8s] delay-1000" />
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#144524_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
      </header>

      {/* Features Section */}
      <section id="about" className="py-40 px-8 bg-light-green/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-bold text-primary italic mb-6">Por que Eniesse?</h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full opacity-30" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                icon: Leaf,
                title: 'Foco no Natural',
                description: 'Conteúdo especializado para quem produz com consciência e ingredientes naturais.',
              },
              {
                icon: Sprout,
                title: 'Trilhas de Sucesso',
                description: 'Caminhos de aprendizado estruturados do zero ao faturamento no e-commerce.',
              },
              {
                icon: Users,
                title: 'Rede de Especialistas',
                description: 'Conecte-se com profissionais prontos para ajudar seu negócio a escalar.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-24 h-24 bg-white shadow-xl shadow-primary/5 rounded-[2rem] flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-transform duration-500 border border-primary/5">
                  <feature.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-6 italic">{feature.title}</h3>
                <p className="text-ink/70 leading-relaxed font-medium text-lg px-4">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trilhas Preview Section */}
      <section id="trilhas" className="py-40 px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-accent font-extrabold uppercase tracking-[0.3em] text-[10px] mb-4 block"
              >
                Aprendizado
              </motion.span>
              <h2 className="text-5xl md:text-6xl font-bold text-primary italic leading-tight">Trilhas de Conhecimento</h2>
            </div>
            <Link to="/trilhas">
              <Button variant="outline" className="border-primary/10 text-primary font-bold uppercase tracking-widest text-sm px-10 py-5 rounded-2xl hover:bg-primary hover:text-white transition-all duration-500">
                Ver Todas as Trilhas
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: 'Fundamentos do E-commerce Natural',
                category: 'Estratégia',
                lessons: 12,
                isPremium: false,
                image: 'https://picsum.photos/seed/natural1/800/600'
              },
              {
                title: 'Marketing e Branding para Artesãos',
                category: 'Marketing',
                lessons: 18,
                isPremium: true,
                image: 'https://picsum.photos/seed/marketing/800/600'
              },
              {
                title: 'Gestão Financeira e Precificação',
                category: 'Negócios',
                lessons: 15,
                isPremium: true,
                image: 'https://picsum.photos/seed/finance/800/600'
              }
            ].map((trilha, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-light-green/5 rounded-[3rem] overflow-hidden border border-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={trilha.image} alt={trilha.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute top-6 right-6">
                    {trilha.isPremium ? (
                      <div className="bg-accent/90 backdrop-blur-md text-primary p-3 rounded-2xl shadow-lg">
                        <Lock className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="bg-white/90 backdrop-blur-md text-primary p-3 rounded-2xl shadow-lg">
                        <PlayCircle className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-8 left-8">
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/20">
                      {trilha.category}
                    </span>
                  </div>
                </div>

                <div className="p-10">
                  <h3 className="text-2xl font-bold text-primary mb-4 italic leading-tight group-hover:text-accent transition-colors">
                    {trilha.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-ink/40 text-sm font-bold uppercase tracking-widest">{trilha.lessons} Aulas</span>
                    <Link to="/signup">
                      <Button variant="ghost" className="text-primary p-0 hover:bg-transparent hover:text-accent flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
                        {trilha.isPremium ? 'Assinar Agora' : 'Começar Grátis'}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Pricing />

      {/* CTA Section */}
      <section className="py-40 px-8 bg-light-green/5">
        <div className="max-w-6xl mx-auto bg-primary rounded-[4rem] p-16 md:p-32 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30">
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold mb-10 italic leading-tight">Pronto para florescer <br /> seu negócio?</h2>
            <p className="text-xl md:text-2xl text-white/80 mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
              Junte-se a centenas de produtores que estão transformando o mercado de produtos naturais.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-light-green hover:text-white px-12 py-6 text-xl shadow-2xl shadow-black/20">
                Assinar Agora
              </Button>
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full -ml-48 -mb-48 blur-3xl" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-primary/5 text-center bg-white">
        <h2 className="text-3xl font-bold text-primary italic mb-8">Eniesse</h2>
        <p className="text-ink/40 text-sm font-bold uppercase tracking-[0.2em]">
          © 2026 Eniesse Grow. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};
