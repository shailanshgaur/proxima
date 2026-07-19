import React, { useState, useEffect } from 'react';
import { ResidentProfile } from '../../types';

interface TopBarProps {
  profile: ResidentProfile;
}

export const TopBar: React.FC<TopBarProps> = ({ profile }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      );
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-10 bg-proxima-card border-b border-proxima-border px-4 md:px-6 flex items-center justify-between" style={{ height: '48px' }}>
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full bg-proxima-success shrink-0"
          aria-hidden="true"
        />
        <span className="text-xs text-proxima-muted">{profile.is_demo ? 'Preview' : 'Connected'}</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-proxima-muted">
        {time && <span>{time}</span>}
        <span className="font-semibold text-proxima-text">Unit {profile.flat_number}</span>
      </div>
    </header>
  );
};
