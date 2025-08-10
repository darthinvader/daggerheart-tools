#!/usr/bin/env node
// Simple repository file size and LOC analyzer focused on refactor candidates.
// Excludes data and schema files/directories by default.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const cwd = process.cwd();

// Configurable defaults via CLI flags
const args = new Map(
  process.argv.slice(2).flatMap(arg => {
    if (!arg.startsWith('--')) return [];
    const [k, v] = arg.replace(/^--/, '').split('=');
    return [[k, v ?? 'true']];
  })
);

const by = (args.get('by') ?? 'size').toLowerCase(); // 'size' | 'loc'
const topN = Number(args.get('top') ?? args.get('limit') ?? 30);
const minKB = Number(args.get('minKB') ?? 0);
const jsonOut = args.get('json') === 'true' || Boolean(args.get('jsonOut'));
const root = args.get('root') ? path.resolve(String(args.get('root'))) : cwd;

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
  // React-y heuristic: TSX/JSX with lots of JSX and LOC suggests split components
  if ((file.ext === '.tsx' || file.ext === '.jsx') && file.jsxCount >= 200) {
    hints.push('heavy JSX (consider splitting UI)');
  }
  return hints;
}

async function analyzeFile(abs, rel) {
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
  };
}

function byComparator(metric) {
  return (a, b) => {
    if (metric === 'loc') return b.loc - a.loc;
    return b.bytes - a.bytes;
  };
}

function printTable(rows) {
  const headers = [
    'KB',
    'LOC',
    'Imports',
    'Exports',
    'MaxLine',
    'Path',
    'Hints',
  ];
  const widths = [6, 6, 8, 8, 8, 0, 0];
  const pad = (s, w) => String(s).toString().padStart(w);
  console.log(headers.join('\t'));
  for (const r of rows) {
    const hints = hintFor(r).join(', ');
    console.log(
      [
        pad(r.sizeKB.toFixed(1), widths[0]),
        pad(r.loc, widths[1]),
        pad(r.importCount, widths[2]),
        pad(r.exportCount, widths[3]),
        pad(r.maxLineLen, widths[4]),
        r.path,
        hints,
      ].join('\t')
    );
  }
}

(async function main() {
  const files = await collectFiles();
  const analyses = [];
  for (const f of files) {
    const info = await analyzeFile(f.abs, f.rel);
    if (info.sizeKB < minKB) continue;
    analyses.push(info);
  }
  analyses.sort(byComparator(by));
  const top = analyses.slice(0, topN);

  if (jsonOut) {
    const out = {
      root,
      generatedAt: new Date().toISOString(),
      by,
      topN,
      minKB,
      files: top,
    };
    const outPath = path.join(root, 'size-report.json');
    await fs.writeFile(outPath, JSON.stringify(out, null, 2));
    console.log(`Wrote ${top.length} entries to ${outPath}`);
  } else {
    console.log(
      `Large file scan (by=${by}, top=${topN}, minKB=${minKB}) — excluding src/lib/data and src/lib/schemas`
    );
    printTable(top);
    console.log(
      '\nHints: high LOC >= 400, large file >= 60KB, many exports >= 8, very long lines >= 180 chars.'
    );
  }
})().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
