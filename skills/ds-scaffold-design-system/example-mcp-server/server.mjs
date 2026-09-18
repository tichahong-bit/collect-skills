#!/usr/bin/env node
// Example MCP server for a design-system registry — scaffolded by the
// ds-scaffold-design-system skill. To stand up a real design system:
//   1. Replace designSystem/registryVersion and every entry in data/*.json.
//   2. Rename the package (package.json "name"/"bin") and this file if you like.
//   3. Drop list_templates/get_template if your DS has no whole-screen template
//      layer (see data/templates.json's own note) — don't ship an always-empty stub.
//   4. Run `npm run build-registry` to also emit the shadcn-style static
//      /r/*.json files a governance skill can `npx shadcn@latest add` from.
// See SKILL.md in the parent folder for the full pattern this mirrors.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataPath = (name) => path.join(here, "data", name);
const loadJson = async (name) => JSON.parse(await readFile(dataPath(name), "utf8"));

const rules = await loadJson("rules.json");
const registry = await loadJson("registry.json");
const templates = await loadJson("templates.json");
const changelog = await loadJson("changelog.json");

const asText = (value) => ({
  content: [{ type: "text", text: JSON.stringify(value, null, 2) }],
});

const server = new McpServer({
  name: registry.designSystem,
  version: registry.registryVersion,
});

server.registerTool(
  "get_rules",
  {
    title: "Get design system rules",
    description:
      "Foundational rules an agent must read before using this design system — read once per run, before touching components or templates.",
    inputSchema: {},
  },
  async () => asText(rules)
);

server.registerTool(
  "list_families",
  {
    title: "List component families",
    description: "Groups of related component variants (e.g. a Button family's primary/secondary/ghost).",
    inputSchema: {},
  },
  async () => asText(registry.families)
);

server.registerTool(
  "list_components",
  {
    title: "List components",
    description:
      "Full component roster, optionally filtered by category. Use includeInternal to also surface internal-only building blocks (see search_components).",
    inputSchema: {
      category: z.string().optional().describe("Filter to one category, e.g. 'actions' or 'forms'."),
      includeInternal: z.boolean().optional().default(false),
    },
  },
  async ({ category, includeInternal }) => {
    const items = registry.components.filter(
      (c) => (!category || c.category === category) && (includeInternal || !c.internal)
    );
    return asText(items);
  }
);

server.registerTool(
  "search_components",
  {
    title: "Search components",
    description:
      "Search the roster by name/slug/tag. Pass includeInternal: true before concluding nothing matches — plain search misses internal-only building blocks otherwise (see rules.json rule 4 on citing real sources, not guesses).",
    inputSchema: {
      query: z.string().describe("Free-text query matched against name, slug, and tags. Empty string returns the full roster."),
      includeInternal: z.boolean().optional().default(false),
    },
  },
  async ({ query, includeInternal }) => {
    const q = query.trim().toLowerCase();
    const items = registry.components.filter((c) => {
      if (!includeInternal && c.internal) return false;
      if (!q) return true;
      const haystack = [c.name, c.slug, ...(c.tags || [])].join(" ").toLowerCase();
      return haystack.includes(q);
    });
    return asText(items);
  }
);

server.registerTool(
  "get_component",
  {
    title: "Get one component",
    description: "Full record for a single component by slug, including usage guidance and replacedBy if retiring.",
    inputSchema: { slug: z.string() },
  },
  async ({ slug }) => {
    const item = registry.components.find((c) => c.slug === slug);
    if (!item) return asText({ error: `No component with slug '${slug}'`, hint: "Try search_components first." });
    return asText(item);
  }
);

server.registerTool(
  "check_coverage",
  {
    title: "Check coverage",
    description:
      "Quick yes/no-style check for whether a described thing has a registry equivalent. A 'false' here is not final — cross-check with search_components(includeInternal: true) before concluding a real gap (rules.json rule 4).",
    inputSchema: { name: z.string().describe("Plain-language name of the thing being checked, e.g. 'donut chart'.") },
  },
  async ({ name }) => {
    const q = name.trim().toLowerCase();
    const matches = registry.components.filter((c) =>
      [c.name, c.slug, ...(c.tags || [])].join(" ").toLowerCase().includes(q)
    );
    return asText({
      queried: name,
      covered: matches.length > 0,
      matches: matches.map((m) => ({ slug: m.slug, name: m.name, status: m.status })),
    });
  }
);

if (Array.isArray(templates.templates) && templates.templates.length > 0) {
  server.registerTool(
    "list_templates",
    {
      title: "List whole-screen templates",
      description: "Whole-screen templates this design system ships (optional layer — see rules.json rule 2).",
      inputSchema: {},
    },
    async () => asText(templates.templates)
  );

  server.registerTool(
    "get_template",
    {
      title: "Get one template",
      description: "Full record for a single whole-screen template by slug.",
      inputSchema: { slug: z.string() },
    },
    async ({ slug }) => {
      const item = templates.templates.find((t) => t.slug === slug);
      if (!item) return asText({ error: `No template with slug '${slug}'` });
      return asText(item);
    }
  );
}

server.registerTool(
  "get_changelog",
  {
    title: "Get changelog",
    description:
      "Live version history of this registry, newest first. Optionally filter to entries at or after a given version.",
    inputSchema: { since: z.string().optional().describe("Only return entries from this version onward, e.g. '1.2.0'.") },
  },
  async ({ since }) => {
    let entries = changelog.entries;
    if (since) {
      const idx = entries.findIndex((e) => e.version === since);
      entries = idx >= 0 ? entries.slice(0, idx + 1) : entries;
    }
    return asText(entries);
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
