---
name: ds-governance-prototype-asana
version: 1.26.0
description: Turns a written requirement into a DS-aware prototype with a presentation mode. Asana-backed sibling of ds-governance-prototype-notion. Core Design System (cds-bbl) is always the base; the project layer follows one of three explicit modes (Core only / reuse an existing project DS / compose a new project layer) the requester picks, never inferred. In active use, corrected across 10+ real builds as of 2026-08-29 — see CHANGELOG.md for the full defect history behind every rule below.
metadata:
  status: in active use — corrected across 10+ documented real runs, see CHANGELOG.md
  mode: mixed
  category: workflow-meta
  sibling_of: ds-governance-prototype-notion (Notion-backed, kept separate — not a replacement)
---

# Prototype Agent (Asana-backed)

Builds a DS-first prototype from a requirement, with a presentation-mode side panel that cites
real research, real UX rationale, real branding/copy rules, and a real per-component Design
System Evaluation table — and lets the reviewer live-switch between named Design System, Branding,
Tone of Voice, and (opt-in) Design Option states. `CHANGELOG.md` in this folder has the full
defect/correction history behind every rule below — read it for the "why," not to run the skill.

**This skill never touches Figma.** Output is a prototype in whatever medium the tool you're
running in produces (e.g. an HTML/web mockup). Turning it into real Figma frames is
`ds-extract-prototype-to-figma-canvas`, a later step in the Requirement → Applied chain.

**Why a separate skill, not an edit to `ds-governance-prototype-notion`:** kept deliberately
separate (confirmed with the owner) — mirrors the `ds-governance-audit-notion`/`-asana` split
already established. The Notion-backed skill still exists and still works against Notion; this is
the Asana-backed path as the team migrates knowledge sources over.

## Expected input

- **Requirement** (required) — raw text or a link to the doc. Complete or a one-line ask, either
  is fine — Step 2 resolves the gap.
- **Design system composition mode** (required, see Step 1) — one of three:
  1. **Core only** — no project layer.
  2. **Existing project design system** — reuse an already-built project DS as-is (e.g. "MBDS" at
     `mbds-bbl.vercel.app`), named/linked by the requester.
  3. **Core + new composed layer** — Core as foundation, this run composes a new pattern layer for
     this project.

  Core (`cds-bbl`) is always read regardless of mode — not one of the three choices, the fixed
  base every mode starts from. Never infer mode 2 vs. 3 from a project name alone (they're
  opposite operations — reused whole vs. built fresh — that produce different `Shipped in
  Code`/`Design System Gap` tagging in Step 4's table) — ask if unclear.
- **Design option exploration request** (optional) — if asked for a fresh layout direction,
  resolve two things before building, don't assume:
  1. **Scope.** If the flow has more than one screen: **screen-scoped** (only that screen gets a
     second layout) or **system-wide** (one state drives every screen + shared chrome together —
     see "Design Option" in the switcher table below).
  2. **What a supplied reference is for** — its **layout/structure** (adopt the IA, source every
     number/label/color from this build's own real data/tokens) or only its **functional shape**
     (same job, free layout)? Both are normal requests — ask if unstated, never assume "reference"
     means "content only, redraw the layout."
  Build the option as a genuinely different information architecture, never the same grid
  recolored. This is opt-in — don't add a second layout speculatively.
- **Compare request** (optional) — naming **two** project/theme links means a specific
  side-by-side decision is in mind; the panel's prose should say so ("built to compare X vs. Y").
  Does not gate whether the switcher *control* exists (see "Live switchers" below) — only whether
  the panel frames it as a requested comparison.
- **Tone of voice guide(s)** (required whenever there's real copy to write) — named guide(s) from
  the Copy Writing Guideline index. Naming one still gets a switcher (vs. plain baseline); naming
  two marks it a requested comparison. Ask if none named — never guess or blend guides.
- **Branding guide(s)** (required whenever there's a real branding decision) — same rule as Tone:
  one still gets a switcher (vs. CDS/no-guide baseline); two marks a comparison. Ask if none named.
- **Priority note** (optional, defaults on) — the requirement always wins over DS completeness; a
  missing component is never a reason to stop, only to placeholder-and-flag (Step 3).
- **No switcher possible** — a switcher only appears for a dimension with more than one real named
  state. A dimension with genuinely one state (nothing named, nothing to fall back to) simply has
  no switcher for this build — don't fabricate a second option.

## Knowledge sources (Asana + live sites — this skill does not read Notion)

Read in order, hold in context for Steps 2–4. Don't block on any source being empty — note the gap
in the final summary (several pages are brand-new and may have little in them yet).

1. **Research** — index gid `1217101228810755`. `page_get` it, follow every 🔹-block link, pull in
   any report plausibly relevant to this requirement. Note explicitly whether each *applies* to a
   screen or was *reviewed and found not applicable* — both get surfaced in Step 4, never dropped.
2. **Copy Writing Guideline** — gid `1217629510106643`. Holds **multiple distinct sources** (a
   house style guide, a tone-of-voice quick guide, a grammar reference, etc.) as separate 🔹 rows.
   Use only the guide(s) the user named — find the row, open it, apply its rules to any copy
   written. If a named guide isn't on the page yet, say so and write plain product copy instead of
   inventing a "guideline-compliant" voice with nothing real to check against.
3. **Requirement collections** — hub gid `1217617725712351`. Check for an existing entry before
   asking the user anything in Step 2. **Fixed three-level tree**: `hub → Project → Feature/Epic →
   User Story`. `page_get` the hub for the Project link, that page for the Feature/Epic link, that
   for the User Story leaf — the leaf holds the real content (User Story/Acceptance Criteria/
   Status/Clarifications); Project and Feature/Epic pages above it are just link lists. A missing
   level just means nothing's logged yet, not an error. This skill also **writes** to the leaf —
   see Step 2's "Writing back."
4. **Bradning Guidline** [title as created, gid unchanged despite the typo] — gid
   `1217632285949369`. Same shape/rule as Copy Writing Guideline — multiple distinct sources,
   possibly segment-specific themes. Use only the guide(s) named; if none, say so, don't assert
   "on-brand" with nothing to check against. **Read the guide's actual color rules before applying
   a color — never infer from what a brand "seems like"** (a prior run guessed gold for a
   "premium" sub-brand; the guide reserved gold for print only, grey/white for digital).
5. **โย's (Yo's) `cds-consumer` repo** — `https://github.com/therealveldt/cds-consumer.git`
   (private, this session's git credentials reach it). Sync before every read:
   ```
   git -C ~/design-system-repos/cds-consumer pull 2>/dev/null || git clone https://github.com/therealveldt/cds-consumer.git ~/design-system-repos/cds-consumer
   ```
   Read-only reference lookup (not Figma) — how Step 3 gets exact component props/states/token
   names without Figma access. Read `context/COMPONENTS.md` + `context/REGISTRY.md` (prefer these
   over the live site if they disagree on exact props), `context/DRIFT.md` (prior "intentional
   difference, don't re-flag" rulings — check before placeholdering a gap), `guidelines/
   writing.md` (secondary context only — the *named* Copy Writing Guideline stays primary),
   `guidelines/{accessibility,motion,responsive,layout}.md` (general build-time rules).
6. **กัน's (Kan's) `agent-design-kit` repo** — `https://github.com/KanKaoLab/agent-design-kit.git`
   (public). Same sync pattern:
   ```
   git -C ~/design-system-repos/agent-design-kit pull 2>/dev/null || git clone https://github.com/KanKaoLab/agent-design-kit.git ~/design-system-repos/agent-design-kit
   ```
   `.claude/skills/requirement-intake/SKILL.md` is the **real** requirement-intake tool Step 2
   defers to — runs `python agent-design-kit/scripts/phase8-workflow.py clarify <input.json>
   --json` against a "convergence sheet" JSON, returns a `single-question-bundle` of only
   shape-changing questions (exit code 2 = still blocked). No convergence sheet yet → say so, fall
   back to Step 2's manual gate, don't fabricate one.
7. **Design system — Core always, plus one of three modes** (see Expected input). Core is never
   optional; what varies is whether a project layer exists and whether it's borrowed or composed.
   - **Core** (all modes): `https://cds-bbl.vercel.app/`, generated from Figma **⭐️ Core Design
     Library** (fileKey `ON8Azjo7wIi3P2oxnxKiBb`; Overview page node `31:176` is a good
     orientation start). If a token/component looks wrong on the live site, this Figma file is the
     upstream source to check first.
   - **Existing project DS** (mode 2 only): `webds-bbl.vercel.app` (web) and `mbds-bbl.vercel.app`
     (mobile) are the two confirmed real, fully-registry-backed examples (not an exhaustive list).
     Its own live site is primary authority for what it covers; Core still governs the rest. Same
     tooling shape as Core: `<site>/r/registry.json`, `<site>/r/components/<slug>.json`,
     `<site>/audit.mjs`, its own `llms.txt`. **webds specifics:** a `patterns` layer
     (consumer-measured, weaker claim than a component — prefer a component when one fits); every
     component Figma key served `null` — place by *name* in the official `🖥️ Core Website Design
     Library`, never invent a key.
   - **Newly composed layer** (mode 3 only): no separate site — this run creates project-specific
     patterns during Step 3, tagged `Design System Gap` in Step 4's table.
   - Live sites are the freshest source of what's real in code right now — weight them over Asana/
     repo sources on disagreement.
8. **Design Knowledge** — root gid `1217629510106645`. A tree of layout/interaction/platform
   design-principle references — **design-principle evidence**, different from a Research report
   (user-behavior evidence about this product) or a named guide (a rule). Feeds Step 4's UX
   Rationale. Walk it the same read-don't-guess way as Research; note explicitly when a branch is
   still an empty placeholder rather than skipping it silently. Never invent a principle and
   attribute it here.
9. **Core Design System Library (Inventory)** — Asana project gid `1217578024173799`. One task per
   CDS component, custom fields: `Code Status`, `Governance Status`, `Design System Link` (real
   Figma node URL, file `ON8Azjo7wIi3P2oxnxKiBb` — the authoritative Figma-link source for Step 4's
   table, never invent one), `Published Version`, `Projects Using`, `Last Published Date`, `Code
   Last Checked`. Fetch via `get_tasks` (project = this gid,
   `opt_fields=name,custom_fields,permalink_url`) — page/grep, don't read it whole. **Cross-check
   `Code Status` against the live CDS site before trusting it — this inventory genuinely drifts**
   (Tab, Toggle Switch, List Item, Popover, Dialog, Menu confirmed stale one run — real shipped
   registry items despite reading `Design Ahead of Dev`). A component with a real `Design System
   Link` but absent from the live registry is `Figma Only / Not Yet Shipped`, a different claim
   than `Design System Gap` (nothing in Figma *or* code — no Asana task at all is itself gap
   evidence, not a blocker to citing one).

## Step 1 — establish the design-system composition

Core is always in play. Resolve which of the three modes explicitly (Expected input above), don't
guess from a project name alone:

1. **Core only** — Step 3 checks every component against Core alone.
2. **Existing project DS** — Step 3 checks against that project's own site (and repo, if any) as
   primary authority for what it covers; Core governs the rest. This build reuses, doesn't
   compose.
3. **Core + new composed layer** — Step 3 checks Core first; anything this build originates gets
   flagged `Design System Gap` in Step 4's table, since it's created here, not pulled from an
   existing library.

## Step 2 — clear the requirement before building

Walk Requirement collections (source 3) — hub → Project → Feature/Epic → User Story leaf — for an
existing entry first. Resolve what you can from the leaf's own content plus other knowledge
sources.

**Prefer the real tool over improvising.** If a convergence-sheet JSON exists, run it through
กัน's `requirement-intake` (source 6) and present its `single-question-bundle` — only
`changes_ui_shape: true` decisions. No convergence sheet → ask the user directly, but only
questions that would actually change the UI's *shape* (a prototype built on a wrong shape
assumption wastes the whole downstream chain). Record non-blocking questions instead of raising
them.

**Writing back to Requirement collections:** whether or not you asked the user anything, write the
outcome onto the User Story leaf (upsert — read `html_text` first, never overwrite). Create
missing Project/Feature-Epic levels first if needed (same tree-building `asana-requirement-log`
uses) rather than bolting onto an unrelated branch. Update the leaf's **Clarifications** section
specifically — append what's now understood, what was ambiguous, how it resolved (existing
knowledge vs. asked the user) — never touch User Story/Acceptance Criteria, those stay verbatim.

**Writing research gaps back:** whenever Step 4 flags a genuine research gap, also write it onto
the *same* User Story leaf under a new optional **Research gaps flagged** section (additive, same
pattern as `asana-requirement-log`'s "Related prototype runs") — not just the prototype's own
panel. Each entry: screen/decision with no support, dated, one-line recommendation. Read-then-
merge — append, never overwrite or re-list an existing gap entry.

## Step 3 — build the prototype, DS-first, gaps placeholdered not blocked

Nothing here touches Figma.

**"Using" a component means installing it from that DS's real registry** —
`npx shadcn@latest add <docs-site>/r/components/<slug>.json` (`cds-bbl`, `mbds-bbl`, or
`webds-bbl`, whichever's in play) — **never hand-authoring HTML/CSS that merely renders close to
the DS site's values.** A hand-written twin of a shipped component is a defect no matter how
closely its hex/px values were copied — copying by hand can't follow a mode axis (theme, density,
shape, device, language) the way an installed, token-bound component does. Every installed item
pulls in that system's foundation (token/class layer + web font) automatically; components with no
foundation styling is itself a tell something was hand-drawn.

**Standing rule, not a per-run judgment call:** every run pulls color/font/token/component exactly
from the real registry/live site, never an approximation, regardless of delivery target (dev
server, single-file Artifact, anything else). The target changes *how* real values reach the
output (see "Single-file Artifact" below); never *whether* they're real.

Before writing any UI for a screen, call that DS's `search_components` (`list_templates` for
MBDS's whole-screen templates; `get_pattern` for webds's screen-region patterns — weaker claim
than a component, prefer a component when one fits). Never write a literal color/spacing/radius/
font-family value presented as this DS — every value resolves to a real token/class. A delivery
format that makes a real install physically impossible at runtime is a format constraint to solve
(see below), never a license to hand-author a look-alike.

**Pull a component's full real context before finalizing usage — not just enough props to
render.** Call `get_component(slug)`, read its `guidance` (usage, when-to-use/not, any
context-dependent variant choice — e.g. which `color` variant fits which surrounding surface) and
its `gaps` (declared-but-unimplemented properties). Two real defects from skipping this: a `Text
Field` missing its own declared "Has Start Icon" gap and aria-label guidance; a `Tab` used with
`color="Neutral"` on a surface whose background matches `Neutral`'s own selected-pill token
exactly — the tab's own guidance already named the correct variant for that surface, only found by
resolving the actual token, not a screenshot. Standing from first install onward, every time. When
a real declared gap must be filled, fill it as a disclosed local completion (code comment citing
the real gap), never an invented prop pretending to be upstream — reflect it honestly in the DS
Evaluation table's `note` field, not hidden and not downgraded to a full `Design System Gap`.

For each screen/section the requirement implies:
1. **Component exists** (governing DS site, or `cds-consumer`'s `COMPONENTS.md`/`REGISTRY.md` —
   preferred on disagreement) → install and use with real props/variants; don't redraw it even if
   its values are fully known.
2. **Component doesn't exist yet** → check `cds-consumer`'s `DRIFT.md` first (an owner may have
   already ruled this deliberate). Still a genuine gap → mock it freehand, clearly labeled as a
   placeholder — never let it look indistinguishable from an accurately-rendered real component.

The requirement is the priority throughout — mostly-real-DS with some flagged placeholders,
shipped on time, is the correct outcome, not a reason to stop and wait.

**Device frame for mobile/tablet.** Wrap the rendered screen in a realistic device bezel sized to
the viewport, with its own internal scroll (not the full page) — fixed frame height, content
taller than that scrolls *inside* it. Don't scale one generic frame for both; a tablet frame is
wider/shorter-relative-to-width than mobile. Defaults (use unless the requester states otherwise):
**Mobile** 375×812, **Tablet** 768×1024, **Web/desktop** no bezel at all (plain render — "web"
means the absence of a frame, not a smaller one). If viewport isn't stated, ask rather than
assuming mobile.

## Step 3b — verify before calling it done (do not skip)

Before presenting any screen as "built with CDS"/"MBDS"/etc., run that system's own audit and fix
everything it flags — never report done with an open `error`:

```
curl -sO https://cds-bbl.vercel.app/audit.mjs && node audit.mjs .
```
(swap host for `mbds-bbl.vercel.app`/`webds-bbl.vercel.app` when that system governs the screen).
Exit code 1 = defects, fix them. The script is single-system-aware — it can misflag another
installed system's own correctly-installed files as "modified"/"collision" from name coincidence;
read every flag before treating it as real, but don't wave away a genuine one either. Then run
that system's `verify_code` on every screen, for every DS variant a compare toggle builds (CDS,
MBDS, webds each verified separately — one clean pass doesn't clear the others). Any
`severity:"error"` finding is a defect to fix, not a note to mention and move past — except a
finding only in the token-*definition* layer itself (values a foundation file states once, by
necessity), which isn't a defect.

## Dark theme (and other real DS mode axes with the same trap)

Dark mode is a real, requestable mode axis in CDS/MBDS/webds — a genuine `[data-theme='dark']`
token block from the DS's own Figma modes, not a cosmetic filter. Apply `data-theme` at the
**true root** of the rendered tree — a narrower scope leaves anything outside it (shared
background, status bar) resolving the wrong theme while everything inside looks right (a real
WCAG failure found this way: white-on-near-white, 1.09:1).

**The "-inverse" flip trap.** A token named with "inverse" (e.g.
`surface-neutral-primary-inverse`) can deliberately mean *the opposite of whichever theme is
active* — dark navy in light mode, near-white in dark mode, by design. Correct CDS behavior — the
bug is code assuming that surface stays dark forever and hardcoding a matching
`rgba(255,255,255,X)` text/border color instead of reading the token's own paired `-inverse`
content/border family (`content-neutral-primary-inverse`, etc.), which flips in lockstep and stays
correctly paired in both themes. Grep for hardcoded `rgba(255,255,255,`/`rgba(0,0,0,` near any
`-inverse` surface token before calling dark mode done.

**The fixed-light-surface trap — more common.** CDS's `surface-accent-*` and
`surface-{positive,negative,warning}-primary` tokens stay a fixed light pastel in **both** themes.
The `content-{success,danger,warning,brand,accent-*}` tokens that look like their natural pairing
actually **flip lighter** under dark theme (built for the app's own dark canvas, not these
always-light tinted cards) — naive pairing turns "readable dark text on pale card" into "pale on
pale," often under 2:1. Use the correct non-flipping pair instead:

| Fixed-light surface | Use this content token |
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

**Systemic, not a one-off** — one build had this recur in 8+ unrelated files (sidebar nav,
dashboard cards, a passcode-error state, a stat-card row, a tone-pill component) once actually
swept for, after the first instance was fixed in isolation and reported done. Fixing the one
instance you were told about ≠ fixing the class of bug — before calling dark mode done, grep every
file for `surface-accent-`/`surface-{positive,negative,warning}-primary` and check the paired
content token on each result.

**A shared component's color variant can be correct in one usage and wrong in another,
simultaneously.** A `Tab`'s "On Neutral Primary Inverse" variant has a correct, non-flipping
SELECTED pair — but its UNSELECTED label reads from the generic flipping
`content-neutral-primary-inverse`, correct only when the tab bar sits on a surface that itself
flips with theme. The same variant on an *ordinary* dark surface (dark because the theme is dark,
not because it's inverse-flipping) gets SELECTED right and UNSELECTED wrong — while a blanket fix
applied everywhere breaks the first, correct usage. Scope a targeted override precisely (a
dedicated class at only the call sites that need it), verify it doesn't regress an
already-correct usage elsewhere, and measure both states' actual computed contrast before/after —
never fix by guessing.

**Standing verification.** After touching dark mode, run a real computed-contrast sweep — inject a
WCAG relative-luminance checker (`getComputedStyle` on every visible text node, walk to the actual
effective background, compute the real ratio, flag under 4.5:1 normal / 3:1 large text) across
every screen and every dimension-switcher state, not just the screen that prompted the fix — a
component can pass on one screen and fail the identical pairing on another because the two sit on
differently-behaving surfaces. Treat SVG `<text>` specially — its color comes from `fill`, not CSS
`color`; a scanner reading `color` on SVG text reports a false positive.

## Fork orchestration and independent verification

Whenever a build spawns a background agent/fork for real implementation work, its final report —
"done," "verified," "published," "no errors" — is a **claim to independently check, not a fact to
relay**, even when it was told to run `verify_code`/the audit script itself; re-run the check from
the orchestrating session before telling the requester it's done.

- **Verify against the real, running artifact**, not the fork's description — `getComputedStyle`/
  `getBoundingClientRect` for a layout/color claim, a real simulated interaction for a behavior
  claim, `read_console_messages` for a "no errors" claim. Two real defects were only found this
  way, neither visible from a screenshot: a component not stretching to fill its flex wrapper, and
  a WCAG contrast failure from a background color resolving outside its intended theme scope.
- **The orchestrating session owns publishing, not the fork** — tell every fork not to publish;
  publish only after independently verifying. A fork that publishes anyway risks the requester
  seeing an unverified state if the check gets interrupted.
- **Redirect or stop a fork the moment direction changes mid-flight** — don't let it keep working
  toward an outcome about to be discarded; have it report partial state rather than finish/publish
  moot work.
- **Never run two forks concurrently against the same files** — sequence them, second starts only
  after the first's result is verified and merged.
- **When redesigning an interaction**, check what richer pattern the codebase already uses for a
  comparable decision before reaching for the simplest primitive (a plain toggle communicates only
  "on/off," not "what") — reuse an existing richer pattern for consistency when one exists.

## When the deliverable is a single HTML file / Artifact

An Artifact's CSP blocks every external host except Google Fonts — no runtime fetch of CSS/fonts/
a shadcn registry, no build step inside it. **A delivery-format constraint, not a license to
fall back to hand-authored look-alike CSS** — Step 3 still applies in full. Correct sequence:

1. Build the screen as a real Vite+React project **outside** the artifact sandbox (a scratch
   directory).
2. Install every component from the real registry (same `npx shadcn@latest add ...` as Step 3) —
   pulls in the real foundation and component code, unmodified.
3. Inline the system's web font(s) as `data:` URIs in place of the foundation's `url(...)`
   references (BBL Sans is ~14 files/~620KB as of writing — check the current foundation CSS,
   don't assume that count still holds).
4. Inline whatever components fetch at runtime rather than importing statically (e.g. CDS's `Icon`
   fetches an SVG sprite per size) — shim `window.fetch` to answer with the inlined sprite so the
   fetch resolves inside the sandbox instead of silently failing.
5. Build with `vite-plugin-singlefile` (or equivalent) so markup/styles/fonts/icons collapse into
   one file with no external references.
6. **Verify before publishing — the plugin doesn't catch everything.** It inlines built JS/CSS but
   nothing a component fetches by a *runtime* string path (icon sprite fetch, an icon mask-image
   pointing at `public/`) — invisible to it since they're computed in-browser, not imported in
   source. Grep the built HTML for the DS's font/asset hostnames and the icon base path; inline
   anything still there (a small generated data-URI map keyed only to names this build actually
   uses). `<script type="module">` doesn't need stripping — confirmed fine in-sandbox by actually
   loading the built file and checking `read_console_messages`, not by assuming a clean build log.
   Serve `dist/` with a plain local static server to preview — `file://` is blocked by browser
   automation tooling.

**A real cold-load can genuinely take 10–20+ seconds** for a full component tree plus an inlined
web font (~2MB total is normal) — expected sandboxed-iframe load, not a broken build; a quick
"wait a couple seconds, still blank" check can misread a still-loading page as a crash. Give a
fresh load real time before concluding a publish is broken. If a render failure is still
suspected, verify with a non-destructive **on-page error overlay** (`try/catch` around the root
render call + `window.addEventListener('error'/'unhandledrejection')`, writing any caught error as
visible DOM text) — browser-extension console tools only capture the top-level wrapper page's
console, not the artifact's own sandboxed iframe, so a real crash inside can read as "zero console
errors." Remove the overlay before final publish. Republishing to an artifact URL not freshly
`read` this turn can be refused ("identical content, resent unchanged") even with real new
changes — call `read` once on the target before retrying a just-refused publish.

**Two DS systems in the same project (a compare build) collide on token names unless scoped.** CDS
and MBDS each publish their own `:root {...}` block; where both use the same token name (several
do, apparently by convention not coordination) the textually-later one in the merged stylesheet
silently wins for *both* systems, since custom properties cascade regardless of which file
declared them. Fix by re-targeting each system's `:root` (and `.dark`) to a scoping class —
`.ds-cds`/`.ds-mbds` — and mounting each system's subtree inside a wrapper carrying that class.
Selector-only edit, never touch a token's value, do this before wiring the compare toggle.

**Same scoping applies even with only one system rendering** — when mode 2's project DS doesn't
cover something, Core fills the gap, but that Core component still resolves via `.ds-cds`; a
screen otherwise entirely scoped to the other system has no `.ds-cds` ancestor for it to inherit
from. Wrap just that leaf usage: `<div className="ds-cds" style={{display:'contents'}}>` — narrow
enough to give the borrowed component real CDS values without pulling the other system's own
components (rendered as children elsewhere on the same screen) into CDS's scope too.

Never skip to CSS that merely *looks like* the DS because the real pipeline is more work — that's
exactly the defect Step 3 forbids (wrong tokens under a mode switch, missing type-scale classes,
wrong font loaded). If the pipeline is genuinely infeasible for a request, say so and ask before
falling back to anything else — don't decide unilaterally that hand-authored CSS is acceptable.

## Step 4 — presentation mode

A walkthrough view (or whatever presentation surface the tool supports) with per-screen dynamic
content, live dimension switchers, and click-to-highlight rows.

### Chrome mechanics — literal spec, same on every build

Measured off a real published prototype (staff portal, 2026-08-30) — these are the **standing
literal labels/structure**, not this one build's styling choice. Every build uses these same
words and the same two-panel split so a reviewer who has seen one build recognizes the next:

- **Collapsed state (default on load)**: a small pill — `🎭` emoji + a 6-dot drag grip
  (`aria-label="Drag chrome"`), `cursor:grab`. Click anywhere on the pill (that isn't a grip drag)
  to expand.
- **Expanded header**: shows `🎭` + the label **"Presentation Mode"**.
- **Exiting is a separate action from collapsing.** Inside the expanded chrome, a button reading
  **"Exit Presentation"** (`🎭` + text) removes the chrome entirely and returns to the plain
  product view — collapsing (back to the pill) is a minimize, not an exit; don't conflate the two
  or invent different wording for either.
- **Two independently collapsible panels**, each its own docked column with its own header row
  (label in `type-label-lg-emphasized` style + a `chevron-up`/`chevron-down` icon-button toggle,
  `aria-label="Collapse panel"`/`"Expand panel"`):
  - **"Prototype Settings"** — every live switcher this build has (see "Live switchers, not gated
    compares" below). Header toggles the whole panel; individual switchers inside don't collapse.
  - **"Design Review"** — the per-screen sectioned content (see "Panel section order" below).
    Each section inside is *also* independently collapsible (its own title + open/toggle state),
    nested one level under the panel's own collapse toggle.
- **Draggable**: the drag grip lives on the collapsed pill itself, not a separate bar — the
  requester drags the pill (and everything expands from wherever it was last dropped) out of the
  way of whatever they're looking at.
- **Theme-independent by default**: if the product has a dark-mode switcher, pin the chrome's own
  root to `data-theme="light"` regardless of the product's current theme, so it re-resolves CDS's
  real light-token block — a fixed light background reads easier for reviewer tooling than one
  that dark-switches with the screens it's reviewing. Only follow the app theme if asked.
- **Must not silently block clicks on the product below it**: a `position:fixed` column-flex
  wrapper with `alignItems:'flex-end'` shrink-wraps its hit-testable box to its WIDEST child — the
  empty space beside a narrower child still intercepts pointer events for what's underneath, even
  though nothing paints there (invisible from a screenshot; only `document.elementFromPoint` on a
  dead click reveals it). Set `pointerEvents:'none'` on the shared outer wrapper,
  `pointerEvents:'auto'` explicitly on each real visible child (collapsed pill, dimension bar,
  panel) — never leave the outer box at default `auto`.
- **A plain either/or setting** defaults to the lightest correct treatment — label + real
  `ToggleSwitch`, active side emphasized — not a heavier paired-card affordance unless the
  requester's own reference specifically shows cards or the content needs more than a label.

### Live switchers, not gated compares

A switcher exists for a dimension whenever it has more than one real named state — **one named
guide plus the system's own baseline already counts as two states.** The old rule requiring an
explicit two-name comparison now only governs whether the panel's *prose* frames it as a requested
comparison, not whether the control exists.

| Switcher | States | Mechanism |
|---|---|---|
| **Design System** | Core alone / named existing project DS (mode 2) / Core + composed layer (mode 3), plus a second project-layer link if given | Real token swap (e.g. `data-ds` attribute driving a second CSS token block) on top of the same Core base — same screens/content, different project layer. Never a second copy of the prototype. |
| **Branding** | No guide (CDS/Core baseline) + every named guide (often one) | Swaps branding-driven visual identity per the active guide's rules. A needed color/token the DS doesn't have yet gets invented and tagged `Design System Gap` — never presented as if from the DS. **Exception:** an explicit "exactly ONE Branding Theme, no other choices" instruction removes the switcher entirely (state, control, and any CSS/token scope for the retired option) — a control pointed permanently one way is still a visible second "choice." |
| **Tone of Voice** | Plain/ungoverned copy + every named guide | Swaps every real copy decision on the current screen. **Every state must be in the same language** — the switcher shows a *feeling* difference (formal/casual); mixing languages shows a language switch instead. Pick the screen's natural language and write every state in it, even if a named guide's own examples lean toward a different language. A dedicated **Language** switcher (Thai/English UI copy) is separate and independent — don't cross the two into one combinatorial control unless specifically asked. |
| **Design Option** | `Original` + `Option 1`/`Option A` — a genuinely different information architecture, never a relayout of the same grid | **Only when explicitly requested** — genuinely gated, unlike the three above, since a second full layout is real design work. Swaps which component tree renders; the DS Evaluation table reflects whichever option is selected. See "Design Option scope" below. |

A dimension with genuinely one state (nothing named, nothing to fall back to) simply has no
switcher for this build — don't fabricate a second state. When two sources were explicitly named
as a comparison (Expected input's "Compare request"), the panel's prose for that dimension says so
plainly rather than reading as open-ended exploration — the only thing that rule still decides.

**Design Option scope — resolve before building, per Expected input:**
- **Screen-scoped**: switcher lives on, and only affects, the one screen it was built for.
- **System-wide**: **one** state drives every screen and every piece of shared chrome (sidebar/
  nav, top bar, modals) together, in a single action — never independent per-screen toggles for a
  system-wide request (two screens showing two different "current" directions isn't one coherent
  alternative experience, it's an inconsistency). When the option is a genuinely different design
  direction (not just a color), prefer swapping a semantic token family (e.g. an accent color
  family via a scoping wrapper class) over a full light/dark theme swap — a theme swap touches far
  more surface area and is easy to leave a real contrast defect in; if a theme swap is genuinely
  wanted, measure actual rendered contrast (real computed colors, WCAG 2.1 ratio) before calling it
  done. A distinct interaction mechanism (not just a skin) is a legitimate part of a system-wide
  option too — keep both mechanisms' state/handlers unconditionally declared, only the render
  branch conditional on the active option.

### Per-screen data & focus interaction

- Keep a per-screen data structure (screen id → that screen's own insight cards/DS rows), built
  from Steps 1–3's knowledge as it actually applies to *that* screen — not one global list reused
  everywhere. When the viewer switches screens, re-render the panel's sections from that screen's
  own data — don't just toggle screen visibility and leave the panel untouched.
- An insight genuinely applying to the whole flow (not one screen) goes in its own "Flow-wide"
  group so it isn't lost when switching screens, rather than duplicated identically into every
  screen's section.
- **Every clickable panel row refers to something real on the actual rendered screen.** Clicking
  highlights and scrolls to that element, inside the device frame's own internal scroll (never the
  whole page) — a temporary outline/glow using a DS feedback/accent token, fading after a couple
  seconds or on next click; never a persistent highlight. Attach a stable identifier to each
  meaningful element **while building the screen** (Step 3), not bolted on after the fact once
  Step 4 needs it. A row with nothing sensible to point at (the Requirement-summary card, a
  "reviewed — not applicable" research card) simply isn't clickable.

### Language

Panel section headers, card titles, summaries, and rationale default to **Thai** — the team's
working language, read by BU stakeholders in a walkthrough. English only if specifically asked.
Copy actually rendered on the product screen still follows the named tone-of-voice guide — this
default is about the panel's own explanatory text, not a rule to translate product copy.

### Panel section order

1. **Requirement summary** — the one section constant across every screen. One card: what's being
   built and why, plain terms, paraphrased from Step 2's resolved requirement, linking to the
   Requirement collections page this run wrote/updated. If never formally logged there, say so
   rather than presenting an informal paraphrase as if it were. Not clickable — describes the whole
   build, not one element.

The rest are **per screen** — re-render fully from that screen's own data on every screen switch:

2. **Research Insight** — cards: title, summary, an explicit *why this design does/doesn't yet
   address it* line (cite the specific finding, not "informed by research" abstractly). Include
   what was reviewed and judged not applicable, not just what was used. **Every card links back to
   the specific Asana report(s) it draws on** — same discipline as the Requirement summary card's
   link; a multi-report card links all of them. Clickable per focus interaction where it maps to a
   real element. A flow-wide insight goes in its own group (see above).

   **Keep real insights and the gap-flag list as two genuinely separate arrays.** A screen needs
   both a real `researchInsights` array (Insight/Applied to Design/Source, only from a report
   actually read this run) and a separate gap-flag list (decisions with no backing) — render both.
   Never let the gap-flag list be the only field, and never let it stand in for a real insight.

   **Research gap flag — distinct from "reviewed, not applicable."** If a screen's decision has
   genuinely nothing in the Research index at all (never covered, not "exists but doesn't apply"),
   show a visually distinct card (e.g. "🔬 ยังไม่มีข้อมูลวิจัยรองรับ") naming the unsupported decision
   and recommending research investigate — then write the same gap onto the User Story leaf (Step
   2's "Writing research gaps back") so the research team finds it there too, not only inside a
   prototype they may never open.

3. **UX Rationale** — cards citing the **Design Knowledge** tree (source 8), not Research —
   design-principle/platform evidence, a different kind of citation than user-behavior research or
   a named copy/branding rule. Each card: which decision it justifies, the specific principle, a
   link to the real Design Knowledge page. Same cite-the-source discipline, same click-to-
   highlight. If Design Knowledge genuinely covers nothing for a screen's decisions (real
   possibility — much of the tree can be empty), say so plainly rather than inventing generic UX
   platitudes attributed to a source that doesn't back them.

4. **Branding** (its own section, directly above Design System Evaluation) — for every real
   branding decision, cite the specific rule from the *named* guide(s) — never a vague "on-brand."
   Swaps with the Branding switcher. No guide named → say so plainly, don't assert compliance with
   nothing to check against. **A source guide can be honest about its own gaps — reflect that,
   don't paper over it** (a workshop deck may itself mark sections "Under development" as of its
   authoring date — say so for whatever pillar it affects rather than presenting it as settled).

5. **Design System Evaluation** — a **flat, per-component table**, not a list of screen-context
   rows. One row per real component actually used on this screen (for whichever Design Option is
   selected, if that switcher exists):
   - **Component** — real name (e.g. "Button," "Chip," "List Item," or the bespoke gap's own
     descriptive name).
   - **CDS docs link** — `https://cds-bbl.vercel.app/#/components/<slug>` (swap host per mode).
     Gap rows have none.
   - **Figma link** — the real per-component node from the **Core Design System Library
     (Inventory)** Asana project (source 9) — never invented, never the library's bare root. No
     Asana task and no live registry entry (most bespoke gaps) → no Figma link; that absence is
     part of the gap evidence.
   - **Implementation Status** — exactly one of four, no fifth invented:
     - `Shipped in Code` — installed from the real registry, actually rendered here.
     - `Figma Only / Not Yet Shipped` — real Figma component, nothing in the live registry yet.
     - `Design System Gap` — nothing in Figma *or* code for this need.
     - `To Be Verified` — genuinely couldn't resolve status from either source — say so, don't
       force a guess into the other three.

   Cross-check the Inventory's `Code Status` against the live site before trusting it (source 9
   drifts); say so in the table when you correct a stale row, don't silently override. Per screen,
   not one flow-wide list (see "Flow-wide report" below for the one sanctioned exception). Every
   row clickable per focus interaction.

   **Prove the Figma-link source was actually queried, not just that the column exists.** Before
   presenting the table as done, confirm you called `get_tasks` against gid `1217578024173799`
   this run and can point to at least one row with a real resulting link — a table where every
   single row's Figma Link is blank is only correct when every row on that screen is a genuine
   `Design System Gap`; otherwise the query was skipped, not genuinely empty.

   **Code Readiness summary line** — directly under this section's title (per screen; the
   Flow-wide report view gets its own separate line the same way), derived from real row data,
   never hand-typed:
   ```
   Code Readiness: XX%
   พร้อมใช้ซ้ำ X · ต้องปรับแก้ X · ยังไม่มีใน Design System X (จากทั้งหมด X component)
   ```
   `พร้อมใช้ซ้ำ` = `Shipped in Code` count; `ต้องปรับแก้` = `Figma Only/Not Yet Shipped` +
   `To Be Verified` combined; `ยังไม่มีใน Design System` = `Design System Gap` count;
   `Code Readiness %` = พร้อมใช้ซ้ำ ÷ total rows, rounded whole number; "จากทั้งหมด X component" =
   that screen's total row count.

   **Flow-wide report is opt-in, never inline.** "Per screen, not one flow-wide list" is absolute
   for the default table — repeating shared-chrome rows across screens is correct, not a smell.
   If the repetition is genuinely worth collapsing, add a small opt-in control next to the section
   header (e.g. "ดู DS Report ทั้งหมด" — a modal or expand-in-place) that opens the shared-chrome
   rollup as its own separate view — never shown by default, never replacing any screen's table.

6. **Copywriting** (after Design System Evaluation) — for every real copy decision, state the
   wording chosen and cite the specific rule from the *named* tone-of-voice guide — never a vague
   "per guidelines." Swaps with the Tone switcher; no guide named → say so plainly. **Link to the
   named guide's actual Asana detail page** — same discipline as Research Insight/UX Rationale.

   **The example text shown must be the literal string the live component renders, not a
   hand-authored parallel example.** Before citing a screen's copy as evidence of a guide's rule —
   especially claiming it differs between tone/language states — grep the actual component source
   for that string and confirm it's really reachable from the running app under the state
   described. If it doesn't yet vary that way, either make the component actually vary it (if the
   guide's rule calls for it) or say plainly "this string reads identically under both guides" —
   never show two examples the code can't produce.

## Fixing or replacing an existing prototype

If the requester points at a previous run's prototype to fix, check ownership first — the artifact
tool can only read/republish an artifact this session owns. "Shared, not owned" (or no separate
source file anywhere) can't be patched in place, however small the fix looks:

1. Diagnose what's actually wrong first (screenshot, console — don't guess from the name alone).
   The fix path differs for a live bug vs. simply predating a current rule (e.g. pre-dates the
   real-component-install requirement, so it may carry that defect too even if nothing looks
   broken on screen).
2. Confirm with the requester before spending the effort — a full rebuild isn't a small fix; they
   may just want to know what's wrong.
3. Rebuild on the current skill version using the same inputs (screens, DS mode, branding/tone
   guides, compare toggles) the original used — pull from the Requirement collections leaf's
   Status/Clarifications if the original request itself isn't available.
4. Publish as a new artifact (never force-publish over one this session doesn't own), then update
   the leaf's **Related prototype runs** — append the new entry, mark the old one superseded with a
   one-line reason. Never delete the old entry; the run history is what shows what changed and why.

## Final chat summary

- Which DS composition mode was used (name it if reused) and whether it had to be asked; which
  tone-of-voice/branding guide(s) were used, if either applied.
- Which live switchers actually appear in the chrome and each one's states — confirm explicitly
  when a dimension has none, so it's clear that's because it genuinely had one state, not an
  oversight. If a Design Option switcher was built: its scope (screen-scoped/system-wide), what's
  actually different structurally (not just "it's different"), and whether it carries a distinct
  DS token identity or interaction mechanism, not just a different layout. Name which dimensions
  were framed as a requested comparison vs. an open exploration switcher.
- If implementation ran via a background fork: confirm its "done"/"verified" claims were
  independently re-checked from the orchestrating session (real computed styles/DOM measurements,
  simulated interaction, console check), not just relayed — name anything verification
  contradicted.
- Confirm focus interaction is wired (Research Insight/UX Rationale/DS Evaluation rows highlight
  their real target on click) and note any row deliberately left non-clickable.
- If the build has a dark-mode switcher: confirm a real computed-contrast sweep ran, which
  screens/states, and any real defect found/fixed — not just "dark mode added."
- Confirm each screen's Research Insight renders real insight cards (not just the gap-flag list
  standing in), each with a source link — for any genuinely sparse section (Research/UX Rationale/
  Branding), confirm the underlying source was freshly re-read this run and is actually sparse
  upstream, not assumed broken.
- If a Branding/Tone dimension has an explicit single-theme instruction: confirm no switcher
  control exists for it at all. If a Copywriting card claims a tone/language difference: confirm
  the cited example is the literal text the live component renders under that state.
- Whether UX Rationale had real Design Knowledge content to cite per screen, or was honest about
  finding nothing — don't let this read as "done" if most cards just say "no rationale found."
- Requirement questions resolved and how (existing knowledge vs. asked the user), confirming the
  resolution was written back to Requirement collections.
- Screens built, and for each: real-DS component count vs. placeholder count.
- Design System Evaluation findings per design option — component names and status (all four
  values) — not just "table built." Flag any Asana-inventory-vs-live-evidence disagreement and
  which won and why. Confirm the Inventory project (source 9) was actually queried — cite a real
  resulting link, or confirm every row is a genuine gap if none — and state each screen's Code
  Readiness %.
- Confirm no "Flow-wide" DS Evaluation section shows inline by default — only ever behind an
  opt-in report control if built at all (Research Insight's own Flow-wide grouping is unaffected).
- Any research gaps flagged, which screen/decision, and confirmation each was written onto the
  User Story leaf.
- Any knowledge source missing/empty/unreachable/unlinked — say so plainly. Whether
  `cds-consumer`/`agent-design-kit` synced successfully, and whether the real `requirement-intake`
  tool ran or the manual fallback was used.
- Explicitly invite correction if any step didn't behave as described — this skill is corrected
  from real runs (see `CHANGELOG.md`), and every future defect found keeps it accurate.

## Out of scope for this skill

- Extracting the prototype into real Figma frames — `ds-extract-prototype-to-figma-canvas`, a
  later step in the Requirement → Applied chain.
- Auditing the resulting screens against the DS with full classification (Existing DS Issue vs.
  Gap, `DRIFT.md` checks, Context Knowledge growth) — `ds-governance-audit-asana`, run later after
  wireframing/binding are both done.
- Migrating `Copy Writing Guideline`, `Requirement collections`, or `Bradning Guidline` content
  from wherever it used to live — this skill reads/writes these Asana pages as they are; filling
  them in initially is a separate task.
- Creating any row in 📋 Component issue — this skill never writes to that database.
