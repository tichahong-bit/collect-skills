---
name: ds-governance-extract-notion
version: 0.3.0
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
- Read `ds-governance-audit-notion`'s Step 9 annotation format (category **"Log Note"**,
  yellow, **bold *descriptive* title + `**Label:** value` bullets — see the real example in
  Step 3 below**, not the literal string "Log Note" as content) before Step 3 — the annotation
  this skill writes for a missing/composed piece must match that convention exactly, not invent
  a new one. Two different annotation styles in the same file is the single biggest way this
  could go wrong in practice — don't let it happen.
- Check the target file has a **"Log Note"** annotation category; create it
  (`figma.annotations.addAnnotationCategoryAsync({label:'Log Note', color:'yellow'})`) if it
  doesn't — don't assume every target file already has it just because `ds-governance-audit-notion`
  runs assume so (those run against files with prior audit history; a fresh extraction target may
  not).

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
get_rules check above), write a real Figma annotation using `ds-governance-audit-notion`'s own
Step 9 **content** convention — bold *descriptive* title + bullet list, each line
`**Label:** value` (not the literal string "Log Note" as the title — that's the category, set
separately):

```markdown
**Composed for This Screen**
- **Component:** {what this piece represents, e.g. "Portfolio Performance line chart"}
- **Problem:** not available in the Design System yet
- **Note:** composed from real DS tokens/primitives as a stand-in — designer should know this is
  new, not an existing DS component, before treating it as final
```

Category **"Log Note"** (yellow) — same category `ds-governance-audit-notion` uses for an
Existing DS Issue, not a new category (create it on the target file first if it doesn't exist —
see Prerequisites). This intentionally does **not** create a Notion row — that's still
`ds-governance-audit-notion`'s job later in the chain (Step 6, Design System Gap), once wireframe
and binding are both actually done. Writing a row here would be premature and would double-count
against what the later real audit finds.

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
