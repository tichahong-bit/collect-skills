---
name: ds-extract-prototype-to-figma-canvas
version: 0.19.0
description: Extracts a non-Figma prototype (e.g. an HTML/web prototype from ds-governance-prototype-notion or ds-governance-prototype-asana) into real Figma frames, binding each screen to the Design System and composing/annotating anything the DS doesn't cover yet. Composes figma-generate-design with โย's (Yo's) cds-consumer .skill files and ds-governance-audit-notion's annotation convention. Second step of the Requirement → Applied workflow, between prototyping and manual UX/BA wireframing. Defaults to the WHOLE screen unless the caller names a narrower scope. Run end-to-end and corrected 19 times as of 2026-09-02 — see CHANGELOG.md for the full defect history behind every rule below.
---

# Extract Agent

Translates a prototype screen into a real, DS-bound Figma frame: real components where the DS has
them, real tokens on everything (including freehand pieces), real sizing behavior matching the
source's CSS, and a clear annotation on anything genuinely new. `CHANGELOG.md` in this folder has
the full story behind every rule here — read it when you want the "why," not to run the skill.

## Expected input

- **Prototype source** (required) — a link to, or file for, the prototype to extract.
- **Target Figma file** (required) — the Figma file screens should be placed into.
- **Design system project** (optional, but ask if missing) — link to the Core or Project DS
  library to bind against. Without this, Step 2 has nothing to bind to.

**If more than one named option exists, stop and ask which one before building anything.** A
prototype bundle can carry multiple competing options side by side under the same screen — a
design option, a tone-of-voice option, a branding option, a design-system option, an A/B variant —
each fully coded and each a legitimate candidate for "the" screen. Building whichever one the
grep/search happens to land on first, or whichever looks more complete, is a silent, unrequested
choice on the caller's behalf. Detect this before Step 1 finishes (source naming a screen/component
with an explicit suffix like `OptionA`/`OptionB`, a variant switch/flag in the source, more than one
plausible match for the same UI role) and ask the caller which option to build — do not guess, and
do not build more than one without being asked. This applies every time multiple options are found,
not only on the first screen of a run.

- **Scope** (optional) — **defaults to the whole screen**: every element the caller can see or
  reach on that screen — persistent chrome (top nav, sidebar) plus every section/card, and every
  tab/state the screen exposes (see Step 0). A caller naming a specific section (e.g. "Risk level,
  กองทุนแนะนำ") narrows the build to that section only — treat a bare section/card name as an
  explicit narrowing, not as the caller silently accepting a partial screen. When scope is
  ambiguous or unstated, build the whole screen; do not default narrow to save tokens. A caller
  who genuinely wants only a fragment (e.g. to sanity-check the pipeline before committing to a
  full build) will say so, and can always ask you to expand to the full screen afterward — but
  redoing a partial build as a full one after the fact costs more total work than asking once
  up front when scope is unclear.

## Screen dimensions — default minimum size by device

Unless the caller states an exact size, or the source's own layout dictates a different one, build
the outer screen/shell frame at **no smaller than** these minimums for its device class (width
`FIXED`, height free to grow/hug beyond the minimum — never shrink below it):

| Device class | Minimum size (W×H) |
|---|---|
| Desktop / web | 1440×1024 |
| Tablet | 1280×800 |
| Phone / mobile | 375×812 |

Infer device class from the prototype's own layout (a persistent side nav + multi-column content
reads as desktop; a single-column, bottom-nav layout reads as phone) rather than guessing from the
product name alone. If content naturally requires more width or height than the minimum (e.g. a
wide data table), grow past the minimum rather than compressing content to fit it — these are
floors, not fixed canvas sizes.

## Step 0 — Find every tab/state the screen has, before deciding what "the screen" is

**Do this before Step 1.** A rendered prototype's default view can hide entire structural layers —
a screen with tabs shows only whichever tab loaded first; the others are real, separate content
that a visual screenshot pass will never reveal just by scrolling. A real run extracted a screen's
default tab faithfully, shipped it, and was only later discovered — by grepping the prototype's own
bundled source for its tab/state definitions — to have three more tabs, one of which (a fund
recommendation list) turned out to render as a completely different component shape (a real Table)
than the guessed equivalent built earlier (card list). Visual browsing alone had no way to surface
this: the other tabs never rendered without a click the browsing pass never made.

Before treating any screen as fully understood:

1. **Grep the prototype's actual source** (the bundled JS for a web artifact, or the component
   source file) for state/tab arrays — look for patterns like a list of `{key, label}` objects, a
   `useState` initialized to one tab's key, or a switch/ternary keyed on an active-tab variable.
   This is more reliable than clicking through the live UI, and doesn't depend on a flaky browser
   session.
2. If tabs/states exist, **scope covers all of them** unless the caller named one specific
   tab/state — build each as its own full screen (persistent chrome + that tab's content), not as
   fragments bolted onto one page.
3. Read each tab's real rendered content from source, the same way Step 1 reads the rest of the
   screen — don't assume a tab's content shape from what a *different* tab's similar-sounding
   section looks like (a "funds" list card and a "funds" data table are not interchangeable
   guesses of each other).
4b. **Finding real source for one piece of chrome does not retroactively fix a sibling piece of
   chrome already built from assumption.** A real run found and correctly rebuilt a sidebar from
   its exact source component — then left an already-built top header untouched, because the
   header had been built earlier, before source-grepping habit existed for this run, and finding
   the sidebar's source didn't trigger going back to check the header's. The header shipped with
   several real, concrete mismatches an actual grep would have caught immediately: wrong padding
   token (16px used where source specifies 24px), wrong fixed height (hugged to ~88px against a
   real fixed 72px), a search field built from a full CDS `Text Field` component where source is a
   plain bordered `<input>` with no label/hint chrome at all (a heavier real component substituted
   for a lighter freehand element — the wrong direction of the usual mistake), and a notification
   button with the wrong fill/no-border treatment. **The moment source is grepped for any one piece
   of chrome on a screen, grep it for every other piece of chrome on that same screen too** — a
   header, a footer, a rail — before considering any of them finished, even ones already built.
   Chrome pieces are siblings under the same parent shell in real source; treating them as
   independently "done" once each is individually screenshotted is how this kind of mismatch
   survives a full token sweep and a visual review (both passed on the broken header, because
   neither checks *layout against source*, only internal consistency of what was already built).

4. **This applies to persistent chrome too, not just tab content.** A sidebar/nav built from a
   remembered screenshot rather than the source's own nav-item array shipped with three real
   defects at once, none visible by eye from a static render: (a) the source marks 5 of 6 items
   `enabled:false` — only one is real, the rest render dimmed/non-interactive, a state a screenshot
   cannot reveal unless you already know to look for a subtle color difference; (b) two items'
   icons were `iconKind:'glyph'` (a local custom asset CDS has no equivalent for at all) while one
   was `iconKind:'cds', icon:'booking'` — an *explicit, authoritative* icon name sitting right in
   the source that was never checked, guessed via semantic search instead, and happened to guess a
   name (`mutual-funds`) that wasn't the one specified; (c) a segmented pill toggle that looked
   custom was hand-composed from frames instead of searched for — it was the same real `Tab`
   component (`Style=Fill - Pill`) already correctly identified for the tab bar elsewhere in this
   very extraction. **Any nav item, toggle, or chrome element with per-item state (enabled/
   disabled/selected) or an icon must be read from source the same way tab content is** — never
   inferred from a screenshot, and never assume a custom-looking control has no CDS match without
   searching for it by function (segmented control → search `tab`, `chip`, `toggle`) first.
5. **When source names the icon system explicitly (`iconKind:'cds', icon:'X'`), that name is
   ground truth — use it, don't run a separate semantic search that might return a different,
   merely-plausible slug.** Only fall back to semantic `find_icon` search when source gives no
   icon system at all, or explicitly marks it as a non-CDS/custom asset (`iconKind:'glyph'` or
   equivalent) — and in that second case, the correct outcome is often a genuine gap (CDS has no
   piggy-bank, package, or robot/AI icon; confirmed by search returning nothing close), not a
   force-fitted "close enough" substitute presented as if it were the real one.
6. **A keyword match in the bundled source is not proof that code is what actually renders.** A
   bundled prototype accumulates old drafts over its edit history — a real run found a component
   whose props, labels, and structure all matched the screen being extracted (right ids, right
   translation keys), extracted its copy faithfully, and shipped Figma text that didn't match the
   live prototype at all. The grepped function was a real, syntactically valid, completely dead
   leftover from an earlier design pass; a *different* function — using shorter labels and a
   different component entirely for the same UI role — was the one actually mounted and rendered.
   Static grep cannot tell live code from dead code; it can only tell you a string exists somewhere
   in the bundle. Before trusting any grepped copy/behavior for something the caller can also see
   rendered live (open the actual prototype, not a cached/earlier-fetched copy of its source), spot
   check the exact visible text or a distinctive prop value against what's on screen. If more than
   one function in the bundle plausibly implements the same UI role (same screen id, overlapping
   name, same translation-key namespace), treat that as a signal to verify which one is live before
   building from either — never assume the first or most complete-looking match is the real one.
   The same caution applies to a locally cached copy of prototype source fetched earlier in a long
   session: re-fetch fresh before trusting it, the same standard Step 1 already states for using a
   fresh read over an earlier round's summary.
7. **Finding one dead-code/stale-source mistake means re-checking every other component-vs-gap
   decision made the same unreliable way — not just the piece that exposed it.** A run had already
   "corrected" a screen's search field from a real CDS `Text Field` component to a plain composed
   `<input>`, believing source specified a plain input — a real, deliberate fix at the time. Much
   later, the same run discovered (per point 6) that a *different* element on the same screen had
   been read from dead code. Re-grepping the search field against the current live bundle then
   found it, too, was wrong: the live source uses a real `Text Field`, and the earlier "fix" to a
   plain input had been reasoning from an unreliable read the whole time. The dead-code discovery
   and the search-field mistake were found on different days, from different prompts, and were
   never connected until directly asked why the search field wasn't a real component. **Once any
   grep-vs-live mismatch is confirmed for one element, treat every other real-component/gap
   ruling on that screen — even ones already "fixed" and shipped — as unverified until re-checked
   against the current live render, not only the sibling still visibly wrong.** If re-checking any
   of these turns up a genuine gap (no real component after actually searching both sources per
   Step 2), it gets a real annotation the same as any other Step 5 finding — a defect only found
   during a later re-audit is not exempt from the annotation requirement just because it wasn't
   caught during the original Step 5 pass.

## Prerequisites

1. Load `figma-generate-design` (load `figma-use` first if any raw `use_figma`/plugin-bridge call
   is needed).
2. โย's `figma-build`, `figma-ds-consumer`, `ui-designer` are plain `.skill` files, not installed
   Claude Code Skills — read them directly (e.g. `~/design-system-repos/cds-consumer/skills/
   *.skill`); they won't resolve by name via the Skill tool. Read `figma-build` first — it's the
   mandatory companion for any build/edit/token-binding work and covers real Plugin-API traps (see
   the reference section at the end of this file).
3. `git pull` โย's `cds-consumer` repo before building, so `COMPONENTS.md`/`REGISTRY.md`/
   `DRIFT.md` and the `.skill` files are current.
4. Ensure the target file has both a **"Log Note"** (yellow) and an **"Unbound"** (red) annotation
   category — check with `figma.annotations.getAnnotationCategoriesAsync()`, create whichever is
   missing. Don't assume either exists; a fresh extraction target usually has neither.

## Step 1 — Translate the real structure

Read the **live prototype source** (or the live artifact) fresh for the specific screen you're
building — never an earlier round's summary or memory. A prototype can change between when it was
discussed and when this skill runs.

Find the real **outermost layout** (the App-level component's return, not one screen/shell file)
and mirror its actual parent → child → sibling order exactly — which element is full-width vs.
constrained, which sits above vs. beside which. Don't assume a shape (e.g. "sidebar beside a
topbar that's nested in the content column" vs. the source's real "full-width topbar above a
sidebar+content row" are both plausible-looking and easy to build wrong).

Translate the **full screen** — persistent chrome (nav, top bar) is a distinct structural layer,
built once and included in every frame, not just whatever tab is currently active. This is a
structural pass only: layout, hierarchy, content — not DS-binding yet (Step 2).

## Step 2 — Resolve every piece against the Design System

For each layer Step 1 produced, decide: real component, or genuine gap?

**Search two sources, not one, before concluding "no component exists":**
1. The DS's own MCP tool (`search_components`, `get_component`'s `guidance.usage`, `get_rules`).
2. The real maintainer's hand-maintained docs (`cds-consumer`'s `COMPONENTS.md`/`REGISTRY.md`) —
   grep it by the layer's likely name/category (e.g. "sidebar", "nav", "top bar"). **An MCP
   server's own component index is not guaranteed complete** — a whole real, already-audited
   shell (`Sidebar`, `Top Navigation Bar`, a purpose-built nav-row component) was missed for an
   entire extraction because only the MCP tool's search was checked. Both sources coming up empty
   is what actually justifies "no component" — either one alone is not enough.

**A gap ruling on a container doesn't extend to what's inside it.** A source comment or empty
search result about a *shell* (positioning, fixed-width column, sticky behavior) says nothing
about whether a candidate component exists for a *piece inside* it (a nav row, a list row) —
check that piece's own candidate component's `guidance.usage` for a documented matching example
separately. Split the ruling accordingly: shell freehand + annotated, interior rows real
components, is a normal, correct outcome.

**A source's own "DESIGN SYSTEM GAP" comment is evidence, not proof** — it documents that someone
checked at some point, using whatever they checked. Re-verify it yourself against *both* sources
above before accepting or overriding it; don't silently trust an old comment, and don't silently
override it with a component search hit that merely looks similar without confirming it's the
right one (check its exposed properties, not just its name — a generically-named component and a
purpose-built one for the same visual shape can be different components with different real
properties).

**Once a real component is confirmed:** install/instantiate it, read its actual exposed
`componentProperties` (don't assume where text lives — see the Plugin-API reference), and check
its resolved size against the real space it's going into — a library's own default instance size
can be wider/taller than the target region; set `layoutSizingHorizontal`/`Vertical` per Step 3
rather than trusting the default.

**Once a genuine gap is confirmed:** go to Step 5 (compose + annotate). Don't leave a raw
hand-built layer un-annotated — that's for `ds-governance-audit-notion` to catch later, and
catching it here first avoids duplicate work.

## Step 3 — Verify sizing (HUG / FILL / FIXED), top-down

Map the source's real CSS to Figma explicitly, for **every container level, not just the
leaves** — a row/grid container that should span full width needs its own `FILL` against ITS
parent, independent of whatever sizing its own children get (a `FILL` child inside a `HUG` parent
never reaches real available space):

| Source CSS behavior | Figma sizing |
|---|---|
| `flex:1` / `width:100%` / grows to fill | `FILL` |
| Literal fixed px, no flex-grow (e.g. a fixed-width sidebar) | `FIXED` |
| Content-driven, no explicit size either axis | `HUG` |
| Equal `1fr` grid/flex children | `FILL` each (add `constraints.horizontal='STRETCH'` on any non-auto-layout descendant, e.g. a component sitting in a `layoutMode:NONE` SLOT-workaround wrapper — `HUG` isn't valid there, only `FIXED`/`FILL` are) |
| CSS Grid default `align-items:stretch`, unset height | `FILL` vertical (not a guessed `FIXED` height) |
| **Non-equal ratio** (e.g. `1.3fr 1fr`) | **`FIXED` widths computed to match the real ratio** — Figma's `FILL` only ever splits space EQUALLY among siblings; there's no per-child weight. Setting both to `FILL` here is a worse mismatch than doing nothing. Verify the computed split against a live measurement, not just fr-math on paper, and note it in the summary as a deliberate exception. |

Apply this to outer chrome (topbar full-width/content-height, sidebar fixed-width/row-stretched
height, content column filling remaining width) and to every card/grid row, not just the cards.

## Step 4 — Verify token, font, and color binding

**Bind, don't approximate.** For every color — including in a freehand/composed piece — resolve
the real token (`resolve_token`, never guess), then `figma.variables.importVariableByKeyAsync(key)`
+ `figma.variables.setBoundVariableForPaint(paint, 'color', variable)`. A literal RGB that happens
to match a token's current value passes a casual look but isn't bound, and will silently drift the
moment the token's value changes. Same standard applies whether or not there's a component
instance to bind to.

**Match the exact token family the source names, not a same-hue substitute.** `content-accent-*`
and `surface-accent-*` (or `border-*`) can share a hue name and render very differently (a dark
readable text color vs. a pale background tint). If a data file or source names a specific CSS
variable, bind that exact one.

**A data-driven mapping (category → color/token) must be read from the real source data**, never
assumed by rotation. N categories getting N real accent colors in *some* order is not "close
enough" — read the actual `{category: {token: ...}}` structure and match it exactly.

**Never reuse a token key already resolved for one purpose as a shortcut for a new, unrelated
icon/color decision — resolve each one against its own real source spec.** A real run resolved
`content-neutral-secondary` once, correctly, for one icon early in a session, then reused that same
already-imported variable for every icon added afterward (a dropdown's start/end icons, a search
field's icon, a set of tile icons) purely because it was already on hand and looked plausible.
Source specified `content-neutral-tertiary` for these icon slots the whole time (visible directly in
the real component's own render, e.g. a Text Field's start-icon span: `color:
Kt('content-neutral-tertiary')`) — a different, lighter shade in the same neutral family. The
mismatch shipped identically across 12 separate icon instances on 3 screens because each one copied
the same convenient variable instead of re-resolving. Convenience reuse of an already-imported
variable is fine when the *same* slot/role is being repeated (e.g. the same icon color inside a
loop); it is not fine as a default for a *different* slot just because a variable is already
sitting in scope — resolve the token for what THIS element's real source actually specifies, every
time.

**The same data entity rendered in more than one place on the same screen set needs the mapping
verified at every occurrence, not derived once and trusted to carry over.** A real run correctly
found the source's risk→color map (`{High:'Negative', Low:'Positive', Moderate:'Info'}`) but still
shipped the "Moderate" badge wrong in **two different places** — `Warning` in a summary card view,
`Positive` in a table view — because each occurrence had its color set independently, in a separate
build pass, and neither pass was checked against the other or against the map itself. A visual
review of each occurrence in isolation passed both times; the mismatch only surfaced when someone
compared a screenshot against the real source's map value. When the same field (a risk level, a
status, a category) appears more than once across a screen or its tabs, verify all occurrences
against one written-down mapping, not each build's own guess.

**A value that depends on interactive/stateful behavior must be extracted from the real *default*
state, not from whichever value seems plausible.** A "propose to client" row can flip to a "sent"
badge after a click; the correct default for a freshly-loaded screen is the *initial* state
(check the real `useState` default — an empty set, `false`, `null` — not an assumed
already-interacted-with state). A real run shipped one row of an otherwise-identical three-row list
with the post-click "sent" badge while the other two (and the same data shown on a different tab)
correctly showed the default "propose" button — an inconsistency invisible from that one row alone,
caught only by noticing the same fund's status disagreed between two tabs. When a UI element's
content can change based on interaction, read the state initializer in source rather than
eyeballing a plausible-looking value, and check that every occurrence of the same underlying record
agrees.

**Text style, same standard:** every real `TEXT` node gets a real bound `textStyleId` via
`list_text_styles`/`resolve_token` equivalents — never a manually-set `fontName`+`fontSize` that
happens to look right.

**Run one full-frame sweep before calling binding done — don't rely on remembering which pieces
still needed it.** Checking "the obvious pieces" (a logo, a topbar) and stopping there missed 50
literal colors on one real screen (every stat card, every chart label, every legend row). Walk
every node in the frame once:

```js
function walk(node) {
  if ('fills' in node) checkPaints(node.fills);      // boundVariables.color present?
  if ('strokes' in node) checkPaints(node.strokes);
  if (node.type === 'TEXT' && !node.textStyleId) flag(node);
  if ('children' in node) node.children.forEach(walk);
}
```

Fix everything the sweep finds (map a literal color to its real token by RGB fingerprint against
`resolve_token` output), or annotate `Unbound` only when a literal genuinely has to stay literal
for a real, statable reason (Step 5).

## Step 5 — Compose real gaps, never leave a blank placeholder, then annotate

A component genuinely not in the DS gets a **real mockup**, composed from real tokens/primitives/
existing components — a chart from real color tokens on shapes, a layout from real spacing/radius
tokens — so it reads as part of the screen. Never a "[Placeholder] X" blank frame.

**Annotation content: a fixed bullet structure, not free prose — `**Existing Issue:**` /
`**Recommend:**` / optional `**Inform:**`, one short line each, concise and easy to scan.**

- **Existing Issue** — the gap/problem, stated plainly (what's missing, why it happened).
- **Recommend** — the concrete action the designer should take (what to fix, or what to ask Core
  DS for).
- **Inform** (only when it applies) — a real link to a matching task on the team's Asana
  "Component Issue" board, so the designer can see it's already tracked and reach the owner.
  **Only add this bullet after actually querying the real Asana board and confirming a genuine
  match for this specific gap — never assume or fabricate a "already submitted" state.** No match
  found (the common case for a brand-new gap) means no Inform bullet, full stop.

**Write the bold markers into `labelMarkdown`, not `label`.** `Annotation.label` renders `**text**`
literally as asterisks — `Annotation.labelMarkdown` is the field Figma actually parses for bold.
Setting `label` alone with markdown syntax in it ships visibly-broken formatting; always set
`{ labelMarkdown: text, categoryId }` and leave `label` unset.

Example (translate the specifics, not the structure):

> **Existing Issue:** ยังไม่มี component กราฟโดนัทใน Core Design Library จึงประกอบเองจาก ELLIPSE +
> token สีจริง
> **Recommend:** เสนอ Core DS เพิ่ม component กราฟโดนัท เพื่อผูก token ได้จริง

**Two categories, two different findings — use the one that matches:**
- **"Log Note" (yellow)** — no component/pattern exists for this at all. Does **not** create a
  Notion row (that's `ds-governance-audit-notion`'s job later, once wireframe+binding are done —
  writing one here would double-count).
- **"Unbound" (red)** — a real token/value exists and this should be tied to it, but isn't, for a
  real stated reason it has to stay literal (e.g. a gradient with no token in the library at all).
  Prefer actually fixing it (Step 4) over reaching for this category — use it only when fixing is
  genuinely not possible.

**A frame that is a full-screen overlay/modal state (a scrim/backdrop covering the whole base
screen, with a modal on top) does not display annotations for the background components it
obscures.** These overlay frames are built as a duplicate of the base screen plus the modal/scrim
layer, so the same background gaps (e.g. a composed chart, a composed nav icon) already carry a
real annotation on the base, non-overlay frame — repeating that annotation on the hidden copy
underneath the scrim just adds a pin the viewer can't connect to anything they can see. **Only the
elements actually visible in that overlay state get an annotation in that frame** — the modal
itself and the scrim/backdrop, not whatever it's covering. Concretely: when building an overlay
frame, either don't copy the background gap's annotation onto its duplicate instance at all, or
clear it (`node.annotations = []`) once the frame is confirmed complete — the canonical annotation
for that gap lives on the base frame where it's actually visible.

**Keep a running written gap list from the moment the first gap is found, and check it at Step 6.**
A real multi-hour run found six genuine gaps (a composed chart, a composed slider, a manually-built
table, and three separate icon substitutions) spread across a dozen separate script calls over the
session — and annotated **none of them**, not because the rule was unknown, but because "annotate
as I go" has no natural trigger when the actual gap-composing work is interleaved with everything
else being built. It surfaced only when the requester asked "where are the annotations?" after the
whole screen was already reported done. The fix is procedural, not a stronger reminder: the moment
Step 5 identifies ANY gap, append it to a plain list (node id + one-line reason) before moving on —
this list is the only thing Step 6 checks against, so there is nothing left to remember by the end.

## Step 6 — Verify before reporting anything done

**Every entry on the Step 5 gap list has a real `node.annotations` value, read back — not just a
memory of having meant to add one.** Query each listed node directly
(`(await figma.getNodeByIdAsync(id)).annotations`) and confirm it is non-empty with the right
`categoryId`, the same "don't trust a successful-looking call, read the actual state back"
discipline already applied to token binding and TEXT writes elsewhere in this file. An empty gap
list at this checkpoint is only correct if the screen genuinely had no gaps — verify that against
Step 5's own list, not against how the build felt while it was happening.

**A screenshot, actually looked at — not a structural node-tree read succeeding.** Two false "done"
reports in one real run were caught only by looking at an actual screenshot.

**A screenshot that doesn't show an expected fix can be showing a zombie duplicate, not a stale
cache.** If any earlier call in the session timed out, that script can keep running server-side
past the timeout and complete later, silently inserting a duplicate of whatever it was building
right next to an already-correct fix. Before concluding a screenshot/cache is broken: search the
whole document for other nodes with the same stale name/characters
(`figma.root` → walk every page/node).

**A zombie can land *after* a screenshot you already took and already called clean.** One run
timed out building a table, was judged to have created nothing (an immediate zombie-check right
after the timeout found none), was rebuilt manually, screenshotted clean, and reported done — a
straggler from that original timed-out call then finished server-side sometime *after* the
screenshot, landing a second, unfixed copy of the section next to the reported-clean one. It sat
undetected until the requester noticed a visibly doubled section on their own. **Re-run the
duplicate-name sweep immediately before the final report, every time — not only right after a
timeout is recovered from** — since the gap between "timeout recovered" and "work reported done"
is exactly the window a straggler can complete in.

**A corrective pass must diff against the last known-good state, not just re-read current state
and trust it.** Fixing one bug (a wrong node-matching selector that made every item's label read as
`null`) caused a second, silent one: every item — including the one item that should have stayed in
its original, correct, non-default state — got swapped to the same fallback treatment before the
selector was fixed. The follow-up corrective pass then re-ran with the fixed selector, correctly
identified that one item by its now-readable label, and *left it alone* — because by then it was
indistinguishable from "already handled," when it had actually been wrongly changed by the same bug
the correction was fixing. A corrective pass that only asks "does this look right now?" for items
it can positively identify will silently accept collateral damage on ones the original bug already
touched. When a bug is found to have affected a batch of N similar items, verify **all N** against
their intended end-state after the fix — not just the subset the fix's own logic newly touches.

**A successful API return is not proof a TEXT write landed.** `instance.setProperties()` called
raw in a script can silently no-op on TEXT-kind properties while visibly changing BOOLEAN
properties in the same call, still reporting success. Always use the dedicated
instance-properties tool for TEXT properties, then read the real child text node's `.characters`
back to confirm.

## Final chat summary

- Frames created, with links.
- Per frame: how many layers bound to a real DS component vs. got composed + annotated as a gap.
- A real screenshot, actually looked at, confirming the above.
- Anything Step 1's translation produced that looks structurally wrong — say so plainly.
- Any known open limitation carried forward undisguised (e.g. real icon glyphs — see
  `CHANGELOG.md` v0.2.0 §C) rather than silently substituted.
- Invite correction — this skill is corrected from real runs; report anything that didn't behave
  as this file describes.

## Out of scope

- Building the prototype itself — `ds-governance-prototype-notion`/`-asana`, the step before this.
- Collecting additional cases / completing the wireframe set beyond the prototype — manual UX+BA
  work after this.
- Full DS audit (Existing DS Issue vs. Gap, `DRIFT.md` checks, Context Knowledge growth) —
  `ds-governance-audit-notion`, run later after UI Designer binding and manual adjustment.
- Creating any row in 📋 Component issue — this skill never writes to that database.

---

## Reference: real Figma Plugin API traps

Confirmed real behaviors, not documented anywhere else as of this skill's last run. Grouped by
where in the pipeline each one bites. Full discovery context in `CHANGELOG.md` v0.2.0 §B; the
`figma-error-recovery-playbook`-sourced entries (marked ⟂) come from a sibling skill's own error
log, cross-checked and folded in at v0.10.0.

### Component import & instantiation

- **CDS keys are `COMPONENT_SET` keys.** `importComponentByKeyAsync` fails with a misleading "not
  found" error (reads like a bad key; it's a type mismatch) — use `importComponentSetByKeyAsync`
  for a set, or resolve the specific variant's own key (e.g. via a `get_figma_instance`-style
  lookup) and `importComponentByKeyAsync` that.
- ⟂ **`importComponentByKeyAsync` also fails for a same-file component** — it only works for
  components published in *external* library files; a same-file component fails even with the
  correct key. For same-file: `figma.getNodeByIdAsync(nodeId).createInstance()` instead. Two
  distinct root causes can produce the identical "Component with key ... not found" message —
  check which one applies (cross-file `COMPONENT_SET` vs. same-file component) before assuming
  either fix.
- **Never batch cross-file async calls** (imports, font loads) in one script call — one stuck call
  wedges the plugin's single JS thread, and every later call queues behind it and times out too,
  even trivial reads. `figma_reload_plugin` does not clear this (only reloads the UI iframe) — a
  full close+reopen of the Desktop Bridge plugin does. One resource resolution per call.
- **A single, unbatched first-time `importComponentByKeyAsync` on a never-before-used key can also
  hang at the 30s cap, with the plugin thread otherwise healthy** (trivial reads succeed
  immediately, in between and after the timeouts) — a distinct trap from the batching-wedge above.
  `figma_reconnect` clears it for *some* component sets after one retry (confirmed: Avatar, Icon
  Button, Text Field all hung once, then imported instantly post-reconnect) but is **not
  guaranteed** — one set (Table Head / Table Cell, from CDS's own `🟦 Table` page) hung three
  times running, across two separate reconnects, with nothing else in the script. Treat a second
  consecutive hang on the same key after a reconnect as a real, reproducible blocker, not bad luck
  — stop retrying, compose that piece manually from primitives/tokens (still using whichever
  *other* real components in the same screen resolve fine), and report the specific key as a known
  import blocker rather than silently downgrading the whole screen's fidelity.

### Filling slots & setting content

- **Fill a SLOT with `figma_append_to_slot`**, never `instance.appendChild()` (throws "Cannot move
  node..."). Pass `clone:false` to move an existing node in, `clearExisting:true` to replace
  default slot content first.
- **Load the font before setting TEXT properties** — `loadFontAsync` the exact font first, or
  `setProperties`/`appendChild` throws "unloaded font" on first touch.
- **A component's real label often isn't on the root instance's `componentProperties`** — it can
  live on a nested sub-instance one or more levels down (inspect the instance tree, don't assume;
  a hidden placeholder TEXT node can sit at the level a naive `findOne(TEXT)` grabs instead). Some
  components (e.g. a purpose-built nav-row component) expose it directly on the root — check
  before assuming you need to hunt.
- **Use `figma_set_instance_properties` for every instance property write, always** — never raw
  `instance.setProperties()` in a script (silently no-ops on TEXT properties specifically). Read
  the real child text node's `.characters` back afterward regardless.
- ⟂ **A raw `setProperties()` call can also throw outright — and take the whole script down with
  it.** Passing a wrapped object (`{type:'TEXT', value:'...'}`) instead of a plain primitive throws
  `Expected string/boolean/number, received object`. Figma scripts run as one atomic transaction:
  when a call partway through a script throws, **every node the script already created earlier in
  that same call is rolled back, not just the failing line.** This is a second, independent reason
  (beyond the batching/zombie-thread trap above) to keep each `figma_execute` call small and
  scoped — a large combined build script risks losing everything it built if one property write
  near the end throws.

### Node lookup & traversal

- **`.mainComponent` (sync) throws under `documentAccess: dynamic-page`** — use
  `await instance.getMainComponentAsync()`.
- ⟂ **Use `findOne` (recursive), never `findChild` (direct children only), when searching a page
  for a node by predicate.** A `ComponentSet`/instance sitting inside a Section is not a *direct*
  child of the page — `findChild` silently returns `null` there with no error, which can make a
  whole binding pass report "0 errors" while never actually running (it found nothing to bind
  because the search never reached the real node). Default to `findOne` for any page-level search;
  reserve `findChild` only when the exact parent is already known.
- ⟂ **A Figma URL's `node-id` uses `-` as the id separator; the Plugin API uses `:`.** Convert
  `2020-2181` → `2020:2181` before calling `getNodeByIdAsync`.
- ⟂ **A node-id from a URL can resolve to a PAGE, not a Frame** — a PAGE has no `x`/`y` and throws
  on any coordinate access. If `get_metadata`-equivalent output shows the node as the outermost
  `<canvas>` element, it's the page — walk to a known child Frame/instance for coordinates instead,
  and separately walk up (`while (n.type !== 'PAGE') n = n.parent`) when you need the page itself.

### Sizing & layout

- **`vectorPaths` wants space-separated coordinates** (`M0 100 L50 50`), not comma-separated
  standard SVG syntax.
- **A circular FILL/HUG sizing chain silently under-sizes with no error** — a `FILL` child against
  a parent that itself `HUG`s based on that child's resolved size collapses well under real
  content width. Use `HUG`/`FIXED` on the outer chain when the parent's size depends on that child.
- ⟂ **`layoutSizingHorizontal`/`Vertical` (child-level sizing) use the enum value `'HUG'` — not
  `'AUTO'`.** `primaryAxisSizingMode`/`counterAxisSizingMode` (parent-level, the frame's own
  auto-layout behavior) use `'AUTO'` for the same concept. Same idea, two different enums by
  level — using the wrong one throws `Invalid enum value`.
- ⟂ **Sizing-mode order of operations matters and gets it silently wrong both ways:**
  - Set `layoutSizingHorizontal`/`Vertical` **after** `appendChild` and after the parent's
    `layoutMode` is set — `FILL` throws ("must be an auto-layout frame or a child of one") if the
    parent isn't already auto-layout when you try to set it.
  - When locking a frame to a specific size via auto-layout, set `primaryAxisSizingMode='FIXED'`
    (or resize) **before** `appendChild` — appending first can hug-shrink the frame to its content,
    and a `resize()` call afterward doesn't always undo that.
  - Conversely, if the goal is content-driven auto-sizing, set `primaryAxisSizingMode='AUTO'` as
    the **last** step, after any `resize()` call — `resize()` before it re-locks the frame to that
    literal size, silently defeating the auto behavior you just asked for.
  In short: decide FIXED vs. AUTO/HUG first, then order `resize`/`appendChild`/the sizing-mode
  assignment so the last thing set is the one you actually want to win.

### Token & variable binding

- ⟂ **An `-inverse`-suffixed semantic token's actual direction is a per-system convention, not a
  safe assumption** — it can mean "always the dark-mode surface" rather than "the literal opposite
  of whatever's currently active." Verify the real bound RGB before trusting the name:
  ```js
  const test = figma.createFrame();
  test.fills = [figma.variables.setBoundVariableForPaint(
    {type:'SOLID', color:{r:1,g:1,b:1}}, 'color', importedVar
  )];
  return test.fills[0].color; // r≈g≈b≈1 → resolves light; ≈0 → resolves dark
  ```
  Applies beyond `-inverse` names generally: when a token's semantic direction is ambiguous from
  its name alone, resolve it live rather than guessing from the label.
