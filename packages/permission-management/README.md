# @abpjs/permission-management

> Permission management UI components for ABP Framework in React

[![npm version](https://img.shields.io/npm/v/@abpjs/permission-management.svg)](https://www.npmjs.com/package/@abpjs/permission-management)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

## Overview

`@abpjs/permission-management` provides a complete permission management interface for ABP-based React applications. It allows administrators to view, grant, and revoke permissions for users, roles, and other permission providers through a user-friendly modal interface.

This package is a React translation of the original `@abp/ng.permission-management` Angular package, offering the same powerful permission management capabilities with modern React patterns.

## Features

- **Permission Modal** - Ready-to-use modal dialog for managing permissions
- **Role Permissions** - Manage permissions for roles
- **User Permissions** - Manage permissions for individual users
- **Permission Groups** - Organized permission display by groups
- **Bulk Operations** - Grant or revoke multiple permissions at once
- **Real-time Updates** - Instant UI feedback on permission changes
- **Chakra UI** - Beautiful, accessible components
- **TypeScript** - Full type safety with comprehensive definitions

## Installation

```bash
# Using npm
npm install @abpjs/permission-management

# Using yarn
yarn add @abpjs/permission-management

# Using pnpm
pnpm add @abpjs/permission-management
```

### Required Dependencies

This package requires the following peer dependencies:

```bash
npm install @abpjs/core @abpjs/theme-shared @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

## Quick Start

### Basic Usage with Permission Modal

```tsx
import { useState } from 'react';
import { PermissionManagementModal } from '@abpjs/permission-management';
import { Button } from '@chakra-ui/react';

function RoleManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const openPermissions = (role) => {
    setSelectedRole(role);
    setIsOpen(true);
  };

  return (
    <div>
      <Button onClick={() => openPermissions({ id: 'role-id', name: 'admin' })}>
        Manage Permissions
      </Button>

      <PermissionManagementModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        providerName="R"  // R for Role
        providerKey={selectedRole?.id}
      />
    </div>
  );
}
```

### Managing User Permissions

```tsx
import { PermissionManagementModal } from '@abpjs/permission-management';

function UserPermissions({ userId }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Edit User Permissions
      </Button>

      <PermissionManagementModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        providerName="U"  // U for User
        providerKey={userId}
      />
    </>
  );
}
```

## Components

### PermissionManagementModal

The main component for displaying and managing permissions.

```tsx
import { PermissionManagementModal } from '@abpjs/permission-management';

<PermissionManagementModal
  isOpen={isOpen}
  onClose={handleClose}
  providerName="R"
  providerKey="admin-role-id"
  onSave={handleSave}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls modal visibility |
| `onClose` | `() => void` | Callback when modal is closed |
| `providerName` | `string` | Permission provider type ("R" for Role, "U" for User) |
| `providerKey` | `string` | The identifier of the role or user |
| `onSave` | `() => void` | Optional callback after permissions are saved |

## Hooks

### usePermissionManagement

Hook for accessing permission management functionality programmatically.

```tsx
import { usePermissionManagement } from '@abpjs/permission-management';

function CustomPermissionUI() {
  const {
    permissions,
    isLoading,
    error,
    getPermissions,
    updatePermissions,
  } = usePermissionManagement();

  useEffect(() => {
    getPermissions({
      providerName: 'R',
      providerKey: 'admin',
    });
  }, []);

  const handleToggle = async (permissionName, isGranted) => {
    await updatePermissions({
      providerName: 'R',
      providerKey: 'admin',
      permissions: {
        [permissionName]: isGranted,
      },
    });
  };

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {permissions.groups.map(group => (
        <PermissionGroup
          key={group.name}
          group={group}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
```

## Services

### PermissionManagementService

Service class for direct API interaction.

```tsx
import { PermissionManagementService } from '@abpjs/permission-management';

// Get permissions for a role
const permissions = await PermissionManagementService.get({
  providerName: 'R',
  providerKey: 'admin-role-id',
});

// Update permissions
await PermissionManagementService.update({
  providerName: 'R',
  providerKey: 'admin-role-id',
  permissions: [
    { name: 'MyApp.Users.Create', isGranted: true },
    { name: 'MyApp.Users.Delete', isGranted: false },
  ],
});
```

## Permission Providers

ABP uses different provider types for different permission subjects:

| Provider | Key | Description |
|----------|-----|-------------|
| `R` | Role | Permissions for roles |
| `U` | User | Permissions for specific users |
| `C` | Client | Permissions for OAuth clients |

## Data Models

### PermissionGroup

```typescript
interface PermissionGroup {
  name: string;
  displayName: string;
  permissions: Permission[];
}
```

### Permission

```typescript
interface Permission {
  name: string;
  displayName: string;
  isGranted: boolean;
  allowedProviders: string[];
  grantedProviders: GrantedProvider[];
}
```

## Integration Example

Complete example integrating with role management:

```tsx
import { useState } from 'react';
import { usePermission } from '@abpjs/core';
import { PermissionManagementModal } from '@abpjs/permission-management';
import {
  Table,
  Button,
  IconButton,
  useDisclosure
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';

function RolesTable({ roles }) {
  const { hasPermission } = usePermission();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRole, setSelectedRole] = useState(null);

  const canManagePermissions = hasPermission('AbpIdentity.Roles.ManagePermissions');

  const handleManagePermissions = (role) => {
    setSelectedRole(role);
    onOpen();
  };

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>
                {canManagePermissions && (
                  <IconButton
                    aria-label="Manage permissions"
                    icon={<SettingsIcon />}
                    onClick={() => handleManagePermissions(role)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <PermissionManagementModal
        isOpen={isOpen}
        onClose={onClose}
        providerName="R"
        providerKey={selectedRole?.id}
      />
    </>
  );
}
```

## Customization

### Custom Permission Display

Create your own permission display component:

```tsx
import { usePermissionManagement } from '@abpjs/permission-management';
import { Checkbox, VStack, Heading } from '@chakra-ui/react';

function CustomPermissionList({ providerName, providerKey }) {
  const { permissions, updatePermissions } = usePermissionManagement();

  const handleChange = async (permissionName, isGranted) => {
    await updatePermissions({
      providerName,
      providerKey,
      permissions: [{ name: permissionName, isGranted }],
    });
  };

  return (
    <VStack align="stretch" spacing={4}>
      {permissions?.groups.map(group => (
        <div key={group.name}>
          <Heading size="sm">{group.displayName}</Heading>
          {group.permissions.map(permission => (
            <Checkbox
              key={permission.name}
              isChecked={permission.isGranted}
              onChange={(e) => handleChange(permission.name, e.target.checked)}
            >
              {permission.displayName}
            </Checkbox>
          ))}
        </div>
      ))}
    </VStack>
  );
}
```

## Related Packages

- [@abpjs/core](https://www.npmjs.com/package/@abpjs/core) - Core infrastructure (required)
- [@abpjs/theme-shared](https://www.npmjs.com/package/@abpjs/theme-shared) - Shared UI components (required)
- [@abpjs/account](https://www.npmjs.com/package/@abpjs/account) - Account management
- [@abpjs/tenant-management](https://www.npmjs.com/package/@abpjs/tenant-management) - Tenant administration
- [@abpjs/theme-basic](https://www.npmjs.com/package/@abpjs/theme-basic) - Layout components

## Contributing

This package is part of the [ABP React](https://github.com/abpjs/abp-react) monorepo. Contributions are welcome!

## License

LGPL-3.0 - See [LICENSE](https://github.com/abpjs/abp-react/blob/main/LICENSE) for details.

---

**[View Full Documentation](https://docs.abpjs.io/docs/packages/permission-management/overview)** | **[Report Issues](https://github.com/abpjs/abp-react/issues)** | **[View Source](https://github.com/abpjs/abp-react/tree/main/packages/permission-management)**
