# @abpjs/identity-pro

> Enhanced user, role, and claim management UI components for ABP Framework in React

[![npm version](https://img.shields.io/npm/v/@abpjs/identity-pro.svg)](https://www.npmjs.com/package/@abpjs/identity-pro)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

## Overview

`@abpjs/identity-pro` provides enhanced identity management components for ABP-based React applications. It extends the basic identity module with advanced features like claim type management, user/role claims, and organization units.

This package is a React translation of the original `@volo/abp.ng.identity` Angular package, bringing pro-level identity management to React applications.

## Features

- **User Management** - Create, read, update, and delete users with enhanced options
- **Role Management** - Create, read, update, and delete roles
- **Claim Types** - Manage custom claim types for users and roles
- **User Claims** - Assign and manage claims on individual users
- **Role Claims** - Assign and manage claims on roles
- **Role Assignment** - Assign roles to users with checkbox interface
- **Permission Integration** - Seamlessly integrates with permission management
- **Pagination** - Built-in pagination for all list views
- **Search & Filter** - Filter users, roles, and claims
- **Localization** - Full i18n support using ABP localization
- **Chakra UI** - Beautiful, accessible components
- **TypeScript** - Full type safety with comprehensive definitions

## Installation

```bash
# Using npm
npm install @abpjs/identity-pro

# Using yarn
yarn add @abpjs/identity-pro

# Using pnpm
pnpm add @abpjs/identity-pro
```

### Required Dependencies

This package requires the following peer dependencies:

```bash
npm install @abpjs/core @abpjs/theme-shared @abpjs/permission-management @chakra-ui/react @emotion/react react-icons react-router-dom
```

## Quick Start

### Using Pre-built Components

```tsx
import { RolesComponent, UsersComponent, ClaimsComponent } from '@abpjs/identity-pro';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

function IdentityProManagement() {
  return (
    <Tabs>
      <TabList>
        <Tab>Users</Tab>
        <Tab>Roles</Tab>
        <Tab>Claim Types</Tab>
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
        <TabPanel>
          <ClaimsComponent
            onClaimTypeCreated={(claim) => console.log('Claim type created:', claim)}
            onClaimTypeDeleted={(id) => console.log('Claim type deleted:', id)}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
```

### Using Hooks for Custom UI

```tsx
import { useUsers, useRoles, useClaims } from '@abpjs/identity-pro';
import { useEffect } from 'react';

function CustomIdentityPage() {
  const { users, fetchUsers } = useUsers();
  const { roles, fetchRoles } = useRoles();
  const { claimTypes, fetchClaimTypes } = useClaims();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchClaimTypes();
  }, [fetchUsers, fetchRoles, fetchClaimTypes]);

  return (
    <div>
      <h2>Users: {users.length}</h2>
      <h2>Roles: {roles.length}</h2>
      <h2>Claim Types: {claimTypes.length}</h2>
    </div>
  );
}
```

## Components

### UsersComponent

Complete user management component with enhanced pro features.

```tsx
import { UsersComponent } from '@abpjs/identity-pro';

<UsersComponent
  onUserCreated={(user) => console.log('Created:', user)}
  onUserUpdated={(user) => console.log('Updated:', user)}
  onUserDeleted={(id) => console.log('Deleted:', id)}
/>
```

**Features:**
- User table with actions menu
- Search/filter by username
- Pagination controls
- Create/Edit modal with tabs for user info, role assignment, and claims
- Permission management integration
- Delete confirmation dialog

### RolesComponent

Complete role management component with claim support.

```tsx
import { RolesComponent } from '@abpjs/identity-pro';

<RolesComponent
  onRoleCreated={(role) => console.log('Created:', role)}
  onRoleUpdated={(role) => console.log('Updated:', role)}
  onRoleDeleted={(id) => console.log('Deleted:', id)}
/>
```

**Features:**
- Role table with actions menu
- Search/filter by role name
- Create/Edit modal with isDefault and isPublic options
- Role claims management
- Permission management integration
- Static role protection
- Delete confirmation dialog

### ClaimsComponent

Claim type management component.

```tsx
import { ClaimsComponent } from '@abpjs/identity-pro';

<ClaimsComponent
  onClaimTypeCreated={(claim) => console.log('Created:', claim)}
  onClaimTypeUpdated={(claim) => console.log('Updated:', claim)}
  onClaimTypeDeleted={(id) => console.log('Deleted:', id)}
/>
```

**Features:**
- Claim types table
- Search/filter by claim name
- Create/Edit modal with value type selection
- Required field configuration
- Regex validation pattern support
- Delete confirmation dialog

## Hooks

### useUsers

Hook for managing users with full CRUD and pagination support.

```tsx
import { useUsers } from '@abpjs/identity-pro';

const {
  users,              // Array of users
  totalCount,         // Total user count
  selectedUser,       // Currently selected user
  selectedUserRoles,  // Roles of selected user
  isLoading,          // Loading state
  error,              // Error message
  fetchUsers,         // Fetch users with optional params
  getUserById,        // Get single user
  getUserRoles,       // Get user's roles
  createUser,         // Create new user
  updateUser,         // Update existing user
  deleteUser,         // Delete user
  reset,              // Reset all state
} = useUsers();
```

### useRoles

Hook for managing roles with full CRUD support.

```tsx
import { useRoles } from '@abpjs/identity-pro';

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
  reset,            // Reset all state
} = useRoles();
```

### useClaims

Hook for managing claim types.

```tsx
import { useClaims } from '@abpjs/identity-pro';

const {
  claimTypes,           // Array of claim types
  totalCount,           // Total claim type count
  selectedClaimType,    // Currently selected claim type
  isLoading,            // Loading state
  error,                // Error message
  fetchClaimTypes,      // Fetch claim types with optional params
  getClaimTypeById,     // Get single claim type
  createClaimType,      // Create new claim type
  updateClaimType,      // Update existing claim type
  deleteClaimType,      // Delete claim type
  reset,                // Reset all state
} = useClaims();
```

### useIdentity

Combined hook for managing users and roles.

```tsx
import { useIdentity } from '@abpjs/identity-pro';

const {
  roles,
  users,
  fetchRoles,
  fetchUsers,
} = useIdentity();
```

## Services

### IdentityProService

Service class for identity pro API operations.

```tsx
import { IdentityProService } from '@abpjs/identity-pro';
import { useRestService } from '@abpjs/core';

function MyComponent() {
  const restService = useRestService();
  const service = new IdentityProService(restService);

  // User operations
  await service.getUsers({ maxResultCount: 10, skipCount: 0 });
  await service.getUserById(userId);
  await service.createUser(userData);
  await service.updateUser(userId, userData);
  await service.deleteUser(userId);

  // Role operations
  await service.getRoles();
  await service.createRole(roleData);

  // Claim type operations
  await service.getClaimTypes();
  await service.createClaimType(claimData);
}
```

## Data Models

### User Types

```typescript
interface UserItem {
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
```

### Role Types

```typescript
interface RoleItem {
  id: string;
  name: string;
  isDefault: boolean;
  isPublic: boolean;
  isStatic: boolean;
  concurrencyStamp: string;
}
```

### Claim Types

```typescript
interface ClaimType {
  id: string;
  name: string;
  required: boolean;
  isStatic: boolean;
  regex: string;
  regexDescription: string;
  description: string;
  valueType: ClaimValueType;
  valueTypeAsString: string;
}

enum ClaimValueType {
  String = 0,
  Int = 1,
  Boolean = 2,
  DateTime = 3,
}
```

## ABP Permissions

This package respects ABP's identity pro permissions:

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
| `AbpIdentity.ClaimTypes` | View claim types |
| `AbpIdentity.ClaimTypes.Create` | Create claim types |
| `AbpIdentity.ClaimTypes.Update` | Update claim types |
| `AbpIdentity.ClaimTypes.Delete` | Delete claim types |

## Related Packages

- [@abpjs/core](https://www.npmjs.com/package/@abpjs/core) - Core infrastructure (required)
- [@abpjs/theme-shared](https://www.npmjs.com/package/@abpjs/theme-shared) - Shared UI components (required)
- [@abpjs/permission-management](https://www.npmjs.com/package/@abpjs/permission-management) - Permission management (required)
- [@abpjs/identity](https://www.npmjs.com/package/@abpjs/identity) - Basic identity module
- [@abpjs/account-pro](https://www.npmjs.com/package/@abpjs/account-pro) - Account Pro features
- [@abpjs/saas](https://www.npmjs.com/package/@abpjs/saas) - SaaS module

## Contributing

This package is part of the [ABP React](https://github.com/abpjs/abp-react) monorepo. Contributions are welcome!

## License

LGPL-3.0 - See [LICENSE](https://github.com/abpjs/abp-react/blob/main/LICENSE) for details.

---

**[View Full Documentation](https://docs.abpjs.io/docs/packages/identity-pro/overview)** | **[Report Issues](https://github.com/abpjs/abp-react/issues)** | **[View Source](https://github.com/abpjs/abp-react/tree/main/packages/identity-pro)**
