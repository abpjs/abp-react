import type { ReactNode } from 'react'

interface AccountLayoutProps {
  children: ReactNode
}

// Account layout - used for login, register, password reset, etc.
function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="layout account-layout">
      <header className="layout-header account-header">
        <div className="layout-indicator">Account Layout</div>
        <span>Login / Registration Area</span>
      </header>

      <main className="layout-content account-content">
        <div className="account-card">
          {children}
        </div>
      </main>

      <footer className="layout-footer account-footer">
        Account Layout Footer - Secure Area
      </footer>
    </div>
  )
}

// Important: displayName is used by DynamicLayout to match the layout type
AccountLayout.displayName = 'AccountLayout'

export default AccountLayout
