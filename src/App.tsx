import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { AppShell } from './components/layout/AppShell';
import { ResidentProfile } from './types';
import { authService } from './lib/authService';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<ResidentProfile | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([authService.getCurrentAuthUser(), authService.getCurrentProfile()]).then(([user, p]) => {
      setAuthUser(user);
      setProfile(p);
      setLoading(false);
    });

    const { data: { subscription } } = authService.onAuthChange(p => {
      setProfile(p);
      authService.getCurrentAuthUser().then(setAuthUser);
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

  if (profile) return <AppShell profile={profile} />;
  if (authUser) return <OnboardingPage user={authUser} onComplete={setProfile} />;
  return <LoginPage />;
};
