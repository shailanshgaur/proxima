import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, Sparkles, KeyRound, AlertCircle } from 'lucide-react';
import { authService } from '../lib/authService';

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-proxima-base px-4 py-16 relative overflow-hidden font-sans">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-proxima-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-proxima-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-proxima-card/85 backdrop-blur-xl border border-proxima-border rounded-[28px] p-8 relative z-10 shadow-2xl space-y-8"
      >
        <div className="text-center space-y-3">
          <div className="inline-flex relative">
            <div className="absolute inset-0 bg-proxima-primary/30 rounded-2xl blur-lg" />
            <div className="relative inline-flex p-3 rounded-2xl bg-proxima-active border border-proxima-border text-proxima-primary">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="absolute -top-1 -right-1 bg-proxima-secondary text-white p-1 rounded-full border border-proxima-base">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-display font-extrabold text-proxima-text tracking-widest uppercase flex items-center justify-center gap-2">
              PROXIMA
              <span className="text-[10px] tracking-normal font-mono font-bold bg-proxima-primary/20 border border-proxima-primary/20 text-proxima-primary-light px-2 py-0.5 rounded-full">
                Portal
              </span>
            </h1>
            <p className="text-xs text-proxima-muted max-w-xs mx-auto leading-relaxed">
              Your digital society hub. Marketplace, carpools, verified services, and community management.
            </p>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-proxima-error/10 border border-proxima-error/20 rounded-2xl flex items-start gap-3"
          >
            <AlertCircle className="w-4 h-4 text-proxima-error shrink-0 mt-0.5" />
            <p className="text-xs text-proxima-error">{error}</p>
          </motion.div>
        )}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3.5 px-5 bg-white hover:bg-slate-50 text-slate-800 font-display text-sm font-semibold rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-[0.99] transition-all cursor-pointer border border-slate-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          {loading ? 'Signing in…' : 'Continue with Google Account'}
        </button>

        <div className="flex items-center justify-center gap-2 text-[10px] text-proxima-muted font-mono uppercase tracking-wider">
          <span className="w-8 h-px bg-proxima-border" />
          Verified Residents Only
          <span className="w-8 h-px bg-proxima-border" />
        </div>

        <p className="text-[11px] text-proxima-muted text-center leading-relaxed">
          By entering, you confirm you are a verified occupant of a listed Proxima residential society.
        </p>

        <div className="pt-4 border-t border-proxima-border text-center flex items-center justify-center gap-2 text-[9px] text-proxima-muted font-mono uppercase tracking-wider">
          <KeyRound className="w-3.5 h-3.5 text-proxima-primary" />
          Secure Supabase Session
        </div>
      </motion.div>
    </div>
  );
};
