import { useEffect, useState } from 'react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { Users, Search, Filter, Star, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { UserProfile } from '@/src/types';

export const Especialistas = () => {
  const [specialists, setSpecialists] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'specialist'));
        const snapshot = await getDocs(q);
        setSpecialists(snapshot.docs.map(doc => doc.data() as UserProfile));
      } catch (error) {
        console.error('Error fetching specialists:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSpecialists = specialists.filter(s => 
    s.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.specialties?.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-16 max-w-7xl mx-auto space-y-16">
      <header className="space-y-4">
        <h1 className="text-7xl font-bold text-primary italic tracking-tight">Nossos Especialistas</h1>
        <p className="text-2xl text-ink/50 font-medium max-w-2xl leading-relaxed">
          Conecte-se com profissionais experientes prontos para ajudar seu negócio a florescer.
        </p>
      </header>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Procure por especialidade (ex: Branding, Logística...)"
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
          {filteredSpecialists.length > 0 ? (
            filteredSpecialists.map((specialist, index) => (
              <motion.div
                key={specialist.uid}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="p-12 rounded-[3rem] h-full flex flex-col group hover:bg-primary hover:text-white transition-all duration-700 border-none shadow-2xl shadow-primary/5">
                  <div className="flex items-start justify-between mb-10">
                    <div className="w-28 h-28 bg-light-green/20 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:border-white/20 transition-all duration-700">
                      {specialist.photoURL ? (
                        <img src={specialist.photoURL} alt={specialist.displayName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="w-12 h-12 text-primary/20" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full group-hover:bg-white/10 transition-colors">
                      <Star className="w-4 h-4 text-accent group-hover:text-white fill-accent group-hover:fill-white" />
                      <span className="text-xs font-bold text-primary group-hover:text-white">4.9</span>
                    </div>
                  </div>

                  <div className="space-y-4 flex-1 flex flex-col">
                    <h3 className="text-4xl font-bold text-primary italic leading-tight group-hover:text-white transition-colors">{specialist.displayName}</h3>
                    <p className="text-[10px] text-accent font-extrabold uppercase tracking-[0.2em] group-hover:text-white/60 transition-colors">Marketing Digital & Branding</p>
                    
                    <p className="text-ink/60 font-medium leading-relaxed flex-1 text-lg group-hover:text-white/80 transition-colors">
                      {specialist.bio || 'Especialista em ajudar pequenos produtores a criarem marcas fortes e memoráveis no mercado digital.'}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-6">
                      {(specialist.specialties || ['Branding', 'Logística', 'SEO']).map((spec, i) => (
                        <span key={i} className="text-[10px] font-bold px-4 py-2 rounded-full bg-primary/5 text-primary uppercase tracking-widest group-hover:bg-white/10 group-hover:text-white transition-colors">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-10">
                    <Button className="flex-1 py-5 text-lg rounded-2xl group-hover:bg-white group-hover:text-primary shadow-xl shadow-primary/10">
                      Contratar
                    </Button>
                    <Button variant="outline" className="p-5 h-auto rounded-2xl group-hover:border-white/20 group-hover:text-white group-hover:hover:bg-white/10 border-primary/10">
                      <MessageCircle className="w-6 h-6" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-32 space-y-8">
              <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Users className="w-16 h-16 text-primary/10" />
              </div>
              <div className="space-y-4">
                <h3 className="text-5xl font-bold text-primary italic">Nenhum especialista encontrado</h3>
                <p className="text-2xl text-ink/40 font-medium">Tente ajustar seus filtros ou termos de busca.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
