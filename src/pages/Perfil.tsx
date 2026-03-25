import { useEffect, useState } from 'react';
import { auth } from '@/src/firebase';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { User, Mail, Shield, CreditCard, LogOut, Camera, Save, Zap, Star, ShieldCheck, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { getUserProfile, saveUserProfile } from '@/src/services/firestoreService';
import { UserProfile, PlanType } from '@/src/types';
import { toast } from 'sonner';

export const Perfil = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        const data = await getUserProfile(auth.currentUser.uid);
        setProfile(data);
        setDisplayName(data?.displayName || '');
        setBio(data?.bio || '');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const updatedProfile = {
        ...profile,
        displayName,
        bio
      };
      await saveUserProfile(updatedProfile);
      setProfile(updatedProfile);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Erro ao atualizar perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePlan = async (plan: PlanType) => {
    if (!profile) return;
    setSaving(true);
    try {
      const updatedProfile = {
        ...profile,
        plan
      };
      await saveUserProfile(updatedProfile);
      setProfile(updatedProfile);
      toast.success(`Plano atualizado para ${plan.toUpperCase()}!`);
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error('Erro ao atualizar plano.');
    } finally {
      setSaving(false);
    }
  };

  const getPlanName = (plan?: PlanType) => {
    switch (plan) {
      case 'grow': return 'Grow';
      case 'grow_pro': return 'Grow Pro';
      default: return 'Gratuito';
    }
  };

  const getPlanIcon = (plan?: PlanType) => {
    switch (plan) {
      case 'grow': return <Star className="w-4 h-4 text-accent" />;
      case 'grow_pro': return <ShieldCheck className="w-4 h-4 text-accent" />;
      default: return <Zap className="w-4 h-4 text-primary" />;
    }
  };

  if (loading) return <div className="p-12">Carregando perfil...</div>;

  return (
    <div className="p-12 max-w-5xl mx-auto">
      <header className="mb-16">
        <h1 className="text-6xl font-bold text-primary mb-6 italic">Meu Perfil</h1>
        <p className="text-2xl text-ink/60 font-light max-w-2xl leading-relaxed">
          Gerencie suas informações pessoais e configurações da conta.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <Card className="p-10 text-center rounded-[3rem] shadow-xl border-black/5 bg-white sticky top-12">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="w-full h-full bg-primary-light/20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-primary/20" />
                  </div>
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            
            <h2 className="text-3xl font-bold text-primary mb-2 italic leading-tight">{profile?.displayName}</h2>
            <p className="text-xs text-primary font-bold uppercase tracking-widest mb-8">{profile?.role}</p>
            
            <div className="space-y-4 pt-8 border-t border-black/5">
              <div className="flex items-center gap-3 text-ink/60">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-ink/60">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm">Conta Verificada</span>
              </div>
              <div className="flex items-center gap-3 text-ink/60">
                {getPlanIcon(profile?.plan)}
                <div className="text-left">
                  <span className="text-sm font-bold block">Plano {getPlanName(profile?.plan)}</span>
                  {profile?.subscriptionPeriod && (
                    <span className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">
                      Cobrança {profile.subscriptionPeriod === 'monthly' ? 'Mensal' : 'Anual'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {profile?.purchasedCourses && profile.purchasedCourses.length > 0 && (
              <div className="mt-8 pt-8 border-t border-black/5 text-left">
                <h4 className="text-[10px] text-primary font-bold uppercase tracking-widest mb-4">Cursos Comprados</h4>
                <div className="space-y-2">
                  {profile.purchasedCourses.map((courseId) => (
                    <div key={courseId} className="flex items-center gap-2 text-xs text-ink/60 bg-accent/10 p-2 rounded-lg">
                      <BookOpen className="w-3 h-3 text-primary" />
                      <span className="font-medium truncate">{courseId}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              variant="ghost"
              onClick={() => auth.signOut()}
              className="w-full mt-12 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair da Conta
            </Button>
          </Card>
        </div>

        {/* Edit Profile */}
        <div className="md:col-span-2 space-y-12">
          <Card className="p-12 rounded-[3rem] shadow-xl border-black/5 bg-white">
            <h3 className="text-3xl font-bold text-primary mb-12 italic">Informações Básicas</h3>
            
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-4">Nome Completo</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-8 py-4 bg-accent/50 rounded-2xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-4">Bio / Descrição</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-8 py-4 bg-accent/50 rounded-2xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg resize-none"
                  placeholder="Conte um pouco sobre você e seu negócio..."
                />
              </div>

              <div className="pt-8">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-4 text-lg font-bold shadow-lg"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-12 rounded-[3rem] shadow-xl border-black/5 bg-white">
            <h3 className="text-3xl font-bold text-primary mb-8 italic">Configurações de Assinatura</h3>
            <div className="p-8 bg-primary/5 rounded-3xl border border-primary/10 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-bold text-primary mb-1 italic">Plano {getPlanName(profile?.plan)}</p>
                  <p className="text-sm text-ink/60 font-light">
                    {profile?.plan === 'free' 
                      ? 'Acesse conteúdos básicos e comece sua jornada.' 
                      : 'Você tem acesso total aos conteúdos premium da plataforma.'}
                  </p>
                </div>
                {getPlanIcon(profile?.plan)}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Simular Assinatura (Demo)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button 
                  variant={profile?.plan === 'free' ? 'primary' : 'outline'} 
                  onClick={() => handleUpdatePlan('free')}
                  className="rounded-2xl py-4"
                >
                  Plano Free
                </Button>
                <Button 
                  variant={profile?.plan === 'grow' ? 'primary' : 'outline'} 
                  onClick={() => handleUpdatePlan('grow')}
                  className="rounded-2xl py-4 border-accent text-accent hover:bg-accent hover:text-primary"
                >
                  Plano Grow
                </Button>
                <Button 
                  variant={profile?.plan === 'grow_pro' ? 'primary' : 'outline'} 
                  onClick={() => handleUpdatePlan('grow_pro')}
                  className="rounded-2xl py-4 border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Plano Grow Pro
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
