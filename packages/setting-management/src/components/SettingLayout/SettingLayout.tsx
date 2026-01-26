/**
 * Setting Layout Component
 * Translated from @abp/ng.setting-management v0.9.0
 */

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { SettingTab } from '@abpjs/theme-shared';
import { useSettingManagement } from '../../hooks';

export interface SettingLayoutProps {
  /** Optional children to render in the content area */
  children?: React.ReactNode;
  /** Optional callback when tab is selected */
  onTabSelect?: (tab: SettingTab) => void;
  /** Optional CSS class for the container */
  className?: string;
}

/**
 * Layout component for the settings management page.
 * Displays a list of setting tabs on the left and content on the right.
 *
 * @example
 * ```tsx
 * function SettingsPage() {
 *   const { addSettings } = useSettingManagement();
 *
 *   useEffect(() => {
 *     addSettings([
 *       { name: 'Account', order: 1, url: '/settings/account' },
 *       { name: 'Tenant', order: 2, url: '/settings/tenant' },
 *     ]);
 *   }, []);
 *
 *   return (
 *     <SettingLayout>
 *       <Outlet />
 *     </SettingLayout>
 *   );
 * }
 * ```
 */
export function SettingLayout({
  children,
  onTabSelect,
  className = '',
}: SettingLayoutProps): React.ReactElement {
  const { settings, selected, setSelected } = useSettingManagement();
  const location = useLocation();
  const navigate = useNavigate();

  // Sync selected tab with current URL on mount and URL change
  useEffect(() => {
    if (settings.length > 0) {
      const matchingTab = settings.find((tab) => tab.url && location.pathname.startsWith(tab.url));
      if (matchingTab) {
        setSelected(matchingTab);
      } else if (!selected && settings.length > 0) {
        // Auto-select first tab if nothing is selected
        setSelected(settings[0]);
      }
    }
  }, [location.pathname, settings, selected, setSelected]);

  const handleTabClick = (tab: SettingTab) => {
    setSelected(tab);
    onTabSelect?.(tab);

    if (tab.url) {
      navigate(tab.url);
    }
  };

  return (
    <div className={`setting-layout ${className}`} style={styles.container}>
      <div className="setting-layout-sidebar" style={styles.sidebar}>
        <nav className="setting-tabs" style={styles.nav}>
          {settings.map((tab) => (
            <button
              key={tab.name}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={`setting-tab ${selected?.name === tab.name ? 'active' : ''}`}
              style={{
                ...styles.tabButton,
                ...(selected?.name === tab.name ? styles.tabButtonActive : {}),
              }}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      <div className="setting-layout-content" style={styles.content}>
        {children}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    minHeight: '400px',
    gap: '24px',
  },
  sidebar: {
    width: '240px',
    flexShrink: 0,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  tabButton: {
    display: 'block',
    width: '100%',
    padding: '12px 16px',
    textAlign: 'left',
    border: 'none',
    borderRadius: '6px',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    color: 'inherit',
    transition: 'background-color 0.2s',
  },
  tabButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
    fontWeight: 500,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
};

export default SettingLayout;
