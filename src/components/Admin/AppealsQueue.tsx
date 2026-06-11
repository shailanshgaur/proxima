import React, { useState } from 'react';
import { Appeal, Vendor } from '../../types';
import { supabase } from '../../lib/supabaseClient';

interface AppealsQueueProps {
  appeals: Appeal[];
  onAppealResolved: () => void;
}

export const AppealsQueue: React.FC<AppealsQueueProps> = ({ appeals, onAppealResolved }) => {
  const [decisionReason, setDecisionReason] = useState<{ [key: string]: string }>({});
  const [processing, setProcessing] = useState<string | null>(null);

  const pendingAppeals = appeals.filter((a) => a.status === 'pending');
  const isOverdue = (deadline: string) => new Date(deadline) < new Date();

  const handleApprove = async (appealId: string, vendorId: string) => {
    setProcessing(appealId);
    try {
      const session = await supabase.auth.getSession();
      const { data: user } = await supabase
        .from('users')
        .select('is_admin')
        .eq('auth_id', session.data.session?.user?.id)
        .single();

      if (!user?.is_admin) {
        alert('Unauthorized');
        return;
      }

      const reason = decisionReason[appealId] || 'Appeal approved';

      await supabase
        .from('appeals')
        .update({
          status: 'approved',
          decision_reason: reason,
          decided_at: new Date().toISOString(),
        })
        .eq('id', appealId);

      await supabase.from('vendors').update({ is_archived: false }).eq('id', vendorId);

      onAppealResolved();
      setDecisionReason({ ...decisionReason, [appealId]: '' });
    } catch (err) {
      console.error('Failed to approve appeal:', err);
      alert('Failed to approve appeal');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (appealId: string) => {
    setProcessing(appealId);
    try {
      const reason = decisionReason[appealId] || 'Appeal rejected';

      await supabase
        .from('appeals')
        .update({
          status: 'rejected',
          decision_reason: reason,
          decided_at: new Date().toISOString(),
        })
        .eq('id', appealId);

      onAppealResolved();
      setDecisionReason({ ...decisionReason, [appealId]: '' });
    } catch (err) {
      console.error('Failed to reject appeal:', err);
      alert('Failed to reject appeal');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div>
      <h2>Appeals Queue ({pendingAppeals.length} pending)</h2>

      {pendingAppeals.length === 0 ? (
        <p>No pending appeals.</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {pendingAppeals.map((appeal) => (
            <div
              key={appeal.id}
              style={{
                border: isOverdue(appeal.deadline_at) ? '2px solid #dc3545' : '1px solid #ddd',
                padding: '15px',
                borderRadius: '4px',
                background: isOverdue(appeal.deadline_at) ? '#ffe0e0' : 'white',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>Appeal: {appeal.vendor_id}</h3>
                <span style={{ fontSize: '12px', color: isOverdue(appeal.deadline_at) ? '#dc3545' : '#666' }}>
                  Deadline: {new Date(appeal.deadline_at).toLocaleDateString()} {isOverdue(appeal.deadline_at) ? '(OVERDUE)' : ''}
                </span>
              </div>

              <p>
                <strong>Reason:</strong>
              </p>
              <p style={{ background: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>{appeal.reason}</p>

              {appeal.evidence_url && (
                <p>
                  <strong>Evidence:</strong> <a href={appeal.evidence_url} target="_blank" rel="noreferrer">View</a>
                </p>
              )}

              <div style={{ marginTop: '15px' }}>
                <label>Decision Reason (optional):</label>
                <textarea
                  value={decisionReason[appeal.id] || ''}
                  onChange={(e) => setDecisionReason({ ...decisionReason, [appeal.id]: e.target.value })}
                  placeholder="Explain your decision..."
                  maxLength={500}
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '5px',
                    minHeight: '80px',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleApprove(appeal.id, appeal.vendor_id)}
                  disabled={processing === appeal.id}
                  style={{
                    padding: '10px 20px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: processing === appeal.id ? 'not-allowed' : 'pointer',
                  }}
                >
                  {processing === appeal.id ? 'Processing...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleReject(appeal.id)}
                  disabled={processing === appeal.id}
                  style={{
                    padding: '10px 20px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: processing === appeal.id ? 'not-allowed' : 'pointer',
                  }}
                >
                  {processing === appeal.id ? 'Processing...' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {appeals.filter((a) => a.status !== 'pending').length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3>Resolved Appeals</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: '10px' }}>Vendor</th>
                <th style={{ border: '1px solid #ddd', padding: '10px' }}>Status</th>
                <th style={{ border: '1px solid #ddd', padding: '10px' }}>Decided</th>
              </tr>
            </thead>
            <tbody>
              {appeals
                .filter((a) => a.status !== 'pending')
                .map((a) => (
                  <tr key={a.id}>
                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{a.vendor_id}</td>
                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                      <span style={{ color: a.status === 'approved' ? 'green' : 'red' }}>{a.status}</span>
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                      {a.decided_at ? new Date(a.decided_at).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
