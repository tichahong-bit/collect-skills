---
name: ds-governance-prototype-asana
version: 1.5.0
description: >
  Turns a written requirement into a DS-aware prototype with a presentation mode —
  Asana-backed sibling of ds-governance-prototype-notion (same job, knowledge sources moved
  from Notion to Asana Knowledge, per the team's ongoing Notion→Asana migration). Every screen
  composes from two design-system layers: the Core Design System (cds-bbl, always the base for
  every project in the bank) plus, when the project has one, its own project-specific pattern
  library (e.g. webds-bbl, mbds-bbl) layered on top — never picks just one of several as if they
  were interchangeable alternatives. Both Copy Writing Guideline and Bradning Guidline hold
  multiple named sources each — the user must name which specific guide to use from each (e.g.
  "MB Writing Style Guide V2" for copy) rather than the skill guessing or blending. Presentation
  mode's side panel is per-screen dynamic, not one static panel repeated on every screen, and
  has its own Copywriting section and its own Branding section (placed directly above Design
  System Evaluation), each citing the specific named guide behind a decision. Also pulls (git
  clone/pull, always re-synced) from โย's `cds-consumer` repo for exact component specs and
  Drift rulings, and defers to กัน's `agent-design-kit` repo's real `requirement-intake` tool
  when a convergence sheet exists. Also writes back to Requirement collections as it clarifies a
  requirement, so the next run benefits.
metadata:
  status: proposal, untested — never run end to end
  mode: mixed
  category: workflow-meta
  sibling_of: ds-governance-prototype-notion (Notion-backed, kept separate — not a replacement)
---

# Prototype Agent (Asana-backed)

> **Status: proposal, not yet verified working.** Composed from Asana-knowledge sources that
> didn't exist as Asana pages until 2026-08-19, plus a Core + project-layer design-system model
> this skill's Notion-backed sibling only partially covered (it only knew about `cds-bbl`, and
> didn't distinguish Core from a project-specific layer). The first real run should be treated
> as a test — report back anything that didn't behave as described here so this file can be
> corrected from what actually happened, not left on faith.
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
- **Project-specific design system** (optional) — if this project has its own pattern library
  beyond Core (see Step 1), a link to it. Core (`cds-bbl` + its Figma library) is **always**
  read regardless of this input — it's not one of several choices, it's the fixed base every
  project composes from. Ask once if it's unclear whether this project has a project-specific
  layer; don't assume it doesn't just because nothing was mentioned, and don't assume it does
  either — ask.
- **Compare request** (optional) — supplying **two** project-specific (or theme) links instead of
  one means the requester wants to compare the same prototype under two variants side by side
  (e.g. deciding between a current and a proposed pattern set) — build the A/B toggle described
  in Step 4, not two separate prototypes. Don't assume a compare is wanted unless 2+ links are
  actually given.
- **Tone of voice guide** (required whenever the screen has real copy to write — see Copy
  Writing Guideline below) — which specific guide on that page to use (e.g. "MB Writing Style
  Guide V2"). Ask if not given; never silently pick one or blend multiple guides together.
- **Branding guide** (required whenever the screen has a real branding decision to make — see
  Bradning Guidline below) — same rule as tone of voice: which specific guide on that page to
  use. Ask if not given; never silently pick one or blend multiple guides together.
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
   (https://app.asana.com/1/1153565613997788/note/1217629510106643). This index holds **multiple
   distinct sources** (logged via `asana-copywriting-log`) — a house style guide, a tone-of-voice
   quick guide, a grammar reference, etc. are all separate 🔹 rows here, not one guideline.
   **Use only the specific guide the user named** (see "Tone of voice guide" input above) — find
   its row, open its detail page, and apply that guide's rules to any copy you write into the
   prototype (labels, headings, error/empty states, CTAs). If the user didn't name one, ask —
   don't guess which row applies or blend several rows' rules together. If the named guide isn't
   on the page yet, say so in the final summary and write plain, ordinary product copy instead of
   inventing a "guideline-compliant" voice with nothing real to check it against.

3. **Requirement collections** — index gid `1217617725712351`
   (https://app.asana.com/1/1153565613997788/note/1217617725712351). Check for an existing row
   for this feature/requirement area before asking the user anything in Step 2 — someone may have
   already clarified this. Structure mirrors `asana-research-log`: one 🔹 index row per
   requirement area (title, one-line summary, date, who) linking to a page with the full detail.
   **This skill also writes to this page** — see "Writing back to Requirement collections" below.

4. **Bradning Guidline** [page title as created, gid unchanged regardless of the typo] — gid
   `1217632285949369` (https://app.asana.com/1/1153565613997788/note/1217632285949369). Same
   shape and same rule as Copy Writing Guideline above — this index holds **multiple distinct
   sources** (logged via `asana-branding-log`: a master guideline file, a vendor workshop deck,
   meeting notes, etc.), not one guideline. **Use only the specific guide the user named** (see
   "Branding guide" input above) — find its row, open its detail page, and apply that guide's
   rules to any branding decision in the prototype. If the user didn't name one, ask — don't
   guess which row applies or blend several rows' rules together. If the named guide isn't on
   the page yet, say so in the final summary and don't assert "on-brand" with nothing real to
   check it against.

5. **โย's (Yo's) `cds-consumer` repo** — https://github.com/therealveldt/cds-consumer.git (real
   repo, confirmed 2026-08-20; private but this session's git credentials reach it). Clone it if
   not already present locally, `git pull` if it is — always re-sync before reading, since Yo
   updates it independently of this skill:
   ```
   git -C ~/design-system-repos/cds-consumer pull 2>/dev/null || git clone https://github.com/therealveldt/cds-consumer.git ~/design-system-repos/cds-consumer
   ```
   This is a **read-only reference lookup**, not a Figma tool — it's how Step 3 gets exact
   component props/states/token names without needing Figma access at prototype stage. Read:
   - `context/COMPONENTS.md` + `context/REGISTRY.md` — real component specs and token values,
     more precise than scraping the live DS site; prefer these when they and the live site
     disagree on a component's exact props.
   - `context/DRIFT.md` — prior "intentional difference, don't re-flag" rulings. Check before
     placeholdering something in Step 3 that Yo already ruled deliberate.
   - `guidelines/writing.md` — Yo's own writing guideline. Secondary to the *named* Copy Writing
     Guideline source from Asana (that one is still required and primary) — use this only as
     extra context, never in place of the guide the user actually named.
   - `guidelines/accessibility.md`, `guidelines/motion.md`, `guidelines/responsive.md`,
     `guidelines/layout.md` — general build-time rules for Step 3.

6. **กัน's (Kan's) `agent-design-kit` repo** — https://github.com/KanKaoLab/agent-design-kit.git
   (public, confirmed 2026-08-20). Same sync-then-read pattern:
   ```
   git -C ~/design-system-repos/agent-design-kit pull 2>/dev/null || git clone https://github.com/KanKaoLab/agent-design-kit.git ~/design-system-repos/agent-design-kit
   ```
   Its `.claude/skills/requirement-intake/SKILL.md` is the **real** requirement-intake tool
   Step 2 below defers to — it runs
   `python agent-design-kit/scripts/phase8-workflow.py clarify <input.json> --json` against a
   "convergence sheet" JSON and returns a `single-question-bundle` of only shape-changing
   questions (exit code 2 = still blocked). If no convergence-sheet JSON exists yet for this
   requirement, say so plainly and fall back to Step 2's manual shape-question gate below rather
   than fabricating one — don't force real tooling to run against input it wasn't built for.

7. **Design system — two layers, composed, not three interchangeable choices.** Every project in
   the bank builds on **Core** as its base; a project may *also* have its own project-specific
   pattern library layered on top. These are not peer alternatives to pick one of — read Core
   every time, and read the project layer too when this project has one.

   - **Core Design System (always read)**: https://cds-bbl.vercel.app/, generated from the Figma
     **⭐️ Core Design Library** (fileKey `ON8Azjo7wIi3P2oxnxKiBb`,
     https://www.figma.com/design/ON8Azjo7wIi3P2oxnxKiBb/%E2%AD%90%EF%B8%8F-Core-Design-Library —
     the Overview page, node `31:176`, is a good orientation starting point for a new session).
     If a token/component looks wrong or missing on the live site, this Figma file is the
     upstream source to check before assuming the live site itself is wrong.
   - **Project-specific pattern library (read only if this project has one)**: a separate link
     the requester supplies — `webds-bbl.vercel.app` and `mbds-bbl.vercel.app` are examples of
     project-specific libraries (web and mobile respectively) already in use elsewhere, not a
     fixed list to choose from. When present, its patterns extend/override Core for this
     project's specific screens; Core still governs anything the project layer doesn't touch.
   - Live sites are the freshest, most authoritative source of what's actually real in code right
     now — weight them over Asana/repo sources if the two disagree about whether something
     exists.

## Step 1 — establish the design-system composition

Core is always in play — no need to ask about it. Ask once, only if genuinely unclear, whether
this project has its own project-specific pattern library on top of Core, and if so get its
link. Don't assume a project layer exists just because one might be typical, and don't assume it
doesn't just because none was mentioned — resolve it, don't guess either way. This determines
what Step 3 checks new/existing components against: Core first, project layer for anything it
covers.

## Step 2 — clear the requirement before building

Check Requirement collections (source 3 above) for an existing entry on this feature area first.
Resolve what you can from that plus the other knowledge sources.

**Prefer the real tool over improvising.** If a convergence-sheet JSON exists for this
requirement, run it through กัน's `requirement-intake` (source 6 above) and present its
`single-question-bundle` — only decisions it marks `changes_ui_shape: true`. If no convergence
sheet exists yet, fall back to asking the user directly only for questions that would actually
change the UI's *shape* — same hard gate either way (a prototype built on a wrong shape
assumption wastes the whole downstream chain). Don't ask about every open question, only
shape-changing ones; record non-blocking ones instead of raising them.

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

1. **Component exists** (governing DS site, or `cds-consumer`'s `COMPONENTS.md`/`REGISTRY.md` —
   source 5 above, preferred when the two disagree) → match its real props/states/token values as
   closely as the prototype medium allows.
2. **Component doesn't exist yet** → check `cds-consumer`'s `DRIFT.md` first — an owner may have
   already ruled this a deliberate difference, not a real gap. If it's still a genuine gap, mock
   it up freehand, clearly labeled as a placeholder in the prototype's own annotations — never
   let a placeholder look indistinguishable from an accurately-rendered real component to
   whoever reviews this next.

The requirement is the priority throughout — a screen that's mostly real-DS with some flagged
placeholders, shipped on time, is the correct outcome, not a reason to stop and wait.

## Step 4 — presentation mode, per-screen dynamic panel, optional DS A/B toggle

Build a walkthrough view (or whatever presentation surface the tool you're running in supports)
with a **presentation-mode toggle** (chrome control, off by default so the initial view is the
clean product surface) that reveals the side panel. The panel's content **changes per screen** —
this is the specific fix this skill exists to make over the static single-panel pattern seen
elsewhere. Concretely:

**If the requester gave two project-layer/theme links (a compare request):** also add a Design
System A/B toggle in the same chrome control, swapping the rendered screen's project-layer
tokens (color, radius, type, whatever each link actually defines) between the two, on top of the
same Core base both times — same screens, same content, same Core, different project layer.
Build this as a real token swap (e.g. a `data-ds` attribute driving a second CSS token block
sourced from the second link's actual values), not a second copy of the prototype. If no compare
was requested, skip this toggle entirely — don't add a compare control nobody asked for.

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
- **Copywriting** (its own section, not folded into another) — for every real copy decision on
  this screen (labels, headings, error/empty states, CTAs), state the wording chosen and cite
  the specific rule from the *named* tone-of-voice guide (e.g. "MB Writing Style Guide V2") that
  it follows — never a vague "per guidelines." If no guide was named for this run, this section
  says so plainly instead of pretending copy was guideline-checked.
- **Branding** (its own section, same treatment as Copywriting, placed directly above Design
  System Evaluation) — for every real branding decision on this screen, cite the specific rule
  from the *named* branding guide (e.g. which one the user pointed to on the Bradning Guidline
  page) that it follows — never a vague "on-brand." If no guide was named for this run, this
  section says so plainly instead of asserting brand-compliance with nothing real behind it.
- **Design System Evaluation** — every element on this screen tagged one of: `Reused` /
  `New variant` / `Assumption` / `New content` / `Adjustment`. Per screen, not one flow-wide
  list. **Every `Reused` or `New variant` row gets a Figma link** to the actual component
  (resolve the real node via the Figma tools' `search_design_system`/component lookup against
  the governing DS's own library file — don't just link the library file's root, link the
  specific component/node). `Assumption` / `New content` / `Adjustment` rows have no Figma
  component to link to — leave them without a link rather than linking something unrelated.

## Final chat summary

- Which project-specific pattern library (if any) layered on top of Core for this build, and
  whether that had to be asked (Step 1) — plus which tone-of-voice guide was used for copy and
  which branding guide was used for branding decisions, if either applied.
- Requirement questions resolved, and how each was resolved — from existing knowledge (including
  what Requirement collections already had) vs. asked the user (Step 2), plus confirmation that
  the resolution was written back to Requirement collections.
- Screens built, and for each: real-DS component count vs. placeholder count.
- Any knowledge source that was missing/empty, unreachable, or the user hadn't linked yet — say
  so plainly, don't paper over a gap. Include whether `cds-consumer`/`agent-design-kit` synced
  successfully and whether the real `requirement-intake` tool ran or the manual fallback was used.
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
