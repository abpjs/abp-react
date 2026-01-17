# @abpjs/theme-shared

> Shared UI components and services for ABP Framework in React

[![npm version](https://img.shields.io/npm/v/@abpjs/theme-shared.svg)](https://www.npmjs.com/package/@abpjs/theme-shared)
[![documentation](https://img.shields.io/badge/docs-abpjs.io-blue.svg)](https://docs.abpjs.io/docs/packages/theme-shared/overview)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

## Overview

`@abpjs/theme-shared` provides essential shared UI components and services for ABP-based React applications. It includes toast notifications, confirmation dialogs, modal management, and global error handling - the building blocks that other ABP theme packages depend on.

This package is a React translation of the original `@abp/ng.theme.shared` Angular package, offering the same powerful UI utilities with modern React patterns.

## Features

- **Toast Notifications** - Global notification system with multiple types
- **Confirmation Dialogs** - Promise-based confirmation modals
- **Modal Management** - Centralized modal service
- **Error Handling** - Global error handler with user-friendly messages
- **Theme Configuration** - Chakra UI v3 theme customization with `createSystem`
- **Color Mode** - Built-in light/dark theme support (opt-in)
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
npm install @abpjs/core @chakra-ui/react @emotion/react lucide-react
```

> **Note:** Chakra UI v3 no longer requires `@emotion/styled` or `framer-motion` as peer dependencies.

## Quick Start

### 1. Setup the Theme Provider

Wrap your application with the ThemeSharedProvider:

```tsx
import { ThemeSharedProvider } from '@abpjs/theme-shared';
import { CoreProvider } from '@abpjs/core';

function App() {
  return (
    <CoreProvider environment={environment}>
      <ThemeSharedProvider>
        <YourApp />
      </ThemeSharedProvider>
    </CoreProvider>
  );
}
```

> **Note:** `ThemeSharedProvider` includes Chakra's provider internally, so you don't need to wrap with `ChakraProvider` separately.

### 2. Show Toast Notifications

```tsx
import { useToaster } from '@abpjs/theme-shared';

function MyComponent() {
  const toaster = useToaster();

  const handleSuccess = () => {
    toaster.success('Operation completed successfully!', 'Success');
  };

  const handleError = () => {
    toaster.error('Something went wrong!', 'Error');
  };

  const handleWarning = () => {
    toaster.warn('Please review your input.', 'Warning');
  };

  const handleInfo = () => {
    toaster.info('Did you know? You can customize this.', 'Info');
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
import { useConfirmation, Toaster } from '@abpjs/theme-shared';

function DeleteButton({ onDelete }) {
  const confirmation = useConfirmation();

  const handleClick = async () => {
    const status = await confirmation.warn(
      'Are you sure you want to delete this item? This action cannot be undone.',
      'Delete Item',
      {
        yesCopy: 'Delete',
        cancelCopy: 'Cancel',
      }
    );

    if (status === Toaster.Status.confirm) {
      onDelete();
    }
  };

  return <button onClick={handleClick}>Delete</button>;
}
```

## Components

### Toast / ToastContainer

Toast notification component and container.

```tsx
import { ToastContainer } from '@abpjs/theme-shared';

// The ToastContainer is usually placed at the root level
// ThemeSharedProvider includes it by default when renderToasts={true}
function App() {
  return (
    <ThemeSharedProvider renderToasts={true}>
      <YourApp />
    </ThemeSharedProvider>
  );
}
```

### ConfirmationDialog

Confirmation dialog component.

```tsx
import { ConfirmationDialog } from '@abpjs/theme-shared';

// Usually managed by the provider, but can be used directly
// ThemeSharedProvider includes it by default when renderConfirmation={true}
```

### Modal

Generic modal component for custom dialogs. Uses Chakra UI v3 Dialog internally.

```tsx
import { Modal } from '@abpjs/theme-shared';

function CustomModal({ isOpen, onClose }) {
  return (
    <Modal
      visible={isOpen}
      onVisibleChange={(open) => !open && onClose()}
      header="Custom Modal"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button colorPalette="blue">Save</Button>
        </>
      }
    >
      <p>Your modal content here</p>
    </Modal>
  );
}
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | - | Controls modal visibility |
| `onVisibleChange` | `(visible: boolean) => void` | - | Callback when visibility changes |
| `header` | `ReactNode` | - | Modal header content |
| `footer` | `ReactNode` | - | Modal footer content |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Modal size |
| `centered` | `boolean` | `true` | Center modal vertically |
| `closeOnOverlayClick` | `boolean` | `true` | Close when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key |
| `showCloseButton` | `boolean` | `true` | Show close button in header |
| `scrollBehavior` | `'inside' \| 'outside'` | `'inside'` | Scroll behavior for content |
| `children` | `ReactNode` | - | Modal content |

## Hooks

### useToaster

Hook for showing toast notifications.

```tsx
import { useToaster } from '@abpjs/theme-shared';

function MyComponent() {
  const toaster = useToaster();

  // Success toast
  toaster.success('Saved successfully!', 'Success');

  // Error toast
  toaster.error('Failed to save.', 'Error');

  // Warning toast
  toaster.warn('Please check your input.', 'Warning');

  // Info toast
  toaster.info('New updates available.', 'Info');

  // With options
  toaster.success('Custom message', 'Title', {
    life: 5000,      // Duration in ms
    sticky: false,   // If true, won't auto-dismiss
    closable: true,  // Show close button
  });
}
```

**Toaster Methods:**

| Method | Description |
|--------|-------------|
| `success(message, title?, options?)` | Show success notification |
| `error(message, title?, options?)` | Show error notification |
| `warn(message, title?, options?)` | Show warning notification |
| `info(message, title?, options?)` | Show info notification |
| `clear()` | Clear all notifications |
| `remove(id)` | Remove specific notification |

### useConfirmation

Hook for showing confirmation dialogs.

```tsx
import { useConfirmation, Toaster } from '@abpjs/theme-shared';

function MyComponent() {
  const confirmation = useConfirmation();

  const handleDelete = async () => {
    const status = await confirmation.warn(
      'Are you sure?',
      'Delete',
      {
        yesCopy: 'Yes, Delete',
        cancelCopy: 'No, Keep',
      }
    );

    if (status === Toaster.Status.confirm) {
      // User confirmed
      performDelete();
    }
  };

  // Different severity methods
  const showInfo = () => confirmation.info('Info message', 'Info');
  const showSuccess = () => confirmation.success('Success!', 'Success');
  const showError = () => confirmation.error('Error occurred', 'Error');
}
```

**Confirmation Options:**

```typescript
interface ConfirmationOptions {
  yesCopy?: string;       // Default: 'Yes' (localized)
  cancelCopy?: string;    // Default: 'Cancel' (localized)
  hideYesBtn?: boolean;   // Hide confirm button
  hideCancelBtn?: boolean; // Hide cancel button
}
```

## Theme Configuration

### Custom Theme with Chakra v3

Customize the theme using `defineConfig`:

```tsx
import { ThemeSharedProvider, defineConfig } from '@abpjs/theme-shared';

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
          fg: { value: '{colors.brand.700}' },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeSharedProvider themeOverrides={customTheme}>
      <YourApp />
    </ThemeSharedProvider>
  );
}
```

### Color Mode (Dark/Light Theme)

Enable color mode support:

```tsx
import { ThemeSharedProvider } from '@abpjs/theme-shared';

function App() {
  return (
    <ThemeSharedProvider
      enableColorMode={true}
      defaultColorMode="light" // 'light' | 'dark' | 'system'
    >
      <YourApp />
    </ThemeSharedProvider>
  );
}
```

Use color mode in components:

```tsx
import { useColorMode, ColorModeButton } from '@abpjs/theme-shared';

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <header>
      <span>Current mode: {colorMode}</span>
      <ColorModeButton /> {/* Pre-built toggle button */}
    </header>
  );
}
```

## ThemeSharedProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Child components |
| `renderToasts` | `boolean` | `true` | Render ToastContainer |
| `renderConfirmation` | `boolean` | `true` | Render ConfirmationDialog |
| `themeOverrides` | `ThemeOverride` | - | Custom theme configuration |
| `toastPosition` | `string` | `'bottom-right'` | Toast position |
| `enableColorMode` | `boolean` | `false` | Enable dark/light mode |
| `defaultColorMode` | `'light' \| 'dark' \| 'system'` | `'light'` | Default color mode |

## Data Models

### Toaster Types

```typescript
namespace Toaster {
  interface Toast {
    id: string;
    message: string;
    title?: string;
    severity: 'info' | 'success' | 'warn' | 'error';
    life?: number;
    sticky?: boolean;
    closable?: boolean;
    messageLocalizationParams?: string[];
    titleLocalizationParams?: string[];
  }

  enum Status {
    confirm = 'confirm',
    reject = 'reject',
    dismiss = 'dismiss',
  }
}
```

## Complete Example

Full integration example:

```tsx
import { BrowserRouter } from 'react-router-dom';
import { CoreProvider } from '@abpjs/core';
import {
  ThemeSharedProvider,
  useToaster,
  useConfirmation,
  Toaster,
  defineConfig,
} from '@abpjs/theme-shared';

const environment = {
  // Your ABP configuration
};

// Optional: Custom theme
const customTheme = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          500: { value: '#6366f1' }, // Custom primary color
        },
      },
    },
  },
});

// Main App
function App() {
  return (
    <CoreProvider environment={environment}>
      <ThemeSharedProvider
        themeOverrides={customTheme}
        enableColorMode={true}
      >
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeSharedProvider>
    </CoreProvider>
  );
}

// Example usage in a component
function UserActions({ user }) {
  const toaster = useToaster();
  const confirmation = useConfirmation();

  const handleSave = async () => {
    try {
      await saveUser(user);
      toaster.success('User saved successfully!', 'Success');
    } catch (error) {
      toaster.error(error.message, 'Error');
    }
  };

  const handleDelete = async () => {
    const status = await confirmation.warn(
      `Are you sure you want to delete ${user.name}?`,
      'Delete User',
      { yesCopy: 'Delete' }
    );

    if (status === Toaster.Status.confirm) {
      try {
        await deleteUser(user.id);
        toaster.success('User deleted!', 'Success');
      } catch (error) {
        toaster.error(error.message, 'Error');
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

## Migration from Chakra UI v2

If you're upgrading from a previous version that used Chakra UI v2:

### Key Changes

1. **No separate ChakraProvider** - `ThemeSharedProvider` now includes it
2. **Theme configuration** - Use `defineConfig()` instead of `extendTheme()`
3. **Modal API** - Use `visible`/`onVisibleChange` instead of `isOpen`/`onClose`
4. **Color tokens** - Use `{ value: '#color' }` format in theme tokens
5. **Boolean props** - `isDisabled` → `disabled`, `isLoading` → `loading`
6. **Color scheme** - `colorScheme` → `colorPalette`
7. **Icons** - Use `lucide-react` instead of `@chakra-ui/icons`

### Example Migration

```tsx
// Before (Chakra v2)
<Modal isOpen={isOpen} onClose={onClose} isCentered>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Title</ModalHeader>
    <ModalBody>Content</ModalBody>
  </ModalContent>
</Modal>

// After (Chakra v3 via @abpjs/theme-shared)
<Modal
  visible={isOpen}
  onVisibleChange={(open) => !open && onClose()}
  header="Title"
  centered
>
  Content
</Modal>
```

## Documentation

For comprehensive documentation, visit [docs.abpjs.io](https://docs.abpjs.io):

- **[Package Documentation](https://docs.abpjs.io/docs/packages/theme-shared/overview)** - Full API reference and examples
- **[Toaster](https://docs.abpjs.io/docs/packages/theme-shared/toaster)** - Toast notifications guide
- **[Confirmation](https://docs.abpjs.io/docs/packages/theme-shared/confirmation)** - Confirmation dialogs guide
- **[Getting Started](https://docs.abpjs.io/docs/getting-started/installation)** - Installation and setup guide
- **[All Packages](https://docs.abpjs.io/docs/)** - Browse all ABP React packages

## Related Packages

- [@abpjs/core](https://www.npmjs.com/package/@abpjs/core) - Core infrastructure (required)
- [@abpjs/theme-basic](https://www.npmjs.com/package/@abpjs/theme-basic) - Layout components
- [@abpjs/account](https://www.npmjs.com/package/@abpjs/account) - Account management
- [@abpjs/permission-management](https://www.npmjs.com/package/@abpjs/permission-management) - Permission management
- [@abpjs/tenant-management](https://www.npmjs.com/package/@abpjs/tenant-management) - Tenant administration

## Contributing

This package is part of the [ABP React](https://github.com/abpjs/abp-react) monorepo. Contributions are welcome!

## License

LGPL-3.0 - See [LICENSE](https://github.com/abpjs/abp-react/blob/main/LICENSE) for details.

---

**[View Full Documentation](https://docs.abpjs.io/docs/packages/theme-shared/overview)** | **[Report Issues](https://github.com/abpjs/abp-react/issues)**
