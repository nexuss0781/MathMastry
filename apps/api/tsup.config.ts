import { defineConfig } from "tsup";

/**
 * The Wasmer Edge Node runtime receives the built app but not the pnpm
 * node_modules tree, so every runtime dependency must live in the bundle.
 * Only true native addons (none today) should be marked external.
 */
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",
  platform: "node",
  clean: true,
  sourcemap: true,
  splitting: false,
  noExternal: [/.*/],
  // Bundled CommonJS dependencies still call require() for Node built-ins.
  // Without this banner esbuild's ESM shim throws "Dynamic require ... is not
  // supported" (pino is the first offender).
  banner: {
    js: [
      'import { createRequire as __mmCreateRequire } from "node:module";',
      'import { fileURLToPath as __mmFileURLToPath } from "node:url";',
      'import { dirname as __mmDirname } from "node:path";',
      "const require = __mmCreateRequire(import.meta.url);",
      "const __filename = __mmFileURLToPath(import.meta.url);",
      "const __dirname = __mmDirname(__filename);",
    ].join("\n"),
  },
});
