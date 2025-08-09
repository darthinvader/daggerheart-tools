# Technical Context - Daggerheart Tools

## Technology Stack

### Core Framework

- React 19.x (react 19.1)
- TypeScript 5.8 (strict)
- Vite 7.x with HMR and optimized bundling
- TanStack Router v1 (with plugin)

### UI & Styling

- Tailwind CSS v4
- Shadcn/ui (planned), Radix UI primitives
- Lucide React icons

### Development Tools

- pnpm
- Workspace: no packages/\* currently; `pnpm-workspace.yaml` lists built deps only
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting with consistent style
- **Husky**: Git hooks for pre-commit validation
- **lint-staged**: Run linters on staged files only

### Testing & Quality

- **Vitest**: Fast unit testing framework with native ESM support
- **Testing Library**: User-centric testing utilities
- **Coverage Reporting**: Comprehensive test coverage tracking
- **Commitlint**: Conventional commit message enforcement

### Data Validation

- **Zod**: TypeScript-first schema validation library
- **Runtime Type Checking**: All user input validated against schemas
- **Type Inference**: Automatic TypeScript types from Zod schemas

### Project Configuration

Package Manager Setup (from package.json)

- Engines: Node >=18, pnpm >=8
- packageManager unspecified; using workspace root pnpm

### TypeScript Configuration

- Strict mode enabled
- Path mapping: `@/*` → `src/*`
- Targets: ES2022 (app), ES2023 (node)
- ModuleResolution: bundler

### Build Configuration

- Vite config present; code splitting via default Rollup
- Size-Limit configured (500 KB bundle target)

## Development Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm 8+ (for workspace support)
- Modern browser with ES2022 support

### Local Development

Commands (pnpm scripts): install, dev, build, test, coverage, preview

### Development Workflow

1. **Feature Development**: Create feature branch from main
2. **Code Quality**: Pre-commit hooks ensure linting and formatting
3. **Testing**: Write tests alongside feature development
4. **Commit Standards**: Conventional commits for clear history
5. **Pull Request**: Code review before merge

## Technical Constraints

### Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Support**: iOS Safari 14+, Chrome Mobile 90+
- **No IE Support**: Modern ES2022 features required

### Performance Requirements

- **Initial Load**: < 3 seconds on 3G networks
- **Runtime Performance**: 60fps animations and interactions
- **Bundle Size**: < 500KB initial bundle, code splitting for routes
- **Memory Usage**: < 50MB for typical character sheets

### Accessibility Standards

- **WCAG 2.1 AA**: Full compliance for screen readers and keyboard navigation
- **Semantic HTML**: Proper document structure and landmarks
- **Color Contrast**: 4.5:1 minimum ratio for text
- **Focus Management**: Clear focus indicators and logical tab order

### Dependencies

Core Dependencies (selected)

- react/react-dom ^19.1.0
- @tanstack/react-router ^1.130.x
- zod ^4.0.14
- tailwindcss ^4.1.11, tailwind-merge ^3.3.1
- lucide-react ^0.536.0

Development Dependencies (selected)

- typescript ~5.8.3, vite ^7.0.6, vitest ^3.2.4
- eslint ^9.x, prettier ^3.x, husky ^9.x, lint-staged ^16.x
- testing-library, jsdom, size-limit, madge, knip, ts-prune, oxlint

### Optional Dependencies

- `@vitejs/plugin-react`: React integration for Vite
- `autoprefixer`: CSS vendor prefixing
- `postcss`: CSS processing pipeline

## Security Considerations

### Input Validation

- All user input validated with Zod schemas
- XSS prevention through React's built-in escaping
- No `dangerouslySetInnerHTML` usage

### Data Storage

- Local storage for character data (user-controlled)
- No sensitive data collection
- Client-side only application (no server vulnerabilities)

### Dependencies

- Regular dependency updates for security patches
- Audit with `pnpm audit` in CI/CD
- Minimal dependency footprint to reduce attack surface

## Future Technical Considerations

### Scalability

- Component library extraction potential
- Backend API integration readiness
- Multi-tenancy support for campaigns

### Performance

- Service worker for offline capability
- IndexedDB for large character collections
- Lazy loading for domain card images

### Maintenance

- Automated dependency updates
- Long-term TypeScript support
- React/Vite migration strategy

Note (Aug 9, 2025): Verified type-check passes and build path compiles locally.
