# Contributing to @abpjs/abp-react

Thank you for your interest in contributing to the ABP Framework React frontend! This document provides guidelines and instructions for contributing.

## 🎯 How to Contribute

We welcome contributions in many forms:

- **Translation Work**: Help translate Angular components to React
- **Bug Reports**: Report issues you encounter
- **Feature Requests**: Suggest new features or improvements
- **Documentation**: Improve documentation and examples
- **Testing**: Help test packages and report issues
- **Code Reviews**: Review pull requests

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git

### Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/abp-react.git
   cd abp-react
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Build all packages**:
   ```bash
   pnpm build
   ```

5. **Run tests**:
   ```bash
   pnpm test
   ```

## 📝 Development Workflow

### Making Changes

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes** following our coding standards:
   - Use TypeScript
   - Follow React best practices (functional components, hooks)
   - Maintain type safety
   - Write tests for new features
   - Update documentation as needed

3. **Test your changes**:
   ```bash
   pnpm test
   pnpm lint
   pnpm type-check
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## 🧪 Testing

- Write tests for new features and bug fixes
- Ensure all existing tests pass
- Run `pnpm test` before submitting a PR

## 📚 Code Style

- We use **ESLint** and **Prettier** for code formatting
- Run `pnpm lint` and `pnpm format` before committing
- Follow React best practices:
  - Use functional components with hooks
  - Prefer `useState` and `useEffect` over class components
  - Use TypeScript for type safety
  - Keep components small and focused

## 🔄 Translation Guidelines

If you're contributing translations from Angular to React:

1. **Preserve Logic**: Keep the same business logic and algorithms
2. **Update Patterns**: Convert Angular patterns to React equivalents
   - `@Component` → Functional component with hooks
   - `@Injectable` service → React Context or custom hooks
   - RxJS Observables → React hooks with proper cleanup
3. **Maintain Types**: Keep TypeScript interfaces and types
4. **Test Compatibility**: Ensure tests work with React testing libraries
5. **Documentation**: Update comments to reflect React patterns

## 📋 Pull Request Process

1. **Update documentation** if you've changed functionality
2. **Add tests** for new features
3. **Ensure all tests pass** and code is linted
4. **Update CHANGELOG.md** if applicable (coming soon)
5. **Link any related issues** in your PR description

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Tests have been added/updated
- [ ] All tests pass
- [ ] Documentation has been updated
- [ ] No linter errors
- [ ] Type checking passes

## 🐛 Reporting Bugs

When reporting bugs, please include:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: Node.js version, pnpm version, OS
- **Screenshots**: If applicable

## 💡 Feature Requests

When suggesting features:

- **Use Case**: Describe the use case and why it's needed
- **Proposed Solution**: How you envision it working
- **Alternatives**: Any alternative solutions you've considered

## 📄 License

By contributing, you agree that your contributions will be licensed under the LGPL-3.0 License.

## 🙏 Thank You!

Your contributions help make this project better for everyone. We appreciate your time and effort!
