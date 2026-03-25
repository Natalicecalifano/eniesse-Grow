import { useEffect, useState } from 'react';
import { auth } from '@/src/firebase';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { ProgressBar } from '@/src/components/ProgressBar';
import { BookOpen, Users, Trophy, ArrowRight, Play, Zap, Star, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '@/src/services/api';
import { Trilha, Progress, UserProfile, PlanType } from '@/src/types';
import { Link } from 'react-router-dom';
import { populateMockData } from '@/src/services/mockData';

export const Dashboard = () => {
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const handlePopulate = async () => {
    await populateMockData();
    window.location.reload();
  };

  useEffect(() => {
    const fetchData = async () => {
      const trilhasData = await api.trilhas.getAll();
      setTrilhas(trilhasData);
      
      if (auth.currentUser) {
        const profileData = await api.users.getProfile(auth.currentUser.uid);
        setProfile(profileData);
      }
      
      setLoading(false);
    };

    fetchData();

    if (auth.currentUser) {
      const unsubscribe = api.progress.subscribe(auth.currentUser.uid, (data) => {
        setProgress(data);
      });
      return () => unsubscribe?.();
    }
  }, []);

  const getPlanBadge = (plan?: PlanType) => {
    switch (plan) {
      case 'grow':
        return (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-accent/10 text-accent rounded-full border border-accent/20">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest">Grow</span>
          </div>
        );
      case 'grow_pro':
        return (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20">
            <ShieldCheck className="w-3 h-3 fill-current" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest">Grow Pro</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-ink/5 text-ink/40 rounded-full border border-ink/10">
            <Zap className="w-3 h-3" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest">Free</span>
          </div>
        );
    }
  };

  const completedLessons = progress.filter(p => p.completed).length;
  const totalLessons = 24; // Mock total lessons for now
  const overallProgress = (completedLessons / totalLessons) * 100;

  if (loading) return <div className="p-16">Carregando dashboard...</div>;

  return (
    <div className="p-16 max-w-7xl mx-auto space-y-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <span className="w-12 h-1 bg-accent rounded-full" />
              <span className="text-[10px] font-extrabold text-accent uppercase tracking-[0.3em]">Dashboard</span>
            </motion.div>
            {getPlanBadge(profile?.plan)}
          </div>
          <h1 className="text-7xl font-bold text-primary italic tracking-tight leading-none">
            Olá, {auth.currentUser?.displayName?.split(' ')[0]}!
          </h1>
          <p className="text-2xl text-ink/40 font-medium">Bem-vindo de volta à sua jornada de crescimento.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="sm" onClick={handlePopulate} className="text-[10px] opacity-10 hover:opacity-100 uppercase tracking-widest font-bold">
            Populate Mock Data
          </Button>
          <div className="flex -space-x-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-light-green/20 overflow-hidden shadow-lg" />
            ))}
            <div className="w-12 h-12 rounded-full border-4 border-white bg-primary text-white flex items-center justify-center text-xs font-bold shadow-lg z-10">
              +12
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Progress & Main Content */}
        <div className="lg:col-span-8 space-y-20">
          {/* Modern Progress Card */}
          <section className="space-y-8">
            <div className="flex justify-between items-end">
              <h2 className="text-3xl font-bold text-primary italic tracking-tight">Seu Progresso</h2>
              <span className="text-sm font-bold text-accent uppercase tracking-widest">Nível 1: Iniciante</span>
            </div>
            <Card className="p-12 bg-white shadow-[0_40px_100px_rgba(20,69,36,0.08)] rounded-[3rem] border-none group overflow-hidden relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-8">
                  <p className="text-2xl text-ink/60 font-medium leading-relaxed">
                    Você está no início da sua jornada. Complete as aulas e evolua seu negócio passo a passo.
                  </p>
                  <div className="space-y-4">
                    <ProgressBar progress={overallProgress} showLabel className="h-6" />
                    <p className="text-sm text-ink/30 font-bold uppercase tracking-widest">
                      {completedLessons} de {totalLessons} aulas concluídas
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Link to="/trilhas">
                      <Button className="px-10 py-6 text-lg rounded-2xl shadow-2xl shadow-primary/20 group">
                        Continuar Aula
                        <Play className="ml-3 w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                      </Button>
                    </Link>
                    {profile?.plan === 'free' && (
                      <Link to="/perfil">
                        <Button variant="outline" className="px-10 py-6 text-lg rounded-2xl border-accent text-accent hover:bg-accent hover:text-primary">
                          Fazer Upgrade
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                <div className="hidden md:block relative">
                  <div className="aspect-square bg-light-green/10 rounded-[3rem] flex items-center justify-center relative overflow-hidden">
                    <Trophy className="w-32 h-32 text-primary/10 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  </div>
                </div>
              </div>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-1000" />
            </Card>
          </section>

          {/* Última Aula Acessada */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-primary italic tracking-tight">Última Aula Acessada</h2>
            <Card className="p-8 bg-light-green/5 border-none rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 group cursor-pointer hover:bg-light-green/10 transition-all">
              <div className="w-full md:w-48 aspect-video bg-primary/10 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-10 h-10 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex-1 space-y-2 text-center md:text-left">
                <p className="text-[10px] text-accent font-extrabold uppercase tracking-[0.2em]">Módulo 1: Branding</p>
                <h3 className="text-3xl font-bold text-primary italic">Definindo sua Identidade Visual</h3>
                <p className="text-ink/40 font-medium">Restam 12 minutos • 65% assistido</p>
              </div>
              <Button variant="ghost" className="rounded-full w-16 h-16 p-0 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                <ArrowRight className="w-6 h-6" />
              </Button>
            </Card>
          </section>

          {/* Trilhas Recomendadas */}
          <section className="space-y-10">
            <div className="flex justify-between items-end">
              <h2 className="text-3xl font-bold text-primary italic tracking-tight">Trilhas Recomendadas</h2>
              <Link to="/trilhas" className="text-accent font-bold text-xs uppercase tracking-[0.2em] hover:text-primary transition-colors">Ver Todas</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {trilhas.slice(0, 2).map((trilha, index) => (
                <motion.div
                  key={trilha.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="overflow-hidden p-0 group border-none shadow-xl shadow-primary/5 rounded-[3rem] h-full flex flex-col">
                    <div className="h-64 bg-light-green/10 relative overflow-hidden">
                      {trilha.thumbnail ? (
                        <img src={trilha.thumbnail} alt={trilha.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-primary/10" />
                        </div>
                      )}
                    </div>
                    <div className="p-10 space-y-6 flex-1 flex flex-col">
                      <div className="space-y-2">
                        <p className="text-[10px] text-accent font-extrabold uppercase tracking-[0.2em]">{trilha.category || 'E-commerce'}</p>
                        <h3 className="text-3xl font-bold text-primary italic leading-tight group-hover:text-accent transition-colors">{trilha.title}</h3>
                      </div>
                      <div className="flex-1" />
                      <Link to={`/trilhas/${trilha.id}/aula/1`}>
                        <Button variant="outline" className="w-full py-5 rounded-2xl border-primary/10 hover:border-primary text-sm font-bold uppercase tracking-widest">Acessar Trilha</Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar Content */}
        <div className="lg:col-span-4 space-y-16">
          {/* Próximas Aulas */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-primary italic tracking-tight">Próximas Aulas</h2>
            <div className="space-y-4">
              {[
                { title: 'Psicologia das Cores', duration: '15 min', module: 'Branding' },
                { title: 'Escolha de Tipografia', duration: '22 min', module: 'Branding' },
                { title: 'Criação de Logo', duration: '45 min', module: 'Design' },
              ].map((aula, i) => (
                <Card key={i} className="p-6 rounded-3xl border-none shadow-lg shadow-primary/5 hover:bg-light-green/5 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-accent font-extrabold uppercase tracking-widest">{aula.module}</p>
                      <h4 className="text-lg font-bold text-primary italic">{aula.title}</h4>
                      <p className="text-xs text-ink/30 font-bold">{aula.duration}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Specialists Card */}
          <Card className="p-10 bg-primary text-white shadow-2xl shadow-primary/20 border-none rounded-[3.5rem] relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold italic tracking-tight">Especialistas</h3>
              </div>
              <p className="text-white/70 font-medium leading-relaxed">Precisa de ajuda com seu branding ou logística? Nossos especialistas estão prontos para ajudar.</p>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-white/20 rounded-full" />
                    <div>
                      <p className="text-sm font-bold">Especialista {i}</p>
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-0.5">Marketing Digital</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/especialistas" className="block">
                <Button className="w-full py-5 rounded-2xl bg-white text-primary hover:bg-light-green hover:text-white font-bold uppercase tracking-widest text-xs">Falar com Especialista</Button>
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          </Card>

          {/* Community Stats */}
          <Card className="p-10 bg-light-green/5 border-none rounded-[3rem] space-y-8">
            <h3 className="text-2xl font-bold text-primary italic tracking-tight">Comunidade Eniesse</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-3xl font-bold text-primary leading-none">1.2k</p>
                <p className="text-[10px] text-ink/30 font-extrabold uppercase tracking-widest">Membros</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-primary leading-none">450+</p>
                <p className="text-[10px] text-ink/30 font-extrabold uppercase tracking-widest">Projetos</p>
              </div>
            </div>
            <div className="pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-light-green/20" />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
