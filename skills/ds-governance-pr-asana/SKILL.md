---
name: ds-governance-pr-asana
version: 1.3.0
description: >-
  Sync a Design System Governance "📋 Component issue" Asana task's status change (Publish & Pending
  refine / Rejected / Consult Core DS / Applied) out to the Figma annotation on the original screen,
  and to the relevant Asana Inventory task. Companion to ds-governance-audit-asana, which creates the
  task in the first place — this skill is the second half ("PR" = Publish/Reject/refine). Has no
  Notion dependency anywhere — everything this skill reads or writes lives in Asana (the Component
  issue project, the Core/Project Inventory projects) and Figma (Dev Mode annotations). Always
  human-triggered: a person changes Issue Status in Asana (or marks an annotation Applied in Figma),
  then runs this skill — there is no background/scheduled trigger, see "What triggers this skill".
metadata:
  status: stable
  mode: mixed
  category: workflow-meta
  derived_from: ds-governance-pr-notion v1.4.0 (Notion sibling — reference only, not a runtime dependency)
  companion_doc: https://app.notion.com/p/3c07817ccced80d0b1b1ee2cc458ae0c
---

> Read this before running: `ds-governance-audit-asana` creates a Component issue **task** and a
> blue "Request Design system" annotation in Figma. This skill runs *after* a human resolves that
> task — it pushes the resolution back out to Figma and to whichever Asana Inventory task is
> affected.

**v1.3.0 (2026-09-05)** — logic pass before this skill's first push to GitHub (previous versions
only ever existed as a local dev copy):
- Replaced every tool reference to the official `use_figma`/`search_design_system`/`get_metadata`/
  `get_screenshot` names (not available in every environment) with the `figma-console` Desktop
  Bridge tool names confirmed working this session — `figma_execute`, `figma_search_components`,
  `figma_capture_screenshot`, `figma_set_annotations`, `figma_get_annotation_categories`. If your
  environment does expose `use_figma` directly, the same JS bodies below work unchanged — only the
  wrapping tool call differs.
- Removed every "see `ds-governance-pr-notion` Step X" cross-reference — this file is now
  self-contained; the Notion sibling is prior art, not a dependency.
- **Fixed a wrong field name:** the Publish branch said to set `Governance Status` = `Publish` on
  *any* Inventory task. Checked live against both real Inventory projects — `Governance Status`
  (gid `1217567936300826`) only exists on **🗂 Project Component Inventory** (gid
  `1217568055044505`); the **🗂 Core Design System Library (Inventory)** (gid `1217578024173799`)
  has no such field at all. Step 2's Publish branch now only touches it for a Project-Inventory
  match.
- **Fixed a field that doesn't exist:** the Rejected branch referenced a "`Related Core Component`"
  field on the Component issue task — no such field exists (checked live against the project's real
  custom fields). Rejected now just says to search the Inventory project by task name, same
  technique Step 2's Publish branch already uses.
- Added the **Reference** table below — every gid this skill reads or writes, in one place, instead
  of scattered inline through the steps (matches `ds-governance-audit-asana`'s own Reference
  section).

**v1.1.0** — the Applied template was a guess, ported from `ds-governance-pr-notion`'s documented
shape without a live check. Verified live against `0ZPE1y1pXUAmFoYhrFdc2X` node `110:1467`: real
shape has no separate Component-Link/Resolved split, the component link is inlined into **Why**,
and a *partial* Applied (most common real case — a designer usually fixes one site at a time) has
no closing checkmark and stays a plain status line with a `(test — N of total sites)` suffix. Only a
fully-resolved Applied closes the case. Also made explicit: the normal path into the Applied branch
is annotation-driven and the **original annotation is expected to be gone** — swapping a raw/broken
frame for a real component instance deletes the old node, and annotations attach to a node's own id.
Write a fresh annotation on the new node; there's nothing to "restore." See Step 2's Applied branch
and Step 3's Applied templates.

**v1.2.0** — made the Asana-initiated direction explicit and non-optional: DS team changes `Issue
Status` to `Publish & Pending refine` or `Rejected` in Asana, runs this skill, and the Figma
annotation on the original node **must** flip from blue (`Request Design system`) to orange/red in
the same run. This was always the design (it's the primary trigger, see "What triggers this skill"),
but wasn't stated as a hard guarantee anywhere — added a dedicated callout so it can't be read as
optional or Figma-initiated-only.

**Blast radius:** writes a Figma Dev Mode annotation and updates Asana tasks (custom fields,
comments). Both visible to the whole team immediately — confirm scope before running, never
silently in the background.

**On automation:** this skill is deliberately human-triggered, not a background job. Figma's REST
API has no endpoint that writes `node.annotations` — that's exclusively a Plugin API capability,
which only runs while Figma Desktop is open with the Desktop Bridge plugin running. A 24/7
unattended service (Vercel Cron or similar) cannot write the rich annotation this skill produces, so
don't build one for that half of the job. If Asana-side automation is ever wanted on its own
(auto-syncing the Inventory task/comment the moment Issue Status changes, without touching Figma),
that part *is* pure REST and could live in `ds-governance-dashboard` — but that's a separate,
unbuilt piece of infrastructure, not this skill, and hasn't been requested.

## Reference — IDs used every run

Single source of truth for every gid this skill reads or writes. If a step below and this table
ever disagree, this table wins — update both together.

**Asana — "📋 Component issue" project:** `1217578024449430`

| Issue Status option | gid | Figma category (label / color) |
|---|---|---|
| Issue Found | `1217582198314032` | *(not this skill — see `ds-governance-audit-asana`)* |
| Under Review | `1217567936096815` | *(out of scope for this skill)* |
| Consult Core DS | `1217582198314031` | `Consult Core DS` / violet |
| Publish & Pending refine | `1217582198216057` | `Publish & Pending refine` / orange |
| Rejected | `1217582198197615` | `Rejected Request` / red |
| Applied | `1217582198197614` | `Applied` / green |

`Issue Status` field gid: `1217582198197613` — the only Component-issue custom field this skill
ever writes (Applied branch only, see Step 2). Everything else on that task (`Issue Type`,
`Related Project`, `Squad`, `notes`/`html_notes`) is read-only from this skill's side.

**Asana — 🗂 Core Design System Library (Inventory):** project gid `1217578024173799`

| Field | gid | Type | Notes |
|---|---|---|---|
| Published Version | `1217568054032054` | text | shared gid with Project Inventory below |
| Design System Link | `1217587746548918` | text | shared gid with Project Inventory below |
| Last Published Date | `1217568054469540` | date | shared gid with Project Inventory below |
| Code Status | `1217578023775939` | enum | `Shipped in Code`=`1217578023775940`, `Design Ahead of Dev`=`1217578023775941` |
| Category (Core) | `1217587701861245` | enum | ~20 options, list live via `asana_list_custom_fields` rather than hardcoding — infer from the component, ask if unclear |

**No `Governance Status` field exists on this project.** Don't set one — see v1.3.0 changelog above.

**Asana — 🗂 Project Component Inventory:** project gid `1217568055044505`

Same `Published Version` / `Design System Link` / `Last Published Date` / `Code Status` gids as
Core above (shared fields), plus:

| Field | gid | Type | Notes |
|---|---|---|---|
| Governance Status | `1217567936300826` | enum | `Publish`=`1217567936300827`, `Need Discussion`=`1217567936300828`, `Updated`=`1217567936300829` |
| Project | `1217568054335566` | enum | `Project NA`/`Project MB`/`Project GG`/`Project Wealth` — list live for current gids |
| Squad Using | `1217568053833468` | multi_enum | list live for current gids |
| Category (Project) | `1217568217993384` | enum | `INPUTS`/`Navigation`/`Feedback`/`Layout`/`Data Display`/`Other` |

**Figma Dev Mode annotation categories used by this skill:** `Publish & Pending refine` (orange),
`Rejected Request` (red), `Consult Core DS` (violet), `Applied` (green). All four are created
on-demand via `figma.annotations.addAnnotationCategoryAsync()` if missing from the target file —
see Step 3.

## What triggers this skill

The user changed **Issue Status** on a Component issue task (gid `1217578024449430`) to one of the
four rows in the Reference table above (`Consult Core DS`, `Publish & Pending refine`, `Rejected`,
`Applied`). Any other status (`Issue Found`, `Under Review`) is out of scope — this skill only fires
on those four.

**This is the primary, expected way to run this skill — not an edge case.** The DS team's normal
workflow is: open a Component issue task in Asana, change **Issue Status**, then run this skill.
Every time that happens, the Figma annotation on the original node **must** flip to match, in the
same run:
- `Issue Status` → `Publish & Pending refine` in Asana ⇒ the node's annotation, currently blue
  (`Request Design system`, written when the task was `Issue Found`/`Under Review`), is **overwritten**
  to orange (`Publish & Pending refine`, Step 3 shape A) with the new Published Version/Date/
  Component Link/Changelog fields filled in.
- `Issue Status` → `Rejected` in Asana ⇒ the same node's annotation is **overwritten** to red
  (`Rejected Request`, Step 3 shape A or B depending on what kind of finding this was — see Step 3's
  shape-selection note) with the Reject Reason filled in.

This is not conditional on how the task got resolved — it's the direct consequence of Step 2 writing
the Asana side and Step 3 writing the Figma side in the same run. If a run somehow updates Asana but
skips the annotation (or vice versa), that's a bug, not an acceptable partial result — see Step 4's
confirmation reminder to report both sides explicitly.

Prompt shape:

```
Use the ds-governance-pr-asana skill.

Component issue task: [Asana task URL whose Issue Status just changed]

Design system project (if have/optional): [Figma project design system library link]
```

**Precondition:** the Figma file that owns the flagged node must be open in Figma Desktop with the
Desktop Bridge plugin running before Step 3 (same precondition `ds-governance-audit-asana` needs) —
check with `figma_list_open_files`/`figma_get_status` first; ask the user to open it if not
connected, don't guess a stale node id against a closed file.

**Figma-initiated Applied** (designer marks the annotation `Applied` themselves in Dev Mode instead
of going to Asana first): read the node's `node.annotations` via `figma_execute` to get the "View
issue in Asana" link embedded in the existing annotation, follow it to the task, then proceed as the
Applied branch below. **Known failure case (carried over from the Notion-backed original): if the
fix swapped the node instead of editing it in place, the old annotation — link and all — is gone
with the deleted node.** When that happens, tell the designer plainly why and point them at the
direct mode instead (set Issue Status on the Asana task themselves).

## Step 1 — Read the Asana task

`get_task` the task URL/gid. Pull:
- `Issue Status` custom field (must be one of the 4 in the Reference table)
- `Issue Type`, `Related Project`, `Squad`
- `notes`/`html_notes` (this project's tasks use the 4-section template from
  `ds-governance-audit-asana` Step 6b — pull **Summary Reason** for "Why", and if present, a
  **Reject Reason**/feedback line)
- Figma section/node link (from the Source section of `notes`, or the task's linked Figma
  annotation if arriving via Figma-initiated mode)

## Step 2 — Branch on status, Asana-side write first

### Publish & Pending refine

1. **Find the real component in Figma yourself first.** `figma_search_components` with `query` =
   the task's name (and a couple of variants — strip a parenthetical, try the bare component name).
   If the target file (Core or the project's own library) is the currently-connected Desktop Bridge
   file, search local (no extra params needed). For a different, unconnected library file, pass
   `libraryFileKey` — this uses Figma's REST API and needs `FIGMA_ACCESS_TOKEN` set in the
   environment; if it's not set (confirm with a quick call — the error names the missing variable
   explicitly), ask the user to also open that file in Figma Desktop with Desktop Bridge running so
   it becomes a second connected file instead, then search it locally with the same tool. A match
   tells you which library (Core vs Project) — that answers "which Inventory" too.
2. **Which Inventory task:**
   - Core Design Library match → search
     [🗂 Core Design System Library (Inventory)](https://app.asana.com/1/1153565613997788/project/1217578024173799)
     (gid `1217578024173799`) by task name.
   - Project library match → search
     [🗂 Project Component Inventory](https://app.asana.com/1/1153565613997788/project/1217568055044505)
     (gid `1217568055044505`) by task name.
   - **A name match is not proof it's the same component** — confirm the matched task's `Design
     System Link` custom field (gid `1217587746548918`) resolves to the same Figma node before
     treating it as an update. If the name matches but the node doesn't, this is a different
     component reusing a name — create a new Inventory task instead of overwriting the wrong one,
     and say so plainly.
3. **Task exists (name + node both match)** → `update_tasks`: `Published Version` (gid
   `1217568054032054` — ask the user for the version string if not obvious, e.g. `"v1.1 – multi-icon
   variant added"`, don't invent a semver), `Last Published Date` (gid `1217568054469540`) = today,
   `Design System Link` (gid `1217587746548918`) = the Figma URL to the published node. **If, and
   only if, this is a Project Inventory task** (gid `1217568055044505`) with `Governance Status`
   (gid `1217567936300826`) = `Need Discussion`, also set it to `Publish`
   (`1217567936300827`) — the Core Inventory project has no `Governance Status` field, don't try to
   set one there. Then `add_comment` on that Inventory task logging the change (Asana's equivalent of
   the Notion changelog child-page): what changed, why, version, date, and a link back to the
   Component issue task.
4. **Task doesn't exist** → `create_tasks` a new Inventory task: name, `Category (Core)` (gid
   `1217587701861245`) or `Category (Project)` (gid `1217568217993384`) depending which project —
   infer from the component, ask if unclear — plus `Design System Link`, `Published Version`,
   `Last Published Date`, and (Project Inventory only) `Governance Status` = `Publish`. No comment
   needed, the task's creation *is* the first changelog entry.

### Rejected

- **Search the Inventory project (Core or Project, by task name) for a match, same technique as the
  Publish branch above.** If nothing matches (a brand-new idea that never had a matching component)
  → no Inventory write, annotation only.
- **A matching Inventory task exists** (this rejection is about a proposed change to something
  already on record) → `add_comment` on that Inventory task: "Rejected: {Reject Reason}", linked to
  the Component issue task — so the history is visible without reopening the same request.

### Consult Core DS

No separate stub/board — see the trigger table above. Just confirm `Issue Status` is set and move to
Step 3 (annotation). If a second project's task turns out to describe the same component, that's
handled by `ds-governance-audit-asana` Step 6c (merge into the same task, don't create a duplicate),
not by this skill.

### Applied

**Verify live before writing anything — don't take "fixed" on trust.** Load the target
screen/node (`figma_capture_screenshot` + `figma_execute` to confirm the node's `type` is actually
`INSTANCE` of the expected component). Two failure modes to check for specifically: (1) the node
still isn't an instance, or the swap is visibly broken (flipped content, wrong size, overlapping
siblings); (2) the node **is** a correct instance but its content wasn't overridden per use (still
shows the master's placeholder). If either shows up, don't write the note or touch the annotation —
report exactly what's wrong and stop.

**Partial fixes are legitimate** — if only some flagged sites are fixed, append a note saying so
without flipping `Issue Status` to `Applied`:

```
Resolved in: {screen name} ({figma url}) — applied {today}
```
or, partial:
```
Resolved in (test, partial): {screen name} ({figma url}) — applied {today}. Not fully resolved yet: {what's still outstanding}.
```

`update_tasks` to append this to `notes` (don't overwrite the existing Summary Reason/Source
content — append). **Only flip the `Issue Status` custom field (gid `1217582198197613`) to
`Applied` (gid `1217582198197614`) once the fix is fully resolved** — a partial fix stays at
whatever status it was (or `Publish & Pending refine`), the note alone documents partial progress.
Then continue to Step 3 unless verification failed.

**The normal path into this branch is annotation-driven, not Asana-driven — expect the original
annotation to be gone.** The designer fixes the component, which almost always means swapping the
raw/broken frame for a new node (not editing the old one in place) — the swap deletes the old node,
and Figma annotations attach to a node's own id, so the original "Request Design system"/"Log Note"
annotation is gone with it, link and all. This is expected, not an error: locate the *new* node by
structure/name (same technique as Step 3's node-resolution note), confirm it's a real instance
(verification above), then **write a fresh Applied annotation on the new node** — there is nothing
to "restore," this is a new annotation on a new node that happens to resolve the same task.

## Step 3 — Write the Figma annotation

`figma_execute` runs arbitrary JS in the connected file's Plugin API context — use it for both
category resolution and node resolution below; `figma_set_annotations` (a dedicated tool) can then
write the final annotation once you have a real `categoryId` and target `nodeId`.

**Resolve the annotation category** (create-if-missing, exactly like `ds-governance-audit-asana`
Step 7 — this works standalone via the plain Plugin API, no extra setup needed):

```js
let categories = await figma.annotations.getAnnotationCategoriesAsync();
const ensureCategory = async (label, color) => {
  let cat = categories.find((c) => c.label === label);
  if (cat) return cat;
  cat = await figma.annotations.addAnnotationCategoryAsync({ label, color });
  categories = await figma.annotations.getAnnotationCategoriesAsync();
  return cat;
};
const gapCat = await ensureCategory('Publish & Pending refine', 'orange');
// etc. — return { categoryId: gapCat.id } from the figma_execute call
```

**Resolve the live target node — don't trust a stored node-id.** Node IDs drift when a section/page
gets duplicated for testing, and (per the Applied branch above) a fixed node is often a *different*
node than the one originally flagged. Re-resolve by structure/name via `figma_execute` whenever the
stored id doesn't match what's on canvas now:

```js
// list pages first if the target page isn't already known
return figma.root.children.map(p => ({ id: p.id, name: p.name }));
```
```js
const page = await figma.getNodeByIdAsync('<page id from previous step>');
await figma.setCurrentPageAsync(page);
// find by what it IS, not by a possibly-stale id — e.g. hand-built = FRAME, bound = INSTANCE
const cards = page.query('INSTANCE[name="Card Container"]');
const target = cards.toArray().find(c => c.query('FRAME[name="card-content"]').first());
return { targetId: target?.id };
```

Adapt the query to whatever the task's Summary Reason describes (a specific frame name, a specific
text string, etc.).

**Overwrite, don't append** — a resolved task replaces the original blue "Request Design system"
annotation, it doesn't stack a second one on top. Once you have `categoryId` and `nodeId`, call
`figma_set_annotations` with `mode: "replace"` (the default).

Two verified-live template shapes exist for this org, and which one applies depends on **what kind
of finding is being resolved** — check the original annotation/task before picking:

**A. Resolving a Design System Gap** (the finding started as a blue "Request Design system"
annotation) — status flows through the same `**Design System Gap**` shape, only `Status` and the
fields below it change:

```js
node.annotations = [{
  categoryId: gapCat.id,
  labelMarkdown:
    "**Design System Gap**\n" +
    "- **Status:** Publish & Pending refine\n" +
    "- **issue type:** <Issue Type>\n" +
    "- **Why:** <Summary Reason from the task>\n" +
    "- **Published Version:** <version>\n" +
    "- **Published Date:** <today, YYYY-MM-DD>\n" +
    "- **Component Link:** [<component name>](<published component figma url>)\n" +
    "- **Changelog inventory update:** [<component name> inventory task](<Asana Inventory task url>)\n\n" +
    "Designer action: <plain-language instruction — usually \"swap X to an instance of Y\">\n\n" +
    "🔗 [View issue in Asana](<Component issue task permalink_url>)",
}];
```

Verified live against `0ZPE1y1pXUAmFoYhrFdc2X` node `95:724` — match this shape
character-for-character for a Gap resolution.

**B. Resolving/rejecting an Existing DS Issue** (the finding started as a yellow "Log Note"
annotation — e.g. a detached instance, wrong variant) — reject shape reuses that finding's own
Component/Problem fields, header becomes `**Reject Request**`, **numbered** not bulleted (this is
deliberately different from the Gap shape above — verified live, don't normalize it to bullets):

```js
node.annotations = [{
  categoryId: rejectCat.id,
  labelMarkdown:
    "**Reject Request**\n" +
    "1. **Component:** <Core/Project library — name (Status, Version)>\n" +
    "2. **Problem:** <what was wrong, same as the original Log Note finding>\n" +
    "3. **Reject Reason:** <why this isn't being fixed/changed after all>\n\n" +
    "Designer action: <what to do instead, if anything>\n\n" +
    "🔗 [View issue in Asana](<Component issue task permalink_url>)",
}];
```

Verified live against `0ZPE1y1pXUAmFoYhrFdc2X` node `95:717` — match this shape
character-for-character for this case.

**If a Design System Gap itself gets rejected** (not an Existing DS Issue — a brand-new component
request that's declined), use shape A's field set with `Status: Rejected` instead of B — B is
specifically for rejecting a proposed *change to something that already has an Existing DS Issue
finding*. If it's ambiguous which shape applies, check what category the annotation currently has
(`Request Design system` blue → shape A; `Log Note` yellow → shape B) rather than guessing from the
Asana task alone.

**Consult Core DS:**

```js
node.annotations = [{
  categoryId: consultCat.id,
  labelMarkdown:
    "**Design System Gap**\n" +
    "- **Status:** Consult Core DS\n" +
    "- **issue type:** <Issue Type>\n" +
    "- **Why:** <Summary Reason>\n" +
    "- **Escalated:** awaiting Core team discussion\n\n" +
    "🔗 [View issue in Asana](<Component issue task permalink_url>)",
}];
```

**Applied — verified live against `0ZPE1y1pXUAmFoYhrFdc2X` node `110:1467`.** No separate
"Component Link"/"Resolved" split like the guessed shape had — the component link is inlined into
**Why**, and **Resolved** states plainly what's done and (for a partial) what isn't. There is no
"Designer action" line and no closing checkmark on a *partial* Applied — only a fully-resolved
Applied closes the case:

Partial (matches the live reference exactly — write this shape whenever Step 2 found a partial fix):
```js
node.annotations = [{
  categoryId: appliedCat.id,
  labelMarkdown:
    "**Design System Gap**\n" +
    "- **Status:** Applied (test — <N> of <total> sites)\n" +
    "- **issue type:** <Issue Type>\n" +
    "- **Why:** <what changed — inline a link to the published component if relevant, e.g. \"...now uses real instances of [Card](<url>)...\">\n" +
    "- **Resolved:** this screen (test run) — <what's still pending, named plainly: other flagged sites, content overrides, leftover broken nodes>\n\n" +
    "🔗 [View issue in Asana](<Component issue task permalink_url>)",
}];
```

Full (all flagged sites resolved — this is the one case that actually closes):
```js
node.annotations = [{
  categoryId: appliedCat.id,
  labelMarkdown:
    "**Design System Gap**\n" +
    "- **Status:** Applied\n" +
    "- **issue type:** <Issue Type>\n" +
    "- **Why:** <what changed — inline a link to the published component>\n" +
    "- **Resolved:** all flagged sites updated to match [<component name>](<published component figma url>) — <published version>\n\n" +
    "✅ Case closed. 🔗 [View issue in Asana](<Component issue task permalink_url>)",
}];
```

## Step 4 — Confirm back to the user

Report, in one short block: which Figma node got the new annotation and its new category; what
Asana write happened (Inventory task update/creation, or a comment) with a link; a reminder that the
annotation only renders with formatting in Figma's own Dev Mode Annotate panel — a plain
`figma_capture_screenshot`/`figma_execute` metadata read will not show it.

## Guardrails

- Overwrite the annotation, never stack a second one on the same node.
- Never guess the Publish/Reject shape (A vs B in Step 3) from the Asana task alone — check the
  *current* annotation's category first.
- Never write `Applied` without live verification (Step 2's Applied branch) — a designer's word
  alone is not evidence, confirmed by two real failures in the Notion-backed original's own build.
- Never create a duplicate Core-board stub for `Consult Core DS` — this project's Asana model has no
  separate board; the shared Component issue task and its `Related Project` multi-select already
  cover multi-project attribution (see `ds-governance-audit-asana` Step 6c).
- A name match on an Inventory task is not proof it's the same component — confirm by
  `Design System Link` node, not string alone (Step 2, Publish branch).
- Never set `Governance Status` on a Core Inventory task — that field only exists on Project
  Component Inventory (see Reference table and v1.3.0 changelog).
- Never build or wire up a background/scheduled trigger for this skill — Figma's REST API cannot
  write annotations, so unattended automation can't do this skill's actual job (see "On automation"
  above). This stays human-triggered.

## Output contract

```json
{
  "ok": true,
  "task": "<Component issue task URL>",
  "status": "<Publish & Pending refine | Rejected | Consult Core DS | Applied>",
  "figma_node_annotated": "<node id>",
  "inventory_task": "<Asana Inventory task URL or null>",
  "issues": []
}
```
