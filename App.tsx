/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toaster } from 'sonner';

// Pages
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Trilhas } from './pages/Trilhas';
import { Aula } from './pages/Aula';
import { Perfil } from './pages/Perfil';
import { Assinatura } from './pages/Assinatura';
import { Especialistas } from './pages/Especialistas';
import { Login } from './pages/Login';
import { Checkout } from './pages/Checkout';
import { About } from './pages/About';
import { Pricing } from './pages/Pricing';
import { Signup } from './pages/Signup';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminTrilhas } from './pages/admin/AdminTrilhas';
import { AdminAulas } from './pages/admin/AdminAulas';
import { AdminUsuarios } from './pages/admin/AdminUsuarios';
import { AdminAssinaturas } from './pages/admin/AdminAssinaturas';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminSidebar } from './components/admin/AdminSidebar';

import { api } from './services/api';
import { UserProfile } from './types';

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen bg-accent">
    <AdminSidebar />
    <main className="pl-64 flex-1 min-h-screen p-12">
      {children}
    </main>
  </div>
);

const StudentLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen bg-accent">
    <Sidebar />
    <main className="pl-64 min-h-screen flex flex-col flex-1">
      <Header />
      <div className="flex-1">
        {children}
      </div>
    </main>
  </div>
);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        let p = await api.users.getProfile(user.uid);
        if (!p) {
          // Create profile if it doesn't exist
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            role: 'admin', // Default to admin for now as requested
            plan: 'free',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await api.users.saveProfile(newProfile);
          p = newProfile;
        }
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const ADMIN_EMAIL = "sousanaty09@gmail.com";
  const isAdmin = profile?.role === 'admin' || user?.email === ADMIN_EMAIL;

  return (
    <ErrorBoundary>
      <Toaster position="top-right" richColors />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Admin Area Routes */}
          {isAdmin && (
            <Route
              path="/admin/*"
              element={
                <AdminLayout>
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="trilhas" element={<AdminTrilhas />} />
                    <Route path="aulas" element={<AdminAulas />} />
                    <Route path="usuarios" element={<AdminUsuarios />} />
                    <Route path="assinaturas" element={<AdminAssinaturas />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="configuracoes" element={<AdminSettings />} />
                  </Routes>
                </AdminLayout>
              }
            />
          )}

          {/* Student Area Routes */}
          {user ? (
            <Route
              path="/*"
              element={
                <StudentLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="trilhas" element={<Trilhas />} />
                    <Route path="trilhas/:slug" element={<Trilhas />} />
                    <Route path="aula/:slug" element={<Aula />} />
                    <Route path="especialistas" element={<Especialistas />} />
                    <Route path="perfil" element={<Perfil />} />
                    <Route path="assinatura" element={<Assinatura />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </StudentLayout>
              }
            />
          ) : (
            <Route path="*" element={<Navigate to="/" replace />} />
          )}
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

