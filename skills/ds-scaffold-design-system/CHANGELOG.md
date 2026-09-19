# Changelog — ds-scaffold-design-system

## v1.0.0 (2026-09-18, initial creation)

Requester asked to "clone" `https://mbds-bbl.vercel.app/#/bbl`, "ทั้ง MCP
ทุกอย่าง" (everything, including the MCP layer). Two things ruled out a
literal clone: the session's network egress proxy blocks that domain
outright, and on clarification the requester confirmed they don't own that
project and have no source repo for it — a literal clone would have meant
scraping and reproducing another team's proprietary design-system content
with no rights to it.

Further clarification surfaced the real ask: not that site's specific
content, but the *architecture* — an MCP server + live changelog +
governance discipline, generalized as a **meta-skill** ("scaffold design
system ไหนก็ได้") that can stand up a *new* design system for any project,
plus example code, not just documentation.

That architecture was already fully documented, independently, across four
sibling design systems this repo's own skills reference — CDS, MBDS, webds,
and cib — each with its own MCP tool server, `<name>-bbl.vercel.app` site,
and (per `ds-governance-audit-asana/SKILL.md` and `.../CHANGELOG.md`
v2.2.0) an explicit warning that the rendered site is a client-side mirror
with no real DOM content, never a fetchable source. This skill synthesizes
that already-proven pattern into a standalone, reusable scaffold rather than
inventing a new one — see SKILL.md's §Origin for the exact citations.

Shipped:
- `SKILL.md` — the pattern, scaffolding steps, and the same class of
  common-failure-point/boundary content this repo's other skills carry
  (sourced from real corrections already recorded in sibling skills'
  changelogs — internal-component under-counting, empty-optional-layer
  ambiguity, a registry's own tools still being incomplete, and the
  never-scrape-the-rendered-site rule).
- `example-mcp-server/` — a real, runnable MCP server (stdio transport,
  `@modelcontextprotocol/sdk`) implementing `get_rules`, `list_families`,
  `list_components`, `search_components`, `get_component`,
  `check_coverage`, `get_changelog`, and an optional
  `list_templates`/`get_template` pair, backed by swappable `data/*.json`.
  Verified working end-to-end via `smoke-test.mjs` (spawns the server,
  calls every tool through a real MCP client) before being committed.
- `example-mcp-server/scripts/build-registry.mjs` — derives a
  shadcn-registry-compatible static `public/r/*.json` tree from the same
  data, matching the `npx shadcn@latest add <site>/r/components/<slug>.json`
  install pattern this repo's governance skills already assume. Verified
  by running it and inspecting the generated files.
- `example-mcp-server/llms.txt` — a filled-in example of the tool-discovery
  file `ds-governance-prototype-asana/CHANGELOG.md` describes `cib` as
  already shipping for this exact purpose.

Not shipped, by design: an actual deployed Vercel site or a full component
UI implementation. The requester asked for "skill อธิบาย pattern + โค้ด
ตัวอย่าง MCP server" specifically — a working server plus the pattern it
implements, not a full product build. `example-mcp-server/README.md` §5
covers the HTTP-transport swap needed to actually deploy this shape.
