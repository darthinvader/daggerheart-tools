# Development Tools & Code Quality Setup

This project now includes a comprehensive set of development tools and code quality measures to ensure consistent, high-quality code. Here's what has been configured:

## 🎨 Code Formatting

### Prettier

- **Configuration**: `.prettierrc.json`
- **Features**:
  - Automatic code formatting on save
  - Import sorting with custom groups (React, external libs, internal)
  - Tailwind CSS class sorting
  - Consistent semicolons, single quotes, and 80-character line width

### Usage

```bash
pnpm format          # Format all files
pnpm format:check    # Check formatting without changes
```

## 🔧 Code Linting

### ESLint

- **Configuration**: `eslint.config.js` (Flat Config format)
- **Features**:
  - TypeScript-specific rules
  - React hooks validation
  - Code quality enforcement
  - Accessibility checks (basic)
  - Integration with Prettier

### Usage

```bash
pnpm lint            # Check for linting issues
pnpm lint:fix        # Fix auto-fixable issues
```

## 🚀 Type Checking

### TypeScript

- **Configuration**: `tsconfig.json`
- **Features**:
  - Strict type checking
  - No-emit mode for validation only

### Usage

```bash
pnpm type-check      # Run TypeScript compiler checks
```

## 🧪 Testing

### Vitest

- **Configuration**: Already configured in `vite.config.ts`
- **Features**:
  - Fast test execution
  - Coverage reporting
  - UI mode available

### Usage

```bash
pnpm test            # Run tests in watch mode
pnpm test --run      # Run tests once
pnpm test:coverage   # Run tests with coverage
pnpm test:ui         # Run tests with UI
```

## 🎣 Git Hooks

### Husky + lint-staged

- **Pre-commit**: Automatically formats and lints staged files
- **Commit-msg**: Validates commit message format

### Commit Message Format

Following conventional commits:

```
feat: add new character validation
fix: resolve equipment schema issue
docs: update development setup guide
```

## 🆚 VS Code Integration

### Settings (`.vscode/settings.json`)

- Format on save enabled
- ESLint auto-fix on save
- TypeScript import suggestions
- Prettier as default formatter

### Recommended Extensions (`.vscode/extensions.json`)

- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- Vitest
- Error Lens
- Path Intellisense

## 📦 Available Scripts

| Script               | Description               |
| -------------------- | ------------------------- |
| `pnpm dev`           | Start development server  |
| `pnpm build`         | Build for production      |
| `pnpm lint`          | Run ESLint                |
| `pnpm lint:fix`      | Fix ESLint issues         |
| `pnpm format`        | Format code with Prettier |
| `pnpm format:check`  | Check code formatting     |
| `pnpm type-check`    | Run TypeScript checks     |
| `pnpm test`          | Run tests                 |
| `pnpm test:ui`       | Run tests with UI         |
| `pnpm test:coverage` | Run tests with coverage   |
| `pnpm preview`       | Preview production build  |

## 🔍 Quality Checks Script

A convenience script is available at `scripts/check.sh` that runs all quality checks:

- Type checking
- Code formatting verification
- Linting
- Tests

## 🛠️ Development Workflow

1. **Write Code**: VS Code will automatically format and show linting errors
2. **Commit Changes**: Git hooks ensure code quality before commits
3. **Push Changes**: All checks pass automatically

## 📋 Code Quality Rules

### TypeScript

- Unused variables trigger errors (prefix with `_` to ignore)
- Explicit `any` types trigger warnings
- Prefer const over let
- Use template strings over concatenation

### React

- Hooks rules enforced
- Components should export as default for hot reload
- Exhaustive dependencies in useEffect

### General

- No console statements in production code (warnings)
- Object shorthand notation preferred
- Import organization and deduplication

## 🎯 Benefits

✅ **Consistent Code Style**: Prettier ensures uniform formatting
✅ **Early Bug Detection**: ESLint catches potential issues
✅ **Type Safety**: TypeScript prevents runtime errors
✅ **Automated Quality**: Git hooks prevent bad code from being committed
✅ **Developer Experience**: VS Code integration for seamless development
✅ **Team Collaboration**: Shared configs ensure everyone follows same standards

## 🔧 Troubleshooting

### ESLint Issues

- Run `pnpm lint:fix` to auto-fix common issues
- Check `.eslintignore` if files should be excluded

### Prettier Issues

- Run `pnpm format` to fix formatting
- Check `.prettierignore` for excluded files

### Type Errors

- Run `pnpm type-check` to see detailed type errors
- Ensure all dependencies have proper type definitions
