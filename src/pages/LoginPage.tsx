import React, { useState } from 'react';
import { motion } from 'motion/react';
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
    <div className="min-h-screen w-full flex items-center justify-center bg-proxima-base px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        {/* Logo lockup */}
        <div className="text-center mb-8">
          <p
            className="text-3xl font-bold text-proxima-primary mb-3"
            style={{ letterSpacing: '0.14em' }}
          >
            PROXIMA
          </p>
          <h1 className="text-lg font-semibold text-proxima-text mb-1">
            Welcome to your society hub
          </h1>
          <p className="text-sm text-proxima-muted leading-relaxed max-w-xs mx-auto">
            Marketplace, services, and community management for verified residents.
          </p>
        </div>

        {/* Card */}
        <div
          className="bg-proxima-card border border-proxima-border rounded-2xl p-6 space-y-5"
          style={{ boxShadow: '0 1px 4px rgba(28,25,23,0.08)' }}
        >
          {error && (
            <div
              className="p-3 rounded-xl text-sm text-proxima-error"
              style={{
                background: 'rgba(220,38,38,0.06)',
                border: '1px solid rgba(220,38,38,0.20)',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-proxima-card border border-proxima-border rounded-xl flex items-center justify-center gap-3 text-sm font-semibold text-proxima-text hover:bg-proxima-active transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            style={{
              minHeight: '52px',
              boxShadow: '0 1px 3px rgba(28,25,23,0.08)',
            }}
          >
            {/* Google logo inline SVG — brand identity, not an icon library */}
            <svg
              className="w-5 h-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            {loading ? 'Signing in…' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-3">
            <span className="flex-1 h-px bg-proxima-border" />
            <span className="text-xs text-proxima-muted">verified residents only</span>
            <span className="flex-1 h-px bg-proxima-border" />
          </div>

          <p className="text-xs text-proxima-muted text-center leading-relaxed">
            By signing in, you confirm you are a verified occupant of a Proxima residential society.
          </p>
        </div>

        <p className="text-xs text-proxima-subtle text-center mt-6">
          Secured by Supabase — your data is private
        </p>
      </motion.div>
    </div>
  );
};
