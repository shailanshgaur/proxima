import React, { useState, useEffect } from 'react';
import { LoginPage } from './pages/LoginPage';
import { AppShell } from './components/layout/AppShell';
import { ResidentProfile } from './types';
import { authService } from './lib/authService';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<ResidentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentProfile().then(p => {
      setProfile(p);
      setLoading(false);
    });

    const { data: { subscription } } = authService.onAuthChange(p => {
      setProfile(p);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-proxima-base flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-proxima-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return profile ? <AppShell profile={profile} /> : <LoginPage />;
};
