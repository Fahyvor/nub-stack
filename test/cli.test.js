import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nubStackBin = path.resolve(__dirname, '../bin/cli.js');
const tmpDir = path.resolve(__dirname, '../.tmp-test');

if (fs.existsSync(tmpDir)) {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
fs.mkdirSync(tmpDir, { recursive: true });

console.log('Testing nub-stack scaffolding CLI...');

try {
  // Test 1: Scaffold TypeScript + Bun
  console.log('Testing template: ts-bun...');
  execSync(`node "${nubStackBin}" test-ts-bun --ts --bun --no-install`, { cwd: tmpDir, stdio: 'inherit' });
  const tsBunPkg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'test-ts-bun/package.json'), 'utf-8'));
  const tsBunVite = fs.readFileSync(path.join(tmpDir, 'test-ts-bun/vite.config.ts'), 'utf-8');
  if (!tsBunVite.includes('/api') || !tsBunVite.includes('./backend/public')) {
    throw new Error('test-ts-bun vite.config.ts missing proxy or outDir!');
  }
  console.log('test-ts-bun passed!');

  // Test 2: Scaffold JavaScript + Node
  console.log('Testing template: js-node...');
  execSync(`node "${nubStackBin}" test-js-node --js --node --no-install`, { cwd: tmpDir, stdio: 'inherit' });
  const jsNodeVite = fs.readFileSync(path.join(tmpDir, 'test-js-node/vite.config.js'), 'utf-8');
  if (!jsNodeVite.includes('/api') || !jsNodeVite.includes('./backend/public')) {
    throw new Error('test-js-node vite.config.js missing proxy or outDir!');
  }
  console.log('test-js-node passed!');

  console.log('\nAll tests passed successfully!');
} finally {
  if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}
