---
name: ds-governance-audit-asana
version: 1.2.0
description: >-
  Audits a Figma screen against the Core Design System and the relevant project's design system,
  classifies every finding as an Existing DS Issue (self-fixable, existing assets already cover it)
  or a Design System Gap (needs a new/changed asset), writes a native Figma Dev Mode annotation for
  both, and — for Gaps only — logs a task into the Asana "📋 Component issue" project (part of the
  "Design System Governance" portfolio). Asana-backed sibling of ds-governance-audit-notion: same
  classification logic and Figma annotation contract, only the tracked-table write target changed
  from a Notion database to Asana. Narrative knowledge (Context Knowledge, Design system knowledge)
  stays in Notion — this skill reads it, never migrates it.
metadata:
  status: stable
  mode: mixed
  category: workflow-meta
  derived_from: ds-governance-audit-notion v1.11.0
  companion_doc: https://app.notion.com/p/3c07817ccced80d0b1b1ee2cc458ae0c
---

# Design System Governance Agent (Asana-backed)

Audits a Figma screen, classifies every issue, annotates what's fixable now, logs what's a genuine
Design System gap — into Asana instead of Notion.

AI never edits the Figma file's design directly. It only annotates, and only writes an Asana task
when an issue is a genuine Design System Gap — never for an Existing DS Issue, no matter how it was
built (a wrong token on a real instance, or a raw frame with zero binding to anything — both stay
Figma-only, see Step 5).

**Blast radius:** writes a Figma Dev Mode annotation and creates/updates an Asana task, both visible
to the whole team immediately. Confirm scope with the user before running against a real screen —
never run silently in the background.

## Why this exists next to ds-governance-audit-notion

Same audit brain (Steps 1–4 below are a direct port of ds-governance-audit-notion's classification
logic, changelog v1.1.0–v1.11.0). The only thing that changed is where a **Design System Gap**
lands: a Notion "📋 Component issue" row → an **Asana task** in the shared
[📋 Component issue](https://app.asana.com/1/1153565613997788/project/1217578024449430) project.
Full rationale + field-mapping table lives in
[Design System Governance V.2 with Asana](https://app.notion.com/p/3c07817ccced80d0b1b1ee2cc458ae0c)
— read that page once before the first run in a new session; this file only carries the IDs needed
to execute, not the "why".

Note there is also an older, independent **`ds-governance-audit`** skill (Asana-backed, per-project
`asana.config.yml` board model with escalation to a separate Core governance board). That skill
predates this project's "one shared Component issue project with a multi-select Related Project
field" model and targets a *different* Asana structure — do not mix the two. This skill is the one
that matches what `ds-governance-audit-notion` actually built and what this project's Notion pages
document.

**v1.1.0** — two corrections from a real run (2026-08-18, Wealth_G14 schedule-payment screen):
(1) Step 1's token/font check was underspecified — it now includes the exact scan script and a
consolidation rule (one annotation per container, not one per node — a 3-screen flow with raw text
on every line produced 24 raw findings from 8 distinct text/fill nodes × 3 repeated screens; that's
3 annotations, not 24). (2) Step 7 corrected a false claim inherited from the older `ds-governance-audit`
skill that annotation categories can only be *created* via Desktop Bridge (`figma-console`) and only
*assigned* via the plain Plugin API. Verified live: `figma.annotations.addAnnotationCategoryAsync()`
works standalone, no Desktop Bridge needed — it created both `Request Design system` and `Log Note`
in a file that had neither. Use it directly instead of asking the user to add the category by hand.

**v1.2.0** — Step 6b's task body was a flat field-order list (`Component Name → Request Type → ...`),
copied from the older `ds-governance-audit` skill's convention. Corrected against the real Notion
"Component issue" row body (verified live, `3bf7817ccced8117a0f4d5356b7b4650`-family pages): the
actual format is four narrative `h2` sections — Summary Reason, AI Recommend, Core System
Recommendation, Source — not a field-per-line dump. Rewrote 3 already-created Gap tasks
(GG_obie ×2, Wealth_G14 ×1) to match retroactively; new runs use the corrected template directly.

## Inputs

From the user: a Figma **Section URL** to audit (a finished screen/flow, already built — this skill
audits, it does not build). Optionally: a Project-level Design System reference, if the screen
belongs to a project whose own library differs from Core.

## Step 1 — Read the section like Figma's own "Check designs" feature

For every component-shaped node in the audited Section (`get_metadata` first for the tree, then
`get_screenshot` for a visual pass), check three things:

1. **Is it a real instance** of something published in Core or the relevant Project Design System?
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

## Step 2 — Resolve Feature name against Context Knowledge (Notion, read-only + one backfill write)

Cross-check the Feature name against
[Context Knowledge](https://app.notion.com/p/3bc7817ccced80088cc6c2b85b2d7361) instead of relying on
the file name alone. Context Knowledge carries a **Figma link** column per feature — backfill it
when empty. This is the one Notion write this skill still performs on purpose: narrative/knowledge
content stays in Notion by design (see the companion doc), only the tracked Gap **table** moved to
Asana.

If the Figma file follows the `[<Project>_<squad name>] <Feature/epic name>` naming convention (see
the companion doc's callout), parse `Project`/`Squad` from the filename verbatim — don't resolve a
squad code into a guessed full name, and don't invent a Feature name that isn't in Context Knowledge
or the filename.

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

A finding with a matching build-time "not in design system" annotation from whatever skill built the
screen is almost always a Gap already — don't reclassify it as an Issue without a documented reason.

## Step 4 — Check for a prior owner ruling before flagging a Gap

If the project has a `cds-consumer` repo checked out locally, check `context/DRIFT.md`'s "Settled —
do not re-flag" table before logging a new Gap — an owner may have already ruled a difference
deliberate. If the repo isn't present, skip this check and say so in the summary; don't block the
audit on it.

## Step 5 — Existing DS Issue: Figma annotation only, never Asana

Write the annotation (see §Annotation below, "Log Note" category). **Nothing goes to Asana for this
classification.** If code-readiness is known for the component involved, tag it informationally on
that component's Asana Inventory task (`Code Status` = `Shipped in Code` / `Design Ahead of Dev`,
`Code Last Checked` = today) — see
[🗂 Core Design System Library (Inventory)](https://app.asana.com/1/1153565613997788/project/1217578024173799)
/
[🗂 Project Component Inventory](https://app.asana.com/1/1153565613997788/project/1217568055044505).
This is bookkeeping only, never a gate on whether the Figma annotation gets written.

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

Project: `1217578024449430` ("📋 Component issue"). Section = current status (`Issue Found` =
`1217582199538063` for a brand-new Gap; see the companion doc for the other section GIDs). Set:

| Notion property (old) | Asana custom field (gid) | Type |
|---|---|---|
| status | Issue Status — `1217582198197613` | enum |
| Request Type | Request Type — `1217580489107606` | enum |
| Origin | Origin — `1217568217901596` | enum |
| Issue Type | Issue Type — `1217568054116835` | multi_enum |
| Squad | Squad — `1217568217901603` | multi_enum |
| Related Project | Related Project — `1217568217768099` | multi_enum |
| Feature | Feature — `1217582198962677` | multi_enum |
| Occurrence Count | Occurrence Count — `1217567936067965` | number |
| Suggest to add in Core System? | Suggest to add in Core System? — `1217580489547133` | enum |

Set `Origin` to the `Figma Audit (ds-governance-audit-notion)` option (gid `1217568217901597`) —
**keep this exact option value**, even though this skill is the Asana-writing variant. The option
name identifies *how* the finding was produced (a Figma audit run), not which skill wrote the row;
downstream tooling (and any future `ds-governance-pr-asana` companion) dedupes/gates on this value,
so don't create a parallel `Figma Audit (ds-governance-audit-asana)` option.

**Body format — use `html_notes`, not `notes`.** Match the real Notion "Component issue" row body
exactly (verified live against the "Service Module Card" row,
`3bf7817ccced8117a0f4d5356b7b4654`) — four narrative sections, not a flat field-order list. `h3`
isn't in Asana's allowed tag set, so section headers use `h2` instead of Notion's `###`:

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

## Step 7 — Annotation (native Dev Mode, both classifications)

Set `node.annotations` directly via `use_figma`. Call
`await figma.annotations.getAnnotationCategoriesAsync()` first — this works standalone, no Desktop
Bridge required — and match by `label` against the two category names this org uses:
**`"Request Design system"` (blue)** for a Gap, **`"Log Note"` (yellow)** for an Existing DS Issue.

**If a category is missing in this particular file, create it — don't omit `categoryId` and don't
ask the user to add it by hand.** `figma.annotations.addAnnotationCategoryAsync({ label, color })`
works standalone via the plain Plugin API, no Desktop Bridge/`figma-console` needed (verified live,
2026-08-18, on a file that had neither category — see the v1.1.0 changelog note above). Only fall
back to a `categoryId`-less annotation if that call itself throws.

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

// Design System Gap
node.annotations = [{
  categoryId: gapCategory.id,
  labelMarkdown:
    "**Design System Gap**\n" +
    "- **Status:** Issue Found\n" +
    "- **Issue type:** <Component / Token / Pattern / Accessibility / Other>\n" +
    "- **Impact:** <e.g. \"Project level only · 1 squad only\" or \"Hits N projects\">\n" +
    "- **Why:** <specific reason neither Design System covers this — not generic>\n\n" +
    "🔗 [View issue in Asana](<task permalink_url>)",
}];

// Existing DS Issue (consolidated per container — see Step 1's consolidation rule)
node.annotations = [{
  categoryId: issueCategory.id,
  labelMarkdown:
    "**Existing DS Issue**\n" +
    "- **Component:** <Core/Project library — name (Status, Version)>\n" +
    "- **Problem:** <what's wrong — wrong variant / detached / raw token>\n" +
    "- **Fix:** <what to do instead, concrete>",
}];
```

This is the exact format already in production use in this org (verified live against
`0ZPE1y1pXUAmFoYhrFdc2X` "[NA_X] Retail Banking", nodes `107:1337` and `107:1295`) — match it
character-for-character, don't improvise a new shape.

Both directions of the link: the Asana task's `notes` link to the Figma node, and the Figma
annotation links back to the Asana task's `permalink_url` once the task exists. Write the Asana task
first (Step 6), then the annotation (this step needs the URL).

## Step 8 — Knowledge growth (Notion, same as the Notion-backed skill)

If Step 2 found a genuinely new Feature, write it back into
[Context Knowledge](https://app.notion.com/p/3bc7817ccced80088cc6c2b85b2d7361) (including its Figma
link) so the next audit — Asana- or Notion-backed — finds it there. This keeps the knowledge loop
shared across both skill variants instead of forking it.

## Final chat summary

Per finding: classification + what was annotated + (for Gaps) the Asana task URL. When a finding's
`Issue Type` is `Token` or `Accessibility`, mention — as a suggestion only, never an automatic call —
that a deeper check (`figma-semantic-token-audit`, `claude-a11y-skill`) is available if there's real
doubt. Never invoke those tools yourself from inside this skill.

## Guardrails

- Never create an Asana task for an Existing DS Issue (Step 5) — annotation only, Asana stays
  untouched.
- Never skip Step 6a — writing a `custom_fields` value for an enum option that doesn't exist yet
  fails loudly (`is not on given object`); silently falling back to free text in `notes` instead of
  creating the option is also wrong — always create-then-set.
- Never invent a new `Origin` option value — reuse `Figma Audit (ds-governance-audit-notion)` (see
  Step 6b) so existing dedup/gate logic downstream keeps working.
- Never write a Design System Gap's narrative (Context Knowledge, Design system knowledge pages) —
  those stay Notion-only, read-only from this skill's perspective except the Step 2/8 Feature
  backfill.
- Never fabricate an Occurrence Count or Impact line without actually searching the Component issue
  project first (Step 6c).

## Output contract

```json
{
  "ok": true,
  "screen": "<Figma section URL>",
  "findings": {"existing_issue": 0, "design_system_gap": 0},
  "asana_tasks_created": [],
  "asana_tasks_updated": [],
  "context_knowledge_updates": [],
  "issues": []
}
```
