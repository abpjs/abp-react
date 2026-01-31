# @abpjs/audit-logging

> Audit logging UI components for ABP Framework in React

[![npm version](https://img.shields.io/npm/v/@abpjs/audit-logging.svg)](https://www.npmjs.com/package/@abpjs/audit-logging)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

## Overview

`@abpjs/audit-logging` provides audit log viewing and management components for ABP-based React applications. It allows administrators to view, search, and filter audit logs with detailed information about user actions.

This package is a React translation of the original `@volo/abp.ng.audit-logging` Angular package.

## Features

- **Audit Log Viewer** - View and browse audit logs with pagination
- **Search & Filter** - Filter by date range, user, HTTP method, status code, and more
- **Detail View** - View detailed information about each audit log entry
- **Entity Changes** - Track entity property changes
- **Action Logs** - View individual action details within requests
- **Responsive Design** - Works on all screen sizes
- **TypeScript** - Full type safety with comprehensive definitions

## Installation

```bash
# Using npm
npm install @abpjs/audit-logging

# Using yarn
yarn add @abpjs/audit-logging

# Using pnpm
pnpm add @abpjs/audit-logging
```

### Required Dependencies

This package requires the following peer dependencies:

```bash
npm install @abpjs/core @abpjs/theme-shared @chakra-ui/react @emotion/react react-router-dom
```

## Quick Start

### Using the Audit Logs Component

```tsx
import { AuditLogsComponent } from '@abpjs/audit-logging';

function AuditLogsPage() {
  return (
    <AuditLogsComponent
      onAuditLogSelected={(log) => console.log('Selected:', log)}
    />
  );
}
```

### Using the Hook

```tsx
import { useAuditLogs } from '@abpjs/audit-logging';
import { useEffect } from 'react';

function CustomAuditLogsView() {
  const {
    auditLogs,
    totalCount,
    isLoading,
    error,
    fetchAuditLogs,
    getAuditLogById,
    selectedAuditLog,
  } = useAuditLogs();

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  return (
    <div>
      <h1>Audit Logs ({totalCount})</h1>
      <ul>
        {auditLogs.map(log => (
          <li key={log.id}>
            {log.httpMethod} {log.url} - {log.httpStatusCode}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Components

### AuditLogsComponent

Complete audit log management component with table, search, filters, and detail modal.

```tsx
import { AuditLogsComponent } from '@abpjs/audit-logging';

<AuditLogsComponent
  onAuditLogSelected={(log) => console.log('Selected:', log)}
/>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onAuditLogSelected` | `(log: AuditLog) => void` | No | Callback when an audit log is selected |

**Features:**
- Audit log table with sortable columns
- Date range filters
- User name filter
- HTTP method filter
- Status code filter
- URL search
- Pagination controls
- Detail modal with full log information
- Entity changes view
- Action logs view

## Hooks

### useAuditLogs

Hook for fetching and managing audit logs.

```tsx
import { useAuditLogs } from '@abpjs/audit-logging';

const {
  auditLogs,           // Array of audit logs
  totalCount,          // Total count for pagination
  selectedAuditLog,    // Currently selected audit log
  isLoading,           // Loading state
  error,               // Error message
  pageQuery,           // Current pagination/filter params
  fetchAuditLogs,      // Fetch audit logs with optional params
  getAuditLogById,     // Get and select an audit log by ID
  setSelectedAuditLog, // Set the selected audit log
  setPageQuery,        // Update pagination/filter params
  reset,               // Reset state
} = useAuditLogs();
```

## Services

### AuditLoggingService

Service class for audit logging API operations.

```tsx
import { AuditLoggingService } from '@abpjs/audit-logging';
import { useRestService } from '@abpjs/core';

function MyComponent() {
  const restService = useRestService();
  const service = new AuditLoggingService(restService);

  // Fetch audit logs
  const logs = await service.getAuditLogs({
    maxResultCount: 10,
    skipCount: 0,
    startTime: '2024-01-01',
    endTime: '2024-01-31',
  });

  // Get single audit log
  const log = await service.getAuditLogById(id);
}
```

## Data Models

### AuditLog

```typescript
interface AuditLog {
  id: string;
  applicationName: string;
  userId: string;
  userName: string;
  tenantId: string;
  tenantName: string;
  impersonatorUserId: string;
  impersonatorTenantId: string;
  executionTime: string;
  executionDuration: number;
  clientIpAddress: string;
  clientName: string;
  clientId: string;
  correlationId: string;
  browserInfo: string;
  httpMethod: string;
  url: string;
  exceptions: string;
  comments: string;
  httpStatusCode: number;
  entityChanges: EntityChange[];
  actions: AuditLogAction[];
}
```

### EntityChange

```typescript
interface EntityChange {
  id: string;
  auditLogId: string;
  tenantId: string;
  changeTime: string;
  changeType: number;
  entityId: string;
  entityTypeFullName: string;
  propertyChanges: EntityPropertyChange[];
}
```

### AuditLogAction

```typescript
interface AuditLogAction {
  id: string;
  auditLogId: string;
  tenantId: string;
  serviceName: string;
  methodName: string;
  parameters: string;
  executionTime: string;
  executionDuration: number;
}
```

## Constants

### AUDIT_LOGGING_ROUTES

Default route configuration for the audit logging module:

```tsx
import { AUDIT_LOGGING_ROUTES } from '@abpjs/audit-logging';

// Use in your router configuration
const routes = [
  ...AUDIT_LOGGING_ROUTES.routes,
  // your other routes
];
```

## Router Setup Example

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuditLogsComponent } from '@abpjs/audit-logging';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/audit-logs" element={<AuditLogsComponent />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## ABP Permissions

This package respects ABP's audit logging permissions:

| Permission | Description |
|------------|-------------|
| `AuditLogging.AuditLogs` | View audit logs |

## Related Packages

- [@abpjs/core](https://www.npmjs.com/package/@abpjs/core) - Core infrastructure (required)
- [@abpjs/theme-shared](https://www.npmjs.com/package/@abpjs/theme-shared) - Shared UI components (required)
- [@abpjs/identity-pro](https://www.npmjs.com/package/@abpjs/identity-pro) - Identity Pro features
- [@abpjs/saas](https://www.npmjs.com/package/@abpjs/saas) - SaaS module

## Contributing

This package is part of the [ABP React](https://github.com/abpjs/abp-react) monorepo. Contributions are welcome!

## License

LGPL-3.0 - See [LICENSE](https://github.com/abpjs/abp-react/blob/main/LICENSE) for details.

---

**[View Full Documentation](https://docs.abpjs.io/docs/packages/audit-logging/overview)** | **[Report Issues](https://github.com/abpjs/abp-react/issues)** | **[View Source](https://github.com/abpjs/abp-react/tree/main/packages/audit-logging)**
