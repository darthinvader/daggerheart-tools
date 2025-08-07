# Active Context - Daggerheart Tools

## Current Work Focus

### Library Schema Development

Currently working on the core data models and validation schemas that form the foundation of the application. The focus is on implementing comprehensive type-safe schemas for all game systems.

### Recently Completed

- **Domain Card System**: Complete implementation of all 9 core domains
  - Individual domain card files with full SRD data
  - Schema validation for card structure and properties
  - Type-safe exports and constants for each domain
  - Support for future domains (Chaos, Moon, Sun, Blood, Fate)

- **Class System Foundation**: Comprehensive class schema architecture
  - All 9 classes with subclass variants implemented
  - Level progression and tier-based feature unlocking
  - Point-based level-up system with validation
  - Multiclassing support with proper restrictions
  - Companion system for Ranger Beastbound subclass

### Current Sprint

**Schema Completion & Validation**

- Finalizing player character schema with all game systems
- Integration testing between domain cards and character classes
- Validation rule implementation for character creation constraints

## Next Immediate Steps

1. **Character Schema Completion**
   - Finish player character schema with all remaining fields
   - Add equipment and inventory management schemas
   - Implement character progression tracking

2. **Schema Integration Testing**
   - Validate cross-references between classes and domains
   - Test multiclassing rule enforcement
   - Verify level-up point calculations

3. **UI Component Planning**
   - Design character creation flow components
   - Plan domain card display and selection interfaces
   - Character sheet layout and responsive design

## Active Decisions & Considerations

### Schema Design Patterns

- **Discriminated Unions**: Using for type-safe class and subclass selection
- **Const Assertions**: All game data marked `as const` for immutability
- **Schema Composition**: Building complex schemas from reusable components
- **Validation Layers**: Runtime validation with compile-time type safety

### Data Architecture Choices

- **Domain Organization**: Each domain in separate files for maintainability
- **Export Consistency**: Standardized exports across all domain files
- **Type Inference**: Leveraging Zod's `z.infer` for automatic TypeScript types
- **Future Extensibility**: Structure supports additional content and homebrew

### Performance Considerations

- **Bundle Size**: Separating schemas to enable code splitting
- **Validation Efficiency**: Reusing compiled schema instances
- **Memory Usage**: Flat data structures for better serialization

## Technical Debt & Known Issues

### Current Limitations

- Some domain cards lack complete implementation details
- Character sheet UI components not yet started
- No persistence layer for character data
- Mobile responsiveness not yet tested

### Future Refactoring Needs

- Consider schema optimization for bundle size
- Evaluate runtime validation performance with large datasets
- Plan for internationalization support
- Design system for homebrew content integration

## Decision Log

### Recent Architectural Decisions

1. **Zod for Validation**: Chosen over alternatives for TypeScript integration
2. **File-based Domain Organization**: Each domain in separate file for clarity
3. **Const Assertion Strategy**: All game data immutable for type safety
4. **Discriminated Union Pattern**: Type-safe polymorphic data structures

### Pending Decisions

- Character data persistence strategy (localStorage vs IndexedDB)
- UI state management approach (React Context vs external library)
- Mobile-first vs desktop-first responsive design
- Offline capability requirements and implementation

## Context for Next Session

When resuming work, the focus should be on:

1. Completing any remaining character schema fields
2. Beginning UI component development for character creation
3. Testing schema validation with realistic character data
4. Planning the character sheet interface design

The foundation of type-safe schemas is nearly complete, providing a solid base for building the user interface and character management features.
