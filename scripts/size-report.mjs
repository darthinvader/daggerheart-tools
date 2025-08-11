#!/usr/bin/env node
// Repository analyzer for refactor candidates.
// Now includes: size, LOC, imports/exports, JSX density, line length stats,
// naive cyclomatic complexity proxy, and module fan-in/out. Supports JSON and Markdown outputs.
// Excludes data and schema files/directories by default (configurable).
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const cwd = process.cwd();

// Configurable defaults via CLI flags (supports --key=value and --key value)
const args = new Map();
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const token = argv[i];
  if (!token.startsWith('--')) continue;
  const eq = token.indexOf('=');
  if (eq !== -1) {
    const k = token.slice(2, eq);
    const v = token.slice(eq + 1);
    args.set(k, v === '' ? 'true' : v);
  } else {
    const k = token.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      args.set(k, next);
      i++;
    } else {
      args.set(k, 'true');
    }
  }
}

const by = (args.get('by') ?? 'size').toLowerCase(); // 'size' | 'loc' | 'complexity'
const topN = Number(args.get('top') ?? args.get('limit') ?? 30);
const minKB = Number(args.get('minKB') ?? 0);
const jsonOut = args.get('json') === 'true' || Boolean(args.get('jsonOut'));
const root = args.get('root') ? path.resolve(String(args.get('root'))) : cwd;
const mdOut = args.get('md') === 'true' || Boolean(args.get('markdown'));
const outDir = args.get('outDir')
  ? path.resolve(String(args.get('outDir')))
  : root;

// Try to read optional config to customize scanning while keeping safe defaults.
async function readConfig(rootDir) {
  const cfgPath = path.join(rootDir, 'size-report.config.json');
  try {
    const raw = await fs.readFile(cfgPath, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

const defaultIncludeRoots = ['src', 'tests'];
const defaultExcludeDirs = [
  'node_modules',
  'dist',
  'build',
  '.git',
  '.vscode',
  'coverage',
  'SRD',
  'public',
];
// Project-specific hard excludes (defaults)
const defaultExcludePaths = [
  path.join('src', 'lib', 'data'),
  path.join('src', 'lib', 'schemas'),
  // Project-specific file to ignore: showcase is a demo page, not a refactor target
  path.join('src', 'routes', 'showcase.tsx'),
];

const defaultIncludeExts = ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'];

const cfg = await readConfig(root);
const includeRoots = Array.isArray(cfg.includeRoots)
  ? cfg.includeRoots
  : defaultIncludeRoots;
const excludeDirs = new Set(
  Array.isArray(cfg.excludeDirs) ? cfg.excludeDirs : defaultExcludeDirs
);
const excludePaths = Array.isArray(cfg.excludePaths)
  ? cfg.excludePaths
  : defaultExcludePaths;
const includeExts = new Set(
  Array.isArray(cfg.includeExts) ? cfg.includeExts : defaultIncludeExts
);

function isExcluded(fullPath, relPath, dirent) {
  // Directory-level filters
  if (dirent.isDirectory()) {
    if (excludeDirs.has(dirent.name)) return true;
    // Exclude specific subtrees
    if (
      excludePaths.some(p => relPath === p || relPath.startsWith(p + path.sep))
    )
      return true;
  } else {
    // File-level filters
    const ext = path.extname(dirent.name);
    if (!includeExts.has(ext)) return true;
    if (
      excludePaths.some(p => relPath === p || relPath.startsWith(p + path.sep))
    )
      return true;
  }
  return false;
}

async function* walk(dir, baseRel = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    const rel = path.join(baseRel, entry.name);
    if (isExcluded(abs, rel, entry)) continue;
    if (entry.isDirectory()) {
      yield* walk(abs, rel);
    } else {
      yield { abs, rel };
    }
  }
}

async function collectFiles() {
  const files = [];
  for (const r of includeRoots) {
    const absRoot = path.join(root, r);
    try {
      const stat = await fs.stat(absRoot);
      if (!stat.isDirectory()) continue;
    } catch {
      continue;
    }
    for await (const f of walk(absRoot, r)) {
      files.push(f);
    }
  }
  return files;
}

function formatKB(bytes) {
  return (bytes / 1024).toFixed(1);
}

function hintFor(file) {
  const hints = [];
  if (file.loc >= 400) hints.push('high LOC');
  if (file.sizeKB >= 60) hints.push('large file');
  if (file.exportCount >= 8) hints.push('many exports');
  if (file.maxLineLen >= 180) hints.push('very long lines');
  if (file.longLineCount >= 40) hints.push('many long lines');
  if (file.complexity >= 30) hints.push('high complexity');
  if (file.fanIn >= 10) hints.push('high fan-in');
  // React-y heuristic: TSX/JSX with lots of JSX and LOC suggests split components
  if ((file.ext === '.tsx' || file.ext === '.jsx') && file.jsxCount >= 200) {
    hints.push('heavy JSX (consider splitting UI)');
  }
  return hints;
}

function stripCommentsAndStrings(src) {
  // Remove block comments, line comments, and string/template contents to better approximate logic tokens
  let s = src
    // block comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // line comments
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
  // replace string literals with quotes preserved length 1
  s = s
    .replace(/(['"])((?:\\.|(?!\1).)*)\1/g, '$1$1')
    .replace(/`[\s\S]*?`/g, '``');
  return s;
}

function computeComplexity(text) {
  const cleaned = stripCommentsAndStrings(text);
  // naive cyclomatic complexity approximation: 1 + count of branch points
  const patterns = [
    /\bif\b/g,
    /\bfor\b/g,
    /\bwhile\b/g,
    /\bcase\b/g,
    /\bcatch\b/g,
    /\?[^:\n]*:/g, // ternary occurrences
    /&&/g,
    /\|\|/g,
    /\bswitch\b/g,
  ];
  let count = 1;
  for (const re of patterns) count += (cleaned.match(re) || []).length;
  return count;
}

function countFunctions(text) {
  const cleaned = stripCommentsAndStrings(text);
  const fnDecl = (cleaned.match(/\bfunction\b/g) || []).length;
  const arrows = (cleaned.match(/=>/g) || []).length;
  return fnDecl + arrows;
}

function countLongLines(lines, threshold = 120) {
  return lines.reduce((n, l) => (l.length > threshold ? n + 1 : n), 0);
}

function avgLineLength(lines) {
  if (!lines.length) return 0;
  const total = lines.reduce((s, l) => s + l.length, 0);
  return Math.round(total / lines.length);
}

function extractImportSpecs(text) {
  const specs = [];
  // import ... from 'x'
  const re1 = /import\s+[^;]*?from\s+["']([^"']+)["']/g;
  // export ... from 'x'
  const re2 = /export\s+[^;]*?from\s+["']([^"']+)["']/g;
  // dynamic import('x')
  const re3 = /import\(\s*["']([^"']+)["']\s*\)/g;
  let m;
  while ((m = re1.exec(text))) specs.push(m[1]);
  while ((m = re2.exec(text))) specs.push(m[1]);
  while ((m = re3.exec(text))) specs.push(m[1]);
  return specs;
}

function resolveImport(spec, fromAbs, filesIndex) {
  // skip external packages
  if (!spec.startsWith('.') && !spec.startsWith('@/')) return null;
  let targetAbs;
  if (spec.startsWith('@/')) {
    const relFromRoot = spec.replace(/^@\//, 'src/');
    targetAbs = path.join(root, relFromRoot);
  } else {
    targetAbs = path.join(path.dirname(fromAbs), spec);
  }
  // Try to resolve to a known file by adding extensions or /index
  const tryPaths = [];
  const add = p => tryPaths.push(path.normalize(p));
  add(targetAbs);
  for (const ext of ['.ts', '.tsx', '.js', '.jsx']) add(targetAbs + ext);
  for (const ext of ['.ts', '.tsx', '.js', '.jsx'])
    add(path.join(targetAbs, 'index' + ext));
  for (const p of tryPaths) {
    const rel = filesIndex.absToRel.get(path.normalize(p));
    if (rel) return rel;
  }
  return null;
}

async function analyzeFile(abs, rel, filesIndex) {
  const buf = await fs.readFile(abs);
  const text = buf.toString('utf8');
  const lines = text.split(/\r?\n/);
  const loc = lines.filter(
    l => l.trim().length > 0 && !l.trim().startsWith('//')
  ).length;
  const sizeKB = Number(formatKB(buf.length));
  const ext = path.extname(abs);
  const exportCount = (text.match(/\bexport\b/g) || []).length;
  const importCount = (text.match(/\bimport\b/g) || []).length;
  const jsxCount = (text.match(/</g) || []).length; // rough signal
  const maxLineLen = lines.reduce((m, l) => Math.max(m, l.length), 0);
  const longLineCount = countLongLines(lines);
  const avgLineLen = avgLineLength(lines);
  const complexity = computeComplexity(text);
  const functionCount = countFunctions(text);
  const importSpecs = extractImportSpecs(text);
  const dependencies = [];
  for (const spec of importSpecs) {
    const resolved = resolveImport(spec, abs, filesIndex);
    if (resolved) dependencies.push(resolved);
  }

  return {
    path: rel,
    ext,
    sizeKB,
    bytes: buf.length,
    loc,
    importCount,
    exportCount,
    jsxCount,
    maxLineLen,
    longLineCount,
    avgLineLen,
    complexity,
    functionCount,
    dependencies,
  };
}

function byComparator(metric) {
  return (a, b) => {
    if (metric === 'loc') return b.loc - a.loc;
    if (metric === 'complexity') return b.complexity - a.complexity;
    return b.bytes - a.bytes;
  };
}

function printTable(rows) {
  const headers = [
    'KB',
    'LOC',
    'Cx',
    'Fns',
    'In',
    'Out',
    'MaxLine',
    'Path',
    'Hints',
  ];
  const widths = [6, 6, 4, 4, 4, 4, 8, 0, 0];
  const pad = (s, w) => String(s).toString().padStart(w);
  console.log(headers.join('\t'));
  for (const r of rows) {
    const hints = hintFor(r).join(', ');
    console.log(
      [
        pad(r.sizeKB.toFixed(1), widths[0]),
        pad(r.loc, widths[1]),
        pad(r.complexity, widths[2]),
        pad(r.functionCount, widths[3]),
        pad(r.fanIn ?? 0, widths[4]),
        pad(r.fanOut ?? 0, widths[5]),
        pad(r.maxLineLen, widths[6]),
        r.path,
        hints,
      ].join('\t')
    );
  }
}

function toMarkdownReport(all, options) {
  const { by = 'size', topN = 30, minKB = 0 } = options || {};
  const header = `# Size & Complexity Report\n\nGenerated: ${new Date().toISOString()}\n\nSettings: by=${by}, top=${topN}, minKB=${minKB}\n\n`;
  const sections = [];
  const makeTable = rows => {
    const head = `| KB | LOC | Cx | Fns | In | Out | MaxLine | Path | Hints |\n|---:|---:|---:|---:|---:|---:|---:|---|---|`;
    const lines = rows.map(r => {
      const hints = hintFor(r).join(', ');
      return `| ${r.sizeKB.toFixed(1)} | ${r.loc} | ${r.complexity} | ${r.functionCount} | ${r.fanIn ?? 0} | ${r.fanOut ?? 0} | ${r.maxLineLen} | ${r.path} | ${hints} |`;
    });
    return [head, ...lines].join('\n');
  };
  const topBy = metric => [...all].sort(byComparator(metric)).slice(0, topN);
  sections.push(`## Top by Size\n\n${makeTable(topBy('size'))}`);
  sections.push(`\n\n## Top by LOC\n\n${makeTable(topBy('loc'))}`);
  sections.push(
    `\n\n## Top by Complexity\n\n${makeTable(topBy('complexity'))}`
  );
  sections.push(
    `\n\n## Notes\n\n- Cx is a naive cyclomatic complexity proxy: 1 + branch tokens (if/for/while/case/catch/ternary/&&/||/switch).\n- In/Out represent module fan-in/out within scanned set (excludes external packages).\n- Hints are heuristics to guide refactors; verify with context.\n`
  );
  return header + sections.join('\n');
}

(async function main() {
  const files = await collectFiles();
  const absToRel = new Map(files.map(f => [path.normalize(f.abs), f.rel]));
  const relToAbs = new Map(files.map(f => [f.rel, path.normalize(f.abs)]));
  const filesIndex = { absToRel, relToAbs };

  // Analyze in parallel for speed
  const analysesRaw = await Promise.all(
    files.map(f => analyzeFile(f.abs, f.rel, filesIndex))
  );
  // Filter by minKB
  const analyses = analysesRaw.filter(info => info.sizeKB >= minKB);

  // Compute fan-in/out graph
  const fanIn = new Map();
  const fanOut = new Map();
  for (const a of analyses) {
    fanOut.set(
      a.path,
      (fanOut.get(a.path) || 0) + (a.dependencies?.length || 0)
    );
    for (const dep of a.dependencies || []) {
      fanIn.set(dep, (fanIn.get(dep) || 0) + 1);
    }
  }
  for (const a of analyses) {
    a.fanIn = fanIn.get(a.path) || 0;
    a.fanOut = a.dependencies?.length || 0;
  }

  analyses.sort(byComparator(by));
  const top = analyses.slice(0, topN);

  // Ensure output directory exists if we are writing files
  if (jsonOut || mdOut) {
    await fs.mkdir(outDir, { recursive: true });
  }

  if (jsonOut) {
    const out = {
      root,
      generatedAt: new Date().toISOString(),
      by,
      topN,
      minKB,
      files: top,
      totals: {
        scanned: files.length,
        analyzed: analyses.length,
      },
    };
    const jsonPath = path.join(outDir, 'size-report.json');
    await fs.writeFile(jsonPath, JSON.stringify(out, null, 2) + '\n', {
      encoding: 'utf8',
      flag: 'w',
    });
    console.log(`Wrote ${top.length} entries to ${jsonPath}`);
  }

  if (mdOut) {
    const md = toMarkdownReport(analyses, { by, topN, minKB });
    const mdPath = path.join(outDir, 'size-report.md');
    await fs.writeFile(mdPath, md, { encoding: 'utf8', flag: 'w' });
    console.log(`Wrote Markdown report to ${mdPath}`);
  }

  if (!jsonOut && !mdOut) {
    console.log(
      `Large file scan (by=${by}, top=${topN}, minKB=${minKB}) — excluding src/lib/data and src/lib/schemas`
    );
    printTable(top);
    console.log(
      '\nHints: high LOC >= 400, large file >= 60KB, many exports >= 8, very long lines >= 180 chars. Cx = complexity proxy.'
    );
  }
})().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
