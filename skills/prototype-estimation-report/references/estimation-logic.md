# Estimation logic

Read this before filling in any Scope, Readiness, Components, or Functions block in the report template. It's the judgment layer the template's `{{TOKENS}}` don't encode by themselves.

Sections below follow the order you'll actually need them in, roughly matching the report's own §02→§06 flow: scope first, then how to write for the report's real audience, then how to judge and word Acceptance Criteria/Readiness/Components/Functions, then risk severity, then the environment gotchas that have bitten past runs.

## No Design Effort or Complexity number — ever

**This skill deliberately does not output a Design Effort week range or a Complexity (Low/Medium/High) label — not for any story, and not as a rolled-up total.** Earlier versions did, and it was misleading: those numbers are a judgment call with no objective basis, they varied between runs on the *same* prototype, and stating them with the same visual confidence as the component-readiness percentages (which are at least checkable against a real catalog) implied a precision the report doesn't have. What the report gives instead is the raw material a human who knows the team's velocity actually needs to size the work themselves: full scope, per-story readiness, and the specific reasoning behind every gap (the "Why this matters" callout). Don't reintroduce a numeric effort or complexity estimate unless the user explicitly asks for it back — and if they do, say plainly that it'll carry the same "your mileage may vary" caveat as before.

## Scope: where it comes from, and never inventing it

This team's coded prototypes carry their own annotation layer, usually reachable from a floating control (often labeled "Presentation Mode" or similar) that opens two panels:

- **Prototype Settings** — a Design Direction toggle (e.g. "Original" vs. "Option A"), and usually Dark Mode / Branding Theme / Tone of Voice toggles too.
- **Design Review** — per screen, structured blocks: a **Requirement** (User Story + Acceptance Criteria), a **UX Rationale**, and a **Design System Evaluation**.

The Design Review content *is* the scope. Every Epic, every User Story, every Acceptance Criteria line, every risk in §05 should trace back to something actually written in one of these blocks. If the prototype states its own scope summary (e.g. "Scope: 3 Epics · 7 User Stories"), treat that as a checksum on your own count, not a number to just copy — if your derived list doesn't match it, go find the story you missed rather than fudging the total.

Don't pad the report with plausible-sounding stories that "should" exist. If a screen has no annotation at all, either it's out of scope for this report or the prototype hasn't been annotated yet — say so, don't guess.

### When the prototype has no annotation layer at all

Some prototypes — or plain product surfaces the user points this skill at anyway, like a live research archive or an app with no Design Review panel built in — carry no Requirement, Acceptance Criteria, or UX Rationale text anywhere. Don't stop at "say so, don't guess" when the user still wants a report out of it. Instead:

1. **Tell the user plainly, once, before drafting anything** — this prototype has no annotation layer, so every User Story and Acceptance Criteria in the report will be AI-drafted from directly observed behavior, not literal text pulled from the prototype. Get their go-ahead (or their choice of a different prototype) before proceeding — this is a required-inputs decision, not a footnote to add after the fact.
2. **Ground every drafted story in something you actually clicked, typed, or read on screen in this session.** A real search box that live-filters, a real toggle that visibly changes state, a real list you scrolled through and read. Never draft a story for a screen or interaction you didn't personally exercise.
3. **Label the drafted story with one short badge, not a sentence baked into the story.** Put a small one-time tag (e.g. "AI-drafted from observed use") directly above the quote — a reader must be able to tell instantly which is which, every time, without you re-explaining it in prose each time. The quote itself contains *only* the "As a … I want … so that …" sentence — no rationale, no cited evidence, no explanation before or inside it. If the evidence behind the story is worth showing (a page's own tagline, a self-declared limitation, something you tested), put it in that story's "Why this matters" callout, never in the User Story block itself — a User Story that opens with a paragraph of justification reads as an explanation, not a story.
4. **Acceptance Criteria drafted this way are what you verified worked (or didn't) when you tried it** — "typed X, got Y" — not a guess at what the product *should* do. If you didn't test an interaction, don't assert it as an AC; say plainly that it wasn't verified.
5. This fallback never overrides a real annotation layer when one exists. Prefer literal Requirement/Acceptance-Criteria/UX-Rationale text per the rule above whenever it's there — use AI-drafted stories only when there is genuinely nothing written to read.

### Existing vs. Missing/Exceptional

- **Existing** = the prototype renders this screen right now, even if the annotation says it needs work before it's production-ready (wrong sort order, unverified responsive behavior, a copy issue — all still "existing, needs refinement").
- **Missing / Exceptional** = the annotation itself says a state, modal, or screen doesn't exist yet — usually because it names a business rule or compliance gap that has no UI for it at all. These never get a screenshot (see the screenshot-capture doc) — they get the dashed ghost card.

### The Design Direction toggle matters more than it looks

If the prototype exposes more than one Design Direction, toggle to the one the user asked for (or the one they name if they don't specify — ask if it's genuinely ambiguous) **before** reading a single annotation or taking a single screenshot. The underlying screens can restructure completely between options — in one real case, a page that was a single long scroll under "Original" became four separate tabs under "Option A", with different sub-navigation entirely. A report that mixes annotations read under one toggle state with screenshots taken under another will describe a prototype that doesn't actually exist in either state.

## Writing for the report's actual audience

The report's audience is Product, Compliance, and Dev — not this team's own design-process vocabulary. Never let this skill's own internal terms leak into the report's prose: "annotation layer," "Design Review panel," "Prototype Settings panel," "Design Direction toggle" mean nothing to someone outside this team's tooling. Say what they mean in plain language instead, every time you'd otherwise reach for the term — e.g. "a written requirements document set out in advance," not "an annotation layer." This file and `SKILL.md` can keep using the real term for the agent's own operating instructions; the report's own visible text never should.

This also means: say the "how do we know this" caveat once, in the report's own top summary — never per-story, and never inside a section heading (a heading reading "Acceptance Criteria (observed from real use, not annotation)" is a methodology footnote wearing a heading's clothes; the heading is just "Acceptance Criteria").

The rule below on Readiness Detail/Functions is this same principle applied to two specific blocks that keep sliding back into jargon because they sit right next to the one block that's supposed to be technical (Components).

## Judging and writing Acceptance Criteria, Readiness, Components, and Functions

### Acceptance Criteria marks mean what they say

Every Acceptance Criteria line is a real, testable statement about the product itself — never a note about the report's own methodology. "There's no annotation to check this against" is not an Acceptance Criteria line; that caveat belongs once, in the report's top summary, not scattered through every story's AC list disguised as a bullet. Use the marks for what a reader actually expects them to mean:

- **✓** — you tried it and it worked as stated.
- **△** — a real, relevant condition or limitation that matters to the reader, but you didn't (or couldn't) fully verify it end to end — e.g. the product's own copy states a caveat ("not yet reviewed by a person"), or a stated rule applies to more items than you individually checked one by one.
- **✕** — you tried it and it failed, or the criteria requires something the product doesn't have at all.

Never use ✕ to mean "no source text exists to check this against" — that's a sourcing note, not a failed criterion, and it doesn't belong in this list at all.

### Component reality-check

The single most common way this report goes wrong is inventing a component name that sounds plausible ("KPI Card", "Donut Chart", "Segment Tile") and treating it as if it exists in the design system. It probably doesn't. Ground every single line in the Components list in something you actually looked up.

1. **Crawl the design system's real component catalog first**, before mapping anything. Read the whole catalog listing page — it's often long, so raise `max_chars` or paginate rather than reading a truncated first chunk and assuming that's everything. Note the URL pattern for individual component pages (usually `#/components/<kebab-slug>` for a site like cds-bbl, but confirm it by clicking one).
2. Many internal design systems are **pure UI-kit primitives** — buttons, inputs, cards, tabs, badges, tables, dialogs, sliders — with **no chart/graph/data-visualization components at all**. If the prototype has a donut chart, a funnel chart, a line chart with a target line — check the real catalog for anything chart-shaped before assuming one exists. If nothing does, that's a ✕, full stop, regardless of how central the chart is to the screen.
3. For every UI element the prototype actually uses, decide:
   - **✓ ready** — an exact real primitive exists for it. Link straight to that component's real catalog page.
   - **△ partial** — the closest real primitive exists, but doesn't cover what this screen needs (e.g. a generic Table primitive exists, but a multi-select "compare these rows" pattern doesn't). Say exactly what's missing, don't just say "needs work."
   - **✕ missing** — nothing in the library resembles it. Say why (e.g. "the catalog has no chart component of any kind").
   Never write a component name in the ✓ column that you didn't actually find on the catalog site, and never construct a `#/components/<slug>` link by guessing the slug from the display name — confirm it (a find/search on the catalog page, or a direct visit) before using it.

#### Figma links

**If this team's own design-system MCP is available for the system in play (e.g. `cds`, `mbds`, `webds`), prefer it over the generic Figma plugin flow below.** Its `get_component(slug)` call returns the real published Figma key and node ID for that exact component, already joined to the library file it's meant to resolve against — no search, no guessing a slug, no risk of pulling a key from a duplicated working copy. Build the link as `https://www.figma.com/design/<fileKey>/<url-encoded-file-name>?node-id=<id-with-dash-not-colon>` using exactly the key and node ID the tool returns.

If no such design-system MCP exists for this system, fall back to the generic Figma plugin/connector, only if it's authorized this session:

1. Ask the user for the actual published library file URL if you don't already have it — **never guess a fileKey**. A duplicated/working-copy Figma file re-keys every component, so a fileKey for the wrong copy of the library will produce links that don't resolve to what you think they do.
2. Resolve real per-component node IDs against that exact file — call the Figma plugin's `search_design_system` and/or `list_file_components_for_code_connect` tools with the fileKey, and match by **exact component name** (e.g. "Card Container", not "KPI Card" — you're looking up the real primitive you already mapped to, not the prototype's invented label). `list_file_components_for_code_connect` returns the whole file's component list in one call including each `nodeId` — for files with 100+ published components this response can exceed the tool's token limit and gets saved to a result file instead; read that file directly (search it for the exact name, don't try to read it end-to-end if it's huge).
3. Build the link as `https://www.figma.com/design/<fileKey>/<url-encoded-file-name>?node-id=<id-with-dash-not-colon>` (Figma's own node IDs use `:`, e.g. `2597:18224` — the URL parameter wants `2597-18224`).
4. If Figma isn't authorized yet, or the user hasn't given you a file link, don't block on it and don't fake a link. Add **one** note near the top of §04 explaining the limitation and how to fix it (tell the user to authorize the connector, or say where to find "authorize Figma" in their client) — never repeat that explanation on every single component row.

### Readiness Detail and Functions: plain language, no repeated component names

Readiness Detail and Functions sit right next to the Components list, which *is* technical (real component names, real links, meant for a developer to click through) — and that's exactly why jargon keeps sneaking back into these two blocks. They're read by the same Product/Compliance/Dev audience as the rest of the report, and a sentence like "Card Container, Tag, Avatar, and the CTA Button map to existing CDS components" means nothing to most of that audience.

- **Readiness Detail** restates the same ✓/△/✕ judgment as the Components list below it, but in plain terms of what it means for someone building this — never by re-listing component names a second time. "The cards, badges, and buttons on this screen all have ready-made pieces to build from" (✓), "the search box has a ready-made piece to start from, but the icon inside it needs extra work" (△), "there's nothing ready-made for the language switch — it needs to be designed and built from nothing" (✕). The Components block below still names the real components with real links; Readiness Detail is the human summary of the same facts, not a duplicate written in code terms.
- **Functions** is separate from Components — it's about business logic, not UI — and it describes what a person sees happen when they use the feature, never the implementation. Not "live search-filter with URL state," but "typing in the search box filters the list immediately, and the search term is saved in the link so it can be shared." Not "regex-extracted sentences, not yet QA'd," but "the system pulls out sentences with numbers automatically, and no one has checked them by hand yet." Banned words in this block: any framework/API/pattern name, "regex," "prop," "re-render," "handshake," "self-declared," "URL state," or a bare component name.
- Head the two Functions sub-lists **"✓ Works already" / "✕ Not there yet"** (Thai: "✓ ทำงานได้แล้ว" / "✕ ยังไม่มี"), not "✓ Supported" / "✕ Missing" — the former reads as what happened when you used it, the latter reads like a spec-compliance checklist.
- "✓ Works already" is behavior the prototype's own interactions demonstrate working (you clicked it, it validated, it did the right thing). "✕ Not there yet" is behavior the Acceptance Criteria requires but the prototype doesn't implement — including anything the UX Rationale explicitly calls out as a known gap ("ยังเป็นช่องว่างที่ build นี้ยังไม่ได้ทำ" is a direct quote worth watching for — the prototype's own annotations often say this plainly).

## What drives a §05 risk's severity, even without a number

You're not scoring effort, but every ✕ and △ (in Components, Functions, or a §05 risk) should still say *why it matters*, in the "Why this matters" callout or the risk's one-liner — not just that it's missing. Signal to weight in that reasoning, roughly in order of how much a reader should care:

- **Missing modals/states attached to the story.** A story with 1 existing screen and 2 missing modals is doing a lot more than the screen count suggests — say that plainly rather than leaving it implied by the ✕ count.
- **Validated business logic**, e.g. "must sum to 100% before the button enables," multi-branch conditional flows, anything with a real state machine behind it — these are usually where a "looks simple" screen hides real build work.
- **Compliance-risk language in the annotation.** If a UX Rationale or Design System Evaluation block calls something a "compliance blocker," or says a recommendation engine isn't filtered by an eligibility rule the business actually requires, that's not a nice-to-have gap — flag it in §05 as high severity regardless of how simple the screen looks.
- A story that reads as low-risk is usually one where the prototype is already close to production-ready and the annotation's own gaps are cosmetic (sort order, a missing badge variant) rather than structural — say that too, it's useful signal on its own.

## Environment gotchas

### Never wire a script-triggered print or download button

A "Download as PDF" or "Print" button whose `onclick` calls `window.print()` (or attempts any file save) looks reasonable and is broken in this environment: the published Artifact runs inside a sandboxed frame that silently blocks script-triggered print and download calls — no console error, the click just does nothing. Confirmed by testing: clicking such a button did nothing at all, while the viewer's own `Ctrl+P` / `Cmd+P` keyboard shortcut opened the print dialog correctly, because that command comes from the browser itself, not the sandboxed page's script.

Don't build the button. Instead, ship `@media print` CSS in every report so a viewer's own Ctrl+P/Cmd+P produces something worth saving: hide `.toc` and the lightbox, prevent a story card or epic from splitting across a page break, and force `print-color-adjust: exact` (plus its `-webkit-` prefix) so status badges and readiness colors don't print as plain black text. `report-template.html` ships this block already — keep it, and never add a button on top of it that promises a click will do something it can't.

See `references/screenshot-capture.md`'s own final section for the other known environment gotcha (the Browser pane going silently unresponsive mid-session) — not duplicated here since it's specific to the screenshot-capture workflow, not to writing the report itself.
