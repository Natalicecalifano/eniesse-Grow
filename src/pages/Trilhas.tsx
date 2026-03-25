import { useEffect, useState } from 'react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { BookOpen, Search, Filter, Lock, PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '@/src/services/api';
import { Trilha, UserProfile } from '@/src/types';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '@/src/firebase';

export const Trilhas = () => {
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [trilhasData, profileData] = await Promise.all([
        api.trilhas.getAll(),
        auth.currentUser ? api.users.getProfile(auth.currentUser.uid) : Promise.resolve(null)
      ]);
      setTrilhas(trilhasData);
      setUserProfile(profileData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const hasAccess = (trilha: Trilha) => {
    if (!trilha.isPremium) return true;
    if (userProfile?.plan === 'grow' || userProfile?.plan === 'grow_pro') return true;
    if (userProfile?.purchasedCourses?.includes(trilha.id)) return true;
    return false;
  };

  const handleBuyCourse = (trilha: Trilha) => {
    const price = trilha.price || 97.00;
    navigate(`/checkout?trilhaId=${trilha.id}&trilhaTitle=${encodeURIComponent(trilha.title)}&amount=${price}`);
  };

  const filteredTrilhas = trilhas.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-16 max-w-7xl mx-auto space-y-16">
      <header className="space-y-4">
        <h1 className="text-7xl font-bold text-primary italic tracking-tight">Trilhas de Aprendizado</h1>
        <p className="text-2xl text-ink/50 font-medium max-w-2xl leading-relaxed">
          Explore nossos caminhos estruturados para levar seu negócio ao próximo nível.
        </p>
      </header>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="O que você quer aprender hoje?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-20 pr-10 py-6 bg-white rounded-[2rem] border border-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-lg font-medium shadow-xl shadow-primary/5 placeholder:text-primary/30"
          />
        </div>
        <Button variant="outline" className="px-10 py-6 h-auto rounded-[2rem] flex items-center gap-4 border-primary/10 text-primary font-bold uppercase tracking-widest text-sm hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/5">
          <Filter className="w-5 h-5" />
          Filtros
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-light-green/5 rounded-[3rem] h-[500px] border border-primary/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredTrilhas.map((trilha, index) => {
            const locked = !hasAccess(trilha);
            return (
              <motion.div
                key={trilha.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className={`overflow-hidden p-0 group h-full flex flex-col rounded-[3rem] border-none shadow-2xl shadow-primary/5 transition-all duration-500 ${locked ? 'opacity-90' : ''}`}>
                  <div className="h-72 bg-light-green/10 relative overflow-hidden">
                    {trilha.thumbnail ? (
                      <img src={trilha.thumbnail} alt={trilha.title} className={`w-full h-full object-cover transition-transform duration-1000 ${locked ? 'grayscale blur-[2px]' : 'group-hover:scale-110'}`} referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-20 h-20 text-primary/5" />
                      </div>
                    )}
                    
                    <div className="absolute top-8 right-8">
                      {locked ? (
                        <div className="bg-accent/90 backdrop-blur-md text-primary p-3 rounded-2xl shadow-lg">
                          <Lock className="w-5 h-5" />
                        </div>
                      ) : trilha.isPremium ? (
                        <div className="bg-primary/90 backdrop-blur-md text-white p-3 rounded-2xl shadow-lg">
                          <PlayCircle className="w-5 h-5" />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="p-12 flex-1 flex flex-col space-y-6">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-accent font-extrabold uppercase tracking-[0.2em]">{trilha.category || 'E-commerce'}</p>
                      <span className="text-[10px] text-ink/30 font-bold uppercase tracking-widest">12 Aulas</span>
                    </div>
                    <h3 className="text-4xl font-bold text-primary italic leading-tight group-hover:text-accent transition-colors">{trilha.title}</h3>
                    <p className="text-ink/60 font-medium leading-relaxed flex-1 text-lg">
                      {trilha.description || 'Aprenda as melhores estratégias para vender seus produtos naturais online.'}
                    </p>
                    
                    {locked ? (
                      <div className="space-y-4 pt-6">
                        <Button 
                          onClick={() => handleBuyCourse(trilha)}
                          className="w-full py-5 text-lg rounded-2xl shadow-xl shadow-accent/20 bg-accent text-primary hover:bg-accent/90"
                        >
                          Comprar Curso (R$ {trilha.price || '97,00'})
                        </Button>
                        <Link to="/perfil" className="block">
                          <Button variant="ghost" className="w-full py-3 text-xs font-bold uppercase tracking-widest text-primary/40 hover:text-primary">
                            Assinar Plano Grow
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Link to={`/aula/${trilha.id}`} className="pt-6">
                        <Button className="w-full py-5 text-lg rounded-2xl shadow-xl shadow-primary/10">Acessar Trilha</Button>
                      </Link>
                    )}
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
