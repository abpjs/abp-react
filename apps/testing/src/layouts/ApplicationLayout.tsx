import type { ReactNode } from 'react'

interface ApplicationLayoutProps {
  children: ReactNode
}

// Application layout - used for authenticated pages (dashboard, admin, etc.)
function ApplicationLayout({ children }: ApplicationLayoutProps) {
  return (
    <div className="layout application-layout">
      <header className="layout-header application-header">
        <div className="layout-indicator">Application Layout</div>
        <span>Main Application Header - Logged In Area</span>
      </header>

      <div className="layout-body">
        <aside className="layout-sidebar">
          <div className="sidebar-title">Sidebar Menu</div>
          <ul className="sidebar-menu">
            <li>Dashboard</li>
            <li>Settings</li>
            <li>Reports</li>
          </ul>
        </aside>

        <main className="layout-content">
          {children}
        </main>
      </div>

      <footer className="layout-footer application-footer">
        Application Layout Footer - v1.0.0
      </footer>
    </div>
  )
}

// Important: displayName is used by DynamicLayout to match the layout type
ApplicationLayout.displayName = 'ApplicationLayout'

export default ApplicationLayout
