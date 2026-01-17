# @abpjs/theme-shared

> Shared UI components and services for ABP Framework in React

[![npm version](https://img.shields.io/npm/v/@abpjs/theme-shared.svg)](https://www.npmjs.com/package/@abpjs/theme-shared)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

## Overview

`@abpjs/theme-shared` provides essential shared UI components and services for ABP-based React applications. It includes toast notifications, confirmation dialogs, modal management, and global error handling - the building blocks that other ABP theme packages depend on.

This package is a React translation of the original `@abp/ng.theme.shared` Angular package, offering the same powerful UI utilities with modern React patterns.

## Features

- **Toast Notifications** - Global notification system with multiple types
- **Confirmation Dialogs** - Promise-based confirmation modals
- **Modal Management** - Centralized modal service
- **Error Handling** - Global error handler with user-friendly messages
- **Theme Configuration** - Chakra UI theme customization
- **Utility Functions** - Common UI utilities and helpers
- **TypeScript** - Full type safety with comprehensive definitions

## Installation

```bash
# Using npm
npm install @abpjs/theme-shared

# Using yarn
yarn add @abpjs/theme-shared

# Using pnpm
pnpm add @abpjs/theme-shared
```

### Required Dependencies

This package requires the following peer dependencies:

```bash
npm install @abpjs/core @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

## Quick Start

### 1. Setup the Theme Provider

Wrap your application with the ThemeSharedProvider:

```tsx
import { ThemeSharedProvider } from '@abpjs/theme-shared';
import { CoreProvider } from '@abpjs/core';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <CoreProvider environment={environment}>
        <ThemeSharedProvider>
          <YourApp />
        </ThemeSharedProvider>
      </CoreProvider>
    </ChakraProvider>
  );
}
```

### 2. Show Toast Notifications

```tsx
import { useToaster } from '@abpjs/theme-shared';

function MyComponent() {
  const toaster = useToaster();

  const handleSuccess = () => {
    toaster.success('Operation completed successfully!');
  };

  const handleError = () => {
    toaster.error('Something went wrong!');
  };

  const handleWarning = () => {
    toaster.warn('Please review your input.');
  };

  const handleInfo = () => {
    toaster.info('Did you know? You can customize this.');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
      <button onClick={handleWarning}>Warning</button>
      <button onClick={handleInfo}>Info</button>
    </div>
  );
}
```

### 3. Show Confirmation Dialogs

```tsx
import { useConfirmation } from '@abpjs/theme-shared';

function DeleteButton({ onDelete }) {
  const confirmation = useConfirmation();

  const handleClick = async () => {
    const confirmed = await confirmation.confirm({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      severity: 'error',
    });

    if (confirmed) {
      onDelete();
    }
  };

  return <button onClick={handleClick}>Delete</button>;
}
```

## Components

### Toast / Toaster

Toast notification component and container.

```tsx
import { Toaster, Toast } from '@abpjs/theme-shared';

// The Toaster component is usually placed at the root level
function App() {
  return (
    <ThemeSharedProvider>
      <YourApp />
      <Toaster />  {/* Toast container */}
    </ThemeSharedProvider>
  );
}
```

### Confirmation

Confirmation dialog component.

```tsx
import { Confirmation } from '@abpjs/theme-shared';

// Usually managed by the provider, but can be used directly
<Confirmation
  isOpen={isOpen}
  onClose={handleClose}
  onConfirm={handleConfirm}
  title="Confirm Action"
  message="Are you sure?"
  severity="warning"
/>
```

### Modal

Generic modal component for custom dialogs.

```tsx
import { Modal } from '@abpjs/theme-shared';

function CustomModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Custom Modal"
      size="md"
    >
      <p>Your modal content here</p>
    </Modal>
  );
}
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Controls modal visibility |
| `onClose` | `() => void` | - | Callback when modal closes |
| `title` | `string` | - | Modal header title |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Modal size |
| `children` | `ReactNode` | - | Modal content |

## Hooks

### useToaster

Hook for showing toast notifications.

```tsx
import { useToaster } from '@abpjs/theme-shared';

function MyComponent() {
  const toaster = useToaster();

  // Success toast
  toaster.success('Saved successfully!');

  // Error toast
  toaster.error('Failed to save.');

  // Warning toast
  toaster.warn('Please check your input.');

  // Info toast
  toaster.info('New updates available.');

  // Custom toast with options
  toaster.show({
    title: 'Custom Title',
    message: 'Custom message here',
    severity: 'success',
    duration: 5000,
    isClosable: true,
  });
}
```

**Toaster Methods:**

| Method | Description |
|--------|-------------|
| `success(message, options?)` | Show success notification |
| `error(message, options?)` | Show error notification |
| `warn(message, options?)` | Show warning notification |
| `info(message, options?)` | Show info notification |
| `show(options)` | Show custom notification |
| `clear()` | Clear all notifications |

### useConfirmation

Hook for showing confirmation dialogs.

```tsx
import { useConfirmation } from '@abpjs/theme-shared';

function MyComponent() {
  const confirmation = useConfirmation();

  const handleDelete = async () => {
    const result = await confirmation.confirm({
      title: 'Delete',
      message: 'Are you sure?',
      confirmText: 'Yes, Delete',
      cancelText: 'No, Keep',
      severity: 'error',
    });

    if (result) {
      // User confirmed
      performDelete();
    }
  };

  // Shorthand methods
  const handleWarn = async () => {
    await confirmation.warn('Warning!', 'This may cause issues.');
  };

  const handleError = async () => {
    await confirmation.error('Error!', 'An error occurred.');
  };
}
```

**Confirmation Options:**

```typescript
interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;    // Default: 'Confirm'
  cancelText?: string;     // Default: 'Cancel'
  severity?: 'info' | 'warning' | 'error';  // Default: 'info'
  hideCancelButton?: boolean;
}
```

### useModal

Hook for programmatic modal management.

```tsx
import { useModal } from '@abpjs/theme-shared';

function MyComponent() {
  const modal = useModal();

  const openCustomModal = () => {
    modal.open({
      title: 'My Modal',
      content: <CustomContent />,
      size: 'lg',
      onClose: () => console.log('Modal closed'),
    });
  };

  return <button onClick={openCustomModal}>Open Modal</button>;
}
```

## Services

### ErrorHandler

Global error handling service.

```tsx
import { ErrorHandler, useErrorHandler } from '@abpjs/theme-shared';

// Using the hook
function MyComponent() {
  const errorHandler = useErrorHandler();

  const handleApiCall = async () => {
    try {
      await apiCall();
    } catch (error) {
      errorHandler.handle(error);
    }
  };
}

// The error handler automatically:
// - Shows user-friendly error messages
// - Handles ABP error responses
// - Logs errors for debugging
// - Supports custom error handling
```

**Error Types Handled:**

- ABP API errors (validation, business logic)
- HTTP errors (401, 403, 404, 500, etc.)
- Network errors
- Unknown errors

## Theme Configuration

### Custom Theme

Extend the default theme:

```tsx
import { extendTheme, ChakraProvider } from '@chakra-ui/react';
import { abpTheme } from '@abpjs/theme-shared';

const customTheme = extendTheme({
  ...abpTheme,
  colors: {
    ...abpTheme.colors,
    brand: {
      50: '#e3f2fd',
      500: '#2196f3',
      600: '#1e88e5',
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={customTheme}>
      <ThemeSharedProvider>
        <YourApp />
      </ThemeSharedProvider>
    </ChakraProvider>
  );
}
```

### Toast Styling

Customize toast appearance:

```tsx
import { useToaster } from '@abpjs/theme-shared';

function MyComponent() {
  const toaster = useToaster();

  toaster.show({
    title: 'Custom Toast',
    message: 'With custom styling',
    severity: 'success',
    position: 'top-right',
    duration: 3000,
    isClosable: true,
    variant: 'solid',  // 'solid' | 'subtle' | 'left-accent' | 'top-accent'
  });
}
```

## Data Models

### Toaster Types

```typescript
interface ToasterOptions {
  title?: string;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  isClosable?: boolean;
  position?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';
  variant?: 'solid' | 'subtle' | 'left-accent' | 'top-accent';
}
```

### Confirmation Types

```typescript
interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: 'info' | 'warning' | 'error';
  hideCancelButton?: boolean;
  icon?: React.ReactNode;
}
```

## Complete Example

Full integration example:

```tsx
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { CoreProvider } from '@abpjs/core';
import {
  ThemeSharedProvider,
  useToaster,
  useConfirmation,
  useErrorHandler,
} from '@abpjs/theme-shared';

const environment = {
  // Your ABP configuration
};

// Main App
function App() {
  return (
    <ChakraProvider>
      <CoreProvider environment={environment}>
        <ThemeSharedProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ThemeSharedProvider>
      </CoreProvider>
    </ChakraProvider>
  );
}

// Example usage in a component
function UserActions({ user }) {
  const toaster = useToaster();
  const confirmation = useConfirmation();
  const errorHandler = useErrorHandler();

  const handleSave = async () => {
    try {
      await saveUser(user);
      toaster.success('User saved successfully!');
    } catch (error) {
      errorHandler.handle(error);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirmation.confirm({
      title: 'Delete User',
      message: `Are you sure you want to delete ${user.name}?`,
      severity: 'error',
      confirmText: 'Delete',
    });

    if (confirmed) {
      try {
        await deleteUser(user.id);
        toaster.success('User deleted!');
      } catch (error) {
        errorHandler.handle(error);
      }
    }
  };

  return (
    <div>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default App;
```

## Utilities

### Style Utilities

```tsx
import { styleUtils } from '@abpjs/theme-shared';

// Common style helpers
const cardStyle = styleUtils.card();
const shadowStyle = styleUtils.shadow('md');
const responsiveWidth = styleUtils.responsive({ base: '100%', md: '50%' });
```

### Common Helpers

```tsx
import { helpers } from '@abpjs/theme-shared';

// Format error messages
const message = helpers.formatError(error);

// Check if error is ABP error
const isAbpError = helpers.isAbpError(error);
```

## Related Packages

- [@abpjs/core](https://www.npmjs.com/package/@abpjs/core) - Core infrastructure (required)
- [@abpjs/theme-basic](https://www.npmjs.com/package/@abpjs/theme-basic) - Layout components
- [@abpjs/account](https://www.npmjs.com/package/@abpjs/account) - Account management
- [@abpjs/permission-management](https://www.npmjs.com/package/@abpjs/permission-management) - Permission management
- [@abpjs/tenant-management](https://www.npmjs.com/package/@abpjs/tenant-management) - Tenant administration

## Contributing

This package is part of the [ABP React](https://github.com/anthropics/abp-react) monorepo. Contributions are welcome!

## License

LGPL-3.0 - See [LICENSE](https://github.com/anthropics/abp-react/blob/main/LICENSE) for details.

---

**[View Full Documentation](https://github.com/anthropics/abp-react)** | **[Report Issues](https://github.com/anthropics/abp-react/issues)**
