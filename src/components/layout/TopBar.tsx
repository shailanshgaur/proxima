import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';
import { ResidentProfile } from '../../types';

interface TopBarProps {
  profile: ResidentProfile;
}

export const TopBar: React.FC<TopBarProps> = ({ profile }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-10 bg-proxima-card/80 backdrop-blur border-b border-proxima-border px-6 h-12 flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs text-proxima-muted">
        <div className="w-1.5 h-1.5 rounded-full bg-proxima-success" />
        <span>Resident Hub Connected</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-proxima-muted font-mono">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-proxima-active rounded-lg border border-proxima-border">
          <Wifi className="w-3 h-3 text-proxima-success" />
          <span className="text-proxima-success font-bold">STABLE</span>
        </div>
        <span>{time}</span>
        <span className="text-proxima-primary-light font-bold">Unit {profile.flat_number}</span>
      </div>
    </header>
  );
};
