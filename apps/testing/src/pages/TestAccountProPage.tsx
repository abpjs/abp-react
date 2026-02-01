/**
 * Test page for @abpjs/account-pro package
 * Tests: Pro components - ForgotPassword, ResetPassword, ChangePassword, PersonalSettings, ManageProfile
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LoginForm,
  RegisterForm,
  TenantBox,
  ForgotPassword,
  ResetPassword,
  ChangePassword,
  PersonalSettings,
  ManageProfile,
  useAccountProService,
  usePasswordFlow,
  ACCOUNT_PRO_ROUTES,
} from '@abpjs/account-pro'
import { useAuth, useConfig } from '@abpjs/core'
import { useToaster } from '@abpjs/theme-shared'

function TestLoginForm() {
  const toaster = useToaster()
  const [showForm, setShowForm] = useState(false)
  const [isSelfRegistrationEnabled, setIsSelfRegistrationEnabled] = useState(true)

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
              isSelfRegistrationEnabled={isSelfRegistrationEnabled}
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

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>isSelfRegistrationEnabled <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.0.0)</span></h3>
        <p>Controls visibility of the register link based on whether self-registration is enabled:</p>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '0.5rem' }}>
          <input
            type="checkbox"
            checked={isSelfRegistrationEnabled}
            onChange={(e) => setIsSelfRegistrationEnabled(e.target.checked)}
          />
          <span>isSelfRegistrationEnabled: {isSelfRegistrationEnabled ? 'true' : 'false'}</span>
        </label>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '0.5rem' }}>
          When false, the "Are you a new user? Register" link is hidden even if showRegisterLink is true.
        </p>
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
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}><td style={{ padding: '8px' }}>isSelfRegistrationEnabled</td><td>boolean</td><td>true <span style={{ color: '#4f4', fontSize: '10px' }}>(v2.0.0)</span></td></tr>
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
  const [isSelfRegistrationEnabled, setIsSelfRegistrationEnabled] = useState(true)

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
              isSelfRegistrationEnabled={isSelfRegistrationEnabled}
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

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>isSelfRegistrationEnabled <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.0.0)</span></h3>
        <p>Controls whether the registration form is shown or a disabled message:</p>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '0.5rem' }}>
          <input
            type="checkbox"
            checked={isSelfRegistrationEnabled}
            onChange={(e) => setIsSelfRegistrationEnabled(e.target.checked)}
          />
          <span>isSelfRegistrationEnabled: {isSelfRegistrationEnabled ? 'true' : 'false'}</span>
        </label>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '0.5rem' }}>
          When false, the form fields are hidden and a "Self-registration is not enabled" message is displayed.
        </p>
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
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}><td style={{ padding: '8px' }}>isSelfRegistrationEnabled</td><td>boolean</td><td>true <span style={{ color: '#4f4', fontSize: '10px' }}>(v2.0.0)</span></td></tr>
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

function TestAccountProService() {
  const accountService = useAccountProService()
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
      <h2>useAccountProService Hook</h2>

      <div className="test-card">
        <h3>Account Pro Service Methods</h3>
        <p>Extended service with Pro features:</p>
        <ul>
          <li><code>findTenant(name)</code> - Find tenant by name</li>
          <li><code>register(data)</code> - Register a new user</li>
          <li><code>sendPasswordResetCode(email)</code> - Send password reset email</li>
          <li><code>resetPassword(data)</code> - Reset password with token</li>
          <li><code>changePassword(data)</code> - Change current user password</li>
          <li><code>getProfile()</code> - Get current user profile</li>
          <li><code>updateProfile(data)</code> - Update user profile</li>
          <li style={{ color: '#4f4' }}><code>sendPhoneNumberConfirmationToken()</code> - Send SMS confirmation token (v2.4.0)</li>
          <li style={{ color: '#4f4' }}><code>confirmPhoneNumber(token)</code> - Confirm phone with token (v2.4.0)</li>
        </ul>
        <p style={{ marginTop: '0.5rem' }}>
          <span style={{ color: '#4f4' }}>apiName:</span> <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>{accountService.apiName}</code>
        </p>
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

function TestForgotPassword() {
  const toaster = useToaster()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="test-section">
      <h2>ForgotPassword Component (Pro)</h2>
      <div className="test-card">
        <h3>Forgot Password Form</h3>
        <p>Allows users to request a password reset email:</p>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Form' : 'Show Forgot Password Form'}
        </button>
        {showForm && (
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #333', borderRadius: '8px' }}>
            <ForgotPassword
              onSuccess={() => toaster.success('Password reset email sent!', 'Success')}
              onError={(error) => toaster.error(error, 'Error')}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function TestResetPassword() {
  const toaster = useToaster()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="test-section">
      <h2>ResetPassword Component (Pro)</h2>
      <div className="test-card">
        <h3>Reset Password Form</h3>
        <p>Set a new password using a reset token:</p>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Form' : 'Show Reset Password Form'}
        </button>
        {showForm && (
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #333', borderRadius: '8px' }}>
            <ResetPassword
              onSuccess={() => toaster.success('Password has been reset!', 'Success')}
              onError={(error) => toaster.error(error, 'Error')}
            />
          </div>
        )}
        <p style={{ color: '#888', marginTop: '0.5rem' }}>Note: Requires userId and resetToken query params.</p>
      </div>
    </div>
  )
}

function TestChangePassword() {
  const toaster = useToaster()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="test-section">
      <h2>ChangePassword Component (Pro)</h2>
      <div className="test-card">
        <h3>Change Password Form</h3>
        <p>Allows authenticated users to change their password:</p>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Form' : 'Show Change Password Form'}
        </button>
        {showForm && (
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #333', borderRadius: '8px' }}>
            <ChangePassword
              onSuccess={() => toaster.success('Password changed!', 'Success')}
              onError={(error) => toaster.error(error, 'Error')}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function TestPersonalSettings() {
  const toaster = useToaster()
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="test-section">
      <h2>PersonalSettings Component (Pro)</h2>
      <div className="test-card">
        <h3>Personal Settings Form</h3>
        <p>Update profile information:</p>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Form' : 'Show Personal Settings'}
        </button>
        {showForm && (
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #333', borderRadius: '8px' }}>
            <PersonalSettings
              onSuccess={() => toaster.success('Profile updated!', 'Success')}
              onError={(error) => toaster.error(error, 'Error')}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function TestManageProfile() {
  const [showComponent, setShowComponent] = useState(false)

  return (
    <div className="test-section">
      <h2>ManageProfile Component (Pro)</h2>
      <div className="test-card">
        <h3>Manage Profile</h3>
        <p>Full profile management with tabs:</p>
        <button onClick={() => setShowComponent(!showComponent)}>
          {showComponent ? 'Hide' : 'Show Manage Profile'}
        </button>
        {showComponent && (
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #333', borderRadius: '8px' }}>
            <ManageProfile />
          </div>
        )}
      </div>
    </div>
  )
}

function TestAccountOptions() {
  return (
    <div className="test-section">
      <h2>AccountOptions <span style={{ color: '#4f4', fontSize: '14px' }}>(v2.0.0)</span></h2>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>enableLocalLogin <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.0.0)</span></h3>
        <p>New option to control whether local login (username/password) is enabled:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
{`// AccountProProvider with enableLocalLogin
<AccountProProvider
  options={{
    enableLocalLogin: true,   // Allow username/password login
    enableSocialLogins: true, // Also allow social logins
  }}
>
  <App />
</AccountProProvider>`}
        </pre>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '0.5rem' }}>
          When <code>enableLocalLogin</code> is false, only external login providers (OAuth, social logins) are available.
        </p>
      </div>

      <div className="test-card">
        <h3>All AccountOptions</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Option</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Default</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>redirectUrl</td><td>string</td><td>/</td><td>URL to redirect after login</td></tr>
            <tr><td style={{ padding: '8px' }}>redirectToLogin</td><td>boolean</td><td>true</td><td>Redirect to login on 401</td></tr>
            <tr><td style={{ padding: '8px' }}>loginUrl</td><td>string</td><td>/account/login</td><td>Custom login page URL</td></tr>
            <tr><td style={{ padding: '8px' }}>registerUrl</td><td>string</td><td>/account/register</td><td>Custom register page URL</td></tr>
            <tr><td style={{ padding: '8px' }}>enableSocialLogins</td><td>boolean</td><td>false</td><td>Enable social login providers</td></tr>
            <tr><td style={{ padding: '8px' }}>enableTwoFactor</td><td>boolean</td><td>false</td><td>Enable 2FA support</td></tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}><td style={{ padding: '8px' }}>enableLocalLogin</td><td>boolean</td><td>true</td><td>Enable username/password login (v2.0.0)</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestComponentInterfaces() {
  return (
    <div className="test-section">
      <h2>Account Component Interfaces <span style={{ color: '#4f4', fontSize: '14px' }}>(v2.0.0)</span></h2>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Account Namespace</h3>
        <p>New namespace containing component interface types for TypeScript support:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
{`import { Account } from '@abpjs/account-pro';

// Component input/output interfaces
const inputs: Account.TenantBoxComponentInputs = {};
const outputs: Account.TenantBoxComponentOutputs = {};

const settingsInputs: Account.PersonalSettingsComponentInputs = {};
const settingsOutputs: Account.PersonalSettingsComponentOutputs = {};

const passwordInputs: Account.ChangePasswordComponentInputs = {};
const passwordOutputs: Account.ChangePasswordComponentOutputs = {};`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Available Interfaces</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Interface</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Component</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>TenantBoxComponentInputs</td><td>TenantBox</td><td>Input props interface</td></tr>
            <tr><td style={{ padding: '8px' }}>TenantBoxComponentOutputs</td><td>TenantBox</td><td>Output callbacks interface</td></tr>
            <tr><td style={{ padding: '8px' }}>PersonalSettingsComponentInputs</td><td>PersonalSettings</td><td>Input props interface</td></tr>
            <tr><td style={{ padding: '8px' }}>PersonalSettingsComponentOutputs</td><td>PersonalSettings</td><td>Output callbacks interface</td></tr>
            <tr><td style={{ padding: '8px' }}>ChangePasswordComponentInputs</td><td>ChangePassword</td><td>Input props interface</td></tr>
            <tr><td style={{ padding: '8px' }}>ChangePasswordComponentOutputs</td><td>ChangePassword</td><td>Output callbacks interface</td></tr>
          </tbody>
        </table>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '0.5rem' }}>
          These interfaces are currently empty but provide extension points for future customization.
        </p>
      </div>
    </div>
  )
}

function TestAccountProRoutes() {
  return (
    <div className="test-section">
      <h2>Account Pro Routes</h2>
      <div className="test-card">
        <h3>ACCOUNT_PRO_ROUTES</h3>
        <pre style={{ maxHeight: '200px', overflow: 'auto' }}>
          {JSON.stringify(ACCOUNT_PRO_ROUTES, null, 2)}
        </pre>
      </div>
      <div className="test-card">
        <h3>Quick Links</h3>
        <ul>
          <li><Link to="/account/login" style={{ color: '#646cff' }}>Login Page</Link></li>
          <li><Link to="/account/register" style={{ color: '#646cff' }}>Register Page</Link></li>
          <li><Link to="/account/forgot-password" style={{ color: '#646cff' }}>Forgot Password</Link></li>
          <li><Link to="/account/manage" style={{ color: '#646cff' }}>Manage Profile</Link></li>
        </ul>
      </div>
    </div>
  )
}

function TestV240Features() {
  const accountService = useAccountProService()
  const toaster = useToaster()
  const [confirmToken, setConfirmToken] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  const handleSendToken = async () => {
    setIsSending(true)
    try {
      await accountService.sendPhoneNumberConfirmationToken()
      toaster.success('Phone confirmation token sent!', 'Success')
    } catch (err: any) {
      toaster.error(err.message || 'Failed to send token', 'Error')
    } finally {
      setIsSending(false)
    }
  }

  const handleConfirmPhone = async () => {
    if (!confirmToken.trim()) {
      toaster.error('Please enter a token', 'Error')
      return
    }
    setIsConfirming(true)
    try {
      await accountService.confirmPhoneNumber(confirmToken)
      toaster.success('Phone number confirmed!', 'Success')
      setConfirmToken('')
    } catch (err: any) {
      toaster.error(err.message || 'Failed to confirm phone number', 'Error')
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <div className="test-section">
      <h2>v2.4.0 Features <span style={{ color: '#4f4', fontSize: '14px' }}>(New)</span></h2>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>apiName Property <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.4.0)</span></h3>
        <p>AccountProService now has an <code>apiName</code> property for REST request configuration:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
{`// Default API name
const service = useAccountProService();
console.log(service.apiName); // 'default'

// Can be customized if needed
service.apiName = 'custom-api';`}
        </pre>
        <p style={{ marginTop: '0.5rem' }}>
          Current apiName: <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>{accountService.apiName}</code>
        </p>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Phone Number Confirmation <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.4.0)</span></h3>
        <p>New methods for phone number verification flow:</p>

        <div style={{ marginTop: '1rem' }}>
          <h4>1. Send Confirmation Token</h4>
          <p style={{ fontSize: '12px', color: '#888' }}>Sends an SMS with a confirmation token to the user's phone number.</p>
          <button onClick={handleSendToken} disabled={isSending} style={{ marginTop: '0.5rem' }}>
            {isSending ? 'Sending...' : 'Send Phone Confirmation Token'}
          </button>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h4>2. Confirm Phone Number</h4>
          <p style={{ fontSize: '12px', color: '#888' }}>Verifies the phone number using the received token.</p>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
            <input
              type="text"
              placeholder="Enter confirmation token"
              value={confirmToken}
              onChange={(e) => setConfirmToken(e.target.value)}
              style={{ padding: '8px', flex: 1, maxWidth: '200px' }}
            />
            <button onClick={handleConfirmPhone} disabled={isConfirming}>
              {isConfirming ? 'Confirming...' : 'Confirm Phone'}
            </button>
          </div>
        </div>

        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`// Phone number confirmation flow
const service = useAccountProService();

// Step 1: Send token to user's phone
await service.sendPhoneNumberConfirmationToken();

// Step 2: User receives SMS and enters token
const token = '123456';
await service.confirmPhoneNumber(token);`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>ProfileResponse Changes <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.4.0)</span></h3>
        <p>ProfileResponse now includes a <code>phoneNumberConfirmed</code> field:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
{`interface ProfileResponse {
  userName: string;
  email: string;
  name?: string;
  surname?: string;
  phoneNumber?: string;
  isEmailConfirmed?: boolean;
  isPhoneNumberConfirmed?: boolean; // @deprecated
  phoneNumberConfirmed?: boolean;   // NEW in v2.4.0
  isTwoFactorEnabled?: boolean;
}`}
        </pre>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '0.5rem' }}>
          Note: <code>isPhoneNumberConfirmed</code> is deprecated in favor of <code>phoneNumberConfirmed</code>.
        </p>
      </div>

      <div className="test-card">
        <h3>v2.4.0 API Summary</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Feature</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>apiName</td>
              <td>string</td>
              <td>REST API name (default: 'default')</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>sendPhoneNumberConfirmationToken()</td>
              <td>Promise&lt;void&gt;</td>
              <td>Send SMS confirmation token</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>confirmPhoneNumber(token)</td>
              <td>Promise&lt;void&gt;</td>
              <td>Confirm phone with token</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>ProfileResponse.phoneNumberConfirmed</td>
              <td>boolean</td>
              <td>Phone confirmation status</td>
            </tr>
          </tbody>
        </table>
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

export function TestAccountProPage() {
  return (
    <div>
      <h1>@abpjs/account-pro Tests v2.4.0</h1>
      <p>Testing Pro account features: password reset, profile management, enhanced components.</p>
      <p style={{ color: '#4f4', fontSize: '0.9rem' }}>Version 2.4.0 - Added apiName property, phone number confirmation methods</p>

      <div className="test-card" style={{ backgroundColor: '#1a365d', border: '1px solid #2b6cb0' }}>
        <h3 style={{ color: '#90cdf4' }}>Pro Package Features</h3>
        <ul>
          <li>Forgot Password / Password Reset flow</li>
          <li>Change Password for authenticated users</li>
          <li>Personal Settings / Profile management</li>
          <li>Enhanced Login with forgot password link</li>
          <li style={{ color: '#90cdf4' }}>v2.0.0: enableLocalLogin option, isSelfRegistrationEnabled prop, Account namespace interfaces</li>
          <li style={{ color: '#4f4' }}>v2.4.0: apiName property, sendPhoneNumberConfirmationToken(), confirmPhoneNumber(), phoneNumberConfirmed field</li>
        </ul>
      </div>

      <TestV240Features />
      <TestAuthState />
      <TestPasswordFlow />
      <TestAccountProService />
      <TestLoginForm />
      <TestRegisterForm />
      <TestForgotPassword />
      <TestResetPassword />
      <TestChangePassword />
      <TestPersonalSettings />
      <TestManageProfile />
      <TestTenantBox />
      <TestAccountOptions />
      <TestComponentInterfaces />
      <TestAccountProRoutes />
    </div>
  )
}

export default TestAccountProPage
