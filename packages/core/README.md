# @abpjs/core

> Core infrastructure package for ABP Framework in React

[![npm version](https://img.shields.io/npm/v/@abpjs/core.svg)](https://www.npmjs.com/package/@abpjs/core)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

## Overview

`@abpjs/core` is the foundational package of the ABP React ecosystem. It provides the essential infrastructure, state management, authentication, localization, and API communication layers that power all other `@abpjs/*` packages.

This package is a React translation of the original `@abp/ng.core` Angular package, maintaining API compatibility while leveraging modern React patterns including hooks, context, and Redux Toolkit.

## Features

- **Authentication & Authorization** - Built-in OIDC/OAuth2 support with `oidc-client-ts`
- **State Management** - Redux Toolkit powered state management with pre-configured slices
- **Localization** - Full i18n support with dynamic resource loading
- **REST API Abstraction** - Type-safe HTTP client built on Axios
- **Configuration Management** - Centralized application configuration
- **Permission System** - Fine-grained permission checking hooks and guards
- **React Hooks** - Modern hook-based APIs for all core functionality
- **TypeScript** - Full TypeScript support with comprehensive type definitions

## Installation

```bash
# Using npm
npm install @abpjs/core

# Using yarn
yarn add @abpjs/core

# Using pnpm
pnpm add @abpjs/core
```

### Peer Dependencies

Ensure you have the following peer dependencies installed:

```bash
npm install react react-dom react-redux @reduxjs/toolkit axios oidc-client-ts
```

## Quick Start

### 1. Setup the Core Provider

Wrap your application with the ABP Core provider:

```tsx
import { CoreProvider } from '@abpjs/core';

const environment = {
  production: false,
  application: {
    name: 'My ABP App',
  },
  oAuthConfig: {
    issuer: 'https://your-identity-server.com',
    clientId: 'MyApp_React',
    scope: 'openid profile email MyApp',
    responseType: 'code',
  },
  apis: {
    default: {
      url: 'https://your-api-server.com',
    },
  },
};

function App() {
  return (
    <CoreProvider environment={environment}>
      <YourApp />
    </CoreProvider>
  );
}
```

### 2. Use Authentication

```tsx
import { useAuth } from '@abpjs/core';

function LoginButton() {
  const { isAuthenticated, login, logout, user } = useAuth();

  if (isAuthenticated) {
    return (
      <div>
        <span>Welcome, {user?.name}</span>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return <button onClick={login}>Login</button>;
}
```

### 3. Check Permissions

```tsx
import { usePermission } from '@abpjs/core';

function AdminPanel() {
  const { hasPermission } = usePermission();

  if (!hasPermission('MyApp.Admin.Dashboard')) {
    return <div>Access Denied</div>;
  }

  return <div>Admin Dashboard Content</div>;
}
```

### 4. Use Localization

```tsx
import { useLocalization } from '@abpjs/core';

function WelcomeMessage() {
  const { t } = useLocalization();

  return <h1>{t('::Welcome')}</h1>;
}
```

> **Note:** `t()` is the primary translation function (React convention). An `instant()` alias is also available for developers familiar with ABP Angular.

### 5. Make API Calls

```tsx
import { useRestService } from '@abpjs/core';

function UsersList() {
  const rest = useRestService();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    rest.request({
      method: 'GET',
      url: '/api/app/users',
    }).then(response => setUsers(response.items));
  }, []);

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

## API Reference

### Hooks

| Hook | Description |
|------|-------------|
| `useAuth()` | Authentication state and methods (login, logout, user info) |
| `useConfig()` | Access application configuration |
| `useDirection()` | RTL/LTR direction based on current language |
| `useLocalization()` | Localization and translation functions |
| `usePermission()` | Permission checking utilities |
| `useProfile()` | Current user profile management |
| `useSession()` | Session state management |

### RTL Support

The `useDirection()` hook provides RTL (Right-to-Left) support for Arabic, Hebrew, Persian, Urdu, and other RTL languages:

```tsx
import { useDirection } from '@abpjs/core';

function MyComponent() {
  const { direction, isRtl, startSide, endSide } = useDirection();

  return (
    <div dir={direction}>
      {/* direction: 'rtl' or 'ltr' */}
      {/* isRtl: boolean */}
      {/* startSide: 'left' (LTR) or 'right' (RTL) */}
      {/* endSide: 'right' (LTR) or 'left' (RTL) */}
      <Menu.Root positioning={{ placement: `${endSide}-start` }}>
        {/* Menu opens on opposite side of content */}
      </Menu.Root>
    </div>
  );
}
```

### Services

| Service | Description |
|---------|-------------|
| `ApplicationConfigurationService` | Fetches and manages ABP application configuration |
| `ConfigService` | Handles runtime configuration state |
| `ProfileService` | User profile API operations |
| `LocalizationService` | Translation and localization services |
| `RestService` | HTTP client abstraction with interceptors |
| `LazyLoadService` | Dynamic module and script loading |

### Redux Slices

| Slice | Description |
|-------|-------------|
| `configSlice` | Application configuration state |
| `profileSlice` | User profile state |
| `sessionSlice` | Session and authentication state |

### Models

The package exports comprehensive TypeScript models for:

- Application configuration (`ApplicationConfiguration`)
- REST responses (`PagedResultDto`, `ListResultDto`)
- Common types and interfaces
- Profile and session models

## Why @abpjs/core?

### Compared to @abp/ng.core

| Feature | @abp/ng.core (Angular) | @abpjs/core (React) |
|---------|------------------------|---------------------|
| State Management | NgRx + RxJS | Redux Toolkit |
| DI Pattern | Angular DI | React Context + Hooks |
| Reactivity | RxJS Observables | React hooks + useEffect |
| Bundle Size | Larger (Angular overhead) | Smaller (React focused) |
| Learning Curve | Angular knowledge required | React developers friendly |

### Key Benefits

1. **Modern React Patterns** - Built from the ground up with hooks and functional components
2. **Redux DevTools Support** - Debug your ABP state with Redux DevTools
3. **Tree Shakeable** - Only bundle what you use
4. **TypeScript First** - Comprehensive type definitions included
5. **Familiar ABP APIs** - Same concepts, React-friendly implementation

## Configuration

### Environment Configuration

```typescript
interface Environment {
  production: boolean;
  application: {
    name: string;
    logoUrl?: string;
  };
  oAuthConfig: {
    issuer: string;
    clientId: string;
    scope: string;
    responseType: string;
    redirectUri?: string;
    postLogoutRedirectUri?: string;
  };
  apis: {
    default: {
      url: string;
      rootNamespace?: string;
    };
    [key: string]: {
      url: string;
      rootNamespace?: string;
    };
  };
  localization?: {
    defaultResourceName?: string;
  };
}
```

## Related Packages

- [@abpjs/account](https://www.npmjs.com/package/@abpjs/account) - Login, registration, and tenant switching
- [@abpjs/permission-management](https://www.npmjs.com/package/@abpjs/permission-management) - Permission management UI
- [@abpjs/tenant-management](https://www.npmjs.com/package/@abpjs/tenant-management) - Multi-tenant management
- [@abpjs/theme-basic](https://www.npmjs.com/package/@abpjs/theme-basic) - Basic layout components
- [@abpjs/theme-shared](https://www.npmjs.com/package/@abpjs/theme-shared) - Shared UI components

## Contributing

This package is part of the [ABP React](https://github.com/abpjs/abp-react) monorepo. Contributions are welcome!

## License

LGPL-3.0 - See [LICENSE](https://github.com/abpjs/abp-react/blob/main/LICENSE) for details.

---

**[View Full Documentation](https://docs.abpjs.io/docs/packages/core/overview)** | **[Report Issues](https://github.com/abpjs/abp-react/issues)** | **[View Source](https://github.com/abpjs/abp-react/tree/main/packages/core)**
