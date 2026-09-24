#!/usr/bin/env node
// Emits the shadcn-registry-compatible static JSON files that let a governance
// skill run `npx shadcn@latest add <site>/r/components/<slug>.json` — the
// install-time counterpart to this server's read-time MCP tools. Deploy the
// output `public/r/` folder as static files alongside the site (e.g. on
// Vercel) at the same origin as the MCP endpoint.

import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const dataPath = (name) => path.join(root, "data", name);
const outDir = path.join(root, "public", "r");

const registry = JSON.parse(await readFile(dataPath("registry.json"), "utf8"));
const templates = JSON.parse(await readFile(dataPath("templates.json"), "utf8"));

await mkdir(path.join(outDir, "components"), { recursive: true });

// /r/registry.json — the shadcn "registry index" shape: name + a items array
// pointing at each component's own file.
await writeFile(
  path.join(outDir, "registry.json"),
  JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: registry.designSystem,
      homepage: `https://${registry.designSystem}-yourorg.vercel.app`,
      items: registry.components.map((c) => ({
        name: c.slug,
        type: "registry:component",
        title: c.name,
        description: c.guidance?.usage ?? "",
      })),
    },
    null,
    2
  )
);

// /r/components/<slug>.json — one file per component. This example ships
// metadata only (no real source files) — a production registry would add a
// "files" array with actual component source, per the shadcn registry schema.
for (const c of registry.components) {
  await writeFile(
    path.join(outDir, "components", `${c.slug}.json`),
    JSON.stringify(
      {
        $schema: "https://ui.shadcn.com/schema/registry-item.json",
        name: c.slug,
        type: "registry:component",
        title: c.name,
        description: c.guidance?.usage ?? "",
        meta: { version: c.version, status: c.status, category: c.category, tags: c.tags },
      },
      null,
      2
    )
  );
}

// /r/templates.json — optional whole-screen layer, only emitted when present.
if (Array.isArray(templates.templates) && templates.templates.length > 0) {
  await mkdir(path.join(outDir, "templates"), { recursive: true });
  await writeFile(path.join(outDir, "templates.json"), JSON.stringify(templates.templates, null, 2));
  for (const t of templates.templates) {
    await writeFile(path.join(outDir, "templates", `${t.slug}.json`), JSON.stringify(t, null, 2));
  }
}

console.log(`Wrote static registry to ${path.relative(process.cwd(), outDir)}`);
