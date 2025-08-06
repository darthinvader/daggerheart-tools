# Copilot Processing

## User Request

Update the player character to have a domain cards list, a vault and a loadout, that all are domain cards list, also update the domain cards, we dont want just the names.

## Request Analysis

- Need to modify PlayerCharacterSchema to include:
  - Domain cards list (general collection)
  - Vault (stored domain cards)
  - Loadout (active domain cards)
- Need to update domain card structure to include full card data instead of just names
- All three collections should contain actual domain card objects, not just string names

## Dependencies

- Current domain card structure uses only names/strings
- Need to examine existing domain card schema and data structures
- Player character schema currently has domains with just card names

## Action Plan

### Phase 1: Update Domain Card Schema

- [COMPLETE] Modify DomainCardSchema to be the primary structure
- [COMPLETE] Update CharacterDomainSchema to use full DomainCard objects
- [COMPLETE] Create DomainCardCollectionSchema for vault/loadout

### Phase 2: Update Player Character Schema

- [COMPLETE] Replace current domains array with three collections:
  - domainCards: all available cards
  - vault: stored cards
  - loadout: active cards
- [COMPLETE] Update validation logic for domain cards

### Phase 3: Update Domain Exports

- [COMPLETE] Ensure all domain files export DomainCard[] arrays instead of string names
- [COMPLETE] Update index.ts exports to maintain backward compatibility

### Phase 4: Testing and Validation

- [COMPLETE] Verify schema changes don't break existing validation
- [COMPLETE] Test with sample character data

## Summary

Successfully updated the player character schema with the following changes:

### Domain Card Structure Changes

- **Updated Midnight Domain Cards**: Converted from Record format to array format for consistency with other domains
- **Enhanced Domain Card Schema**: Added `DomainCardCollectionSchema` for better type safety
- **Maintained Backward Compatibility**: Legacy `domains` field preserved for existing characters

### Player Character Schema Updates

- **Added Three Domain Card Collections**:
  - `domainCards`: All available domain cards for the character
  - `vault`: Stored/inactive domain cards not currently in use
  - `loadout`: Active domain cards ready for use
- **Updated Validation Logic**: Enhanced validation to check domain cards against their respective domain collections
- **Type Safety**: All domain card collections use full `DomainCard` objects with complete card data

### Benefits

- **Rich Domain Card Data**: Characters now store complete card information (level, type, description, recall cost)
- **Flexible Card Management**: Separate collections for organizing cards by usage state
- **Consistent Structure**: All domain cards now use the same array format
- **Strong Validation**: Domain cards are validated against their respective domain collections

The schema now supports the requested domain card collections while maintaining backward compatibility and type safety.
