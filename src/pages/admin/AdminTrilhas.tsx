import React, { useEffect, useState } from 'react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  BookOpen,
  Layers,
  Users
} from 'lucide-react';
import { api } from '@/src/services/api';
import { Trilha } from '@/src/types';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export const AdminTrilhas = () => {
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTrilhas = async () => {
      try {
        const data = await api.trilhas.getAll();
        setTrilhas(data);
      } catch (error) {
        toast.error('Erro ao carregar trilhas');
      } finally {
        setLoading(false);
      }
    };
    fetchTrilhas();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta trilha?')) return;
    try {
      await api.trilhas.delete(id);
      setTrilhas(trilhas.filter(t => t.id !== id));
      toast.success('Trilha excluída com sucesso');
    } catch (error) {
      toast.error('Erro ao excluir trilha');
    }
  };

  const togglePublished = async (trilha: Trilha) => {
    try {
      const updatedTrilha = { ...trilha, published: !trilha.published };
      await api.trilhas.save(updatedTrilha);
      setTrilhas(trilhas.map(t => t.id === trilha.id ? updatedTrilha : t));
      toast.success(`Trilha ${updatedTrilha.published ? 'publicada' : 'desativada'} com sucesso`);
    } catch (error) {
      toast.error('Erro ao atualizar trilha');
    }
  };

  const filteredTrilhas = trilhas.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-1 bg-accent rounded-full" />
            <span className="text-[10px] font-extrabold text-accent uppercase tracking-[0.3em]">Gerenciamento</span>
          </div>
          <h1 className="text-6xl font-bold text-primary italic tracking-tight leading-none">Trilhas</h1>
          <p className="text-xl text-ink/40 font-medium">Crie e gerencie os caminhos de aprendizado da plataforma.</p>
        </div>
        
        <Button className="px-10 py-6 text-lg rounded-2xl shadow-2xl shadow-primary/20 flex items-center gap-3">
          <Plus className="w-6 h-6" />
          Nova Trilha
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/20 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Buscar trilhas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-20 pr-10 py-6 bg-white rounded-[2rem] border border-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-lg font-medium shadow-xl shadow-primary/5"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-ink/40 font-bold uppercase tracking-widest">Carregando trilhas...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredTrilhas.map((trilha, index) => (
            <motion.div
              key={trilha.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-8 bg-white rounded-[2.5rem] border-none shadow-xl shadow-primary/5 flex flex-col md:flex-row items-center gap-8 group">
                <div className="w-full md:w-40 aspect-video bg-light-green/10 rounded-2xl overflow-hidden relative">
                  {trilha.thumbnail ? (
                    <img src={trilha.thumbnail} alt={trilha.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-primary/10" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <p className="text-[10px] text-accent font-extrabold uppercase tracking-[0.2em]">{trilha.category || 'E-commerce'}</p>
                    <span className="text-ink/10">•</span>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${trilha.published ? 'bg-primary/10 text-primary' : 'bg-ink/5 text-ink/30'}`}>
                      {trilha.published ? 'Publicada' : 'Rascunho'}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-primary italic">{trilha.title}</h3>
                  <div className="flex items-center justify-center md:justify-start gap-6 text-ink/40 font-bold text-[10px] uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Layers className="w-3 h-3" /> 4 Módulos</span>
                    <span className="flex items-center gap-2"><Users className="w-3 h-3" /> 128 Alunos</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => togglePublished(trilha)}
                    className="w-12 h-12 p-0 rounded-2xl border border-primary/5 hover:bg-primary/5"
                  >
                    {trilha.published ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-12 h-12 p-0 rounded-2xl border border-primary/5 hover:bg-primary/5"
                  >
                    <Edit2 className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(trilha.id)}
                    className="w-12 h-12 p-0 rounded-2xl border border-primary/5 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
