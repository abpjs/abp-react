# @abpjs/account-pro

> Enhanced authentication UI components for ABP Framework in React

[![npm version](https://img.shields.io/npm/v/@abpjs/account-pro.svg)](https://www.npmjs.com/package/@abpjs/account-pro)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

## Overview

`@abpjs/account-pro` provides enhanced authentication and account management components for ABP-based React applications. It extends the basic account module with advanced features like password reset, profile management, and personal settings.

This package is a React translation of the original `@volo/abp.ng.account` Angular package, bringing pro-level account management to React applications.

## Features

- **Login Form** - Enhanced login form with validation and error handling
- **Registration Form** - User registration with configurable fields
- **Forgot Password** - Request password reset via email
- **Reset Password** - Reset password with token validation
- **Change Password** - Change password for authenticated users
- **Profile Management** - View and update user profile
- **Personal Settings** - Manage user-specific settings
- **Tenant Switching** - Multi-tenant support with tenant selection UI
- **Chakra UI** - Beautiful, accessible components out of the box
- **TypeScript** - Full type safety

## Installation

```bash
# Using npm
npm install @abpjs/account-pro

# Using yarn
yarn add @abpjs/account-pro

# Using pnpm
pnpm add @abpjs/account-pro
```

### Required Dependencies

This package requires the following peer dependencies:

```bash
npm install @abpjs/core @abpjs/theme-shared @chakra-ui/react @emotion/react react-hook-form zod @hookform/resolvers react-icons
```

## Quick Start

### Using Pre-built Pages

```tsx
import {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  ChangePasswordForm,
  ManageProfile,
  PersonalSettings
} from '@abpjs/account-pro';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      <Route path="/reset-password" element={<ResetPasswordForm />} />
      <Route path="/change-password" element={<ChangePasswordForm />} />
      <Route path="/profile" element={<ManageProfile />} />
      <Route path="/settings" element={<PersonalSettings />} />
    </Routes>
  );
}
```

### Using Individual Components

#### Login Form

```tsx
import { LoginForm } from '@abpjs/account-pro';

function LoginPage() {
  const handleSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <h1>Welcome Back</h1>
      <LoginForm onSuccess={handleSuccess} />
    </div>
  );
}
```

#### Forgot Password

```tsx
import { ForgotPasswordForm } from '@abpjs/account-pro';

function ForgotPasswordPage() {
  return (
    <div>
      <h1>Forgot Password</h1>
      <ForgotPasswordForm
        onSuccess={() => console.log('Reset email sent!')}
      />
    </div>
  );
}
```

#### Change Password

```tsx
import { ChangePasswordForm } from '@abpjs/account-pro';

function ChangePasswordPage() {
  return (
    <div>
      <h1>Change Password</h1>
      <ChangePasswordForm
        onSuccess={() => console.log('Password changed!')}
      />
    </div>
  );
}
```

## Components

### LoginForm

Enhanced login form with username/email and password fields.

```tsx
import { LoginForm } from '@abpjs/account-pro';

<LoginForm
  onSuccess={() => navigate('/dashboard')}
  onError={(error) => console.error(error)}
  showRegisterLink={true}
  showForgotPassword={true}
/>
```

### RegisterForm

User registration form with validation.

```tsx
import { RegisterForm } from '@abpjs/account-pro';

<RegisterForm
  onSuccess={() => navigate('/login')}
  onError={(error) => console.error(error)}
/>
```

### ForgotPasswordForm

Request password reset via email.

```tsx
import { ForgotPasswordForm } from '@abpjs/account-pro';

<ForgotPasswordForm
  onSuccess={() => console.log('Email sent')}
  onError={(error) => console.error(error)}
/>
```

### ResetPasswordForm

Reset password using token from email.

```tsx
import { ResetPasswordForm } from '@abpjs/account-pro';

<ResetPasswordForm
  onSuccess={() => navigate('/login')}
  onError={(error) => console.error(error)}
/>
```

### ChangePasswordForm

Change password for authenticated users.

```tsx
import { ChangePasswordForm } from '@abpjs/account-pro';

<ChangePasswordForm
  onSuccess={() => console.log('Password changed')}
  onError={(error) => console.error(error)}
/>
```

### ManageProfile

Profile management component.

```tsx
import { ManageProfile } from '@abpjs/account-pro';

<ManageProfile
  onProfileUpdated={(profile) => console.log('Updated:', profile)}
/>
```

### PersonalSettings

User personal settings management.

```tsx
import { PersonalSettings } from '@abpjs/account-pro';

<PersonalSettings />
```

### TenantBox

Multi-tenant selection component.

```tsx
import { TenantBox } from '@abpjs/account-pro';

<TenantBox
  onTenantChange={(tenant) => console.log('Tenant changed:', tenant)}
/>
```

## Hooks

### usePasswordFlow

Hook for implementing OAuth2 resource owner password flow.

```tsx
import { usePasswordFlow } from '@abpjs/account-pro';

function CustomLoginForm() {
  const { login, isLoading, error } = usePasswordFlow();

  const handleSubmit = async (data) => {
    await login({
      username: data.username,
      password: data.password,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your custom form */}
    </form>
  );
}
```

### useAccountProService

Hook for account pro API operations.

```tsx
import { useAccountProService } from '@abpjs/account-pro';

function MyComponent() {
  const service = useAccountProService();

  const handleForgotPassword = async (email: string) => {
    await service.sendPasswordResetCode({ email });
  };

  const handleResetPassword = async (data) => {
    await service.resetPassword({
      userId: data.userId,
      resetToken: data.token,
      password: data.newPassword,
    });
  };
}
```

## Related Packages

- [@abpjs/core](https://www.npmjs.com/package/@abpjs/core) - Core infrastructure (required)
- [@abpjs/theme-shared](https://www.npmjs.com/package/@abpjs/theme-shared) - Shared UI components (required)
- [@abpjs/account](https://www.npmjs.com/package/@abpjs/account) - Basic account module
- [@abpjs/identity-pro](https://www.npmjs.com/package/@abpjs/identity-pro) - Identity Pro features

## Contributing

This package is part of the [ABP React](https://github.com/abpjs/abp-react) monorepo. Contributions are welcome!

## License

LGPL-3.0 - See [LICENSE](https://github.com/abpjs/abp-react/blob/main/LICENSE) for details.

---

**[View Full Documentation](https://docs.abpjs.io/docs/packages/account-pro/overview)** | **[Report Issues](https://github.com/abpjs/abp-react/issues)** | **[View Source](https://github.com/abpjs/abp-react/tree/main/packages/account-pro)**
