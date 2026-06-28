import React, { useState } from 'react';
import { ResidentProfile, Tab } from '../../types';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
  profile: ResidentProfile;
}

// Placeholder tab components — will be replaced by actual tab files
const PlaceholderTab: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex items-center justify-center h-64 text-proxima-muted text-sm">
    {name} — coming soon
  </div>
);

export const AppShell: React.FC<AppShellProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':  return <PlaceholderTab name="Hub Overview" />;
      case 'bazar':     return <PlaceholderTab name="Society Bazar" />;
      case 'carpools':  return <PlaceholderTab name="Society Carpools" />;
      case 'services':  return <PlaceholderTab name="Verified Directory" />;
      case 'profile':   return <PlaceholderTab name="My Resident ID" />;
      case 'admin':     return <PlaceholderTab name="Admin Desk" />;
    }
  };

  return (
    <div className="flex h-screen bg-proxima-base overflow-hidden">
      <Sidebar profile={profile} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar profile={profile} />
        <main className="flex-1 overflow-y-auto p-6">
          {renderTab()}
        </main>
      </div>
    </div>
  );
};
