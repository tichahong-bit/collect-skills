---
name: ds-governance-prototype-asana
version: 1.24.0
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
  mode opens a draggable chrome bar collapsed by a single `›`/`‹` icon-button (not an on/off
  toggle switch — the toggle switches are reserved for the live Branding/Tone/Design-System
  dimension switchers, see below); its side panel always leads with a constant Requirement
  summary, then per-screen sections that change as the viewer clicks between screens: Research
  Insight, UX Rationale, Branding, Design System Evaluation, Copywriting (in that order). Every
  Branding/Tone-of-Voice/Design-System dimension that has more than one real named option — even
  just one named guide plus the DS/Core baseline — gets a **live switcher** in the chrome, not
  gated behind an explicit "build me a compare" request the way earlier versions required; the
  old strict two-names-given rule now only governs whether the *panel text* frames it as a
  requested formal comparison versus an open exploration aid. Research Insight, Design System
  Evaluation, and UX Rationale rows are clickable — clicking one highlights (and scrolls to) the
  actual on-screen element it refers to, a **focus interaction**, not just a citation link. A new
  **UX Rationale** section cites the Design Knowledge Asana tree for layout/interaction/AI-output
  principles behind a screen's structural decisions, distinct from Research Insight (user-behavior
  evidence) and Copywriting (tone/wording rules) — same click-to-source, click-to-highlight
  discipline as the other cited sections, and the same honesty rule: say plainly when nothing in
  Design Knowledge actually covers a decision rather than inventing generic rationale. Every
  Research Insight card links back to the specific Asana research report(s) it cites, the same way
  the constant Requirement summary card links to its Requirement collections page — so a reader
  can always open the source, and a card that draws on more than one report links all of them.
  Design System Evaluation is a **flat, per-component table**, not a per-context-row list — one
  row per real component actually used on the currently-selected design, each with the component
  name, a link to its CDS docs page, a link to its real Figma node (sourced from the **Core
  Design System Library (Inventory)** Asana project, never invented), and one of exactly four
  Implementation Status values: `Shipped in Code`, `Figma Only / Not Yet Shipped`, `Design System
  Gap`, or `To Be Verified` — a genuine gap (no Figma set and no code at all) is a different claim
  than something drawn in Figma but not yet coded, which is different again from an Asana
  inventory row that's gone stale against what the live CDS site actually ships; check the live
  site/registry before trusting either source blindly, and mark `To Be Verified` rather than
  guessing when neither source resolves cleanly. Optionally, when the requester asks for a fresh
  layout exploration on a screen, build a genuinely different **Design Option 1** for that screen
  (never a relayout of the same grid) alongside the original, and add a **Design Option switcher**
  (Original ↔ Option 1) to the chrome, scoped to that screen — the Evaluation table then reflects
  whichever design option is currently selected. Also pulls (git clone/pull, always re-synced)
  from โย's `cds-consumer` repo for exact component specs and Drift rulings, and defers to กัน's
  `agent-design-kit` repo's real `requirement-intake` tool when a convergence sheet exists. Any
  color/token a theme needs that the DS doesn't have yet gets invented and tagged `Design System
  Gap`, never presented as if it were already in the DS. When a Design Option is requested for a
  multi-screen flow (not a single isolated screen), ask whether it's **screen-scoped** or
  **system-wide** before building — a system-wide direction needs exactly one switcher driving
  every screen and every piece of chrome (nav, modals, top bar) together, never independent
  per-screen toggles that could disagree with each other; see "Design Option scope" under Step 4.
  When a requester hands over an external reference (another file, another tool's output) and asks
  this build to match it, resolve explicitly whether they mean its **layout/structure** or only its
  **functional shape** — matching layout while still sourcing every number, label, and color from
  this build's own real data and real DS tokens is a normal, common request, not a violation of the
  DS-first rule, so never assume "reference" means "content/journey only, redraw the layout" by
  default; ask if it's not stated. Giving a Design Option its own visual identity should reach first
  for a **real token-family swap** (e.g. CDS's own Blue accent vs. Purple accent, scoped via a
  wrapper class that remaps only the semantic `action`/`accent` tokens) rather than a full light/dark
  theme swap — a theme swap changes far more surface area at once and is easy to leave a real
  contrast defect in (a background or text color resolving outside the theme's own scope); if a
  theme swap is genuinely what's wanted, measure actual rendered contrast (real computed colors, WCAG
  2.1 relative-luminance ratio, not a visual guess) before calling it done. When this build's own
  agents run as background forks, treat every fork's self-report as a claim, not a fact — see
  "Fork orchestration and independent verification" after Step 3b. Also writes back to Requirement collections
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
  status: in active use — corrected across 9+ documented real runs, see version history below
  mode: mixed
  category: workflow-meta
  sibling_of: ds-governance-prototype-notion (Notion-backed, kept separate — not a replacement)
---

# Prototype Agent (Asana-backed)

> **Status: in active use, corrected from real runs.** Composed from Asana-knowledge sources
> that didn't exist as Asana pages until 2026-08-19, plus a Core + project-layer design-system
> model this skill's Notion-backed sibling only partially covered (it only knew about `cds-bbl`,
> and didn't distinguish Core from a project-specific layer). By v1.22.0 this has run end to end
> across 10+ documented real builds (see the version history below) — every entry is a real defect
> or a real requester correction, not a hypothetical. Report back anything that doesn't behave as
> described here so this file keeps getting corrected from what actually happened.
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
>
> **v1.18.0 — fixing a broken, not-owned artifact means rebuild-and-replace, not
> patch (2026-08-24, US01 Wealth Dashboard rebuild).** The requester pointed at a
> prototype that turned out to be shared with them, not owned by them — the
> artifact tool cannot fetch its source or republish a fix to that URL in that
> case. There was also no separate source file anywhere (the artifact was the
> only copy), and the build predated v1.15.0's real-component-install rule, so
> it likely carried the same defect that rule exists to prevent. The only real
> fix was a full rebuild on the current skill version, published as a new
> artifact, with the Requirement collections leaf's "Related prototype runs"
> updated to add the new link and mark the old one superseded — never deleted,
> so the history of what changed and why stays intact. Two more corrections
> from the same rebuild: (1) a Core component reused to fill a gap on an
> MBDS-governed screen needs its own local `.ds-cds` scope to render with real
> CDS token values — folded into the token-collision section below; (2) a
> branding color was previously guessed from a segment's general feel (gold
> for a "premium" sub-brand) rather than read from the actual guide, which
> documents gold as reserved for physical/printed materials only — the digital
> treatment is a grey/white monochrome. Read the named branding guide's actual
> color rules before applying one, never infer a color from what a brand
> "seems like."
>
> **v1.19.0 — presentation mode becomes an exploration tool, not just a report
> (2026-08-25, Staff portal for tablet run).** After reviewing a finished v1.18.0-era build, the
> requester asked for four changes, all folded in above: (1) the chrome's Presentation Mode
> control was an on/off toggle switch — replaced with a single `›`/`‹` collapse icon-button, since
> a toggle implied a binary the requester never wanted (the panel collapsing to just the grip was
> already the "off" state in spirit, the switch was redundant chrome); (2) Branding/Tone/Design
> System were only ever switchable when the requester had explicitly asked for a formal two-name
> compare at build time — the requester wanted to explore live even with only one named source
> (or none) on record, so these are now standing switchers whenever more than one real state
> exists to show (a single named branding guide vs. the CDS baseline already counts as two
> states), and the old two-names rule now only decides whether the *panel prose* calls it a
> requested comparison; (3) panel rows were citations only — clicking a Research Insight or DS
> Evaluation card did nothing on the actual mockup, so a reviewer had to manually hunt for what a
> card was talking about. Added a focus interaction: every clickable row now also highlights and
> scrolls to its real on-screen target; (4) a new **UX Rationale** section, sourced from the
> Design Knowledge Asana tree (gid `1217629510106645`) rather than the Research index — layout
> grid rules, AI-output-trust caveats, and similar design-principle evidence are a different kind
> of citation than a user-behavior research report or a copywriting rule, and didn't have a home
> in the four sections v1.18.0 shipped. Same click-to-highlight discipline as Research Insight and
> DS Evaluation, and the same refusal to invent rationale when Design Knowledge genuinely has
> nothing on a decision (most of that tree was still empty placeholders when this version shipped
> — say so per-screen rather than padding with generic UX platitudes).
>
> **v1.20.0 — Design System Evaluation becomes a real component inventory, and layout
> exploration gets a standing shape (2026-08-25, Staff portal for tablet run).** Two changes,
> both from the same request: (1) the requester pointed out that describing a screen's DS
> evaluation by its *context* ("my portfolio uses these tokens/patterns") is less useful than
> listing the **actual CDS components used**, each traceable to its real docs page and its real
> Figma node — Design System Evaluation is now that flat table, and the two-tag `Reused`/`New
> component` vocabulary is retired in favor of four states that distinguish "not shipped yet" from
> "doesn't exist in Figma either" from "the tracking source itself might be wrong," which the old
> two tags couldn't say. The **Core Design System Library (Inventory)** Asana project (knowledge
> source 9 below) is the real source for Figma links — never invented, and checked against the
> live CDS site rather than trusted blindly, since several of its rows (Tab, Toggle Switch, List
> Item, Popover, Dialog, Menu, confirmed this run) were stale against what CDS actually ships
> today. (2) the requester asked for a genuinely fresh second layout for a screen — not a token
> swap, an actual different information architecture — compared live against the original via a
> new Design Option switcher, scoped to whichever screen it was built for. This is an *optional*
> capability, requested per-screen, not a standing expectation every run builds a second layout
> for.
>
> **v1.21.0 — a Design Option can be system-wide, not just per-screen; adopting a reference's
> layout is a normal request, not a rule violation; accent-swap over full-theme-swap; fork
> self-reports are claims, not facts (2026-08-26, Staff portal for tablet run, several
> iterations).** Five corrections from one long build, folded in above and into Steps 3–4:
>
> 1. **Design Option scope.** v1.20.0's Design Option switcher was written screen-scoped only. This
>    run started that way (a separate switcher per screen) and the requester explicitly rejected
>    it: *"Original vs Option A = คนละ Design Direction ของทั้ง System / End-to-End Flow ไม่ใช่
>    Page-level variation"* — two independent screen-level toggles can disagree with each other
>    (one screen showing the "old" direction while another shows the "new" one) and don't read as
>    one coherent alternative product experience. Fixed by collapsing to one global state variable
>    driving every screen **and every piece of chrome** — sidebar, top bar, and any modal shared
>    across screens — together, in one action. **Now ask explicitly, before building, whether a
>    requested Design Option is screen-scoped or system-wide** whenever the flow has more than one
>    screen; don't default to screen-scoped just because that's what v1.20.0 shipped first.
> 2. **A Design Option's own auth/interaction mechanism can genuinely diverge, not just its skin.**
>    The requester asked for Option A's passcode entry to use real keyboard-typable digit boxes
>    (matching a reference) while Original kept its original on-screen numpad — the same success/
>    error/outcome, but a different *input mechanism* per variant, both declared unconditionally
>    (React Hooks — or the equivalent in whatever framework — cannot branch which handlers exist,
>    only which branch renders). Don't assume a Design Option only ever means a visual reskin of a
>    shared mechanism; ask if a flow has an interaction (auth, entry, confirmation) where the two
>    variants might genuinely want to work differently, not just look different.
> 3. **Adopting an external reference's layout is a normal, explicit request — not something to
>    silently narrow to "content/journey only."** The requester supplied an external HTML file and
>    asked this build to match its exact tab structure/IA, while still sourcing every stat, label,
>    and color from this build's own real data and real DS tokens (never the reference's own
>    invented numbers or hand-picked colors). The Expected input section previously implied a
>    reference screen is read only for its functional shape, never its layout — that's now
>    corrected: resolve explicitly which the requester means (ask if unstated), since matching
>    layout-while-resourcing-content-and-tokens-for-real is a completely normal, common ask.
> 4. **Redesigning an interaction should reach for the codebase's own established richer patterns,
>    not just the nearest simple primitive.** First pass at redesigning a Customer/Staff switcher
>    used a plain on/off toggle — functionally correct, but the requester asked for something with
>    a genuinely better experience, and a bare toggle only communicates "on/off," not "what." Fixed
>    by reaching for a pattern already used elsewhere in the same build (Popover + Menu, showing
>    both destinations with icons and descriptions) instead of inventing a new one — when a
>    redesign request lands, check what richer pattern already exists in this codebase for a
>    similar decision before defaulting to the simplest matching primitive.
> 5. **Fork orchestration and independent verification is now a named, standing discipline** (its
>    own section after Step 3b) — a background fork's own "done, verified, published" self-report
>    is a claim to check, not a fact to relay to the requester; a real component-layout bug (a CDS
>    `Tab` not stretching inside a `flex:1` wrapper) and a real WCAG contrast failure (a background
>    color resolving outside its intended theme scope) were both found this run by measuring the
>    live DOM directly (`getBoundingClientRect`, `getComputedStyle`, a real luminance-based contrast
>    formula), not by trusting a screenshot or a fork's report. Also covers redirecting/stopping a
>    fork mid-flight the moment direction changes, and never letting two forks touch the same files
>    concurrently.
>
> **v1.21.1 — pull a component's full real context (guidance/gaps/color-context), not just enough
> props to render it (2026-08-26, same run, immediate follow-up).** Two more real defects surfaced
> right after v1.21.0's fixes shipped: a `Text Field` used with only the props needed to render
> (missed its own declared "Has Start Icon" gap and its aria-label-only guidance path), and a `Tab`
> used with `color="Neutral"` on a `#f5f5f5` surface where `Neutral`'s own selected-pill token is
> that identical grey — the tab's own guidance already names the correct variant
> (`On Neutral Secondary`) for that surface. Folded into Step 3 as a standing rule: call
> `get_component` and actually read its guidance/gaps before finalizing usage, every time, not just
> at first install.
>
> **v1.22.0 — Dark theme is a real, standing mode axis with its own class of token-pairing bugs;
> Presentation chrome defaults to theme-independent; floating chrome must not silently eat clicks;
> settings switchers default to the lightest correct treatment (2026-08-27, Staff portal for
> tablet run, third build phase on the same project).** Five corrections, the first being the big
> one — a whole category of dark-mode bug this skill had no guidance on at all:
>
> 1. **New standing section "Dark theme" (after Step 3b)** — CDS ships a real
>    `[data-theme='dark']` token block, and dark mode is a real, requestable mode axis like density
>    or shape, not a cosmetic afterthought. Two distinct real-bug classes found only by measuring
>    actual computed contrast across every screen, not by eyeballing one: (a) a token whose name
>    says "inverse" (e.g. `surface-neutral-primary-inverse`) can deliberately *flip which theme it
>    reads as dark* — it's dark-navy in light mode and near-white in dark mode, by design, so an
>    "always-dark chrome" component (a sidebar, a status bar) built on it needs paired text/border
>    colors from that same token's own matching `-inverse` content/border family, never a hardcoded
>    `rgba(255,255,255,X)` literal that quietly assumed the surface stays dark forever; (b) CDS's
>    `surface-accent-*` and `surface-{positive,negative,warning}-primary` tokens stay a fixed light
>    pastel across BOTH themes, while the plain `content-{success,danger,warning,brand,accent-*}`
>    tokens they look naturally paired with actually flip lighter under dark theme (built for the
>    app's own now-dark canvas, not for these always-light tinted cards) — CDS ships the correct
>    non-flipping pair for exactly this (`content-{x}-on-{x}-primary`, `content-accent-on-accent-
>    {color}`); use those for any text/icon sitting on a status-tinted or accent-tinted card,
>    never the plain semantic content token. One real build had this exact bug recur independently
>    in 8+ unrelated files (sidebar nav, dashboard schedule/checklist/churn/leaderboard cards, a
>    passcode-error state, a stat-card row, a tone pill component) once actually swept — this is
>    systemic, not a one-off, so a dark-mode build isn't done after fixing the first instance
>    found. **Standing rule: after implementing/touching dark mode, run an actual computed-contrast
>    sweep (WCAG relative-luminance ratio, real `getComputedStyle`, every screen/state) before
>    calling it done — a component can pass on one screen and fail the identical token pairing on
>    another because the two sit on differently-behaving surfaces.**
> 2. **The Presentation-mode chrome defaults to one fixed theme, independent of the product
>    screens' own theme toggle**, unless the requester asks otherwise. Real feedback this run:
>    dark mode should apply to the product being reviewed, not to the reviewer tooling around it —
>    a fixed light background reads easier for the panel regardless of what the screens underneath
>    are doing. Implementation: pin `data-theme="light"` on the chrome's own root node so it
>    re-resolves CDS's real light-token block regardless of the app-level theme state, rather than
>    inheriting it. Ask if the requester wants the chrome to follow the app theme instead — don't
>    assume it should by default.
> 3. **A floating/draggable chrome must not silently intercept clicks over the product below it.**
>    A `position:fixed` wrapper using column-flex + `alignItems:'flex-end'` to right-align children
>    of different widths shrink-wraps its own hit-testable box to its WIDEST child — the empty
>    space beside a narrower child still blocks pointer events to whatever's underneath, even
>    though nothing paints there. This one was invisible from every screenshot; only found by
>    `document.elementFromPoint` returning the chrome's own wrapper div instead of the sidebar
>    button underneath it, after clicks silently did nothing for several turns. Standing fix:
>    `pointerEvents:'none'` on the outer wrapper, `pointerEvents:'auto'` on each real visible child
>    (the collapsed pill, the dimension bar, the panel) — never on the shared outer box.
> 4. **A plain two-option settings row defaults to the lightest correct treatment** — a label plus
>    a real `ToggleSwitch`, the active side in emphasized text, not a heavier paired-card affordance
>    (e.g. CDS's `Card Container` with a separate "SELECTED" caption) unless the requester's own
>    reference specifically shows cards. This run built the heavier card treatment first (a
>    reasonable reading of a reference mockup), and the requester asked to simplify it once they
>    saw it live — "มีแต่ text แล้วเลือก toggle เอา." Default to minimal for plain either/or choices;
>    reach for a heavier component only when the content genuinely needs more than a label (a
>    sublabel, an icon, a preview).
> 5. **A single-file Artifact's real cold-load time can be 10–20+ seconds** for a build with a full
>    component tree plus an inlined web font (~2MB is normal) — this is expected sandboxed-iframe
>    load time, not a broken build. Repeated quick checks (a few seconds' wait, then a screenshot)
>    mistook a still-loading page for a crash multiple times in a row this run. Give it real time
>    before concluding a publish is broken, and when a render failure is still genuinely suspected,
>    verify with a non-destructive on-page error overlay (`window.addEventListener('error', ...)` +
>    a `try/catch` around the root render call, both writing any caught error directly into a
>    visible DOM node) rather than relying on browser-extension console tools — those only capture
>    the top-level wrapper page's console, not the artifact's own sandboxed content iframe, so a
>    real crash inside the iframe can read as "zero console errors." Separately: republishing to an
>    artifact URL this session hasn't freshly `read` in the current turn can be refused ("identical
>    content already refused, resent unchanged") even when the new content is a real superset of
>    changes — call `Artifact action:"read"` on the target URL once before retrying a publish that
>    was just refused, don't just resend the same call.

> **v1.23.0 — knowledge sections must trace to what a fresh traversal actually finds, an
> explicit single-theme instruction beats the default switcher heuristic, and Copywriting must
> cite a source link and match the literal rendered string (2026-08-28, Staff portal for tablet
> run, fourth build phase on the same project).** The requester's own audit this run found the
> panel's Research Insight and Branding sections showing effectively nothing real, and asked "why
> isn't Presentation Mode showing the knowledge that should have informed this design" — the root
> causes were three distinct things, not one bug:
>
> 1. **A "no evidence for this decision" gap-flag list is not the same field as the real Research
>    Insight list, and must never be the only thing a screen's Research Insight section renders.**
>    A prior run's per-screen data had exactly one `research` array per screen, populated only
>    with decisions *lacking* research backing (correctly labeled "🔬 ยังไม่มีข้อมูลวิจัยรองรับ") — so
>    even though the real Research index had genuine, on-topic reports the whole time, the section
>    never had a field to put a real finding in, and looked "broken" despite the gap-flag rule
>    itself working exactly as designed. Fix: keep two separate arrays per screen — real
>    `researchInsights` (Insight / Applied to Design / Source, only ever populated from a report
>    actually read this run) and the gap-flag list (decisions with no backing) — and render both,
>    never let one stand in for the other.
> 2. **Before concluding a knowledge section is "broken," re-fetch the source fresh and check
>    whether it's actually empty upstream.** This run's UX Rationale section was genuinely correct
>    to show almost nothing — knowledge source 8 (Design Knowledge)'s own "UX Behaviour" branch was
>    a real empty untitled stub page at the time, not a retrieval failure; the one populated branch
>    (AI Evaluation) was already being cited correctly. Don't assume a sparse section means the
>    code is broken — `page_get` the source live and confirm before rewriting anything, and say so
>    plainly ("source page itself is empty, not a build defect") rather than inventing content to
>    make the section look fuller. (When the requester subsequently populated that branch with 8
>    real UX reports mid-project, the fix was purely re-running the same fresh-traversal read and
>    mapping each report to the screens it actually supports — no code change needed at all.)
> 3. **An explicit "there is exactly ONE Branding Theme for this prototype, don't show other
>    choices" instruction overrides the default live-switcher heuristic** ("Live switchers, not
>    gated compares" above still applies when nothing says otherwise) — when a requester states
>    this, remove the switcher entirely: its state variable, its UI control, and any CSS/token
>    scope built for the retired second option — not just default-select the named guide and leave
>    the control wired but pointed one way. Left-over switcher UI is itself a second "choice" the
>    requester explicitly said not to show. Separately: a source guide can be honest about its own
>    incompleteness (this run's named deck literally marked several of its own sections "Under
>    development" as of its authoring date) — reflect that boundary in the Branding section rather
>    than presenting an unfinished pillar as a settled visual spec.
> 4. **Copywriting needs the same link-to-source discipline Research Insight and UX Rationale
>    already had, and its example text must be the literal string the live component renders, not
>    a hand-authored parallel example.** Two real bugs found by checking the actual rendered app,
>    not just the panel: a Copywriting card's "Guideline" line named the tone-of-voice guide but
>    had no link to its Asana page (unlike every other cited section) — fixed by requiring one; and
>    a component's copy that the panel described as tone-differentiated turned out, on reading the
>    actual component source, to branch only on language, never on tone — the two "different"
>    example strings shown in the panel had never actually been reachable from the running app.
>    **Standing rule: before citing a screen's copy as an example of a guide's rule, grep the real
>    component source for the string and confirm it actually varies with the switcher state being
>    described** — if it doesn't yet, either make it actually vary (if the requester's tone rule
>    calls for it) or say plainly "this string reads identically under both guides" rather than
>    showing two examples the code can't produce.

> **v1.24.0 — Design System Evaluation gets a per-screen Code Readiness summary, the Figma-link
> requirement needs a checkable proof-of-query, and "flow-wide" stays Research-Insight-only
> (2026-08-29, Staff portal for tablet run, fifth build phase — first full rebuild of an existing
> prototype that had never touched CDS at all).** The requester pointed this skill at an already-
> published artifact ("Orbis Private RM Console") built entirely with hand-authored CSS and zero
> CDS tokens/components, confirmed it wanted the full real-registry rebuild (not a reskin), and
> then reviewed the result closely enough to catch three real gaps, none of them hypothetical:
>
> 1. **A Design System Evaluation table can structurally exist — right column, right four-state
>    vocabulary — while its Figma Link cell is blank on every single row, because knowledge source
>    9 (Core Design System Library Inventory) was simply never queried this run.** The existing
>    wording ("sourced from the Inventory project... never invented") describes what a *populated*
>    link must look like, but doesn't force a check that the source was actually read at all — a
>    build can satisfy every other rule and still ship a table that looks complete but has silently
>    skipped this one lookup. Fixed by adding a standing self-check: before presenting the table as
>    done, confirm you actually called `get_tasks` against gid `1217578024173799` this run and can
>    point to at least one row where its result produced a real link — a screen where literally
>    every row happens to be a genuine `Design System Gap` (nothing in Figma either) is the only
>    case where zero real Figma links is not itself evidence the query was skipped.
> 2. **"Per screen, not one flow-wide list" (Design System Evaluation) and "an insight that
>    genuinely applies to the whole flow goes in its own Flow-wide group" (Research Insight,
>    directly above it) are two different rules for two different sections — a real run blended
>    them**, adding an inline "Flow-wide (shared chrome)" Design System Evaluation section to avoid
>    repeating Button/Tab/Dialog rows across eight near-identical per-screen tables. Reasonable
>    motive, wrong section to bend: the per-screen table is what the focus-interaction and Code
>    Readiness line (below) both depend on being real and complete for *that* screen, and a
>    flow-wide substitute silently thins it out. The requester's own fix, now the standing pattern:
>    keep every screen's table strictly to that screen's own rows (shared-chrome components appear
>    redundantly in every screen that uses them — that redundancy is correct, not a smell), and if
>    the repetition is genuinely worth collapsing for a reviewer, add an **opt-in** "ดู DS Report
>    ทั้งหมด" link/button next to the section header that opens the shared-chrome rollup as its own
>    separate report view (a modal was used here; an expand-in-place would also fit a different
>    chrome layout) — never inline, never replacing the per-screen table by default.
> 3. **New standing requirement: a Code Readiness summary line under the Design System Evaluation
>    title, computed per screen from that screen's own rows** (the Flow-wide report view above gets
>    its own separate readiness line the same way, scoped to its own rows):
>    ```
>    Code Readiness: XX%
>    พร้อมใช้ซ้ำ X · ต้องปรับแก้ X · ยังไม่มีใน Design System X (จากทั้งหมด X component)
>    ```
>    Bucket mapping from the same four Implementation Status values, no fifth bucket invented:
>    `พร้อมใช้ซ้ำ` = `Shipped in Code` row count; `ต้องปรับแก้` = `Figma Only / Not Yet Shipped` +
>    `To Be Verified` row counts combined; `ยังไม่มีใน Design System` = `Design System Gap` row
>    count; `Code Readiness %` = พร้อมใช้ซ้ำ ÷ total rows on that screen, rounded to a whole number;
>    "จากทั้งหมด X component" = that screen's total row count. Derive this from the real per-screen
>    row data every time — never hand-type the numbers, since they must stay correct if a screen's
>    rows change on a later revision.

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
- **Design option exploration request** (optional) — if the requester asks for a fresh layout
  direction (e.g. "explore a new design for X," "give me an alternative to the reference screen's
  layout"), two things need resolving before building, not assuming:
  1. **Scope — screen or system-wide.** If the flow has more than one screen, ask whether this is
     a **screen-scoped** option (only that one screen gets a second layout) or a **system-wide**
     design direction spanning every screen and shared chrome (nav, top bar, modals) together —
     these produce very different builds (independent per-screen toggles vs. one global state
     driving everything at once) and shouldn't be assumed from a single-screen-sounding request.
     See "Design Option scope" under Step 4.
  2. **What the reference is for.** When the request points at an external reference (another
     screen, another tool's output, a supplied file), resolve explicitly whether the requester
     wants this build to match its **layout/structure** (adopt the reference's information
     architecture, but source every number/label/color from this build's own real data and real DS
     tokens — never the reference's own invented content or hand-picked colors) or only its
     **functional shape** (same underlying job, freely different layout). Both are normal,
     legitimate requests — don't default to one without asking when it's not stated, and don't read
     "match this reference" as "redraw its layout with placeholder content" either way.
  Build the resulting option as a different information architecture, not the same grid with
  different colors. Add a **Design Option switcher** (Original ↔ Option 1/A) to the chrome, scoped
  per the resolved answer to (1) above (see "Live switchers" and "Design Option scope" under Step
  4). This is opt-in, not something every run builds unprompted — don't add a second layout
  speculatively.
- **Compare request** (optional) — supplying **two** project-specific (or theme) links instead of
  one means the requester has a specific side-by-side decision in mind (e.g. deciding between a
  current and a proposed pattern set), and the panel's Design System Evaluation/Branding prose
  should say so plainly ("built to compare X vs. Y") rather than reading as an open-ended
  exploration aid. It does **not** gate whether the switcher control itself exists (see "Live
  switchers, not gated compares" under Step 4) — that now appears whenever more than one real
  named option exists, one link included. Don't blend multiple named options into one build
  either way.
- **Tone of voice guide(s)** (required whenever the screen has real copy to write — see Copy
  Writing Guideline below) — which specific guide(s) on that page to use, named. Naming **one**
  (e.g. "MB Writing Style Guide V2") still gets a switcher (against a plain/no-guide baseline) per
  Step 4 — it just isn't framed as a requested comparison in the panel prose. Naming **two** (e.g.
  "MB Writing Style Guide V2" vs "Trip Space") additionally means the requester has a specific
  comparison in mind — the panel says so. Ask if none is named; never silently pick one or blend
  multiple guides together.
- **Branding guide(s)** (required whenever the screen has a real branding decision to make — see
  Bradning Guidline below) — which specific guide(s) on that page to use, named. Same rule as Tone
  above: naming **one** still gets a live switcher (against the CDS/no-guide baseline); naming
  **two** additionally marks it as a requested comparison in the panel's own wording. Ask if none
  is named; never silently pick one or blend multiple guides together.
- **Priority note** (optional, defaults to on) — the requirement always wins over design-system
  completeness: a component missing from the DS is never a reason to stop, only a reason to
  placeholder-and-flag (Step 3).
- **No switcher possible** — a switcher only appears for a dimension that actually has more than
  one real named state to show (a named guide vs. baseline, two DS systems, etc.) — if a
  dimension genuinely has exactly one state (nothing named, nothing to fall back to), don't
  fabricate a second option just to have something to switch; that dimension's switcher is simply
  absent from the chrome for this build, same as before.

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
   "on-brand" with nothing real to check it against. **Read the guide's actual color rules before
   applying a color — never infer one from what the brand "seems like."** A prior run guessed gold
   for a premium sub-brand's action color; the guide it should have read documents gold as reserved
   for physical/printed materials only, with a grey/white monochrome as the actual digital
   treatment. The guide is the source of truth, not a vibe extrapolated from the brand's name or
   segment.

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
     the project-specific patterns during Step 3, informed by Core, and tags each one `Design
     System Gap` in Step 4's Design System Evaluation table since nothing pre-existing was reused.
   - Live sites are the freshest, most authoritative source of what's actually real in code right
     now — weight them over Asana/repo sources if the two disagree about whether something
     exists.

8. **Design Knowledge** — root gid `1217629510106645`
   (https://app.asana.com/1/1153565613997788/note/1217629510106645). A tree of layout/interaction/
   platform design-principle references (Device Template → Tablet/Website/Mobile/Responsive
   Layout Grid, UX Behaviour, AI Evaluation), captured via `asana-design-knowledge-capture` from
   external sources (design-pattern docs, NN/g-style articles, platform guidelines) — this is
   **design-principle evidence**, a different kind of citation than a Research report (which is
   evidence about *this product's own users*) or a named Copy Writing/Bradning guide (which is a
   *rule*, not evidence). Feeds Step 4's **UX Rationale** section. Walk the tree the same
   read-don't-guess way as Research: `page_get` the root, follow every child link that's
   plausibly relevant to a screen you're building (e.g. a tablet-frame spacing/grid decision →
   Responsive Layout Grid; an AI-generated confidence/insight number shown to the user → the AI
   Evaluation branch), and note explicitly when a branch is still an empty placeholder rather than
   silently skipping it — several nodes in this tree may have no content yet. Never invent a
   design principle and attribute it to this source; if nothing in the tree actually covers a
   screen's decision, Step 4's UX Rationale section says so plainly, the same honesty rule as a
   Research gap.

9. **Core Design System Library (Inventory)** — Asana project gid `1217578024173799`
   (https://app.asana.com/1/1153565613997788/project/1217578024173799). One task per CDS
   component (46 at last count), each carrying real custom fields: `Code Status` (`Shipped in
   Code` / `Design Ahead of Dev`), `Governance Status` (`Publish` / `Need Discussion` /
   `Updated`), `Design System Link` (a real Figma node URL — file `ON8Azjo7wIi3P2oxnxKiBb`,
   per-component `node-id`, this is the authoritative Figma-link source Step 4's Design System
   Evaluation table cites, never invent one), `Published Version`, `Projects Using`, `Last
   Published Date`, `Code Last Checked`. Fetch with `mcp__claude_ai_Asana__get_tasks` (project =
   this gid, `opt_fields=name,custom_fields,permalink_url`) — the response is large, page/grep
   rather than reading it whole. **Cross-check `Code Status` against the live CDS site
   (`search_components`/`get_component`) before trusting it — this inventory genuinely drifts.**
   Confirmed stale as of 2026-08-25: Tab, Toggle Switch, List (Asana's row for what CDS calls
   `list-item`), Popover, Dialog, and Menu are all real, installable, shipped registry items on
   the live site today despite their Asana rows reading `Design Ahead of Dev`/`Need Discussion` —
   don't propagate a stale status just because it's what the tracker says, and don't silently
   trust code-reality over the tracker either without checking; note the discrepancy when you find
   one. A component present here with a real `Design System Link` but absent from the live
   registry (e.g. `Button Combo` — a real Figma set per โย's `cds-consumer` docs, not yet coded)
   is `Figma Only / Not Yet Shipped`, a different claim than a full `Design System Gap` (nothing
   in Figma *or* code — most bespoke chart/slider/tooltip needs this skill already flags fall
   here, and won't have an Asana task at all, which is itself evidence for the gap rather than a
   blocker to citing one).

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
   project gets flagged `Design System Gap` (Design System Evaluation table, Step 4) since it's
   being created here, not pulled from an existing library.

If it's unclear which mode applies, ask — don't infer mode 2 vs. mode 3 from a project name alone
("Wealth" could mean "compose a new Wealth-specific layer" or "reuse the existing Wealth DS if one
already exists"; these are opposite operations that produce different `Shipped in Code`/`Design
System Gap` tagging in Step 4). This determines what Step 3 checks new/existing components against: Core
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

**Installing a component is not the same as using it correctly — pull its full context, not just
enough props to render something plausible.** Before finalizing how a component is used, call
`get_component(slug)` and actually read its `guidance` (usage, when-to-use/when-not-to-use, any
context-dependent variant choice — e.g. `Tab`'s own guidance names which `color` variant is correct
for which surrounding surface colour) and its `gaps` list (declared-but-unimplemented Figma
properties), not just enough of the props list to make something render. Two real, confirmed
defects shipped from skipping this in one run: a `Text Field` was used with only the props needed
to render (visible label, no icon) without checking its own declared "Has Start Icon" gap or its
guidance's aria-label-only path; a `Tab` was used with `color="Neutral"` on a screen whose actual
background is the same grey as `Neutral`'s own selected-pill token — the tab guidance's own
"Color Context Choice" table already named the correct variant (`On Neutral Secondary`) for that
exact surface, and the mismatch meant the selected tab had zero visible contrast, only found by
resolving the actual token value, not by looking at a screenshot. The requester's own instruction
after these were found: check a component's real context every time, standing from then on, not
just at first install. When a real declared gap must be filled (a Figma property with no coded
prop), fill it as a disclosed local completion of that project's own vendored copy of the component
(a code comment citing the real gap this fills), never as an invented prop pretending to be
upstream CDS, and reflect the fill honestly in the Design System Evaluation table's `note` field
rather than either hiding it or downgrading the whole component to a full `Design System Gap`.

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

## Dark theme (and other real DS mode axes with the same trap)

Dark mode is a real, requestable mode axis in CDS/MBDS/webds — a genuine `[data-theme='dark']`
token block generated from the DS's own Figma modes, not a cosmetic filter this skill improvises.
Apply the `data-theme` attribute at the **true root** of the rendered tree (the outermost wrapper,
not a nested subtree) — a narrower scope leaves anything outside it (a shared background, a status
bar) resolving the wrong theme's tokens while everything inside looks right, a real WCAG failure
found this way in an earlier run (white-on-near-white, 1.09:1).

**The "-inverse" flip trap.** A token whose name includes "inverse" (e.g.
`surface-neutral-primary-inverse`) can deliberately mean *the opposite of whichever theme is
currently active* — dark navy in light mode, near-white in dark mode, by design, so a chrome
element that reads as "the one permanently dark accent surface" in light mode keeps reading as a
visually distinct accent surface once the whole app goes dark, just now light-on-dark instead of
dark-on-light. This is correct CDS behavior, not a bug in the token — the bug is anywhere code
built on that surface assumed it stays dark forever and hardcoded a matching text/border color
(`rgba(255,255,255,0.5)` and similar) instead of reading the token's own paired `-inverse`
content/border family (`content-neutral-primary-inverse`, `content-neutral-secondary-inverse`,
`border-neutral-primary-inverse`, etc.), which flips in lockstep with the surface and stays
correctly paired in both themes. Grep for hardcoded `rgba(255,255,255,` / `rgba(0,0,0,` literals
anywhere near a `-inverse` surface token before calling a dark-mode build done — every one found
this way in one real run was this exact bug.

**The fixed-light-surface trap — a second, more common flip mismatch.** CDS's
`surface-accent-{blue,green,purple,red,orange,yellow}` and
`surface-{positive,negative,warning}-primary` tokens stay a fixed light pastel across **both**
themes (barely move at all — dark mode usually just saturates them slightly). The plain
`content-{success,danger,warning,brand}`/`content-accent-{color}` tokens that look like their
natural pairing actually **flip lighter under dark theme**, because they're built to stay legible
on the app's own dark canvas — not on these small always-light tinted cards, chips, and badges.
Paired naively, dark mode turns "readable dark text on a pale card" into "pale text on a pale
card," often well under 2:1. CDS ships the correct non-flipping pair for exactly this case — use
it whenever text or an icon sits directly on one of these tinted surfaces, never the plain
semantic content token:

| Sits on this fixed-light surface | Use this content token (not the plain one) |
|---|---|
| `surface-accent-blue` | `content-accent-on-accent-blue` |
| `surface-accent-green` | `content-accent-on-accent-green` |
| `surface-accent-red` | `content-accent-on-accent-red` |
| `surface-accent-purple` | `content-accent-on-accent-purple` |
| `surface-accent-yellow` | `content-accent-on-accent-yellow` |
| `surface-accent-orange` | `content-accent-on-accent-orange` |
| `surface-positive-primary` | `content-positive-on-positive-primary` |
| `surface-negative-primary` | `content-negative-on-negative-primary` |
| `surface-warning-primary` | `content-warning-on-warning-primary` |

This pattern is **systemic, not a one-off** — one real build had it recur independently in 8+
unrelated files (a sidebar's nav items, a dashboard's "next appointment"/checklist/churn-risk/
leaderboard cards, a passcode-entry error state, a stat-card row, and a shared tone-pill
component) once actually swept for, after the first instance was fixed in isolation and reported
as done. **Fixing the one instance you were told about is not the same as fixing the class of
bug** — before calling a dark-mode build done, grep every file for `surface-accent-` and
`surface-{positive,negative,warning}-primary`, and check what content token sits on each result.

**A shared component's color variant can be correct in one place and wrong in another, simultaneously
— check both states, on the actual surface each is used against.** A `Tab`'s "On Neutral Primary
Inverse" color variant has a genuinely correct, non-flipping SELECTED pair (`#002850`
surface/white label, both real dedicated component tokens) — but its UNSELECTED label reads from
the generic flipping `content-neutral-primary-inverse`, which is only correct when the tab bar
itself sits on a surface that flips with theme (like `bg.brandDark`/`surface-neutral-primary-
inverse`). The same variant used on an *ordinary* dark surface (dark simply because the theme is
dark, not because it's an inverse-flipping surface) gets the SELECTED state right and the
UNSELECTED state wrong (invisible black-on-navy) — while the exact same fix applied blanket to
every instance of that component breaks the FIRST, correct usage instead. If a shared component's
color variant needs a targeted override, scope it precisely (a dedicated CSS class applied only at
the call sites that need it), verify it doesn't regress a different, already-correct usage of the
same component/variant elsewhere in the build, and don't fix by guessing — measure both states'
actual computed contrast on their actual surface before and after.

**Standing verification rule.** After implementing or touching dark mode, run a real computed-
contrast sweep — inject a WCAG relative-luminance contrast checker (`getComputedStyle` on every
visible text node, walk up to the actual effective background, compute the real ratio, flag
anything under 4.5:1 for normal text / 3:1 for large text) across every screen and every dimension-
switcher state (both Design Options, both CTA variants, every tab/view), not just the one screen
that prompted the fix. A component can pass the identical token pairing on one screen and fail on
another purely because the two sit on differently-behaving surfaces (a flipping one vs. a fixed
one) — screenshots and a single spot-check both miss this reliably; only the actual computed style
catches it. Treat SVG `<text>` elements specially in any such scanner — their visible color comes
from the `fill` attribute/property, not CSS `color`, and a scanner reading `color` on an SVG text
node will report a false positive off the browser's unrelated default.

## Fork orchestration and independent verification

Whenever a build spawns a background agent/fork to do real implementation work (not just
research), that fork's own final report — "done," "verified," "published," "no errors" — is a
**claim to independently check, not a fact to relay to the requester**. This applies even when the
fork was explicitly instructed to run `verify_code`/the audit script itself; re-run the check, or
inspect the actual result, from the orchestrating session before telling the requester it's done.

- **Verify against the real, running artifact — not the fork's description of it.** Load the
  actual page (browser tooling) and confirm the claim directly: `getComputedStyle`/
  `getBoundingClientRect` for a layout or color claim, a real simulated keystroke/click for an
  interaction claim, `read_console_messages` for a "no errors" claim. Two real defects were only
  found this way in one build, neither visible from a screenshot alone: a component that didn't
  stretch to fill its flex wrapper (only visible by measuring its actual rendered width against its
  wrapper's), and a WCAG contrast failure caused by a background color resolving outside its
  intended theme scope (only visible by computing the actual rendered colors and applying the real
  WCAG 2.1 relative-luminance contrast formula, not by eyeballing a screenshot — text can look
  "readable enough" at a glance well under the 4.5:1 normal-text / 3:1 large-text minimums).
- **The orchestrating session owns publishing, not the fork.** Tell every fork explicitly not to
  publish the artifact itself; publish only after independently verifying its work. A fork that
  publishes anyway before verification means an unverified state is now the one the requester sees
  if anything interrupts the check.
- **Redirect or stop a fork the moment the requester's direction changes mid-flight** — don't let
  it keep working toward an outcome that's about to be discarded (e.g. a fork mid-way through
  fixing a dark-theme contrast bug when the requester decides to drop dark theme entirely). Send
  the stop/redirect instruction as soon as the change is known, and have it report back its partial
  file-edit state rather than finishing or publishing work that's now moot.
- **Never run two forks concurrently against the same files.** If two pieces of work would touch
  the same file (e.g. the same shared chrome component two different fixes both need to edit),
  sequence them — the second starts only after the first's result is verified and merged — rather
  than risking one fork's edits silently clobbering the other's.
- **When redesigning an existing interaction**, check what richer pattern this same codebase
  already uses for a comparable decision before reaching for the simplest matching primitive (e.g.
  a plain on/off toggle). A toggle communicates only "on/off," not "what" — if the codebase already
  has an established pattern that shows more (a menu/popover pattern that names both destinations
  with icons and descriptions, say), prefer reusing that pattern for consistency and for the richer
  experience it gives the reviewer, and be ready to justify the choice with real UX reasoning if
  the first redesign attempt gets sent back for more work.

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

**A real cold-load of the published Artifact can genuinely take 10–20+ seconds** for a build with
a full component tree plus an inlined web font (~2MB total is normal) — this is expected
sandboxed-iframe load time, not a broken build, and a quick "wait a couple seconds, screenshot,
still blank" check can misread a still-loading page as a crash. Give a fresh load real time
(10+ seconds) before concluding a publish is broken. If a render failure is still genuinely
suspected after that, verify with a non-destructive **on-page error overlay** — wrap the root
render call in `try/catch` and add a `window.addEventListener('error', ...)` /
`'unhandledrejection'` handler, both writing any caught error as visible text into an appended DOM
node (not replacing existing content) — rather than relying on browser-extension console tools:
those capture only the top-level wrapper page's console, not the artifact's own sandboxed content
iframe, so a real crash inside the iframe reads as "zero console errors" from the outside.
Remove the overlay scaffolding again before the final publish. Separately: republishing to an
artifact URL this session hasn't freshly `read` (via `Artifact action:"read"`) in the *current*
turn can be refused ("identical content already refused, resent unchanged") even when the new
content is a real, complete superset of the previous version's changes — call `read` once on the
target URL before retrying a publish that was just refused, rather than resending the same call.

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

**The same scoping applies even when only one system renders at a time — not just an A/B
compare.** When mode 2's Existing project DS doesn't cover something (no button, no tab, no
alert, whatever), Core fills the gap — but that Core component still resolves its tokens via
`.ds-cds`, and a screen that's otherwise entirely scoped to the other system's class has no
`.ds-cds` ancestor for it to inherit from. Wrap just that leaf usage in a small
`<div className="ds-cds" style={{ display: 'contents' }}>` — narrow enough to give the borrowed
component real CDS values without pulling the other system's own components (rendered as its
children elsewhere on the same screen) into CDS's scope too. Never wrap a container that hosts the
other system's own components as children; wrap only the borrowed component itself.

Never skip straight to writing CSS that merely *looks like* the DS because this pipeline is more
work than the CSS trick — the CSS trick is exactly the defect Step 3 forbids, and looking like
the DS is not the same as being built on it (wrong tokens under a real theme/density/shape mode
switch, missing type-scale classes, wrong font actually loaded, etc. — see the "no design system
at all" finding this section exists to prevent). If the pipeline above is genuinely infeasible for
a given request, say so plainly to the requester and ask before falling back to anything else —
don't decide unilaterally that hand-authored CSS is an acceptable substitute.

## Step 4 — presentation mode, per-screen dynamic panel, live dimension switchers, focus interaction

Build a walkthrough view (or whatever presentation surface the tool you're running in supports)
with a **collapse control** — a single `›`/`‹` icon-button, not an on/off toggle switch — that
shrinks the whole chrome down to just its drag grip when the reviewer wants the clean product
surface, and expands it back to the full bar + panel on click. The chrome itself is a single
draggable control bar — a grip so the requester can move it out of the way of whatever screen area
they're looking at — not a fixed strip pinned in one corner. Collapsed is the default state on
load (clean product surface first). The panel's content **changes per screen** — this is the
specific fix this skill exists to make over the static single-panel pattern seen elsewhere.

**The chrome stays theme-independent by default.** If the product screens have a dark-mode
switcher (see "Dark theme" above), pin the reviewer chrome's own root to `data-theme="light"`
regardless of the product's current theme state, so it re-resolves CDS's real light-token block
every time — a fixed light background reads easier for reviewer tooling than one that dark-
switches along with the screens it's reviewing. Only make the chrome follow the app theme if the
requester specifically asks for that.

**A `position:fixed` chrome must not silently block clicks on the product below it.** A wrapper
using column-flex with `alignItems:'flex-end'` to right-align children of different widths
shrink-wraps its own hit-testable box to its WIDEST child — the empty space beside a *narrower*
child still intercepts pointer events for whatever's underneath, even though nothing paints
there, and this is invisible from a screenshot (only `document.elementFromPoint` at the dead
click's coordinates reveals it — the chrome's own wrapper div comes back instead of the real
product element). Set `pointerEvents:'none'` on that shared outer wrapper and `pointerEvents:
'auto'` explicitly on each real, visibly-painted child (the collapsed pill, the dimension bar,
the panel) — never leave the outer box with the default `auto`.

**A plain either/or setting defaults to the lightest correct treatment.** For a dimension switcher
that's just "pick one of two named things" (see "Live switchers" below), a label plus a real
`ToggleSwitch` — active side in emphasized text — is the default; reach for a heavier
paired-card affordance (e.g. a `Card Container` pair with its own "selected" caption) only when
the requester's own reference specifically shows cards, or the content genuinely needs more than
a label (a sublabel, an icon, a preview image). A card-per-option treatment for a plain text
choice reads as heavier than the decision warrants.

### Live switchers, not gated compares

Where earlier versions of this skill only built a Branding/Tone-of-Voice/Design-System switch
when the requester explicitly named **two** sources as an intentional comparison, that gate now
governs the panel's *wording* only, not whether the *control* exists. Build a switcher for a
dimension whenever it has more than one real named state to offer — and **one named guide plus
the system's own baseline already counts as two states**:

- **Design System switcher** — states are: Core alone, the named existing project DS (mode 2), or
  Core + the newly composed layer (mode 3) — plus a second project-layer/theme link if the
  requester gave one. Swaps the rendered screen's project-layer tokens between states on top of
  the same Core base every time — same screens, same content, different project layer. Build this
  as a real token swap (e.g. a `data-ds` attribute driving a second CSS token block sourced from
  each state's actual values), not a second copy of the prototype.
- **Branding switcher** — states are: no branding guide applied (CDS/Core baseline) plus every
  branding guide the requester actually named (often just one). Swaps the screen's branding-driven
  visual identity (colors, imagery treatment, whatever the active guide's rules cover) between
  states. If a guide calls for a color/token the DS doesn't have yet, invent it rather than
  blocking — tag it `Design System Gap` in that screen's Design System Evaluation (see the
  four-state table under "Design System Evaluation" below), never let an invented brand color look
  like it came from the DS.

  **Exception — an explicit single-theme instruction overrides this default (v1.23.0).** If the
  requester states there is exactly **one** Branding Theme for this prototype and no other choices
  should be shown, don't build this switcher at all — not even defaulted to the named guide with
  the control left in place. Remove its state variable, its UI control, and any CSS/token scope
  built for a retired second option entirely. A switcher UI pointed permanently at one side is
  still a second "choice" visible in the chrome, which is exactly what that kind of instruction is
  ruling out.
- **Design Option switcher** — only when Expected input's "Design option exploration request" was
  actually made, absent everywhere if never requested (this one genuinely is gated, unlike the
  three above, because building a second full layout is real design work, not a token swap).
  States: `Original` (the existing layout, unchanged) and `Option 1`/`Option A` (a genuinely
  different information architecture built for the same functional requirement — see Step 3's
  "gaps placeholdered, not blocked" rule for how to handle anything the option needs that Core
  doesn't ship). Swaps which component tree renders; the screen's Design System Evaluation table
  (below) reflects whichever option is currently selected, since the two options can use entirely
  different real components for the same job.

  **Design Option scope — screen or system-wide, resolved per Expected input before building.**
  - *Screen-scoped*: the switcher lives on, and only affects, the one screen it was built for —
    absent on every other screen.
  - *System-wide*: **one** switcher state drives every screen and every piece of shared chrome
    (sidebar/nav, top bar, modals) together, in a single action — never independent per-screen
    toggles for a system-wide request, even if it would be less work to build that way. A prior
    run built per-screen toggles for what turned out to be a system-wide request and had to be
    consolidated after the fact; the requester's own framing was blunt about why: two screens
    showing two different "current" directions at once isn't one coherent alternative experience,
    it's an inconsistency. When a system-wide option is genuinely a different design direction (not
    just a different color), give it its own real, distinct DS token identity — prefer swapping a
    semantic token family (e.g. an accent color family) via a scoping wrapper class over switching
    the whole color theme (light/dark); a full theme swap touches far more surface area and is
    easy to leave with a real contrast defect (see "Fork orchestration and independent
    verification" below for how one such defect was actually found). If a distinct interaction
    mechanism (not just a skin) makes sense for the option — e.g. a different auth-entry pattern —
    that's a legitimate part of a system-wide direction too, not scope creep; keep both mechanisms'
    state/handlers un-conditionally declared in whatever the framework requires, with only the
    render branch conditional on the active option.
- **Tone of Voice switcher** — states are: plain/ungoverned copy plus every tone-of-voice guide
  the requester actually named (often just one, sometimes two). Swaps every real copy decision on
  the current screen between the wording each state produces. **Every state must be written in
  the same language.** The switcher exists to show a *feeling* difference (formal vs. casual,
  terse vs. warm) — if one state is English and another is Thai, the comparison shows a language
  switch instead, and the actual tone contrast is invisible. Pick whichever language the screen's
  copy is naturally in and write every state in it, even if a named guide's own examples lean
  toward a different language (e.g. a Thai-heavy quick guide like Trip Space still has to be
  matched by an equally-Thai formal state, not by falling back to English for the formal side just
  because the house style guide's own body text is in English). A dedicated **Language** switcher
  (e.g. Thai vs. English UI copy) is a separate, independent control from Tone — don't cross the
  two into one combinatorial switcher unless the requester specifically asks for that; keep Tone
  fixed to one language's worth of states and let Language, if built, sit alongside it.

A dimension that genuinely has only one possible state (nothing named, no second thing to fall
back to) simply has no switcher in the chrome for this build — don't fabricate a second state
just to have something to switch, per "No switcher possible" in Expected input. When the
requester *did* name two sources for a dimension as an explicit comparison (Expected input's
"Compare request"), the panel's prose for that dimension should say so plainly ("built to compare
X vs. Y") rather than reading as an open-ended exploration aid — that's the only thing the old
two-names rule still decides.

- Keep a per-screen data structure (screen id → that screen's own insight cards / DS rows), built
  from Steps 1–3's knowledge as it actually applies to *that* screen — not one global list reused
  everywhere.
- When the user switches screens in the prototype, re-render the panel's sections from that
  screen's own data — don't just toggle screen visibility and leave the panel untouched.
- An insight that genuinely applies to the whole flow (not one screen) goes in its own
  "Flow-wide" group so it isn't lost when switching screens, rather than being duplicated
  identically into every screen's section.

### Focus interaction

Every clickable panel row — Research Insight card, UX Rationale card, Design System Evaluation
row — refers to something real on the actual rendered screen, not just to a citation. Clicking one
must **highlight and scroll to that real on-screen element**, inside the device frame's own
internal scroll (never scroll the whole page) — a temporary outline/glow pulse using a DS
feedback/accent token, that fades after a couple of seconds or on the next click, is enough; don't
build a persistent highlight that lingers and confuses the next interaction. This means Step 3's
screen-building has to attach a stable identifier to each meaningful element as it's built (an id
or data-attribute naming what it is), not bolt one on after the fact once Step 4 needs it — plan
for this while writing each screen, the same way `data-cds-icon`/similar attributes already tag
real DS output. A row with nothing sensible to point at (a Requirement-summary card, a
"reviewed — not applicable" research card with no on-screen presence) simply isn't clickable —
don't force a highlight target onto a row that has none.

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
   there, say so in the card rather than presenting an informal paraphrase as if it were. Not
   clickable-to-highlight — it describes the whole build, not one on-screen element.

The remaining sections are **per screen** — when the viewer clicks between screens in the
prototype, re-render all of them from that screen's own data, not just toggle screen visibility and
leave the panel untouched:

2. **Research Insight** — cards with: title, summary, and an explicit *why this design does /
   does not yet address it* line (cite the specific finding, not "informed by research" in the
   abstract). Include what was reviewed and judged not applicable to this screen, not just what
   was used. **Every card links back to the specific Asana research report(s) it draws on** —
   same pattern as the Requirement summary card's link to its Requirement collections page, not a
   citation you have to take on faith. A card built from more than one report links every one of
   them; a "reviewed, not applicable" card still links the report it reviewed. Each card that maps
   to a real on-screen element is also clickable per the focus interaction above. An insight that
   genuinely applies to the whole flow (not one screen) goes in its own "Flow-wide" group so it
   isn't lost when switching screens, rather than being duplicated identically into every screen's
   section.

   **Research gap flag — distinct from "reviewed, not applicable."** If a screen's decision has
   genuinely nothing in the Research index that speaks to it at all (not "something exists but
   doesn't apply here" — this specific kind of question has never been covered), don't quietly
   fold it into a component's `Design System Gap` row in the DS Evaluation table and move on
   without surfacing the gap. Show a
   visually distinct card in
   this section — different treatment from a normal insight card, e.g. a "🔬 ยังไม่มีข้อมูลวิจัยรองรับ"
   flag — naming the specific decision that's unsupported and recommending the research team
   investigate it. Then write that same gap onto the requirement's **User Story leaf** in
   Requirement collections (see "Writing research gaps back to Requirement collections" below) —
   the panel flag alone isn't enough, the research team needs to find it from Requirement
   collections too, not just from inside a prototype they may never open.

   **Keep this as a genuinely separate array from the real insight cards above it (v1.23.0).** A
   screen's data needs two distinct lists — real `researchInsights` (only ever populated from a
   report actually read this run: Insight / Applied to Design / Source) and this gap-flag list
   (decisions with no backing found) — and the section renders both. Never let the gap-flag list
   be the *only* field that exists, and never let it stand in for a real insight — a prior run did
   exactly this (one array, meant only for gaps, was the entire Research Insight section), which
   made a screen with real, on-topic research reports available render as if nothing had been
   read at all.
3. **UX Rationale** — cards citing the **Design Knowledge** Asana tree (knowledge source 8 above),
   not the Research index — this is design-principle/platform evidence (layout grids, interaction
   conventions, AI-output-trust caveats), a different kind of citation than a user-behavior
   research report or a named copywriting/branding rule. Each card: which structural/interaction
   decision on this screen it justifies, the specific principle, and a link to the actual Design
   Knowledge page it came from — same "cite the real source" discipline as Research Insight, and
   clickable to highlight the related component/region per the focus interaction above. If nothing
   in Design Knowledge actually covers a screen's decisions (a real possibility — much of that
   tree can be empty placeholders), say so plainly in this section rather than inventing generic
   UX platitudes and attributing them to a source that doesn't back them.
4. **Branding** (its own section, placed directly above Design System Evaluation) — for every
   real branding decision on this screen, cite the specific rule from the *named* branding
   guide(s) (e.g. which one(s) the user pointed to on the Bradning Guidline page) that it follows
   — never a vague "on-brand." If the Branding switcher is set to a named guide, this section's
   content swaps with it. If no guide was named for this run, this section says so plainly instead
   of asserting brand-compliance with nothing real behind it.

   **A source guide can be honest about its own gaps — reflect that, don't paper over it
   (v1.23.0).** A workshop deck or vendor file is sometimes a project-status snapshot, not a
   finished spec, and may say so itself (e.g. a section explicitly marked "Under development" as
   of the deck's own authoring date). When that's true, say so in this section for whatever pillar
   it affects (e.g. "this guide doesn't yet specify typography — type comes from the DS's own
   scale, not from this guide") rather than presenting an unfinished pillar as if it were a settled
   visual direction the build is now following.
5. **Design System Evaluation** — a **flat, per-component table**, not a list of screen-context
   rows. One row per real component actually used on this screen (for whichever Design Option is
   currently selected, if that switcher exists — see above), each carrying:
   - **Component** — the real component name (e.g. "Button", "Chip", "List Item," "Card
     Container," the bespoke piece's own descriptive name if it's a gap).
   - **CDS docs link** — `https://cds-bbl.vercel.app/#/components/<slug>` (swap host for
     `mbds-bbl.vercel.app`/`webds-bbl.vercel.app` under those modes). Gap rows have none.
   - **Figma link** — the real per-component node, sourced from the **Core Design System Library
     (Inventory)** Asana project (knowledge source 9 above) — never invented, never the library
     file's bare root. A component this build needs but that has no Asana task and no live
     registry entry (most bespoke chart/slider/tooltip needs) simply has no Figma link — that
     absence is itself part of the gap evidence, not something to paper over with a guessed link.
   - **Implementation Status** — exactly one of four values, no fifth invented:
     - `Shipped in Code` — installed from the real registry and actually rendered here.
     - `Figma Only / Not Yet Shipped` — has a real Figma component (per the Inventory project or
       โย's `cds-consumer` docs) but nothing in the live registry yet.
     - `Design System Gap` — nothing in Figma *or* code for this specific need (bespoke charts,
       this codebase's recurring slider/tooltip gaps, an invented branding token/color, a one-off
       layout adjustment — anything freehand-built because nothing DS-side covers it).
     - `To Be Verified` — you genuinely couldn't resolve the status from either the Inventory
       project or the live site — say so rather than forcing a guess into one of the other three.
   Cross-check the Inventory project's `Code Status` against the live CDS site before trusting it
   (see knowledge source 9 — it drifts); when you find and correct a stale row, say so in the
   table rather than silently overriding it. Per screen, not one flow-wide list — see "Flow-wide
   report is opt-in, never inline" below for the one sanctioned exception. Every row is clickable
   per the focus interaction above — it names a real element on the current screen.

   **Prove the Figma-link source was actually queried, not just that the column exists (v1.24.0).**
   Before presenting this table as done, confirm you called `get_tasks` against the Inventory
   project (gid `1217578024173799`) this run and can point to at least one row where it produced a
   real link. A table where every single row's Figma Link is blank is only correct when every row
   is a genuine `Design System Gap` (nothing in Figma either) — if any row is `Shipped in Code` or
   `Figma Only / Not Yet Shipped` and still has no Figma link, the Inventory query was skipped, not
   genuinely empty.

   **Code Readiness summary line (v1.24.0)** — directly under this section's own title (per screen,
   and again under the Flow-wide report's own title if that view exists — see below), a line
   derived from this screen's real row data, never hand-typed:
   ```
   Code Readiness: XX%
   พร้อมใช้ซ้ำ X · ต้องปรับแก้ X · ยังไม่มีใน Design System X (จากทั้งหมด X component)
   ```
   `พร้อมใช้ซ้ำ` = `Shipped in Code` count; `ต้องปรับแก้` = `Figma Only / Not Yet Shipped` +
   `To Be Verified` counts combined; `ยังไม่มีใน Design System` = `Design System Gap` count;
   `Code Readiness %` = พร้อมใช้ซ้ำ ÷ total rows on that screen, rounded to a whole number;
   "จากทั้งหมด X component" = that screen's total row count.

   **Flow-wide report is opt-in, never inline (v1.24.0).** "Per screen, not one flow-wide list"
   above is absolute for the default, always-visible table — don't blend it with Research Insight's
   separate "genuinely flow-wide insights get their own group" rule just because several screens
   share the same chrome components (nav, top bar, shared dialogs) and repeating their rows in
   every screen's table feels redundant. That repetition is correct, not a smell — the per-screen
   table is what the focus interaction and this screen's own Code Readiness line both depend on
   being complete. If the repetition is genuinely worth collapsing for a reviewer, add a small
   opt-in control next to the section header (a "ดู DS Report ทั้งหมด" link/button; a modal or an
   expand-in-place, whichever fits the existing chrome) that opens the shared-chrome rollup as its
   own separate report view — never shown by default, never replacing any screen's own table.
6. **Copywriting** (its own section, placed after Design System Evaluation) — for every real copy
   decision on this screen (labels, headings, error/empty states, CTAs), state the wording chosen
   and cite the specific rule from the *named* tone-of-voice guide (e.g. "MB Writing Style Guide
   V2") that it follows — never a vague "per guidelines." If the Tone of Voice switcher is set to a
   named guide, this section's content (and the copy actually rendered on the screen) swaps with
   it. If no guide was named for this run, this section says so plainly instead of pretending copy
   was guideline-checked. **Link to the named guide's actual Asana detail page** — same discipline
   as Research Insight and UX Rationale above; a guide name with no link is a citation you have to
   take on faith, which this skill doesn't allow anywhere else in the panel.

   **The example text shown must be the literal string the live component renders, not a
   hand-authored parallel example (v1.23.0).** Before citing a screen's copy as evidence of a
   guide's rule — especially when claiming it differs between two tone/language states — grep the
   actual component source for that string and confirm it really is reachable from the running
   app under the state being described. A prior run's panel showed two genuinely different English
   example strings for a card whose real component only ever branched on language, never on tone —
   neither example was actually producible by the app the panel claimed to describe. If a string
   doesn't yet vary the way the panel wants to show, either make the component actually vary it
   (when the named guide's own rule calls for that) or say plainly "this string reads identically
   under both guides" — never show two examples the code can't produce.

## Fixing or replacing an existing prototype

If the requester points at a previous run's prototype and asks for it to be fixed, check
ownership before touching anything: the artifact tool can only read/republish an artifact this
session owns. A prototype that comes back "shared, not owned" (or that has no separate source
file anywhere — the artifact was the only copy) can't be patched in place, no matter how small the
fix looks. In that case:

1. Diagnose what's actually wrong first (screenshot it, check the console, don't guess from the
   name alone) — the fix path changes depending on whether it's a live bug (broken rendering) vs.
   simply out of date against this skill's current rules (e.g. it predates v1.15.0's
   real-component-install requirement, so it may carry that defect too even if nothing looks
   broken on screen).
2. Confirm with the requester before spending the effort — a full rebuild is not a small fix, and
   they may just want to know what's wrong rather than have it redone.
3. Rebuild on this skill's current version using the same inputs (screens, DS composition mode,
   branding/tone guides, compare toggles) the original run used — pull them from the Requirement
   collections leaf's Status/Clarifications if the original request itself isn't available.
4. Publish as a new artifact (never attempt to force-publish over one this session doesn't own),
   then update the leaf's **Related prototype runs** list — append the new entry, and mark the old
   one superseded with a one-line reason. Never delete the old entry; the run history is what lets
   the next person see what changed and why.

## Final chat summary

- Which design-system composition mode this build used — Core only, an existing project DS
  reused (name it), or a new project layer composed fresh — and whether the mode had to be asked
  (Step 1) — plus which tone-of-voice guide(s) were used for copy and which branding guide(s)
  were used for branding decisions, if either applied.
- Which live switchers (Design System, Branding, Tone of Voice, Design Option) actually appear in
  this build's chrome, and each one's states — and confirm explicitly when a dimension has none,
  so it's clear that's because it genuinely had only one state, not an oversight. If a Design
  Option switcher was built, name its **scope** (screen-scoped vs. system-wide — see "Design
  Option scope" under Step 4) and summarize what's actually different about the option's layout
  (not just "it's different" — say what changed structurally), plus whether it also carries a
  distinct real DS token identity (e.g. a different accent family) or a genuinely different
  interaction mechanism, not just a different layout. Name which dimensions, if any, were framed in
  the panel as a requested comparison (two names explicitly given) versus an open
  exploration switcher (one name plus baseline).
- If any implementation work ran via a background fork, confirm its "done"/"verified" claims were
  independently re-checked from the orchestrating session (real computed styles/DOM measurements,
  simulated interaction, console check) before being relayed here — not just relayed from the
  fork's own report — and name anything a fork claimed that verification actually contradicted.
- Confirm the focus interaction is wired — Research Insight, UX Rationale, and Design System
  Evaluation rows highlight their real on-screen target on click — and note any row that was
  deliberately left non-clickable because it has no on-screen target.
- If the build has a dark-mode switcher, confirm a real computed-contrast sweep actually ran
  (see "Dark theme" above) — which screens/states were checked, and any real defect it found and
  fixed, not just "dark mode added."
- Confirm each screen's Research Insight section renders real insight cards (not just the
  gap-flag list standing in for them), each with a source link — and for any section that's
  genuinely sparse (Research, UX Rationale, or Branding), confirm the underlying Asana source was
  freshly re-read this run and is actually sparse upstream, rather than assuming the panel code is
  broken (v1.23.0).
- If a Branding/Tone-of-Voice dimension has an explicit single-theme instruction, confirm no
  switcher control exists for it in the chrome at all — and if a screen's Copywriting card claims
  a tone/language difference, confirm the cited example string is the literal text the live
  component renders under that state, not a hand-authored parallel example (v1.23.0).
- Whether a UX Rationale section had real Design Knowledge content to cite per screen, or was
  honest about finding nothing there — don't let this read as "done" if most cards just say "no
  rationale found."
- Requirement questions resolved, and how each was resolved — from existing knowledge (including
  what Requirement collections already had) vs. asked the user (Step 2), plus confirmation that
  the resolution was written back to Requirement collections.
- Screens built, and for each: real-DS component count vs. placeholder count.
- If Design System Evaluation used the component-level table format (Component Name, CDS Link,
  Figma Link, Implementation Status), list what it actually found per design option — component
  names and their status (Shipped in Code / Figma Only-Not Yet Shipped / Design System Gap /
  To Be Verified) — not just "table built." Flag any case where the CDS Component Library Asana
  inventory's recorded status disagreed with this session's own live evidence (an install that
  actually worked, a search_components result, a repo COMPONENTS.md entry) and say which status
  won and why — don't silently trust a stale Asana row over live proof. Confirm the Inventory
  project (source 9) was actually queried for Figma links this run — cite at least one row where
  it produced a real link, or confirm every row is a genuine Design System Gap if none did
  (v1.24.0) — and state each screen's Code Readiness % alongside its table, not just the table
  itself.
- Confirm no "Flow-wide" Design System Evaluation section is shown inline by default — only ever
  behind an opt-in report control, if built at all (v1.24.0); Research Insight's own Flow-wide
  grouping is unaffected by this and still applies as before.
- Any research gaps flagged (Step 4's Research Insight "gap flag") — which screen/decision, and
  confirmation each was written onto the requirement's User Story leaf under Research gaps
  flagged, so the research team can pick them up from Requirement collections.
- Any knowledge source that was missing/empty, unreachable, or the user hadn't linked yet — say
  so plainly, don't paper over a gap. Include whether `cds-consumer`/`agent-design-kit` synced
  successfully and whether the real `requirement-intake` tool ran or the manual fallback was used.
- Explicitly invite a correction if any step didn't behave as described — this skill is corrected
  from real runs (see the version history at the top), and every future defect found is what keeps
  it accurate for the next person who picks it up.

## Out of scope for this skill

- Extracting the prototype into real Figma frames — a later step in the Requirement → Applied
  chain, out of scope here (whatever the Asana-backed equivalent of
  `ds-governance-extract-notion` turns out to be, once/if it exists).
- Auditing the resulting screens against the DS — that's `ds-governance-audit-asana`, much later
  in the chain, after wireframing and binding are both done.
- Migrating `Copy Writing Guideline`, `Requirement collections`, or `Bradning Guidline` content
  from wherever it used to live — this skill reads/writes these Asana pages as they are; filling
  them in initially is a separate task.
