# @abpjs/theme-basic

> Basic layout components for ABP Framework in React

[![npm version](https://img.shields.io/npm/v/@abpjs/theme-basic.svg)](https://www.npmjs.com/package/@abpjs/theme-basic)
[![documentation](https://img.shields.io/badge/docs-abpjs.io-blue.svg)](https://docs.abpjs.io/docs/packages/theme-basic/overview)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

## Overview

`@abpjs/theme-basic` provides the foundational layout system for ABP-based React applications. It includes multiple pre-built layouts for different sections of your application - from full application layouts with navigation to minimal account page layouts.

This package is a React translation of the original `@abp/ng.theme.basic` Angular package, bringing the same flexible layout system to React developers.

## Features

- **Multiple Layouts** - Application, Account, and Empty layouts
- **Dynamic Layout System** - Switch layouts based on routes
- **Navigation Management** - Configurable navigation elements with icons and badges
- **User Profile** - Built-in profile and password change components
- **Responsive Design** - Mobile-friendly layouts with sidebar and drawer navigation
- **RTL Support** - Full right-to-left support for Arabic, Hebrew, Persian, and other RTL languages
- **Search** - Built-in navigation search to filter menu items
- **Logo Customization** - Customize logo via props without modifying source code
- **Chakra UI v3** - Beautiful, accessible components with modern patterns
- **Color Mode** - Built-in light/dark theme support (opt-in)
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
npm install @abpjs/core @abpjs/theme-shared @chakra-ui/react @emotion/react lucide-react react-router-dom react-hook-form
```

> **Note:** Chakra UI v3 no longer requires `@chakra-ui/icons`, `@emotion/styled`, or `framer-motion` as peer dependencies.

## Quick Start

### 1. Setup the Theme Provider

Wrap your application with the ThemeBasicProvider:

```tsx
import { ThemeBasicProvider } from '@abpjs/theme-basic';
import { CoreProvider } from '@abpjs/core';

function App() {
  return (
    <CoreProvider environment={environment}>
      <ThemeBasicProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeBasicProvider>
    </CoreProvider>
  );
}
```

> **Note:** `ThemeBasicProvider` includes Chakra's provider internally (via `ThemeSharedProvider`), so you don't need to wrap with `ChakraProvider` separately.

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

User profile management component (modal-based).

```tsx
import { Profile } from '@abpjs/theme-basic';
import { useState } from 'react';

function ProfileButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>My Profile</button>
      <Profile visible={isOpen} onVisibleChange={setIsOpen} />
    </>
  );
}
```

### ChangePassword

Password change form component (modal-based).

```tsx
import { ChangePassword } from '@abpjs/theme-basic';
import { useState } from 'react';

function SecurityButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Change Password</button>
      <ChangePassword visible={isOpen} onVisibleChange={setIsOpen} />
    </>
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
  const elements = useNavigationElements();

  return (
    <nav>
      {elements.map(item => (
        <NavLink key={item.name} to={item.path}>
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
import { useLayoutService } from '@abpjs/theme-basic';

function ConfigureNavigation() {
  const layoutService = useLayoutService();

  useEffect(() => {
    layoutService.addNavigationElement({
      name: 'Dashboard',
      element: <DashboardLink />,
      order: 1,
    });

    layoutService.addNavigationElement({
      name: 'Users',
      element: <UsersLink />,
      order: 2,
    });
  }, []);

  return null;
}
```

### Navigation Element Structure

```typescript
interface NavigationElement {
  name: string;
  element: ReactNode;
  order?: number;
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

### Theme Customization with Chakra v3

Customize layouts using `defineConfig`:

```tsx
import { ThemeBasicProvider, defineConfig } from '@abpjs/theme-basic';

const customTheme = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e3f2fd' },
          100: { value: '#bbdefb' },
          500: { value: '#2196f3' },
          600: { value: '#1e88e5' },
          // ... more shades
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: '{colors.brand.500}' },
          contrast: { value: 'white' },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeBasicProvider themeOverrides={customTheme}>
      {/* Your app */}
    </ThemeBasicProvider>
  );
}
```

### Color Mode (Dark/Light Theme)

Enable color mode support:

```tsx
import { ThemeBasicProvider } from '@abpjs/theme-basic';

function App() {
  return (
    <ThemeBasicProvider
      enableColorMode={true}
      defaultColorMode="light" // 'light' | 'dark' | 'system'
    >
      {/* Your app */}
    </ThemeBasicProvider>
  );
}
```

### Custom Layout Components

Create your own layouts extending the base:

```tsx
import { LayoutBase } from '@abpjs/theme-basic';
import { Box, Flex } from '@chakra-ui/react';

function CustomLayout({ children }) {
  return (
    <LayoutBase>
      <Flex direction="column" minH="100vh">
        <CustomHeader />
        <Box flex="1" p={4}>
          {children}
        </Box>
        <CustomFooter />
      </Flex>
    </LayoutBase>
  );
}
```

## ThemeBasicProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Child components |
| `renderToasts` | `boolean` | `true` | Render ToastContainer |
| `renderConfirmation` | `boolean` | `true` | Render ConfirmationDialog |
| `themeOverrides` | `ThemeOverride` | - | Custom theme configuration |
| `toastPosition` | `string` | `'bottom-right'` | Toast position |
| `enableColorMode` | `boolean` | `false` | Enable dark/light mode |
| `defaultColorMode` | `'light' \| 'dark' \| 'system'` | `'light'` | Default color mode |
| `logo` | `ReactNode` | - | Custom logo component |
| `logoIcon` | `ReactNode` | - | Custom logo icon (for collapsed states) |
| `appName` | `string` | - | Application name for logo text |
| `logoLink` | `string` | `'/'` | Link destination when clicking logo |

## Logo Customization

Customize the application logo via ThemeBasicProvider props:

```tsx
import { ThemeBasicProvider } from '@abpjs/theme-basic';

function App() {
  return (
    <ThemeBasicProvider
      logo={<img src="/my-logo.svg" alt="My App" />}
      logoIcon={<img src="/my-icon.svg" alt="Icon" />}
      appName="My Application"
      logoLink="/"
    >
      {/* Your app */}
    </ThemeBasicProvider>
  );
}
```

## Route Icons and Badges

Define icons and badges directly on your routes:

```tsx
import { LuHome, LuUsers, LuSettings, LuListTodo } from 'react-icons/lu';

const routes = [
  {
    name: 'Home',
    path: '/',
    icon: <LuHome />,
  },
  {
    name: 'Tasks',
    path: '/tasks',
    icon: <LuListTodo />,
    badge: 5,                    // Shows "5" badge
    badgeColorPalette: 'red',   // Badge color (default: 'gray')
  },
  {
    name: 'Messages',
    path: '/messages',
    badge: '50+',               // Can be string or number
    badgeColorPalette: 'blue',
  },
  {
    name: 'Admin',
    path: '/admin',
    icon: <LuSettings />,
    children: [
      {
        name: 'Users',
        path: '/admin/users',
        icon: <LuUsers />,
        badge: 'New',
      },
    ],
  },
];
```

## RTL (Right-to-Left) Support

The layout automatically supports RTL languages. When a user switches to Arabic, Hebrew, Persian, or other RTL languages:

- Sidebar moves to the right side
- Text alignment flips
- Icons and navigation elements reposition correctly
- Menus open in the appropriate direction

No additional configuration needed - RTL is detected automatically from the selected language.

## Complete Example

Full application setup:

```tsx
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { CoreProvider } from '@abpjs/core';
import {
  ThemeBasicProvider,
  LayoutApplication,
  LayoutAccount,
  Profile,
  ChangePassword,
  defineConfig,
} from '@abpjs/theme-basic';
import { LoginPage, RegisterPage } from '@abpjs/account';

const environment = {
  // Your ABP configuration
};

// Optional: Custom theme
const customTheme = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          500: { value: '#6366f1' },
        },
      },
    },
  },
});

function App() {
  return (
    <CoreProvider environment={environment}>
      <ThemeBasicProvider
        themeOverrides={customTheme}
        enableColorMode={true}
      >
        <BrowserRouter>
          <Routes>
            {/* Main application routes */}
            <Route element={<LayoutApplication><Outlet /></LayoutApplication>}>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* Auth routes */}
            <Route element={<LayoutAccount><Outlet /></LayoutAccount>}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeBasicProvider>
    </CoreProvider>
  );
}

export default App;
```

## Migration from Chakra UI v2

If you're upgrading from a previous version that used Chakra UI v2:

### Key Changes

1. **No separate ChakraProvider** - `ThemeBasicProvider` now includes it
2. **Theme configuration** - Use `defineConfig()` instead of `extendTheme()`
3. **Dependencies** - Remove `@chakra-ui/icons`, `@emotion/styled`, `framer-motion`; add `lucide-react`
4. **Color tokens** - Use `{ value: '#color' }` format in theme tokens
5. **Boolean props** - `isDisabled` → `disabled`, `isLoading` → `loading`
6. **Color scheme** - `colorScheme` → `colorPalette`
7. **Icons** - Use `lucide-react` instead of `@chakra-ui/icons`

### Example Migration

```tsx
// Before (Chakra v2)
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ThemeBasicProvider } from '@abpjs/theme-basic';

const theme = extendTheme({
  colors: { brand: { 500: '#2196f3' } },
});

<ChakraProvider theme={theme}>
  <ThemeBasicProvider>
    <App />
  </ThemeBasicProvider>
</ChakraProvider>

// After (Chakra v3)
import { ThemeBasicProvider, defineConfig } from '@abpjs/theme-basic';

const customTheme = defineConfig({
  theme: {
    tokens: {
      colors: { brand: { 500: { value: '#2196f3' } } },
    },
  },
});

<ThemeBasicProvider themeOverrides={customTheme}>
  <App />
</ThemeBasicProvider>
```

## Documentation

For comprehensive documentation, visit [docs.abpjs.io](https://docs.abpjs.io):

- **[Package Documentation](https://docs.abpjs.io/docs/packages/theme-basic/overview)** - Full API reference and examples
- **[Layouts](https://docs.abpjs.io/docs/packages/theme-basic/layouts)** - Layout components guide
- **[Navigation](https://docs.abpjs.io/docs/packages/theme-basic/navigation)** - Navigation configuration
- **[Profile](https://docs.abpjs.io/docs/packages/theme-basic/profile)** - Profile and password components
- **[Getting Started](https://docs.abpjs.io/docs/getting-started/installation)** - Installation and setup guide
- **[All Packages](https://docs.abpjs.io/docs/)** - Browse all ABP React packages

## Related Packages

- [@abpjs/core](https://www.npmjs.com/package/@abpjs/core) - Core infrastructure (required)
- [@abpjs/theme-shared](https://www.npmjs.com/package/@abpjs/theme-shared) - Shared UI components (required)
- [@abpjs/account](https://www.npmjs.com/package/@abpjs/account) - Account management
- [@abpjs/permission-management](https://www.npmjs.com/package/@abpjs/permission-management) - Permission management
- [@abpjs/tenant-management](https://www.npmjs.com/package/@abpjs/tenant-management) - Tenant administration

## Contributing

This package is part of the [ABP React](https://github.com/abpjs/abp-react) monorepo. Contributions are welcome!

## License

LGPL-3.0 - See [LICENSE](https://github.com/abpjs/abp-react/blob/main/LICENSE) for details.

---

**[View Full Documentation](https://docs.abpjs.io/docs/packages/theme-basic/overview)** | **[Report Issues](https://github.com/abpjs/abp-react/issues)**
