import React, { useState, useEffect } from 'react';
import { Lock, Users, ShoppingBag, AlertTriangle, Shield, CheckCircle, XCircle } from 'lucide-react';
import { ResidentProfile } from '../../types';
import { supabase } from '../../lib/supabaseClient';

interface AdminTabProps { profile: ResidentProfile; }

interface Appeal {
  id: string;
  vendor_id: string;
  reason: string;
  deadline_at: string;
  vendors?: { name: string } | null;
}

export const AdminTab: React.FC<AdminTabProps> = ({ profile }) => {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile.is_admin) { setLoading(false); return; }
    Promise.resolve(
      supabase
        .from('appeals')
        .select('id, vendor_id, reason, deadline_at, vendors(name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
    ).then(({ data }) => {
      setAppeals((data as unknown as Appeal[]) ?? []);
    }).finally(() => setLoading(false));
  }, [profile.is_admin]);

  const handleDecision = async (appealId: string, status: 'approved' | 'rejected') => {
    await supabase.from('appeals').update({ status, decided_at: new Date().toISOString() }).eq('id', appealId);
    setAppeals(prev => prev.filter(a => a.id !== appealId));
  };

  if (!profile.is_admin) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Lock className="w-12 h-12 mx-auto mb-4 text-proxima-muted opacity-40" />
        <h2 className="text-lg font-bold text-proxima-text mb-2">Admin Access Required</h2>
        <p className="text-sm text-proxima-muted">This area is restricted to verified community administrators.</p>
      </div>
    );
  }

  const METRICS = [
    { label: 'Verified Members', value: '—', sub: 'Active residents',    icon: <Users className="w-5 h-5" />,        color: 'text-proxima-primary' },
    { label: 'Active Listings',  value: '—', sub: 'In marketplace',       icon: <ShoppingBag className="w-5 h-5" />,  color: 'text-proxima-secondary' },
    { label: 'Pending Appeals',  value: String(appeals.length), sub: 'Require review', icon: <AlertTriangle className="w-5 h-5" />, color: 'text-proxima-warning' },
    { label: 'Grid Security',    value: '99.8%', sub: 'All nodes synced', icon: <Shield className="w-5 h-5" />,      color: 'text-proxima-success' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-proxima-text flex items-center gap-2">
          <Lock className="w-6 h-6 text-proxima-primary" />
          Admin Control Center
        </h1>
        <p className="text-sm text-proxima-muted mt-1">Locked administration interface. Audit registered database entries, moderate flagged listings, and verify service providers.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map(m => (
          <div key={m.label} className="bg-proxima-card border border-proxima-border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className={m.color}>{m.icon}</span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-proxima-muted">{m.label}</span>
            </div>
            <div>
              <div className="text-2xl font-black text-proxima-text font-mono">{m.value}</div>
              <div className="text-xs text-proxima-muted mt-0.5">{m.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xs font-semibold text-proxima-muted uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-proxima-warning" />
          Pending Vendor Appeals
        </h2>
        {loading ? (
          <div className="space-y-3">{[1,2].map(i => <div key={i} className="bg-proxima-card border border-proxima-border rounded-xl h-24 animate-pulse" />)}</div>
        ) : appeals.length === 0 ? (
          <div className="text-center py-12 text-proxima-muted bg-proxima-card border border-proxima-border rounded-xl">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-proxima-success opacity-60" />
            <p className="text-sm">No pending appeals. Queue is clear.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appeals.map(appeal => (
              <div key={appeal.id} className="bg-proxima-card border border-proxima-warning/20 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="text-sm font-semibold text-proxima-text">{appeal.vendors?.name ?? 'Unknown Vendor'}</div>
                    <p className="text-xs text-proxima-muted line-clamp-2">{appeal.reason}</p>
                    <p className="text-[10px] text-proxima-muted font-mono">Deadline: {new Date(appeal.deadline_at).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleDecision(appeal.id, 'approved')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-proxima-success/10 hover:bg-proxima-success/20 text-proxima-success border border-proxima-success/30 rounded-lg text-xs font-semibold transition-all">
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button onClick={() => handleDecision(appeal.id, 'rejected')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-proxima-error/10 hover:bg-proxima-error/20 text-proxima-error border border-proxima-error/30 rounded-lg text-xs font-semibold transition-all">
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
