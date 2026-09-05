# Estimation logic

Read this before filling in any Scope, Readiness, Components, or Functions block in the report template. It's the judgment layer the template's `{{TOKENS}}` don't encode by themselves.

**This skill deliberately does not output a Design Effort week range or a Complexity (Low/Medium/High) label — not for any story, and not as a rolled-up total.** Earlier versions did, and it was misleading: those numbers are a judgment call with no objective basis, they varied between runs on the *same* prototype, and stating them with the same visual confidence as the component-readiness percentages (which are at least checkable against a real catalog) implied a precision the report doesn't have. What the report gives instead is the raw material a human who knows the team's velocity actually needs to size the work themselves: full scope, per-story readiness, and the specific reasoning behind every gap (the "Why this matters" callout). Don't reintroduce a numeric effort or complexity estimate unless the user explicitly asks for it back — and if they do, say plainly that it'll carry the same "your mileage may vary" caveat as before.

## Where scope comes from — never invent it

This team's coded prototypes carry their own annotation layer, usually reachable from a floating control (often labeled "Presentation Mode" or similar) that opens two panels:

- **Prototype Settings** — a Design Direction toggle (e.g. "Original" vs. "Option A"), and usually Dark Mode / Branding Theme / Tone of Voice toggles too.
- **Design Review** — per screen, structured blocks: a **Requirement** (User Story + Acceptance Criteria), a **UX Rationale**, and a **Design System Evaluation**.

The Design Review content *is* the scope. Every Epic, every User Story, every Acceptance Criteria line, every risk in §05 should trace back to something actually written in one of these blocks. If the prototype states its own scope summary (e.g. "Scope: 3 Epics · 7 User Stories"), treat that as a checksum on your own count, not a number to just copy — if your derived list doesn't match it, go find the story you missed rather than fudging the total.

Don't pad the report with plausible-sounding stories that "should" exist. If a screen has no annotation at all, either it's out of scope for this report or the prototype hasn't been annotated yet — say so, don't guess.

### Existing vs. Missing/Exceptional

- **Existing** = the prototype renders this screen right now, even if the annotation says it needs work before it's production-ready (wrong sort order, unverified responsive behavior, a copy issue — all still "existing, needs refinement").
- **Missing / Exceptional** = the annotation itself says a state, modal, or screen doesn't exist yet — usually because it names a business rule or compliance gap that has no UI for it at all. These never get a screenshot (see the screenshot-capture doc) — they get the dashed ghost card.

### The Design Direction toggle matters more than it looks

If the prototype exposes more than one Design Direction, toggle to the one the user asked for (or the one they name if they don't specify — ask if it's genuinely ambiguous) **before** reading a single annotation or taking a single screenshot. The underlying screens can restructure completely between options — in one real case, a page that was a single long scroll under "Original" became four separate tabs under "Option A", with different sub-navigation entirely. A report that mixes annotations read under one toggle state with screenshots taken under another will describe a prototype that doesn't actually exist in either state.

## What drives a gap, even without a number

You're not scoring effort, but every ✕ and △ (in Components, Functions, or a §05 risk) should still say *why it matters*, in the "Why this matters" callout or the risk's one-liner — not just that it's missing. Signal to weight in that reasoning, roughly in order of how much a reader should care:

- **Missing modals/states attached to the story.** A story with 1 existing screen and 2 missing modals is doing a lot more than the screen count suggests — say that plainly rather than leaving it implied by the ✕ count.
- **Validated business logic**, e.g. "must sum to 100% before the button enables," multi-branch conditional flows, anything with a real state machine behind it — these are usually where a "looks simple" screen hides real build work.
- **Compliance-risk language in the annotation.** If a UX Rationale or Design System Evaluation block calls something a "compliance blocker," or says a recommendation engine isn't filtered by an eligibility rule the business actually requires, that's not a nice-to-have gap — flag it in §05 as high severity regardless of how simple the screen looks.
- A story that reads as low-risk is usually one where the prototype is already close to production-ready and the annotation's own gaps are cosmetic (sort order, a missing badge variant) rather than structural — say that too, it's useful signal on its own.

## Component reality-check

The single most common way this report goes wrong is inventing a component name that sounds plausible ("KPI Card", "Donut Chart", "Segment Tile") and treating it as if it exists in the design system. It probably doesn't. Ground every single line in the Components list in something you actually looked up.

1. **Crawl the design system's real component catalog first**, before mapping anything. Read the whole catalog listing page — it's often long, so raise `max_chars` or paginate rather than reading a truncated first chunk and assuming that's everything. Note the URL pattern for individual component pages (usually `#/components/<kebab-slug>` for a site like cds-bbl, but confirm it by clicking one).
2. Many internal design systems are **pure UI-kit primitives** — buttons, inputs, cards, tabs, badges, tables, dialogs, sliders — with **no chart/graph/data-visualization components at all**. If the prototype has a donut chart, a funnel chart, a line chart with a target line — check the real catalog for anything chart-shaped before assuming one exists. If nothing does, that's a ✕, full stop, regardless of how central the chart is to the screen.
3. For every UI element the prototype actually uses, decide:
   - **✓ ready** — an exact real primitive exists for it. Link straight to that component's real catalog page.
   - **△ partial** — the closest real primitive exists, but doesn't cover what this screen needs (e.g. a generic Table primitive exists, but a multi-select "compare these rows" pattern doesn't). Say exactly what's missing, don't just say "needs work."
   - **✕ missing** — nothing in the library resembles it. Say why (e.g. "the catalog has no chart component of any kind").
   Never write a component name in the ✓ column that you didn't actually find on the catalog site, and never construct a `#/components/<slug>` link by guessing the slug from the display name — confirm it (a find/search on the catalog page, or a direct visit) before using it.

### Figma links (only if the connector is authorized)

If the Figma plugin/connector is authorized this session:

1. Ask the user for the actual published library file URL if you don't already have it — **never guess a fileKey**. A duplicated/working-copy Figma file re-keys every component, so a fileKey for the wrong copy of the library will produce links that don't resolve to what you think they do.
2. Resolve real per-component node IDs against that exact file — call the Figma plugin's `search_design_system` and/or `list_file_components_for_code_connect` tools with the fileKey, and match by **exact component name** (e.g. "Card Container", not "KPI Card" — you're looking up the real primitive you already mapped to, not the prototype's invented label). `list_file_components_for_code_connect` returns the whole file's component list in one call including each `nodeId` — for files with 100+ published components this response can exceed the tool's token limit and gets saved to a result file instead; read that file directly (search it for the exact name, don't try to read it end-to-end if it's huge).
3. Build the link as `https://www.figma.com/design/<fileKey>/<url-encoded-file-name>?node-id=<id-with-dash-not-colon>` (Figma's own node IDs use `:`, e.g. `2597:18224` — the URL parameter wants `2597-18224`).
4. If Figma isn't authorized yet, or the user hasn't given you a file link, don't block on it and don't fake a link. Add **one** note near the top of §04 explaining the limitation and how to fix it (tell the user to authorize the connector, or say where to find "authorize Figma" in their client) — never repeat that explanation on every single component row.

## Functions readiness

Separate from Components — this is about business logic, not UI. "✓ รองรับแล้ว" is behavior the prototype's own interactions demonstrate working (you clicked it, it validated, it did the right thing). "✕ ยังขาด" is behavior the Acceptance Criteria requires but the prototype doesn't implement — including anything the UX Rationale explicitly calls out as a known gap ("ยังเป็นช่องว่างที่ build นี้ยังไม่ได้ทำ" is a direct quote worth watching for — the prototype's own annotations often say this plainly).
