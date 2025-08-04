// Quick validation test for enhanced character model
import elara from './exampleCharacter';
import { validateCharacter, getSRDCompliance, getHomebrewFriendlyValidation } from './daggerheartValidation';

console.log('Testing Enhanced Character Model Validation...\n');

// Test standard validation
console.log('=== Standard Validation ===');
const standardResult = validateCharacter(elara);
console.log('Valid:', standardResult.valid);
if (!standardResult.valid) {
  console.log('Errors:', standardResult.errors);
}

// Test SRD compliance
console.log('\n=== SRD Compliance Check ===');
const srdResult = getSRDCompliance(elara);
console.log('SRD Compliant:', srdResult.valid);
if (!srdResult.valid) {
  console.log('SRD Issues:', srdResult.errors);
}

// Test homebrew-friendly validation
console.log('\n=== Homebrew-Friendly Validation ===');
const homebrewResult = getHomebrewFriendlyValidation(elara);
console.log('Homebrew Valid:', homebrewResult.valid);
if (!homebrewResult.valid) {
  console.log('Homebrew Issues:', homebrewResult.errors);
}

// Test character features
console.log('\n=== Character Features ===');
console.log('Name:', elara.name);
console.log('Level:', elara.level, '| Tier:', elara.tier);
console.log('Class:', elara.classKit.className);
console.log('Ancestry:', elara.heritage.ancestry);
console.log('Community:', elara.heritage.community);

// Test enhanced features
console.log('\n=== Enhanced Features ===');
console.log('Death Moves Available:', elara.mortality.resurrectionCount < 3);
console.log('Current Hope:', elara.resources.hope.current);
console.log('Current Fear:', elara.resources.fear?.current || 0);
console.log('Active Conditions:', elara.dynamicState.conditions.length);
console.log('Advancement Choices Made:', elara.advancement.choicesMade.length);

console.log('\n✅ Enhanced character model validation complete!');
