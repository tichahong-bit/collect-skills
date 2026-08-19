---
name: ds-governance-prototype-asana
version: 1.0.0
description: >
  Turns a written requirement into a DS-aware prototype with a presentation mode —
  Asana-backed sibling of ds-governance-prototype-notion (same job, knowledge sources moved
  from Notion to Asana Knowledge, per the team's ongoing Notion→Asana migration). Pulls
  Research, Copy Writing Guideline, Requirement collections, and Branding Guideline from Asana,
  and reads all three live design-system sites (webds-bbl, mbds-bbl, cds-bbl) directly for
  ground truth. Presentation mode's side panel is per-screen dynamic, not one static panel
  repeated on every screen. Also writes back to Requirement collections as it clarifies a
  requirement, so the next run benefits.
metadata:
  status: proposal, untested — never run end to end
  mode: mixed
  category: workflow-meta
  sibling_of: ds-governance-prototype-notion (Notion-backed, kept separate — not a replacement)
---

# Prototype Agent (Asana-backed)

> **Status: proposal, not yet verified working.** Composed from Asana-knowledge sources that
> didn't exist as Asana pages until 2026-08-19, plus three live design-system sites this
> skill's Notion-backed sibling only partially covered (it only knew about `cds-bbl`). The
> first real run should be treated as a test — report back anything that didn't behave as
> described here so this file can be corrected from what actually happened, not left on faith.
>
> **This skill never touches Figma.** Output is a prototype in whatever presentation medium the
> tool you're running in produces (e.g. an HTML/web mockup), not a Figma file. Turning it into
> real Figma frames is a later step in the wider Requirement → Applied chain, out of scope here.

## Why a separate skill, not an edit to ds-governance-prototype-notion

Kept deliberately separate (confirmed with the owner) rather than renamed in place — mirrors the
`ds-governance-audit-notion` / `ds-governance-audit-asana` split already established in this
workspace. The Notion-backed skill still exists and still works against Notion; this one is the
Asana-backed path as the team migrates knowledge sources over.

## Expected input

- **Requirement** (required) — the raw requirement text, or a link to the doc that has it.
  Business input is sometimes complete, sometimes just a one-line ask — either is fine, Step 2
  is what resolves the gap.
- **Design system** (optional) — which of the three live DS sites governs this project, if known
  (see Step 1). If omitted and it isn't obvious from the requirement/project context, ask once
  rather than guessing.
- **Priority note** (optional, defaults to on) — the requirement always wins over design-system
  completeness: a component missing from the DS is never a reason to stop, only a reason to
  placeholder-and-flag (Step 3).

## Knowledge sources (all Asana + live sites — this skill does not read Notion)

Read these in order and hold their content in context for Steps 2–4. Don't block on any single
source being empty — note the gap in the final summary instead (several of these pages are
brand-new and may have little or nothing in them yet).

1. **Research** — index gid `1217101228810755`
   (https://app.asana.com/1/1153565613997788/note/1217101228810755). `page_get` it, follow every
   🔹-block link, and pull in any report whose topic is plausibly relevant to this requirement.
   For each one, note explicitly whether it *applies* to a screen you're about to build or was
   *reviewed and found not applicable* — both get surfaced in Step 4's panel, never silently
   dropped. (Format follows `asana-research-log`'s adaptive-structure reports.)

2. **Copy Writing Guideline** — gid `1217629510106643`
   (https://app.asana.com/1/1153565613997788/note/1217629510106643). Tone/voice rules for any
   copy you write into the prototype (labels, headings, error/empty states, CTAs). If this page
   is still empty, say so in the final summary and write plain, ordinary product copy instead of
   inventing a "guideline-compliant" voice with nothing to check it against.

3. **Requirement collections** — index gid `1217617725712351`
   (https://app.asana.com/1/1153565613997788/note/1217617725712351). Check for an existing row
   for this feature/requirement area before asking the user anything in Step 2 — someone may have
   already clarified this. Structure mirrors `asana-research-log`: one 🔹 index row per
   requirement area (title, one-line summary, date, who) linking to a page with the full detail.
   **This skill also writes to this page** — see "Writing back to Requirement collections" below.

4. **Bradning Guidline** [page title as created, gid unchanged regardless of the typo] — gid
   `1217632285949369` (https://app.asana.com/1/1153565613997788/note/1217632285949369). Branding
   rules — same treatment as Copy Writing Guideline: cite the specific rule behind any branding
   decision in Step 4's panel, don't just assert "on-brand."

5. **All three live design-system sites** — read whichever one(s) actually govern this project
   directly, and follow every rule documented there. Don't assume `cds-bbl` is the only one (the
   Notion-backed sibling skill only knew about this one; it was a gap, not a feature):
   - https://webds-bbl.vercel.app/#/
   - https://mbds-bbl.vercel.app/
   - https://cds-bbl.vercel.app/ — generated from the Figma **⭐️ Core Design Library**
     (fileKey `ON8Azjo7wIi3P2oxnxKiBb`,
     https://www.figma.com/design/ON8Azjo7wIi3P2oxnxKiBb/%E2%AD%90%EF%B8%8F-Core-Design-Library).
     If a token/component looks wrong or missing on the live site, this Figma file is the
     upstream source to check before assuming the live site itself is wrong.
   These are the freshest, most authoritative source of what's actually real in code right now —
   weight them over Asana/repo sources if the two disagree about whether something exists. If
   it's unclear which site governs this project, ask once rather than guessing or reading all
   three as equally authoritative for a project that only uses one.

## Step 1 — confirm which DS site applies

Before building anything, establish which of the three live sites is this project's design
system (from the input, or ask once). This determines which site's rules Step 3 checks against.

## Step 2 — clear the requirement before building

Check Requirement collections (source 3 above) for an existing entry on this feature area first.
Resolve what you can from that plus the other knowledge sources; ask the user directly only for
questions that would actually change the UI's *shape* — same hard gate as the Notion-backed
sibling (a prototype built on a wrong shape assumption wastes the whole downstream chain). Don't
ask about every open question, only shape-changing ones; record non-blocking ones instead of
raising them.

**Writing back to Requirement collections:** whether or not you had to ask the user anything,
log this requirement to the index (upsert — read `html_text` first, never overwrite another
entry) and create/update its detail page with what's now understood: the requirement as
resolved, what was originally ambiguous, and how each ambiguity got resolved (from existing
knowledge vs. asked the user). This is what makes the next prototype run against the same
feature area faster.

## Step 3 — build the prototype, DS-first, gaps placeholdered not blocked

Nothing in this step touches Figma — "using" a component means rendering it accurately in the
prototype's own medium (HTML/CSS matching the DS site's real values), not placing a Figma
instance.

For each screen/section the requirement implies:

1. **Component exists in the governing DS site** → match its real props/states/token values as
   closely as the prototype medium allows.
2. **Component doesn't exist yet** → mock it up freehand, clearly labeled as a placeholder in the
   prototype's own annotations — never let a placeholder look indistinguishable from an
   accurately-rendered real component to whoever reviews this next.

The requirement is the priority throughout — a screen that's mostly real-DS with some flagged
placeholders, shipped on time, is the correct outcome, not a reason to stop and wait.

## Step 4 — presentation mode, per-screen dynamic panel

Build a walkthrough view (or whatever presentation surface the tool you're running in supports)
with a toggleable side panel. The panel's content **changes per screen** — this is the specific
fix this skill exists to make over the static single-panel pattern seen elsewhere. Concretely:

- Keep a per-screen data structure (screen id → that screen's own insight cards / DS rows), built
  from Steps 1–3's knowledge as it actually applies to *that* screen — not one global list reused
  everywhere.
- When the user switches screens in the prototype, re-render the panel's sections from that
  screen's own data — don't just toggle screen visibility and leave the panel untouched.
- An insight that genuinely applies to the whole flow (not one screen) goes in its own
  "Flow-wide" group so it isn't lost when switching screens, rather than being duplicated
  identically into every screen's section.

Panel sections, per screen:
- **Research Insight** — cards with: title, summary, and an explicit *why this design does /
  does not yet address it* line (cite the specific finding, not "informed by research" in the
  abstract). Include what was reviewed and judged not applicable to this screen, not just what
  was used.
- **Copywriting rationale** — wherever the screen has real copy decisions, cite the specific
  Copy Writing Guideline rule behind the wording choice.
- **Branding rationale** — same treatment, citing the Bradning Guidline page, wherever a
  branding decision is visible on this screen.
- **Design System Evaluation** — every element on this screen tagged one of: `Reused` /
  `New variant` / `Assumption` / `New content` / `Adjustment`. Per screen, not one flow-wide
  list.

## Final chat summary

- Which DS site governed this build, and whether it had to be asked (Step 1).
- Requirement questions resolved, and how each was resolved — from existing knowledge (including
  what Requirement collections already had) vs. asked the user (Step 2), plus confirmation that
  the resolution was written back to Requirement collections.
- Screens built, and for each: real-DS component count vs. placeholder count.
- Any of the five knowledge sources that was missing/empty or the user hadn't linked yet — say so
  plainly, don't paper over a gap.
- Explicitly say this run is feeding a proposal-status skill and invite a correction if any step
  didn't behave as described — same transparency standard as the Notion-backed sibling's own
  "proposal, not yet verified working" banner.

## Out of scope for this skill

- Extracting the prototype into real Figma frames — a later step in the Requirement → Applied
  chain, out of scope here (whatever the Asana-backed equivalent of
  `ds-governance-extract-notion` turns out to be, once/if it exists).
- Auditing the resulting screens against the DS — that's `ds-governance-audit-asana`, much later
  in the chain, after wireframing and binding are both done.
- Migrating `Copy Writing Guideline`, `Requirement collections`, or `Bradning Guidline` content
  from wherever it used to live — this skill reads/writes these Asana pages as they are; filling
  them in initially is a separate task.
