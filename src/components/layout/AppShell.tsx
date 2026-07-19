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
  onSignOut: () => void;
}

/* Mobile bottom nav — text labels only, no icons */
const BOTTOM_NAV: { id: Tab; label: string }[] = [
  { id: 'overview',  label: 'Home' },
  { id: 'bazar',     label: 'Bazar' },
  { id: 'carpools',  label: 'Carpools' },
  { id: 'services',  label: 'Services' },
  { id: 'profile',   label: 'Profile' },
];

export const AppShell: React.FC<AppShellProps> = ({ profile, onSignOut }) => {
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
      {/* Sidebar — desktop only */}
      <div className="hidden md:flex">
        <Sidebar profile={profile} activeTab={activeTab} onTabChange={setActiveTab} onSignOut={onSignOut} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar profile={profile} />

        <main
          className="flex-1 overflow-y-auto p-4 md:p-6"
          /* Bottom padding on mobile accounts for the fixed bottom nav + iPhone safe area */
          style={{ paddingBottom: 'calc(72px + env(safe-area-inset-bottom, 0px))' }}
        >
          {renderTab()}
        </main>

        {/* Bottom nav — mobile only */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 bg-proxima-card border-t border-proxima-border flex"
          style={{
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            boxShadow: '0 -1px 0 rgba(28,25,23,0.08)',
          }}
        >
          {BOTTOM_NAV.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex-1 flex flex-col items-center justify-center transition-colors cursor-pointer"
                style={{ minHeight: '56px' }}
              >
                <span
                  className={`text-xs transition-colors ${
                    isActive
                      ? 'font-semibold text-proxima-primary'
                      : 'font-medium text-proxima-muted'
                  }`}
                >
                  {item.label}
                </span>
                {/* Active indicator dot */}
                <span
                  className={`mt-1 w-1 h-1 rounded-full transition-all ${
                    isActive ? 'bg-proxima-primary' : 'bg-transparent'
                  }`}
                />
              </button>
            );
          })}
          {/* Admin tab on mobile — only for admins, always last */}
          {profile.is_admin && (
            <button
              onClick={() => setActiveTab('admin')}
              className="flex-1 flex flex-col items-center justify-center transition-colors cursor-pointer"
              style={{ minHeight: '56px' }}
            >
              <span
                className={`text-xs transition-colors ${
                  activeTab === 'admin'
                    ? 'font-semibold text-proxima-primary'
                    : 'font-medium text-proxima-muted'
                }`}
              >
                Admin
              </span>
              <span
                className={`mt-1 w-1 h-1 rounded-full transition-all ${
                  activeTab === 'admin' ? 'bg-proxima-primary' : 'bg-transparent'
                }`}
              />
            </button>
          )}
        </nav>
      </div>
    </div>
  );
};
