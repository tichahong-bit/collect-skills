# sample-ds-mcp-server (example)

A working, runnable example of the MCP server shape described in
`../SKILL.md`. It's a starting point to copy, not something to depend on
as-is — replace every file under `data/` and you have a real design system.

## Run it

```
npm install
npm start          # starts the stdio MCP server (server.mjs)
npm run build-registry   # emits public/r/*.json (shadcn-registry-compatible)
node smoke-test.mjs      # connects a throwaway MCP client and exercises every tool
```

## What's here

- `data/rules.json`, `data/registry.json`, `data/templates.json`,
  `data/changelog.json` — the only files you actually need to rewrite for a
  real design system. Keep the shapes; replace the content.
- `server.mjs` — the MCP server itself (stdio transport). Tools:
  `get_rules`, `list_families`, `list_components`, `search_components`,
  `get_component`, `check_coverage`, `get_changelog`, and (only when
  `data/templates.json` has entries) `list_templates`/`get_template`.
- `scripts/build-registry.mjs` — generates the static, shadcn-registry-shaped
  `public/r/registry.json` + `public/r/components/<slug>.json` files from the
  same `data/registry.json`, so `npx shadcn@latest add <site>/r/components/<slug>.json`
  works for install-time use, alongside the MCP tools for read-time/audit use.
- `smoke-test.mjs` — not part of the shipped server; a throwaway harness that
  spawns the server over stdio and calls every tool once, so you can confirm
  a modified server still works before deploying it.

## Adapting this to a real design system

1. Rewrite `data/*.json` — keep the field shapes (`slug`, `status`,
   `guidance.usage`, etc.) since sibling governance skills in this repo
   assume them; change every value.
2. Rename `designSystem` (registry.json/rules.json/changelog.json) to your
   system's short name — it becomes the MCP server's registered `name` and
   the suggested site slug (`<name>-<org>.vercel.app`).
3. Drop `list_templates`/`get_template` (delete the `if (...)` block in
   `server.mjs`, delete `data/templates.json`) if your system has no
   whole-screen template layer — don't ship an always-empty stub (SKILL.md
   §Don't-ship-empty-layers).
4. For production, swap `StdioServerTransport` for an HTTP transport
   (`StreamableHTTPServerTransport`, also in `@modelcontextprotocol/sdk`) so
   the server can run as `POST /api/mcp` on the same Vercel deployment that
   serves `public/r/*.json` and the human-readable `#/...` docs pages — this
   is the shape referenced throughout this repo's governance skills
   (`mcp__mbds__get_rules`, `.../r/templates.json`, etc.).
5. Publish an `llms.txt` at the site root listing every tool (see the
   sibling `llms.txt` in this folder for a filled-in example) — governance
   skills in this repo look for it to discover what a design system's MCP
   server exposes without the site itself needing to be scraped.
6. Point a governance/audit skill at it (see `SKILL.md`'s §Wiring a
   governance skill).
