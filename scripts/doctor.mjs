import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const expected = {
  next: '15.3.0',
  react: '19.0.0',
  'react-dom': '19.0.0',
};

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function reportDependency(name, actual, source) {
  const wanted = expected[name];
  if (actual === wanted) {
    console.log(`✅ ${source}: ${name}@${actual}`);
    return true;
  }

  console.log(`❌ ${source}: ${name}@${actual ?? 'not found'} (expected ${wanted})`);
  return false;
}

const packageJson = readJson('package.json');
let ok = true;

console.log('Checking package.json dependencies...');
for (const [name] of Object.entries(expected)) {
  ok = reportDependency(name, packageJson.dependencies?.[name], 'package.json') && ok;
}

const lockPath = 'package-lock.json';
if (existsSync(lockPath)) {
  const lock = readJson(lockPath);
  const rootDeps = lock.packages?.['']?.dependencies ?? {};
  console.log('\nChecking package-lock.json root dependencies...');
  for (const [name] of Object.entries(expected)) {
    ok = reportDependency(name, rootDeps[name], 'package-lock.json') && ok;
  }
} else {
  console.log('\nℹ️ package-lock.json not found. npm install will create it.');
}

const installedNextPath = join('node_modules', 'next', 'package.json');
if (existsSync(installedNextPath)) {
  const installedNext = readJson(installedNextPath);
  console.log('\nChecking installed Next.js version...');
  ok = reportDependency('next', installedNext.version, 'node_modules') && ok;
} else {
  console.log('\nℹ️ node_modules/next not found. Run npm install after package.json is correct.');
}

if (!ok) {
  console.log(`\nFix with:\n  git pull\n  rm -rf node_modules package-lock.json\n  npm install\n  npm run dev`);
  process.exit(1);
}

console.log('\nAll dependency version checks passed.');
