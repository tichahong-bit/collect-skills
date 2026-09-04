---
name: ds-update-sync-inventory
description: Bootstrap or re-sync a 🗂 Component Inventory in Asana from a published Figma design system library — creates/updates tasks matching Figma's real components/categories/order exactly, and grows a per-component Change log (subtasks, one per version, each with a reason and a Specification note of measured Figma values). Use when there's a Figma library but no Asana inventory yet, or when an existing inventory has drifted from the real library. First of the Design System Governance skills — ds-governance-audit-asana and any PR-sync skill assume this inventory already exists.
---

> Read this before running: this is the **bootstrap / re-sync** skill. It doesn't audit screens (`ds-governance-audit-asana` does that) and it doesn't sync Component-issue status changes — both of those assume a 🗂 Component Inventory already exists and is accurate. This skill is what makes that true in the first place, and keeps it true as the library evolves.

## What triggers this skill

The user has a **published Figma design system library** (Core or a project-level one) and either:

- **No Asana inventory exists yet** — they want one built from scratch, matching the Figma file exactly (names, categories, order).
- **An inventory exists but has drifted** — Figma moved on (renamed/recategorized/added/removed components) and Asana didn't follow. Re-sync it to match.

Prompt shape the user will give you:

```
Use the ds-update-sync-inventory skill.

Figma library file: [URL of the published design library]
Asana inventory: [URL/gid of an existing 🗂 Component Inventory project to re-sync, OR a team/workspace to create a new one under]
Consumer doc repo (optional): [a folder/zip of component guideline docs, if the user has one — see default below]
```

**Default Asana inventory project (added 2026-09-04):** if the Asana inventory line is omitted, this
project has a real one — `🗂 Core Design System Library (Inventory)`, project gid
`1217578024173799` (workspace `1153565613997788`),
`https://app.asana.com/1/1153565613997788/project/1217578024173799/list/1217578024173825`. It was
cloned from the Notion inventory this skill previously targeted; Notion stays the source of truth
for narrative/knowledge (see its `notes` field), this Asana project tracks the live inventory table
only. Use it unless the user names a different project.

**Default consumer doc repo (added 2026-08-15):** if that line is omitted, this project has a real
one — โย's (Yo's) `cds-consumer`: `https://github.com/therealveldt/cds-consumer.git`. It is
**private**, but this environment already has working git access to it (confirmed via
`git ls-remote` — no extra auth setup needed). Clone it shallow into the scratchpad and use it as
the consumer doc repo unless the user names a different one or says not to. Only fall back to "no
repo, use the Figma description field" if the clone itself fails.

This repo also carries a machine-readable `context/` layer generated from live Figma captures —
worth knowing about for this skill and `ds-governance-audit-asana` alike:

| File | Holds | Useful for |
| --- | --- | --- |
| `context/COMPONENTS.md` | Every public component, its properties, and what each variant binds | Cross-checking a component's real property list before writing one into Asana |
| `context/REGISTRY.md` | Every token/variable name and value, per collection | Cross-checking a token name actually exists before citing it |
| `context/DRIFT.md` | Open Figma-library defects, and a "Settled — do not re-flag" table of owner rulings | `ds-governance-audit-asana` Step 4 checks this before logging a Gap |
| `components/*.md` | Family-level guideline docs — what Step 4a below pulls from | Step 4a |
| `CHANGELOG.md` | The real changelog shape this project uses | Reference for any PR-sync skill |

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

## Step 2 — Reconcile against Asana

### If bootstrapping (no inventory project yet)
Create the project (`mcp__plugin_asana-admin_asana-admin__project_create` or `create_project`) with this schema (adapt names to match the default project's conventions above if a sibling inventory already exists):
- Task **name** = `Component Name`
- `Category (Core)` (enum custom field) — **create the options in the exact order the dividers appeared in Figma**, not alphabetically. Attach with `custom_field_attach` / `custom_field_create`.
- A **section per category**, in the same order, plus a `Needs Categorization` section for drift (see below). Sections are the Kanban-column view of the same category — keep both the enum value and the section membership in sync for every task.
- `Design System Link` (text)
- `Published Version` (text)
- `Last Published Date` (date)
- `Governance Status` (enum — matching whatever convention the org's other inventories use; check the default project's `Publish` / `Need Discussion` / `Updated` options first via `asana_list_custom_fields` rather than inventing a new one)

Fields like `Code Status`, `Projects Using`, `Code Last Checked` (present on the default project) are **code-audit signals, not Figma-sync signals** — don't try to derive them from the Figma read; leave them blank on create and untouched on refresh unless the user explicitly gives you a value.

### If re-syncing (inventory exists)
Query every existing task (`get_tasks` with `opt_fields=name,notes,memberships.section.name,custom_fields.name,custom_fields.display_value`, paginating via `next_page.offset`), then for each real Figma component:
- **Task exists, name/category match** → just refresh `Design System Link` and `Published Version` if they've drifted (`update_tasks`).
- **Task exists, name or category differs** → this is a rename/recategorization case (e.g. Figma's real name is `Card Container`, Asana says `Card`) — fix the task name and/or `Category (Core)` value **and** move it to the matching section. Don't create a duplicate.
- **No task matches** → create one (`create_tasks`), in the right section, with `Category (Core)` set to match.
- **An Asana task matches nothing in the current Figma list** → this is drift *the other way* (component removed/renamed in Figma, or a task that was never real). **Never delete it.** Move it into the `Needs Categorization` section (it already exists on the default project for exactly this) so it's visually separated from the confirmed-accurate tasks, then flag it to the user in your summary. Deleting is their call.

**Re-fetch task/custom-field state immediately before a large write batch, not just once at the start.** This is a live collaborative project — if you read it, then spent several turns doing something else, and only now fire 40+ writes, a human may have edited concurrently (renamed a field, deleted a task, changed enum options). A stale-schema write batch fails confusingly (e.g. an enum value gid that no longer exists) — cheaper to re-check than to debug 40 identical errors after the fact.

## Step 3 — Fix section order and views

1. **Section order.** List sections (`project_list_sections`) and reorder them (`section_reorder`) to match the exact divider order read in Step 1. Asana's board/list view renders sections in this stored order — there's no separate "sort by enum option order" concept to fight the way Notion's select-property sort did, so getting section order right is the whole fix.
2. **Orphan section.** Keep `Needs Categorization` (or create it if a from-scratch bootstrap) as the last section, after every real category — it should read as "outside the confirmed structure," not blend into it.
3. Don't rely on a saved custom "sort by Category" view if one exists on the project — verify the actual section membership of a few known components after a big write batch, the same way Notion's view/query split needed double-checking.

If the user reports specific components "missing" after you've done all this, don't assume the data is wrong — re-query the task count and the specific tasks first (`get_tasks`, or `get_project` with `task_counts`). In this skill's own testing (back on Notion), the data was correct every time; the visible symptom was always a stale client view, never lost data — treat an Asana report of "missing" components the same way until proven otherwise.

## Step 4 — Per-component task content

Every component's Asana task gets two independent pieces. **Keep them separate — don't blend prose guidance with measured values in the same place.**

### 4a. Guideline content (task `notes`, always visible)
`When to use it` / `Do and don't` / `Accessibility` / `Related`, sourced from the optional consumer-doc repo's family-level file (e.g. `components/selection-controls.md` covering Checkbox/Radio/Switch as a family), **filtered down to what specifically concerns this one component** — don't paste the whole family file into every child component's task verbatim, that's noise. If no consumer-doc repo was given, use the Figma component's own description field if it has one; if neither exists, write a short line saying guideline content hasn't been written yet rather than inventing it. Always also keep the raw `Figma: [link]` line the default project's existing tasks use.

Consumer-doc convention (if using one like `cds-consumer`) deliberately keeps this content **free of literal values** — "reference tokens by name only, never state what a token resolves to, never state a component's dimensions." Respect that split; the numbers belong in 4b, not here.

### 4b. Change log (subtasks, growing over time)
One **subtask** per version, named `Version 01 — [date]` (`Version 02 — [date]`, etc.), created under the parent component task. Each subtask's `notes`:

```
Reason: [what changed and why — the baseline entry reads "captured live from [library name] during initial inventory sync"]

Specification
[measured spec content — see below]
```

**When this skill (or a later run of it) detects the same component changed again** — new `Published Version`, or the user names the component and says it changed — **add a new subtask** (`Version 02`, etc.) below the existing one(s). Never overwrite or delete an earlier version subtask; the whole point is a growing history. List the parent task's current subtasks first (`num_subtasks` / a tasks-by-parent read) so you know the next version number and don't duplicate one.

#### Specification content — measured values only, not descriptions
This is the part a prose guideline doc structurally cannot give you (see 4a) — pull it live from the actual Figma node:

1. `get_metadata` on the component's canvas/frame to find real pixel dimensions and child layout (position/size of internal parts).
2. `get_variable_defs` on a representative variant (and on each meaningfully-different state — default/selected/disabled/etc.) to get the actual bound token names **and their resolved values** (hex, px). This is the one case where citing a resolved value is correct and wanted — the Specification note is exactly the place that's allowed to say "`Border/Action/Action Primary` = `#0064ff`," unlike the guideline content above it.
3. Write it as a table: state × (fill token+value, border token+value, icon/content token+value, size). Include corner radius and border width as their own lines with the literal px number and the token name that produces it.
4. Close with a one-line source note: which node was measured, and the date.

If `get_design_context` triggers a Code Connect mapping prompt you don't need for this task (you're extracting measurements, not generating code), you don't have to resolve it — `get_metadata` + `get_variable_defs` are sufficient and avoid that detour entirely.

## Step 5 — Confirm back to the user

One short summary: how many tasks created vs. updated vs. flagged-as-drift into `Needs Categorization`, whether section order needed fixing, and a couple of example component task links (`permalink_url`) so they can spot-check the guideline/spec split looks right before you (or they) run this across the rest of the library.

## Known gotchas (from building this skill)

- `get_metadata` with no `nodeId` can silently under-report pages on a real multi-page file. Verified via `use_figma` + `figma.root.children` instead — always prefer that for a full, accurate page enumeration.
- Don't apply your own judgment to exclude components that look "private" or "internal" (leading `_`) unless the user's own instruction implies it — ask, or follow their literal criterion (e.g. "anything with a 🟦/🟩/🟧 marker").
- Never delete or archive an Asana task yourself, even one that's clearly stale/orphaned. Flag it, move it to `Needs Categorization`, let the human decide. (In practice, users often go delete flagged tasks themselves in the live project within the same session — don't race that; re-check state before your next big write.)
- A live Asana project can change under you mid-task. If a batch of writes fails with a "field/enum option not found" error that contradicts what you read minutes ago, re-fetch the custom fields before retrying — don't assume the tool call was wrong.
- `Category (Core)` (an enum custom field) and section membership are **two separate pieces of state that must be kept in sync by hand** — setting one does not move the other. Every create/update that changes category must touch both.
- Component guideline prose and measured specs are different documents with different rules — one names tokens and never states values, the other exists specifically to state values. Keep them in different places (task `notes` vs. version-subtask `notes`) so neither convention gets violated by accident.
- Fields carried over from the old Notion schema but not part of the Figma-sync contract (`Code Status`, `Projects Using`, `Code Last Checked`) belong to a different workflow (code audit) — don't guess values for them just because a row looks incomplete.
