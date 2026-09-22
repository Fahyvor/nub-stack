import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function copyDir(src, dest, replacements = {}) {
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    // Rename _gitignore to .gitignore if present
    const targetName = entry.name === '_gitignore' ? '.gitignore' : entry.name;
    const destPath = path.join(dest, targetName);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, replacements);
    } else {
      let content = fs.readFileSync(srcPath, 'utf-8');
      for (const [placeholder, val] of Object.entries(replacements)) {
        content = content.replaceAll(placeholder, val);
      }
      fs.writeFileSync(destPath, content, 'utf-8');
    }
  }
}

export function getAvailableTemplates() {
  const templatesDir = path.join(__dirname, 'templates');
  return fs.readdirSync(templatesDir).filter(f => fs.statSync(path.join(templatesDir, f)).isDirectory());
}
