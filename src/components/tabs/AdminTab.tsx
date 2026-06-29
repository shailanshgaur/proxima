import React, { useState, useEffect } from 'react';
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
        <h2 className="text-lg font-bold text-proxima-text mb-2">Admin Access Required</h2>
        <p className="text-sm text-proxima-muted">Restricted to verified community administrators.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Title Section */}
      <div className="space-y-1">
        <h1 className="text-2xl font-display font-black text-white tracking-tight">
          Admin Control Center
        </h1>
        <p className="text-sm text-proxima-muted">
          Locked administration interface. Audit registered database entries, moderate flagged listings, and verify service providers.
        </p>
      </div>

      {/* Metric Cards — 2×2 on mobile, 4 on lg */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Verified Members */}
        <div className="bg-proxima-card border border-proxima-border rounded-2xl p-4 space-y-3">
          <span className="text-[9px] font-mono uppercase tracking-wider text-proxima-muted block">
            Verified Members
          </span>
          <div>
            <div className="text-2xl font-display font-extrabold text-white font-mono">712</div>
            <div className="text-xs text-proxima-muted mt-0.5">+ enrolled</div>
          </div>
        </div>

        {/* Active Listings */}
        <div className="bg-proxima-card border border-proxima-border rounded-2xl p-4 space-y-3">
          <span className="text-[9px] font-mono uppercase tracking-wider text-proxima-muted block">
            Active Listings
          </span>
          <div>
            <div className="text-2xl font-display font-extrabold text-white font-mono">—</div>
            <div className="text-xs text-proxima-muted mt-0.5">In marketplace</div>
          </div>
        </div>

        {/* Pending Appeals */}
        <div className="bg-proxima-card border border-proxima-border rounded-2xl p-4 space-y-3">
          <span className="text-[9px] font-mono uppercase tracking-wider text-proxima-muted block">
            Pending Appeals
          </span>
          <div>
            <div className="text-2xl font-display font-extrabold text-white font-mono">
              {appeals.length} Alerts
            </div>
            <div className="text-xs text-red-400 mt-0.5">Requires supervisor check</div>
          </div>
        </div>

        {/* Grid Security */}
        <div className="bg-proxima-card border border-proxima-border rounded-2xl p-4 space-y-3">
          <span className="text-[9px] font-mono uppercase tracking-wider text-proxima-muted block">
            Grid Security
          </span>
          <div>
            <div className="text-2xl font-display font-extrabold text-white font-mono">99.8%</div>
            <div className="text-xs text-proxima-success mt-0.5">All nodes synced</div>
          </div>
        </div>

      </div>

      {/* Pending Resident Flags */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-proxima-muted uppercase tracking-wider font-mono">
          Pending Resident Flags
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="bg-proxima-base border border-proxima-border rounded-xl h-28 animate-pulse" />
            ))}
          </div>
        ) : appeals.length === 0 ? (
          <div className="bg-proxima-active text-proxima-primary-light rounded-xl border border-proxima-primary/30 px-5 py-8 text-center">
            <p className="text-sm font-medium">All queued complaints have been fully handled.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appeals.map(appeal => (
              <div
                key={appeal.id}
                className="bg-proxima-base rounded-xl border border-proxima-border p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                  {/* Left: metadata */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-proxima-primary/15 text-proxima-primary-light border border-proxima-primary/20 uppercase tracking-wide">
                        Vendor Appeal
                      </span>
                    </div>
                    <p className="text-xs text-proxima-muted">
                      Reported by{' '}
                      <span className="text-proxima-text font-medium">
                        {appeal.vendors?.name ?? 'Unknown Vendor'}
                      </span>
                    </p>
                    <p className="text-sm text-proxima-text leading-snug line-clamp-3">
                      {appeal.reason}
                    </p>
                    <p className="text-[10px] text-proxima-muted font-mono">
                      Deadline: {new Date(appeal.deadline_at).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Right: action buttons */}
                  <div className="flex gap-2 shrink-0 self-end sm:self-start">
                    <button
                      onClick={() => handleDecision(appeal.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-proxima-success/15 text-proxima-success border border-proxima-success/20 hover:bg-proxima-success/25"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleDecision(appeal.id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-red-950/40 text-red-400 border border-red-900/30 hover:bg-red-950/60"
                    >
                      ✕ Reject
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
