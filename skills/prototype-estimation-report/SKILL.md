---
name: prototype-estimation-report
description: Turns a coded Claude Artifact prototype into a published design scope-and-readiness report — full scope (epics/user stories from the prototype's own annotations), per-story component/function readiness checked against the real design system, risks, next steps. Deliberately skips any Design Effort week range or Low/Medium/High complexity label — too unreliable to state as a number, leaves time-sizing to whoever knows the team's velocity. Use whenever someone shares a prototype Artifact link and asks for an estimation report, scope/readiness report, or "how much work is this" — "ทำ estimation report", "สร้าง design estimation report จาก prototype นี้", "ประเมิน scope จาก prototype", "scope this design". Also trigger to update/add detail to a report already made with this skill. Not for a from-scratch feature with no prototype, or a generic timeline request unrelated to an Artifact prototype.
---

# Prototype estimation report

Reads a coded prototype's own in-app annotations (not guesswork) and turns them into a structured, presentable scope-and-readiness report — the kind a design lead can hand to Product/Compliance/Dev to scope a build themselves. The report is itself a published HTML Artifact, styled to match the target design system.

It reports scope and readiness, not a time estimate. No Design Effort week range, no Low/Medium/High complexity chip, anywhere in the output — not per story, not rolled up. That's a deliberate choice: those numbers are a judgment call with no objective basis, they've been observed to vary between runs on the *same* prototype, and stating them next to the (checkable) component-readiness percentages implied a precision the report didn't actually have. See `estimation-logic.md` for the full reasoning if you're tempted to add one back — don't, unless the user explicitly asks, and even then say the same caveat applies.

See CHANGELOG.md for the real-run history and reasoning behind every rule below.

This is a judgment-heavy skill, not a fill-in-the-blanks one. The three reference files below carry the actual know-how; read them before doing the corresponding step, don't try to wing it from memory:

- `references/estimation-logic.md` — how scope, readiness, and risk severity are actually decided. Read before you write a single Readiness, Components, or Functions block.
- `references/screenshot-capture.md` — the exact click-through-and-recover procedure for turning what you see in the Browser pane into real image files. Read before opening the Browser pane.
- `references/report-template.html` — the real HTML/CSS skeleton to copy and fill. Read before writing the output file.
- `scripts/extract_screenshots.py` — run this once you've captured every screen you need; see screenshot-capture.md for the exact command.

## Required inputs

Ask for whatever's missing before starting — don't guess these:

1. **The prototype's Artifact URL.**
2. **Which Design Direction/Option to standardize on**, if the prototype exposes more than one (a toggle inside its own "Prototype Settings" panel — see `estimation-logic.md`). Default to whatever the user already named; ask only if it's genuinely ambiguous and more than one option exists.
3. **The team's design-system reference site** — a component catalog you can crawl for a real, exhaustive component inventory. Default to `https://cds-bbl.vercel.app/#/` (catalog at `/#/components`, individual pages at `/#/components/<kebab-slug>`) unless the user names a different one.
4. **Figma**, only if you want real per-component Figma links: check whether the Figma plugin/connector is authorized this session. If yes, ask for the actual published library file URL (this team's default is "⭐️ Core Design Library" at `https://www.figma.com/design/ON8Azjo7wIi3P2oxnxKiBb/`) — never guess a fileKey, a duplicated working copy of a library re-keys every component in it. If Figma isn't authorized, that's fine — proceed without it and say so once, per `estimation-logic.md`.

## Process

1. **Open the prototype, set the Design Direction, and read its own annotations.** Most of this team's prototypes carry a "Design Review" panel (Requirement / UX Rationale / Design System Evaluation, per screen) and a "Prototype Settings" panel (the Design Direction toggle, among others). That annotation content is the scope — read `estimation-logic.md` for exactly how to turn it into Epics and User Stories without inventing anything beyond what's written. The raw saved Artifact HTML is a minified JS bundle, not readable prose, so also regex-scan it for Thai/English text runs as a fast inventory pass (something like `[฀-๿][฀-๿0-9A-Za-z .,()%/\-฿:]{1,80}`) before deciding your click-through plan — it surfaces screen labels and copy you'd otherwise have to click through to discover. If the prototype turns out to carry no annotation layer at all — no Design Review panel anywhere — don't just note the gap and stop: tell the user once, then follow `estimation-logic.md`'s "When the prototype has no annotation layer at all" fallback to draft User Stories/Acceptance Criteria from behavior you actually exercised, clearly labeled as drafted rather than literal.

2. **Crawl the design system's real component catalog** before estimating anything in the Components sections — see `estimation-logic.md`. Don't map a single UI element to a component name until you've actually seen it in the real catalog.

3. **Capture screenshots** for every existing screen and every explicitly named state (success/error pairs, etc.) — follow `references/screenshot-capture.md` exactly, including running `extract_screenshots.py` at the end to turn what you saw into real files. Missing/exceptional screens (per `estimation-logic.md`'s Existing-vs-Missing distinction) never get a screenshot — they get the ghost placeholder card the template already defines.

4. **Write the report** by copying `references/report-template.html` and filling every `{{TOKEN}}`. This is a checklist — `estimation-logic.md` has the reasoning behind each line, read it there if anything below is unclear:

   **Structure**
   - Duplicate the worked Epic/Story block once per real epic/story — the count isn't fixed.
   - Every `<details class="story">` stays `open` — a collapsed story reads as an empty section to anyone skimming the published report.
   - No Design Effort or Complexity value anywhere — the template has none, keep it that way (see above).
   - Different design system than default navy-and-blue BBL/CDS? Swap the CSS custom properties in `:root` (both dark-mode blocks too) and the Google Fonts `<link>` — the rest of the CSS reads off those tokens.

   **User Story & Acceptance Criteria** — see estimation-logic.md's "Scope" and "Acceptance Criteria marks mean what they say"
   - The quote is *only* the "As a … I want … so that …" sentence — no rationale or cited evidence inside it. No annotation to quote → the AI-drafted fallback: a `quote-label` tag above the quote, evidence goes in "Why this matters" instead.
   - "Acceptance Criteria" heading stays plain, no parenthetical. Every line is a real testable statement — marks mean what estimation-logic.md says, never a methodology note about how the report was made.

   **Readiness Detail, Components, Functions** — see estimation-logic.md's "Judging and writing Acceptance Criteria, Readiness, Components, and Functions"
   - Readiness Detail and Functions: plain language, no component names or implementation terms (that vocabulary belongs only in Components, below them). Functions sub-headers are "✓ ทำงานได้แล้ว" / "✕ ยังไม่มี".
   - Embed each processed screenshot as `<img src="data:image/jpeg;base64,...">`, plus its larger `zoom/` counterpart (screenshot-capture.md step 5) as that same `<img>`'s `data-zoom` — never the raw capture as `src`.

   **Language & environment** — see estimation-logic.md's "Writing for the report's actual audience" and "Environment gotchas"
   - Never let this skill's internal terms ("annotation layer," "Design Review panel," "Prototype Settings panel," "Design Direction toggle") reach the report's visible text — plain language always, said once in the top summary.
   - Never add a button whose `onclick` calls `window.print()` or attempts a file download — it's silently broken in the Artifact sandbox. The template's `@media print` CSS plus the viewer's own Ctrl+P/Cmd+P is the only thing that works here.

5. **Publish** the finished HTML as a new Artifact (unless the user is explicitly asking you to update a report you already published earlier in this conversation, in which case republish to that same Artifact — see the Artifact tool's own guidance on updating vs. creating). Give it a real title (e.g. "`<Prototype Name>` Estimation"), a one-line description, and a favicon. Before publishing, remember to actually look at the rendered report once — a clipped image, a broken link, a collapsed story, or a token left un-filled is much cheaper to catch here than after the user opens it.

## Not currently part of this skill

Earlier versions of this skill stamped the published report into a team DS Governance Log dashboard and tried to link it to a Context Knowledge feature row. That integration is paused for now (2026-09-05) — the dashboard side needs more time before it's worth wiring back in. The skill stops at step 5 (publish the Artifact) until it's reintroduced. Don't POST/PATCH anything to `ds-governance-dashboard.vercel.app` unless the user explicitly asks for that integration back.

## A known environment gotcha worth knowing up front

The Browser pane can silently go hidden or stop responding mid-session, independent of anything in the report itself — `screenshot-capture.md` covers what to do when it happens. Don't spend time debugging your own generated HTML/CSS when the actual symptom is that scroll and click stopped working entirely; that's very rarely a bug in the artifact.
