import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/src/firebase';
import { Button } from '@/src/components/Button';
import { Card } from '@/src/components/Card';
import { Sprout, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '@/src/services/api';
import { toast } from 'sonner';

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user profile exists
      const existingProfile = await api.users.getProfile(user.uid);
      
      if (!existingProfile) {
        // Create initial profile
        await api.users.saveProfile({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          role: 'student', // Default role
          plan: 'free',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      navigate('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, no need to show an error message
        console.log('Login cancelado pelo usuário');
      } else {
        console.error('Login error:', error);
        toast.error('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-light-green/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-xl relative z-10"
      >
        <Card className="p-16 text-center shadow-[0_30px_100px_rgba(20,69,36,0.08)] rounded-[4rem] border-primary/5 bg-white/90 backdrop-blur-2xl">
          <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-inner">
            <Sprout className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-5xl font-bold text-primary mb-6 italic tracking-tight">Bem-vindo à <br /> Eniesse Grow</h1>
          <p className="text-lg text-ink/60 mb-16 leading-relaxed font-medium">
            Acesse sua conta para continuar sua jornada no mercado de produtos naturais.
          </p>

          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 py-6 text-xl rounded-2xl shadow-xl shadow-primary/10"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn className="w-6 h-6" />
                Entrar com Google
              </>
            )}
          </Button>

          <div className="mt-12 pt-12 border-t border-primary/5">
            <p className="text-[10px] text-accent uppercase tracking-[0.3em] font-extrabold">
              Ambiente Seguro & Criptografado
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
