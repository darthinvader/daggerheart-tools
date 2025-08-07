# Technical Context - Daggerheart Tools

## Technology Stack

### Core Framework

- **React 19+**: Latest React with concurrent features and improved TypeScript support
- **TypeScript 5.x**: Strict mode enabled for maximum type safety
- **Vite**: Fast build tool with HMR and optimized bundling
- **TanStack Router**: File-based routing with type-safe navigation

### UI & Styling

- **Tailwind CSS**: Utility-first CSS framework for rapid development
- **Shadcn/ui**: High-quality React components built on Radix UI
- **Radix UI**: Accessible, unstyled component primitives
- **Lucide React**: Icon library with consistent design

### Development Tools

- **pnpm**: Fast, disk space efficient package manager
- **Workspace Configuration**: Monorepo setup for potential future expansion
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

## Project Configuration

### Package Manager Setup

```json
{
  "packageManager": "pnpm@9.x",
  "workspaces": ["packages/*"],
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

### TypeScript Configuration

- **Strict Mode**: Full strict type checking enabled
- **Path Mapping**: Clean imports with `@/` prefix
- **ESNext Target**: Modern JavaScript features
- **Module Resolution**: Node16 for compatibility

### Build Configuration

- **Vite Config**: Optimized for development and production
- **Code Splitting**: Automatic chunking for optimal loading
- **Asset Optimization**: Image and font optimization
- **Environment Variables**: Type-safe environment configuration

## Development Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm 8+ (for workspace support)
- Modern browser with ES2022 support

### Local Development

```bash
pnpm install          # Install dependencies
pnpm dev             # Start development server
pnpm build           # Production build
pnpm test            # Run test suite
pnpm test:coverage   # Generate coverage report
```

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

## Dependencies

### Core Dependencies

- `react` & `react-dom`: ^19.0.0 - Core React framework
- `@tanstack/router`: ^1.x - Type-safe routing
- `zod`: ^3.x - Schema validation
- `clsx`: ^2.x - Conditional className utility
- `tailwind-merge`: ^2.x - Tailwind class merging

### Development Dependencies

- `typescript`: ^5.x - TypeScript compiler
- `vite`: ^5.x - Build tool and dev server
- `vitest`: ^1.x - Testing framework
- `eslint`: ^8.x - Code linting
- `prettier`: ^3.x - Code formatting
- `@types/*`: TypeScript definitions

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
- React version migration strategy
