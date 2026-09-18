---
name: ds-scaffold-design-system
description: >
  Meta-skill for scaffolding a brand-new design system that follows this
  repo's own established MBDS/CDS/webds/cib pattern — an MCP server exposing
  a live component registry (get_rules, list_components/search_components/
  get_component, check_coverage, optionally list_templates/get_template for
  a whole-screen layer, get_changelog for live version history), plus a
  shadcn-registry-compatible static `/r/*.json` tree for install-time use,
  plus an `llms.txt` announcing the tools. Ships a runnable example server
  under example-mcp-server/ to copy and rewrite. Not tied to any one
  project — works for any new design system, product, or component
  library. Trigger: "scaffold a design system", "build a new design
  system MCP server", "สร้าง design system ใหม่", "อยากได้ MCP +
  changelog แบบ MBDS/CDS", or when asked to reproduce the architecture of
  an existing `<name>-bbl.vercel.app`-style site rather than its literal
  content.
---

# Scaffold a Design System (meta-skill)

## Origin — where this pattern comes from

This skill doesn't cite a single source page the way most of this repo's
other skills do. It's synthesized directly from the architecture already
documented, independently, across four sibling design systems referenced
throughout this repo's own skills:

- **CDS** (Core Design System) — `cds` MCP tools, `cds-bbl.vercel.app`,
  component-only (no whole-screen template layer). See
  `ds-update-sync-inventory/SKILL.md` and `ds-governance-audit-asana/SKILL.md`.
- **MBDS** (Mobile Banking Design System) — `mbds` MCP tools,
  `mbds-bbl.vercel.app`, adds a whole-screen **templates** layer
  (`list_templates`/`get_template`, `.../r/templates.json`) that CDS has no
  equivalent for. See `ds-governance-audit-asana/CHANGELOG.md` v2.2.0.
- **webds** — adds a **patterns** layer (`get_pattern`, region-level,
  explicitly a weaker claim than a component) instead of whole-screen
  templates. See `ds-governance-prototype-asana/SKILL.md`.
- **cib** — a 12-tool research-archive variant of the same shape
  (`get_rules`, `list_studies`, `search_insights`, `get_changelog`, …),
  served at `POST /api/mcp` and documented via `llms.txt`. See
  `ds-governance-prototype-asana/CHANGELOG.md`.

Common to all four: an MCP server is the source of truth; the human-facing
`<name>-bbl.vercel.app` site is a client-rendered mirror with **no useful
DOM** (agents must never scrape it); components are also published as a
shadcn-compatible static registry (`npx shadcn@latest add
<site>/r/components/<slug>.json`); and version history is exposed live
(`get_changelog`), not just as a markdown file.

This skill exists because a request to literally clone one such site
(`mbds-bbl.vercel.app`) turned out, on clarification, to really be a
request for *this pattern*, generalized to work for any new design system —
not that site's specific content, which this session had no access to or
rights over anyway.

## ทำอะไร — What it does

Scaffolds a new design system's MCP layer from scratch:

1. A runnable example MCP server (`example-mcp-server/`) implementing the
   full tool set, backed by swappable `data/*.json` files.
2. A script that derives a shadcn-registry-compatible static `public/r/`
   tree from the same data, for install-time use.
3. An `llms.txt` announcing the tools, so a governance skill (or any other
   agent) can discover the server's shape without scraping the rendered
   site.

## ใช้เมื่อไหร่ — When to use

- Starting a new design system, component library, or research archive
  that should be agent-consumable the same way CDS/MBDS/webds/cib already
  are in this org.
- Asked to "build something like `<existing-site>`'s architecture" when you
  don't have and shouldn't fetch that site's actual source — build the
  *pattern*, not a copy of unavailable proprietary content.

## ไม่ใช้เมื่อไหร่ — When NOT to use

- Don't use this to scrape or reproduce a specific live site's actual
  component names, tokens, or copy — that content belongs to whoever owns
  that design system. This skill only reproduces the *architecture*
  (tool names, data shapes, layering rules), never another system's real
  registry contents.
- Don't use it for one-off UI work on an *existing* design system already
  wired up in this repo (CDS/MBDS/webds/cib) — use that system's own
  governance skill (`ds-governance-audit-asana`, etc.) instead.

## Steps

1. **Pick a short name and one-line scope.** This becomes the MCP server's
   registered name, the suggested site slug (`<name>-<org>.vercel.app`),
   and the `mcp__<name>__*` tool-call prefix once installed.
2. **Copy `example-mcp-server/`** and rewrite every file under `data/`:
   - `rules.json` — the design system's own foundational rules (what
     CDS/MBDS/webds each start their `get_rules` with). Write real ones for
     this system; don't leave the example's placeholder rules in place.
   - `registry.json` — real components, each with `slug`, `status`
     (`stable`/`retiring`/…), `guidance.usage`, and `replacedBy` when
     retiring. Mark internal-only building blocks `"internal": true` (see
     §Don't-ship-empty-layers below on why `search_components` gates on
     this rather than filtering it out entirely).
   - `templates.json` — **only keep this + `list_templates`/`get_template`
     if this design system genuinely ships whole-screen templates** (the
     MBDS-style layer). If it doesn't, delete the file and the `if (...)`
     block in `server.mjs` that registers those two tools — an
     always-empty stub is worse than no tool at all, because it invites a
     governance skill to treat "empty" as "checked, nothing found" instead
     of "this layer doesn't exist here."
   - `changelog.json` — start with one real `1.0.0` entry for the initial
     publish. Every later change to the registry gets its own entry here,
     mirrored by `get_changelog` — this is what makes the changelog *live*
     rather than a static file an agent has to separately go read.
3. **Rename** `designSystem` in each data file and the package name to
   match your chosen short name.
4. **Verify it before deploying**: `npm install && node smoke-test.mjs`
   should print `SMOKE TEST PASSED`. Then `npm run build-registry` and spot
   check a file under `public/r/components/`.
5. **For production**, swap `StdioServerTransport` for
   `StreamableHTTPServerTransport` (same `@modelcontextprotocol/sdk`
   package) so the server runs as `POST /api/mcp` — the shape every
   sibling system in this repo actually uses — deployed alongside the
   static `public/r/` tree and a human-readable `#/...` doc site on the
   same origin. See `example-mcp-server/README.md` step 4 for the exact
   swap.
6. **Publish `llms.txt`** at the site root (copy+edit the example's) so the
   tool list is discoverable without scraping.
7. **Wire a governance skill to it** — copy the *shape* of
   `ds-governance-audit-asana/SKILL.md`'s §Design System Identification:
   never assume one Design System when several exist; confirm which one is
   the target before calling its `search_components`; if this new system
   has a templates or patterns layer, add the same whole-screen/pattern gate
   that skill already has for MBDS/webds respectively, keyed off whether
   your `data/templates.json` (or a patterns equivalent) is non-empty.

## ได้อะไรออกมา — Output

A runnable MCP server + matching static registry + `llms.txt` for a new
design system, structurally identical to CDS/MBDS/webds/cib's own shape —
ready to rewrite with real content and deploy, and ready for a governance
skill to be pointed at.

## พังบ่อยตรงไหน — Common failure points

1. **Treating the rendered `<name>-bbl.vercel.app` site as fetchable data.**
   It isn't — every sibling system in this repo makes the same point
   independently (`ds-governance-audit-asana/SKILL.md` line ~110–114): it's
   a client-rendered app with no real DOM content. Read the MCP tools or
   the static `/r/*.json` files instead, never the `#/...` pages.
2. **Shipping an empty optional layer.** An empty `list_templates`/
   `get_template` (or a `get_pattern`) that always returns `[]` reads to a
   governance skill as "checked, nothing here" rather than "this layer
   doesn't exist for this system" — omit the tools entirely if the layer
   doesn't apply, per Step 2 above.
3. **`search_components` under-counting real matches.** Plain name/tag
   matching misses internal-only building blocks unless `includeInternal:
   true` is passed — this repo's own `ds-update-sync-inventory/SKILL.md`
   flags exactly this failure mode against the real CDS registry. Always
   cross-check an ambiguous "no match" against `includeInternal: true`
   before concluding a real gap.
4. **A registry's own `search_components`/`get_rules` can still be
   incomplete**, even when built correctly — `ds-extract-prototype-to-
   figma-canvas/CHANGELOG.md` v0.8.0 documents a real case where the DS's
   own MCP tools missed three components a maintainer's hand-written
   `COMPONENTS.md` did have. A governance skill built against a system
   scaffolded here should still check for a maintainer doc as a second
   source before calling something a genuine gap — this scaffold's own
   `data/registry.json` is that authoritative source for what it ships,
   but isn't a substitute for a human maintainer's own notes once real
   people start maintaining the real system.
5. **Fabricating changelog history.** Only add a `changelog.json` entry for
   a change that actually happened to the registry, with the version bump
   it actually shipped in — never backfill entries to make history look
   more complete than it is.

## Boundaries

- Never scrape or fetch a real, unavailable design system's live site to
  reconstruct its actual component names, tokens, or copy — this skill
  scaffolds the *pattern* (tool names, data shapes, layering rules) for a
  **new** system you have real ownership of, never a copy of another
  system's proprietary content.
- Never ship `list_templates`/`get_template` or an equivalent optional
  layer with permanently empty data — omit the tools instead (§failure
  point 2).
- Never let `search_components`/`check_coverage` claim a gap is real
  without also trying `includeInternal: true` and, once one exists, a
  maintainer doc outside the registry itself (§failure points 3–4).
- Never write a `changelog.json` entry that doesn't correspond to a real
  change (§failure point 5).
- When wiring a governance skill to a system scaffolded here, never let it
  default to a different Design System's rules when more than one MCP
  server is available — confirm the target explicitly, same as
  `ds-governance-audit-asana`'s own §Design System Identification already
  requires.
