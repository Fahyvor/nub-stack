import readline from 'node:readline';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { colors } from './colors.js';
import { copyDir } from './generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BANNER = `
${colors.cyan(colors.bold('   _   _ _   _ ____        ____ _____    _    ____ _  __'))}
${colors.cyan(colors.bold('  | \\ | | | | | __ )      / ___|_   _|  / \\  / ___| |/ /'))}
${colors.blue(colors.bold('  |  \\| | | | |  _ \\ ____ \\___ \\ | |   / _ \\| |   | \' / '))}
${colors.blue(colors.bold('  | |\\  | |_| | |_) |_____|___) || |  / ___ \\ |___| . \\ '))}
${colors.magenta(colors.bold('  |_| \\_|\\___/|____/      |____/ |_| /_/   \\_\\____|_|\\_\\'))}

${colors.dim('  Dual-Mode Full-Stack Scaffolder • dev proxy /api ⇄ prod static server')}
`;

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    projectName: '',
    language: '', // 'ts' or 'js'
    backend: '',  // 'bun' or 'node'
    install: null,
    pm: '',
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--ts' || arg === '--typescript') {
      options.language = 'ts';
    } else if (arg === '--js' || arg === '--javascript') {
      options.language = 'js';
    } else if (arg === '--bun' || arg === '--elysia') {
      options.backend = 'bun';
    } else if (arg === '--node' || arg === '--express') {
      options.backend = 'node';
    } else if (arg === '--install') {
      options.install = true;
    } else if (arg === '--no-install') {
      options.install = false;
    } else if (arg === '--pm' && args[i + 1]) {
      options.pm = args[++i];
    } else if (arg.startsWith('--pm=')) {
      options.pm = arg.split('=')[1];
    } else if (!arg.startsWith('-') && !options.projectName) {
      options.projectName = arg;
    }
  }

  return options;
}

function prompt(question, defaultVal = '') {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    const promptText = defaultVal
      ? `${question} ${colors.gray(`(${defaultVal})`)}: `
      : `${question}: `;
    rl.question(promptText, answer => {
      rl.close();
      resolve(answer.trim() || defaultVal);
    });
  });
}

function printHelp() {
  console.log(BANNER);
  console.log(`
${colors.bold('USAGE:')}
  ${colors.cyan('npx nub-stack')} [project-name] [options]
  ${colors.cyan('npm create nub-stack@latest')} [project-name] [options]

${colors.bold('OPTIONS:')}
  ${colors.green('--ts, --typescript')}    Use TypeScript for both frontend & backend
  ${colors.green('--js, --javascript')}    Use JavaScript for both frontend & backend
  ${colors.green('--bun, --elysia')}       Use Bun + Elysia backend (match-nexx style)
  ${colors.green('--node, --express')}     Use Node.js + Express backend (universal)
  ${colors.green('--install')}             Automatically install dependencies
  ${colors.green('--no-install')}          Skip dependency installation
  ${colors.green('--pm <npm|pnpm|bun|yarn>')} Package manager to use
  ${colors.green('-h, --help')}            Show this help message

${colors.bold('ARCHITECTURE:')}
  • ${colors.bold('Development')}: Frontend dev server (Vite) proxies ${colors.cyan('/api')} to backend.
  • ${colors.bold('Production')}: Frontend builds into backend public dir; backend serves frontend & ${colors.cyan('/api')}.
`);
}

async function main() {
  const options = parseArgs();

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  console.log(BANNER);

  // 1. Project name
  let targetName = options.projectName;
  if (!targetName) {
    targetName = await prompt(`${colors.bold('?')} ${colors.cyan('Project name')}`, 'my-nub-stack-app');
  }

  const targetDir = path.resolve(process.cwd(), targetName);

  if (fs.existsSync(targetDir)) {
    const existing = fs.readdirSync(targetDir);
    if (existing.length > 0) {
      console.log(colors.yellow(`\nTarget directory "${targetName}" is not empty!`));
      const proceed = await prompt(`${colors.bold('?')} Proceed and overwrite existing files? (y/N)`, 'n');
      if (proceed.toLowerCase() !== 'y') {
        console.log(colors.red('Aborted.'));
        process.exit(1);
      }
    }
  }

  // 2. Language: TypeScript or JavaScript
  let language = options.language;
  if (!language) {
    console.log(`\n${colors.bold('?')} ${colors.cyan('Select language:')}`);
    console.log(`  ${colors.cyan('1)')} TypeScript ${colors.gray('(Vite TS + Backend TS)')} ${colors.green('[Recommended]')}`);
    console.log(`  ${colors.cyan('2)')} JavaScript ${colors.gray('(Vite JS + Backend JS)')}`);
    const choice = await prompt(`  Enter choice (1-2)`, '1');
    language = choice === '2' ? 'js' : 'ts';
  }

  // 3. Backend: Bun + Elysia or Node + Express
  let backend = options.backend;
  if (!backend) {
    console.log(`\n${colors.bold('?')} ${colors.cyan('Select backend runtime & framework:')}`);
    console.log(`  ${colors.cyan('1)')} Bun + Elysia ${colors.gray('(Ultra-fast, match-nexx architecture)')} ${colors.green('[Recommended]')}`);
    console.log(`  ${colors.cyan('2)')} Node.js + Express ${colors.gray('(Universal compatibility on any host)')}`);
    const choice = await prompt(`  Enter choice (1-2)`, '1');
    backend = choice === '2' ? 'node' : 'bun';
  }

  const templateKey = `${language}-${backend}`;
  const templateDir = path.join(__dirname, 'templates', templateKey);

  if (!fs.existsSync(templateDir)) {
    console.error(colors.red(`Error: Template "${templateKey}" not found!`));
    process.exit(1);
  }

  console.log(`\n${colors.bold('Scaffolding nub-stack project...')}`);
  console.log(`  ${colors.gray('• Destination:')} ${colors.cyan(targetDir)}`);
  console.log(`  ${colors.gray('• Flavor:')}      ${colors.green(language === 'ts' ? 'TypeScript' : 'JavaScript')}`);
  console.log(`  ${colors.gray('• Backend:')}     ${colors.magenta(backend === 'bun' ? 'Bun + Elysia' : 'Node.js + Express')}`);
  console.log(`  ${colors.gray('• Dev Flow:')}    ${colors.blue('Frontend proxies /api -> Backend (port 3000)')}`);
  console.log(`  ${colors.gray('• Prod Flow:')}   ${colors.blue('Backend serves frontend build + handles /api')}\n`);

  copyDir(templateDir, targetDir, {
    '{{PROJECT_NAME}}': path.basename(targetDir),
    '{{LANGUAGE}}': language,
    '{{BACKEND}}': backend
  });

  // Check package manager
  let pm = options.pm;
  if (!pm) {
    if (backend === 'bun' && hasCommand('bun')) {
      pm = 'bun';
    } else if (hasCommand('pnpm')) {
      pm = 'pnpm';
    } else if (hasCommand('npm')) {
      pm = 'npm';
    } else {
      pm = 'npm';
    }
  }

  // Installation prompt if not provided
  let shouldInstall = options.install;
  if (shouldInstall === null) {
    const installChoice = await prompt(`${colors.bold('?')} Install dependencies now using ${colors.cyan(pm)}? (Y/n)`, 'y');
    shouldInstall = installChoice.toLowerCase() !== 'n';
  }

  if (shouldInstall) {
    console.log(`\n${colors.bold('Installing root & backend dependencies with ' + pm + '...')}`);
    try {
      console.log(colors.gray(`$ cd ${targetName} && ${pm} install`));
      execSync(`${pm} install`, { cwd: targetDir, stdio: 'inherit' });

      const backendDir = path.join(targetDir, 'backend');
      if (fs.existsSync(backendDir)) {
        console.log(colors.gray(`$ cd ${targetName}/backend && ${pm} install`));
        execSync(`${pm} install`, { cwd: backendDir, stdio: 'inherit' });
      }
      console.log(colors.green('Dependencies installed successfully!'));
    } catch (err) {
      console.log(colors.yellow('Automatic installation encountered an issue. You can run install manually.'));
    }
  }

  // Print Next Steps
  console.log(`
${colors.green(colors.bold('Success! Created ' + path.basename(targetDir) + ' at ' + targetDir))}

${colors.bold('Inside that directory, you can run:')}

  ${colors.cyan(`cd ${targetName}`)}
  ${!shouldInstall ? colors.cyan(`${pm} install && cd backend && ${pm} install && cd ..`) : ''}

  ${colors.bold('1. Development Mode (Runs Frontend + Proxies /api to Backend):')}
     ${colors.cyan(`${pm} run dev:full`)}
     ${colors.gray('→ Frontend: http://localhost:5173')}
     ${colors.gray('→ Backend API: http://localhost:3000/api')}

  ${colors.bold('2. Production Build (Builds Frontend into Backend Static Host):')}
     ${colors.cyan(`${pm} run build`)}

  ${colors.bold('3. Production Server (Runs Backend serving both Frontend & /api):')}
     ${colors.cyan(`${pm} run start`)}
     ${colors.gray('→ Unified app: http://localhost:3000')}

${colors.magenta(colors.bold('Happy building with nub-stack!'))}
`);
}

function hasCommand(cmd) {
  try {
    execSync(`${cmd} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

main().catch(err => {
  console.error(colors.red('\nUnexpected error:'), err);
  process.exit(1);
});
