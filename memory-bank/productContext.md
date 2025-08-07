# Product Context - Daggerheart Tools

## Why This Project Exists

Daggerheart is a new TTRPG system that prioritizes narrative gameplay and player agency. However, the current ecosystem lacks comprehensive digital tools for character management and gameplay support. This project fills that gap by providing a complete web-based toolkit.

## Problems It Solves

### For Players

- **Character Creation Complexity**: Streamlines the multi-step process of creating characters with proper validation
- **Character Sheet Management**: Digital alternative to paper sheets with automatic calculations
- **Domain Card Tracking**: Easy access to 200+ spells and abilities across 9 domains
- **Level-Up Planning**: Clear visualization of advancement options and multiclassing paths

### For Game Masters

- **Rule Reference**: Quick lookup for game mechanics and character abilities
- **Character Validation**: Ensures character builds follow official rules
- **Session Preparation**: Access to all player character details and capabilities

### For the Community

- **Standardization**: Consistent character data format for sharing builds
- **Accessibility**: Web-based tool available on any device
- **Accuracy**: Single source of truth based on official SRD

## How It Should Work

### Character Creation Flow

1. **Identity Phase**: Select ancestry, community, and background
2. **Class Phase**: Choose primary class and subclass with domain access
3. **Trait Allocation**: Distribute starting trait points with restrictions
4. **Equipment Setup**: Configure starting gear and class items
5. **Domain Cards**: Select initial spells/abilities from available domains
6. **Finalization**: Review and validate complete character

### Character Management

- **Live Updating**: Real-time validation and calculation updates
- **Level Progression**: Point-based advancement with clear options
- **Multiclassing**: Support for advanced character builds
- **Export/Import**: Save and share character builds

### Data Integrity

- **Schema Validation**: All character data validated against Zod schemas
- **Rule Enforcement**: Automatic prevention of invalid builds
- **Version Control**: Track character changes over time

## User Experience Goals

### Simplicity First

- Intuitive interface that guides users through complex rules
- Clear error messages with suggestions for fixes
- Progressive disclosure of advanced features

### Mobile Responsive

- Usable character sheets on phones and tablets
- Touch-friendly interface for table play
- Offline capability for core features

### Performance

- Fast loading and responsive interactions
- Minimal network requirements
- Efficient data structures and caching

## Target Audience

### Primary Users

- **New Players**: Need guidance through character creation
- **Experienced Players**: Want efficient tools for complex builds
- **Game Masters**: Require oversight of player characters

### Secondary Users

- **Content Creators**: Building homebrew content and guides
- **Community Leaders**: Running organized play events
