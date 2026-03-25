import React, { useEffect, useState } from 'react';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { 
  Settings, 
  Globe, 
  ShieldCheck, 
  Mail, 
  Bell, 
  Database, 
  Zap, 
  Star,
  Lock,
  Smartphone,
  CreditCard
} from 'lucide-react';
import { api } from '@/src/services/api';
import { PlatformSettings } from '@/src/types';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export const AdminSettings = () => {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.settings.get();
        setSettings(data);
      } catch (error) {
        toast.error('Erro ao carregar configurações');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.settings.save(settings);
      toast.success('Configurações salvas com sucesso');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    }
  };

  if (loading) return <div className="p-12 text-center text-ink/40 font-bold uppercase tracking-widest">Carregando configurações...</div>;

  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="w-12 h-1 bg-accent rounded-full" />
          <span className="text-[10px] font-extrabold text-accent uppercase tracking-[0.3em]">Configurações</span>
        </div>
        <h1 className="text-6xl font-bold text-primary italic tracking-tight leading-none">Configurações da Plataforma</h1>
        <p className="text-xl text-ink/40 font-medium">Gerencie as preferências globais e integrações do sistema.</p>
      </header>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column - Navigation */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-2">
            {[
              { icon: Globe, label: 'Geral', active: true },
              { icon: ShieldCheck, label: 'Segurança', active: false },
              { icon: Bell, label: 'Notificações', active: false },
              { icon: CreditCard, label: 'Pagamentos', active: false },
              { icon: Database, label: 'Integrações', active: false },
            ].map((item, i) => (
              <Button
                key={i}
                variant="ghost"
                className={`w-full justify-start gap-4 px-8 py-4 rounded-2xl transition-all ${item.active ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-ink/60 hover:bg-light-green/5 hover:text-primary'}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
              </Button>
            ))}
          </div>

          <Card className="p-10 bg-accent text-primary rounded-[3rem] border-none shadow-2xl shadow-accent/20 relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl font-bold italic tracking-tight">Backup</h3>
              <p className="text-primary/60 font-medium leading-relaxed">Último backup realizado há 2 horas.</p>
              <Button className="w-full py-4 rounded-xl bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-widest text-[10px]">Realizar Backup Agora</Button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          </Card>
        </div>

        {/* Right Column - Settings Form */}
        <div className="lg:col-span-8 space-y-12">
          <Card className="p-12 bg-white rounded-[3.5rem] border-none shadow-2xl shadow-primary/5 space-y-12">
            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-primary italic tracking-tight flex items-center gap-4">
                <Globe className="w-8 h-8" />
                Informações Gerais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-4">Nome da Plataforma</label>
                  <input
                    type="text"
                    value={settings?.platformName || 'Eniesse Grow'}
                    onChange={(e) => setSettings(s => s ? { ...s, platformName: e.target.value } : null)}
                    className="w-full px-8 py-5 bg-accent/30 rounded-2xl border border-transparent focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-lg font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ink/40 ml-4">URL da Plataforma</label>
                  <input
                    type="text"
                    value="https://eniesse.grow"
                    className="w-full px-8 py-5 bg-accent/30 rounded-2xl border border-transparent focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-lg font-medium"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-3xl font-bold text-primary italic tracking-tight flex items-center gap-4">
                <ShieldCheck className="w-8 h-8" />
                Segurança & Acesso
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Permitir novos registros', enabled: settings?.allowNewRegistrations ?? true },
                  { label: 'Exigir verificação de email', enabled: true },
                  { label: 'Modo de manutenção', enabled: settings?.maintenanceMode ?? false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-light-green/5 rounded-2xl">
                    <span className="text-lg font-bold text-primary italic">{item.label}</span>
                    <button 
                      type="button"
                      className={`w-14 h-8 rounded-full transition-all relative ${item.enabled ? 'bg-primary' : 'bg-ink/10'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${item.enabled ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <div className="pt-8 border-t border-primary/5 flex justify-end gap-4">
              <Button variant="ghost" className="px-10 py-6 text-lg rounded-2xl font-bold text-ink/40 hover:text-primary">Cancelar</Button>
              <Button type="submit" className="px-12 py-6 text-lg rounded-2xl shadow-2xl shadow-primary/20 font-bold">Salvar Alterações</Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
};
