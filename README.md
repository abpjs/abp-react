# @abpjs/abp-react

> ABP Framework for React - A React frontend replacement for the ABP Angular frontend

[![License: LGPL v3](https://img.shields.io/badge/License-LGPL_v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)
[![Version](https://img.shields.io/badge/version-2.1.1-blue)](https://github.com)
[![Work in Progress](https://img.shields.io/badge/status-WIP-orange)](https://github.com)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.28.0-orange)](https://pnpm.io/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](https://github.com)
[![Lint](https://img.shields.io/badge/lint-passing-brightgreen)](https://github.com)
[![Type Check](https://img.shields.io/badge/type--check-passing-brightgreen)](https://github.com)
[![Coverage](https://img.shields.io/badge/coverage-coming%20soon-lightgrey)](https://github.com)

<!-- Uncomment these when you set up GitHub Actions CI/CD -->
<!-- [![Build](https://github.com/YOUR_USERNAME/abp-react/actions/workflows/build.yml/badge.svg)](https://github.com/YOUR_USERNAME/abp-react/actions/workflows/build.yml) -->
<!-- [![Tests](https://github.com/YOUR_USERNAME/abp-react/actions/workflows/test.yml/badge.svg)](https://github.com/YOUR_USERNAME/abp-react/actions/workflows/test.yml) -->
<!-- [![Lint](https://github.com/YOUR_USERNAME/abp-react/actions/workflows/lint.yml/badge.svg)](https://github.com/YOUR_USERNAME/abp-react/actions/workflows/lint.yml) -->
<!-- [![Type Check](https://github.com/YOUR_USERNAME/abp-react/actions/workflows/type-check.yml/badge.svg)](https://github.com/YOUR_USERNAME/abp-react/actions/workflows/type-check.yml) -->

## 🚧 Work in Progress

**This project is currently under active development.** We are building a React frontend replacement for the ABP Framework, translating the Angular frontend packages to React while maintaining full compatibility with the existing ABP Framework backend.

## 📖 Overview

This repository is a **monorepo** containing React frontend packages that work with the ABP Framework backend. Our goal is to enable organizations to use React for their frontend while continuing to use the powerful ABP Framework backend they already know and love.

**Important**: This project replaces only the **frontend** layer. The ABP Framework backend remains unchanged - you continue using the same ABP Framework backend APIs, authentication, and services.

### Why This Project?

The ABP Framework is an amazing, comprehensive framework for building enterprise applications. While the original Angular frontend is excellent, we believe that providing a React frontend option will:

- **Expand Use Cases**: Enable organizations already using React to adopt ABP Framework backend
- **Provide Flexibility**: Give teams the choice between Angular and React frontends while using the same ABP Framework backend
- **Support Legacy Versions**: Start from the initial version to support organizations using older versions of ABP Framework backend
- **Maintain Compatibility**: Keep the same API contracts and functionality as the Angular frontend, working seamlessly with existing ABP Framework backends

### Our Philosophy

**Angular is great. React is great.** Both are excellent frameworks with their own strengths. We're not here to debate which is better—we're here to support both. This project is a testament to our belief that developers should have the freedom to choose the framework that best fits their needs and team expertise.

## 🎯 Goals

1. **Version-by-Version Translation**: We process ABP Framework frontend packages sequentially, starting from the initial version, to ensure support for organizations using older ABP Framework backend versions
2. **Backend Compatibility**: Maintain full compatibility with existing ABP Framework backends - no backend changes required
3. **API Compatibility**: Maintain the same public API as the Angular frontend packages for easy migration
4. **Complete Frontend Feature Parity**: Translate all frontend features, components, and functionality from Angular to React
5. **Modern React Patterns**: Use modern React best practices (hooks, functional components, Context API)
6. **TypeScript Support**: Maintain strong typing throughout

## 📦 Packages

This monorepo contains the following packages:

### Core Packages

| Package | Description |
|---------|-------------|
| [`@abpjs/core`](./packages/core) | Core ABP Framework functionality - hooks, services, state management, authentication |
| [`@abpjs/account`](./packages/account) | Account module - login, register, tenant switching |
| [`@abpjs/feature-management`](./packages/feature-management) | Feature management components - toggle and configure features |
| [`@abpjs/identity`](./packages/identity) | Identity management - users, roles, claims |
| [`@abpjs/permission-management`](./packages/permission-management) | Permission management components |
| [`@abpjs/setting-management`](./packages/setting-management) | Setting management - application settings configuration |
| [`@abpjs/tenant-management`](./packages/tenant-management) | Tenant management components |
| [`@abpjs/theme-basic`](./packages/theme-basic) | Basic theme layouts and navigation components |
| [`@abpjs/theme-shared`](./packages/theme-shared) | Shared theme components - toasts, modals, confirmations |

### Pro Packages

| Package | Description |
|---------|-------------|
| [`@abpjs/account-pro`](./packages/account-pro) | Account Pro module - enhanced login, register, password reset, two-factor auth |
| [`@abpjs/audit-logging`](./packages/audit-logging) | Audit logging components - view and search audit logs |
| [`@abpjs/identity-pro`](./packages/identity-pro) | Identity Pro management - enhanced users, roles, organization units |
| [`@abpjs/language-management`](./packages/language-management) | Language management - manage languages and localization texts |
| [`@abpjs/saas`](./packages/saas) | SaaS module - tenants, editions, and subscription management |

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 10.0.0

### Installation

```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Install all dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

### Usage

```bash
# Install a specific package
pnpm add @abpjs/core @abpjs/theme-basic

# Or install all packages you need
pnpm add @abpjs/core @abpjs/account @abpjs/identity @abpjs/theme-basic
```

### Example

```tsx
import { AbpProvider } from '@abpjs/core';
import { ThemeBasicProvider } from '@abpjs/theme-basic';
import { AccountProvider } from '@abpjs/account';

function App() {
  return (
    <AbpProvider environment={environment} routes={routes}>
      <ThemeBasicProvider>
        <AccountProvider>
          {/* Your app */}
        </AccountProvider>
      </ThemeBasicProvider>
    </AbpProvider>
  );
}
```

## 🏗️ Project Structure

```
.
├── packages/              # All packages
│   ├── core/              # Core functionality
│   ├── account/           # Account module
│   ├── account-pro/       # Account Pro module
│   ├── audit-logging/     # Audit logging
│   ├── feature-management/
│   ├── identity/          # Identity module
│   ├── identity-pro/      # Identity Pro module
│   ├── language-management/
│   ├── permission-management/
│   ├── saas/              # SaaS module
│   ├── setting-management/
│   ├── tenant-management/
│   ├── theme-basic/
│   └── theme-shared/
├── apps/                  # Applications
│   └── testing/           # Test application
├── package.json           # Root package.json with workspace config
├── pnpm-workspace.yaml
└── README.md
```

## 🛠️ Development

```bash
# Run dev mode for all packages
pnpm dev

# Run dev mode for a specific package
cd packages/core
pnpm dev

# Lint all packages
pnpm lint

# Format code
pnpm format

# Type check
pnpm type-check
```

## 📝 Translation Strategy

We follow a systematic approach to ensure quality and completeness:

1. **Version-by-Version**: Process ABP Framework frontend packages sequentially, matching backend API versions
2. **Package-by-Package**: Translate each frontend package independently
3. **Dependency Mapping**: Map Angular frontend dependencies to React equivalents
4. **Backend API Compatibility**: Ensure all frontend packages work with the corresponding ABP Framework backend version
5. **Validation**: Build, lint, and test each translated version before proceeding

### Angular to React Conversion Patterns

- **Components**: Angular `@Component` → React functional components with hooks
- **Services**: Angular `@Injectable` → React Context or custom hooks
- **Dependency Injection**: Constructor injection → React Context API
- **RxJS Observables**: Converted to React hooks with proper cleanup
- **Forms**: Angular Reactive Forms → `react-hook-form`
- **State Management**: RxJS Services → React Context and Redux
- **Backend Integration**: Same REST API calls, same authentication flows, same data contracts

## 🙏 Acknowledgments

This project is inspired by and built upon the amazing work of the ABP Framework team. We have tremendous respect for the original Angular frontend implementation and the incredible team behind the ABP Framework. This React frontend is our way of extending the ABP Framework's reach by providing an alternative frontend option while learning from and honoring the original work.

**We love the ABP Framework, and that's why we're proud to be working on this React frontend replacement that works seamlessly with the existing ABP Framework backend.**

## 📄 License

This project is licensed under the [LGPL-3.0 License](./LICENSE).

## 🤝 Contributing

Contributions are welcome! Since this is a work in progress, we appreciate any help with:

- Translation of Angular components to React
- Testing and validation
- Documentation
- Bug reports
- Feature suggestions

Please see our contributing guidelines (coming soon) for more details.

## 📚 Documentation

### Core Packages
- [Core Package Documentation](./packages/core/README.md)
- [Account Package Documentation](./packages/account/README.md)
- [Feature Management Package Documentation](./packages/feature-management/README.md)
- [Identity Package Documentation](./packages/identity/README.md)
- [Setting Management Package Documentation](./packages/setting-management/README.md)
- [Theme Basic Usage Guide](./packages/theme-basic/USAGE.md)

### Pro Packages
- [Account Pro Package Documentation](./packages/account-pro/README.md)
- [Audit Logging Package Documentation](./packages/audit-logging/README.md)
- [Identity Pro Package Documentation](./packages/identity-pro/README.md)
- [Language Management Package Documentation](./packages/language-management/README.md)
- [SaaS Package Documentation](./packages/saas/README.md)

## 🔗 Links

- [ABP Framework Official Website](https://abp.io/)
- [ABP Framework Documentation](https://docs.abp.io/)

## ⚠️ Status

**Current Version**: 2.1.1 (matching ABP Framework backend version 2.1.1)

This is an active translation project. Frontend features are being added continuously as we work through the ABP Framework frontend packages version by version. All packages are designed to work with the corresponding ABP Framework backend version.

---

**Made with ❤️ by the community, for the community**
