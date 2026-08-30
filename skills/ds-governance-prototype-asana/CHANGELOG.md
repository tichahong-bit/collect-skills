# Changelog — ds-governance-prototype-asana

Full version history with the real defect/requester-correction and reasoning behind each rule now
in `SKILL.md`. Read this file for the "why" — an agent running the skill does not need it.

**In active use, corrected across 10+ documented real builds** (Wealth Dashboard US01/US02, Staff
portal for tablet — multiple phases). Every entry below is a real defect or a real requester
correction, not a hypothetical.

**This skill never touches Figma.** Output is a prototype in whatever presentation medium the
tool you're running in produces (e.g. an HTML/web mockup), not a Figma file. Turning it into real
Figma frames is a later step in the wider Requirement → Applied chain (see
`ds-extract-prototype-to-figma-canvas`).

---

## First real run (2026-08-20, Wealth Dashboard US01)

Requester liked the presentation format overall but flagged three things, folded into the
Design System Evaluation / Research Insight rules now in `SKILL.md`: (1) Research Insight cards
need a source link per report, same as the Requirement summary card; (2) a Tone of Voice compare
must render both variants in the same language, or the toggle shows a language switch instead of
a feeling difference; (3) Design System Evaluation collapses to two tags, `Reused`/`New
component`, not a six-way split (later superseded by v1.20.0's four-state table). Everything else
this run — draggable/collapsible chrome, per-screen panel re-render, DS A/B and Branding Theme
toggles, writing back to Requirement collections — behaved as designed.

## Second real run (2026-08-24, Wealth Investment Insight US02)

A reviewer measured the published prototype file directly (not from screenshots) and found zero
references to either DS site, 39 hand-picked hex values (one matching a CDS token by
coincidence), no `@font-face`/BBL Sans anywhere, an invented token vocabulary, and 13
`verify_code` errors — no design system was actually used, despite Step 3's old wording
technically permitting exactly that ("using a component means rendering it accurately... not
placing a Figma instance"). Step 3 now requires installing from the real registry, Step 3b adds a
mandatory audit/verify gate, and a new section covers the single-file Artifact case specifically
— the CSP constraint there was the actual root cause the old wording was quietly working around.

## v1.16.0 — the single-file pipeline ran for real (2026-08-24, same US02 rebuild)

Completed the pipeline's step 6 (verify what the bundler plugin can't see — icon sprite/font paths
computed at runtime, not import-time) and documented the token-namespace collision that shows up
when two DS systems are installed together for a compare build. The rebuilt US02 prototype
installed real components from both `cds-bbl` and `mbds-bbl`, passed a hard-refresh visual check
across all 4 screens × both DS variants × both branding themes, and published under 16MB with
zero remaining external runtime references.

## v1.17.0 — webds elevated to full parity with CDS/MBDS (2026-08-24)

Requester's instruction: every run pulls component/color/font/token exactly from whichever real DS
site(s) are in play — CDS, MBDS, or webds — never an approximation, regardless of delivery format.
webds gets the same rule-level treatment as CDS/MBDS: real registry install, own audit.mjs/
verify_code gate, its two unique caveats (patterns layer is consumer-measured; every component
Figma key served `null`, place by name).

## v1.18.0 — fixing a broken, not-owned artifact means rebuild-and-replace (2026-08-24, US01 rebuild)

Requester pointed at a prototype that turned out to be shared with them, not owned — the artifact
tool can't fetch its source or republish a fix to that URL. No separate source file existed
anywhere, and the build predated v1.15.0's real-component-install rule. Only real fix: full
rebuild on the current skill version, published as a new artifact, with the Requirement
collections leaf's "Related prototype runs" updated (new link added, old one marked superseded,
never deleted). Two more corrections: (1) a Core component reused to fill a gap on an
MBDS-governed screen needs its own local `.ds-cds` scope; (2) a branding color was guessed from a
segment's general feel (gold for "premium") rather than read from the actual guide, which
documents gold as reserved for print only — digital treatment is grey/white monochrome. Read the
named guide's actual color rules; never infer from what a brand "seems like."

## v1.19.0 — presentation mode becomes an exploration tool, not just a report (2026-08-25)

Four changes after reviewing a finished v1.18.0-era build: (1) Presentation Mode's on/off toggle
switch replaced with a single `›`/`‹` collapse icon-button — a toggle implied a binary never
wanted; (2) Branding/Tone/Design System switchers were previously gated behind an explicit
two-name comparison request — now standing whenever more than one real state exists (one named
guide + baseline already counts as two); the old two-names rule only decides the panel's wording;
(3) panel rows were citation-only — added focus interaction (click highlights + scrolls to the
real on-screen target); (4) new UX Rationale section sourced from the Design Knowledge Asana tree,
distinct from Research Insight (user-behavior evidence) — same click-to-source discipline, same
refusal to invent rationale when the tree has nothing (most of it was still empty placeholders
when this shipped).

## v1.20.0 — Design System Evaluation becomes a real component inventory (2026-08-25)

Two changes: (1) describing a screen's DS evaluation by context ("uses these tokens/patterns") is
less useful than listing actual CDS components used, each traceable to real docs + real Figma
node — retired the two-tag `Reused`/`New component` vocabulary for a flat table with four
Implementation Status values that distinguish "not shipped yet" from "doesn't exist in Figma
either" from "the tracking source itself might be wrong." The Core Design System Library
(Inventory) Asana project is the real Figma-link source — checked against the live CDS site
rather than trusted blindly (several rows — Tab, Toggle Switch, List Item, Popover, Dialog, Menu —
were stale this run). (2) A genuinely fresh second layout (not a token swap) gets a Design Option
switcher, scoped to whichever screen requested it — opt-in, not a standing expectation.

## v1.21.0 — Design Option can be system-wide; reference-layout matching is normal (2026-08-26)

Five corrections from one long build:
1. **Design Option scope.** Per-screen switchers for what turned out to be a system-wide request
   were explicitly rejected: *"Original vs Option A = คนละ Design Direction ของทั้ง System /
   End-to-End Flow ไม่ใช่ Page-level variation"* — two screens showing two different "current"
   directions isn't one coherent alternative experience. Fixed by collapsing to one global state
   driving every screen and every piece of shared chrome together. Ask explicitly, before
   building, whether a requested option is screen-scoped or system-wide whenever the flow has more
   than one screen.
2. **A Design Option's interaction mechanism can genuinely diverge, not just its skin** — e.g.
   real keyboard-typable digit boxes for Option A's passcode entry vs. Original's numpad, both
   declared unconditionally in the framework, only the render branch conditional.
3. **Adopting an external reference's layout is a normal, explicit request** — matching its exact
   IA while sourcing every stat/label/color from this build's own real data/tokens (never the
   reference's invented numbers/colors) is not a violation of DS-first; resolve explicitly which
   the requester means (layout vs. functional shape only) rather than defaulting to one.
4. **Redesigning an interaction should reach for the codebase's own established richer pattern**
   before the simplest primitive — a first pass used a plain toggle for a Customer/Staff switcher;
   fixed by reusing an existing Popover+Menu pattern (shows both destinations with icons/
   descriptions) instead of inventing a new one.
5. **Fork orchestration and independent verification** becomes a named, standing discipline (own
   section after Step 3b) — a fork's "done, verified, published" self-report is a claim to check,
   not relay; a real component-layout bug and a real WCAG contrast failure were both found this
   run only by measuring the live DOM directly.

## v1.21.1 — pull a component's full real context, not just enough props to render (2026-08-26)

Two real defects right after v1.21.0 shipped: a `Text Field` used with only render-minimum props
(missed its own declared "Has Start Icon" gap and aria-label-only guidance path); a `Tab` used
with `color="Neutral"` on a surface where `Neutral`'s own selected-pill token is the identical
grey — the tab's own guidance already named the correct variant for that surface. Standing rule:
call `get_component` and actually read guidance/gaps before finalizing usage, every time, not just
at first install.

## v1.22.0 — Dark theme is a real, standing mode axis with its own class of bugs (2026-08-27)

The big one — a whole category of dark-mode bug this skill had no guidance on:
1. New standing "Dark theme" section (now in `SKILL.md`) — the `-inverse` flip trap and the
   fixed-light-surface trap, found by measuring actual computed contrast, not eyeballing one
   screen. One real build had the fixed-light-surface bug recur independently in 8+ unrelated
   files once actually swept for.
2. Presentation chrome defaults to one fixed theme (pinned `data-theme="light"`), independent of
   the product's own theme toggle, unless asked otherwise — dark mode should apply to the product
   being reviewed, not the reviewer tooling.
3. A floating/draggable chrome can silently intercept clicks over the product below it — a
   `position:fixed` column-flex wrapper shrink-wraps its hit-testable box to its WIDEST child,
   blocking pointer events beside narrower children even though nothing paints there. Invisible
   from every screenshot; only found via `document.elementFromPoint` on a dead click.
4. A plain two-option settings row defaults to the lightest correct treatment (label + real
   `ToggleSwitch`) — a heavier card-per-option treatment only when the reference specifically
   shows cards or content needs more than a label.
5. A single-file Artifact's real cold-load can be 10–20+ seconds — expected sandboxed-iframe load,
   not a broken build; repeated quick checks mistook a still-loading page for a crash multiple
   times this run.

## v1.23.0 — knowledge sections must trace to a fresh traversal (2026-08-28)

The requester's own audit found Research Insight and Branding showing effectively nothing real —
three distinct root causes, not one bug:
1. A "no evidence for this decision" gap-flag list is not the real Research Insight list and must
   never be the only thing the section renders — a prior run's per-screen data had exactly one
   array, populated only with decisions *lacking* backing, so real on-topic reports in the index
   never had a field to land in. Fix: two separate arrays per screen (`researchInsights` +
   the gap-flag list), render both.
2. Before concluding a knowledge section is "broken," re-fetch the source fresh and check whether
   it's actually empty upstream — this run's UX Rationale section was genuinely correct to show
   almost nothing because the source branch was a real empty stub page, not a retrieval failure.
3. An explicit "there is exactly ONE Branding Theme, don't show other choices" instruction
   overrides the default live-switcher heuristic — remove the switcher entirely (state variable,
   UI control, CSS/token scope), not just default-select one side and leave the control wired.
4. Copywriting needs the same link-to-source discipline as Research Insight/UX Rationale, and its
   example text must be the literal string the live component renders — a prior run's "tone
   differentiated" example strings turned out to branch only on language in the real component,
   never reachable from the running app under the claimed states.

## v1.24.0 — Code Readiness summary, Figma-link proof-of-query, Flow-wide stays opt-in (2026-08-29)

Requester pointed this skill at an already-published artifact built entirely with hand-authored
CSS and zero CDS tokens/components, confirmed a full real-registry rebuild (not a reskin), then
caught three real gaps on review:
1. A Design System Evaluation table can structurally exist (right columns, right vocabulary) while
   every Figma Link cell is blank, because the Inventory project (source 9) was simply never
   queried. Added a standing self-check: confirm `get_tasks` was actually called against gid
   `1217578024173799` this run and point to at least one row with a real resulting link — unless
   every row on that screen is a genuine `Design System Gap`.
2. "Per screen, not one flow-wide list" (DS Evaluation) and "flow-wide insights get their own
   group" (Research Insight) are two different rules for two different sections — a run blended
   them into an inline "Flow-wide (shared chrome)" DS Evaluation section to avoid repeating rows
   across screens. Fixed: keep every screen's table strictly to its own rows (the repetition is
   correct, not a smell); a flow-wide rollup, if wanted, is an opt-in report view behind a button
   next to the section header — never inline, never the default.
3. New standing requirement: a Code Readiness summary line under the Design System Evaluation
   title, computed per screen from that screen's own rows (see `SKILL.md` for the exact bucket
   mapping and format) — the Flow-wide report view gets its own separate line the same way.

## v1.26.0 — chrome mechanics pinned to literal labels, not just behavior (2026-08-30)

Requester pointed at a specific published prototype (staff portal) and asked why the presentation
chrome's own wording/structure was never nailed down as a standing rule — before this, "Chrome
mechanics" only specified *behavior* (collapsible, draggable), leaving exact button text and
whether the switchers and the per-screen content share one panel or two up to whatever a given run
happened to generate, so two builds could behave identically but look/read differently to a
reviewer. Measured the real running artifact's source directly (not a screenshot) and found:
1. Three distinct chrome states, not two — a collapsed `🎭` pill with a 6-dot drag grip
   (`aria-label="Drag chrome"`), an expanded header reading `🎭 Presentation Mode`, and a separate
   **"Exit Presentation"** button that removes the chrome entirely. Collapsing back to the pill and
   exiting presentation mode are different actions and were at risk of being merged into one
   control by a future run.
2. The switchers and the per-screen content are **two separately-collapsible named panels**, not
   one — **"Prototype Settings"** (every live switcher) and **"Design Review"** (the per-screen
   sections), each with its own chevron-up/down collapse toggle. `SKILL.md`'s "Chrome mechanics"
   now pins these exact labels as standing, so any build using this skill produces the same
   chrome a reviewer already recognizes from a prior build.
