# @abpjs/identity

> User and role management UI components for ABP Framework in React

[![npm version](https://img.shields.io/npm/v/@abpjs/identity.svg)](https://www.npmjs.com/package/@abpjs/identity)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

## Overview

`@abpjs/identity` provides a complete identity management interface for ABP-based React applications. It includes comprehensive user and role management with CRUD operations, role assignment, permission management integration, and pagination support.

This package is a React translation of the original `@abp/ng.identity` Angular package, bringing full identity management capabilities to React applications.

## Features

- **User Management** - Create, read, update, and delete users
- **Role Management** - Create, read, update, and delete roles
- **Role Assignment** - Assign roles to users with checkbox interface
- **Permission Integration** - Seamlessly integrates with permission management
- **Pagination** - Built-in pagination for user lists
- **Search & Filter** - Filter users and roles by name
- **Localization** - Full i18n support using ABP localization
- **Chakra UI** - Beautiful, accessible components
- **TypeScript** - Full type safety with comprehensive definitions

## Installation

```bash
# Using npm
npm install @abpjs/identity

# Using yarn
yarn add @abpjs/identity

# Using pnpm
pnpm add @abpjs/identity
```

### Required Dependencies

This package requires the following peer dependencies:

```bash
npm install @abpjs/core @abpjs/theme-shared @abpjs/permission-management @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

## Quick Start

### Using Pre-built Components

The easiest way to add identity management to your app:

```tsx
import { RolesComponent, UsersComponent } from '@abpjs/identity';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

function IdentityManagement() {
  return (
    <Tabs>
      <TabList>
        <Tab>Users</Tab>
        <Tab>Roles</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <UsersComponent
            onUserCreated={(user) => console.log('User created:', user)}
            onUserDeleted={(id) => console.log('User deleted:', id)}
          />
        </TabPanel>
        <TabPanel>
          <RolesComponent
            onRoleCreated={(role) => console.log('Role created:', role)}
            onRoleDeleted={(id) => console.log('Role deleted:', id)}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
```

### Using Hooks for Custom UI

Build your own identity UI using the provided hooks:

```tsx
import { useUsers, useRoles, Identity } from '@abpjs/identity';
import { useEffect } from 'react';

function CustomUsersPage() {
  const {
    users,
    totalCount,
    isLoading,
    fetchUsers,
    createUser,
    deleteUser,
  } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (data: Identity.UserSaveRequest) => {
    const result = await createUser(data);
    if (result.success) {
      console.log('User created successfully!');
    }
  };

  return (
    <div>
      <h1>Users ({totalCount})</h1>
      {users.map(user => (
        <div key={user.id}>
          <span>{user.userName}</span>
          <span>{user.email}</span>
          <button onClick={() => deleteUser(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## Components

### UsersComponent

Complete user management component with table, search, pagination, and modals.

```tsx
import { UsersComponent } from '@abpjs/identity';

<UsersComponent
  onUserCreated={(user) => console.log('Created:', user)}
  onUserUpdated={(user) => console.log('Updated:', user)}
  onUserDeleted={(id) => console.log('Deleted:', id)}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `onUserCreated` | `(user: UserItem) => void` | Callback when user is created |
| `onUserUpdated` | `(user: UserItem) => void` | Callback when user is updated |
| `onUserDeleted` | `(id: string) => void` | Callback when user is deleted |

**Features:**
- User table with actions menu
- Search/filter by username
- Pagination controls
- Create/Edit modal with tabs for user info and role assignment
- Permission management integration
- Delete confirmation dialog

### RolesComponent

Complete role management component with table, search, and modals.

```tsx
import { RolesComponent } from '@abpjs/identity';

<RolesComponent
  onRoleCreated={(role) => console.log('Created:', role)}
  onRoleUpdated={(role) => console.log('Updated:', role)}
  onRoleDeleted={(id) => console.log('Deleted:', id)}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `onRoleCreated` | `(role: RoleItem) => void` | Callback when role is created |
| `onRoleUpdated` | `(role: RoleItem) => void` | Callback when role is updated |
| `onRoleDeleted` | `(id: string) => void` | Callback when role is deleted |

**Features:**
- Role table with actions menu
- Search/filter by role name
- Create/Edit modal with isDefault and isPublic options
- Permission management integration
- Static role protection (cannot delete static roles)
- Delete confirmation dialog

## Hooks

### useUsers

Hook for managing users with full CRUD and pagination support.

```tsx
import { useUsers } from '@abpjs/identity';

function MyUsersPage() {
  const {
    users,              // Array of users
    totalCount,         // Total user count
    selectedUser,       // Currently selected user
    selectedUserRoles,  // Roles of selected user
    isLoading,          // Loading state
    error,              // Error message
    pageQuery,          // Current pagination params
    fetchUsers,         // Fetch users with optional params
    getUserById,        // Get single user
    getUserRoles,       // Get user's roles
    createUser,         // Create new user
    updateUser,         // Update existing user
    deleteUser,         // Delete user
    setSelectedUser,    // Set selected user
    setPageQuery,       // Update pagination params
    reset,              // Reset all state
  } = useUsers();

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Pagination example
  const handlePageChange = (page: number) => {
    const newQuery = {
      ...pageQuery,
      skipCount: page * pageQuery.maxResultCount,
    };
    setPageQuery(newQuery);
    fetchUsers(newQuery);
  };

  // Create user example
  const handleCreate = async () => {
    const result = await createUser({
      userName: 'newuser',
      email: 'user@example.com',
      password: 'SecurePassword123!',
      name: 'John',
      surname: 'Doe',
      phoneNumber: '',
      lockoutEnabled: true,
      twoFactorEnabled: false,
      roleNames: ['admin'],
    });

    if (result.success) {
      console.log('User created!');
    } else {
      console.error(result.error);
    }
  };
}
```

### useRoles

Hook for managing roles with full CRUD support.

```tsx
import { useRoles } from '@abpjs/identity';

function MyRolesPage() {
  const {
    roles,            // Array of roles
    totalCount,       // Total role count
    selectedRole,     // Currently selected role
    isLoading,        // Loading state
    error,            // Error message
    fetchRoles,       // Fetch all roles
    getRoleById,      // Get single role
    createRole,       // Create new role
    updateRole,       // Update existing role
    deleteRole,       // Delete role
    setSelectedRole,  // Set selected role
    reset,            // Reset all state
  } = useRoles();

  // Fetch roles on mount
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Create role example
  const handleCreate = async () => {
    const result = await createRole({
      name: 'Manager',
      isDefault: false,
      isPublic: true,
    });

    if (result.success) {
      console.log('Role created!');
    }
  };
}
```

### useIdentity

Combined hook for managing both users and roles.

```tsx
import { useIdentity } from '@abpjs/identity';

function IdentityDashboard() {
  const { roles, users, fetchRoles, fetchUsers } = useIdentity();

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Users: {users.length}</h2>
      <h2>Roles: {roles.length}</h2>
    </div>
  );
}
```

## Services

### IdentityService

Service class for direct API interaction.

```tsx
import { IdentityService } from '@abpjs/identity';
import { useRestService } from '@abpjs/core';

function MyComponent() {
  const restService = useRestService();
  const identityService = new IdentityService(restService);

  // Role operations
  const roles = await identityService.getRoles();
  const role = await identityService.getRoleById(roleId);
  await identityService.createRole({ name: 'Editor', isDefault: false, isPublic: true });
  await identityService.updateRole(roleId, { name: 'Senior Editor', isDefault: false, isPublic: true });
  await identityService.deleteRole(roleId);

  // User operations
  const users = await identityService.getUsers({ maxResultCount: 10, skipCount: 0 });
  const user = await identityService.getUserById(userId);
  const userRoles = await identityService.getUserRoles(userId);
  await identityService.createUser({ userName: 'john', email: 'john@example.com', password: 'Pass123!', ... });
  await identityService.updateUser(userId, { ... });
  await identityService.deleteUser(userId);
}
```

## Data Models

### Identity Namespace

All identity types are exported under the `Identity` namespace:

```typescript
import { Identity } from '@abpjs/identity';

// State shape
interface Identity.State {
  roles: RoleResponse;
  users: UserResponse;
  selectedRole: RoleItem;
  selectedUser: UserItem;
  selectedUserRoles: RoleItem[];
}

// Role types
interface Identity.RoleItem {
  id: string;
  name: string;
  isDefault: boolean;
  isPublic: boolean;
  isStatic: boolean;
  concurrencyStamp: string;
}

interface Identity.RoleSaveRequest {
  name: string;
  isDefault: boolean;
  isPublic: boolean;
}

// User types
interface Identity.UserItem {
  id: string;
  tenantId: string;
  userName: string;
  name: string;
  surname: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnabled: boolean;
  isLockedOut: boolean;
  concurrencyStamp: string;
}

interface Identity.UserSaveRequest {
  userName: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  password: string;
  lockoutEnabled: boolean;
  twoFactorEnabled: boolean;
  roleNames: string[];
}
```

## Integration Example

Complete identity management page:

```tsx
import { useState } from 'react';
import { usePermission } from '@abpjs/core';
import { RolesComponent, UsersComponent } from '@abpjs/identity';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  useToast,
} from '@chakra-ui/react';

function IdentityManagementPage() {
  const toast = useToast();
  const { hasPermission } = usePermission();

  const canViewUsers = hasPermission('AbpIdentity.Users');
  const canViewRoles = hasPermission('AbpIdentity.Roles');

  const handleUserCreated = (user) => {
    toast({ title: `User ${user.userName} created`, status: 'success' });
  };

  const handleUserDeleted = () => {
    toast({ title: 'User deleted', status: 'success' });
  };

  const handleRoleCreated = (role) => {
    toast({ title: `Role ${role.name} created`, status: 'success' });
  };

  const handleRoleDeleted = () => {
    toast({ title: 'Role deleted', status: 'success' });
  };

  return (
    <Box p={4}>
      <Heading mb={4}>Identity Management</Heading>

      <Tabs>
        <TabList>
          {canViewUsers && <Tab>Users</Tab>}
          {canViewRoles && <Tab>Roles</Tab>}
        </TabList>

        <TabPanels>
          {canViewUsers && (
            <TabPanel>
              <UsersComponent
                onUserCreated={handleUserCreated}
                onUserDeleted={handleUserDeleted}
              />
            </TabPanel>
          )}
          {canViewRoles && (
            <TabPanel>
              <RolesComponent
                onRoleCreated={handleRoleCreated}
                onRoleDeleted={handleRoleDeleted}
              />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default IdentityManagementPage;
```

## ABP Permissions

This package respects ABP's identity permissions:

| Permission | Description |
|------------|-------------|
| `AbpIdentity.Users` | View users |
| `AbpIdentity.Users.Create` | Create users |
| `AbpIdentity.Users.Update` | Update users |
| `AbpIdentity.Users.Delete` | Delete users |
| `AbpIdentity.Users.ManagePermissions` | Manage user permissions |
| `AbpIdentity.Roles` | View roles |
| `AbpIdentity.Roles.Create` | Create roles |
| `AbpIdentity.Roles.Update` | Update roles |
| `AbpIdentity.Roles.Delete` | Delete roles |
| `AbpIdentity.Roles.ManagePermissions` | Manage role permissions |

## Related Packages

- [@abpjs/core](https://www.npmjs.com/package/@abpjs/core) - Core infrastructure (required)
- [@abpjs/theme-shared](https://www.npmjs.com/package/@abpjs/theme-shared) - Shared UI components (required)
- [@abpjs/permission-management](https://www.npmjs.com/package/@abpjs/permission-management) - Permission management (required)
- [@abpjs/account](https://www.npmjs.com/package/@abpjs/account) - Account management
- [@abpjs/tenant-management](https://www.npmjs.com/package/@abpjs/tenant-management) - Tenant administration
- [@abpjs/theme-basic](https://www.npmjs.com/package/@abpjs/theme-basic) - Layout components

## Contributing

This package is part of the [ABP React](https://github.com/anthropics/abp-react) monorepo. Contributions are welcome!

## License

LGPL-3.0 - See [LICENSE](https://github.com/anthropics/abp-react/blob/main/LICENSE) for details.

---

**[View Full Documentation](https://github.com/anthropics/abp-react)** | **[Report Issues](https://github.com/anthropics/abp-react/issues)**
