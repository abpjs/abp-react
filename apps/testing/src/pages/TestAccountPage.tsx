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
  useAccountOptions,
  ACCOUNT_ROUTES,
  ACCOUNT_PATHS,
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
      <TestLoginForm />
      <TestRegisterForm />
      <TestTenantBox />
      <TestAccountOptions />
      <TestAccountRoutes />
    </div>
  )
}

export default TestAccountPage
