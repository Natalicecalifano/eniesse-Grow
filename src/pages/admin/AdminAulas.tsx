import React, { useEffect, useState } from 'react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Play,
  Clock,
  ArrowLeft,
  BookOpen,
  Layers
} from 'lucide-react';
import { api } from '@/src/services/api';
import { Trilha, Modulo, Aula } from '@/src/types';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export const AdminAulas = () => {
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [selectedTrilhaId, setSelectedTrilhaId] = useState<string | null>(null);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTrilhas = async () => {
      try {
        const data = await api.trilhas.getAll();
        setTrilhas(data);
        if (data.length > 0) setSelectedTrilhaId(data[0].id);
      } catch (error) {
        toast.error('Erro ao carregar trilhas');
      } finally {
        setLoading(false);
      }
    };
    fetchTrilhas();
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      if (!selectedTrilhaId) return;
      setLoading(true);
      try {
        const modulosData = await api.modulos.getByTrilha(selectedTrilhaId);
        setModulos(modulosData);
        
        const allAulas: Aula[] = [];
        for (const modulo of modulosData) {
          const aulasData = await api.aulas.getByModulo(selectedTrilhaId, modulo.id);
          allAulas.push(...aulasData);
        }
        setAulas(allAulas);
      } catch (error) {
        toast.error('Erro ao carregar conteúdo');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [selectedTrilhaId]);

  const handleDeleteAula = async (trilhaId: string, moduloId: string, aulaId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta aula?')) return;
    try {
      await api.aulas.delete(trilhaId, moduloId, aulaId);
      setAulas(aulas.filter(a => a.id !== aulaId));
      toast.success('Aula excluída com sucesso');
    } catch (error) {
      toast.error('Erro ao excluir aula');
    }
  };

  const filteredAulas = aulas.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-1 bg-accent rounded-full" />
            <span className="text-[10px] font-extrabold text-accent uppercase tracking-[0.3em]">Gerenciamento</span>
          </div>
          <h1 className="text-6xl font-bold text-primary italic tracking-tight leading-none">Aulas</h1>
          <p className="text-xl text-ink/40 font-medium">Gerencie o conteúdo de cada trilha e módulo.</p>
        </div>
        
        <Button className="px-10 py-6 text-lg rounded-2xl shadow-2xl shadow-primary/20 flex items-center gap-3">
          <Plus className="w-6 h-6" />
          Nova Aula
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-80 space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-4">Selecionar Trilha</label>
          <select 
            value={selectedTrilhaId || ''} 
            onChange={(e) => setSelectedTrilhaId(e.target.value)}
            className="w-full px-8 py-5 bg-white rounded-2xl border border-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-lg font-medium shadow-xl shadow-primary/5 appearance-none cursor-pointer"
          >
            {trilhas.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
        </div>

        <div className="relative flex-1 group pt-8">
          <Search className="absolute left-8 top-[calc(50%+1rem)] -translate-y-1/2 w-5 h-5 text-primary/20 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Buscar aulas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-20 pr-10 py-6 bg-white rounded-[2rem] border border-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-lg font-medium shadow-xl shadow-primary/5"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-ink/40 font-bold uppercase tracking-widest">Carregando conteúdo...</div>
      ) : (
        <div className="space-y-12">
          {modulos.map((modulo) => (
            <section key={modulo.id} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-primary italic">{modulo.title}</h2>
                <span className="text-ink/10">•</span>
                <span className="text-[10px] text-ink/30 font-bold uppercase tracking-widest">
                  {aulas.filter(a => a.moduloId === modulo.id).length} Aulas
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {filteredAulas.filter(a => a.moduloId === modulo.id).map((aula, index) => (
                  <motion.div
                    key={aula.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-6 bg-white rounded-2xl border-none shadow-lg shadow-primary/5 flex items-center gap-6 group">
                      <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <Play className="w-5 h-5 fill-current" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-primary italic">{aula.title}</h4>
                        <div className="flex items-center gap-4 text-ink/30 font-bold text-[10px] uppercase tracking-widest">
                          <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> {aula.duration || '15:00'}</span>
                          {aula.isPremium && <span className="text-accent font-black">Premium</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-10 h-10 p-0 rounded-xl border border-primary/5 hover:bg-primary/5"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteAula(selectedTrilhaId!, modulo.id, aula.id)}
                          className="w-10 h-10 p-0 rounded-xl border border-primary/5 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
