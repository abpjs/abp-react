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
  useAccountOptions,
  usePasswordFlow,
  useAccountService,
  ACCOUNT_ROUTES,
  ACCOUNT_PATHS,
  DEFAULT_REDIRECT_URL,
} from '@abpjs/account'
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
        <h3>ACCOUNT_ROUTES</h3>
        <p>Pre-defined routes from @abpjs/account:</p>
        <pre style={{ maxHeight: '200px', overflow: 'auto' }}>
          {JSON.stringify(ACCOUNT_ROUTES, null, 2)}
        </pre>
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
      <h1>@abpjs/account Tests</h1>
      <p>Testing login, register, tenant switching, and account-related features.</p>

      <TestAuthState />
      <TestPasswordFlow />
      <TestAccountService />
      <TestLoginForm />
      <TestRegisterForm />
      <TestAccountPages />
      <TestTenantBox />
      <TestAccountProvider />
      <TestAccountOptions />
      <TestAccountRoutes />
    </div>
  )
}

export default TestAccountPage
