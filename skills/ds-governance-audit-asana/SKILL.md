---
name: ds-governance-audit-asana
version: 2.0.0
description: >-
  Audits a Figma screen against the Core Design System and the relevant project's design system,
  classifies every finding as an Existing DS Issue (self-fixable, existing assets already cover it)
  or a Design System Gap (needs a new/changed asset), writes a native Figma Dev Mode annotation for
  both, and — for Gaps only — logs a task into the Asana "📋 Component issue" project (part of the
  "Design System Governance" portfolio). Asana-backed sibling of ds-governance-audit-notion: same
  classification logic and Figma annotation contract, only the tracked-table write target changed
  from a Notion database to Asana. Has no Notion dependency anywhere — Context Knowledge lives on
  the DS Governance Log dashboard (Squad-aware, ds-governance-dashboard.vercel.app), fully separate
  from the Notion-backed sibling's own copy. See CHANGELOG.md for the full defect/correction history
  behind every rule below.
metadata:
  status: stable — corrected across 10 documented versions, see CHANGELOG.md
  mode: mixed
  category: workflow-meta
  derived_from: ds-governance-audit-notion v1.11.0
  companion_doc: https://app.notion.com/p/3c07817ccced80d0b1b1ee2cc458ae0c
---

# Design System Governance Agent (Asana-backed)

Audits a Figma screen, classifies every issue, annotates what's fixable now, logs what's a genuine
Design System gap — into Asana instead of Notion. `CHANGELOG.md` in this folder has the full
defect/correction history behind every rule below — read it for the "why," not to run the skill.

AI never edits the Figma file's design directly. It only annotates, and only writes an Asana task
when an issue is a genuine Design System Gap — never for an Existing DS Issue, no matter how it was
built (a wrong token on a real instance, or a raw frame with zero binding to anything — both stay
Figma-only, see Step 5).

**Blast radius:** writes a Figma Dev Mode annotation and creates/updates an Asana task, both visible
to the whole team immediately. Confirm scope with the user before running against a real screen —
never run silently in the background.

## How this relates to other skills

- **`ds-governance-audit-notion`** — same classification logic (Steps 1–4 are a direct port) and
  the same Figma annotation contract. The only difference: where a **Design System Gap** lands. A
  Notion "📋 Component issue" row here becomes an **Asana task** in the shared
  [📋 Component issue](https://app.asana.com/1/1153565613997788/project/1217578024449430) project.
  Context Knowledge is **not** shared with the Notion-backed sibling anymore (see Step 2) — this
  skill's copy lives on the DS Governance Log dashboard, Squad-aware, no Notion dependency. Full
  rationale + field-mapping table for the Asana side lives in
  [Design System Governance V.2 with Asana](https://app.notion.com/p/3c07817ccced80d0b1b1ee2cc458ae0c)
  — read that page once before the first run in a new session; this file only carries the IDs
  needed to execute, not the "why".
- **`ds-governance-audit`** (older, independent) — a different, per-project `asana.config.yml`
  board model with escalation to a separate Core governance board. It predates this project's "one
  shared Component issue project with a multi-select Related Project field" model and targets a
  *different* Asana structure. **Do not mix the two.** This skill is the one that matches what
  `ds-governance-audit-notion` actually built and what this project's Notion pages document.

## Inputs

From the user: a Figma **Section URL** to audit (a finished screen/flow, already built — this skill
audits, it does not build). Optionally: a Project-level Design System reference, if the screen
belongs to a project whose own library differs from Core. See §Design System Identification for
how "Core" is resolved for this run — never assume it's CDS.

## Pipeline

Run in this order. Every step's real detail lives at its own heading below — this is an index for
orientation, not a summary to execute from.

| Step | Does |
|---|---|
| 0 — Design System Identification | Resolve/confirm the target Design System before anything else |
| 1 — Read the section | Detect: scan every node, find unbound/detached/raw-token candidates |
| 2 — Resolve Feature name | Metadata: Platform/Squad/Feature against Context Knowledge |
| 3 — Classify every finding | Existing DS Issue vs. Design System Gap |
| 4 — Prior owner ruling | Check `cds-consumer`'s DRIFT.md before logging a new Gap |
| 5 — Existing DS Issue | Figma annotation only, never Asana |
| 6 — Design System Gap | Figma annotation + Asana task (6a enum values, 6b create, 6c dedupe) |
| 7 — Annotation mechanics | How Step 5/6's annotation actually gets written — shared by both |
| 8 — Knowledge growth | Confirm Step 2's Context Knowledge write landed |

Every finding, regardless of which step produced it, is reported through the same fields — see
§Unified Finding Schema before writing Step 6b, Step 7, the chat summary, or the JSON output
contract. Do not invent a different field set for any one of those four surfaces.

## Step 0 — Design System Identification

**Never assume the target Design System is CDS.** Bangkok Bank runs more than one Design System
(CDS, MBDS, and others) with different token grammars, component names, and rules — auditing
against the wrong one produces findings that are actively wrong, not just incomplete. Every place
below that says "Core" means this confirmed target, not CDS by default.

Resolve before Step 1 runs:

1. **User already named it** — `CDS` → CDS. `MBDS` / `Mobile Banking` → MBDS. A Figma Design
   System / Component Library link → use that library as the target.
2. **User did not name it** — stop and ask before starting the audit:

   > Which Design System should I use for this audit?
   >
   > 1. CDS
   > 2. Mobile Banking / MBDS
   > 3. Other — please share the Design System / Figma library link

   If the user picks **Other**, get the Figma Design System / Component Library link before
   proceeding — do not guess a library from the screen's contents.

**Predefined — Mobile Banking / MBDS** (use directly once the user says "MBDS" / "Mobile
Banking", no need to ask for links again):

- MBDS Web / Documentation — https://mbds-bbl.vercel.app/
- MBDS Component Library — https://www.figma.com/design/3uFwZN2v5lQPwxjPAkfglF/%F0%9F%92%A0-Component-Library-2023-Master-File?m=auto&node-id=37-8&t=QDeUXOWWkht4rJfm-1
- MBDS Icon Library — https://www.figma.com/design/W6SBNHk0AQT0bkqYPu9cRx/%F0%9F%8D%80-Icon-Library?node-id=84-23301&t=JEgyl5SqGNiWRV3n-1
- MBDS Illustration / Assets Library — https://www.figma.com/design/xlvvR9hPyrDkItHXsSHttZ/%F0%9F%8E%A8-Illustration---Assets-Library?node-id=5-31081&t=KkkhmCNVwG3s9iRV-1
- MBDS Template Library — https://www.figma.com/design/rGstoHOqDx5HvZHE8uKZm3/%F0%9F%93%97-Template-Library?node-id=0-1&t=bKw0yQ0qYtoMBihJ-1

**Predefined — CDS** — use whatever this skill already points at (`cds` MCP tools); no separate
link needed.

**Confirmation rule.** A confirmed target is required before Step 1 starts. Never assume CDS by
default, never use CDS components/guidance when the user asked for MBDS (or vice versa), and never
judge a finding right/wrong against a Design System that hasn't been confirmed for this run. The
confirmed target is the source of truth for **this audit only** — don't carry its component
names/tokens/rules into a different audit unless the user explicitly asks for a comparative audit.
This also decides which MCP server's `search_components` Step 3's zero-category check calls (`cds`,
`mbds`, or the equivalent for whatever library was confirmed) — never default to `cds` there either.

## Reference — IDs used every run

Single source of truth for every gid this skill writes to. If a step below and this table ever
disagree, this table wins — update both together.

**Asana — "📋 Component issue" project:** `1217578024449430`

| Section | gid |
|---|---|
| Issue Found (new Gap lands here) | `1217582199538063` |
| Under Review / Consult Core DS | *(see companion doc)* |
| Publish & Pending refine | *(see companion doc)* |
| Applied | *(see companion doc)* |
| Rejected | *(see companion doc)* |

**Asana — custom fields on that project** (used in Step 6b):

| Field | gid | Type |
|---|---|---|
| Issue Status | `1217582198197613` | enum |
| Request Type | `1217580489107606` | enum |
| Origin | `1217568217901596` | enum |
| Issue Type | `1217568054116835` | multi_enum |
| Squad | `1217568217901603` | multi_enum |
| Related Project | `1217568217768099` | multi_enum |
| Feature | `1217582198962677` | multi_enum |
| Occurrence Count | `1217567936067965` | number |
| Suggest to add in Core System? | `1217580489547133` | enum |
| Submitted Date | `1218215634621446` | date |

**Fixed enum option values** (never create a parallel value for these — see Step 6b):

| Field | Option name | gid |
|---|---|---|
| Origin | `Figma Audit (ds-governance-audit-notion)` | `1217568217901597` |

**Figma Dev Mode annotation categories** (used in Step 7):

| Classification | Category label | Color |
|---|---|---|
| Design System Gap | `Request Design system` | blue |
| Existing DS Issue | `Log Note` | yellow |

**Other fixed resources:**

- Asana Inventory tasks (Step 5, informational `Code Status` tag only):
  [🗂 Core Design System Library (Inventory)](https://app.asana.com/1/1153565613997788/project/1217578024173799) /
  [🗂 Project Component Inventory](https://app.asana.com/1/1153565613997788/project/1217568055044505)
- DS Governance Log — [Context Knowledge](https://ds-governance-dashboard.vercel.app/context-knowledge) (`https://ds-governance-dashboard.vercel.app/api/features`, Step 2/8) — no Notion dependency
- [`therealveldt/cds-consumer`](https://github.com/therealveldt/cds-consumer), `context/DRIFT.md`
  (Step 4) — synced to `~/design-system-repos/cds-consumer` before every read, never a stale local
  checkout

## Unified Finding Schema

**Every finding, once classified (Step 3), is reported through the same field set everywhere it
appears** — the Figma annotation (Step 7), the Asana task body (Step 6b), the final chat summary,
and the JSON output contract. Only verbosity changes per surface (Figma's annotation panel is
short, Asana's `html_notes` is the full narrative, chat is prose) — the field **names and order**
never do. This is deliberate: before this schema existed, Figma's annotation and Asana's task body
carried different, disconnected shapes for the same finding, and the chat summary had no fixed
shape at all — a reader moving between the three had to re-map fields by hand each time.

**Design System Gap** — 4 fields, same as the real, already-verified Notion/Asana "Component
issue" row shape (this skill mirrors that row outward, not the other way around):

| Field | Meaning |
|---|---|
| `component` | Component/pattern name |
| `status` / `issue_type` | Lifecycle status (Step 6b's `Issue Status`) and category (Component / Token / Pattern / Accessibility / Other) |
| `summary_reason` | What was found + why neither Design System covers it (+ repeat-occurrence note if any) |
| `ai_recommend` | Closest existing fragments + the actual suggested solution — never a placeholder |
| `core_system_recommendation` | Why this should (or shouldn't yet) go to Core, or `"not applicable — single project only"` |
| `origin` / `asana_task_url` | Figma frame/node link, and the Asana task's `permalink_url` once created |

**Existing DS Issue** — 3 fields (no Asana task exists for this classification, so no
`ai_recommend`/`core_system_recommendation`/Asana link):

| Field | Meaning |
|---|---|
| `component` | The real Core/Project library component it should have used (name, status, version) |
| `problem` | What's wrong — wrong variant / detached / raw token |
| `fix` | What to use instead, concrete |

## Step 1 — Read the section like Figma's own "Check designs" feature

For every component-shaped node in the audited Section (`get_metadata` first for the tree, then
`get_screenshot` for a visual pass), check three things:

1. **Is it a real instance** of something published in the confirmed target Design System
   (§Design System Identification) or the relevant Project Design System?
2. **Is it detached** — visually resembles a real component/instance but is a plain frame/group?
3. **Are its tokens actually bound**, or overridden with raw hex/px values? This includes **text
   style and font binding**, not just color/spacing — a hand-set `fontName`/`fontSize` with no
   `textStyleId` is exactly as much a raw-token finding as an unbound fill color. Run this as an
   explicit scripted pass, don't eyeball it:

   ```js
   const section = await figma.getNodeByIdAsync(SECTION_NODE_ID);

   function isInsideInstance(node) {
     let p = node.parent;
     while (p) { if (p.type === 'INSTANCE') return true; p = p.parent; }
     return false;
   }

   const findings = [];
   for (const n of section.findAll(() => true)) {
     // Core/Project instance internals are that library's own governance, not this screen's —
     // skip them, and skip the instance boundary node itself (it's a real bound component).
     if (isInsideInstance(n) || n.type === 'INSTANCE') continue;

     if (n.type === 'TEXT' && !n.textStyleId) {
       findings.push({ kind: 'font', nodeId: n.id, name: n.name,
         detail: `fontName=${JSON.stringify(n.fontName)} fontSize=${n.fontSize} — no textStyleId` });
     }
     if ('fills' in n && Array.isArray(n.fills)) {
       n.fills.forEach((f, i) => {
         if (f.type === 'SOLID' && !(f.boundVariables && f.boundVariables.color)) {
           findings.push({ kind: 'color', nodeId: n.id, name: n.name,
             detail: `fill[${i}] raw SOLID color=${JSON.stringify(f.color)} — not bound` });
         }
       });
     }
   }
   return { totalNodesScanned: section.findAll(() => true).length, findings };
   ```

   **Consolidate before annotating.** This scan returns one finding per node per property — on a
   real screen that's usually 5–10 findings per repeated card/frame, ×N repeated screens in a flow.
   Don't write one annotation per finding. Group by the nearest meaningful container (the card/frame
   that holds the raw text+fills) and write **one Existing DS Issue annotation per container**
   listing every raw property inside it, with the specific Core text style/variable that should
   replace each one (look them up via `search_design_system` — e.g. `Heading/Heading MD`,
   `Body/Body MD`, `Surface/Neutral/Neutral Primary`, `Content/Neutral/...` — don't write a generic
   "use a token" note, name the real option). A 3-screen flow with the same raw heading/body/card-bg
   pattern repeated on every screen is 3 annotations (one per screen's card), not 24.

A frame that already hosts real instances of *other* published components inside it (e.g. a card
frame holding `Text Field` × 2 + `Button` instances) is a **composition template**, not itself a
violation — don't flag the container for not being an instance of something else.

## Step 2 — Resolve Feature name against Context Knowledge (DS Governance Log — no Notion)

Cross-check the Feature name against the DS Governance Log's Context Knowledge
(`https://ds-governance-dashboard.vercel.app/context-knowledge`) instead of relying on the file name
alone or guessing. **This skill has no Notion dependency anywhere** — Context Knowledge for the
Asana-backed variant lives entirely on the dashboard now, Squad-aware, not mirrored to or read from
the Notion Context Knowledge page the older Notion-backed sibling still uses.

1. `GET https://ds-governance-dashboard.vercel.app/api/features` and look for a row with matching
   `project` + `feature` (case-sensitive, exact).
2. **Found, `figmaLink` empty, and you have one now** — `PATCH
   https://ds-governance-dashboard.vercel.app/api/features/<id>` with `{"figmaLink": "..."}`. Never
   overwrite an existing link — backfill only.
3. **Not found** — `POST https://ds-governance-dashboard.vercel.app/api/features` with
   `{"project", "squad", "feature", "source", "notes", "figmaLink"}` (see the parsing rule below for
   `project`/`squad`). A 409 here means another run already created it between your GET and POST —
   treat that the same as "found," not an error.

Do this for every Feature this step resolves, new or existing — not just ones missing a Figma link.
This endpoint has no auth (low-stakes internal log); a failed request here should be reported in the
final summary, not allowed to block the rest of the audit.

If the Figma file follows the `[<Project>_<Squad>] <Feature/epic name>` naming convention (see the
companion doc's callout), parse `Project`/`Squad` from the filename verbatim — don't resolve a squad
code into a guessed full name, and don't invent a Feature name that isn't in Context Knowledge or the
filename. Pass the parsed `Squad` straight through as `squad` in the POST above — this is exactly the
shape the dashboard's `squad` field expects. `Project` here doubles as **Platform** for governance
purposes (e.g. `MB`, `CDS`) when it matches one — see below.

**If the file name does not follow the convention, or Project/Squad/Feature can't be identified
with confidence, stop and ask before continuing** — do not silently fall back to guessing:

> I couldn't identify the project metadata from the Figma file name.
>
> Could you confirm:
> - Platform: ?
> - Squad: ? (optional)
> - Feature: ?

**Platform inference.** Platform can often be inferred from the confirmed target Design System
(§Design System Identification) instead of asking outright: MBDS/Mobile Banking → `MB`, CDS →
`CDS` (only if that's a real value the target field expects). If the mapping isn't clean, confirm
with the user rather than guessing — *"I can infer the platform as MB from the MBDS Design System.
Is that correct?"* — and use their confirmed answer as source of truth over the inferred one.

**Squad is optional** — if missing and unparseable, ask *"What squad should I use? (Optional) If
you don't have a squad name, you can provide your nickname instead"* and store whatever they give
verbatim; never force a value. **Feature is required** — if missing and unparseable, ask *"What is
the feature name for this screen?"* and never guess it.

## Step 3 — Classify every finding

- **Existing DS Issue** — an asset that already exists in Project or Core DS could have covered
  this; the screen just didn't use it correctly (wrong variant, detached instance, stale/raw
  binding). Self-fixable by the DS Designer with what's already in the library. **Detach and
  raw-token findings count here too** — a detached node is a broken copy of *one* component, not
  evidence a new component is needed.
- **Design System Gap** — neither Design System has an asset that resembles this at all. Visual
  resemblance between two *separate* existing components is not proof a composed pattern is
  documented — if unsure whether a composition is real, ask the designer running the audit rather
  than assuming either way.

**Zero-category check — run this before the ambiguous-composition question above.** When a
hand-built/raw node looks like it's standing in for a whole *kind* of asset (a chart, a map, a
signature pad — anything that isn't just "a component built wrong"), call `search_components` on
the **confirmed target Design System's** MCP server (`cds`, `mbds`, or the equivalent — see
§Design System Identification, never default to `cds`), plus the project's own DS if one applies,
for the category's generic name **and its obvious synonyms** — not just one term; a chart could be
searched as `chart`, `donut`, `pie`, `graph`.

**If every synonym returns zero results, this is a confirmed Design System Gap immediately — do
not ask the designer running the audit "mistake or intentional?"** That question only makes sense
when an *existing* pattern might be the intended target and the build merely diverges from it
(the ambiguous-composition case above); it has no answer when there is no existing pattern to
compare against in the first place — asking would be meaningless. Log the Gap and move on. See
CHANGELOG.md v1.3.0 for the worked example this rule came from.

A finding with a matching build-time "not in design system" annotation from whatever skill built the
screen is almost always a Gap already — don't reclassify it as an Issue without a documented reason.

## Step 4 — Check for a prior owner ruling before flagging a Gap

Before logging a new Gap, check `context/DRIFT.md`'s "Settled — do not re-flag" table in
[`therealveldt/cds-consumer`](https://github.com/therealveldt/cds-consumer) — an owner may have
already ruled a difference deliberate. This repo is owned by a collaborator (โย) and updates on
its own schedule — **sync before every read, never trust whatever a local checkout already has on
disk.** Same sync pattern this project uses everywhere else it reads this repo (see
`ds-governance-prototype-asana`):

```bash
git -C ~/design-system-repos/cds-consumer pull 2>/dev/null || git clone https://github.com/therealveldt/cds-consumer.git ~/design-system-repos/cds-consumer
```

Then read `context/DRIFT.md` from that synced clone. It's a private repo — this only works with
git credentials that already have access (confirmed: the clone at `~/design-system-repos/cds-consumer`
exists and is up to date). If the sync fails (no access, repo/path renamed), say so plainly in the
summary and proceed without this check rather than blocking the audit on it.

## Step 5 — Existing DS Issue: Figma annotation only, never Asana

Write the annotation (Step 7, `Log Note` category). **Nothing goes to Asana for this
classification.** If code-readiness is known for the component involved, tag it informationally on
that component's Asana Inventory task (`Code Status` = `Shipped in Code` / `Design Ahead of Dev`,
`Code Last Checked` = today) — see the Inventory links in Reference above. This is bookkeeping
only, never a gate on whether the Figma annotation gets written.

## Step 6 — Design System Gap: Figma annotation + Asana task

### 6a — New enum values first (this is the step most likely to be skipped — don't)

Before writing `custom_fields`, check whether the finding's `Related Project` / `Squad` / `Feature`
values already exist as enum options on the target field (list them via the Asana MCP or check the
project's live custom fields). **If a value is new, create the enum option first** with
`custom_field_enum_option_create` — do this for *both* fields that share the value where relevant
(`Related Project` + `Project`, `Squad` + `Squad Using`) so Project/Component Inventory tasks can use
the same value later. Skipping this step produces the exact error
`Custom field with ID … is not on given object` / a silently-ignored value — always create-then-set,
never guess an existing option is close enough.

### 6b — Create the task

Project + section + every custom field's gid live in Reference above — set:

| Notion property (old) | Asana field |
|---|---|
| status | Issue Status |
| Request Type | Request Type |
| Origin | Origin |
| Issue Type | Issue Type |
| Squad | Squad |
| Related Project | Related Project |
| Feature | Feature |
| Occurrence Count | Occurrence Count |
| Suggest to add in Core System? | Suggest to add in Core System? |
| *(no Notion equivalent)* | Submitted Date |

Section = current status (`Issue Found` for a brand-new Gap — see Reference for the gid; the
companion doc has the other section gids).

Set `Origin` to the `Figma Audit (ds-governance-audit-notion)` option — **keep this exact option
value**, even though this skill is the Asana-writing variant. The option name identifies *how* the
finding was produced (a Figma audit run), not which skill wrote the row; downstream tooling (and
any future `ds-governance-pr-asana` companion) dedupes/gates on this value, so don't create a
parallel `Figma Audit (ds-governance-audit-asana)` option.

**Submitted Date + due date.** Set custom field `Submitted Date` to today's date. Then set the
task's **native** `due_on` (not a custom field — Asana tasks carry this natively, pass it directly
on `create_tasks`) to `Submitted Date` **+ 18 calendar days** (2.5 weeks, rounded up). Both are
write-once at creation — a later Step 6c occurrence update to an existing row must not touch either
field, since a repeat sighting doesn't reset another team's SLA clock.

**Body format — use `html_notes`, not `notes`.** Match the real Notion "Component issue" row body:
four narrative `h2` sections, not a flat field-order list — this is §Unified Finding Schema's Gap
shape (`summary_reason` / `ai_recommend` / `core_system_recommendation` / `origin`) written out in
full. (`h3` isn't in Asana's allowed tag set, so section headers use `h2` instead of Notion's `###`.)

```html
<body>
<h2>Summary Reason</h2>
<ul>
  <li>What was found — node id(s), where, what it looks like. Specific, not generic.</li>
  <li>Why neither Design System covers this — name the closest existing fragments and say exactly
      why they don't fit (wrong semantics / separate unrelated pieces / no documented composition).</li>
  <li><strong>If this is a repeat occurrence:</strong> say so explicitly, with what's different/same
      this time, same as Notion's "Second occurrence (...)" convention.</li>
</ul>
<h2>AI Recommend</h2>
<ul>
  <li>Closest existing fragments named specifically.</li>
  <li>The actual suggested solution — same text a future publish step would carry forward verbatim,
      never a placeholder.</li>
</ul>
<h2>Core System Recommendation</h2>
<ul>
  <li><strong>Why this should go to Core:</strong> concrete reasoning, referencing actual occurrence
      count / project count if there's more than one.</li>
  <li><strong>Why not yet / why not at all:</strong> the counter-argument — usually "Related Project
      has 1 entry so far, stays project-specific until a second project logs the same gap," or the
      human-decision gate this row is waiting on.</li>
</ul>
<hr/>
<h2>Source</h2>
<ul>
  <li>📝 &lt;Project name&gt;
    <ul><li><a href="<figma section/node URL>">node-id=<id> (<short description>)</a></li></ul>
  </li>
  <li>If this is a repeat occurrence (Step 6c): <a href="<earlier task permalink_url>">cross-reference to the earlier task</a></li>
</ul>
</body>
```

If a finding's Gap classification came from an explicit user instruction rather than an independent
audit judgment call, say so plainly inside Summary Reason (e.g. "this row was called a Gap on
explicit user request, not from an independent audit pass") — never present a forced/demo
classification with the same confidence as a genuine finding. This mirrors the mock-data-transparency
rule applied everywhere else in this project.

### 6c — Occurrence / impact check

Before setting `Occurrence Count`, search the Component issue project for the same component/pattern
name (name variants, not one exact string) so the count and `Suggest to add in Core System?` reflect
what's actually already logged, not just what this one audit found. This project uses **one shared
Component issue table with `Related Project` as a multi-select** rather than per-project boards plus
a separate Core escalation board — a second occurrence in a *different* `Related Project` value is
still the same task, just with both project values added to the multi-select and `Occurrence Count`
incremented. State plainly in the summary that cross-project matching here is name-based/best-effort,
same caveat the sibling `ds-governance-audit` skill states for its own escalation check.

**Never touch `Submitted Date` or `due_on` on an occurrence update** — those are write-once at
creation (Step 6b).

## Step 7 — Annotation (native Dev Mode, both classifications)

Set `node.annotations` directly via `use_figma`. Call
`await figma.annotations.getAnnotationCategoriesAsync()` first — this works standalone, no Desktop
Bridge required — and match by `label` against the two category names in Reference above.

**If a category is missing in this particular file, create it — don't omit `categoryId` and don't
ask the user to add it by hand.** `figma.annotations.addAnnotationCategoryAsync({ label, color })`
works standalone via the plain Plugin API, no Desktop Bridge/`figma-console` needed. Only fall back
to a `categoryId`-less annotation if that call itself throws.

```js
let categories = await figma.annotations.getAnnotationCategoriesAsync();
const ensureCategory = async (label, color) => {
  let cat = categories.find((c) => c.label === label);
  if (cat) return cat;
  cat = await figma.annotations.addAnnotationCategoryAsync({ label, color });
  categories = await figma.annotations.getAnnotationCategoriesAsync();
  return cat;
};
const gapCategory = await ensureCategory('Request Design system', 'blue');
const issueCategory = await ensureCategory('Log Note', 'yellow');

// Design System Gap — same 4-field shape as Step 6b's Asana body (§Unified Finding Schema),
// condensed to one line per field instead of a bulleted paragraph.
node.annotations = [{
  categoryId: gapCategory.id,
  labelMarkdown:
    "**Design System Gap**\n" +
    "- **Status:** Issue Found\n" +
    "- **Issue Type:** <Component / Token / Pattern / Accessibility / Other>\n\n" +
    "**Summary Reason:** <what was found + why neither Design System covers it — specific, not generic>\n" +
    "**AI Recommend:** <the actual suggested solution — same text as the Asana task's AI Recommend, never a placeholder>\n" +
    "**Core System Recommendation:** <why this should/shouldn't go to Core, or \"not applicable — single project only\">\n\n" +
    "🔗 [View issue in Asana](<task permalink_url>)",
}];

// Existing DS Issue (consolidated per container — see Step 1's consolidation rule).
// 3-field shape (§Unified Finding Schema) — no Asana task exists for this classification.
node.annotations = [{
  categoryId: issueCategory.id,
  labelMarkdown:
    "**Existing DS Issue**\n" +
    "- **Component:** <Core/Project library — name (Status, Version)>\n" +
    "- **Problem:** <what's wrong — wrong variant / detached / raw token>\n" +
    "- **Fix:** <what to do instead, concrete>",
}];
```

Every field above is the real content from §Unified Finding Schema, just condensed to fit an
annotation panel — never drop a field to save space, and never invent a field name that doesn't
also appear in Step 6b's Asana body for the same finding.

Both directions of the link: the Asana task's `notes` link to the Figma node, and the Figma
annotation links back to the Asana task's `permalink_url` once the task exists. Write the Asana task
first (Step 6), then the annotation (this step needs the URL).

## Step 8 — Knowledge growth (DS Governance Log — no Notion)

If Step 2 found a genuinely new Feature, it's already been created on the dashboard's Context
Knowledge in Step 2 itself (POST, with `squad` if parsed) — this step is just confirming that write
actually landed (re-`GET` and check the row is there) before closing out, not a second write. Nothing
here touches Notion.

## Final chat summary

**Fixed template, same field names as §Unified Finding Schema — never substitute different labels
or reorder them.** One block per finding, in Step 1's scan order:

```
🔵 Design System Gap — <component>
- Status: <status> · Issue Type: <issue_type>
- Summary Reason: <short>
- AI Recommend: <short>
- Core System Recommendation: <short, or "not applicable — single project only">
- Figma: <node link> · Asana: <asana task permalink_url>

🟡 Existing DS Issue — <component>
- Problem: <short>
- Fix: <short>
- Figma: <node link>
```

After every finding is printed, mention once — as a suggestion only, never an automatic call —
that a deeper check (`figma-semantic-token-audit`, `claude-a11y-skill`) is available for any finding
whose `issue_type` is `Token` or `Accessibility`, if there's real doubt. Never invoke those tools
yourself from inside this skill.

## Guardrails

- Never give a finding a different field set/label/order on one surface than another — the Figma
  annotation (Step 7), the Asana task body (Step 6b), the chat summary, and the JSON output contract
  all use §Unified Finding Schema's exact field names. Condense for Figma's panel, never rename.
- Never read `context/DRIFT.md` from an unsynced `cds-consumer` checkout — that repo belongs to a
  collaborator and updates independently; always `git pull` (or clone) it first (Step 4), so a stale
  local clone never causes a re-flag of something already settled.
- Never assume the target Design System is CDS — resolve/confirm it first (§Design System
  Identification), and never audit against a system the user hasn't confirmed for this run. This
  also governs which MCP server's `search_components` Step 3's zero-category check calls.
- Never guess Feature, or infer Platform without confirming an unclear mapping, when the Figma
  file name doesn't follow the `[Project_Squad] Feature` convention (Step 2) — ask instead. Never
  force a Squad value when the user has none (optional).
- Never create an Asana task for an Existing DS Issue (Step 5) — annotation only, Asana stays
  untouched.
- Never skip Step 6a — writing a `custom_fields` value for an enum option that doesn't exist yet
  fails loudly (`is not on given object`); silently falling back to free text in `notes` instead of
  creating the option is also wrong — always create-then-set.
- Never invent a new `Origin` option value — reuse `Figma Audit (ds-governance-audit-notion)` (see
  Step 6b and Reference) so existing dedup/gate logic downstream keeps working.
- Never skip the zero-category check (Step 3) before asking a mistake-vs-intentional question — if
  there's no existing pattern to compare against, the question has no answer to give.
- Never touch `Submitted Date` or `due_on` on a Step 6c occurrence update — both are write-once at
  creation.
- Never write a Design System Gap's own narrative page anywhere — the only Context Knowledge write
  this skill ever does is Step 2/8's Feature-name backfill/create (dashboard, not Notion); nothing
  else about a Gap gets narrative content written to any knowledge page.
- Never fabricate an Occurrence Count or Impact line without actually searching the Component issue
  project first (Step 6c).

## Output contract

`findings` is itemized, using §Unified Finding Schema's exact field names — the same fields as the
Figma annotation, the Asana task body, and the chat summary. Don't also carry a separate
`existing_issue`/`design_system_gap` count object; filter `findings` by `classification` for that.

```json
{
  "ok": true,
  "screen": "<Figma section URL>",
  "findings": [
    {
      "node_id": "...",
      "classification": "design_system_gap",
      "component": "...",
      "status": "Issue Found",
      "issue_type": "Component",
      "summary_reason": "...",
      "ai_recommend": "...",
      "core_system_recommendation": "...",
      "origin": {"figma_url": "...", "node_name": "..."},
      "asana_task_url": "..."
    },
    {
      "node_id": "...",
      "classification": "existing_issue",
      "component": "...",
      "problem": "...",
      "fix": "...",
      "origin": {"figma_url": "...", "node_name": "..."}
    }
  ],
  "asana_tasks_created": [],
  "asana_tasks_updated": [],
  "context_knowledge_updates": [],
  "issues": []
}
```
