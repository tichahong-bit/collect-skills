---
name: ds-update-sync-inventory
description: Bootstrap or re-sync the 🗂 Core Design System Library (Inventory) Asana project from a published Figma design system library — creates/updates one task per component matching Figma's real names/categories/order exactly, checks each one's real shipped-in-code status against the CDS registry (cds-bbl.vercel.app, via the `cds` MCP tools), and links each task to its CDS docs page. This is a code/Figma existence tracker, not a Notion-style governance/narrative doc — category taxonomy and section order matter, prose guideline content does not. Requires the `asana-admin-mcp` MCP server for anything beyond plain task CRUD (custom fields, enum options, sections). First of the Design System Governance skills — ds-governance-audit-asana and any PR-sync skill assume this inventory already exists.
---

> Read this before running: this is the **bootstrap / re-sync** skill for the Asana Component
> Inventory. Its job is narrow — keep one task per real Figma component, correctly categorized,
> correctly ordered, and honestly marked as shipped-in-code or not. It doesn't write governance
> narrative (that died with the Notion version of this project — see History below) and it doesn't
> audit screens (`ds-governance-audit-asana` does that).

## Prerequisite — install `asana-admin-mcp`

Plain Asana task tools (`create_tasks`, `update_tasks`, `get_tasks`) are enough for day-to-day task
edits. But **custom fields, dropdown options, and sections need `asana-admin-mcp`**
(`https://github.com/plakorp/asana-admin-mcp`) — the standard Asana connector has no tools for any
of that. If a task in this skill needs `enum_option_create`, `section_reorder`,
`custom_field_attach`, or similar and those tools aren't in your tool list, install it first:

```
/plugin marketplace add plakorp/asana-admin-mcp
/plugin install asana-admin@asana-admin-mcp
```

Needs Node 20+ and a personal Asana token (see the repo's `GET-TOKEN.md`) saved to
`~/.asana_token`. Each person needs their own token — don't share one, Asana logs the owner.

**If a tool the README lists (e.g. `custom_field_detach`) doesn't show up in `ToolSearch` or errors
`No such tool available`,** the running server instance is stale — the tool existing in the repo's
source doesn't mean this session's connection has it loaded. Tell the user to restart/update the
plugin (`/plugin update` or reconnect) rather than assuming the capability doesn't exist. This
happened during this skill's own development: `custom_field_detach` was real in source (v1.4.0) but
absent from the live session until reconnected.

## Default target project

`🗂 Core Design System Library (Inventory)` — project gid `1217578024173799`, workspace
`1153565613997788` (bangkokbank.com),
`https://app.asana.com/1/1153565613997788/project/1217578024173799/list/1217578024173825`. Use it
unless the user names a different project.

### History — read before assuming Notion-style content belongs here

This project was originally cloned from a Notion inventory, and this skill's first version
(`ds-governance-inventory-notion`) was built around Notion conventions: per-component guideline
prose, a toggle-chain changelog, literal token values in a "Specification" subpage. **All of that
was the wrong model for Asana** and was reverted mid-session once the project's real purpose came
out: *log which components exist in the Figma library, and whether each one is actually shipped in
code yet* (checked against the CDS registry, not against a consumer-doc repo). Don't reintroduce
Notion-shaped content (guideline prose sections, literal-value spec pages) unless a future user
explicitly asks for it — it was tried once, on this exact project, and undone.

### Current schema (custom fields)

| Field | Type | What it means | Who sets it |
| --- | --- | --- | --- |
| Task **name** | — | Component Name, exactly as Figma names it (strip maturity marker + version suffix) | This skill |
| `Category (Core)` | enum | One of the 15 categories below | This skill, kept in sync with section |
| `Published Version` | text | The POC/version suffix from the Figma page name (e.g. `POC1.2`) | This skill |
| `Design System Link` | text | Figma node URL (`...?node-id=...`) | This skill |
| `Last Published Date` | date | When the component was last published in Figma | This skill (only if known — don't guess) |
| `Code Status` | enum: `Shipped in Code` / `Design Ahead of Dev` | Whether the component is real, installable/documented CDS code today | This skill, via `cds` MCP tools — see Step 4 |
| `Code Last Checked` | date | Last time Code Status was verified against the CDS registry | This skill, every time Step 4 runs |
| `CDS Component Link` | text | `https://cds-bbl.vercel.app/#/components/<slug>` — the component's real CDS docs page | This skill — see Step 5 |
| `Projects Using` | number | How many consuming projects use this component | Manual — not derivable from Figma or CDS, don't guess |

**`Governance Status` existed on this project (Publish / Need Discussion / Updated) and was
deliberately removed** (2026-09-05) — it was a leftover from the Notion-governance model and wasn't
serving the code/Figma-tracking purpose. Don't recreate it unless asked.

## The 15-category taxonomy — canonical reference

This is the real, current Figma page-divider order for the Core Design Library
(`ON8Azjo7wIi3P2oxnxKiBb`). **Section order in Asana, `Category (Core)` enum-option order, and task
order within each section must all match this exactly** — get this list right and every ordering
step below is mechanical.

| # | Category | Components, in Figma order |
| --- | --- | --- |
| 1 | BUILDING BLOCKS | _Focus Ring, _State Overlay |
| 2 | BUTTONS | Button, Button Combo, FAB |
| 3 | CONTAINERS | Accordion, Card Container |
| 4 | CONTENT BLOCKS | Content Blocks |
| 5 | DATA DISPLAYS | Avatar, Badge, Progress Bar, Stepper, Tag |
| 6 | FEEDBACK | Alert, Inline Message, Loader, Toast |
| 7 | FIELDS | Select Field, Text Area, Text Field, Search |
| 8 | LISTS | List |
| 9 | NAVIGATION | Breadcrumb, Footer, Pagination, Sidebar, Tabs, Top Navbar |
| 10 | OVERLAYS | Backdrop, Bottom Sheet, Dialog, Drawer, Menu, Popover, Tooltip |
| 11 | PICKERS | Date Picker, Date Time Picker |
| 12 | SELECTION CONTROLS | Checkbox, Chip, Radio, Slider, Switch |
| 13 | TABLES | Table |
| 14 | UTILITIES | Divider, _Icon Wrapper, Scroll Bar |
| 15 | UI MOCKUPS | OS Native, Placeholder |

Two names to watch: the Figma node that's currently named **Sidebar** used to publish as
"Navigation Bar" — Asana may still say "Navigation Bar" on an unsynced project; rename it, don't
duplicate it. And **NAVIGATION** (singular) is the current real category; an older/legacy Asana
project may have "NAVIGATIONS" (plural) as leftover drift.

## Step 1 — Read the real Figma library structure

**Load `figma-use` if `use_figma` is available, otherwise use the connected Figma Desktop Bridge
(`figma-console` MCP — `figma_execute`, `figma_get_status`).** Check `figma_get_status(probe:true)`
first; if no file is connected, tell the user to open Figma Desktop on the target file and run the
Desktop Bridge plugin (Plugins → Development → Figma Desktop Bridge → Run), then re-probe.

Read the full page list in one read-only script — don't paginate by hand:

```js
return figma.root.children.map(p => ({ id: p.id, name: p.name }));
```

`get_metadata` with no `nodeId` is unreliable on multi-page files (returned 1 of 9+ pages in prior
testing) — always prefer the direct `figma.root.children` read.

Classify each page:
- **Category divider** — a page named like `——— BUTTONS ———`. Defines the category for every
  component page until the next divider.
- **Real component page** — carries a maturity marker (🟩/🟦/🟧) and a version suffix (e.g.
  `Checkbox – POC1.0`). Strip both to get the clean Component Name; keep the version separately.
- **Not a component** — overview/onboarding/changelog/cover pages, `_⛔️`-marked archived pages. Ask
  if a page's status is ambiguous.

**Include every marked page, including `_`-prefixed ones** (`_Focus Ring`, `_State Overlay`,
`_Icon Wrapper` are real, in-scope components) — don't exclude "private-looking" names on your own
judgment.

## Step 2 — Reconcile tasks against the taxonomy

Query every existing task:
```
get_tasks(project, opt_fields="name,notes,memberships.section.name,custom_fields.name,custom_fields.display_value")
```
paginating via `next_page.offset`. Match by the Figma node id embedded in `Design System Link`
(`...?node-id=X-Y`), not by name alone — names can legitimately be stale (see the Sidebar case
above).

For each real Figma component:
- **Task exists, node id matches, name/category already correct** → nothing to do beyond refreshing
  `Published Version` / `Design System Link` if they drifted.
- **Task exists, name differs from Figma's current name for that node** → rename the task, don't
  create a duplicate.
- **Task exists, but `Category (Core)` doesn't match the taxonomy above** → this happens after any
  taxonomy migration or a legacy project — fix both the enum value **and** section membership (see
  next paragraph) together.
- **No task matches that node id** → create one, in the right section, with `Category (Core)` set.
- **A task matches nothing in the current Figma list** → drift the other way. **Never delete it.**
  Move it to a `Needs Categorization` section (create one if missing) and flag it in your summary.

**`Category (Core)` (the enum value) and section membership are two separate pieces of state.**
Setting one does not move the other — every task write that changes category must set both the
custom field value *and* `add_projects` with the matching `section_id` in the same call:
```
update_tasks([{ task, custom_fields: { "<Category (Core) field gid>": "<enum option gid>" },
                add_projects: [{ project_id, section_id }] }])
```

**Re-fetch task/enum-option state right before a large write batch, not just at the start** — a
human may edit concurrently, and a stale enum-option gid fails confusingly.

## Step 3 — Section order and task order within sections

### Section order
List sections (`project_list_sections`), then `section_reorder` each into the exact 15-category
order above, plus any drift/legacy sections pushed to the tail (`Needs Categorization` last among
the "live" sections). If a category's section doesn't exist yet (e.g. after re-enabling a
previously-disabled taxonomy), `section_create` it — sections can silently disappear from
`project_list_sections`/`get_project` once they go empty via API-driven moves (observed in this
skill's own development), so don't assume a section you created earlier still exists; recreate it
if it's missing rather than erroring.

### Task order within a section — no direct tool, use the append-to-bottom workaround
**No tool in `asana-admin-mcp` or the standard Asana connector supports positioning a task within a
section** (no `insert_before`/`insert_after` exposed anywhere, even though Asana's REST API has it).
The only controllable primitive is: adding a task to a section **always appends it after the
current last task in that section.**

This means you *can* force full section order, by processing every task in the section **in your
target order**, each as a *separate* remove-then-add:
```
update_tasks([{ task, remove_projects: [project_id] }])   // step 1, alone
update_tasks([{ task, add_projects: [{ project_id, section_id }] }])  // step 2, alone
```
Process task 1 (remove, add), then task 2 (remove, add), then task 3, etc., in the exact order you
want them to end up. Each append lands below everything currently in the section, so processing in
target order reproduces that order exactly. Sections can be processed in parallel with each other
(they don't interact) — within one section, the remove/add pairs must stay strictly sequential.

**Never combine `remove_projects` and `add_projects` for the same task in one `update_tasks` call.**
Confirmed bug: doing so silently drops the task from the project entirely (it ends up in no
project, memberships empty) rather than moving it — custom field values survive on the task object,
but you have to notice the task vanished from the section and re-add it. Always two separate calls.

After a full reorder, verify a couple of sections with `get_tasks(section: <gid>)` — the returned
order is the real displayed order.

## Step 4 — Verify Code Status against the real CDS registry

**Use the `cds` MCP tools (`search_components`, `check_coverage`, `get_component`) — not a web
fetch or browser scrape of `cds-bbl.vercel.app`.** These tools read the same registry live and
return exact slugs, install commands, and doc-page URLs.

1. `check_coverage(items: [<all clean component names>])` gives a fast first pass — but its
   name-matching is naive (plain string match) and **under-counts real matches**: it missed
   `Radio`→`radio-button`, `Switch`→`toggle-switch`, `Badge`→`status-badge`, `Loader`→
   `circular-loader`, and every "not installable but still real" component (anything whose Figma
   name differs from its CDS name). **Don't trust a `check_coverage` `false` as final** — cross-check
   with `search_components(query: "", includeInternal: true)` (returns the full ~106-entry roster)
   before concluding a component genuinely has no CDS equivalent.
2. Only flip `Code Status` to `Shipped in Code` when there's a real registry entry — prefer one with
   `installable: true`. An entry that's `internal: true` and `installable: false` (e.g.
   `_Utilities / Focus Ring`) is ambiguous — a documented spec, not necessarily real shipped code —
   leave its existing status alone rather than asserting either way, and say so in your summary.
3. **A registry entry's `page` field is strong evidence for genuinely ambiguous Figma↔CDS name
   mismatches** — e.g. `browser-search-bar`'s registry `page` is literally `"🟦 OS Native – POC1.2"`,
   and `website-footer-template`'s `page` is literally `"🟦 Footer – POC1.2"`. When a Figma
   component's name doesn't obviously match anything, check whether some registry entry's `page`
   names *that exact Figma page* — that's a confirmed match, not a guess.
4. Some Figma components are genuinely **1-to-many** against the registry (no single wrapper
   component covers them): `Table` (→ `table-cell`, `table-head`, `table-cell-row`,
   `table-head-row`, `table-footer`), `Content Blocks` (→ `heading-text-block`, `text-list`,
   `paragraph-text-block`, `display-text-block`, `dialog-content-block`), `Button Combo` (→
   `vertical-button-combo`, `horizontal-button-combo`). Still mark these `Shipped in Code` (the
   underlying pieces are real) — just don't expect one clean docs link (see Step 5).
5. Fields like `Code Status`/`Code Last Checked` are **code-audit signals, independent of the Figma
   re-sync** — always update `Code Last Checked` to today whenever you run this check, even for
   tasks whose status didn't change.
6. Don't touch `Projects Using` — it isn't derivable from either Figma or the CDS registry.

## Step 5 — `CDS Component Link` field

Populate with the component's real docs page: `https://cds-bbl.vercel.app/#/components/<slug>`,
using the slug from `search_components`/`check_coverage` (the tool's own `docs` field is already the
exact URL — copy it, don't hand-construct unless the tool didn't return one).

- **Genuine no-match** (no registry entry at all, not even by page-attribution — e.g. `Search`, a
  FIELDS-category text input with nothing equivalent in the registry): leave the field blank. Don't
  link a superficially-similar but conceptually different entry (`browser-search-bar` is a
  browser-chrome address bar mockup piece, not a form search field — it does NOT satisfy a "Search"
  field component just because the words overlap).
- **1-to-many families** (see Step 4 point 4): pick the single most representative sub-component as
  the primary link rather than leaving it blank — e.g. `Table` → `table-cell-row` (the composable
  row unit), `Content Blocks` → `heading-text-block` (first/most foundational of the family),
  `Button Combo` → `horizontal-button-combo` (the more general-purpose orientation per its own
  description). State the pick and the reasoning in your summary; it's a judgment call, not a fact.
- **Page-attribution matches** (Step 4 point 3): link with full confidence, these aren't guesses.

## Step 6 — Confirm back to the user

One short summary: tasks created vs. updated vs. flagged-as-drift, whether section/task order
needed fixing, how many Code Status flips and why, which `CDS Component Link` entries stayed blank
and why, and a couple of example task `permalink_url`s to spot-check.

## Known gotchas

- `get_metadata` with no `nodeId` under-reports pages on multi-page Figma files — always read
  `figma.root.children` directly instead.
- Don't exclude `_`-prefixed "private-looking" Figma components on your own judgment.
- Never delete an Asana task — flag drift into `Needs Categorization` and let the human decide.
- `Category (Core)` enum value and section membership are separate state — every recategorization
  must update both.
- **Combining `remove_projects` + `add_projects` for the same task in one `update_tasks` call drops
  the task from the project entirely** — always two separate sequential calls (Step 3).
- **Asana's API forbids deleting an enum option** (`DELETE /enum_options/{gid}` → 403 "Enum option
  deletion is forbidden," even though the route exists and 404s look like it might work) —
  `enum_option_update(enabled:false)` is the only retirement available; tasks already holding a
  disabled option keep it.
- **No tool exists to delete an Asana section** (`asana-admin-mcp` only offers `section_create`/
  `section_update`(rename)/`section_reorder`, deliberately no delete) — an emptied, unwanted section
  has to be removed by hand in the Asana UI (right-click the section → Delete). Don't spend time
  looking for a tool-based workaround; there isn't one as of `asana-admin-mcp` v1.4.0.
- A `project_list_sections`/`get_project` read can silently omit a section that has zero tasks in
  it, even one you created moments ago — don't assume a "missing" section was never created; check
  whether it's simply empty before recreating it.
- Fields that look like Figma-sync fields but aren't: `Code Status`, `Code Last Checked`,
  `Projects Using` are code-audit signals (Step 4), not something Step 2's Figma reconciliation
  should ever guess at.
- `check_coverage`'s plain name-matching under-counts real CDS matches — always cross-check
  ambiguous "not CDS" results against the full `search_components("")` roster before concluding a
  gap is real (Step 4).
