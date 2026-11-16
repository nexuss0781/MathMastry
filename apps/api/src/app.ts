import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { bodyLimit } from "hono/body-limit";
import { serveStatic } from "@hono/node-server/serve-static";
import { auth } from "./auth.js";
import { env } from "./env.js";
import { logger } from "./logger.js";
import { withSession } from "./middleware/session.js";
import type { AppEnv } from "./types.js";
import { metaRoutes } from "./routes/meta.js";
import { contentRoutes } from "./routes/content.js";
import { learningRoutes } from "./routes/learning.js";
import { curriculumRoutes } from "./routes/curriculum.js";
import { tutorRoutes } from "./routes/tutor.js";
import { getContent } from "./services/content.js";

// Prefer the assets copied next to the API bundle (apps/api/dist/public);
// fall back to the workspace web build for `tsx src/index.ts` development.
const webDist =
  [
    fileURLToPath(new URL("./public", import.meta.url)),
    fileURLToPath(new URL("../../web/dist", import.meta.url)),
  ].find((candidate) => existsSync(join(candidate, "index.html"))) ??
  fileURLToPath(new URL("../../web/dist", import.meta.url));
const indexPath = join(webDist, "index.html");

export const app = new Hono<AppEnv>();

app.use("*", async (c, next) => {
  const started = Date.now();
  await next();
  if (c.req.path.startsWith("/api/")) {
    logger.info(
      { method: c.req.method, path: c.req.path, status: c.res.status, ms: Date.now() - started },
      "request",
    );
  }
});

app.use("*", async (c, next) => {
  await next();
  c.header("x-content-type-options", "nosniff");
  c.header("referrer-policy", "strict-origin-when-cross-origin");
  c.header("x-frame-options", "DENY");
  c.header("permissions-policy", "camera=(), microphone=(), geolocation=()");
  if (env.NODE_ENV === "production") {
    c.header(
      "content-security-policy",
      [
        "default-src 'self'",
        "img-src 'self' data:",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "script-src 'self'",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; "),
    );
  }
});

app.use("/api/*", async (c, next) => {
  const origin = c.req.header("origin");
  if (
    origin &&
    ["POST", "PUT", "PATCH", "DELETE"].includes(c.req.method) &&
    ![env.WEB_ORIGIN, env.BETTER_AUTH_URL, env.SITE_URL].includes(origin)
  ) {
    return c.json({ error: "origin_not_allowed" }, 403);
  }
  await next();
});

app.use(
  "/api/*",
  cors({
    origin: [env.WEB_ORIGIN, env.BETTER_AUTH_URL, env.SITE_URL],
    credentials: true,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.use(
  "/api/*",
  bodyLimit({
    maxSize: 256 * 1024,
    onError: (c) => c.json({ error: "payload_too_large", message: "Request body exceeds 256 KB." }, 413),
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.use("/api/*", withSession);

app.route("/api", metaRoutes);
app.route("/api", contentRoutes);
app.route("/api", learningRoutes);
app.route("/api/curricula", curriculumRoutes);
app.route("/api/tutor", tutorRoutes);

app.all("/api/*", (c) => c.json({ error: "not_found", message: "No such API route." }, 404));

/* ------------------------------------------------------------ static SPA */

app.use("/assets/*", async (c, next) => {
  await next();
  if (c.res.status === 200) {
    c.header("cache-control", "public, max-age=31536000, immutable");
  }
});
app.use("/assets/*", serveStatic({ root: webDist }));
app.use("/favicon.ico", serveStatic({ root: webDist }));

/* ------------------------------------------------------------------ SEO */

app.get("/robots.txt", (c) => {
  c.header("content-type", "text/plain; charset=utf-8");
  return c.body(`User-agent: *\nAllow: /\nSitemap: ${env.SITE_URL}/sitemap.xml\n`);
});

app.get("/sitemap.xml", async (c) => {
  const content = await getContent();
  const urls = [
    "/",
    "/atlas",
    "/progress",
    "/review",
    "/curriculum",
    "/tutor",
    "/login",
    "/signup",
    ...content.domains.filter((domain) => !domain.gap).map((domain) => `/atlas/${domain.slug}`),
    ...content.concepts.map((concept) => `/concepts/${concept.slug}`),
  ];
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      (path) =>
        `  <url><loc>${env.SITE_URL}${path}</loc><changefreq>${path.startsWith("/concepts") ? "monthly" : "weekly"}</changefreq></url>`,
    ),
    "</urlset>",
  ].join("\n");
  c.header("content-type", "application/xml; charset=utf-8");
  return c.body(body);
});

/* -------------------------------------------------------------- SPA shell */

interface ShellMeta {
  title: string;
  description: string;
  canonical: string;
  jsonLd?: Record<string, unknown>;
  noscript: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;");
}

async function metaForPath(path: string): Promise<ShellMeta> {
  const content = await getContent();
  const defaults = {
    title: "MathMastery \u2014 The map is the curriculum",
    description:
      "MathMastery is a mastery operating system for 429 mathematical concepts across 12 domains. Study the atlas, prove mastery with evidence, and keep it with spaced recall.",
    canonical: `${env.SITE_URL}${path === "/" ? "" : path}`,
    noscript: [
      "<h1>MathMastery</h1>",
      "<p>A mastery operating system for 429 mathematical concepts across 12 domains.</p>",
      '<p><a href="/atlas">Browse the atlas</a></p>',
    ].join(""),
  };

  if (path.startsWith("/concepts/")) {
    const slug = path.replace("/concepts/", "").split("/")[0] ?? "";
    const concept = content.bySlug.get(slug);
    if (concept) {
      const domain = content.domainById.get(concept.domainId);
      const sources = (content.sources.get(concept.id) ?? []).slice(0, 4);
      return {
        title: `${concept.term} \u2014 MathMastery`,
        description: concept.oneLiner,
        canonical: `${env.SITE_URL}/concepts/${concept.slug}`,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "DefinedTerm",
          name: concept.term,
          description: concept.oneLiner,
          url: `${env.SITE_URL}/concepts/${concept.slug}`,
          inDefinedTermSet: {
            "@type": "DefinedTermSet",
            name: domain?.name ?? "Mathematics",
          },
        },
        noscript: [
          `<h1>${escapeHtml(concept.term)}</h1>`,
          `<p>${escapeHtml(concept.oneLiner)}</p>`,
          `<p><a href="${env.SITE_URL}/concepts/${concept.slug}">View on MathMastery</a></p>`,
        ].join(""),
      };
    }
  }

  if (path.startsWith("/atlas/")) {
    const domainSlug = path.replace("/atlas/", "").split("/")[0] ?? "";
    const domain = content.domainBySlug.get(domainSlug);
    if (domain) {
      return {
        title: `${domain.name} \u2014 MathMastery Atlas`,
        description: domain.description,
        canonical: `${env.SITE_URL}/atlas/${domain.slug}`,
        noscript: [
          `<h1>${escapeHtml(domain.name)}</h1>`,
          `<p>${escapeHtml(domain.description)}</p>`,
        ].join(""),
      };
    }
  }

  return defaults;
}

// Explicit frontend routes only - no catch-all to avoid intercepting API routes
const frontendRoutes = [
  "/",
  "/atlas",
  "/atlas/",
  "/progress",
  "/review",
  "/curriculum",
  "/tutor",
  "/login",
  "/signup",
  "/welcome",
  "/settings",
  "/concepts",
];

// Match exact routes and prefix routes for dynamic segments
const frontendRoutePatterns = [
  ...frontendRoutes,
  ...frontendRoutes.map((r) => (r === "/" ? "/" : `${r}/*`)),
];

for (const pattern of frontendRoutePatterns) {
  app.get(pattern, async (c) => {
    const path = c.req.path;
    const meta = await metaForPath(path);

    const html = readFileSync(indexPath, "utf-8")
      .replace("{{TITLE}}", escapeHtml(meta.title))
      .replace("{{DESCRIPTION}}", escapeHtml(meta.description))
      .replace("{{CANONICAL}}", escapeHtml(meta.canonical))
      .replace("{{NOSCRIPT}}", meta.noscript)
      .replace(/{{JSON_LD}}/g, meta.jsonLd ? `<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>` : "")
      .replace(/<div id="root"><\/div>/, (match) => {
        const noscript = meta.noscript ? "<noscript>" + meta.noscript + "</noscript>" : "";
        return "<div id=\"root\"></div>" + noscript;
      });

    c.header("content-type", "text/html; charset=utf-8");
    return c.html(html);
  });
}

// Also handle dynamic concept and atlas domain routes
app.get("/concepts/:slug*", async (c) => {
  const path = c.req.path;
  const meta = await metaForPath(path);

  const html = readFileSync(indexPath, "utf-8")
    .replace("{{TITLE}}", escapeHtml(meta.title))
    .replace("{{DESCRIPTION}}", escapeHtml(meta.description))
    .replace("{{CANONICAL}}", escapeHtml(meta.canonical))
    .replace("{{NOSCRIPT}}", meta.noscript)
    .replace(/{{JSON_LD}}/g, meta.jsonLd ? `<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>` : "")
    .replace(/<div id="root"><\/div>/, (match) => {
      const noscript = meta.noscript ? "<noscript>" + meta.noscript + "</noscript>" : "";
      return "<div id=\"root\"></div>" + noscript;
    });

  c.header("content-type", "text/html; charset=utf-8");
  return c.html(html);
});

app.get("/atlas/:domain*", async (c) => {
  const path = c.req.path;
  const meta = await metaForPath(path);

  const html = readFileSync(indexPath, "utf-8")
    .replace("{{TITLE}}", escapeHtml(meta.title))
    .replace("{{DESCRIPTION}}", escapeHtml(meta.description))
    .replace("{{CANONICAL}}", escapeHtml(meta.canonical))
    .replace("{{NOSCRIPT}}", meta.noscript)
    .replace(/{{JSON_LD}}/g, meta.jsonLd ? `<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>` : "")
    .replace(/<div id="root"><\/div>/, (match) => {
      const noscript = meta.noscript ? "<noscript>" + meta.noscript + "</noscript>" : "";
      return "<div id=\"root\"></div>" + noscript;
    });

  c.header("content-type", "text/html; charset=utf-8");
  return c.html(html);
});

// Fallback for any other HTML requests (bots, direct navigation)
app.get("/*", async (c) => {
  const path = c.req.path;
  const meta = await metaForPath(path);

  const html = readFileSync(indexPath, "utf-8")
    .replace("{{TITLE}}", escapeHtml(meta.title))
    .replace("{{DESCRIPTION}}", escapeHtml(meta.description))
    .replace("{{CANONICAL}}", escapeHtml(meta.canonical))
    .replace("{{NOSCRIPT}}", meta.noscript)
    .replace(/{{JSON_LD}}/g, meta.jsonLd ? `<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>` : "")
    .replace(/<div id="root"><\/div>/, (match) => {
      const noscript = meta.noscript ? "<noscript>" + meta.noscript + "</noscript>" : "";
      return "<div id=\"root\"></div>" + noscript;
    });

  c.header("content-type", "text/html; charset=utf-8");
  return c.html(html);
});

export async function start() {
  const { serve } = await import("@hono/node-server");
  serve({ fetch: app.fetch, port: env.PORT });
  logger.info({ port: env.PORT }, "MathMastery API listening");
}