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
  // Test 1: Scaffold TypeScript + Bun (Bun PM)
  console.log('Testing template: ts-bun with Bun PM...');
  execSync(`node "${nubStackBin}" test-ts-bun --ts --bun --pm bun --no-install`, { cwd: tmpDir, stdio: 'inherit' });
  const tsBunPkg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'test-ts-bun/package.json'), 'utf-8'));
  const tsBunVite = fs.readFileSync(path.join(tmpDir, 'test-ts-bun/vite.config.ts'), 'utf-8');
  if (!tsBunVite.includes('/api') || !tsBunVite.includes('./backend/public')) {
    throw new Error('test-ts-bun vite.config.ts missing proxy or outDir!');
  }
  if (!tsBunPkg.scripts['dev:full'].includes('bun run')) {
    throw new Error('test-ts-bun dev:full script does not use bun run!');
  }
  if (!tsBunPkg.workspaces || !tsBunPkg.workspaces.includes('backend')) {
    throw new Error('test-ts-bun missing workspaces: ["backend"]!');
  }
  console.log('test-ts-bun passed!');

  // Test 2: Scaffold JavaScript + Node (NPM)
  console.log('Testing template: js-node with NPM...');
  execSync(`node "${nubStackBin}" test-js-node --js --node --pm npm --no-install`, { cwd: tmpDir, stdio: 'inherit' });
  const jsNodePkg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'test-js-node/package.json'), 'utf-8'));
  const jsNodeVite = fs.readFileSync(path.join(tmpDir, 'test-js-node/vite.config.js'), 'utf-8');
  if (!jsNodeVite.includes('/api') || !jsNodeVite.includes('./backend/public')) {
    throw new Error('test-js-node vite.config.js missing proxy or outDir!');
  }
  if (!jsNodePkg.scripts['dev:full'].includes('npm run')) {
    throw new Error('test-js-node dev:full script does not use npm run!');
  }
  console.log('test-js-node passed!');

  // Test 3: Scaffold TypeScript + Node with Yarn
  console.log('Testing template: ts-node with Yarn PM...');
  execSync(`node "${nubStackBin}" test-ts-yarn --ts --node --yarn --no-install`, { cwd: tmpDir, stdio: 'inherit' });
  const tsYarnPkg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'test-ts-yarn/package.json'), 'utf-8'));
  const yarnrcPath = path.join(tmpDir, 'test-ts-yarn/.yarnrc.yml');
  const rootYarnLock = path.join(tmpDir, 'test-ts-yarn/yarn.lock');
  const backendYarnLock = path.join(tmpDir, 'test-ts-yarn/backend/yarn.lock');

  if (!fs.existsSync(yarnrcPath) || !fs.readFileSync(yarnrcPath, 'utf-8').includes('nodeLinker: node-modules')) {
    throw new Error('test-ts-yarn missing .yarnrc.yml with nodeLinker: node-modules!');
  }
  if (!fs.existsSync(rootYarnLock) || !fs.existsSync(backendYarnLock)) {
    throw new Error('test-ts-yarn missing yarn.lock files!');
  }
  if (!tsYarnPkg.scripts['dev:full'].includes('yarn run')) {
    throw new Error('test-ts-yarn dev:full script does not use yarn run!');
  }
  console.log('test-ts-yarn passed!');

  // Test 4: Scaffold TypeScript + Node with PNPM
  console.log('Testing template: ts-node with PNPM...');
  execSync(`node "${nubStackBin}" test-ts-pnpm --ts --node --pnpm --no-install`, { cwd: tmpDir, stdio: 'inherit' });
  const tsPnpmPkg = JSON.parse(fs.readFileSync(path.join(tmpDir, 'test-ts-pnpm/package.json'), 'utf-8'));
  const pnpmWorkspacePath = path.join(tmpDir, 'test-ts-pnpm/pnpm-workspace.yaml');

  if (!fs.existsSync(pnpmWorkspacePath) || !fs.readFileSync(pnpmWorkspacePath, 'utf-8').includes('backend')) {
    throw new Error('test-ts-pnpm missing pnpm-workspace.yaml listing backend!');
  }
  if (!tsPnpmPkg.pnpm?.onlyBuiltDependencies?.includes('esbuild')) {
    throw new Error('test-ts-pnpm missing pnpm.onlyBuiltDependencies for esbuild!');
  }
  if (!tsPnpmPkg.scripts['dev:full'].includes('pnpm run')) {
    throw new Error('test-ts-pnpm dev:full script does not use pnpm run!');
  }
  console.log('test-ts-pnpm passed!');

  console.log('\nAll tests passed successfully!');
} finally {
  if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}
