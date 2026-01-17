# @abpjs/tenant-management

> Multi-tenant management UI components for ABP Framework in React

[![npm version](https://img.shields.io/npm/v/@abpjs/tenant-management.svg)](https://www.npmjs.com/package/@abpjs/tenant-management)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

## Overview

`@abpjs/tenant-management` provides a complete tenant management interface for ABP-based multi-tenant SaaS applications in React. It enables administrators to create, update, delete, and manage tenants through an intuitive UI.

This package is a React translation of the original `@abp/ng.tenant-management` Angular package, bringing full multi-tenant management capabilities to React applications.

## Features

- **Tenant CRUD** - Create, read, update, and delete tenants
- **Tenant Modal** - Ready-to-use modal dialog for tenant management
- **Connection Strings** - Manage tenant-specific database connections
- **Feature Management** - Configure features per tenant
- **Permission Integration** - Seamlessly integrates with permission management
- **Chakra UI** - Beautiful, accessible components
- **TypeScript** - Full type safety with comprehensive definitions

## Installation

```bash
# Using npm
npm install @abpjs/tenant-management

# Using yarn
yarn add @abpjs/tenant-management

# Using pnpm
pnpm add @abpjs/tenant-management
```

### Required Dependencies

This package requires the following peer dependencies:

```bash
npm install @abpjs/core @abpjs/theme-shared @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

## Quick Start

### Basic Tenant Management

```tsx
import { useState, useEffect } from 'react';
import {
  TenantManagementModal,
  useTenantManagement
} from '@abpjs/tenant-management';
import {
  Table,
  Button,
  IconButton,
  useDisclosure
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';

function TenantManagementPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { tenants, getTenants, deleteTenant, isLoading } = useTenantManagement();
  const [selectedTenant, setSelectedTenant] = useState(null);

  useEffect(() => {
    getTenants();
  }, []);

  const handleEdit = (tenant) => {
    setSelectedTenant(tenant);
    onOpen();
  };

  const handleCreate = () => {
    setSelectedTenant(null);
    onOpen();
  };

  const handleDelete = async (tenant) => {
    if (confirm(`Delete tenant "${tenant.name}"?`)) {
      await deleteTenant(tenant.id);
      getTenants();
    }
  };

  return (
    <div>
      <Button leftIcon={<AddIcon />} onClick={handleCreate}>
        New Tenant
      </Button>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map(tenant => (
            <tr key={tenant.id}>
              <td>{tenant.name}</td>
              <td>
                <IconButton
                  icon={<EditIcon />}
                  onClick={() => handleEdit(tenant)}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  onClick={() => handleDelete(tenant)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <TenantManagementModal
        isOpen={isOpen}
        onClose={onClose}
        tenant={selectedTenant}
        onSave={() => {
          getTenants();
          onClose();
        }}
      />
    </div>
  );
}
```

### Creating a New Tenant

```tsx
import { TenantManagementModal } from '@abpjs/tenant-management';

function CreateTenantButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Create Tenant
      </Button>

      <TenantManagementModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={() => {
          console.log('Tenant created!');
          setIsOpen(false);
        }}
      />
    </>
  );
}
```

### Editing an Existing Tenant

```tsx
import { TenantManagementModal } from '@abpjs/tenant-management';

function EditTenantButton({ tenant }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Edit
      </Button>

      <TenantManagementModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        tenant={tenant}  // Pass existing tenant for edit mode
        onSave={() => {
          console.log('Tenant updated!');
          setIsOpen(false);
        }}
      />
    </>
  );
}
```

## Components

### TenantManagementModal

The main component for creating and editing tenants.

```tsx
import { TenantManagementModal } from '@abpjs/tenant-management';

<TenantManagementModal
  isOpen={isOpen}
  onClose={handleClose}
  tenant={selectedTenant}  // null for create, tenant object for edit
  onSave={handleSave}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls modal visibility |
| `onClose` | `() => void` | Callback when modal is closed |
| `tenant` | `Tenant \| null` | Tenant to edit, or null for create mode |
| `onSave` | `() => void` | Callback after tenant is saved |

## Hooks

### useTenantManagement

Hook for accessing tenant management functionality.

```tsx
import { useTenantManagement } from '@abpjs/tenant-management';

function TenantsPage() {
  const {
    tenants,           // Array of tenants
    isLoading,         // Loading state
    error,             // Error state
    getTenants,        // Fetch all tenants
    getTenant,         // Fetch single tenant by ID
    createTenant,      // Create new tenant
    updateTenant,      // Update existing tenant
    deleteTenant,      // Delete tenant
  } = useTenantManagement();

  useEffect(() => {
    getTenants();
  }, []);

  const handleCreate = async () => {
    await createTenant({
      name: 'New Tenant',
      adminEmailAddress: 'admin@newtenant.com',
      adminPassword: 'SecurePassword123!',
    });
    getTenants();
  };

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <TenantList tenants={tenants} />
      )}
    </div>
  );
}
```

## Services

### TenantManagementService

Service class for direct API interaction.

```tsx
import { TenantManagementService } from '@abpjs/tenant-management';

// Get all tenants
const tenants = await TenantManagementService.getList({
  filter: '',
  sorting: 'name',
  skipCount: 0,
  maxResultCount: 10,
});

// Get single tenant
const tenant = await TenantManagementService.get(tenantId);

// Create tenant
const newTenant = await TenantManagementService.create({
  name: 'Acme Corp',
  adminEmailAddress: 'admin@acme.com',
  adminPassword: 'SecurePassword123!',
});

// Update tenant
await TenantManagementService.update(tenantId, {
  name: 'Acme Corporation',
});

// Delete tenant
await TenantManagementService.delete(tenantId);

// Get default connection string
const connectionString = await TenantManagementService.getDefaultConnectionString(tenantId);

// Update default connection string
await TenantManagementService.updateDefaultConnectionString(tenantId, connectionString);
```

## Data Models

### Tenant

```typescript
interface Tenant {
  id: string;
  name: string;
  concurrencyStamp?: string;
}
```

### CreateTenantInput

```typescript
interface CreateTenantInput {
  name: string;
  adminEmailAddress: string;
  adminPassword: string;
  connectionStrings?: ConnectionStrings;
}
```

### UpdateTenantInput

```typescript
interface UpdateTenantInput {
  name: string;
  concurrencyStamp?: string;
}
```

## Multi-Tenancy Concepts

ABP Framework supports multi-tenancy out of the box. Key concepts:

### Tenant Isolation

Each tenant operates in isolation with:
- **Separate Database** - Each tenant can have its own database
- **Shared Database** - Tenants can share a database with data isolation
- **Hybrid** - Mix of dedicated and shared databases

### Connection Strings

Manage per-tenant database connections:

```tsx
import { TenantManagementService } from '@abpjs/tenant-management';

// Set tenant-specific connection string
await TenantManagementService.updateDefaultConnectionString(
  tenantId,
  'Server=tenant-db;Database=TenantDB;...'
);

// Clear connection string (use host's database)
await TenantManagementService.deleteDefaultConnectionString(tenantId);
```

## Complete Example

Full tenant management page:

```tsx
import { useState, useEffect } from 'react';
import { usePermission } from '@abpjs/core';
import {
  TenantManagementModal,
  useTenantManagement
} from '@abpjs/tenant-management';
import { PermissionManagementModal } from '@abpjs/permission-management';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  HStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, SettingsIcon } from '@chakra-ui/icons';

function TenantManagementPage() {
  const toast = useToast();
  const { hasPermission } = usePermission();

  // Tenant modal state
  const tenantModal = useDisclosure();
  const [selectedTenant, setSelectedTenant] = useState(null);

  // Permission modal state
  const permissionModal = useDisclosure();
  const [permissionTenant, setPermissionTenant] = useState(null);

  // Tenant management hook
  const {
    tenants,
    getTenants,
    deleteTenant,
    isLoading,
  } = useTenantManagement();

  // Permission checks
  const canCreate = hasPermission('AbpTenantManagement.Tenants.Create');
  const canEdit = hasPermission('AbpTenantManagement.Tenants.Update');
  const canDelete = hasPermission('AbpTenantManagement.Tenants.Delete');
  const canManageFeatures = hasPermission('AbpTenantManagement.Tenants.ManageFeatures');

  useEffect(() => {
    getTenants();
  }, []);

  const handleCreate = () => {
    setSelectedTenant(null);
    tenantModal.onOpen();
  };

  const handleEdit = (tenant) => {
    setSelectedTenant(tenant);
    tenantModal.onOpen();
  };

  const handleDelete = async (tenant) => {
    if (window.confirm(`Are you sure you want to delete "${tenant.name}"?`)) {
      try {
        await deleteTenant(tenant.id);
        toast({ title: 'Tenant deleted', status: 'success' });
        getTenants();
      } catch (error) {
        toast({ title: 'Failed to delete tenant', status: 'error' });
      }
    }
  };

  const handleManageFeatures = (tenant) => {
    setPermissionTenant(tenant);
    permissionModal.onOpen();
  };

  const handleSave = () => {
    getTenants();
    tenantModal.onClose();
    toast({ title: 'Tenant saved', status: 'success' });
  };

  return (
    <Box p={4}>
      <HStack justify="space-between" mb={4}>
        <h1>Tenant Management</h1>
        {canCreate && (
          <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleCreate}>
            New Tenant
          </Button>
        )}
      </HStack>

      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tenants.map(tenant => (
            <Tr key={tenant.id}>
              <Td>{tenant.name}</Td>
              <Td>
                <HStack spacing={2}>
                  {canEdit && (
                    <IconButton
                      aria-label="Edit"
                      icon={<EditIcon />}
                      size="sm"
                      onClick={() => handleEdit(tenant)}
                    />
                  )}
                  {canManageFeatures && (
                    <IconButton
                      aria-label="Manage Features"
                      icon={<SettingsIcon />}
                      size="sm"
                      onClick={() => handleManageFeatures(tenant)}
                    />
                  )}
                  {canDelete && (
                    <IconButton
                      aria-label="Delete"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(tenant)}
                    />
                  )}
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <TenantManagementModal
        isOpen={tenantModal.isOpen}
        onClose={tenantModal.onClose}
        tenant={selectedTenant}
        onSave={handleSave}
      />

      <PermissionManagementModal
        isOpen={permissionModal.isOpen}
        onClose={permissionModal.onClose}
        providerName="T"
        providerKey={permissionTenant?.id}
      />
    </Box>
  );
}

export default TenantManagementPage;
```

## Related Packages

- [@abpjs/core](https://www.npmjs.com/package/@abpjs/core) - Core infrastructure (required)
- [@abpjs/theme-shared](https://www.npmjs.com/package/@abpjs/theme-shared) - Shared UI components (required)
- [@abpjs/permission-management](https://www.npmjs.com/package/@abpjs/permission-management) - Permission management
- [@abpjs/account](https://www.npmjs.com/package/@abpjs/account) - Account management
- [@abpjs/theme-basic](https://www.npmjs.com/package/@abpjs/theme-basic) - Layout components

## Contributing

This package is part of the [ABP React](https://github.com/anthropics/abp-react) monorepo. Contributions are welcome!

## License

LGPL-3.0 - See [LICENSE](https://github.com/anthropics/abp-react/blob/main/LICENSE) for details.

---

**[View Full Documentation](https://github.com/anthropics/abp-react)** | **[Report Issues](https://github.com/anthropics/abp-react/issues)**
