import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { ProgressBar } from '@/src/components/ProgressBar';
import { CheckCircle2, Circle, Play, ArrowLeft, ArrowRight, BookOpen, Clock, Lock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '@/src/services/api';
import { Aula as AulaType, Modulo, Progress, UserProfile } from '@/src/types';
import { auth } from '@/src/firebase';

export const Aula = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [aulas, setAulas] = useState<AulaType[]>([]);
  const [currentAula, setCurrentAula] = useState<AulaType | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      // For now, we assume slug is the trilhaId
      const trilhaId = slug;
      
      const [modulosData, profileData] = await Promise.all([
        api.modulos.getByTrilha(trilhaId),
        auth.currentUser ? api.users.getProfile(auth.currentUser.uid) : Promise.resolve(null)
      ]);
      
      setModulos(modulosData);
      setUserProfile(profileData);
      
      const allAulas: AulaType[] = [];
      for (const modulo of modulosData) {
        const aulasData = await api.aulas.getByModulo(trilhaId, modulo.id);
        allAulas.push(...aulasData);
      }
      setAulas(allAulas);
      
      // If we have a specific aula in mind, we'd need another param or logic.
      // For now, just pick the first one if none is specified.
      const aula = allAulas[0];
      setCurrentAula(aula);
      setLoading(false);
    };

    fetchData();

    if (auth.currentUser) {
      const unsubscribe = api.progress.subscribe(auth.currentUser.uid, (data) => {
        setProgress(data);
      });
      return () => unsubscribe?.();
    }
  }, [slug]);

  const hasAccess = (aula: AulaType | null) => {
    if (!aula) return true;
    if (!aula.isPremium) return true;
    if (userProfile?.plan === 'grow' || userProfile?.plan === 'grow_pro') return true;
    if (slug && userProfile?.purchasedCourses?.includes(slug)) return true;
    return false;
  };

  const handleBuyCourse = () => {
    if (!slug) return;
    navigate(`/checkout?trilhaId=${slug}&amount=97.00`);
  };

  const handleToggleComplete = async () => {
    if (!auth.currentUser || !currentAula || !slug) return;
    if (!hasAccess(currentAula)) return;
    const isCompleted = progress.find(p => p.aulaId === currentAula.id)?.completed;
    await api.progress.markComplete(auth.currentUser.uid, slug, currentAula.id, !isCompleted);
  };

  const isCompleted = progress.find(p => p.aulaId === currentAula?.id)?.completed;
  const currentProgress = (progress.filter(p => p.completed).length / (aulas.length || 1)) * 100;

  if (loading) return <div className="p-12">Carregando aula...</div>;

  const locked = !hasAccess(currentAula);

  return (
    <div className="flex h-screen bg-accent overflow-hidden">
      {/* Sidebar - Lesson List */}
      <aside className="w-80 h-full bg-white border-r border-black/5 flex flex-col">
        <div className="p-8 border-b border-black/5">
          <Link to="/trilhas" className="flex items-center gap-2 text-primary font-bold hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Trilhas
          </Link>
          <h2 className="text-2xl font-bold text-primary italic mb-4">Módulos</h2>
          <ProgressBar progress={currentProgress} showLabel />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {modulos.map((modulo) => (
            <div key={modulo.id}>
              <h3 className="px-4 text-[10px] text-ink/40 font-bold uppercase tracking-widest mb-3">{modulo.title}</h3>
              <div className="space-y-1">
                {aulas.filter(a => a.moduloId === modulo.id).map((aula) => {
                  const aulaProgress = progress.find(p => p.aulaId === aula.id);
                  const isActive = aula.id === currentAula?.id;
                  const isAulaLocked = !hasAccess(aula);
                  
                  return (
                    <button
                      key={aula.id}
                      onClick={() => setCurrentAula(aula)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group',
                        isActive ? 'bg-primary/5 text-primary' : 'text-ink/60 hover:bg-accent hover:text-primary'
                      )}
                    >
                      {isAulaLocked ? (
                        <Lock className="w-5 h-5 text-ink/20 shrink-0" />
                      ) : aulaProgress?.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-primary/20 shrink-0 group-hover:text-primary/40" />
                      )}
                      <span className={cn('text-sm font-medium flex-1', isActive && 'font-bold')}>{aula.title}</span>
                      {aula.isPremium && !isAulaLocked && <ShieldCheck className="w-3 h-3 text-accent" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content - Video & Text */}
      <main className="flex-1 overflow-y-auto p-12 relative">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-3 text-primary font-bold uppercase tracking-widest text-[10px] mb-4">
              <BookOpen className="w-4 h-4" />
              Aula {currentAula?.order}
              <span className="text-ink/20 mx-2">•</span>
              <Clock className="w-4 h-4" />
              15 min
              {currentAula?.isPremium && (
                <>
                  <span className="text-ink/20 mx-2">•</span>
                  <span className="text-accent font-black">Premium</span>
                </>
              )}
            </div>
            <h1 className="text-5xl font-bold text-primary mb-8 italic leading-tight">{currentAula?.title}</h1>
          </header>

          {/* Video Player Placeholder */}
          <div className="aspect-video bg-ink rounded-[2.5rem] mb-12 flex items-center justify-center relative overflow-hidden shadow-2xl group cursor-pointer">
            {locked ? (
              <div className="absolute inset-0 bg-primary/95 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center z-20">
                <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mb-8">
                  <Lock className="w-10 h-10 text-accent" />
                </div>
                <h2 className="text-4xl font-bold text-white italic mb-4">Conteúdo Premium</h2>
                <p className="text-white/60 max-w-md mb-10 text-lg font-medium">
                  Esta aula faz parte do plano Grow. Assine agora para desbloquear o acesso completo.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/perfil">
                    <Button className="bg-accent text-primary hover:bg-accent/90 px-12 py-6 text-xl rounded-2xl font-bold shadow-2xl shadow-accent/20">
                      Assinar Agora
                    </Button>
                  </Link>
                  <Button 
                    variant="outline"
                    onClick={handleBuyCourse}
                    className="border-white/20 text-white hover:bg-white/10 px-12 py-6 text-xl rounded-2xl font-bold"
                  >
                    Comprar Curso (R$ 97,00)
                  </Button>
                </div>
              </div>
            ) : currentAula?.videoUrl ? (
              <iframe
                src={currentAula.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-10 h-10 text-white fill-white" />
                </div>
                <div className="absolute bottom-8 left-8 text-white/60 text-sm font-medium uppercase tracking-widest">Vídeo da Aula</div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className={`lg:col-span-2 space-y-12 ${locked ? 'blur-md pointer-events-none select-none opacity-50' : ''}`}>
              <section className="prose prose-primary max-w-none">
                <h2 className="text-3xl font-bold text-primary italic mb-6">Sobre esta aula</h2>
                <div className="text-ink/70 leading-relaxed text-lg font-light space-y-6">
                  {currentAula?.content || 'Nesta aula, você aprenderá os fundamentos necessários para escalar seu negócio de produtos naturais no ambiente digital. Abordaremos estratégias de branding, logística e atendimento ao cliente.'}
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold text-primary italic mb-8">Checklist de Tarefas</h2>
                <div className="space-y-4">
                  {(currentAula?.checklist || ['Definir persona', 'Escolher paleta de cores', 'Configurar domínio']).map((task, i) => (
                    <Card key={i} className="p-6 flex items-center gap-4 hover:translate-y-0 hover:shadow-sm border-black/5 rounded-2xl">
                      <div className="w-6 h-6 rounded-full border-2 border-primary/20 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                        <div className="w-3 h-3 rounded-full bg-primary opacity-0 hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-ink/60 font-medium">{task}</span>
                    </Card>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <Card className={`p-8 bg-primary text-white rounded-3xl shadow-xl sticky top-8 ${locked ? 'opacity-50 pointer-events-none' : ''}`}>
                <h3 className="text-xl font-bold mb-6 italic">Concluir Aula</h3>
                <p className="text-white/70 mb-8 text-sm font-light leading-relaxed">
                  Marque esta aula como concluída para registrar seu progresso e desbloquear novas conquistas.
                </p>
                <Button
                  onClick={handleToggleComplete}
                  disabled={locked}
                  className={cn(
                    'w-full py-4 text-lg font-bold shadow-lg',
                    isCompleted ? 'bg-white text-primary hover:bg-accent' : 'bg-primary-light text-primary hover:bg-white'
                  )}
                >
                  {isCompleted ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Concluída
                    </span>
                  ) : (
                    'Marcar como Concluída'
                  )}
                </Button>
                
                <div className="mt-8 pt-8 border-t border-white/10 flex justify-between">
                  <Button variant="ghost" className="text-white hover:bg-white/10 px-4" size="sm">
                    Anterior
                  </Button>
                  <Button variant="ghost" className="text-white hover:bg-white/10 px-4" size="sm">
                    Próxima
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper for conditional classes
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
