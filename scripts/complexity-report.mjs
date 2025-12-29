#!/usr/bin/env node
/**
 * Complexity Report Script
 *
 * Analyzes code complexity and file sizes, outputting the most complex files,
 * functions, and components to help identify refactoring candidates.
 *
 * Usage:
 *   node scripts/complexity-report.mjs [options]
 *
 * Options:
 *   --top=N        Number of items to show per category (default: 20)
 *   --min-rank=X   Minimum rank to show: A, B, C, D, E, F (default: B)
 *   --json         Output as JSON instead of formatted text
 *   --help         Show this help message
 */
import { execSync } from 'node:child_process';
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { extname, join, relative } from 'node:path';

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  top: 20,
  minRank: 'B',
  json: false,
  help: false,
};

for (const arg of args) {
  if (arg.startsWith('--top=')) {
    options.top = parseInt(arg.split('=')[1], 10);
  } else if (arg.startsWith('--min-rank=')) {
    options.minRank = arg.split('=')[1].toUpperCase();
  } else if (arg === '--json') {
    options.json = true;
  } else if (arg === '--help') {
    options.help = true;
  }
}

if (options.help) {
  console.log(`
Complexity Report - Analyze code complexity and file sizes

Usage:
  pnpm complexity [options]
  node scripts/complexity-report.mjs [options]

Options:
  --top=N        Number of items to show per category (default: 20)
  --min-rank=X   Minimum rank to show: A, B, C, D, E, F (default: B)
  --json         Output as JSON instead of formatted text
  --help         Show this help message

Rank meanings:
  A - Low complexity, simple block
  B - Low complexity, well structured
  C - Moderate complexity
  D - More than moderate complexity
  E - High complexity, alarming
  F - Very high complexity, error-prone
`);
  process.exit(0);
}

// Rank priority (higher = worse)
const rankPriority = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6 };
const minRankPriority = rankPriority[options.minRank] || 2;

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const rankColors = {
  A: colors.green,
  B: colors.cyan,
  C: colors.yellow,
  D: colors.magenta,
  E: colors.red,
  F: `${colors.bright}${colors.red}`,
};

// Directories and patterns to exclude from analysis
const EXCLUDED_DIRS = [
  'node_modules',
  'dist',
  'coverage',
  '.git',
  'public',
  'ui',
];
const EXCLUDED_PATH_PATTERNS = [
  /[\\/]components[\\/]ui[\\/]/, // Exclude components/ui/ folder (shadcn components)
  /[\\/]lib[\\/]data[\\/]/, // Exclude lib/data/ folder (static data files)
  /[\\/]lib[\\/]schemas[\\/]/, // Exclude lib/schemas/ folder (Zod schema definitions)
];

/**
 * Parse .gitignore and return patterns to exclude
 */
function loadGitignorePatterns(rootDir) {
  const gitignorePath = join(rootDir, '.gitignore');
  const patterns = [];

  try {
    if (existsSync(gitignorePath)) {
      const content = readFileSync(gitignorePath, 'utf-8');
      const lines = content.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();
        // Skip empty lines, comments, and negations
        if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) {
          continue;
        }

        // Convert gitignore patterns to regex-friendly patterns
        let pattern = trimmed
          .replace(/\./g, '\\.') // Escape dots
          .replace(/\*/g, '.*') // Convert * to .*
          .replace(/\?/g, '.'); // Convert ? to .

        // Handle directory patterns
        if (trimmed.endsWith('/')) {
          pattern = pattern.slice(0, -2) + '(?:[\\\\/]|$)';
        }

        try {
          patterns.push(new RegExp(pattern));
        } catch {
          // Skip invalid patterns
        }
      }
    }
  } catch {
    // Ignore errors reading .gitignore
  }

  return patterns;
}

/**
 * Check if a file path should be excluded
 */
function shouldExclude(filePath, rootDir, gitignorePatterns) {
  const relativePath = relative(rootDir, filePath);

  // Check excluded path patterns (like components/ui/)
  for (const pattern of EXCLUDED_PATH_PATTERNS) {
    if (pattern.test(filePath) || pattern.test(relativePath)) {
      return true;
    }
  }

  // Check gitignore patterns
  for (const pattern of gitignorePatterns) {
    if (pattern.test(relativePath) || pattern.test(filePath)) {
      return true;
    }
  }

  return false;
}

/**
 * Get all source files recursively
 */
function getSourceFiles(
  dir,
  rootDir,
  gitignorePatterns,
  extensions = ['.ts', '.tsx', '.js', '.jsx']
) {
  const files = [];

  function walk(currentDir) {
    try {
      const entries = readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);
        if (entry.isDirectory()) {
          // Skip excluded directories
          if (!EXCLUDED_DIRS.includes(entry.name)) {
            walk(fullPath);
          }
        } else if (extensions.includes(extname(entry.name))) {
          // Only include if not excluded by patterns
          if (!shouldExclude(fullPath, rootDir, gitignorePatterns)) {
            files.push(fullPath);
          }
        }
      }
    } catch {
      // Ignore permission errors
    }
  }

  walk(dir);
  return files;
}

/**
 * Get file size information
 */
function getFileSizes(files, rootDir) {
  return files
    .map(file => {
      try {
        const stats = statSync(file);
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n').length;
        return {
          file: relative(rootDir, file),
          bytes: stats.size,
          lines,
          sizeKb: (stats.size / 1024).toFixed(2),
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

/**
 * Count React components in a file
 */
function countComponents(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    // Match function components and arrow function components
    const functionComponentPattern =
      /^(?:export\s+)?(?:default\s+)?function\s+([A-Z][a-zA-Z0-9]*)\s*\(/gm;
    const arrowComponentPattern =
      /^(?:export\s+)?(?:const|let)\s+([A-Z][a-zA-Z0-9]*)\s*(?::\s*React\.FC[^=]*)?=\s*(?:\([^)]*\)|[a-zA-Z_][a-zA-Z0-9_]*)\s*=>/gm;
    const classComponentPattern =
      /^(?:export\s+)?(?:default\s+)?class\s+([A-Z][a-zA-Z0-9]*)\s+extends\s+(?:React\.)?(?:Component|PureComponent)/gm;

    const components = new Set();

    let match;
    while ((match = functionComponentPattern.exec(content)) !== null) {
      components.add(match[1]);
    }
    while ((match = arrowComponentPattern.exec(content)) !== null) {
      components.add(match[1]);
    }
    while ((match = classComponentPattern.exec(content)) !== null) {
      components.add(match[1]);
    }

    return Array.from(components);
  } catch {
    return [];
  }
}

/**
 * Simple complexity analysis without external tools
 * Counts nesting depth, conditionals, loops, etc. as a heuristic
 */
function analyzeFileComplexity(filePath, rootDir) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const relativePath = relative(rootDir, filePath);

    // Track functions and their complexity
    const functions = [];
    let currentFunction = null;
    let braceDepth = 0;
    let maxDepth = 0;
    let functionStartLine = 0;

    // Complexity indicators
    const complexityPatterns = {
      conditionals: /\b(if|else\s+if|\?|switch|case)\b/g,
      loops: /\b(for|while|do|forEach|map|filter|reduce|find|some|every)\b/g,
      logicalOps: /(\&\&|\|\||\?\?)/g,
      catches: /\bcatch\b/g,
      returns: /\breturn\b/g,
      ternary: /\?.*:/g,
    };

    // Function detection patterns
    const functionPatterns = [
      /(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/,
      /(?:export\s+)?(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/,
      /(?:export\s+)?(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s+)?[a-zA-Z_$][a-zA-Z0-9_$]*\s*=>/,
      /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*{/, // method in object/class
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;

      // Check for function start
      for (const pattern of functionPatterns) {
        const match = line.match(pattern);
        if (match && !currentFunction) {
          currentFunction = {
            name: match[1],
            startLine: lineNum,
            complexity: 1, // Base complexity
            depth: 0,
            maxDepth: 0,
            conditionals: 0,
            loops: 0,
            lines: 0,
          };
          functionStartLine = lineNum;
          braceDepth = 0;
          break;
        }
      }

      if (currentFunction) {
        // Count braces for depth tracking
        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;
        braceDepth += openBraces - closeBraces;

        if (braceDepth > currentFunction.maxDepth) {
          currentFunction.maxDepth = braceDepth;
        }

        // Count complexity indicators
        currentFunction.conditionals += (
          line.match(complexityPatterns.conditionals) || []
        ).length;
        currentFunction.loops += (
          line.match(complexityPatterns.loops) || []
        ).length;
        currentFunction.complexity += (
          line.match(complexityPatterns.conditionals) || []
        ).length;
        currentFunction.complexity += (
          line.match(complexityPatterns.loops) || []
        ).length;
        currentFunction.complexity +=
          (line.match(complexityPatterns.logicalOps) || []).length * 0.5;
        currentFunction.complexity +=
          (line.match(complexityPatterns.ternary) || []).length * 0.5;

        currentFunction.lines++;

        // Check for function end
        if (braceDepth <= 0 && lineNum > functionStartLine) {
          // Calculate final score
          currentFunction.complexity = Math.round(
            currentFunction.complexity +
              currentFunction.maxDepth * 0.5 +
              (currentFunction.lines > 50
                ? (currentFunction.lines - 50) * 0.1
                : 0)
          );

          // Assign rank based on complexity score
          let rank;
          if (currentFunction.complexity <= 5) rank = 'A';
          else if (currentFunction.complexity <= 10) rank = 'B';
          else if (currentFunction.complexity <= 20) rank = 'C';
          else if (currentFunction.complexity <= 30) rank = 'D';
          else if (currentFunction.complexity <= 40) rank = 'E';
          else rank = 'F';

          currentFunction.rank = rank;
          currentFunction.endLine = lineNum;
          functions.push(currentFunction);
          currentFunction = null;
        }
      }
    }

    // Calculate file-level metrics
    const totalComplexity = functions.reduce((sum, f) => sum + f.complexity, 0);
    const avgComplexity =
      functions.length > 0 ? totalComplexity / functions.length : 0;

    let fileRank;
    if (avgComplexity <= 5) fileRank = 'A';
    else if (avgComplexity <= 10) fileRank = 'B';
    else if (avgComplexity <= 20) fileRank = 'C';
    else if (avgComplexity <= 30) fileRank = 'D';
    else if (avgComplexity <= 40) fileRank = 'E';
    else fileRank = 'F';

    return {
      file: relativePath,
      functions,
      average: {
        rank: avgComplexity,
        label: fileRank,
      },
      totalFunctions: functions.length,
    };
  } catch {
    return null;
  }
}

/**
 * Run complexity analysis using built-in analyzer
 */
function runBuiltInComplexityAnalysis(sourceFiles, rootDir) {
  const results = sourceFiles
    .map(file => analyzeFileComplexity(file, rootDir))
    .filter(Boolean)
    .filter(f => f.functions.length > 0);

  const allRanks = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  for (const file of results) {
    for (const fn of file.functions) {
      allRanks[fn.rank]++;
    }
  }

  const totalAvg =
    results.length > 0
      ? results.reduce((sum, f) => sum + f.average.rank, 0) / results.length
      : 0;

  let overallRank;
  if (totalAvg <= 5) overallRank = 'A';
  else if (totalAvg <= 10) overallRank = 'B';
  else if (totalAvg <= 20) overallRank = 'C';
  else if (totalAvg <= 30) overallRank = 'D';
  else if (totalAvg <= 40) overallRank = 'E';
  else overallRank = 'F';

  return {
    files: results.map(r => ({
      file: r.file,
      average: r.average,
      messages: r.functions.map(fn => ({
        name: `function ${fn.name}`,
        loc: {
          start: { line: fn.startLine, column: 0 },
          end: { line: fn.endLine, column: 0 },
        },
        type: 'function',
        rules: {
          complexity: {
            value: fn.complexity,
            rank: fn.complexity,
            label: fn.rank,
          },
        },
        maxRule: 'complexity',
      })),
    })),
    average: { rank: totalAvg, label: overallRank },
    ranks: allRanks,
  };
}

/**
 * Run eslintcc and parse results
 */
function runComplexityAnalysis(srcDir, sourceFiles, rootDir) {
  const tempConfigPath = join(rootDir, '.eslintrc.complexity.json');

  // Create temporary eslintrc config for eslintcc (it doesn't support flat config)
  const tempConfig = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    plugins: ['@typescript-eslint'],
    env: {
      browser: true,
      es2022: true,
      node: true,
    },
  };

  try {
    // Write temporary config
    writeFileSync(tempConfigPath, JSON.stringify(tempConfig, null, 2));

    // Run eslintcc with JSON output and all rules
    const result = execSync(
      `npx eslintcc --format json --rules all --max-rank F --max-average-rank F "${srcDir}"`,
      {
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          ESLINT_USE_FLAT_CONFIG: 'false',
        },
      }
    );

    return JSON.parse(result);
  } catch (error) {
    // eslintcc exits with code 1 when complexity exceeds thresholds, but still outputs JSON
    if (error.stdout) {
      try {
        return JSON.parse(error.stdout);
      } catch {
        // Fall through to built-in analyzer
      }
    }
    console.log(
      `${colors.yellow}Note: Using built-in complexity analyzer (eslintcc not available)${colors.reset}\n`
    );
    return runBuiltInComplexityAnalysis(sourceFiles, rootDir);
  } finally {
    // Clean up temporary config
    if (existsSync(tempConfigPath)) {
      try {
        unlinkSync(tempConfigPath);
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Print a section header
 */
function printHeader(title) {
  if (options.json) return;
  console.log(
    `\n${colors.bright}${colors.blue}${'═'.repeat(60)}${colors.reset}`
  );
  console.log(`${colors.bright}${colors.blue}  ${title}${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}${'═'.repeat(60)}${colors.reset}`);
}

/**
 * Main execution
 */
async function main() {
  const rootDir = process.cwd();
  const srcDir = join(rootDir, 'src');

  console.log(
    `${colors.cyan}Analyzing complexity in ${srcDir}...${colors.reset}`
  );
  console.log(
    `${colors.dim}(Excluding: components/ui/, .gitignore patterns)${colors.reset}\n`
  );

  // Load gitignore patterns
  const gitignorePatterns = loadGitignorePatterns(rootDir);

  // Get all source files
  const sourceFiles = getSourceFiles(srcDir, rootDir, gitignorePatterns);
  console.log(`Found ${sourceFiles.length} source files\n`);

  // Get file sizes
  const fileSizes = getFileSizes(sourceFiles, rootDir);

  // Run complexity analysis
  const complexityData = runComplexityAnalysis(srcDir, sourceFiles, rootDir);

  // Prepare results
  const report = {
    summary: {
      totalFiles: sourceFiles.length,
      averageRank: complexityData?.average?.label || 'N/A',
      analyzedAt: new Date().toISOString(),
    },
    largestFiles: [],
    mostLinesFiles: [],
    complexFiles: [],
    complexFunctions: [],
    componentAnalysis: [],
  };

  // === LARGEST FILES BY SIZE ===
  report.largestFiles = fileSizes
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, options.top)
    .map((f, i) => ({
      rank: i + 1,
      file: f.file,
      size: formatBytes(f.bytes),
      lines: f.lines,
    }));

  // === FILES WITH MOST LINES ===
  report.mostLinesFiles = fileSizes
    .sort((a, b) => b.lines - a.lines)
    .slice(0, options.top)
    .map((f, i) => ({
      rank: i + 1,
      file: f.file,
      lines: f.lines,
      size: formatBytes(f.bytes),
    }));

  // === COMPLEX FILES (from eslintcc) ===
  if (complexityData?.files) {
    report.complexFiles = complexityData.files
      .filter(f => rankPriority[f.average?.label] >= minRankPriority)
      .sort((a, b) => (b.average?.rank || 0) - (a.average?.rank || 0))
      .slice(0, options.top)
      .map((f, i) => ({
        rank: i + 1,
        file: relative(rootDir, f.file),
        complexityRank: f.average?.label || 'N/A',
        complexityScore: f.average?.rank?.toFixed(2) || 'N/A',
        functionCount: f.messages?.length || 0,
      }));

    // === MOST COMPLEX FUNCTIONS ===
    const allFunctions = [];
    for (const file of complexityData.files) {
      for (const msg of file.messages || []) {
        // Get the maximum rule value
        const maxRuleValue = msg.rules
          ? Math.max(...Object.values(msg.rules).map(r => r.rank || 0))
          : 0;
        const maxRuleLabel = msg.rules
          ? Object.values(msg.rules).reduce(
              (max, r) => (r.rank > (max?.rank || 0) ? r : max),
              {}
            ).label || 'A'
          : 'A';

        if (rankPriority[maxRuleLabel] >= minRankPriority) {
          allFunctions.push({
            file: relative(rootDir, file.file),
            name: msg.name || 'anonymous',
            line: msg.loc?.start?.line || 0,
            complexityRank: maxRuleLabel,
            complexityScore: maxRuleValue.toFixed(2),
            maxRule: msg.maxRule || 'complexity',
            rules: msg.rules,
          });
        }
      }
    }

    report.complexFunctions = allFunctions
      .sort(
        (a, b) => parseFloat(b.complexityScore) - parseFloat(a.complexityScore)
      )
      .slice(0, options.top)
      .map((f, i) => ({
        rank: i + 1,
        ...f,
      }));
  }

  // === COMPONENT ANALYSIS ===
  const componentFiles = sourceFiles
    .filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'))
    .map(file => {
      const components = countComponents(file);
      const fileInfo = fileSizes.find(
        fs => fs.file === relative(rootDir, file)
      );
      return {
        file: relative(rootDir, file),
        componentCount: components.length,
        components,
        lines: fileInfo?.lines || 0,
        size: fileInfo?.bytes || 0,
      };
    })
    .filter(f => f.componentCount > 0);

  // Files with multiple components (candidates for splitting)
  report.componentAnalysis = componentFiles
    .filter(f => f.componentCount > 1 || f.lines > 200)
    .sort((a, b) => b.componentCount - a.componentCount || b.lines - a.lines)
    .slice(0, options.top)
    .map((f, i) => ({
      rank: i + 1,
      file: f.file,
      componentCount: f.componentCount,
      components: f.components.join(', '),
      lines: f.lines,
      recommendation:
        f.componentCount > 1
          ? 'Consider splitting into separate files'
          : f.lines > 300
            ? 'Large file - consider splitting'
            : 'Review for complexity',
    }));

  // === OUTPUT ===
  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  // Summary
  printHeader('COMPLEXITY ANALYSIS SUMMARY');
  console.log(`  Total files analyzed: ${report.summary.totalFiles}`);
  console.log(`  Average complexity rank: ${report.summary.averageRank}`);
  if (complexityData?.ranks) {
    console.log(`  Rank distribution:`);
    for (const [rank, count] of Object.entries(complexityData.ranks)) {
      if (count > 0) {
        console.log(`    ${rankColors[rank]}${rank}${colors.reset}: ${count}`);
      }
    }
  }

  // Largest files
  printHeader(`TOP ${options.top} LARGEST FILES (by size)`);
  for (const f of report.largestFiles) {
    console.log(
      `  ${colors.dim}${f.rank.toString().padStart(2)}.${colors.reset} ${f.file}`
    );
    console.log(
      `      ${colors.yellow}${f.size}${colors.reset} | ${f.lines} lines`
    );
  }

  // Most lines
  printHeader(`TOP ${options.top} FILES BY LINE COUNT`);
  for (const f of report.mostLinesFiles) {
    console.log(
      `  ${colors.dim}${f.rank.toString().padStart(2)}.${colors.reset} ${f.file}`
    );
    console.log(
      `      ${colors.yellow}${f.lines} lines${colors.reset} | ${f.size}`
    );
  }

  // Complex files
  if (report.complexFiles.length > 0) {
    printHeader(
      `TOP ${options.top} MOST COMPLEX FILES (rank >= ${options.minRank})`
    );
    for (const f of report.complexFiles) {
      const color = rankColors[f.complexityRank] || colors.reset;
      console.log(
        `  ${colors.dim}${f.rank.toString().padStart(2)}.${colors.reset} ${f.file}`
      );
      console.log(
        `      Rank: ${color}${f.complexityRank}${colors.reset} (${f.complexityScore}) | ${f.functionCount} functions`
      );
    }
  }

  // Complex functions
  if (report.complexFunctions.length > 0) {
    printHeader(
      `TOP ${options.top} MOST COMPLEX FUNCTIONS (rank >= ${options.minRank})`
    );
    for (const f of report.complexFunctions) {
      const color = rankColors[f.complexityRank] || colors.reset;
      console.log(
        `  ${colors.dim}${f.rank.toString().padStart(2)}.${colors.reset} ${color}${f.name}${colors.reset}`
      );
      console.log(`      ${f.file}:${f.line}`);
      console.log(
        `      Rank: ${color}${f.complexityRank}${colors.reset} (${f.complexityScore}) | Rule: ${f.maxRule}`
      );
    }
  }

  // Component analysis
  if (report.componentAnalysis.length > 0) {
    printHeader('COMPONENT FILES TO CONSIDER SPLITTING');
    for (const f of report.componentAnalysis) {
      console.log(
        `  ${colors.dim}${f.rank.toString().padStart(2)}.${colors.reset} ${f.file}`
      );
      console.log(
        `      ${colors.magenta}${f.componentCount} components${colors.reset}: ${f.components}`
      );
      console.log(
        `      ${f.lines} lines | ${colors.cyan}${f.recommendation}${colors.reset}`
      );
    }
  }

  console.log(`\n${colors.dim}Run with --help for options${colors.reset}\n`);
}

main().catch(error => {
  console.error(`${colors.red}Error:${colors.reset}`, error.message);
  process.exit(1);
});
