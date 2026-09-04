---
name: ds-update-sync-inventory
description: Bootstrap or re-sync a 🗂 Component Inventory database in Notion from a published Figma design system library — creates rows matching Figma's real components/categories/order exactly, and sets up a growing per-component Change log (versioned toggles, each with a reason and a Specification subpage of measured Figma values). Use when there's a Figma library but no Notion inventory yet, or when an existing inventory has drifted from the real library. First of the three Design System Governance skills — ds-governance-audit-notion and ds-governance-pr-notion assume this inventory already exists.
---

> Read this before running: this is the **bootstrap / re-sync** skill. It doesn't audit screens (`ds-governance-audit-notion` does that) and it doesn't sync Component-issue status changes (`ds-governance-pr-notion` does that) — both of those assume a 🗂 Component Inventory already exists and is accurate. This skill is what makes that true in the first place, and keeps it true as the library evolves.

## What triggers this skill

The user has a **published Figma design system library** (Core or a project-level one) and either:

- **No Notion inventory exists yet** — they want one built from scratch, matching the Figma file exactly (names, categories, order).
- **An inventory exists but has drifted** — Figma moved on (renamed/recategorized/added/removed components) and Notion didn't follow. Re-sync it to match.

Prompt shape the user will give you:

```
Use the ds-update-sync-inventory skill.

Figma library file: [URL of the published design library]
Notion inventory: [URL of an existing 🗂 Component Inventory database to re-sync, OR a parent page URL to create a new one under]
Consumer doc repo (optional): [a folder/zip of component guideline docs, if the user has one — see default below]
```

**Default consumer doc repo (added 2026-08-15):** if this line is omitted, this project has a real
one — โย's (Yo's) `cds-consumer`: `https://github.com/therealveldt/cds-consumer.git`. It is
**private**, but this environment already has working git access to it (confirmed via
`git ls-remote` — no extra auth setup needed). Clone it shallow into the scratchpad and use it as
the consumer doc repo unless the user names a different one or says not to. Only fall back to "no
repo, use the Figma description field" if the clone itself fails.

This repo also carries a machine-readable `context/` layer generated from live Figma captures —
worth knowing about for this skill and `ds-governance-audit-notion` alike:

| File | Holds | Useful for |
| --- | --- | --- |
| `context/COMPONENTS.md` | Every public component, its properties, and what each variant binds | Cross-checking a component's real property list before writing one into Notion |
| `context/REGISTRY.md` | Every token/variable name and value, per collection | Cross-checking a token name actually exists before citing it |
| `context/DRIFT.md` | Open Figma-library defects, and a "Settled — do not re-flag" table of owner rulings | `ds-governance-audit-notion` Step 4 checks this before logging a Gap |
| `components/*.md` | Family-level guideline docs — what Step 4a below pulls from | Step 4a |
| `CHANGELOG.md` | The real changelog shape this project uses | Reference for `ds-governance-pr-notion` |

These `context/*.md` files carry their own `captured:`/`library_version:` frontmatter — check that
against the Figma library's current version before trusting them over a live `use_figma` read. They
are a capture, not a live source; when their version looks behind what Step 1 reads live, prefer
the live Figma read and say so in the summary.

If no consumer doc repo resolves at all, guideline content comes from the Figma component's own description field (if set) — never invent "when to use" prose from nothing. Say so plainly rather than fabricating.

## Step 1 — Read the real Figma library structure

**Load `figma-use`, then use `use_figma` for this — not `get_metadata`.** `get_metadata` called with no `nodeId` (to list top-level pages) is unreliable on multi-page library files — it returned only 1 of 9+ real pages in testing, silently dropping the rest with no error. `use_figma` reading `figma.root.children` returns the complete, accurate page list every time:

```js
return figma.root.children.map(p => ({ id: p.id, name: p.name }));
```

From that list, classify each page:
- **Category divider** — a page whose name is a decorative separator, e.g. `—— INPUTS ——` or `---`. Not a component; defines the category name for every component page that follows it until the next divider.
- **Real component page** — everything else that represents an actual component, typically carrying a status marker emoji (e.g. 🟩/🟦/🟧 for build maturity) and a version suffix (e.g. `Checkbox – POC1.0`). Strip the marker emoji and version suffix to get the clean `Component Name`; keep the version string separately for `Published Version`.
- **Not a component** — overview/onboarding/changelog/cover pages, sandbox or archived pages (often marked `⛔️` or living under a name like `_⛔️ Sandbox`), and non-component utility pages (e.g. a `Density` config page). Ask the user if a page's status is ambiguous — don't guess it away.

**Include everything that carries the maturity marker, including `_`-prefixed ones.** Don't exclude "private-looking" components (leading underscore) on your own judgment — that was tried in this skill's own development and was wrong; the user explicitly wanted every marked page in, private-named or not. If the user's instruction was "bring in anything marked 🟦/🟩/🟧," honor that literally.

For each real component page, also grab its **description field** (if the Plugin API exposes one on that node) and its **child variant/property structure** — you'll need both later.

## Step 2 — Reconcile against Notion

### If bootstrapping (no inventory yet)
Create the database under the given parent page with this schema (adapt names to match any existing sibling inventory's conventions if one exists, e.g. a Project inventory already using `Category`/`Component Name`/etc.):
- `Component Name` (title)
- `Category` (select) — **create the options in the exact order the dividers appeared in Figma**, not alphabetically and not in whatever order rows happen to be written. Notion's ascending sort on a select property follows the *option definition order*, not the text — get this order right once, up front, and every future sort just works.
- `Design System Link` (url)
- `Published Version` (text)
- `Last Published Date` (date)
- `Status` (status or select, matching whatever convention the org's other inventories use — check a sibling database first via `fetch` rather than inventing a new one)

### If re-syncing (inventory exists)
Query every existing row (`notion-query-data-sources`, SQL `SELECT` over the data source), then for each real Figma component:
- **Row exists, name/category match** → just refresh `Design System Link` and `Published Version` if they've drifted.
- **Row exists, name or category differs** → this is a rename/recategorization case (e.g. Figma's real name is `Card Container`, Notion says `Card`) — fix it, don't create a duplicate.
- **No row matches** → create one.
- **A Notion row matches nothing in the current Figma list** → this is drift *the other way* (component removed/renamed in Figma, or a row that was never real). **Never delete or silently recategorize it.** Move it to a clearly separate marker (reuse an old/legacy category value, or a dedicated "Needs review" bucket) so it's visually obvious and separated from the confirmed-accurate rows, then flag it to the user in your summary. Deleting is their call.

**Re-fetch schema/row state immediately before a large write batch, not just once at the start.** This is a live collaborative document — if you read the schema, then spent several turns doing something else, and only now fire 40+ writes, a human may have edited concurrently (added a property, deleted a row, removed a property you were about to write to). A stale-schema write batch fails confusingly (e.g. `Property "X" not found` on every call) — cheaper to re-check than to debug 40 identical errors after the fact.

## Step 3 — Fix the database view

Two things reliably go wrong here:

1. **Sort.** Set the main view's sort to `Category ASC` via the `SORT BY` view DSL directive. Do not validate this by running a SQL `SELECT ... ORDER BY "Category"` through the query tool — that query engine sorts select properties alphabetically as an artifact of its own layer, which is a different code path from how the real Notion view renders and will make a correctly-configured view look "wrong" when it isn't. Trust the view DSL, not the SQL sort, for select-property ordering.
2. **Filters.** A view can carry two independent filter layers: a legacy `simpleFilters` quick-filter chip (often an inert leftover with an unset value — harmless clutter, not what's hiding rows) and the real `advancedFilter` (what actually restricts visible rows). `CLEAR FILTER` via `notion-update-view` only touches the latter. If rows still seem to be "missing" after a resync, re-fetch the database's view config and check both layers explicitly — set an explicit `FILTER "Category" IS NOT EMPTY` on the all-rows view rather than assuming an empty state means no filter is applied.

If the user reports specific components "missing" after you've done all this, don't assume the data is wrong — re-query the row count and the specific rows first. In this skill's own testing, the data was correct every time; the visible symptom was always a stale client view (needs a manual refresh) or a stale filter/sort config, never lost data.

## Step 4 — Per-component page content

Every component's Notion page gets two independent sections. **Keep them separate — don't blend prose guidance with measured values in the same block.**

### 4a. Guideline section (top of the page, always visible, not in a toggle)
`## When to use it`, `## Do and don't`, `## Accessibility`, `## Related` — sourced from the optional consumer-doc repo's family-level file (e.g. `components/selection-controls.md` covering Checkbox/Radio/Switch as a family), **filtered down to what specifically concerns this one component** — don't paste the whole family file into every child component's page verbatim, that's noise. If no consumer-doc repo was given, use the Figma component's own description field if it has one; if neither exists, write a short callout saying guideline content hasn't been written yet rather than inventing it.

Consumer-doc convention (if using one like `cds-consumer`) deliberately keeps this section **free of literal values** — "reference tokens by name only, never state what a token resolves to, never state a component's dimensions." Respect that split; the numbers belong in 4b, not here.

### 4b. Change log (toggle chain, growing over time)
A `### Change log` heading followed by one `<details>` toggle per version, oldest or newest first per whatever convention the existing inventory already uses (check a sibling component's page before assuming). Each toggle:

```markdown
### Change log
<details>
<summary>Version 01, [date]</summary>
	**Reason:** [what changed and why — the baseline entry reads "captured live from [library name] during initial inventory sync"]
	<page>Specification</page>
		[measured spec content — see below]
</details>
```

**When this skill (or a later run of it) detects the same component changed again** — new `Published Version`, or the user names the component and says it changed — **append a new toggle** (`Version 02`, etc.) below the existing one(s). Never overwrite or delete an earlier toggle; the whole point is a growing history. Read the page's current toggles first so you know the next version number and don't duplicate one.

#### Specification subpage content — measured values only, not descriptions
This is the part a prose guideline doc structurally cannot give you (see 4a) — pull it live from the actual Figma node:

1. `get_metadata` on the component's canvas/frame to find real pixel dimensions and child layout (position/size of internal parts).
2. `get_variable_defs` on a representative variant (and on each meaningfully-different state — default/selected/disabled/etc.) to get the actual bound token names **and their resolved values** (hex, px). This is the one case where citing a resolved value is correct and wanted — the Specification subpage is exactly the place that's allowed to say "`Border/Action/Action Primary` = `#0064ff`," unlike the guideline section above it.
3. Write it as a table: state × (fill token+value, border token+value, icon/content token+value, size). Include corner radius and border width as their own lines with the literal px number and the token name that produces it.
4. Close with a one-line source note: which node was measured, and the date.

If `get_design_context` triggers a Code Connect mapping prompt you don't need for this task (you're extracting measurements, not generating code), you don't have to resolve it — `get_metadata` + `get_variable_defs` are sufficient and avoid that detour entirely.

## Step 5 — Confirm back to the user

One short summary: how many rows created vs. updated vs. flagged-as-drift, whether the view sort/filter needed fixing, and a couple of example component page links so they can spot-check the guideline/spec split looks right before you (or they) run this across the rest of the library.

## Known gotchas (from building this skill)

- `get_metadata` with no `nodeId` can silently under-report pages on a real multi-page file. Verified via `use_figma` + `figma.root.children` instead — always prefer that for a full, accurate page enumeration.
- Don't apply your own judgment to exclude components that look "private" or "internal" (leading `_`) unless the user's own instruction implies it — ask, or follow their literal criterion (e.g. "anything with a 🟦/🟩/🟧 marker").
- Never delete or archive a Notion row yourself, even one that's clearly stale/orphaned. Flag it, leave it in a visually separate bucket, let the human decide. (In practice, users often go delete flagged rows themselves in the live doc within the same session — don't race that; re-check state before your next big write.)
- A live Notion doc can change under you mid-task. If a batch of writes fails with a schema error that contradicts what you read minutes ago, re-fetch the schema before retrying — don't assume the tool call was wrong.
- Two different Notion sort/filter code paths exist: the SQL query tool (alphabetical on selects, a query-engine artifact) and the real view renderer (option-definition order). Don't use the former to validate the latter.
- Component guideline prose and measured specs are different documents with different rules — one names tokens and never states values, the other exists specifically to state values. Keep them in different blocks (top-of-page vs. Specification subpage) so neither convention gets violated by accident.
