/**
 * Main App Component
 * ABP React Framework Test Application
 */
import { useEffect, useState } from 'react'
import { Routes, Route, Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAbp, useAuth, useConfig, AuthGuard } from '@abpjs/core'
import { LayoutApplication, LayoutAccount, LayoutEmpty } from '@abpjs/theme-basic'
import { LoginPage as AccountLoginPage, RegisterPage as AccountRegisterPage } from '@abpjs/account'
import { SettingLayout } from '@abpjs/setting-management'
import {
  TestCorePage,
  TestThemeSharedPage,
  TestThemeBasicPage,
  TestAccountPage,
  TestAccountProPage,
  TestPermissionManagementPage,
  TestTenantManagementPage,
  TestIdentityPage,
  TestIdentityProPage,
  TestFeatureManagementPage,
  TestSettingManagementPage,
  TestLanguageManagementPage,
  TestSaasPage,
  TestAuditLoggingPage,
} from './pages'
import './App.css'

// OAuth callback handler
function AuthCallback() {
  const { handleCallback } = useAuth()
  const { applicationConfigurationService, store } = useAbp()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    handleCallback()
      .then(async (user) => {
        if (user) {
          try {
            const appConfig = await applicationConfigurationService.getConfiguration()
            store.dispatch({ type: 'config/setApplicationConfiguration', payload: appConfig })
          } catch (err) {
            console.error('Failed to fetch app config after login:', err)
          }
          navigate('/', { replace: true })
        } else {
          setError('Failed to complete login')
        }
      })
      .catch((err) => {
        console.error('Auth callback error:', err)
        setError(err.message || 'Authentication failed')
      })
  }, [handleCallback, navigate, applicationConfigurationService, store])

  if (error) {
    return (
      <div className="test-card">
        <h3>Authentication Error</h3>
        <p style={{ color: '#f66' }}>{error}</p>
        <Link to="/">Go back home</Link>
      </div>
    )
  }

  return (
    <div className="test-card">
      <h3>Processing login...</h3>
      <p>Please wait while we complete your authentication.</p>
    </div>
  )
}

// Home page with package test links
function Home() {
  const [searchParams] = useSearchParams()
  const hasAuthCode = searchParams.has('code')

  if (hasAuthCode) {
    return <AuthCallback />
  }

  return (
    <div>
      <h1>ABP React Framework v0.8.0</h1>
      <p>Test application for @abpjs packages.</p>

      <div className="test-section">
        <h2>Package Test Pages</h2>
        <p>Each package has a dedicated test page:</p>

        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div className="test-card">
            <h3>@abpjs/core</h3>
            <p>Hooks, services, state management, authentication, permissions</p>
            <Link to="/test/core" style={{ color: '#646cff' }}>View Tests &rarr;</Link>
          </div>

          <div className="test-card">
            <h3>@abpjs/theme-shared</h3>
            <p>Toasts, confirmation dialogs, modals, error handling</p>
            <Link to="/test/theme-shared" style={{ color: '#646cff' }}>View Tests &rarr;</Link>
          </div>

          <div className="test-card">
            <h3>@abpjs/theme-basic</h3>
            <p>Layouts, navigation, layout service</p>
            <Link to="/test/theme-basic" style={{ color: '#646cff' }}>View Tests &rarr;</Link>
          </div>

          <div className="test-card">
            <h3>@abpjs/account</h3>
            <p>Login, register, tenant switching</p>
            <Link to="/test/account" style={{ color: '#646cff' }}>View Tests &rarr;</Link>
          </div>

          <div className="test-card">
            <h3>@abpjs/account-pro</h3>
            <p>Password reset, profile management, pro features</p>
            <Link to="/test/account-pro" style={{ color: '#646cff' }}>View Tests &rarr;</Link>
          </div>

          <div className="test-card">
            <h3>@abpjs/permission-management</h3>
            <p>Permission modal, role/user permissions</p>
            <Link to="/test/permission-management" style={{ color: '#646cff' }}>View Tests &rarr;</Link>
          </div>

          <div className="test-card">
            <h3>@abpjs/tenant-management</h3>
            <p>Tenant management, connection strings</p>
            <Link to="/test/tenant-management" style={{ color: '#646cff' }}>View Tests &rarr;</Link>
          </div>

          <div className="test-card">
            <h3>@abpjs/identity</h3>
            <p>User and role management, identity hooks</p>
            <Link to="/test/identity" style={{ color: '#646cff' }}>View Tests &rarr;</Link>
          </div>

          <div className="test-card">
            <h3>@abpjs/identity-pro</h3>
            <p>Claim types, user/role claims, pro features</p>
            <Link to="/test/identity-pro" style={{ color: '#646cff' }}>View Tests &rarr;</Link>
          </div>

          <div className="test-card">
            <h3>@abpjs/feature-management</h3>
            <p>Feature management modal, tenant/edition features</p>
            <Link to="/test/feature-management" style={{ color: '#646cff' }}>View Tests &rarr;</Link>
          </div>

          <div className="test-card">
            <h3>@abpjs/setting-management</h3>
            <p>Setting layout, tabs management, settings page</p>
            <Link to="/test/setting-management" style={{ color: '#646cff' }}>View Tests &rarr;</Link>
          </div>

          <div className="test-card">
            <h3>@abpjs/language-management</h3>
            <p>Language management, localization texts, cultures</p>
            <Link to="/test/language-management" style={{ color: '#646cff' }}>View Tests &rarr;</Link>
          </div>

          <div className="test-card">
            <h3>@abpjs/saas</h3>
            <p>Tenant management, edition management, SaaS features</p>
            <Link to="/test/saas" style={{ color: '#646cff' }}>View Tests &rarr;</Link>
          </div>

          <div className="test-card">
            <h3>@abpjs/audit-logging</h3>
            <p>Audit logs, HTTP methods/status tracking, statistics</p>
            <Link to="/test/audit-logging" style={{ color: '#646cff' }}>View Tests &rarr;</Link>
          </div>
        </div>
      </div>

      <div className="test-section">
        <h2>Quick Links</h2>
        <div className="test-card">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/account/login" style={{ color: '#646cff' }}>Login Page</Link></li>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/account/register" style={{ color: '#646cff' }}>Register Page</Link></li>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/dashboard" style={{ color: '#646cff' }}>Dashboard (Protected)</Link></li>
            <li style={{ marginBottom: '0.5rem' }}><Link to="/about" style={{ color: '#646cff' }}>About</Link></li>
            <li><Link to="/print" style={{ color: '#646cff' }}>Print View (Empty Layout)</Link></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function About() {
  return (
    <div>
      <h1>About</h1>
      <p>This is a public page - no authentication required.</p>
      <p>This test application demonstrates all @abpjs packages working together.</p>
    </div>
  )
}

function Dashboard() {
  const { user } = useAuth()
  const config = useConfig()

  return (
    <div>
      <h1>Dashboard (Protected)</h1>
      <p style={{ color: '#6f6' }}>You are authenticated and can view this page.</p>

      <div className="test-card">
        <h3>User Info from OIDC</h3>
        <pre>{JSON.stringify(user?.profile, null, 2)}</pre>
      </div>

      <div className="test-card">
        <h3>Current User from ABP Config</h3>
        <pre>{JSON.stringify(config.currentUser, null, 2)}</pre>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      {/* Main app pages with LayoutApplication */}
      <Route element={<LayoutApplication />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard fallback={<div className="test-card">Loading...</div>}>
              <Dashboard />
            </AuthGuard>
          }
        />
        {/* Package test pages */}
        <Route path="/test/core" element={<TestCorePage />} />
        <Route path="/test/theme-shared" element={<TestThemeSharedPage />} />
        <Route path="/test/theme-basic" element={<TestThemeBasicPage />} />
        <Route path="/test/account" element={<TestAccountPage />} />
        <Route path="/test/account-pro" element={<TestAccountProPage />} />
        <Route path="/test/permission-management" element={<TestPermissionManagementPage />} />
        <Route path="/test/tenant-management" element={<TestTenantManagementPage />} />
        <Route path="/test/identity" element={<TestIdentityPage />} />
        <Route path="/test/identity-pro" element={<TestIdentityProPage />} />
        <Route path="/test/feature-management" element={<TestFeatureManagementPage />} />
        <Route path="/test/setting-management" element={<TestSettingManagementPage />} />
        <Route path="/test/language-management" element={<TestLanguageManagementPage />} />
        <Route path="/test/saas" element={<TestSaasPage />} />
        <Route path="/test/audit-logging" element={<TestAuditLoggingPage />} />
        {/* Setting management page from @abpjs/setting-management */}
        <Route path="/setting-management" element={<SettingLayout />} />
      </Route>

      {/* Auth pages with LayoutAccount - using @abpjs/account */}
      <Route element={<LayoutAccount />}>
        <Route path="/account/login" element={<AccountLoginPage />} />
        <Route path="/account/register" element={<AccountRegisterPage />} />
      </Route>

      {/* Minimal pages with LayoutEmpty */}
      <Route element={<LayoutEmpty />}>
        <Route path="/print" element={<div style={{ padding: '2rem' }}><h1>Print View</h1><p>This page uses LayoutEmpty - no navbar, just content.</p></div>} />
      </Route>
    </Routes>
  )
}

export default App
