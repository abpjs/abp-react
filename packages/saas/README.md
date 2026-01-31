# @abpjs/saas

> SaaS tenant and edition management UI components for ABP Framework in React

[![npm version](https://img.shields.io/npm/v/@abpjs/saas.svg)](https://www.npmjs.com/package/@abpjs/saas)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

## Overview

`@abpjs/saas` provides SaaS (Software as a Service) management components for ABP-based React applications. It includes tenant management, edition management, and subscription features for multi-tenant applications.

This package is a React translation of the original `@volo/abp.ng.saas` Angular package.

## Features

- **Tenant Management** - Create, read, update, and delete tenants
- **Edition Management** - Create, read, update, and delete editions
- **Feature Management** - Configure features per tenant/edition
- **Connection Strings** - Manage tenant database connection strings
- **Tenant Activation** - Enable/disable tenants
- **Pagination** - Built-in pagination for all list views
- **Search & Filter** - Filter tenants and editions by name
- **Chakra UI** - Beautiful, accessible components
- **TypeScript** - Full type safety with comprehensive definitions

## Installation

```bash
# Using npm
npm install @abpjs/saas

# Using yarn
yarn add @abpjs/saas

# Using pnpm
pnpm add @abpjs/saas
```

### Required Dependencies

This package requires the following peer dependencies:

```bash
npm install @abpjs/core @abpjs/theme-shared @abpjs/feature-management @chakra-ui/react @emotion/react react-router-dom
```

## Quick Start

### Using Pre-built Components

```tsx
import { TenantsComponent, EditionsComponent } from '@abpjs/saas';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

function SaaSManagement() {
  return (
    <Tabs>
      <TabList>
        <Tab>Tenants</Tab>
        <Tab>Editions</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <TenantsComponent
            onTenantCreated={(tenant) => console.log('Tenant created:', tenant)}
            onTenantDeleted={(id) => console.log('Tenant deleted:', id)}
          />
        </TabPanel>
        <TabPanel>
          <EditionsComponent
            onEditionCreated={(edition) => console.log('Edition created:', edition)}
            onEditionDeleted={(id) => console.log('Edition deleted:', id)}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
```

### Using Hooks for Custom UI

```tsx
import { useTenants, useEditions } from '@abpjs/saas';
import { useEffect } from 'react';

function CustomSaaSView() {
  const { tenants, fetchTenants } = useTenants();
  const { editions, fetchEditions } = useEditions();

  useEffect(() => {
    fetchTenants();
    fetchEditions();
  }, [fetchTenants, fetchEditions]);

  return (
    <div>
      <h2>Tenants: {tenants.length}</h2>
      <h2>Editions: {editions.length}</h2>
    </div>
  );
}
```

## Components

### TenantsComponent

Complete tenant management component with table, search, and modals.

```tsx
import { TenantsComponent } from '@abpjs/saas';

<TenantsComponent
  onTenantCreated={(tenant) => console.log('Created:', tenant)}
  onTenantUpdated={(tenant) => console.log('Updated:', tenant)}
  onTenantDeleted={(id) => console.log('Deleted:', id)}
/>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onTenantCreated` | `(tenant: Tenant) => void` | No | Callback when tenant is created |
| `onTenantUpdated` | `(tenant: Tenant) => void` | No | Callback when tenant is updated |
| `onTenantDeleted` | `(id: string) => void` | No | Callback when tenant is deleted |

**Features:**
- Tenant table with actions menu
- Search/filter by tenant name
- Pagination controls
- Create/Edit modal with tabs for tenant info and connection strings
- Edition assignment
- Tenant activation/deactivation
- Feature management integration
- Delete confirmation dialog

### EditionsComponent

Complete edition management component.

```tsx
import { EditionsComponent } from '@abpjs/saas';

<EditionsComponent
  onEditionCreated={(edition) => console.log('Created:', edition)}
  onEditionUpdated={(edition) => console.log('Updated:', edition)}
  onEditionDeleted={(id) => console.log('Deleted:', id)}
/>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onEditionCreated` | `(edition: Edition) => void` | No | Callback when edition is created |
| `onEditionUpdated` | `(edition: Edition) => void` | No | Callback when edition is updated |
| `onEditionDeleted` | `(id: string) => void` | No | Callback when edition is deleted |

**Features:**
- Edition table with actions menu
- Search/filter by edition name
- Create/Edit modal
- Feature management integration
- Delete confirmation dialog

## Hooks

### useTenants

Hook for managing tenants with full CRUD and pagination support.

```tsx
import { useTenants } from '@abpjs/saas';

const {
  tenants,            // Array of tenants
  totalCount,         // Total tenant count
  selectedTenant,     // Currently selected tenant
  isLoading,          // Loading state
  error,              // Error message
  pageQuery,          // Current pagination/filter params
  fetchTenants,       // Fetch tenants with optional params
  getTenantById,      // Get single tenant
  createTenant,       // Create new tenant
  updateTenant,       // Update existing tenant
  deleteTenant,       // Delete tenant
  setSelectedTenant,  // Set the selected tenant
  setPageQuery,       // Update pagination params
  reset,              // Reset all state
} = useTenants();
```

### useEditions

Hook for managing editions with full CRUD support.

```tsx
import { useEditions } from '@abpjs/saas';

const {
  editions,           // Array of editions
  totalCount,         // Total edition count
  selectedEdition,    // Currently selected edition
  isLoading,          // Loading state
  error,              // Error message
  fetchEditions,      // Fetch all editions
  getEditionById,     // Get single edition
  createEdition,      // Create new edition
  updateEdition,      // Update existing edition
  deleteEdition,      // Delete edition
  setSelectedEdition, // Set the selected edition
  reset,              // Reset all state
} = useEditions();
```

## Services

### SaaSService

Service class for SaaS API operations.

```tsx
import { SaaSService } from '@abpjs/saas';
import { useRestService } from '@abpjs/core';

function MyComponent() {
  const restService = useRestService();
  const service = new SaaSService(restService);

  // Tenant operations
  await service.getTenants({ maxResultCount: 10, skipCount: 0 });
  await service.getTenantById(tenantId);
  await service.createTenant(tenantData);
  await service.updateTenant(tenantId, tenantData);
  await service.deleteTenant(tenantId);
  await service.getDefaultConnectionString(tenantId);
  await service.updateDefaultConnectionString(tenantId, connectionString);

  // Edition operations
  await service.getEditions();
  await service.getEditionById(editionId);
  await service.createEdition(editionData);
  await service.updateEdition(editionId, editionData);
  await service.deleteEdition(editionId);
}
```

## Data Models

### Tenant

```typescript
interface Tenant {
  id: string;
  name: string;
  editionId: string;
  editionName: string;
  concurrencyStamp: string;
  isActive: boolean;
  activationState: TenantActivationState;
  activationEndDate: string;
}

enum TenantActivationState {
  Active = 0,
  ActiveWithLimitedTime = 1,
  Passive = 2,
}
```

### Edition

```typescript
interface Edition {
  id: string;
  displayName: string;
}

interface EditionCreateDto {
  displayName: string;
}

interface EditionUpdateDto {
  displayName: string;
}
```

### Tenant Connection String

```typescript
interface TenantConnectionString {
  name: string;
  value: string;
}
```

## Constants

### SAAS_ROUTES

Default route configuration for the SaaS module:

```tsx
import { SAAS_ROUTES } from '@abpjs/saas';

// Use in your router configuration
const routes = [
  ...SAAS_ROUTES.routes,
  // your other routes
];
```

## Router Setup Example

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TenantsComponent, EditionsComponent } from '@abpjs/saas';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/saas">
          <Route index element={<Navigate to="tenants" replace />} />
          <Route path="tenants" element={<TenantsComponent />} />
          <Route path="editions" element={<EditionsComponent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

## ABP Permissions

This package respects ABP's SaaS permissions:

| Permission | Description |
|------------|-------------|
| `Saas.Tenants` | View tenants |
| `Saas.Tenants.Create` | Create tenants |
| `Saas.Tenants.Update` | Update tenants |
| `Saas.Tenants.Delete` | Delete tenants |
| `Saas.Tenants.ManageFeatures` | Manage tenant features |
| `Saas.Tenants.ManageConnectionStrings` | Manage connection strings |
| `Saas.Editions` | View editions |
| `Saas.Editions.Create` | Create editions |
| `Saas.Editions.Update` | Update editions |
| `Saas.Editions.Delete` | Delete editions |
| `Saas.Editions.ManageFeatures` | Manage edition features |

## Related Packages

- [@abpjs/core](https://www.npmjs.com/package/@abpjs/core) - Core infrastructure (required)
- [@abpjs/theme-shared](https://www.npmjs.com/package/@abpjs/theme-shared) - Shared UI components (required)
- [@abpjs/feature-management](https://www.npmjs.com/package/@abpjs/feature-management) - Feature management (required)
- [@abpjs/tenant-management](https://www.npmjs.com/package/@abpjs/tenant-management) - Basic tenant management
- [@abpjs/identity-pro](https://www.npmjs.com/package/@abpjs/identity-pro) - Identity Pro features
- [@abpjs/audit-logging](https://www.npmjs.com/package/@abpjs/audit-logging) - Audit logging

## Contributing

This package is part of the [ABP React](https://github.com/abpjs/abp-react) monorepo. Contributions are welcome!

## License

LGPL-3.0 - See [LICENSE](https://github.com/abpjs/abp-react/blob/main/LICENSE) for details.

---

**[View Full Documentation](https://docs.abpjs.io/docs/packages/saas/overview)** | **[Report Issues](https://github.com/abpjs/abp-react/issues)** | **[View Source](https://github.com/abpjs/abp-react/tree/main/packages/saas)**
