---
name: ds-governance-extract-notion
version: 0.7.0
description: Extracts a non-Figma prototype (e.g. an HTML/web prototype from ds-governance-prototype-notion or ds-governance-prototype-asana) into real Figma frames on the target file, binding each screen to the Design System as it's built and composing/annotating anything the DS doesn't cover yet. Composes the generic figma-generate-design skill with โย's (Yo's) ui-designer/figma-ds-consumer/figma-build .skill files and borrows ds-governance-audit-notion's own annotation format for the "missing" case. Second step of the wider Requirement → Applied workflow, between prototyping and manual UX/BA wireframing. First run end-to-end 2026-08-29 — several real defects found and fixed (see version history); still carries real, disclosed limitations (see "Known open limitation" below).
---

# Extract Agent (composed from existing tools)

> **Status: first real run completed (2026-08-29), corrected from what actually happened.**
> Composes a generic Figma-MCP skill (`figma-generate-design`, not owned by anyone on this team)
> with three of โย's (Yo's) `cds-consumer` `.skill` files (`figma-build`, `figma-ds-consumer`,
> `ui-designer` — these are plain files, not installed Claude Code Skills; read them directly),
> and borrows an annotation convention from a third skill (`ds-governance-audit-notion`). Treat
> every future run as still fragile — report anything that doesn't behave as described here so
> this file keeps getting corrected.
>
> **v0.2.0 — first real run: 16 real defects found, most fixed, one still open (2026-08-29,
> extracting "Orbis Private RM Console" into `[StaffPortal_ABC] Dashboard`).** Grouped by kind:
>
> **A. This skill's own written instructions were wrong or incomplete:**
> 1. Step 3's annotation template guessed the bold title literally reads "**Log Note**" —
>    wrong. "Log Note" is the Figma annotation **category** (a yellow taxonomy tag), not content
>    text. The real convention (confirmed by reading `ds-governance-audit-notion`'s own how-to
>    doc): **bold *descriptive* title + bullet list, each line `**Label:** value`**. Step 3 below
>    is corrected to match.
> 2. Step 1 only captured the active tab/content area, not the full screen — a prototype screen is
>    `root → [Sidebar | Main → Topbar + Content]`; the persistent chrome (side nav, top bar) is a
>    distinct structural layer and must be extracted once and included in every frame, not just
>    whatever the active tab shows. Missing chrome was the single biggest reason a first-pass
>    extraction looked nothing like the prototype.
> 3. **A "verified real component exists" search result must never silently override a
>    documented, correctly-reasoned Design System Gap already in the prototype's own source.**
>    The prototype's shell (sidebar/topbar) had its own code comment: "DESIGN SYSTEM GAP — per CDS
>    `get_rules` #1: CDS does not publish a shell/nav component — this is freehand, built only
>    from real tokens + the real Icon set." A first pass ran `search_components("list")`, found a
>    real `List Item` component, and used it to replace the freehand shell — this was **wrong**:
>    the original reasoning had already checked `get_rules` and was correct; a component existing
>    that *could* render something similar doesn't mean it's the *intended* system for that layer.
>    **Standing rule: before "fixing" what looks like an unbound layer, check whether the source
>    already has a `DESIGN SYSTEM GAP`/similar comment explaining why — if so, that reasoning wins
>    unless you independently re-verify it against `get_rules` yourself, not just a component
>    search hit.**
> 4. Extraction must treat the **live/current prototype source as ground truth for every screen's
>    real content, values, and structure** — re-read the actual source (or re-fetch the live
>    artifact) for the specific screen being built, never rely on an earlier round's summary or
>    assumption. A first pass extracted stale content (missing an entire KPI-stat row and a real
>    chart section, while including a status badge and category chips that had already been
>    removed from the live prototype) because it worked from a remembered description rather than
>    the actual current file.
> 5. This target file had **no "Log Note" annotation category at all** — only Figma's generic
>    defaults. The skill assumed the category already existed (borrowed from
>    `ds-governance-audit-notion`'s convention, which runs against files that already have it from
>    prior audits). **Added standing step:** check for the category and create it
>    (`figma.annotations.addAnnotationCategoryAsync({label:'Log Note', color:'yellow'})`) before
>    Step 3 ever runs, don't assume.
>
> **B. Real Figma Plugin API traps, undocumented anywhere read this run (`figma-build.skill`
> flagged separately to Yo for his own repo, since these apply beyond this skill too):**
> 6. CDS component keys are `COMPONENT_SET` keys — `importComponentByKeyAsync` fails every one
>    with a misleading `"Could not find a published component with the key..."` (reads like a
>    wrong/stale key; it's actually a type mismatch). Use `importComponentSetByKeyAsync` instead.
> 7. **Batching multiple cross-file async calls (imports OR font loads) in one script call can
>    wedge the plugin's single JS thread indefinitely** — every later call queues behind the stuck
>    one and times out too, even trivially fast reads, until the plugin is fully closed and
>    reopened. `figma_reload_plugin` does **not** clear this — it only reloads the UI iframe, by
>    its own tool output ("code.js continues running"). One real apparent "font load hangs 25-30s"
>    turned out to be this exact zombie-thread pattern in disguise — isolate with an unrelated
>    control call (e.g. a different font, a plain `pong`) before concluding a specific resource is
>    slow. **Rule: one cross-file resource resolution per script call, never looped/batched.**
> 8. A `COMPONENT_SET`'s content SLOT (INSTANCE_SWAP property, e.g. Card Container's
>    `🧩 Edit Card Content`) is not appendable — `instance.appendChild(...)` throws `"Cannot move
>    node. New parent is an instance or is inside of an instance."` No clean fill-the-slot answer
>    found this run; worked around by placing real composed content as a **sibling** next to the
>    correctly-propped instance rather than nested inside it. Still needs a real documented answer.
> 9. Setting a `TEXT` componentProperty on an instance requires the plugin to have `loadFontAsync`'d
>    that exact font **first** — untouched text throws `"unloaded font"` on the first
>    `setProperties`/`appendChild` touching it.
> 10. A component's visible label often isn't exposed as a `TEXT` componentProperty at all (e.g.
>     List Item's title lives inside a nested `✍️ Text List` sub-instance with its own real
>     `Title`/`Has Description` properties one level down — a hidden hit-nothing SLOT placeholder
>     text node, `visible:false`, sat at the level a naive `findOne(TEXT)` grabbed instead). Find
>     and set the actual visible nested instance's real exposed properties; read the real rendered
>     text node's `.characters` back afterward to confirm the write actually landed, don't trust
>     the API call succeeding as proof.
> 11. `.mainComponent` (the synchronous getter) throws `"Cannot call with documentAccess:
>     dynamic-page"` in this environment — use `await instance.getMainComponentAsync()` instead.
> 12. `vectorPaths` data rejects comma-separated coordinates (`M0,100` → `"Invalid command at
>     ,100"`) — this plugin's parser wants space-separated (`M0 100 L50 50`), unlike standard SVG
>     path syntax.
> 13. A circular FILL/HUG sizing chain can **silently under-size and clip content with zero
>     thrown error** — a child set to `FILL` against a parent that itself `HUG`s based on that same
>     child's resolved size collapses to well under the real content width. Use natural `HUG`/
>     `FIXED` sizing on the outer chain instead of `FILL` when the parent's own size depends on
>     that child.
>
> **C. Known open limitation, disclosed rather than silently worked around:**
> 14. **Real CDS icon glyphs could not be placed.** CDS icons have no published Figma component
>     key at all, and this plugin sandbox's `fetch()` to the public SVG icon host returns
>     `"Failed to fetch"` when called from inside the plugin. Real icon *slugs* were still
>     resolved and attached by name/color-coded stand-in (traceable to the real slug for a human
>     to swap later), but the actual glyph artwork is not yet real. Don't silently ship a
>     made-up substitute shape and call it done — say so plainly, same as any other gap.
>
> Two more standing rules from this run, folded into Steps below: **compose, don't leave blank**
> (a gap the DS has no component for gets a real mockup from real tokens/primitives, never an
> empty placeholder box) — and **screenshot before reporting done** (a structural node-tree read
> succeeding is not proof the visible result is correct; take a real screenshot and look at it
> before calling anything finished — two separate false "done" reports this run were caught only
> by an actual screenshot, not by re-reading the node tree).

> **v0.3.0 — a "done" screenshot can itself be showing a zombie duplicate, hierarchy must mirror
> the real source tree not just look similar, and even a correctly-reasoned freehand composition
> still has to bind real variables (2026-08-29, same Orbis extraction, requester's own close
> re-review of "Investment — Overview" against the live artifact and the real source).** The
> requester asked "why doesn't this match the artifact" three times over one screen, each time
> finding something this skill's own v0.2.0 verification rules had not caught:
>
> 1. **v0.2.0's "screenshot before reporting done" rule has a real gap: the screenshot itself can
>    be showing a leftover zombie instance, not the fix.** A Heading Text Block instance was fixed
>    correctly (confirmed by reading its own text nodes directly) and screenshotted correctly in
>    isolation — but the FRAME screenshot, and even a freshly-cloned copy of that frame under a
>    brand-new node id, kept showing the old placeholder content. Root cause: an earlier script
>    call in this same run had reported a 25–30s timeout, and per the already-documented "a
>    timeout is not a stop" trap, it had kept running in the background and completed *after* the
>    session moved on, silently inserting its own duplicate Heading Text Block instance into the
>    same parent — sitting alongside the correctly-fixed one and rendering on top of it. **Standing
>    rule: whenever a screenshot doesn't show an expected fix, and any earlier call in the session
>    timed out, search the whole page for duplicate content (by name or by characters) before
>    concluding the tool/cache is broken** — `figma.root` → walk every page/node for text matching
>    the stale content, not just re-screenshotting the same node harder.
> 2. **`instance.setProperties()` called directly in a raw script silently no-ops on TEXT-kind
>    properties**, even though it visibly changes BOOLEAN properties on the same instance in the
>    same call (a Has Eyebrow toggle took effect; Title/Description text did not, and the call
>    still reported success). This is exactly what `figma_set_instance_properties`'s own tool
>    description already warns about ("direct text editing may fail silently") — the lesson is to
>    actually obey that warning inside a raw `figma_execute` script too, not only when reaching for
>    a separate tool. **Standing rule: never call `instance.setProperties()` raw for a TEXT
>    property — use the dedicated instance-properties tool/call every time, then read the actual
>    child text node's `.characters` back to confirm.**
> 3. **Matching individual pieces without checking the real JSX nesting order produces a
>    structurally wrong screen that can still look right at a glance.** The prototype's real root
>    layout is `flex-col = [Topbar(full width), flex-row = [Sidebar, Content]]` — Topbar spans the
>    *entire* screen width, above both the sidebar and the content. This run had instead built
>    `[Sidebar | Main[Topbar, Content]]` — Topbar nested inside the content column, only as wide as
>    the content area, sidebar beside it rather than below it. Both pieces existed and were
>    individually well-built, but the assembled result put a full-width element in a
>    partial-width slot. **Standing rule: before assembling a multi-region screen (chrome +
>    content), read the real root layout structure from the source (the outermost JSX return, not
>    a single component file) and match its actual nesting/ordering, not just which pieces exist.**
> 4. **A correctly-reasoned freehand composition (a real, documented Design System Gap) still has
>    to bind every color to the real CDS variable — visually matching a token's current RGB value
>    is not the same as binding it.** The topbar/sidebar shell was rightly built freehand (Step 1's
>    "check `get_rules` before treating this as a mistake" rule, v0.2.0) — but its colors were
>    typed as literal RGB copies of what the real tokens currently resolve to, with
>    `boundVariables: {}` on every fill/stroke checked. This passes a casual look (the numbers
>    match) but fails CDS's own binding rule and will silently drift the moment a token's value
>    changes (theme, rebrand). Fix: `figma.variables.importVariableByKeyAsync(key)` (via
>    `resolve_token`'s `figmaVariableKey`, never guessed) +
>    `figma.variables.setBoundVariableForPaint(paint, 'color', variable)` on the actual fills/
>    strokes array — for every color in a freehand composition, not only for real component
>    instances.
> 5. **A data-driven color mapping (category → token) must be read from the real source data file,
>    never assumed via a fixed rotation.** A donut chart's 5 category colors were assigned in
>    rotation order (blue, green, purple, orange, yellow) instead of the real per-category mapping
>    in the source's own data file (`thai:blue, global:orange, fixed:green, alt:yellow,
>    cash:purple`) — visually plausible (5 real accent colors, right count) but 4 of 5 categories
>    had the wrong color. Verify by reading the actual source data structure, not by picking colors
>    that merely look reasonable for the number of categories.
> 6. **Sizing must mirror the real source's CSS grid/flex ratios, not whatever a piece happened to
>    measure at creation time.** Four KPI cards meant to be equal `1fr` columns
>    (`grid-template-columns: repeat(4,1fr)` in the source) had instead been left at four different
>    `FIXED` pixel widths (176/161/180/139) — each one individually a plausible card width, but
>    visibly uneven as a row. Compute the real equal/proportional widths from the row's actual
>    width and gap (matching the source's `fr` ratios) and set them explicitly, rather than
>    leaving whatever a text-driven auto-size produced.

> **v0.4.0 — v0.2.0's own shell-gap correction was itself incomplete: a container having no
> published component doesn't mean its individual rows don't; and sizing mode must be audited
> against the source's real responsive CSS, not left at whatever a build happened to measure
> (2026-08-29, same Orbis extraction, requester's continued review of "Investment — Overview").**
>
> 1. **Reversing part of v0.2.0's correction #3.** That correction was right that the prototype's
>    shell *container* (fixed-width column, sticky positioning, section header) has no published
>    CDS component and was correctly built freehand per the source's own `get_rules`-checked
>    comment. But it over-corrected by also reverting the individual nav *rows* inside that shell
>    back to freehand — `List Item`'s own guidance (`get_component`'s `guidance.usage`) explicitly
>    documents a **"Selected navigation row"** example
>    (`<CdsListItem title="Dashboard" leadingSlot={<HomeIcon/>} selected onSelect={...}/>`), which
>    is exactly this use case. **Standing rule: a container/shell having no published component
>    does not mean everything inside it is freehand too — check each interior piece's own
>    candidate component's `guidance.usage` for a matching documented example before accepting a
>    source file's freehand comment as the final word on every layer inside it.** Fixed by
>    rebuilding the 6 sidebar rows as real `List Item` instances (`Is Selected=Yes` for the active
>    item, `Is Disabled=Yes` for the rest, `Has Description=false`, title set via the nested
>    `✍️ Text List` sub-instance's real `Title` property — same technique already documented under
>    "Setting TEXT-kind instance properties" above) — only the outer column/section-header stays
>    freehand+annotated as the genuine remaining gap.
> 2. **New standing step: audit `layoutSizingHorizontal`/`layoutSizingVertical` against the
>    source's real CSS behavior for every major region, not just its width/height at build time.**
>    Three real mismatches found by checking, not by eye: a full-width topbar had
>    `layoutSizingVertical: FIXED` (should be `HUG` — its height is padding+content-driven, no
>    literal height in the source); a fixed-width sidebar (`width:230, flex:none` in source — that
>    part was already correctly `FIXED`) had `layoutSizingVertical: FIXED` (should be `FILL` — a
>    flex row's default `align-items:stretch` makes it match the row's height, not an independently
>    fixed number); a `flex:1` content column had `layoutSizingHorizontal: HUG` (should be `FILL` —
>    it's meant to grow into whatever space the fixed sidebar doesn't take, not shrink-wrap its own
>    content). Map each CSS behavior to the Figma equivalent explicitly: `flex:1` / `width:100%` →
>    `FILL`; a literal fixed px width with no flex-grow → `FIXED`; content-driven with no explicit
>    size → `HUG`. For equal `1fr` grid columns specifically, prefer real `FILL` sizing on each
>    child (with `constraints.horizontal = 'STRETCH'` on any non-auto-layout descendant that needs
>    to follow the resize) over manually computing and hardcoding an equal-share pixel number —
>    both render identically today, but `FILL` is what actually stays correct if the frame is
>    resized later, which is the entire point of getting sizing mode right instead of just getting
>    today's pixel value right.

> **v0.5.0 — v0.4.0's sizing audit was itself incomplete: a row-level container needs FILL too,
> not just its children, and there's a real limit to what Figma's FILL can express for
> non-equal ratios (2026-08-29, same Orbis extraction, requester's continued sizing review).**
>
> 1. **Auditing each child's sizing isn't enough if the row/container they sit in is still `HUG`.**
>    The 4-card KPI row and the chart+donut row were both left at `HUG` (sized to exactly the sum
>    of their children — 704px and 906px respectively) instead of `FILL` against their own parent
>    (`ScreenContent`). Each individual card had already been set to `FILL` correctly (v0.4.0), but
>    a `FILL` child inside a `HUG` parent just fills that parent's already-shrink-wrapped size — it
>    doesn't reach the page's real available width. **Standing rule: audit sizing top-down, not just
>    at the leaf level — a row/grid container that should span the full available width in the
>    source needs `layoutSizingHorizontal: FILL` against ITS OWN parent, independently of whatever
>    sizing its children get.**
> 2. **A SLOT-workaround wrapper (`layoutMode: NONE`, per the Card Container SLOT limitation
>    documented under v0.2.0/Step 3) can still take `FILL` sizing as a child of a real auto-layout
>    parent, even though `HUG` is not a valid option for it.** `HUG` only exists for a frame whose
>    OWN children are arranged by auto-layout — a `NONE`-layout frame can never compute a size from
>    its (absolutely-positioned) children, so `FIXED` and `FILL` are its only two real options as a
>    child. Where the source's real CSS Grid behavior implies stretch (unset explicit height, no
>    `align-items` override — CSS Grid's real default is `stretch`), prefer `FILL` over guessing a
>    `FIXED` height from whatever the content currently measures.
> 3. **Real limitation, not a defect: Figma's auto-layout `FILL` only ever splits remaining space
>    EQUALLY among `FILL` siblings — there is no per-child ratio/weight (no Figma equivalent of
>    CSS's `1.3fr 1fr`).** For a source grid column split that is NOT equal, setting both children
>    to `FILL` produces a wrong 50/50 result — worse than doing nothing. The correct static
>    encoding is `FIXED` widths computed to match the real ratio (e.g. `1.3fr 1fr` over the row's
>    real available width → the two widths in that proportion) — verify the computed split is
>    genuinely close to the source's real rendered proportion (a live measurement, not just fr-math
>    on paper) before accepting it. Don't "fix" a correctly-reasoned proportional `FIXED` split into
>    an incorrect equal `FILL` split just because `FILL` sounds more responsive — note in the
>    summary which axis is a deliberate `FIXED`-ratio exception and why.

> **v0.6.0 — a freshly-placed component's own library-default size can overflow its real
> container, and a data token's exact family (not just its hue name) has to match the source
> (2026-08-29, same Orbis extraction, requester's continued review).**
>
> 1. **A component instance keeps the library's own default/measured size until something resizes
>    it — that default can be wider than the real space it's going into.** The `List Item` rows
>    fixed onto the sidebar in v0.4.0 (correctly, as real components) were left at `366px` wide —
>    the component set's own default — inside a `230px` sidebar column, overflowing by well over
>    half. This is invisible in a components-exist/properties-correct check; it only shows up as
>    literal overflow in a screenshot or a direct `layoutSizingHorizontal`/`width` read. **Standing
>    rule: after placing any instance into a real layout region, check its resolved width/height
>    against that region's real available space — set `layoutSizingHorizontal`/`Vertical` to `FILL`
>    (matching the sizing-audit rules above) rather than trusting whatever size the library ships
>    the component at by default.**
> 2. **Two token families can share a hue name and still be visually very different — bind the
>    exact family the source names, not a same-hue substitute.** The donut's 5 slice colors were
>    bound to real, correctly-ordered variables (`surface-accent-blue/orange/green/yellow/purple`)
>    — but the source's own data file (`data.ts`) names `--content-accent-blue` etc. for this exact
>    purpose, a different token family that resolves to a much more saturated/vivid color (e.g.
>    `content-accent-blue` `#0048b7` vs. `surface-accent-blue` `#d9e8ff` — a dark, readable blue vs.
>    a pale tint meant for backgrounds). Both are real, correctly-bound CDS variables; only one is
>    the one the source actually specifies for this role. **Standing rule: when a data-driven
>    mapping names a specific CSS variable, bind that exact variable — never substitute a
>    same-hue/same-number token from a different family (`surface-*` vs `content-*` vs `border-*`)
>    just because it produces a plausible-looking palette.**

> **v0.7.0 — annotation content should read as plain Thai prose (not a bullet template), a
> real project's own file names a second category for pure binding violations, and a
> programmatic full-frame sweep finds what spot-checking a "few likely spots" misses
> (2026-08-29, same Orbis extraction, requester shared a real reference file).**
>
> 1. **Annotation content: one clear Thai sentence, not a bold-title + bullet-list template.**
>    The requester pointed at a real annotation from another project file
>    (`POC-AI-agent`, node `792:13179`) and asked for this skill's own tone to match it. Reading it
>    directly showed a single flowing Thai sentence, no markdown bullets, no `**Label:** value`
>    structure — e.g. *"ไม่มี gradient/pattern token ใน Core Design Library — Visual Panel ใช้
>    linear-gradient สีน้ำเงินที่ hardcode ค่าไว้ (ไม่มีตัวแปรสีแบบ gradient ในระบบให้ผูก)"*. **Standing
>    rule: write annotation content as plain, easy-to-read Thai prose — what's missing, why, and
>    what it means for the designer, in one or two natural sentences — not the bold-title/bullet
>    convention this file previously borrowed wholesale from `ds-governance-audit-notion`.** Keep
>    borrowing the CATEGORY system (which color/label a Figma annotation carries), not the content
>    formatting.
> 2. **That same reference file uses a second, distinct annotation category — "Unbound" (red) —
>    for a pure token/color-binding violation, separate from "Log Note" (yellow) for a
>    missing-component/composed-content gap.** These are different findings: "Log Note" means *no
>    component exists for this*; "Unbound" means *a component or value exists and should be tied to
>    a real token, but isn't*. Create both categories on the target file (check-then-create each,
>    same pattern as v0.2.0's Log Note step) and use whichever actually matches the finding — don't
>    fold a binding violation into a Log Note just because one category already exists.
> 3. **A full programmatic sweep of every fill/stroke/text-style on the whole frame finds real
>    violations that checking "the pieces you remember to check" misses.** Earlier passes this run
>    had already fixed the shell's most visible colors (logo, pill, topbar background/border) and
>    called the binding work done — a real sweep of every `fills`/`strokes` array on the entire
>    frame (`boundVariables.color` present or not) found **50 more unbound literal colors**
>    untouched: every KPI stat card's label/value/delta text, every chart month label and legend
>    swatch, every donut legend row, the sidebar section header, even the frame's own background —
>    all typed as literal RGB that happened to match a real token's current value. **Standing rule:
>    before calling a screen's token binding done, run one script that walks every node in the
>    frame and checks every `fills`/`strokes` entry for `boundVariables.color`, and every `TEXT`
>    node for a real `textStyleId` — fix (or annotate `Unbound`, if a real reason to stay literal
>    exists) everything the sweep finds, don't rely on remembering which pieces still needed it.**
>    Map found literal colors to a real token by RGB fingerprint against `resolve_token` output
>    (near-black → `content-neutral-primary`, mid-gray → `content-neutral-secondary`/`-tertiary`,
>    green → `content-positive-primary`, the action blue → `content-action-primary`, etc.) rather
>    than leaving any of them as an accepted "close enough."

## Expected input

- **Prototype source** (required) — a link to, or file for, the prototype to extract (typically
  `ds-governance-prototype-notion`'s output, but any non-Figma prototype works in principle).
- **Target Figma file** (required) — the Figma file screens should be placed into.
- **Design system project** (optional, but ask if missing) — link to the Core or Project DS
  library to bind against. Without this, Step 2's bind pass has nothing to bind to.

## Prerequisites

- Load `figma-generate-design` (the generic Figma-MCP skill covering "translate an app page or
  layout into Figma") — this is not owned by กัน, โย, or กร, it's part of the standard Figma
  toolset available in this environment. Load `figma-use` first if it or any raw `use_figma`/
  plugin-bridge call needs it.
- โย's `figma-build`, `figma-ds-consumer`, and `ui-designer` are **plain `.skill` files**, not
  installed Claude Code Skills (e.g. `~/design-system-repos/cds-consumer/skills/*.skill`) — Read
  them directly and follow their instructions manually; they will not resolve by name via the
  Skill tool. Read `figma-build` first — per โย's own README, it's the mandatory companion for
  any build/edit/token-binding work, and covers the real Plugin-API traps in section B above.
- `git pull` โย's `cds-consumer` repo before building, so `COMPONENTS.md`/`REGISTRY.md`/
  `DRIFT.md` and the `.skill` files themselves are current.
- Annotation content is **plain, easy-to-read Thai prose — one or two natural sentences, no
  bold-title/bullet template** (v0.7.0, matching a real reference annotation the requester
  pointed to). Borrow only the CATEGORY system from `ds-governance-audit-notion`/the reference
  file, never its bold-title + `**Label:** value` bullet formatting — see Step 3 below for the
  real style and both categories in use.
- Check the target file has both a **"Log Note"** (yellow) and an **"Unbound"** (red) annotation
  category; create whichever is missing
  (`figma.annotations.addAnnotationCategoryAsync({label:'Log Note', color:'yellow'})` /
  `{label:'Unbound', color:'red'}`) — don't assume either already exists just because
  `ds-governance-audit-notion` runs assume so (those run against files with prior audit history;
  a fresh extraction target may not have either).

## Step 1 — Translate the prototype into real Figma frames

**Read the actual current prototype source first** — the live artifact, or its real source files
if you have them (e.g. a scratch React project a prior build produced) — as ground truth for each
screen's real content, values, and structure. Don't build from a summary or an earlier session's
memory of what the prototype contains; re-check the specific screen you're building against its
real current source every time. A prototype can change between when it was last discussed and
when this skill actually runs.

Translate the **full screen**, not just the active tab/content area — persistent chrome (side
nav, top bar) is a distinct structural layer, built once and included in every frame, separate
from whichever tab/content is currently showing. Run `figma-generate-design` against the
Prototype source, targeting the Target Figma file, for this full structure. This is a structural
translation only at this stage — layout, hierarchy, content — not a DS-binding pass yet (that's
Step 2, deliberately separate so a failure in one doesn't silently corrupt the other).

**Read the real nesting order from the source's outermost layout, don't assume a shape (v0.3.0).**
`root → [Sidebar | Main → Topbar + Content]` is NOT a safe default to assume — it was wrong for a
real prototype whose actual root was `flex-col = [Topbar (full width), flex-row = [Sidebar,
Content]]`, Topbar spanning the *entire* screen above both the sidebar and the content, not nested
inside the content column. Building each piece correctly in the wrong nesting order still produces
a structurally wrong screen that can look right at a glance. Find and read the actual outermost
JSX return (the App-level component, not a single screen/shell file) to get the real
parent→child→sibling order before assembling auto-layout frames, and mirror it exactly — which
element is full-width vs. constrained, and which sits above vs. beside which, is structural
information the individual component files don't carry on their own.

**Before treating any unbound layer as something to fix, check whether the prototype's own source
already explains it.** A layer with no real DS component behind it may carry its own comment
(e.g. "DESIGN SYSTEM GAP — per CDS `get_rules` #1...") documenting that this was already checked
and reasoned to be a genuine gap — that reasoning wins over a component-search hit that merely
looks similar, unless you independently re-verify against `get_rules` yourself. Don't "fix" a
correctly-reasoned gap into a wrong real-component substitution.

**But that reasoning covers only what it actually says — a gap ruling on a container/shell does
not automatically extend to every layer inside it (v0.4.0).** A source comment saying "CDS does
not publish this shell" is a ruling about the shell/container itself (positioning, fixed-width
column, sticky behavior) — it is not evidence that a candidate component for something *inside*
that shell (a nav row, a list row) was ever actually checked. Before accepting freehand for an
interior piece, search for and read a real candidate component's own `guidance.usage` for a
documented example matching this exact use case (e.g. `List Item`'s guidance names a "selected
navigation row" example verbatim) — a documented match there wins over an unrelated shell-level
gap comment. Split the ruling accordingly: the outer shell/container can still be freehand+
annotated while its interior interactive rows are real component instances.

**Audit sizing mode (HUG/FILL/FIXED) against the source's real CSS behavior, top-down — every
container level, not just the leaves (v0.4.0, corrected v0.5.0).** Map each region's real CSS to
the Figma equivalent explicitly: `flex:1` / `width:100%` / no fixed dimension with a grow factor →
`FILL`; a literal fixed px width with no flex-grow (e.g. a fixed-width sidebar) → `FIXED`;
content-driven with no explicit size in either axis → `HUG`. Do this for the outer chrome regions
(topbar full-width vs. content-driven height, sidebar fixed-width vs. row-stretched height,
content column filling remaining width) — **and separately for every row/grid container itself**,
not only the cards/cells inside it: a grid row meant to span full width needs its own
`layoutSizingHorizontal: FILL` against ITS parent, independent of whatever sizing its children
get — a `FILL` child inside a `HUG` row just fills that row's already-shrink-wrapped size, it
never reaches the page's real available width.

For equal-`fr` grid children (e.g. 4 equal KPI cards), prefer real `FILL` sizing on each child
(with `constraints.horizontal='STRETCH'` on any non-auto-layout descendant, e.g. a Card Container
sitting in a `NONE`-layout SLOT-workaround wrapper — `HUG` is not a valid option for that wrapper
itself, only `FIXED`/`FILL` are, since `HUG` requires the frame's own children to be auto-layout
arranged) — over hand-computing and hardcoding an equal-share pixel number that only happens to
look right today. Where CSS Grid's real default (`align-items: stretch`, unset explicit height)
implies two side-by-side cards should match height, prefer `FILL` vertical sizing over a guessed
`FIXED` height too.

**But for a NON-equal ratio (e.g. `1.3fr 1fr`), `FILL` is the wrong tool — Figma's auto-layout
`FILL` only ever splits remaining space EQUALLY among `FILL` siblings, with no per-child ratio/
weight.** Setting both to `FILL` there produces a 50/50 split, which is a worse mismatch than
doing nothing. The correct static encoding is `FIXED` widths computed to match the real ratio —
verify the computed split against a live measurement of the actual rendered proportion (not just
fr-math on paper) — and say so explicitly in the summary as a deliberate exception, not an
oversight.

## Step 2 — Bind to the Design System (โย's skills)

For each frame Step 1 produced:

1. Run `figma-ds-consumer` to discover and bind real components/tokens by name against the
   Design system project link, wherever a match exists.
2. Run `ui-designer` for composition judgment on anything `figma-ds-consumer` didn't resolve on
   its own (which layer should assemble from what, per โย's own skill contract).

**Component genuinely not in the DS** → do not silently leave a raw/hand-built layer. Go to
Step 3 and annotate it, same as `ds-governance-audit-notion` would if it found this during a
later audit — the point of doing it here is to catch it *before* handoff, not duplicate work
after.

## Step 3 — Compose real gaps, never leave a blank placeholder, then annotate

**A component genuinely not in the DS gets a real mockup, not an empty box.** Compose it from
real DS tokens/primitives/existing components assembled together — a chart from real color
tokens on shapes/lines, a custom layout from real spacing/radius tokens — so it reads as part of
the screen, not a hole in it. Never leave a "[Placeholder] X" blank frame; that's not extraction,
it's a TODO note pretending to be a screen.

For every such composed piece (and for a whole structural layer like a shell, per Step 1's
get_rules check above), write a real Figma annotation as **plain, easy-to-read Thai prose — one
or two natural sentences, no bold title, no bullet list (v0.7.0)**. Say what's missing, why, and
what it means for whoever picks this up next — the same tone as a real annotation a designer would
actually leave, not a structured template. For example (translate the specifics, not the style):

> ยังไม่มี component กราฟใน Core Design Library สำหรับส่วนนี้ จึงประกอบขึ้นเองจากสี token จริงของระบบ
> นักออกแบบควรรู้ว่านี่เป็นของใหม่ ไม่ใช่ component จริงจากระบบ

Category **"Log Note"** (yellow) — same category `ds-governance-audit-notion` uses for an
Existing DS Issue, not a new category (create it on the target file first if it doesn't exist —
see Prerequisites). This intentionally does **not** create a Notion row — that's still
`ds-governance-audit-notion`'s job later in the chain (Step 6, Design System Gap), once wireframe
and binding are both actually done. Writing a row here would be premature and would double-count
against what the later real audit finds.

**"Unbound" (red) is a different category for a different finding — use it when something has a
real token to bind to but doesn't, not when nothing exists to bind to at all.** "Log Note" means
*no component/pattern exists for this*; "Unbound" means *a real value exists in the DS and this
should be tied to it, but is still a literal number*. Prefer actually fixing an unbound value over
annotating it (see the binding rule below) — reach for "Unbound" only when a literal genuinely has
to stay literal for a real, statable reason (e.g. a gradient with no token in the library at all,
per the reference example this convention came from), and say that reason in the same plain-Thai
style.

**"Composed from real tokens" means bound, not just visually matching (v0.3.0).** A freehand piece
that types a literal RGB copy of a token's current value passes a casual look — the numbers match
— but leaves `boundVariables: {}` on the fill/stroke, which is not what "real tokens" means and
will silently drift the moment the token's value changes (theme switch, rebrand). For every color
in a composed/freehand piece: resolve the real token via `resolve_token` (never guess), take its
`figmaVariableKey`, `figma.variables.importVariableByKeyAsync(key)`, then
`figma.variables.setBoundVariableForPaint(paint, 'color', variable)` on the actual fill/stroke —
same standard as a real component instance, not a lesser one just because nothing to bind an
*instance* to exists here. This applies to an entire freehand structural layer (e.g. a shell
composed per Step 1's get_rules exception) just as much as to a single composed chart.

**Before calling a screen's binding done, run one programmatic sweep of the whole frame — don't
rely on remembering which pieces still needed it (v0.7.0).** Checking "the obvious pieces" (a
logo, a pill, a topbar) and calling binding done left 50 literal colors untouched on one real
screen — every KPI card's text, every chart label, every legend row. Walk every node in the frame,
check every `fills`/`strokes` entry for `boundVariables.color` and every `TEXT` node for a real
`textStyleId`, and fix (or, only when a real reason exists, annotate `Unbound` for) everything the
sweep finds. Match a found literal color to its real token by RGB fingerprint against
`resolve_token` output (near-black → `content-neutral-primary`, mid-gray →
`content-neutral-secondary`/`-tertiary`, a semantic color already in use elsewhere on the screen →
its matching `content-*` token) rather than accepting a "close enough."

**A data-driven color/value mapping must be read from the real source data, never assumed by
rotation.** A chart or legend with N categories is not "close enough" once it has N real accent
colors in some order — read the actual source data file's real per-category assignment (e.g. a
`{category: {token: ...}}` map) and match it exactly; a plausible-looking rotation can get most
categories' colors wrong while still having the right count and palette.

**Sizing must mirror the source's real CSS grid/flex ratios, not whatever a piece happened to
measure at creation.** Equal `1fr` columns in the source (e.g. a 4-card KPI row) means equal
widths in Figma — compute them from the row's real width and gap, don't leave four cards at four
different `FIXED` pixel widths just because that's what each one auto-sized to from its own text
content. A proportional split (`1.3fr 1fr`) means the two widths keep that ratio, not whatever two
arbitrary numbers happened to look plausible.

**Setting TEXT-kind instance properties via a raw `instance.setProperties()` script call can
silently no-op even when the same call's BOOLEAN properties on the same instance visibly work and
the call reports success.** Always use the dedicated instance-properties tool/call for TEXT
properties, and read the real child text node's `.characters` back afterward to confirm the write
actually landed — don't trust a successful API return as proof, per the standing screenshot rule
below extended to property writes.

**A screenshot that doesn't show an expected fix can be showing a zombie duplicate, not a stale
cache — check for one before assuming the tool is broken.** If any earlier call in the session
timed out, a script can keep running server-side past that timeout and complete later, silently
inserting a duplicate of whatever it was building alongside an already-correct fix. When a
screenshot (even of a freshly-cloned node with a brand-new id) doesn't match a confirmed-correct
node read, search the whole document for other nodes with the same stale name/characters before
concluding the screenshot pipeline itself is at fault.

## Final chat summary

- Frames created in the target Figma file, with links.
- Per frame: how many layers bound successfully to a real DS component vs. got composed +
  annotated as a gap.
- **A real screenshot, actually looked at, confirming the above** — not just a structural
  node-tree read. State what you saw, not just what the API calls returned.
- Anything Step 1's translation produced that looks structurally wrong (this is the step most
  likely to misbehave — say so plainly if the output looks off, don't paper over it).
- Any known open limitation carried forward undisguised (e.g. real icon glyphs unavailable this
  run — see version history) rather than silently substituted and left unmentioned.
- Invite correction from how this run actually went — this skill is corrected from real runs (see
  the version history at the top), and every future defect found is what keeps it accurate.

## Out of scope for this skill

- Building the prototype itself — that's `ds-governance-prototype-notion`, the step before this
  one.
- Collecting additional cases / completing the wireframe set beyond what the prototype already
  covers — that's a manual UX+BA step after this one, not this skill's job.
- Auditing the result against the DS with full classification (Existing DS Issue vs. Gap,
  DRIFT.md checks, Context Knowledge growth) — that's `ds-governance-audit-notion`, run later
  after UI Designer binding and manual adjustment (see the workflow page this skill was proposed
  on).
- Creating any row in 📋 Component issue — see Step 3, this skill never writes to that database.
