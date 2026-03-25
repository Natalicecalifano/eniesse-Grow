import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Target, Users, Zap, ShieldCheck, Star } from 'lucide-react';
import { Button } from '@/src/components/Button';

export const About = () => {
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

      <main className="max-w-5xl mx-auto px-8 py-20 space-y-32">
        {/* Hero Section */}
        <section className="space-y-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-8xl font-black text-primary italic tracking-tighter leading-none"
          >
            Nossa Missão é o <br />
            <span className="text-accent">Seu Crescimento.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-ink/60 font-medium max-w-3xl mx-auto leading-relaxed"
          >
            A Eniesse Grow nasceu da necessidade de transformar o aprendizado digital em resultados reais para empreendedores e criativos.
          </motion.p>
        </section>

        {/* Values Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Target, title: 'Foco em Resultados', desc: 'Não ensinamos apenas teoria. Ensinamos o que funciona no campo de batalha.' },
            { icon: Users, title: 'Comunidade Forte', desc: 'Ninguém cresce sozinho. Nossa rede de especialistas e alunos é o nosso maior ativo.' },
            { icon: Zap, title: 'Inovação Constante', desc: 'O mercado muda rápido. Nós mudamos mais rápido ainda para manter você à frente.' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-6 p-10 bg-white rounded-[3rem] shadow-xl shadow-primary/5"
            >
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-primary italic tracking-tight">{item.title}</h3>
              <p className="text-ink/60 font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-black text-primary italic tracking-tighter">Uma plataforma feita por quem faz.</h2>
            <div className="space-y-6 text-lg text-ink/60 font-medium leading-relaxed">
              <p>Fundada em 2024, a Eniesse Grow começou como um pequeno grupo de mentoria e rapidamente se tornou a referência em educação para o novo mercado digital.</p>
              <p>Acreditamos que a educação tradicional está quebrada. O mundo precisa de agilidade, prática e conexões reais. É isso que entregamos em cada trilha de aprendizado.</p>
            </div>
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-4xl font-black text-primary italic tracking-tighter">10k+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Alunos Ativos</p>
              </div>
              <div>
                <p className="text-4xl font-black text-primary italic tracking-tighter">50+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Especialistas</p>
              </div>
              <div>
                <p className="text-4xl font-black text-primary italic tracking-tighter">98%</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Satisfação</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 rounded-[4rem] -rotate-3" />
            <img 
              src="https://picsum.photos/seed/growth/800/1000" 
              alt="Growth" 
              className="relative rounded-[4rem] shadow-2xl shadow-primary/20 rotate-3 transition-transform hover:rotate-0 duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary p-16 md:p-24 rounded-[4rem] text-center space-y-10 shadow-2xl shadow-primary/20">
          <h2 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter">Pronto para começar sua jornada?</h2>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link to="/signup">
              <Button className="px-12 py-6 text-xl rounded-2xl bg-white text-primary hover:bg-accent hover:text-primary">
                Criar Conta Grátis
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" className="px-12 py-6 text-xl rounded-2xl border-white/20 text-white hover:bg-white/10">
                Ver Planos Premium
              </Button>
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
