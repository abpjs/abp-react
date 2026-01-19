# @abpjs/account

> Authentication UI components for ABP Framework in React

[![npm version](https://img.shields.io/npm/v/@abpjs/account.svg)](https://www.npmjs.com/package/@abpjs/account)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

## Overview

`@abpjs/account` provides ready-to-use authentication components for ABP-based React applications. It includes login forms, registration pages, and multi-tenant switching functionality - all styled with Chakra UI and fully customizable.

This package is a React translation of the original `@abp/ng.account` Angular package, bringing the same reliable account management to React developers.

## Features

- **Login Form** - Complete login form with validation and error handling
- **Registration Form** - User registration with configurable fields
- **Tenant Switching** - Multi-tenant support with tenant selection UI
- **Password Flow** - OAuth2 resource owner password flow support
- **Form Validation** - Built-in validation using Zod schemas
- **Chakra UI** - Beautiful, accessible components out of the box
- **Fully Customizable** - Override styles and extend components easily
- **TypeScript** - Full type safety

## Installation

```bash
# Using npm
npm install @abpjs/account

# Using yarn
yarn add @abpjs/account

# Using pnpm
pnpm add @abpjs/account
```

### Required Dependencies

This package requires the following peer dependencies:

```bash
npm install @abpjs/core @abpjs/theme-shared @chakra-ui/react @emotion/react @emotion/styled framer-motion react-hook-form zod
```

## Quick Start

### 1. Add Account Routes

The simplest way to use this package is to add the pre-configured routes:

```tsx
import { accountRoutes } from '@abpjs/account';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  ...accountRoutes,
  // Your other routes
]);

function App() {
  return <RouterProvider router={router} />;
}
```

### 2. Using Individual Components

#### Login Form

```tsx
import { LoginForm } from '@abpjs/account';

function LoginPage() {
  const handleSuccess = () => {
    // Redirect after successful login
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

#### Registration Form

```tsx
import { RegisterForm } from '@abpjs/account';

function RegisterPage() {
  const handleSuccess = () => {
    // Redirect after successful registration
    navigate('/login');
  };

  return (
    <div>
      <h1>Create Account</h1>
      <RegisterForm onSuccess={handleSuccess} />
    </div>
  );
}
```

#### Tenant Box

```tsx
import { TenantBox } from '@abpjs/account';

function Header() {
  return (
    <header>
      <TenantBox />
      {/* Other header content */}
    </header>
  );
}
```

### 3. Using Pre-built Pages

```tsx
import { LoginPage, RegisterPage } from '@abpjs/account';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
```

## Components

### LoginForm

A complete login form with username/email and password fields.

```tsx
import { LoginForm } from '@abpjs/account';

<LoginForm
  onSuccess={() => navigate('/dashboard')}
  onError={(error) => console.error(error)}
  showRegisterLink={true}
  showForgotPassword={true}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSuccess` | `() => void` | - | Callback after successful login |
| `onError` | `(error: Error) => void` | - | Callback on login error |
| `showRegisterLink` | `boolean` | `true` | Show link to registration page |
| `showForgotPassword` | `boolean` | `true` | Show forgot password link |

### RegisterForm

User registration form with validation.

```tsx
import { RegisterForm } from '@abpjs/account';

<RegisterForm
  onSuccess={() => navigate('/login')}
  onError={(error) => console.error(error)}
  showLoginLink={true}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSuccess` | `() => void` | - | Callback after successful registration |
| `onError` | `(error: Error) => void` | - | Callback on registration error |
| `showLoginLink` | `boolean` | `true` | Show link to login page |

### TenantBox

Multi-tenant selection component.

```tsx
import { TenantBox } from '@abpjs/account';

<TenantBox
  onTenantChange={(tenant) => console.log('Tenant changed:', tenant)}
/>
```

## Hooks

### usePasswordFlow

Hook for implementing OAuth2 resource owner password flow.

```tsx
import { usePasswordFlow } from '@abpjs/account';

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

## Customization

### Styling with Chakra UI

All components use Chakra UI and can be styled using Chakra's theming system:

```tsx
import { extendTheme, ChakraProvider } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'blue',
      },
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <LoginForm />
    </ChakraProvider>
  );
}
```

### Custom Validation

Override validation schemas using Zod:

```tsx
import { z } from 'zod';

const customLoginSchema = z.object({
  username: z.string().email('Must be a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
```

## Multi-Tenancy

The account module fully supports ABP's multi-tenant architecture:

1. **Tenant Selection** - Users can select their tenant before login
2. **Tenant Header** - Automatically includes tenant header in API requests
3. **Tenant Persistence** - Remembers selected tenant across sessions

```tsx
import { TenantBox } from '@abpjs/account';

// Show tenant selector in your app header
function AppHeader() {
  return (
    <header>
      <Logo />
      <TenantBox />
      <UserMenu />
    </header>
  );
}
```

## Integration with ABP Backend

This package is designed to work seamlessly with ABP Framework backends:

- Compatible with ABP's Identity Server integration
- Supports ABP's account module API endpoints
- Works with ABP's multi-tenant system

## Related Packages

- [@abpjs/core](https://www.npmjs.com/package/@abpjs/core) - Core infrastructure (required)
- [@abpjs/theme-shared](https://www.npmjs.com/package/@abpjs/theme-shared) - Shared UI components (required)
- [@abpjs/theme-basic](https://www.npmjs.com/package/@abpjs/theme-basic) - Layout components
- [@abpjs/permission-management](https://www.npmjs.com/package/@abpjs/permission-management) - Permission management
- [@abpjs/tenant-management](https://www.npmjs.com/package/@abpjs/tenant-management) - Tenant administration

## Contributing

This package is part of the [ABP React](https://github.com/abpjs/abp-react) monorepo. Contributions are welcome!

## License

LGPL-3.0 - See [LICENSE](https://github.com/abpjs/abp-react/blob/main/LICENSE) for details.

---

**[View Full Documentation](https://docs.abpjs.io/docs/packages/account/overview)** | **[Report Issues](https://github.com/abpjs/abp-react/issues)** | **[View Source](https://github.com/abpjs/abp-react/tree/main/packages/account)**
