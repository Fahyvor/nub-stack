import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);
const isProd = process.env.NODE_ENV === 'production';
const publicPath = path.resolve(process.cwd(), 'public');

app.use(express.json());

console.log(`Starting nub-stack server on port ${PORT} (${isProd ? 'production' : 'development'})`);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'nub-stack backend is healthy',
    server: 'Node.js + Express',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/hello', (req, res) => {
  res.json({
    greeting: 'Hello from {{PROJECT_NAME}} API!'
  });
});

// Production static file serving & SPA fallback
if (isProd) {
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));

    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
      }
      res.sendFile(path.join(publicPath, 'index.html'));
    });
  } else {
    console.warn(`Public directory not found at ${publicPath}. Run 'npm run build' first.`);
  }
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  if (isProd) {
    console.log(`Serving static frontend from: ${publicPath}`);
  }
});
