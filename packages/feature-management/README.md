# @abpjs/feature-management

> Feature management UI components for ABP Framework in React

[![npm version](https://img.shields.io/npm/v/@abpjs/feature-management.svg)](https://www.npmjs.com/package/@abpjs/feature-management)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

## Overview

`@abpjs/feature-management` provides feature management capabilities for ABP-based React applications. It allows managing features for tenants and editions with support for toggle and free-text value types.

This package is a React translation of the original `@abp/ng.feature-management` Angular package.

## Features

- **Feature Modal** - Modal component for viewing and editing features
- **Toggle Features** - Checkbox-based boolean features
- **Free Text Features** - Text input for string-based features
- **Provider Support** - Supports tenant (T) and edition (E) providers
- **Localization** - Full i18n support using ABP localization
- **Chakra UI** - Beautiful, accessible components
- **TypeScript** - Full type safety with comprehensive definitions

## Installation

```bash
# Using npm
npm install @abpjs/feature-management

# Using yarn
yarn add @abpjs/feature-management

# Using pnpm
pnpm add @abpjs/feature-management
```

### Required Dependencies

This package requires the following peer dependencies:

```bash
npm install @abpjs/core @abpjs/theme-shared @chakra-ui/react @emotion/react
```

## Quick Start

### Using the Modal Component

```tsx
import { useState } from 'react';
import { FeatureManagementModal } from '@abpjs/feature-management';

function TenantFeatures({ tenantId }: { tenantId: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <button onClick={() => setVisible(true)}>Manage Features</button>
      <FeatureManagementModal
        providerName="T"
        providerKey={tenantId}
        visible={visible}
        onVisibleChange={setVisible}
        onSave={() => console.log('Features saved!')}
      />
    </>
  );
}
```

### Using the Hook

```tsx
import { useFeatureManagement } from '@abpjs/feature-management';
import { useEffect } from 'react';

function CustomFeaturePage({ tenantId }: { tenantId: string }) {
  const {
    features,
    isLoading,
    fetchFeatures,
    saveFeatures,
    updateFeatureValue,
    isFeatureEnabled,
  } = useFeatureManagement();

  useEffect(() => {
    fetchFeatures(tenantId, 'T');
  }, [tenantId, fetchFeatures]);

  const handleToggle = (featureName: string) => {
    const newValue = isFeatureEnabled(featureName) ? 'false' : 'true';
    updateFeatureValue(featureName, newValue);
  };

  const handleSave = async () => {
    const result = await saveFeatures(tenantId, 'T');
    if (result.success) {
      console.log('Features saved!');
    }
  };

  return (
    <div>
      {features.map(feature => (
        <div key={feature.name}>
          <span>{feature.name}</span>
          {feature.valueType?.name === 'ToggleStringValueType' ? (
            <input
              type="checkbox"
              checked={isFeatureEnabled(feature.name)}
              onChange={() => handleToggle(feature.name)}
            />
          ) : (
            <input
              type="text"
              value={feature.value}
              onChange={(e) => updateFeatureValue(feature.name, e.target.value)}
            />
          )}
        </div>
      ))}
      <button onClick={handleSave} disabled={isLoading}>
        Save
      </button>
    </div>
  );
}
```

## Components

### FeatureManagementModal

Modal component for managing features of a provider.

```tsx
import { FeatureManagementModal } from '@abpjs/feature-management';

<FeatureManagementModal
  providerName="T"
  providerKey={tenantId}
  visible={visible}
  onVisibleChange={setVisible}
  onSave={() => console.log('Saved!')}
/>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `providerName` | `string` | Yes | Provider type ("T" for tenant, "E" for edition) |
| `providerKey` | `string` | Yes | Provider identifier (tenant ID or edition ID) |
| `visible` | `boolean` | Yes | Whether the modal is visible |
| `onVisibleChange` | `(visible: boolean) => void` | No | Callback when visibility changes |
| `onSave` | `() => void` | No | Callback when features are saved |

## Hooks

### useFeatureManagement

Hook for managing feature state and operations.

```tsx
import { useFeatureManagement } from '@abpjs/feature-management';

const {
  features,           // Array of features
  featureValues,      // Current values (form state)
  isLoading,          // Loading state
  error,              // Error message
  fetchFeatures,      // Fetch features for provider
  saveFeatures,       // Save changes to server
  updateFeatureValue, // Update a feature value locally
  getFeatureValue,    // Get current feature value
  isFeatureEnabled,   // Check if toggle feature is enabled
  reset,              // Reset all state
} = useFeatureManagement();
```

## Services

### FeatureManagementService

Service class for direct API interaction.

```tsx
import { FeatureManagementService } from '@abpjs/feature-management';
import { useRestService } from '@abpjs/core';

function MyComponent() {
  const restService = useRestService();
  const service = new FeatureManagementService(restService);

  // Get features
  const features = await service.getFeatures({
    providerName: 'T',
    providerKey: tenantId,
  });

  // Update features
  await service.updateFeatures({
    providerName: 'T',
    providerKey: tenantId,
    features: [
      { name: 'MyFeature', value: 'true' },
    ],
  });
}
```

## Data Models

### FeatureManagement Namespace

```typescript
import { FeatureManagement } from '@abpjs/feature-management';

interface FeatureManagement.Feature {
  name: string;
  value: string;
  description?: string;
  valueType?: ValueType;
  depth?: number;
  parentName?: string;
}

interface FeatureManagement.ValueType {
  name: string;           // 'ToggleStringValueType' or 'FreeTextStringValueType'
  properties: object;
  validator: object;
}

interface FeatureManagement.Provider {
  providerName: string;   // 'T' for tenant, 'E' for edition
  providerKey: string;    // Provider ID
}

interface FeatureManagement.Features {
  features: Feature[];
}
```

## Value Types

| Value Type | Description | UI Component |
|------------|-------------|--------------|
| `ToggleStringValueType` | Boolean toggle | Checkbox/Switch |
| `FreeTextStringValueType` | Free text input | Text input |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/abp/features` | Fetch features for provider |
| `PUT` | `/api/abp/features` | Update features for provider |

## Related Packages

- [@abpjs/core](https://www.npmjs.com/package/@abpjs/core) - Core infrastructure (required)
- [@abpjs/theme-shared](https://www.npmjs.com/package/@abpjs/theme-shared) - Shared UI components (required)
- [@abpjs/tenant-management](https://www.npmjs.com/package/@abpjs/tenant-management) - Tenant management
- [@abpjs/permission-management](https://www.npmjs.com/package/@abpjs/permission-management) - Permission management

## Contributing

This package is part of the [ABP React](https://github.com/abpjs/abp-react) monorepo. Contributions are welcome!

## License

LGPL-3.0 - See [LICENSE](https://github.com/abpjs/abp-react/blob/main/LICENSE) for details.

---

**[View Full Documentation](https://docs.abpjs.io/docs/packages/feature-management/overview)** | **[Report Issues](https://github.com/abpjs/abp-react/issues)** | **[View Source](https://github.com/abpjs/abp-react/tree/main/packages/feature-management)**
