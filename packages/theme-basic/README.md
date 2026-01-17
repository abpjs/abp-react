# @abpjs/theme-basic

> Basic layout components for ABP Framework in React

[![npm version](https://img.shields.io/npm/v/@abpjs/theme-basic.svg)](https://www.npmjs.com/package/@abpjs/theme-basic)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

## Overview

`@abpjs/theme-basic` provides the foundational layout system for ABP-based React applications. It includes multiple pre-built layouts for different sections of your application - from full application layouts with navigation to minimal account page layouts.

This package is a React translation of the original `@abp/ng.theme.basic` Angular package, bringing the same flexible layout system to React developers.

## Features

- **Multiple Layouts** - Application, Account, and Empty layouts
- **Dynamic Layout System** - Switch layouts based on routes
- **Navigation Management** - Configurable navigation elements
- **User Profile** - Built-in profile and password change components
- **Responsive Design** - Mobile-friendly layouts out of the box
- **Chakra UI** - Beautiful, accessible components
- **TypeScript** - Full type safety with comprehensive definitions

## Installation

```bash
# Using npm
npm install @abpjs/theme-basic

# Using yarn
yarn add @abpjs/theme-basic

# Using pnpm
pnpm add @abpjs/theme-basic
```

### Required Dependencies

This package requires the following peer dependencies:

```bash
npm install @abpjs/core @abpjs/theme-shared @chakra-ui/react @chakra-ui/icons @emotion/react @emotion/styled framer-motion react-router-dom react-hook-form
```

## Quick Start

### 1. Setup the Layout Provider

Wrap your application with the LayoutProvider:

```tsx
import { LayoutProvider } from '@abpjs/theme-basic';
import { CoreProvider } from '@abpjs/core';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <CoreProvider environment={environment}>
        <LayoutProvider>
          <Router>
            <AppRoutes />
          </Router>
        </LayoutProvider>
      </CoreProvider>
    </ChakraProvider>
  );
}
```

### 2. Use Layouts in Routes

```tsx
import {
  LayoutApplication,
  LayoutAccount,
  LayoutEmpty
} from '@abpjs/theme-basic';
import { Routes, Route, Outlet } from 'react-router-dom';

function AppRoutes() {
  return (
    <Routes>
      {/* Application layout for main pages */}
      <Route element={<LayoutApplication><Outlet /></LayoutApplication>}>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Route>

      {/* Account layout for auth pages */}
      <Route element={<LayoutAccount><Outlet /></LayoutAccount>}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Empty layout for minimal pages */}
      <Route element={<LayoutEmpty><Outlet /></LayoutEmpty>}>
        <Route path="/print/:id" element={<PrintPage />} />
      </Route>
    </Routes>
  );
}
```

### 3. Dynamic Layout Selection

Use the LAYOUTS constant for dynamic layout selection:

```tsx
import { LAYOUTS, Layout } from '@abpjs/theme-basic';

function DynamicLayoutWrapper() {
  const { pathname } = useLocation();

  // Determine layout based on route
  const getLayout = () => {
    if (pathname.startsWith('/account')) return 'account';
    if (pathname.startsWith('/print')) return 'empty';
    return 'application';
  };

  const SelectedLayout = LAYOUTS.find(l => l.key === getLayout())?.component || Layout;

  return (
    <SelectedLayout>
      <Outlet />
    </SelectedLayout>
  );
}
```

## Layouts

### LayoutApplication

The main application layout with navigation, header, and footer.

```tsx
import { LayoutApplication } from '@abpjs/theme-basic';

function MainApp() {
  return (
    <LayoutApplication>
      <YourContent />
    </LayoutApplication>
  );
}
```

**Features:**
- Side navigation menu
- Top header with user menu
- Breadcrumbs
- Footer
- Responsive sidebar (collapsible on mobile)

### LayoutAccount

Centered layout for authentication pages.

```tsx
import { LayoutAccount } from '@abpjs/theme-basic';

function AuthPages() {
  return (
    <LayoutAccount>
      <LoginForm />
    </LayoutAccount>
  );
}
```

**Features:**
- Centered content
- Clean, minimal design
- Logo display
- Language selector

### LayoutEmpty

Minimal layout with no chrome.

```tsx
import { LayoutEmpty } from '@abpjs/theme-basic';

function PrintablePage() {
  return (
    <LayoutEmpty>
      <PrintableContent />
    </LayoutEmpty>
  );
}
```

**Features:**
- No header or footer
- Full-width content
- Ideal for printing or embedded views

## Components

### Profile

User profile management component.

```tsx
import { Profile } from '@abpjs/theme-basic';

function ProfilePage() {
  return (
    <div>
      <h1>My Profile</h1>
      <Profile />
    </div>
  );
}
```

### ChangePassword

Password change form component.

```tsx
import { ChangePassword } from '@abpjs/theme-basic';

function SecurityPage() {
  return (
    <div>
      <h1>Security Settings</h1>
      <ChangePassword onSuccess={() => alert('Password changed!')} />
    </div>
  );
}
```

## Hooks

### useLayoutContext

Access and modify layout state.

```tsx
import { useLayoutContext } from '@abpjs/theme-basic';

function SidebarToggle() {
  const { isSidebarOpen, toggleSidebar } = useLayoutContext();

  return (
    <button onClick={toggleSidebar}>
      {isSidebarOpen ? 'Close' : 'Open'} Sidebar
    </button>
  );
}
```

### useLayoutService

Access layout service for programmatic control.

```tsx
import { useLayoutService } from '@abpjs/theme-basic';

function LayoutController() {
  const layoutService = useLayoutService();

  const handleCollapse = () => {
    layoutService.collapseSidebar();
  };

  return <button onClick={handleCollapse}>Collapse</button>;
}
```

### useNavigationElements

Access and manage navigation items.

```tsx
import { useNavigationElements } from '@abpjs/theme-basic';

function NavigationMenu() {
  const { elements, addElement, removeElement } = useNavigationElements();

  return (
    <nav>
      {elements.map(item => (
        <NavLink key={item.id} to={item.path}>
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
}
```

## Navigation Configuration

### Adding Navigation Items

```tsx
import { useNavigationElements } from '@abpjs/theme-basic';

function ConfigureNavigation() {
  const { addElement } = useNavigationElements();

  useEffect(() => {
    addElement({
      id: 'dashboard',
      name: 'Dashboard',
      path: '/dashboard',
      icon: 'HomeIcon',
      order: 1,
      requiredPermission: 'MyApp.Dashboard',
    });

    addElement({
      id: 'users',
      name: 'User Management',
      path: '/users',
      icon: 'UsersIcon',
      order: 2,
      requiredPermission: 'AbpIdentity.Users',
      children: [
        {
          id: 'users-list',
          name: 'Users',
          path: '/users',
        },
        {
          id: 'roles-list',
          name: 'Roles',
          path: '/roles',
        },
      ],
    });
  }, []);

  return null;
}
```

### Navigation Element Structure

```typescript
interface NavigationElement {
  id: string;
  name: string;
  path: string;
  icon?: string;
  order?: number;
  requiredPermission?: string;
  visible?: boolean;
  children?: NavigationElement[];
}
```

## LAYOUTS Constant

The package exports a `LAYOUTS` constant for dynamic layout selection:

```tsx
import { LAYOUTS } from '@abpjs/theme-basic';

// LAYOUTS structure:
// [
//   { key: 'application', component: LayoutApplication },
//   { key: 'account', component: LayoutAccount },
//   { key: 'empty', component: LayoutEmpty },
// ]

function getLayoutByKey(key: string) {
  return LAYOUTS.find(l => l.key === key)?.component;
}
```

## Customization

### Theme Customization

Customize layouts using Chakra UI theming:

```tsx
import { extendTheme, ChakraProvider } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e3f2fd',
      100: '#bbdefb',
      // ... more shades
      500: '#2196f3',
      600: '#1e88e5',
    },
  },
  components: {
    // Customize layout components
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <LayoutProvider>
        {/* Your app */}
      </LayoutProvider>
    </ChakraProvider>
  );
}
```

### Custom Layout Components

Create your own layouts extending the base:

```tsx
import { Layout } from '@abpjs/theme-basic';
import { Box, Flex } from '@chakra-ui/react';

function CustomLayout({ children }) {
  return (
    <Layout>
      <Flex direction="column" minH="100vh">
        <CustomHeader />
        <Box flex="1" p={4}>
          {children}
        </Box>
        <CustomFooter />
      </Flex>
    </Layout>
  );
}
```

## Complete Example

Full application setup:

```tsx
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { CoreProvider } from '@abpjs/core';
import {
  LayoutProvider,
  LayoutApplication,
  LayoutAccount,
  Profile,
  ChangePassword,
} from '@abpjs/theme-basic';
import { LoginPage, RegisterPage } from '@abpjs/account';

const environment = {
  // Your ABP configuration
};

function App() {
  return (
    <ChakraProvider>
      <CoreProvider environment={environment}>
        <LayoutProvider>
          <BrowserRouter>
            <Routes>
              {/* Main application routes */}
              <Route element={<LayoutApplication><Outlet /></LayoutApplication>}>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/change-password" element={<ChangePassword />} />
              </Route>

              {/* Auth routes */}
              <Route element={<LayoutAccount><Outlet /></LayoutAccount>}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </LayoutProvider>
      </CoreProvider>
    </ChakraProvider>
  );
}

export default App;
```

## Related Packages

- [@abpjs/core](https://www.npmjs.com/package/@abpjs/core) - Core infrastructure (required)
- [@abpjs/theme-shared](https://www.npmjs.com/package/@abpjs/theme-shared) - Shared UI components (required)
- [@abpjs/account](https://www.npmjs.com/package/@abpjs/account) - Account management
- [@abpjs/permission-management](https://www.npmjs.com/package/@abpjs/permission-management) - Permission management
- [@abpjs/tenant-management](https://www.npmjs.com/package/@abpjs/tenant-management) - Tenant administration

## Contributing

This package is part of the [ABP React](https://github.com/anthropics/abp-react) monorepo. Contributions are welcome!

## License

LGPL-3.0 - See [LICENSE](https://github.com/anthropics/abp-react/blob/main/LICENSE) for details.

---

**[View Full Documentation](https://github.com/anthropics/abp-react)** | **[Report Issues](https://github.com/anthropics/abp-react/issues)**
