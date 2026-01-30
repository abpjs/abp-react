# @abpjs/language-management

> Language management UI components for ABP Framework in React

[![npm version](https://img.shields.io/npm/v/@abpjs/language-management.svg)](https://www.npmjs.com/package/@abpjs/language-management)
[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL--3.0-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

## Overview

`@abpjs/language-management` provides language management components for ABP-based React applications. It allows managing languages, cultures, and localization texts through a unified UI.

This package is a React translation of the original `@volo/abp.ng.language-management` Angular package.

## Features

- **Languages Management** - Create, edit, delete, and set default languages
- **Culture Support** - Select from available cultures when creating languages
- **Language Texts** - Browse, search, edit, and restore localization strings
- **Resource Filtering** - Filter language texts by localization resource
- **TypeScript** - Full type safety with comprehensive definitions

## Installation

```bash
# Using npm
npm install @abpjs/language-management

# Using yarn
yarn add @abpjs/language-management

# Using pnpm
pnpm add @abpjs/language-management
```

### Required Dependencies

This package requires the following peer dependencies:

```bash
npm install @abpjs/core @abpjs/theme-shared react-router-dom
```

## Quick Start

### Using the Languages Component

```tsx
import { LanguagesComponent } from '@abpjs/language-management';

function LanguagesPage() {
  return (
    <LanguagesComponent
      onLanguageCreated={(lang) => console.log('Created:', lang)}
      onLanguageUpdated={(lang) => console.log('Updated:', lang)}
      onLanguageDeleted={(id) => console.log('Deleted:', id)}
    />
  );
}
```

### Using the Language Texts Component

```tsx
import { LanguageTextsComponent } from '@abpjs/language-management';

function LanguageTextsPage() {
  return (
    <LanguageTextsComponent
      onLanguageTextUpdated={(params) => console.log('Updated:', params)}
      onLanguageTextRestored={(params) => console.log('Restored:', params)}
    />
  );
}
```

### Using the Hooks

```tsx
import { useLanguages, useLanguageTexts } from '@abpjs/language-management';

function CustomLanguagesView() {
  const {
    languages,
    cultures,
    isLoading,
    fetchLanguages,
    fetchCultures,
    createLanguage,
    updateLanguage,
    deleteLanguage,
    setAsDefaultLanguage,
  } = useLanguages();

  useEffect(() => {
    fetchLanguages();
    fetchCultures();
  }, [fetchLanguages, fetchCultures]);

  return (
    <ul>
      {languages.map(lang => (
        <li key={lang.id}>
          {lang.flagIcon} {lang.displayName}
          {lang.isDefaultLanguage && ' (Default)'}
        </li>
      ))}
    </ul>
  );
}
```

## Components

### LanguagesComponent

Component for managing languages with full CRUD operations.

```tsx
import { LanguagesComponent } from '@abpjs/language-management';

<LanguagesComponent
  onLanguageCreated={(language) => {}}
  onLanguageUpdated={(language) => {}}
  onLanguageDeleted={(id) => {}}
/>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onLanguageCreated` | `(language: Language) => void` | No | Callback when a language is created |
| `onLanguageUpdated` | `(language: Language) => void` | No | Callback when a language is updated |
| `onLanguageDeleted` | `(id: string) => void` | No | Callback when a language is deleted |

### LanguageTextsComponent

Component for managing language texts (localization strings).

```tsx
import { LanguageTextsComponent } from '@abpjs/language-management';

<LanguageTextsComponent
  onLanguageTextUpdated={(params) => {}}
  onLanguageTextRestored={(params) => {}}
/>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onLanguageTextUpdated` | `(params: LanguageTextUpdateByNameParams) => void` | No | Callback when a text is updated |
| `onLanguageTextRestored` | `(params: LanguageTextRequestByNameParams) => void` | No | Callback when a text is restored |

## Hooks

### useLanguages

Hook for managing languages and cultures.

```tsx
import { useLanguages } from '@abpjs/language-management';

const {
  languages,            // All languages
  totalCount,           // Total count for pagination
  cultures,             // Available cultures
  selectedLanguage,     // Currently selected language
  isLoading,           // Loading state
  error,               // Error message
  fetchLanguages,      // Fetch languages with optional params
  fetchCultures,       // Fetch available cultures
  getLanguageById,     // Get and select a language by ID
  createLanguage,      // Create a new language
  updateLanguage,      // Update an existing language
  deleteLanguage,      // Delete a language
  setAsDefaultLanguage, // Set a language as default
  setSelectedLanguage, // Set the selected language
  reset,               // Reset state
} = useLanguages();
```

### useLanguageTexts

Hook for managing language texts.

```tsx
import { useLanguageTexts } from '@abpjs/language-management';

const {
  languageTexts,           // Language texts list
  totalCount,              // Total count for pagination
  resources,               // Available localization resources
  selectedLanguageText,    // Currently selected text
  isLoading,              // Loading state
  error,                  // Error message
  fetchLanguageTexts,     // Fetch texts with query params
  fetchResources,         // Fetch available resources
  getLanguageTextByName,  // Get and select a text by name
  updateLanguageTextByName, // Update a text
  restoreLanguageTextByName, // Restore a text to default
  setSelectedLanguageText, // Set the selected text
  reset,                   // Reset state
} = useLanguageTexts();
```

## Services

### LanguageManagementService

Service class for language management API operations.

```tsx
import { LanguageManagementService } from '@abpjs/language-management';
import { useRestService } from '@abpjs/core';

function MyComponent() {
  const restService = useRestService();
  const service = new LanguageManagementService(restService);

  // Languages
  await service.getLanguages();
  await service.getLanguageById(id);
  await service.createLanguage(data);
  await service.updateLanguage(id, data);
  await service.deleteLanguage(id);
  await service.setAsDefaultLanguage(id);

  // Cultures and Resources
  await service.getCultures();
  await service.getResources();

  // Language Texts
  await service.getLanguageTexts(params);
  await service.updateLanguageTextByName(params);
  await service.restoreLanguageTextByName(params);
}
```

## Data Models

### Language

```typescript
interface Language {
  id: string;
  cultureName: string;
  uiCultureName: string;
  displayName: string;
  flagIcon: string;
  isEnabled: boolean;
  isDefaultLanguage: boolean;
  creationTime: string;
  creatorId: string;
}
```

### LanguageText

```typescript
interface LanguageText {
  resourceName: string;
  cultureName: string;
  baseCultureName: string;
  baseValue: string;
  name: string;
  value: string;
}
```

### Culture

```typescript
interface Culture {
  displayName: string;
  name: string;
}
```

## Constants

### LANGUAGE_MANAGEMENT_ROUTES

Default route configuration for the language management module:

```tsx
import { LANGUAGE_MANAGEMENT_ROUTES } from '@abpjs/language-management';

// Use in your router configuration
const routes = [
  ...LANGUAGE_MANAGEMENT_ROUTES.routes,
  // your other routes
];
```

## Router Setup Example

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  LanguagesComponent,
  LanguageTextsComponent
} from '@abpjs/language-management';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/language-management">
          <Route index element={<Navigate to="languages" replace />} />
          <Route path="languages" element={<LanguagesComponent />} />
          <Route path="texts" element={<LanguageTextsComponent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

## Related Packages

- [@abpjs/core](https://www.npmjs.com/package/@abpjs/core) - Core infrastructure (required)
- [@abpjs/theme-shared](https://www.npmjs.com/package/@abpjs/theme-shared) - Shared UI components (required)
- [@abpjs/identity-pro](https://www.npmjs.com/package/@abpjs/identity-pro) - Identity Pro features

## Contributing

This package is part of the [ABP React](https://github.com/abpjs/abp-react) monorepo. Contributions are welcome!

## License

LGPL-3.0 - See [LICENSE](https://github.com/abpjs/abp-react/blob/main/LICENSE) for details.

---

**[View Full Documentation](https://docs.abpjs.io/docs/packages/language-management/overview)** | **[Report Issues](https://github.com/abpjs/abp-react/issues)** | **[View Source](https://github.com/abpjs/abp-react/tree/main/packages/language-management)**
