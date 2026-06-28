import React, { useState } from 'react';
import { ResidentProfile, Tab } from '../../types';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { OverviewTab } from '../tabs/OverviewTab';
import { BazarTab } from '../tabs/BazarTab';
import { CarpoolsTab } from '../tabs/CarpoolsTab';
import { ServicesTab } from '../tabs/ServicesTab';
import { ResidentIDTab } from '../tabs/ResidentIDTab';
import { AdminTab } from '../tabs/AdminTab';

interface AppShellProps {
  profile: ResidentProfile;
}

export const AppShell: React.FC<AppShellProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':  return <OverviewTab profile={profile} onNavigate={setActiveTab} />;
      case 'bazar':     return <BazarTab profile={profile} />;
      case 'carpools':  return <CarpoolsTab profile={profile} />;
      case 'services':  return <ServicesTab profile={profile} />;
      case 'profile':   return <ResidentIDTab profile={profile} />;
      case 'admin':     return <AdminTab profile={profile} />;
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
