import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  ShieldCheck,
  Zap,
  Star
} from 'lucide-react';
import { auth } from '@/src/firebase';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { api } from '@/src/services/api';
import { Button } from '@/src/components/Button';
import { Card } from '@/src/components/Card';
import { toast } from 'sonner';

export const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      await api.users.saveProfile({
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        displayName: name,
        role: 'student',
        plan: 'free',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      toast.success('Conta criada com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await api.users.saveProfile({
        uid: result.user.uid,
        email: result.user.email!,
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || '',
        role: 'student',
        plan: 'free',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      toast.success('Bem-vindo(a)!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Erro ao entrar com Google.');
    }
  };

  return (
    <div className="min-h-screen bg-accent flex flex-col lg:flex-row selection:bg-primary selection:text-white">
      {/* Left Side - Visual/Marketing */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-20 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,99,33,0.15),transparent_50%)]" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
        
        <Link to="/" className="flex items-center gap-3 relative z-10 group">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary font-black italic shadow-2xl shadow-black/20 group-hover:scale-110 transition-transform">E</div>
          <span className="text-2xl font-bold text-white italic tracking-tight">Eniesse Grow</span>
        </Link>

        <div className="space-y-12 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-7xl font-black text-white italic tracking-tighter leading-none"
          >
            Comece sua <br />
            <span className="text-accent">Jornada Agora.</span>
          </motion.h1>
          
          <div className="space-y-8">
            {[
              { icon: Zap, text: 'Acesso imediato a trilhas gratuitas' },
              { icon: Star, text: 'Comunidade de empreendedores' },
              { icon: ShieldCheck, text: 'Certificados reconhecidos' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center gap-4 text-white/80"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-accent">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-lg font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest">© 2026 Eniesse Grow Platform</p>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-12"
        >
          <div className="space-y-4">
            <Link to="/" className="lg:hidden flex items-center gap-2 text-primary/40 hover:text-primary transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Voltar</span>
            </Link>
            <h2 className="text-5xl font-black text-primary italic tracking-tighter">Criar Conta</h2>
            <p className="text-xl text-ink/40 font-medium">Junte-se a milhares de alunos em todo o mundo.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/20 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Seu Nome Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-16 pr-8 py-5 bg-white rounded-2xl border border-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-lg font-medium shadow-xl shadow-primary/5"
                />
              </div>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/20 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  placeholder="Seu melhor email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-16 pr-8 py-5 bg-white rounded-2xl border border-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-lg font-medium shadow-xl shadow-primary/5"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/20 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  placeholder="Sua senha segura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-16 pr-8 py-5 bg-white rounded-2xl border border-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-lg font-medium shadow-xl shadow-primary/5"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full py-6 text-xl rounded-2xl shadow-2xl shadow-primary/20 flex items-center justify-center gap-3"
            >
              {loading ? 'Criando conta...' : 'Criar Minha Conta'}
              {!loading && <ArrowRight className="w-6 h-6" />}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="bg-accent px-4 text-primary/30">Ou continue com</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={handleGoogleSignup}
            className="w-full py-5 rounded-2xl border-primary/10 hover:bg-white flex items-center justify-center gap-4"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            <span className="text-sm font-bold text-primary uppercase tracking-widest">Google Account</span>
          </Button>

          <p className="text-center text-sm font-medium text-ink/40">
            Já tem uma conta? <Link to="/login" className="text-primary font-black hover:text-accent transition-colors">Entrar agora</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
