# @abpjs/setting-management

> Setting management UI components for ABP Framework in React

[![npm version](https://img.shields.io/npm/v/@abpjs/setting-management.svg)](https://www.npmjs.com/package/@abpjs/setting-management)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

## Overview

`@abpjs/setting-management` provides a settings management page layout and tab management for ABP-based React applications. It allows organizing application settings into categorized tabs with a unified UI.

This package is a React translation of the original `@abp/ng.setting-management` Angular package.

## Features

- **Setting Tabs** - Register and manage setting tabs from different modules
- **Tab Layout** - Responsive sidebar layout with tab navigation
- **URL Sync** - Automatic tab selection based on current URL
- **Ordering** - Tabs sorted by configurable order property
- **TypeScript** - Full type safety with comprehensive definitions

## Installation

```bash
# Using npm
npm install @abpjs/setting-management

# Using yarn
yarn add @abpjs/setting-management

# Using pnpm
pnpm add @abpjs/setting-management
```

### Required Dependencies

This package requires the following peer dependencies:

```bash
npm install @abpjs/core @abpjs/theme-shared react-router-dom
```

## Quick Start

### Using the Setting Layout Component

```tsx
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { SettingLayout, useSettingManagement } from '@abpjs/setting-management';

function SettingsPage() {
  const { addSettings } = useSettingManagement();

  useEffect(() => {
    addSettings([
      { name: 'Account', order: 1, url: '/settings/account' },
      { name: 'Identity', order: 2, url: '/settings/identity' },
      { name: 'Tenant', order: 3, url: '/settings/tenant', requiredPolicy: 'AbpTenantManagement.Tenants' },
    ]);
  }, [addSettings]);

  return (
    <SettingLayout>
      <Outlet />
    </SettingLayout>
  );
}
```

### Using the Hook

```tsx
import { useSettingManagement } from '@abpjs/setting-management';

function SettingsMenu() {
  const {
    settings,
    selected,
    setSelected,
    addSetting,
    removeSetting,
  } = useSettingManagement();

  return (
    <nav>
      {settings.map(tab => (
        <button
          key={tab.name}
          onClick={() => setSelected(tab)}
          className={selected?.name === tab.name ? 'active' : ''}
        >
          {tab.name}
        </button>
      ))}
    </nav>
  );
}
```

### Registering Settings from Other Modules

```tsx
// In your account module
import { useEffect } from 'react';
import { useSettingManagement } from '@abpjs/setting-management';

function AccountModule() {
  const { addSetting } = useSettingManagement();

  useEffect(() => {
    addSetting({
      name: 'Account',
      order: 1,
      url: '/settings/account',
    });
  }, [addSetting]);

  return null;
}
```

## Components

### SettingLayout

Layout component for the settings management page with sidebar navigation.

```tsx
import { SettingLayout } from '@abpjs/setting-management';

<SettingLayout
  className="my-settings"
  onTabSelect={(tab) => console.log('Selected:', tab.name)}
>
  {/* Content renders here */}
</SettingLayout>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | No | Content to render in the main area |
| `className` | `string` | No | Additional CSS class for the container |
| `onTabSelect` | `(tab: SettingTab) => void` | No | Callback when a tab is selected |

## Hooks

### useSettingManagement

Hook for managing setting tabs and selection state.

```tsx
import { useSettingManagement } from '@abpjs/setting-management';

const {
  settings,       // All registered tabs (sorted by order)
  selected,       // Currently selected tab
  addSetting,     // Add a single setting tab
  addSettings,    // Add multiple setting tabs
  removeSetting,  // Remove a setting tab by name
  setSelected,    // Set the selected tab
  selectByName,   // Select a tab by name
  selectByUrl,    // Select a tab by URL
  clearSettings,  // Clear all registered settings
} = useSettingManagement();
```

## Services

### SettingManagementService

Service class for managing setting tabs (singleton pattern).

```tsx
import { getSettingManagementService } from '@abpjs/setting-management';

const service = getSettingManagementService();

// Add a setting tab
service.addSetting({
  name: 'My Settings',
  order: 10,
  url: '/settings/my',
});

// Get all settings
const allSettings = service.settings;

// Subscribe to changes
const unsubscribe = service.subscribe(() => {
  console.log('Settings changed!');
});
```

## Data Models

### SettingTab

The `SettingTab` interface is re-exported from `@abpjs/theme-shared`:

```typescript
import type { SettingTab } from '@abpjs/setting-management';

interface SettingTab {
  name: string;           // Display name of the tab
  order: number;          // Sort order (lower = higher priority)
  requiredPolicy?: string; // Required permission policy
  url?: string;           // URL/route for this tab
}
```

## Constants

### SETTING_MANAGEMENT_ROUTES

Default route configuration for the setting management module:

```tsx
import { SETTING_MANAGEMENT_ROUTES } from '@abpjs/setting-management';

// Use in your router configuration
const routes = [
  ...SETTING_MANAGEMENT_ROUTES.routes,
  // your other routes
];
```

## Router Setup Example

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingLayout } from '@abpjs/setting-management';
import AccountSettings from './AccountSettings';
import IdentitySettings from './IdentitySettings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/settings" element={<SettingsPage />}>
          <Route index element={<Navigate to="account" replace />} />
          <Route path="account" element={<AccountSettings />} />
          <Route path="identity" element={<IdentitySettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function SettingsPage() {
  const { addSettings } = useSettingManagement();

  useEffect(() => {
    addSettings([
      { name: 'Account', order: 1, url: '/settings/account' },
      { name: 'Identity', order: 2, url: '/settings/identity' },
    ]);
  }, [addSettings]);

  return (
    <SettingLayout>
      <Outlet />
    </SettingLayout>
  );
}
```

## Related Packages

- [@abpjs/core](https://www.npmjs.com/package/@abpjs/core) - Core infrastructure (required)
- [@abpjs/theme-shared](https://www.npmjs.com/package/@abpjs/theme-shared) - Shared UI components (required)
- [@abpjs/account](https://www.npmjs.com/package/@abpjs/account) - Account module (provides account settings)
- [@abpjs/identity](https://www.npmjs.com/package/@abpjs/identity) - Identity management

## Contributing

This package is part of the [ABP React](https://github.com/abpjs/abp-react) monorepo. Contributions are welcome!

## License

LGPL-3.0 - See [LICENSE](https://github.com/abpjs/abp-react/blob/main/LICENSE) for details.

---

**[View Full Documentation](https://docs.abpjs.io/docs/packages/setting-management/overview)** | **[Report Issues](https://github.com/abpjs/abp-react/issues)** | **[View Source](https://github.com/abpjs/abp-react/tree/main/packages/setting-management)**
