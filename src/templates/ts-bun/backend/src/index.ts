import { Elysia } from "elysia";
import path from "node:path";
import fs from "node:fs";

const PORT = Number(process.env.PORT || 3000);
const isProd = process.env.NODE_ENV === "production";
const publicPath = path.join(process.cwd(), "public");

console.log(`Starting nub-stack server on port ${PORT} (${isProd ? "production" : "development"})`);

const app = new Elysia()
  // API routes group
  .group("/api", (app) =>
    app
      .get("/health", () => ({
        status: "online",
        message: "nub-stack backend is healthy",
        server: "Bun + Elysia",
        timestamp: new Date().toISOString()
      }))
      .get("/hello", () => ({
        greeting: "Hello from {{PROJECT_NAME}} API!"
      }))
  );

// In production, serve the built frontend assets and SPA fallback from backend/public
if (isProd) {
  app
    .get("/assets/*", ({ request }) => {
      const pathname = new URL(request.url).pathname;
      const filePath = path.join(publicPath, pathname);
      if (fs.existsSync(filePath)) {
        return Bun.file(filePath);
      }
      return new Response("Asset Not Found", { status: 404 });
    })
    .get("/", () => {
      const indexFile = path.join(publicPath, "index.html");
      if (fs.existsSync(indexFile)) {
        return Bun.file(indexFile);
      }
      return new Response("Frontend not built yet. Run `npm run build` first.", { status: 404 });
    })
    .get("/*", ({ request }) => {
      const pathname = new URL(request.url).pathname;
      // Never serve index.html for unknown /api calls
      if (pathname.startsWith("/api")) {
        return new Response(JSON.stringify({ error: "API Route Not Found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      // SPA fallback
      const indexFile = path.join(publicPath, "index.html");
      if (fs.existsSync(indexFile)) {
        return Bun.file(indexFile);
      }
      return new Response("SPA fallback index.html not found.", { status: 404 });
    });
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  if (isProd) {
    console.log(`Serving static frontend from: ${publicPath}`);
  }
});
