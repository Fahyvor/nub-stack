# nub-stack

> The Dual-Mode Full-Stack Scaffolder for JavaScript and TypeScript.
> Inspired by the architectural elegance of **match-nexx**.

`nub-stack` is an ultra-fast CLI library to spin up full-stack projects configured with an intuitive, unified serving cycle:

- **In Development**: The frontend dev server (Vite) proxies `/api` directly to the backend. You write and test full-stack code without CORS friction.
- **In Production**: Frontend builds into the backend's static directory, and the backend serves the compiled client bundle with SPA client fallback while handling all `/api` routes.
- **Tailwind CSS v4 Out of the Box**: Zero-configuration styling powered by the official `@tailwindcss/vite` plugin and modern CSS imports.

---

## Quick Start

Create a new full-stack project in seconds:

```bash
# Using npx
npx nub-stack my-app

# Or using npm create
npm create nub-stack@latest my-app

# Or using pnpm
pnpm create nub-stack my-app

# Or using yarn
yarn create nub-stack my-app

# Or using bun
bun create nub-stack my-app
```

---

## Flavor & Runtime Options

Interactive prompts or CLI flags let you customize your project:

### 1. Language Options
- **TypeScript**: Complete end-to-end typing for both React frontend and backend routes.
- **JavaScript**: Clean, modern ES modules for both frontend and backend.

### 2. Styling
- **Tailwind CSS v4**: Preconfigured on all frontend templates using `@tailwindcss/vite` and `@import "tailwindcss";` (no `tailwind.config.js` needed).

### 3. Backend Options
- **Bun + Elysia**: Ultra-fast, lightweight HTTP framework (the signature architecture used in `match-nexx`).
- **Node.js + Express**: Universal compatibility for any standard Node environment or host.

### 4. Package Managers
Full, native support with automatic workspaces for:
- **npm**: Uses standard npm workspaces (`workspaces: ["backend"]`).
- **pnpm**: Configures `pnpm-workspace.yaml` and enables native build scripts (`onlyBuiltDependencies: ["esbuild"]`).
- **yarn**: Full Yarn Berry (v2+) & Yarn Classic support with `.yarnrc.yml` (`nodeLinker: node-modules`) and independent lockfiles.
- **bun**: Full Bun workspace and lockfile support with native script execution.

---

## Command Line Flags

```bash
npx nub-stack [project-name] [options]
```

| Flag | Description |
|------|-------------|
| `--ts, --typescript` | Use TypeScript for both frontend and backend |
| `--js, --javascript` | Use JavaScript for both frontend and backend |
| `--bun, --elysia` | Use Bun + Elysia backend |
| `--node, --express` | Use Node.js + Express backend |
| `--install` | Automatically install dependencies |
| `--no-install` | Skip installing dependencies |
| `--pm <npm\|pnpm\|bun\|yarn>` | Explicit package manager to use |
| `--yarn` | Shorthand for `--pm yarn` |
| `--pnpm` | Shorthand for `--pm pnpm` |
| `--npm` | Shorthand for `--pm npm` |
| `-h, --help` | Show help message |

### Examples:
```bash
# TypeScript + Bun with Bun package manager & install
npx nub-stack my-app --ts --bun --pm bun --install

# TypeScript + Node with Yarn
npx nub-stack my-app --ts --node --yarn --install

# TypeScript + Node with PNPM
npx nub-stack my-app --ts --node --pnpm --install

# JavaScript + Node.js Express with npm
npx nub-stack my-app --js --node --npm
```

---

## Generated Project Structure

```
my-app/
├── backend/                  # Backend server & API routes
│   ├── src/
│   │   └── index.ts          # Handles /api routes + static file hosting
│   ├── public/               # Target directory for built frontend assets
│   ├── .env.example
│   └── package.json
├── src/                      # Frontend application (React 19)
│   ├── App.tsx               # Styled with Tailwind CSS v4 & demonstrates /api/health
│   ├── main.tsx
│   └── index.css             # Tailwind CSS v4 entrypoint (@import "tailwindcss")
├── index.html
├── vite.config.ts            # Configured with @tailwindcss/vite and /api proxy
├── package.json              # Unified dev & build scripts
└── README.md
```

---

## How the Dual-Mode Pattern Works

### 1. In Development (`npm run dev:full`)
- **Frontend** runs on `http://localhost:5173`.
- **Backend** runs on `http://localhost:3000`.
- In `vite.config.ts`:
  ```ts
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
  ```
- Any request from the frontend to `/api/health` or `/api/users` transparently routes to the backend server.

### 2. In Production (`npm run build` && `npm start`)
- Running `npm run build` builds the frontend directly into `backend/public`.
- Running `npm start` launches the backend server on port `3000`.
- The backend serves:
  - `/api/*` -> Handled by backend route handlers.
  - `/assets/*` -> Direct static asset serving with caching.
  - `/*` -> SPA fallback returning `index.html` for frontend client-side router (e.g. React Router).

---

## License

MIT © [Favour](https://github.com/nub-stack)
