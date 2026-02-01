/**
 * Test page for @abpjs/account package
 * Tests: LoginForm, RegisterForm, TenantBox, hooks
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LoginForm,
  RegisterForm,
  TenantBox,
  LoginPage,
  RegisterPage,
  // v1.1.0 additions
  AuthWrapper,
  ChangePasswordForm,
  PersonalSettingsForm,
  ManageProfile,
  useAccountOptions,
  usePasswordFlow,
  useAccountService,
  // ACCOUNT_ROUTES removed in v2.0.0 - use AccountProvider instead
  ACCOUNT_PATHS,
  DEFAULT_REDIRECT_URL,
  // v2.0.0 additions
  useSelfRegistrationEnabled,
} from '@abpjs/account'
import type { Account } from '@abpjs/account'
import { useAuth, useConfig } from '@abpjs/core'
import { useToaster } from '@abpjs/theme-shared'

function TestLoginForm() {
  const toaster = useToaster()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="test-section">
      <h2>LoginForm Component</h2>

      <div className="test-card">
        <h3>Embedded Login Form</h3>
        <p>The LoginForm can be embedded directly in any page:</p>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Form' : 'Show Login Form'}
        </button>

        {showForm && (
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #333', borderRadius: '8px' }}>
            <LoginForm
              showTenantBox={true}
              showRegisterLink={true}
              registerUrl="/account/register"
              onLoginSuccess={() => {
                toaster.success('Login successful!', 'Success')
              }}
              onLoginError={(error) => {
                toaster.error(error, 'Login Failed')
              }}
            />
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>LoginForm Props</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Prop</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Default</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>showTenantBox</td><td>boolean</td><td>true</td></tr>
            <tr><td style={{ padding: '8px' }}>showRegisterLink</td><td>boolean</td><td>true</td></tr>
            <tr><td style={{ padding: '8px' }}>registerUrl</td><td>string</td><td>/account/register</td></tr>
            <tr><td style={{ padding: '8px' }}>onLoginSuccess</td><td>() =&gt; void</td><td>-</td></tr>
            <tr><td style={{ padding: '8px' }}>onLoginError</td><td>(error: string) =&gt; void</td><td>-</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestRegisterForm() {
  const toaster = useToaster()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="test-section">
      <h2>RegisterForm Component</h2>

      <div className="test-card">
        <h3>Embedded Register Form</h3>
        <p>The RegisterForm can be embedded directly in any page:</p>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Form' : 'Show Register Form'}
        </button>

        {showForm && (
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #333', borderRadius: '8px' }}>
            <RegisterForm
              showTenantBox={true}
              showLoginLink={true}
              loginUrl="/account/login"
              onRegisterSuccess={() => {
                toaster.success('Registration successful!', 'Success')
              }}
              onRegisterError={(error) => {
                toaster.error(error, 'Registration Failed')
              }}
            />
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>RegisterForm Props</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Prop</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Default</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>showTenantBox</td><td>boolean</td><td>true</td></tr>
            <tr><td style={{ padding: '8px' }}>showLoginLink</td><td>boolean</td><td>true</td></tr>
            <tr><td style={{ padding: '8px' }}>loginUrl</td><td>string</td><td>/account/login</td></tr>
            <tr><td style={{ padding: '8px' }}>onRegisterSuccess</td><td>() =&gt; void</td><td>-</td></tr>
            <tr><td style={{ padding: '8px' }}>onRegisterError</td><td>(error: string) =&gt; void</td><td>-</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestTenantBox() {
  const [showTenantBox, setShowTenantBox] = useState(false)
  const config = useConfig()

  return (
    <div className="test-section">
      <h2>TenantBox Component</h2>

      <div className="test-card">
        <h3>Standalone TenantBox</h3>
        <p>TenantBox allows users to switch between tenants in a multi-tenant application.</p>
        <button onClick={() => setShowTenantBox(!showTenantBox)}>
          {showTenantBox ? 'Hide TenantBox' : 'Show TenantBox'}
        </button>

        {showTenantBox && (
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #333', borderRadius: '8px' }}>
            <TenantBox />
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>Current Tenant</h3>
        <p>Tenant ID: {config.currentUser?.tenantId || 'None (Host)'}</p>
        <p>User ID: {config.currentUser?.id || 'N/A'}</p>
        <p>Is Authenticated: {config.currentUser?.isAuthenticated ? 'Yes' : 'No'}</p>
      </div>
    </div>
  )
}

function TestPasswordFlow() {
  const { login, isLoading, error, clearError } = usePasswordFlow()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)

  const handleLogin = async () => {
    const res = await login(username, password)
    setResult(res)
  }

  return (
    <div className="test-section">
      <h2>usePasswordFlow Hook</h2>

      <div className="test-card">
        <h3>Password Flow Login</h3>
        <p>Direct password-based login using OAuth2 Resource Owner Password flow:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '300px' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: '8px' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '8px' }}
          />
          <button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login with Password Flow'}
          </button>
          {error && (
            <div style={{ color: 'red' }}>
              Error: {error}
              <button onClick={clearError} style={{ marginLeft: '0.5rem' }}>Clear</button>
            </div>
          )}
          {result && (
            <pre style={{ fontSize: '12px' }}>{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      </div>

      <div className="test-card">
        <h3>Hook API</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Return</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>login</td><td>(username, password, options?) =&gt; Promise</td><td>Execute login</td></tr>
            <tr><td style={{ padding: '8px' }}>isLoading</td><td>boolean</td><td>Loading state</td></tr>
            <tr><td style={{ padding: '8px' }}>error</td><td>string | null</td><td>Error message</td></tr>
            <tr><td style={{ padding: '8px' }}>clearError</td><td>() =&gt; void</td><td>Clear error</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestAccountService() {
  const accountService = useAccountService()
  const [tenantName, setTenantName] = useState('')
  const [tenantResult, setTenantResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFindTenant = async () => {
    setIsLoading(true)
    try {
      const result = await accountService.findTenant(tenantName)
      setTenantResult(result)
    } catch (err: any) {
      setTenantResult({ error: err.message || 'Failed to find tenant' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="test-section">
      <h2>useAccountService Hook</h2>

      <div className="test-card">
        <h3>Account Service Methods</h3>
        <p>The AccountService provides methods for account operations:</p>
        <ul>
          <li><code>findTenant(name)</code> - Find tenant by name</li>
          <li><code>register(data)</code> - Register a new user</li>
        </ul>
      </div>

      <div className="test-card">
        <h3>Find Tenant Demo</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Tenant name"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            style={{ padding: '8px' }}
          />
          <button onClick={handleFindTenant} disabled={isLoading}>
            {isLoading ? 'Finding...' : 'Find Tenant'}
          </button>
        </div>
        {tenantResult && (
          <pre style={{ marginTop: '0.5rem', fontSize: '12px' }}>
            {JSON.stringify(tenantResult, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}

function TestAccountPages() {
  const [showLoginPage, setShowLoginPage] = useState(false)
  const [showRegisterPage, setShowRegisterPage] = useState(false)

  return (
    <div className="test-section">
      <h2>Page Components</h2>

      <div className="test-card">
        <h3>LoginPage Component</h3>
        <p>Full-page login component with container styling:</p>
        <button onClick={() => setShowLoginPage(!showLoginPage)}>
          {showLoginPage ? 'Hide LoginPage' : 'Show LoginPage'}
        </button>
        {showLoginPage && (
          <div style={{ marginTop: '1rem', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
            <LoginPage
              showTenantBox={true}
              showRegisterLink={true}
              onLoginSuccess={() => console.log('Login success!')}
            />
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>RegisterPage Component</h3>
        <p>Full-page registration component with container styling:</p>
        <button onClick={() => setShowRegisterPage(!showRegisterPage)}>
          {showRegisterPage ? 'Hide RegisterPage' : 'Show RegisterPage'}
        </button>
        {showRegisterPage && (
          <div style={{ marginTop: '1rem', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
            <RegisterPage
              showTenantBox={true}
              showLoginLink={true}
              onRegisterSuccess={() => console.log('Register success!')}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function TestAuthWrapper() {
  const [showWrapper, setShowWrapper] = useState(false)
  const [enableLocalLogin, setEnableLocalLogin] = useState(true)

  return (
    <div className="test-section">
      <h2>AuthWrapper Component (v1.1.0, updated v2.0.0)</h2>

      <div className="test-card">
        <h3>Authentication Layout Wrapper</h3>
        <p>AuthWrapper provides a consistent layout for authentication forms:</p>
        <button onClick={() => setShowWrapper(!showWrapper)}>
          {showWrapper ? 'Hide AuthWrapper' : 'Show AuthWrapper'}
        </button>

        {showWrapper && (
          <div style={{ marginTop: '1rem', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
            <AuthWrapper
              enableLocalLogin={enableLocalLogin}
              mainContent={
                <div style={{ textAlign: 'center' }}>
                  <h3>Main Content Area</h3>
                  <p>Your login form, register form, or other auth content goes here.</p>
                </div>
              }
              cancelContent={
                <a href="#" style={{ color: '#646cff' }}>Cancel and go back</a>
              }
            />
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>enableLocalLogin Demo (v2.0.0)</h3>
        <p>Toggle to see how AuthWrapper handles disabled local login:</p>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={enableLocalLogin}
            onChange={(e) => setEnableLocalLogin(e.target.checked)}
          />
          Enable Local Login
        </label>
        <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>
          When disabled, AuthWrapper shows a message instead of the login form.
          This is controlled by the ABP setting <code>Abp.Account.EnableLocalLogin</code>.
        </p>
      </div>

      <div className="test-card">
        <h3>AuthWrapper Props</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Prop</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>children</td><td>ReactNode</td><td>Main content (alternative to mainContent)</td></tr>
            <tr><td style={{ padding: '8px' }}>mainContent</td><td>ReactNode</td><td>Main content template</td></tr>
            <tr><td style={{ padding: '8px' }}>cancelContent</td><td>ReactNode</td><td>Footer/cancel content</td></tr>
            <tr style={{ backgroundColor: '#1a1a2e' }}><td style={{ padding: '8px' }}>enableLocalLogin</td><td>boolean</td><td><strong>(v2.0.0)</strong> Override local login enabled state</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestChangePasswordForm() {
  const toaster = useToaster()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="test-section">
      <h2>ChangePasswordForm Component (v1.1.0)</h2>

      <div className="test-card">
        <h3>Change Password Form</h3>
        <p>Form for authenticated users to change their password:</p>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Form' : 'Show Change Password Form'}
        </button>

        {showForm && (
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #333', borderRadius: '8px', maxWidth: '400px' }}>
            <ChangePasswordForm
              onSuccess={() => {
                toaster.success('Password changed successfully!', 'Success')
              }}
              onError={(error) => {
                toaster.error(error, 'Password Change Failed')
              }}
            />
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>Password Requirements</h3>
        <ul>
          <li>Minimum 6 characters</li>
          <li>Maximum 32 characters</li>
          <li>At least one lowercase letter</li>
          <li>At least one uppercase letter</li>
          <li>At least one number</li>
          <li>At least one special character</li>
        </ul>
      </div>

      <div className="test-card">
        <h3>ChangePasswordForm Props</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Prop</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>onSuccess</td><td>() =&gt; void</td><td>Called on successful password change</td></tr>
            <tr><td style={{ padding: '8px' }}>onError</td><td>(error: string) =&gt; void</td><td>Called on error</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestPersonalSettingsForm() {
  const toaster = useToaster()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="test-section">
      <h2>PersonalSettingsForm Component (v1.1.0)</h2>

      <div className="test-card">
        <h3>Personal Settings Form</h3>
        <p>Form for users to update their personal information:</p>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Form' : 'Show Personal Settings Form'}
        </button>

        {showForm && (
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #333', borderRadius: '8px', maxWidth: '400px' }}>
            <PersonalSettingsForm
              onSuccess={() => {
                toaster.success('Profile updated successfully!', 'Success')
              }}
              onError={(error) => {
                toaster.error(error, 'Profile Update Failed')
              }}
            />
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>Fields</h3>
        <ul>
          <li>Username (required)</li>
          <li>Email Address (required)</li>
          <li>Name (optional)</li>
          <li>Surname (optional)</li>
          <li>Phone Number (optional)</li>
        </ul>
      </div>

      <div className="test-card">
        <h3>PersonalSettingsForm Props</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Prop</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>onSuccess</td><td>() =&gt; void</td><td>Called on successful update</td></tr>
            <tr><td style={{ padding: '8px' }}>onError</td><td>(error: string) =&gt; void</td><td>Called on error</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestManageProfile() {
  const [showProfile, setShowProfile] = useState(false)

  return (
    <div className="test-section">
      <h2>ManageProfile Component (v1.1.0)</h2>

      <div className="test-card">
        <h3>Profile Management Page</h3>
        <p>Tabbed interface for managing user profile with Personal Settings and Change Password tabs:</p>
        <button onClick={() => setShowProfile(!showProfile)}>
          {showProfile ? 'Hide ManageProfile' : 'Show ManageProfile'}
        </button>

        {showProfile && (
          <div style={{ marginTop: '1rem', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
            <ManageProfile
              defaultTabIndex={0}
              onTabChange={(index) => console.log('Tab changed to:', index)}
            />
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>ManageProfile Props</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Prop</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Default</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>defaultTabIndex</td><td>number</td><td>0</td></tr>
            <tr><td style={{ padding: '8px' }}>onTabChange</td><td>(index: number) =&gt; void</td><td>-</td></tr>
            <tr><td style={{ padding: '8px' }}>customTabs</td><td>ProfileTab[]</td><td>Default tabs</td></tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Default Tabs</h3>
        <ol>
          <li>Personal Settings - User profile information</li>
          <li>Change Password - Password update form</li>
        </ol>
      </div>
    </div>
  )
}

function TestAccountProvider() {
  return (
    <div className="test-section">
      <h2>AccountProvider Component</h2>

      <div className="test-card">
        <h3>Provider Configuration</h3>
        <p>AccountProvider wraps account components and provides configuration:</p>
        <pre style={{ fontSize: '12px' }}>{`import { AccountProvider } from '@abpjs/account'

<AccountProvider options={{ redirectUrl: '/dashboard' }}>
  <LoginForm />
</AccountProvider>`}</pre>
      </div>

      <div className="test-card">
        <h3>DEFAULT_REDIRECT_URL</h3>
        <p>The default redirect URL after login: <code>{DEFAULT_REDIRECT_URL}</code></p>
      </div>
    </div>
  )
}

function TestAccountOptions() {
  const accountOptions = useAccountOptions()

  return (
    <div className="test-section">
      <h2>Account Options (useAccountOptions)</h2>

      <div className="test-card">
        <h3>Current Options</h3>
        <pre style={{ maxHeight: '150px', overflow: 'auto' }}>
          {JSON.stringify(accountOptions, null, 2)}
        </pre>
      </div>
    </div>
  )
}

function TestAccountRoutes() {
  return (
    <div className="test-section">
      <h2>Account Routes & Paths</h2>

      <div className="test-card">
        <h3>ACCOUNT_ROUTES (Removed in v2.0.0)</h3>
        <p style={{ color: '#f39c12' }}>
          ⚠️ <code>ACCOUNT_ROUTES</code> was deprecated in v0.9 and removed in v2.0.0.
          Routes are now configured via <code>AccountProvider</code>.
        </p>
      </div>

      <div className="test-card">
        <h3>ACCOUNT_PATHS</h3>
        <p>Path constants:</p>
        <pre style={{ maxHeight: '100px', overflow: 'auto' }}>
          {JSON.stringify(ACCOUNT_PATHS, null, 2)}
        </pre>
      </div>

      <div className="test-card">
        <h3>Quick Links</h3>
        <ul>
          <li><Link to="/account/login" style={{ color: '#646cff' }}>Login Page &rarr;</Link></li>
          <li><Link to="/account/register" style={{ color: '#646cff' }}>Register Page &rarr;</Link></li>
        </ul>
      </div>
    </div>
  )
}

function TestSelfRegistration() {
  const isSelfRegistrationEnabled = useSelfRegistrationEnabled()

  return (
    <div className="test-section">
      <h2>useSelfRegistrationEnabled Hook (v2.0.0)</h2>

      <div className="test-card">
        <h3>Self Registration Status</h3>
        <p>
          Self Registration Enabled:{' '}
          <strong style={{ color: isSelfRegistrationEnabled ? '#2ecc71' : '#e74c3c' }}>
            {isSelfRegistrationEnabled ? 'Yes' : 'No'}
          </strong>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#888' }}>
          This reads from the ABP setting <code>Abp.Account.IsSelfRegistrationEnabled</code>.
          When disabled, the register link is hidden from the login form and access to
          the register page is restricted.
        </p>
      </div>

      <div className="test-card">
        <h3>Hook Usage</h3>
        <pre style={{ fontSize: '12px' }}>{`import { useSelfRegistrationEnabled } from '@abpjs/account'

function MyComponent() {
  const isSelfRegistrationEnabled = useSelfRegistrationEnabled()

  if (!isSelfRegistrationEnabled) {
    return <p>Registration is disabled</p>
  }

  return <Link to="/register">Register</Link>
}`}</pre>
      </div>
    </div>
  )
}

function TestAccountNamespace() {
  // Type-only demonstration - Account namespace provides interfaces
  const authWrapperInputs: Account.AuthWrapperComponentInputs = {
    mainContentRef: undefined,
    cancelContentRef: undefined,
  }

  return (
    <div className="test-section">
      <h2>Account Namespace (v2.0.0)</h2>

      <div className="test-card">
        <h3>Component Interface Types</h3>
        <p>The Account namespace provides TypeScript interfaces for component props:</p>
        <ul>
          <li><code>Account.AuthWrapperComponentInputs</code></li>
          <li><code>Account.AuthWrapperComponentOutputs</code></li>
          <li><code>Account.TenantBoxComponentInputs</code></li>
          <li><code>Account.TenantBoxComponentOutputs</code></li>
          <li><code>Account.PersonalSettingsComponentInputs</code></li>
          <li><code>Account.PersonalSettingsComponentOutputs</code></li>
          <li><code>Account.ChangePasswordComponentInputs</code></li>
          <li><code>Account.ChangePasswordComponentOutputs</code></li>
        </ul>
      </div>

      <div className="test-card">
        <h3>Usage Example</h3>
        <pre style={{ fontSize: '12px' }}>{`import { Account } from '@abpjs/account'

// Type your custom components with these interfaces
const inputs: Account.AuthWrapperComponentInputs = {
  mainContentRef: <LoginForm />,
  cancelContentRef: <Link to="/">Cancel</Link>,
}`}</pre>
      </div>

      <div className="test-card">
        <h3>Current Test Value</h3>
        <pre style={{ fontSize: '12px' }}>
          {JSON.stringify(authWrapperInputs, null, 2)}
        </pre>
      </div>
    </div>
  )
}

function TestAuthState() {
  const auth = useAuth()
  const config = useConfig()

  return (
    <div className="test-section">
      <h2>Authentication State</h2>

      <div className="test-card">
        <h3>Current Auth Status</h3>
        <p>Is Authenticated: {auth.isAuthenticated ? 'Yes' : 'No'}</p>
        <p>Is Loading: {auth.isLoading ? 'Yes' : 'No'}</p>
        {auth.isAuthenticated && auth.user && (
          <>
            <p>Username: {auth.user.profile?.preferred_username}</p>
            <p>Email: {auth.user.profile?.email}</p>
          </>
        )}
      </div>

      <div className="test-card">
        <h3>ABP Current User</h3>
        {config.currentUser ? (
          <pre style={{ maxHeight: '150px', overflow: 'auto' }}>
            {JSON.stringify(config.currentUser, null, 2)}
          </pre>
        ) : (
          <p style={{ color: '#888' }}>Not logged in</p>
        )}
      </div>

      <div className="test-card">
        <h3>Actions</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => auth.login()} disabled={auth.isAuthenticated}>Login</button>
          <button onClick={() => auth.logout()} disabled={!auth.isAuthenticated}>Logout</button>
        </div>
      </div>
    </div>
  )
}

export function TestAccountPage() {
  return (
    <div>
      <h1>@abpjs/account Tests (v2.2.0)</h1>
      <p>Testing login, register, tenant switching, and account-related features.</p>
      <p style={{ color: '#888', fontSize: '0.9rem' }}>Version 2.2.0 - Dependency updates only (no new features from v2.0.0)</p>

      <TestAuthState />
      <TestPasswordFlow />
      <TestAccountService />
      <TestLoginForm />
      <TestRegisterForm />
      <TestAccountPages />
      <TestTenantBox />

      {/* v1.1.0 Components */}
      <h2 style={{ marginTop: '2rem', borderTop: '2px solid #333', paddingTop: '1rem' }}>
        v1.1.0 Components
      </h2>
      <TestAuthWrapper />
      <TestChangePasswordForm />
      <TestPersonalSettingsForm />
      <TestManageProfile />

      {/* v2.0.0 Features */}
      <h2 style={{ marginTop: '2rem', borderTop: '2px solid #646cff', paddingTop: '1rem' }}>
        v2.0.0 New Features
      </h2>
      <TestSelfRegistration />
      <TestAccountNamespace />

      <TestAccountProvider />
      <TestAccountOptions />
      <TestAccountRoutes />
    </div>
  )
}

export default TestAccountPage
