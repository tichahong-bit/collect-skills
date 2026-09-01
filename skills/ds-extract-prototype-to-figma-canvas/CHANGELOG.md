# Changelog — ds-extract-prototype-to-figma-canvas

Full version history with the real defect, the evidence, and the reasoning behind each fix.
`SKILL.md` states only the current, standing rules — read this file when you want the "why" or
the story behind a rule (e.g. reviewing a correction, deciding whether a rule still applies, or
writing the next one). An agent running the skill does not need to load this file.

**Status: first real end-to-end run 2026-08-29** (extracting "Orbis Private RM Console" into
`[StaffPortal_ABC] Dashboard`), corrected across 8 versions the same day from the requester's own
close review against the live artifact and its real source. Treat every future run as still
fragile — report anything that doesn't behave as `SKILL.md` describes so both files keep getting
corrected.

Composes a generic Figma-MCP skill (`figma-generate-design`, not owned by anyone on this team)
with three of โย's (Yo's) `cds-consumer` `.skill` files (`figma-build`, `figma-ds-consumer`,
`ui-designer` — plain files, not installed Claude Code Skills), and borrows an annotation
convention from `ds-governance-audit-notion`.

---

## v0.2.0 — first real run: 16 real defects found, most fixed, one still open

**A. This skill's own written instructions were wrong or incomplete:**

1. Step 3's annotation template guessed the bold title literally reads "**Log Note**" — wrong.
   "Log Note" is the Figma annotation **category** (a yellow taxonomy tag), not content text. The
   real convention (confirmed by reading `ds-governance-audit-notion`'s own how-to doc): bold
   *descriptive* title + bullet list, each line `**Label:** value`. (Superseded by v0.7.0 — see
   below; content is now plain Thai prose, not this bullet template.)
2. Step 1 only captured the active tab/content area, not the full screen — a prototype screen is
   `root → [Sidebar | Main → Topbar + Content]`; the persistent chrome (side nav, top bar) is a
   distinct structural layer and must be extracted once and included in every frame, not just
   whatever the active tab shows. Missing chrome was the single biggest reason a first-pass
   extraction looked nothing like the prototype.
3. A "verified real component exists" search result must never silently override a documented,
   correctly-reasoned Design System Gap already in the prototype's own source. The prototype's
   shell (sidebar/topbar) had its own code comment: "DESIGN SYSTEM GAP — per CDS `get_rules` #1:
   CDS does not publish a shell/nav component — this is freehand, built only from real tokens +
   the real Icon set." A first pass ran `search_components("list")`, found a real `List Item`
   component, and used it to replace the freehand shell — this was **wrong**: the original
   reasoning had already checked `get_rules` and was correct at the time; a component existing
   that *could* render something similar doesn't mean it's the *intended* system for that layer.
   (Refined further by v0.4.0 and reversed for this specific case by v0.8.0 — see below; a shell
   having no component doesn't mean nothing inside it does, and `get_rules` alone isn't a complete
   search.)
4. Extraction must treat the live/current prototype source as ground truth for every screen's real
   content, values, and structure — re-read the actual source (or re-fetch the live artifact) for
   the specific screen being built, never rely on an earlier round's summary or assumption. A first
   pass extracted stale content (missing an entire KPI-stat row and a real chart section, while
   including a status badge and category chips that had already been removed from the live
   prototype) because it worked from a remembered description rather than the actual current file.
5. This target file had no "Log Note" annotation category at all — only Figma's generic defaults.
   The skill assumed the category already existed (borrowed from `ds-governance-audit-notion`'s
   convention, which runs against files that already have it from prior audits). Added standing
   step: check for the category and create it before Step 3 ever runs, don't assume.

**B. Real Figma Plugin API traps** (see `SKILL.md`'s Plugin API reference section for the current
form of these rules):

6. CDS component keys are `COMPONENT_SET` keys — `importComponentByKeyAsync` fails every one with
   a misleading "Could not find a published component with the key..." (reads like a wrong/stale
   key; it's actually a type mismatch). Use `importComponentSetByKeyAsync` instead.
7. Batching multiple cross-file async calls (imports OR font loads) in one script call can wedge
   the plugin's single JS thread indefinitely — every later call queues behind the stuck one and
   times out too, even trivially fast reads, until the plugin is fully closed and reopened.
   `figma_reload_plugin` does **not** clear this — it only reloads the UI iframe. One real apparent
   "font load hangs 25-30s" turned out to be this exact zombie-thread pattern in disguise — isolate
   with an unrelated control call (a different font, a plain pong) before concluding a specific
   resource is slow.
8. A `COMPONENT_SET`'s content SLOT (INSTANCE_SWAP property) is not appendable via
   `instance.appendChild(...)` — throws "Cannot move node. New parent is an instance or is inside
   of an instance." (Solved in the same session by discovering and using
   `figma_append_to_slot` — see `SKILL.md`.)
9. Setting a `TEXT` componentProperty on an instance requires the plugin to have `loadFontAsync`'d
   that exact font first — untouched text throws "unloaded font" on the first
   `setProperties`/`appendChild` touching it.
10. A component's visible label often isn't exposed as a `TEXT` componentProperty at all (e.g. the
    generic `List Item`'s title lives inside a nested `✍️ Text List` sub-instance with its own
    real `Title`/`Has Description` properties one level down — a hidden hit-nothing SLOT
    placeholder text node sat at the level a naive `findOne(TEXT)` grabbed instead). Find and set
    the actual visible nested instance's real exposed properties; read the real rendered text
    node's `.characters` back afterward to confirm the write landed.
11. `.mainComponent` (the synchronous getter) throws "Cannot call with documentAccess:
    dynamic-page" — use `await instance.getMainComponentAsync()` instead.
12. `vectorPaths` data rejects comma-separated coordinates (`M0,100` fails) — this plugin's parser
    wants space-separated (`M0 100 L50 50`), unlike standard SVG path syntax.
13. A circular FILL/HUG sizing chain can silently under-size and clip content with zero thrown
    error — a child set to FILL against a parent that itself HUGs based on that same child's
    resolved size collapses to well under the real content width.

**C. Known open limitation, disclosed rather than silently worked around:**

14. Real CDS icon glyphs could not be placed — CDS icons have no published Figma component key at
    all, and this plugin sandbox's `fetch()` to the public SVG icon host fails when called from
    inside the plugin. Real icon *slugs* were still resolved and attached by name/color-coded
    stand-in, but the actual glyph artwork is not real. Still open as of v0.8.0.

Two more standing rules from this run: **compose, don't leave blank** (a gap the DS has no
component for gets a real mockup from real tokens/primitives, never an empty placeholder box) —
and **screenshot before reporting done** (a structural node-tree read succeeding is not proof the
visible result is correct).

---

## v0.3.0 — a "done" screenshot can itself be showing a zombie duplicate

1. v0.2.0's "screenshot before reporting done" rule has a real gap: the screenshot itself can be
   showing a leftover zombie instance, not the fix. A Heading Text Block instance was fixed
   correctly (confirmed by reading its own text nodes directly) and screenshotted correctly in
   isolation — but the FRAME screenshot, and even a freshly-cloned copy of that frame under a
   brand-new node id, kept showing the old placeholder content. Root cause: an earlier script call
   in this same run had reported a 25–30s timeout, and per the "a timeout is not a stop" trap
   (v0.2.0 §B), it had kept running in the background and completed *after* the session moved on,
   silently inserting its own duplicate instance into the same parent — sitting alongside the
   correctly-fixed one. Fixed by searching the whole page for duplicate content by name/characters
   before concluding the tool/cache was broken.
2. `instance.setProperties()` called directly in a raw script silently no-ops on TEXT-kind
   properties, even though it visibly changes BOOLEAN properties on the same instance in the same
   call and the call still reports success. This is exactly what `figma_set_instance_properties`'s
   own tool description warns about — the lesson is to obey that warning inside a raw
   `figma_execute` script too, not only when reaching for the dedicated tool.
3. Matching individual pieces without checking the real JSX nesting order produces a structurally
   wrong screen that can still look right at a glance. The prototype's real root layout is
   `flex-col = [Topbar(full width), flex-row = [Sidebar, Content]]` — Topbar spans the entire
   screen width, above both the sidebar and the content. This run had instead built
   `[Sidebar | Main[Topbar, Content]]` — Topbar nested inside the content column. Both pieces
   existed and were individually well-built, but the assembly order was wrong.
4. A correctly-reasoned freehand composition (a real, documented Design System Gap) still has to
   bind every color to the real CDS variable — visually matching a token's current RGB value is
   not the same as binding it. The topbar/sidebar shell was rightly built freehand — but its colors
   were typed as literal RGB copies of what the real tokens currently resolve to
   (`boundVariables: {}` on every fill/stroke checked). Passes a casual look, fails CDS's own
   binding rule, silently drifts the moment a token's value changes.
5. A data-driven color mapping (category → token) must be read from the real source data file,
   never assumed via a fixed rotation. A donut chart's 5 category colors were assigned in rotation
   order instead of the real per-category mapping in the source's own data file — visually
   plausible (5 real accent colors, right count) but 4 of 5 categories had the wrong color.
6. Sizing must mirror the real source's CSS grid/flex ratios, not whatever a piece happened to
   measure at creation time. Four KPI cards meant to be equal `1fr` columns had instead been left
   at four different FIXED pixel widths — each individually plausible, visibly uneven as a row.

---

## v0.4.0 — v0.2.0's own shell-gap correction was itself incomplete

1. Reversing part of v0.2.0 §A.3: that correction was right that the prototype's shell *container*
   has no published CDS component and was correctly built freehand — but it over-corrected by also
   reverting the individual nav *rows* inside that shell back to freehand. The generic `List
   Item`'s own guidance (`get_component`'s `guidance.usage`) explicitly documents a "Selected
   navigation row" example matching this exact use case. A container/shell having no published
   component does not mean everything inside it is freehand too — check each interior piece's own
   candidate component's `guidance.usage` for a matching documented example before accepting a
   source file's freehand comment as the final word on every layer inside it. (This specific
   sidebar-row choice was itself superseded by v0.8.0 — the real purpose-built `Sidebar List Item`
   component existed all along, distinct from the generic `List Item` used here.)
2. New standing step: audit `layoutSizingHorizontal`/`layoutSizingVertical` against the source's
   real CSS behavior for every major region, not just its width/height at build time. Three real
   mismatches found by checking, not by eye: a full-width topbar had `layoutSizingVertical: FIXED`
   (should be `HUG`); a fixed-width sidebar had `layoutSizingVertical: FIXED` (should be `FILL` —
   flex row default `align-items:stretch`); a `flex:1` content column had `layoutSizingHorizontal:
   HUG` (should be `FILL`).

---

## v0.5.0 — v0.4.0's sizing audit was itself incomplete

1. Auditing each child's sizing isn't enough if the row/container they sit in is still `HUG`. The
   4-card KPI row and the chart+donut row were both left at `HUG` (sized to exactly the sum of
   their children) instead of `FILL` against their own parent. Each individual card had already
   been set to `FILL` correctly, but a `FILL` child inside a `HUG` parent just fills that parent's
   already-shrink-wrapped size.
2. A SLOT-workaround wrapper (`layoutMode: NONE`) can still take `FILL` sizing as a child of a real
   auto-layout parent, even though `HUG` is not a valid option for it (`HUG` requires the frame's
   own children to be auto-layout arranged).
3. Real limitation, not a defect: Figma's auto-layout `FILL` only ever splits remaining space
   EQUALLY among `FILL` siblings — no per-child ratio/weight, no Figma equivalent of CSS's
   `1.3fr 1fr`. For a non-equal source ratio, `FILL` on both produces a wrong 50/50 split — the
   correct static encoding is `FIXED` widths computed to match the real ratio.

---

## v0.6.0 — component default sizing can overflow, token family must match exactly

1. A component instance keeps the library's own default/measured size until something resizes it.
   The `List Item` rows fixed onto the sidebar in v0.4.0 were left at `366px` wide — the component
   set's own default — inside a `230px` sidebar column, overflowing by well over half. Invisible in
   a components-exist/properties-correct check; only shows up as literal overflow in a screenshot
   or a direct width read.
2. Two token families can share a hue name and still be visually very different. The donut's 5
   slice colors were bound to real, correctly-ordered `surface-accent-*` variables — but the
   source's own data file names `--content-accent-*` for this role, a different family that
   resolves to a much more saturated color (`content-accent-blue` `#0048b7` vs. `surface-accent-
   blue` `#d9e8ff`). Both are real, correctly-bound CDS variables; only one matches the source.

---

## v0.7.0 — plain Thai annotation prose, a second category, mandatory full-frame binding sweep

1. Annotation content: one clear Thai sentence, not a bold-title + bullet-list template. A real
   reference annotation the requester shared used plain, flowing Thai prose with no markdown
   bullets. This supersedes v0.2.0 §A.1's bullet-template convention.
2. A real reference file uses a second, distinct annotation category — "Unbound" (red) — for a
   pure token/color-binding violation, separate from "Log Note" (yellow) for a missing-component
   gap. "Log Note" = no component/pattern exists; "Unbound" = a real value exists and should be
   tied to it but isn't.
3. A full programmatic sweep of every fill/stroke/text-style on the whole frame finds real
   violations that checking "the pieces you remember to check" misses. Earlier passes had already
   fixed the shell's most visible colors and called binding done — a real sweep of every
   `fills`/`strokes` array on the entire frame found **50 more unbound literal colors** untouched
   (every KPI card's text, every chart label, every legend row).

---

## v0.8.0 — the biggest correction: `cds`'s own search/get_rules can be genuinely incomplete

Every prior version (v0.2.0 through v0.7.0) treated the sidebar/topbar shell as a genuine Design
System Gap because the `cds` MCP server's `search_components`/`get_rules` never surfaced anything
for it. **This was wrong.** `cds-consumer`'s own `context/COMPONENTS.md` (Yo's real,
hand-maintained spec) documents three real, already-audited, ready-to-use components this skill
never found because it only ever searched `cds`'s own index:

- **`Sidebar`** — component, key `db499c6e7b31473a7d44aa74b2e2be31e8490923`. Real slots (`Has Top
  Content`/`Has Bottom Content`, `🧩 Edit Top Content`/`🧩 Edit List Items`/`🧩 Edit Bottom
  Content`), real fill/stroke/padding tokens, a real default width (`328px` — the DS's own
  intended sidebar width, not this skill's earlier guessed `230px`).
- **`Top Navigation Bar`** — component, key `0cd3b6b165a82dacf984dc663905c07d3c20f284`. Real
  `🧩 Start/Middle/End Container` slots, a `Show Browser Search Bar` property (leave `false` unless
  a literal browser-chrome mockup is wanted — when `true` it binds private, consumer-unrebindable
  `_OS Native Color` variables per Yo's own documented, accepted defect D20; when `false` that
  whole subtree is simply hidden (`visible:false`), not deleted, so its internal unbound colors are
  correctly invisible and not a real finding).
- **`Sidebar List Item`** — set, key `e455557edb0ad714088253df0b63c6e2bb6e7483`. NOT the generic
  `List Item` used in v0.4.0/v0.6.0 — a distinct, purpose-built nav-row component with its own real
  exposed `List Item` TEXT property directly on the root instance, `Has Start/End Content`
  booleans, and a documented "no content slot by owner ruling — customise by swapping the exposed
  icon" rule (D41). Confirmed fully audited with zero open findings as of 2026-08-24.

Rebuilt the sidebar container as a real `Sidebar` instance, the topbar as a real `Top Navigation
Bar` instance, and all 6 nav rows as real `Sidebar List Item` instances; removed the now-inaccurate
"composed, no component exists" annotation entirely; widened the frame to the real `328px` sidebar
width plus the content column's real needed width (the old guessed width was silently clipping
content).

**Standing rule, now in `SKILL.md`:** an MCP design-system server's own `search_components`/
`get_rules` is not guaranteed complete — always additionally check the real maintainer's own
`COMPONENTS.md`/`REGISTRY.md` by name/keyword before concluding a shell, pattern, or
building-block genuinely has no component.

---

## v0.9.0 — file reorganized for agent readability

No behavior change. Split the accumulated version-history narrative out of `SKILL.md` into this
file, and restructured `SKILL.md` itself from 3 broad steps into 6 focused ones (Translate →
Resolve against the DS → Verify sizing → Verify token/font/color binding → Compose gaps & annotate
→ Verify before reporting done) so each standing rule sits under the step it actually governs,
without the narrative that produced it. Every rule from v0.2.0–v0.8.0 is preserved in `SKILL.md` in
its current, standing form — this file is the historical record of how each one was found.

## v0.10.0 — cross-pollinated from a sibling skill's own error log

Reviewed กัน's (Kan's) `agent-design-kit` repo, specifically its `figma-error-recovery-playbook`
skill (a general Figma Plugin API error-recovery reference, independent of this skill's own
extraction-specific rules). Cross-checked its entries against everything already in this skill and
folded in the genuinely new, applicable ones (marked ⟂ in `SKILL.md`'s Reference section) rather
than duplicating overlapping ones:

- A raw `setProperties()` call passing a wrapped object instead of a plain primitive doesn't just
  fail that one line — Figma scripts run as one atomic transaction, so the throw rolls back every
  node the script already created earlier in the same call. A second, independent reason (beyond
  the batching/zombie-thread trap) to keep each script call small and scoped.
- `findChild` (direct children only) silently returns `null` for a node sitting inside a Section —
  not an error, just nothing found — which can make a binding pass report "0 errors" while never
  having run at all. Default to `findOne` (recursive) for any page-level search.
- `importComponentByKeyAsync` has a second, independent failure mode beyond the `COMPONENT_SET`
  vs. `COMPONENT` type mismatch this skill already knew: it also fails for a same-file component
  (only works across external library files) — same error message, different real cause and fix.
- `layoutSizingHorizontal`/`Vertical` use `'HUG'` while the parent-level
  `primaryAxisSizingMode`/`counterAxisSizingMode` use `'AUTO'` for the same concept — easy to
  cross the two enums by mistake.
- Sizing-mode order of operations: `FILL` child-sizing must be set after `appendChild` and after
  the parent's `layoutMode`; locking a frame to `FIXED` should happen before `appendChild`; setting
  `AUTO`/hug behavior should happen last, after any `resize()` call, or the resize silently wins.
- An `-inverse`-suffixed token's real direction is a per-system convention (can mean "always dark
  surface," not "opposite of whichever theme is active") — verify the actual bound RGB rather than
  trusting the name, a technique worth generalizing to any ambiguously-named token.
- A Figma URL's `node-id` uses `-` as separator; the Plugin API wants `:` — and a node-id can
  resolve to a PAGE (no `x`/`y`, throws on coordinate access) rather than a Frame.

No behavior change to the extraction pipeline itself — these are additional Plugin-API traps to
watch for, organized into the Reference section's existing categories.

---

## v0.11.0 — default scope widened to whole screen; chrome needs the same source-grep discipline as content; a corrective pass propagated its own bug

Real run: "Investment Overview" screen, `[StaffPortal_ABC] Dashboard`, requested first as two named
sections, then as the whole screen, then as two specific tab states, surfacing four more real
defects.

1. **Scope defaulted too narrow.** Given a section name as scope, the skill built only that
   section — correct behavior for an explicit narrowing, but the same narrow-by-default read
   also applied when the caller's intent was actually "the whole screen," requiring a full redo.
   **Fixed:** scope now defaults to the whole screen (persistent chrome + every section/tab) unless
   the caller names a narrower one; see `SKILL.md`'s Expected input.
2. **An entire tab-navigation layer was invisible to a browsing pass and had to be found by
   grepping the prototype's own bundled source.** The rendered default view showed no tab bar at
   all; the actual source defined four tabs (`overview`/`rebalancing`/`risk`/`funds`) behind a
   `useState` initialized to one of them. One tab's real content (`funds`) turned out to be a CDS
   `Table`, not the card-list shape a same-named section on a different (already-seen) screen had
   suggested. **Fixed:** new Step 0, run before Step 1 — grep source for tab/state arrays before
   treating any screen as understood; build every tab/state scope reaches, each as its own full
   screen; read each tab's content from source rather than pattern-matching a similarly-named
   section seen elsewhere.
3. **The persistent chrome (sidebar) was built from a remembered screenshot, not from source —
   and shipped three defects invisible in a static render.** (a) The source's own nav-item array
   marks 5 of 6 items `enabled:false`; only one is real. A screenshot cannot reveal a disabled flag
   unless you already know to look for a subtle color difference, and this one didn't render
   distinctly enough to catch by eye. (b) Two icons were `iconKind:'glyph'` — a local custom asset
   with no CDS equivalent (confirmed: `find_icon` genuinely returns nothing for piggy-bank/package/
   robot) — while a third was `iconKind:'cds', icon:'booking'`, an explicit, authoritative name
   that was never checked; a semantic `find_icon` search ran instead and happened to return a
   different, merely-plausible slug for a different item. (c) A segmented pill toggle that looked
   like a one-off custom widget was hand-composed from frames — it was the same real `Tab`
   component (`Style=Fill - Pill`) already correctly identified and used for the tab bar elsewhere
   in the very same extraction, just never searched for at the point the toggle was built.
   **Fixed:** Step 0 extended — chrome gets the same source-grep discipline as tab content; explicit
   `iconKind:'cds', icon:'X'` in source is ground truth, checked before any semantic icon search;
   any custom-looking repeated control (toggle, segmented switch) gets a component search
   (`tab`, `chip`, `toggle`) before being hand-built.
4. **Fixing defect 3(a) introduced its own bug, and a follow-up corrective pass propagated it
   instead of catching it.** The first fix used a wrong node-matching selector (matched a wrapper
   FRAME named "Title" instead of the TEXT child of the same name), so every item's label read as
   `null` — including the one item meant to stay in its original enabled/selected state, which then
   also got swapped to the disabled variant along with the other five. A follow-up pass fixed the
   selector, correctly read labels this time, found the one item already "looking handled" (its
   label was now readable, and it was already *some* variant), and moved on without checking that
   variant was the *right* one. The mis-swap sat live through a full token sweep and a "looks
   correct" screenshot review, because the sweep checked token binding, not variant identity — it
   was only caught when the requester independently compared the render against the real source.
   **Fixed:** a corrective pass must verify **every** item in the batch the original bug could have
   touched against its actual intended end-state, not just the items its own new logic positively
   re-identifies — added to Step 6 as a named case (`SKILL.md` §"A corrective pass must diff
   against the last known-good state").
5. **A zombie duplicate from an already-recovered timeout can still land after the final
   screenshot.** A table-building call timed out, was checked for zombies immediately (found none,
   correctly — nothing had landed *yet*), was rebuilt manually, screenshotted clean, and reported
   done. The original call's straggler then completed server-side sometime after that screenshot,
   inserting a second copy of the section. It went out reported-clean and was only caught when the
   requester noticed the doubled section directly in Figma. **Fixed:** re-run the duplicate-name
   sweep immediately before the final report every time, not only right after a timeout — the gap
   between "timeout recovered" and "reported done" is exactly the window a straggler completes in.
6. **Added a default minimum screen size by device class** (desktop 1440×1024, tablet 1280×800,
   phone 375×812 — width fixed, height free to grow) so screen dimensions stop being reinvented per
   run; see `SKILL.md`'s "Screen dimensions" section.

---

## v0.12.0 — a rule everyone already knew got skipped for an entire run anyway: annotations

A full three-screen build finished, was screenshotted, swept for tokens, swept for zombies, and
reported done — with **zero** annotations, despite the run having found six genuine, confirmed
gaps along the way (a composed donut-adjacent slider replacement, a manually-built table, and three
separate icon substitutions where CDS had no real match). Step 5 already said, in plain language, to
annotate every gap — that was never the missing information. It surfaced only because the requester
looked at the finished file and asked "where are the annotations?"

**Root cause:** "annotate as you go" has no natural trigger in a build spread across a dozen-plus
separate script calls over a long session. Each gap got composed correctly in the moment, and the
annotation step silently never happened, because nothing forced a look-back at the full set of gaps
found before the final report went out — the same shape of failure this file already names for
zombie duplicates and mis-propagated fixes: an instruction that fires once, with nothing checking
whether it actually landed.

**Fixed:** Step 5 now requires a running written gap list (node id + one-line reason) started the
moment the first gap is found, not held in memory. Step 6 now checks that list directly — reads
back `node.annotations` on every listed id and confirms it is non-empty with the right category —
before anything is reported done. An empty gap list is only correct if Step 5's own list is
actually empty, not if the build simply never stopped to write one down.

---

## v0.13.0 — a sidebar rebuilt from real source, a header left untouched from before that habit existed

Same run as v0.12.0/v0.11.0, one more real find: the requester compared the finished header against
the live prototype and found it didn't match — wrong padding (16px vs source's 24px), wrong height
(hugged ~88px vs source's fixed 72px), a full CDS `Text Field` component used for what source
builds as a plain bordered `<input>` with no label/hint chrome, and a notification button with the
wrong fill. Also flagged: a Card Container that had no earlier findable "Card" match was in fact
available and should have been used for the sidebar's bordered nav grouping (fixed in-session by
swapping to a real `Card Container` instance behind the existing nav content, not rebuilding it —
same node, same content, real component added underneath).

**Root cause:** the header was built early in the session, before this run had developed the
habit (later written up as Step 0) of grepping source for chrome. Once the sidebar's real source
component was found and correctly rebuilt from it, nothing prompted going back to re-check the
header against source too — each piece of chrome had its own screenshot review and was judged
individually "done," and a screenshot review checks internal consistency, not layout-against-source.
The header's mismatches were exactly the kind Step 0 exists to catch, but Step 0 only fired once,
for the sidebar, not again for its sibling.

**Fixed:** Step 0 extended — grepping source for any one piece of chrome on a screen now requires
grepping it for every other piece of chrome on that same screen too, including pieces already built
and already screenshotted, before any of them count as finished.

---

## v0.14.0 — grepped the right-looking function, wrong function: dead code in the bundle, and no one asked which option to build

Two separate defects found by the requester in the same follow-up session, after the extraction
itself was already reported done.

**A. Dead code with the right keywords.** The requester asked, separately from the Figma work, to
change a customer/staff workspace switcher in the *live prototype's own code* (not Figma) to use a
real CDS field component. Grepping the prototype's bundled source for the switcher's translation
keys (`switchWorkspace`, `staffViewLabel`, `customerViewLabel`) found a function that looked exactly
right — correct screen id nearby, correct labels, a real Popover+Menu+ListItem dropdown already
built from real components. It was patched cleanly (valid syntax, verified with `node --check`
before and after) and published. Opening the live prototype afterward to confirm: the patch had no
visible effect. A second, completely different function elsewhere in the same bundle — using
shorter labels (`Staff`/`Customer` instead of `staffViewLabel`/`customerViewLabel`) and a real CDS
`Tab` component in `Fill - Pill` style instead of a dropdown — was the one actually mounted and
rendered. The first function was a syntactically valid, fully-formed leftover from an earlier design
pass, still sitting in the bundle, never deleted, matched by grep purely because it happened to
reuse recognizable naming.

**Root cause:** a bundled prototype accumulates draft history. Grep can confirm a string exists in
the bundle; it cannot tell live code from dead code. Nothing in this skill's process checked the
grepped match against what the prototype actually renders before building/patching from it — a gap
compounded by working from a copy of the prototype's source cached earlier in a long session,
without re-fetching to confirm it still reflected the currently-live version (the artifact had moved
through several unrelated published versions in the meantime).

**Fixed:** new Step 0 point — before trusting a grepped match for anything the caller can also see
rendered live, spot-check the exact visible text or a distinctive prop against the actual on-screen
render, and re-fetch cached source rather than trusting an earlier fetch from the same session. If
more than one function plausibly implements the same UI role, that plurality itself is the signal to
verify before building from either.

**B. No one asked which option.** The same investigation surfaced that the bundle's screen ids and
component names were explicitly suffixed `OptionA` throughout, implying at least one sibling
`OptionB` was expected to exist (it didn't, in this case — but the naming convention itself signals
a prototype built to compare options, and nothing in this skill's process would have stopped it from
silently picking one had two existed side by side). The requester separately, explicitly asked that
whenever a prototype or request carries more than one named option — design, tone of voice,
branding, design system — the skill must ask which one to build, not choose silently.

**Fixed:** new rule under "Expected input" — detect multiple named options before Step 1 finishes
and stop to ask the caller which to build, every time, not only on a run's first screen.
