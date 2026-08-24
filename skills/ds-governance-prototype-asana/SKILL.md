---
name: ds-governance-prototype-asana
version: 1.17.0
description: >
  Turns a written requirement into a DS-aware prototype with a presentation mode —
  Asana-backed sibling of ds-governance-prototype-notion (same job, knowledge sources moved
  from Notion to Asana Knowledge, per the team's ongoing Notion→Asana migration). Core Design
  System (cds-bbl) is always the base; the project layer on top follows one of three explicit
  modes the requester picks — Core only (no project layer), an existing project DS reused as-is
  (e.g. "MBDS — MB Design System" at mbds-bbl.vercel.app), or Core as foundation with a brand-new
  pattern layer composed fresh for this project this run. These are never inferred or blended —
  ask which mode applies whenever it's unclear. Both Copy Writing Guideline and Bradning Guidline
  hold
  multiple named sources each — the user must name which specific guide to use from each (e.g.
  "MB Writing Style Guide V2" for copy) rather than the skill guessing or blending. Presentation
  mode opens a draggable, collapsible chrome bar; its side panel always leads with a constant
  Requirement summary, then four per-screen sections that change as the viewer clicks between
  screens: Research Insight, Branding, Design System Evaluation, Copywriting (in that order —
  Copywriting sits after the DS Evaluation, not before it). Up to three independent optional
  compare toggles can appear in the chrome, each built only when its own specific trigger was
  actually given — a Design System A/B toggle (two project-layer links), a Branding Theme toggle
  (two named branding guides), and a Tone of Voice toggle (two named copywriting guides) — if
  none were given, the requester gets an exact single build with nothing to compare, and the
  chrome shows only the Presentation Mode toggle. When a Tone of Voice toggle is built, both
  variants render in the **same language** — a language switch is not a tone comparison, it hides
  the feeling difference the toggle exists to show. Every Research Insight card links back to the
  specific Asana research report(s) it cites, the same way the constant Requirement summary card
  links to its Requirement collections page — so a reader can always open the source, and a card
  that draws on more than one report links all of them. Design System Evaluation uses exactly two
  tags, `Reused` and `New component` — no `New variant`/`New token`/`Assumption`/`New content`/
  `Adjustment` split. Also pulls (git clone/pull, always re-synced)
  from โย's `cds-consumer` repo for exact component specs and Drift rulings, and defers to กัน's
  `agent-design-kit` repo's real `requirement-intake` tool when a convergence sheet exists. Any
  color/token a theme needs that the DS doesn't have yet gets invented and tagged `New component`,
  never presented as if it were already in the DS. Also writes back to Requirement collections
  as it clarifies a requirement, so the next run benefits. Presentation-mode panel content
  (section headers, card text, rationale) defaults to Thai, since this is the team's working
  language — write in English only if the requester asks for it. When a screen's decision has
  **no supporting research anywhere in the Research index** (not just "reviewed, doesn't apply
  here" — genuinely never covered before), the Research Insight panel flags it distinctly and
  recommends the research team investigate, and the gap gets written onto that requirement's
  User Story leaf in Requirement collections (per the fixed tree `asana-requirement-log` builds),
  scoped to that specific user story, not just left inside the prototype's own panel. Mobile and
  tablet builds get a realistic device bezel with its own internal scroll (mobile 375×812,
  tablet 768×1024 by default — distinct frames, not one scaled generic frame), so scrolling
  behaves like the real device rather than a webpage with a phone graphic on it. Web/desktop
  targets get no device bezel at all.
metadata:
  status: proposal, untested — never run end to end
  mode: mixed
  category: workflow-meta
  sibling_of: ds-governance-prototype-notion (Notion-backed, kept separate — not a replacement)
---

# Prototype Agent (Asana-backed)

> **Status: proposal, not yet verified working end to end.** Composed from Asana-knowledge sources
> that didn't exist as Asana pages until 2026-08-19, plus a Core + project-layer design-system
> model this skill's Notion-backed sibling only partially covered (it only knew about `cds-bbl`,
> and didn't distinguish Core from a project-specific layer). Report back anything that doesn't
> behave as described here so this file keeps getting corrected from what actually happened.
>
> **Corrections from the first real run (2026-08-20, Wealth Dashboard US01):** the requester liked
> the presentation format overall but flagged three things, now folded into Step 4 above — (1)
> Research Insight cards need a source link per report, same as the Requirement summary card; (2)
> a Tone of Voice compare must render both variants in the same language, or the toggle shows a
> language switch instead of a feeling difference; (3) Design System Evaluation collapses to two
> tags, `Reused` / `New component`, not the original six-way split. Everything else in this run —
> the draggable/collapsible chrome, the per-screen panel re-render, the DS A/B and Branding Theme
> toggles, writing back to Requirement collections — behaved as described below.
>
> **This skill never touches Figma.** Output is a prototype in whatever presentation medium the
> tool you're running in produces (e.g. an HTML/web mockup), not a Figma file. Turning it into
> real Figma frames is a later step in the wider Requirement → Applied chain, out of scope here.
>
> **Corrections from the second real run (2026-08-24, Wealth Investment Insight US02):** a
> reviewer measured the published prototype file directly (not from screenshots) and found zero
> references to either DS site, 39 hand-picked hex values (one of which happened to match a CDS
> token by coincidence), no `@font-face`/BBL Sans anywhere, an invented token vocabulary instead
> of the DS's own, and 13 `verify_code` errors — i.e. no design system was actually used, despite
> Step 3's old wording technically permitting exactly that ("using a component means rendering it
> accurately... not placing a Figma instance"). Step 3 now requires installing from the real
> registry, Step 3b adds a mandatory audit/verify gate, and a new section covers the single-file
> Artifact case specifically, since the CSP constraint there was the actual root cause the old
> wording was quietly working around. Treat any future run that skips Step 3b as not done.
>
> **v1.16.0 — the single-file pipeline ran for real (2026-08-24, same US02 rebuild).** Completed
> the pipeline's step 6 (verify what the bundler plugin can't see — icon sprite/font paths
> computed at runtime, not import-time) and documented the token-namespace collision that shows
> up specifically when two DS systems are installed together for a compare build (both above).
> The rebuilt US02 prototype installed real components from both `cds-bbl` and `mbds-bbl`,
> passed a hard-refresh visual check across all 4 screens × both DS variants × both branding
> themes, and published under 16MB with zero remaining external runtime references.
>
> **v1.17.0 — webds elevated to full parity with CDS/MBDS; "exact, real values" made a standing
> default (2026-08-24).** Requester's instruction: from now on, every run of this skill pulls
> component/color/font/token exactly from whichever real DS site(s) are in play — CDS, MBDS, or
> webds — never an approximation, regardless of delivery format. webds
> (`webds-bbl.vercel.app`) had only been mentioned in passing as an "existing project DS" example;
> it now gets the same rule-level treatment as CDS/MBDS: real registry install, own audit.mjs/
> verify_code gate, its two unique caveats (patterns layer is consumer-measured, weaker claim than
> a component — prefer a component when one fits; every component Figma key is served `null` —
> place by name in the official library, never invent a key).

## Why a separate skill, not an edit to ds-governance-prototype-notion

Kept deliberately separate (confirmed with the owner) rather than renamed in place — mirrors the
`ds-governance-audit-notion` / `ds-governance-audit-asana` split already established in this
workspace. The Notion-backed skill still exists and still works against Notion; this one is the
Asana-backed path as the team migrates knowledge sources over.

## Expected input

- **Requirement** (required) — the raw requirement text, or a link to the doc that has it.
  Business input is sometimes complete, sometimes just a one-line ask — either is fine, Step 2
  is what resolves the gap.
- **Design system composition mode** (required — see Step 1) — which of three ways this build
  relates to a project-specific layer beyond Core:
  1. **Core only** — no project layer at all.
  2. **Existing project design system** — reuse an already-built, complete project DS as-is (e.g.
     "MBDS — MB Design System" at mbds-bbl.vercel.app), named/linked by the requester.
  3. **Core + new composed layer** — Core as foundation, this run composes a *new* pattern layer
     specific to this project (the project doesn't already have one; this build is creating it).

  Core (`cds-bbl` + its Figma library) is **always** read regardless of mode — it's not one of
  three choices, it's the fixed base every mode still starts from. Never assume which of the
  three applies just because a project link was or wasn't mentioned — ask if unclear, since modes
  2 and 3 both involve "a project has its own thing" but mean opposite things about where that
  thing comes from (borrowed whole vs. built fresh this run).
- **Compare request** (optional) — supplying **two** project-specific (or theme) links instead of
  one means the requester wants to compare the same prototype under two variants side by side
  (e.g. deciding between a current and a proposed pattern set) — build the A/B toggle described
  in Step 4, not two separate prototypes. Don't assume a compare is wanted unless 2+ links are
  actually given.
- **Tone of voice guide(s)** (required whenever the screen has real copy to write — see Copy
  Writing Guideline below) — which specific guide(s) on that page to use, named. Naming **one**
  (e.g. "MB Writing Style Guide V2") means write every copy decision to that guide, no toggle.
  Naming **two** (e.g. "MB Writing Style Guide V2" vs "Trip Space") means the requester wants to
  compare the same screens' copy under two tones side by side — build the Tone of Voice toggle
  described in Step 4, not two separate prototypes. Ask if not given; never silently pick one,
  blend multiple guides together, or assume a compare is wanted with only one guide named.
- **Branding guide(s)** (required whenever the screen has a real branding decision to make — see
  Bradning Guidline below) — which specific guide(s) on that page to use, named. Naming **two**
  (e.g. "Wealth Sub-brand Visual Identity" vs "Lynxeye x BBL — Digital Rebranding Workshop")
  means the requester wants to compare the same prototype under two branding themes side by side
  — build the Branding Theme toggle described in Step 4, not two separate prototypes. Ask if not
  given; never silently pick one, blend multiple guides together, or assume a compare is wanted
  with only one guide named.
- **Priority note** (optional, defaults to on) — the requirement always wins over design-system
  completeness: a component missing from the DS is never a reason to stop, only a reason to
  placeholder-and-flag (Step 3).
- **No compare wanted** — if the requester has one exact spec in mind and never gave a second
  link/guide for any of the three inputs above (project-layer link, branding guide, tone-of-voice
  guide), don't build any A/B toggle at all. The presentation chrome then shows only the
  Presentation Mode toggle — never add a compare control speculatively "in case it's useful."

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

3. **Requirement collections** — hub gid `1217617725712351`
   (https://app.asana.com/1/1153565613997788/note/1217617725712351). Check for an existing entry
   for this feature/requirement area before asking the user anything in Step 2 — someone may have
   already clarified this. **This is a fixed three-level tree, not a flat index** (logged via
   `asana-requirement-log`): `Requirement collections → Project → Feature/Epic → User Story`.
   `page_get` the hub for the Project link (e.g. "Wealth"), `page_get` that Project page for the
   Feature/Epic link (e.g. "Wealth Dashboard (Web)"), `page_get` that for the User Story leaf
   (e.g. "US01") — the leaf is where the real content (User Story / Acceptance Criteria / Status
   / Clarifications) lives; the Project and Feature/Epic pages above it are just link lists. If
   any level doesn't exist yet for this requirement, that level is simply missing — not an error,
   just means nothing's been logged for it yet. **This skill also writes to the User Story leaf**
   — see "Writing back to Requirement collections" below.

4. **Bradning Guidline** [page title as created, gid unchanged regardless of the typo] — gid
   `1217632285949369` (https://app.asana.com/1/1153565613997788/note/1217632285949369). Same
   shape and same rule as Copy Writing Guideline above — this index holds **multiple distinct
   sources** (logged via `asana-branding-log`: a master guideline file, a vendor workshop deck,
   meeting notes, etc.) — and can include **segment-specific themes** (e.g. a Wealth Branding
   Guide alongside a standard/regular one), not one guideline. **Use only the specific guide(s)
   the user named** (see "Branding guide(s)" input above) — find each named row, open its detail
   page, and apply that guide's rules to any branding decision in the prototype. If the user
   didn't name one, ask — don't guess which row applies or blend several rows' rules together.
   If a named guide isn't on the page yet, say so in the final summary and don't assert
   "on-brand" with nothing real to check it against.

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

7. **Design system — Core always, plus one of three modes for the project layer (see Expected
   input "Design system composition mode" and Step 1).** Core is never optional; what varies is
   whether there's a project layer at all, and if so, whether it's borrowed whole or composed
   fresh.

   - **Core Design System (always read, all three modes)**: https://cds-bbl.vercel.app/, generated
     from the Figma **⭐️ Core Design Library** (fileKey `ON8Azjo7wIi3P2oxnxKiBb`,
     https://www.figma.com/design/ON8Azjo7wIi3P2oxnxKiBb/%E2%AD%90%EF%B8%8F-Core-Design-Library —
     the Overview page, node `31:176`, is a good orientation starting point for a new session).
     If a token/component looks wrong or missing on the live site, this Figma file is the
     upstream source to check before assuming the live site itself is wrong.
   - **Existing project design system (mode 2 only)**: a separate, already-built project DS the
     requester names/links — `webds-bbl.vercel.app` (web) and `mbds-bbl.vercel.app` (mobile) are
     the two real, fully-registry-backed examples confirmed in this workspace (not a fixed list —
     others may exist). Read it the same way as Core: its own live site is the primary authority
     for anything it covers, weighted over Core for its own components (Core still governs
     whatever the project DS doesn't touch). This is a *reused* library, not something this run
     composes. Each publishes the same shape of tooling Step 3 depends on — `<site>/r/registry.json`
     (the index), `<site>/r/components/<slug>.json` (install one), `<site>/audit.mjs` (Step 3b),
     and its own `llms.txt` — so the real-install rule in Step 3 is not CDS-specific, it's the
     same move against whichever site this mode names. **webds carries two things CDS/MBDS
     don't:** a `patterns` layer (composed screen regions — check `list_templates`-equivalent
     pattern search before composing a region by hand, same idea as MBDS's screen templates) that
     is measured against a *consuming* file rather than the library itself (a weaker claim — say
     so, don't call it as certain as a component), and **every component Figma key served as
     `null`** — place a webds component by *name* in the official `🖥️ Core Website Design
     Library`, never by key, and never invent one to fill the Design System Evaluation panel's
     Figma-link requirement.
   - **Newly composed project layer (mode 3 only)**: no separate site to read — this run *creates*
     the project-specific patterns during Step 3, informed by Core, and tags each one
     `New component` in Step 4's Design System Evaluation since nothing pre-existing was reused.
   - Live sites are the freshest, most authoritative source of what's actually real in code right
     now — weight them over Asana/repo sources if the two disagree about whether something
     exists.

## Step 1 — establish the design-system composition

Core is always in play — no need to ask about it. What varies is which of the three composition
modes (Expected input above) this build uses; resolve it explicitly, don't guess:

1. **Core only** — the requester says (or it's clear from context) this project has no pattern
   needs beyond Core. Step 3 checks every component against Core alone.
2. **Existing project design system** — the requester names/links an already-built project DS
   (e.g. "use MBDS," `mbds-bbl.vercel.app`, or "use webds," `webds-bbl.vercel.app`). Step 3 checks
   components against **that project's own site** (and its own repo, if it has one, the same way
   source 5/6 work for Core) as the primary authority for anything the project DS covers — Core
   still governs anything outside it, but this build isn't composing anything new, it's reusing
   what already exists there wholesale. Whichever system this names — CDS, MBDS, or webds — pull
   its real install command, real token names, and real MCP tools (`search_components`,
   `get_component`, `map_props`, `verify_code`) the same way Core does; none of the three is a
   lesser case of the others.
3. **Core + new composed layer** — the requester wants a project-specific layer, but this project
   doesn't have one yet (or isn't reusing another project's) — this run is building it fresh,
   informed by Core. Step 3 checks Core first, and any pattern this build originates for the
   project gets flagged `New component` (Design System Evaluation, Step 4) since it's being
   created here, not pulled from an existing library.

If it's unclear which mode applies, ask — don't infer mode 2 vs. mode 3 from a project name alone
("Wealth" could mean "compose a new Wealth-specific layer" or "reuse the existing Wealth DS if one
already exists"; these are opposite operations that produce different `Reused`/`New component`
tagging in Step 4). This determines what Step 3 checks new/existing components against: Core
alone (mode 1), the named existing project DS (mode 2), or Core with everything project-specific
tagged as newly composed (mode 3).

## Step 2 — clear the requirement before building

Walk Requirement collections (source 3 above) — hub → Project → Feature/Epic → User Story leaf —
for an existing entry on this feature area first. Resolve what you can from the leaf's own
content (User Story, Acceptance Criteria, any prior Clarifications) plus the other knowledge
sources.

**Prefer the real tool over improvising.** If a convergence-sheet JSON exists for this
requirement, run it through กัน's `requirement-intake` (source 6 above) and present its
`single-question-bundle` — only decisions it marks `changes_ui_shape: true`. If no convergence
sheet exists yet, fall back to asking the user directly only for questions that would actually
change the UI's *shape* — same hard gate either way (a prototype built on a wrong shape
assumption wastes the whole downstream chain). Don't ask about every open question, only
shape-changing ones; record non-blocking ones instead of raising them.

**Writing back to Requirement collections:** whether or not you had to ask the user anything,
write the outcome onto the User Story leaf (upsert — read `html_text` first, never overwrite an
existing entry). If the Project and/or Feature/Epic level didn't exist yet, create the missing
level(s) first (same tree-building `asana-requirement-log` uses: create the leaf, link it in from
its parent, create/link that parent from the hub if it was also missing) rather than bolting the
story onto an unrelated branch. Update the leaf's **Clarifications** section specifically — append
a new entry with what's now understood, what was originally ambiguous, and how each ambiguity got
resolved (from existing knowledge vs. asked the user) — never touch the leaf's User Story or
Acceptance Criteria sections, those stay verbatim as originally logged. This is what makes the
next prototype run against the same feature area faster.

**Writing research gaps back to Requirement collections:** whenever Step 4's Research Insight
section flags a genuine research gap (see "Research gap flag" there), also write it onto the
*same* User Story leaf — not a different page, not just the prototype's own panel — so the
research team finds it by browsing Requirement collections per user story, the same place PO/BA
clarifications already land. Add it under a new optional section on the leaf, **Research gaps
flagged** (same pattern as `asana-requirement-log`'s existing optional "Related prototype runs"
section — additive, doesn't touch the leaf's fixed User Story/Acceptance Criteria/Status/
Clarifications sections). Each entry: which screen/decision has no supporting research, dated,
plus a one-line recommendation for what the research team should go find out. Read-then-merge
like every other write to this leaf — append, never overwrite a prior gap entry, and don't
re-list a gap that's already there from an earlier run against the same story.

## Step 3 — build the prototype, DS-first, gaps placeholdered not blocked

Nothing in this step touches Figma. **"Using" a component means installing it from that DS's
real registry — `npx shadcn@latest add <docs-site>/r/components/<slug>.json` (`cds-bbl`,
`mbds-bbl`, or `webds-bbl` — whichever system is in play) — never hand-authoring HTML/CSS that
merely renders close to the DS site's values.** A hand-written twin of a component the DS already
ships is a defect, not an acceptable substitute, no matter how closely its hex/px values were
copied — this is the exact failure cds-bbl's, mbds-bbl's, and webds-bbl's own `llms.txt`/MCP
instructions all call out by name ("writing a component by hand when a registry item exists is
the failure this site exists to prevent"), and copying values by hand cannot follow a mode axis
(theme, density, shape, device, language) the way an installed component bound to real tokens
does. Every installed item pulls in that system's foundation (`cds-foundation` /
`mbds-foundation` / `bbl-foundation` — the full token/class layer and the system's own web font)
automatically; a prototype that has components but no foundation renders unstyled, which is its
own tell that something was hand-drawn instead of installed.

**This is a standing rule, not a per-run judgment call.** Every future run of this skill, on
whichever of CDS, MBDS, or webds is in play, pulls color/font/token/component exactly from that
system's real registry and real live site — never an approximation, never an invented token name
that merely looks plausible, regardless of delivery target (localhost dev server, single-file
Artifact, or anything else). The delivery target changes *how* the real values reach the output
(see "When the deliverable is a single HTML file / Artifact" below for the Artifact case); it
never changes *whether* they're real.

Before writing any UI for a screen, call that DS's `search_components` (`list_templates` for
MBDS's whole-screen templates, `get_pattern`/pattern search for webds's screen-region patterns —
remember webds patterns are consumer-measured, a weaker claim than a component, so prefer a
component when one fits) — the piece you need may already exist. Never write a literal color,
spacing, radius, or font-family value in code that's presented as this DS; every value must
resolve to that system's own token/class. If the deliverable format makes a real install
physically impossible at runtime (see "When the deliverable is a single HTML file / Artifact"
below) — that is a delivery-format constraint to solve, never a license to hand-author a look-alike
component instead.

For each screen/section the requirement implies:

1. **Component exists** (governing DS site, or `cds-consumer`'s `COMPONENTS.md`/`REGISTRY.md` —
   source 5 above, preferred when the two disagree) → install it from the registry and use it with
   real props/variants; don't redraw it even if the DS site's values are fully known.
2. **Component doesn't exist yet** → check `cds-consumer`'s `DRIFT.md` first — an owner may have
   already ruled this a deliberate difference, not a real gap. If it's still a genuine gap, mock
   it up freehand, clearly labeled as a placeholder in the prototype's own annotations — never
   let a placeholder look indistinguishable from an accurately-rendered real component to
   whoever reviews this next.

The requirement is the priority throughout — a screen that's mostly real-DS with some flagged
placeholders, shipped on time, is the correct outcome, not a reason to stop and wait.

**Device frame for mobile/tablet viewports.** When the target viewport is mobile or tablet (not
desktop/web), wrap the rendered screen in a realistic device bezel sized to that viewport — a
fixed-size frame with its own internal scroll, not the full page scrolling. This is what makes
scroll behavior in the walkthrough feel like the real device instead of a webpage with a phone
graphic pasted over it: the frame's height stays fixed to the viewport, and content taller than
that scrolls *inside* the frame. Don't build one generic "phone-ish" frame for both — a tablet
frame is wider/shorter-relative-to-width than a mobile one, and shouldn't just be a scaled-up
phone.

Default frame sizes (use these unless the requester states a different target device):
- **Mobile**: 375×812 (iPhone-standard portrait).
- **Tablet**: 768×1024 (iPad-standard portrait).
- **Web/desktop**: no device bezel at all — render the screen plainly (rounded card or full
  layout as the design calls for), same as before this device-frame behavior existed. "Web" isn't
  a device frame variant, it's the absence of one.

If the target viewport isn't stated, ask rather than assuming mobile by default. If the requester
names a specific device or size that differs from the defaults above (e.g. a specific tablet
model), use theirs instead of the default.

## Step 3b — verify before calling it done (do not skip)

Before presenting any screen as "built with CDS" or "built with MBDS," run that system's own
audit, and fix everything it flags before moving on — never report a run as done with an open
`error` finding:

```
curl -sO https://cds-bbl.vercel.app/audit.mjs && node audit.mjs .
```
(swap the host for `mbds-bbl.vercel.app` or `webds-bbl.vercel.app` when the screen is
MBDS-/webds-governed). Exit code 1 means defects — fix them, don't narrate around them; every
check it runs is one a reader can't perform just by looking at the screen (in practice this audit
script is single-system-aware — it can misflag another installed system's own correctly-installed
files as "modified"/"collision" purely from name coincidence, since it doesn't model that a
second DS is present; read every flag before treating it as a defect, but don't use that as an
excuse to wave away a real one). Then run that system's `verify_code` MCP tool against the actual
code/markup you're about to present, on every screen, for every DS variant a compare toggle
builds (CDS, MBDS, and webds each get verified separately — one clean pass doesn't clear the
others). Treat
any `severity: "error"` finding as a defect to fix, not a note to mention in the summary and move
past. A finding that's only in the token-*definition* layer itself (the literal values a
foundation file states once, by necessity) is not a defect — only flag genuine consumer-code
violations as blocking.

## When the deliverable is a single HTML file / Artifact

An Artifact page runs under a CSP that blocks every external host except Google Fonts — it
cannot fetch CSS, fonts, or a shadcn registry from `cds-bbl.vercel.app` / `mbds-bbl.vercel.app` at
runtime, and there is no build step available inside it for `shadcn` to run against. **This is a
delivery-format constraint, not a license to fall back to hand-authored look-alike CSS** — Step 3
above still applies in full. The correct sequence when the target is one self-contained HTML file:

1. Build the screen as a real Vite + React project outside the artifact sandbox (a scratch
   directory, not the artifact's own file).
2. Install every component from the real registry (`npx shadcn@latest add
   https://cds-bbl.vercel.app/r/components/<slug>.json`, same for `mbds-bbl.vercel.app` and
   `webds-bbl.vercel.app`) — this pulls in the real foundation and the real component code,
   unmodified.
3. Inline the system's web font(s) as `data:` URIs in place of the `url(...)` references the
   foundation's font CSS ships with (BBL Sans is ~14 font files / ~620KB total as of this
   writing — check the actual foundation CSS for the current count before assuming that number
   is still right).
4. Inline whatever the components fetch at runtime rather than importing statically — e.g. CDS's
   `Icon` component fetches an SVG sprite per size from `/cds-icons/sprite-<size>.svg`; inline
   those sprites and shim `window.fetch` to answer with the inlined sprite instead of hitting the
   network, so the icon fetch resolves inside the sandbox instead of silently failing.
5. Build with `vite-plugin-singlefile` (or equivalent) so the whole app — markup, styles, fonts,
   icons — collapses into one HTML file with no external references left.
6. **Verify before publishing, don't assume the plugin caught everything.** `vite-plugin-singlefile`
   inlines the built JS/CSS but does nothing about assets a component fetches by a *runtime*
   string path (e.g. CDS's `Icon` sprite fetch, MBDS's `BblIcon` mask-image pointing at
   `/bbl-icons/<name>.svg` from `public/`) — those are invisible to it because they're computed
   in the browser, not imported in source. `grep` the built HTML for the DS's font/asset hostnames
   and for the icon base path; anything still there needs its own inline step (a small
   generated `icon-data-uris.ts`-style map read by the two or three call sites that actually
   reference it, keyed only for the names this build really uses — not the whole icon set).
   `<script type="module">` does not need stripping — it runs fine inside the Artifact sandbox;
   confirmed by actually loading the built file in a browser and checking
   `read_console_messages` for errors before publishing, not by assuming a clean build log means
   a clean runtime. Serve `dist/` with a plain local static server (e.g. `python3 -m http.server`)
   to preview it — `file://` URLs are blocked by browser automation tooling.

**Two DS systems installed in the same project (a DS A/B compare build) will collide on token
names unless scoped.** CDS and MBDS each publish their own `:root { --surface-neutral-primary: ...;
... }` block, and where both systems happen to use the same token name (they do, for several —
apparently by convention, not coordination) the one whose CSS is textually later in the merged
stylesheet silently wins for *both* systems' components, because custom properties inherit down
the DOM regardless of which system's file declared them. Fix by re-targeting each system's own
`:root` (and `.dark`, if used) to a scoping class instead — `.ds-cds { ... }` / `.ds-mbds { ... }`
— and mounting each system's rendered subtree inside a wrapper carrying that class. This is a
selector-only edit (never touch a token's value) and does not require editing any component file,
since CSS custom properties still cascade to descendants same as `:root` did. Do this before
wiring up the compare toggle, not after noticing one system's colors bleeding into the other's.

Never skip straight to writing CSS that merely *looks like* the DS because this pipeline is more
work than the CSS trick — the CSS trick is exactly the defect Step 3 forbids, and looking like
the DS is not the same as being built on it (wrong tokens under a real theme/density/shape mode
switch, missing type-scale classes, wrong font actually loaded, etc. — see the "no design system
at all" finding this section exists to prevent). If the pipeline above is genuinely infeasible for
a given request, say so plainly to the requester and ask before falling back to anything else —
don't decide unilaterally that hand-authored CSS is an acceptable substitute.

## Step 4 — presentation mode, per-screen dynamic panel, up to three optional compare toggles

Build a walkthrough view (or whatever presentation surface the tool you're running in supports)
with a **presentation-mode toggle** (chrome control, off by default so the initial view is the
clean product surface) that reveals the side panel. The chrome itself is a single draggable,
collapsible control bar — a grip so the requester can move it out of the way of whatever screen
area they're looking at, and a collapse button so it can be shrunk to just the grip when not
needed — not a fixed strip pinned in one corner. The panel's content **changes per screen** —
this is the specific fix this skill exists to make over the static single-panel pattern seen
elsewhere. Concretely:

Up to three independent optional toggles can appear in the same chrome control, each only when
its own compare request was actually made — never add one speculatively, and never skip one that
was actually requested:

- **Design System A/B toggle** — if the requester gave two project-layer/theme links (Expected
  input above). Swaps the rendered screen's project-layer tokens (color, radius, type, whatever
  each link actually defines) between the two, on top of the same Core base both times — same
  screens, same content, same Core, different project layer. Build this as a real token swap
  (e.g. a `data-ds` attribute driving a second CSS token block sourced from the second link's
  actual values), not a second copy of the prototype.
- **Branding Theme toggle** — if the requester named two branding guides (Expected input above),
  e.g. comparing a Wealth sub-brand identity against another named identity. Swaps the same
  screens' branding-driven visual identity (colors, imagery treatment, whatever that guide's
  rules actually cover) between the two named guides — same screens, same content, same
  Core/project DS, different branding theme. If a theme's guide calls for a color/token that
  doesn't exist in the DS yet, invent it rather than blocking — but tag it `New component` in that
  screen's Design System Evaluation (below), never let an invented brand color look like it came
  from the DS.
- **Tone of Voice toggle** — if the requester named two tone-of-voice guides (Expected input
  above). Swaps every real copy decision on the current screen (labels, headings, error/empty
  states, CTAs) between the wording each named guide produces — same screens, same layout, same
  DS, different words. **Both variants must be written in the same language.** The toggle exists
  to show a *feeling* difference (formal vs. casual, terse vs. warm) — if one variant is English
  and the other is Thai, the comparison shows a language switch instead, and the actual tone
  contrast is invisible. Pick whichever language the screen's copy is naturally in and write both
  variants in it, even if a named guide's own examples lean toward one language (e.g. a Thai-heavy
  quick guide like Trip Space still has to be matched by an equally-Thai formal variant, not by
  falling back to English for the formal side just because the house style guide's own body text
  is in English). Independent of the Branding Theme toggle: a tone compare can be requested
  alone, a branding compare can be requested alone, or both together (they commonly pair — e.g. a
  Wealth branding theme paired with a more formal guide, a second identity paired with a more
  casual one — but the skill builds whichever toggles were actually requested, never assumes a
  pairing that wasn't named).

If none of the three were requested, the chrome shows **only** the Presentation Mode toggle — the
requester gets one exact build with nothing to compare, per "No compare wanted" in Expected input.

- Keep a per-screen data structure (screen id → that screen's own insight cards / DS rows), built
  from Steps 1–3's knowledge as it actually applies to *that* screen — not one global list reused
  everywhere.
- When the user switches screens in the prototype, re-render the panel's sections from that
  screen's own data — don't just toggle screen visibility and leave the panel untouched.
- An insight that genuinely applies to the whole flow (not one screen) goes in its own
  "Flow-wide" group so it isn't lost when switching screens, rather than being duplicated
  identically into every screen's section.

**Language:** write the panel's section headers, card titles, summaries, and rationale in
**Thai by default** — this is the team's working language, and the panel is read by BU
stakeholders in a walkthrough, not just designers. Use English only if the requester specifically
asks for an English build (e.g. for an audience that doesn't read Thai). Copy actually rendered
on the product screen still follows whatever the named tone-of-voice guide specifies — this
Thai-default is about the panel's own explanatory text, not a rule to translate the product copy.

Panel section order, top to bottom:

1. **Requirement summary** — the one section that stays **constant** across every screen (it
   describes the build as a whole, not one screen). One card: what's being built and why, in
   plain terms, paraphrased from Step 2's resolved requirement — link to the Requirement
   collections detail page this run wrote/updated. If the requirement was never formally logged
   there, say so in the card rather than presenting an informal paraphrase as if it were.

The remaining four sections are **per screen** — when the viewer clicks between screens in the
prototype, re-render all four from that screen's own data, not just toggle screen visibility and
leave the panel untouched:

2. **Research Insight** — cards with: title, summary, and an explicit *why this design does /
   does not yet address it* line (cite the specific finding, not "informed by research" in the
   abstract). Include what was reviewed and judged not applicable to this screen, not just what
   was used. **Every card links back to the specific Asana research report(s) it draws on** —
   same pattern as the Requirement summary card's link to its Requirement collections page, not a
   citation you have to take on faith. A card built from more than one report links every one of
   them; a "reviewed, not applicable" card still links the report it reviewed. An insight that
   genuinely applies to the whole flow (not one screen) goes in its own "Flow-wide" group so it
   isn't lost when switching screens, rather than being duplicated identically into every screen's
   section.

   **Research gap flag — distinct from "reviewed, not applicable."** If a screen's decision has
   genuinely nothing in the Research index that speaks to it at all (not "something exists but
   doesn't apply here" — this specific kind of question has never been covered), don't quietly
   tag it `New component` in the DS Evaluation and move on without surfacing the gap. Show a
   visually distinct card in
   this section — different treatment from a normal insight card, e.g. a "🔬 ยังไม่มีข้อมูลวิจัยรองรับ"
   flag — naming the specific decision that's unsupported and recommending the research team
   investigate it. Then write that same gap onto the requirement's **User Story leaf** in
   Requirement collections (see "Writing research gaps back to Requirement collections" below) —
   the panel flag alone isn't enough, the research team needs to find it from Requirement
   collections too, not just from inside a prototype they may never open.
3. **Branding** (its own section, placed directly above Design System Evaluation) — for every
   real branding decision on this screen, cite the specific rule from the *named* branding
   guide(s) (e.g. which one(s) the user pointed to on the Bradning Guidline page) that it follows
   — never a vague "on-brand." If the Branding Theme toggle is active, this section's content
   swaps with it. If no guide was named for this run, this section says so plainly instead of
   asserting brand-compliance with nothing real behind it.
4. **Design System Evaluation** — every element on this screen tagged one of exactly two values:
   `Reused` (a real DS component, in Core or the project layer) or `New component` (anything else
   — freehand-built because no DS component covers it, an invented token a branding theme called
   for, copy-only content, a one-off layout adjustment). Don't split `New component` further into
   variant/token/assumption/content/adjustment sub-tags — two tags is the whole vocabulary. Per
   screen, not one flow-wide list. **Every `Reused` row gets a Figma link** to the actual component
   (resolve the real node via the Figma tools' `search_design_system`/component lookup against the
   governing DS's own library file — don't just link the library file's root, link the specific
   component/node). `New component` rows have no Figma component to link to — leave them without a
   link rather than linking something unrelated.
5. **Copywriting** (its own section, placed after Design System Evaluation) — for every real copy
   decision on this screen (labels, headings, error/empty states, CTAs), state the wording chosen
   and cite the specific rule from the *named* tone-of-voice guide (e.g. "MB Writing Style Guide
   V2") that it follows — never a vague "per guidelines." If the Tone of Voice toggle is active,
   this section's content (and the copy actually rendered on the screen) swaps with it. If no
   guide was named for this run, this section says so plainly instead of pretending copy was
   guideline-checked.

## Final chat summary

- Which design-system composition mode this build used — Core only, an existing project DS
  reused (name it), or a new project layer composed fresh — and whether the mode had to be asked
  (Step 1) — plus which tone-of-voice guide(s) were used for copy and which branding guide(s)
  were used for branding decisions (name both if a Tone of Voice or Branding Theme compare was
  built), if either applied.
- Which of the three optional compare toggles (Design System A/B, Branding Theme, Tone of Voice)
  were built, if any — and confirm explicitly when none were, so it's clear the requester got one
  exact build and not an accidentally-omitted compare.
- Requirement questions resolved, and how each was resolved — from existing knowledge (including
  what Requirement collections already had) vs. asked the user (Step 2), plus confirmation that
  the resolution was written back to Requirement collections.
- Screens built, and for each: real-DS component count vs. placeholder count.
- Any research gaps flagged (Step 4's Research Insight "gap flag") — which screen/decision, and
  confirmation each was written onto the requirement's User Story leaf under Research gaps
  flagged, so the research team can pick them up from Requirement collections.
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
