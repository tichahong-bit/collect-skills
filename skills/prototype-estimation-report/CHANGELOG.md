# Changelog — prototype-estimation-report

Full version history with the real defect/requester-correction and reasoning behind each rule now
in `SKILL.md` and `references/estimation-logic.md`. Read this file for the "why" — an agent
running the skill does not need it.

---

## v1.1.0 — AI-drafted User Stories when there's no annotation layer at all (2026-09-14, CIB research-archive run)

First real run against a prototype with zero Design Review/Prototype Settings panel: CIB
(cib-bbl.vercel.app), Bangkok Bank's UX-research readout archive — a research documentation site
(search, report cards, Insights/Facts/Conclusions/Synthesis views, a Modes/appearance panel), not
a coded-screens prototype with the usual annotation layer at all. The skill's original rule ("if a
screen has no annotation at all, say so, don't guess") produced a report whose scope came entirely
from live-clicked screens with no User Story quotes to show for it. After seeing the finished
report, the requester asked for the skill to draft User Stories from the prototype directly
instead of stopping at the caveat.

Added a "When the prototype has no annotation layer at all" fallback to `estimation-logic.md`:
tell the user once before drafting anything and get their go-ahead; ground every drafted User
Story/Acceptance Criteria in behavior actually exercised in the session (typed input, clicked
toggle, scrolled list — not a guess at intended behavior); label every drafted block distinctly
from a literal one, in the quote itself, every time; and never let this fallback override a real
annotation layer when one exists. `SKILL.md` step 1 now points here instead of silently stopping
at the caveat.

## v1.2.0 — readability pass on that same CIB report, after the requester actually read it (2026-09-14)

Publishing the CIB report from v1.1.0 surfaced four more problems only visible once a human
actually read the finished page, not while it was being written:

1. **Every story except the first was a collapsed `<details>` by default.** The published report's
   "Story Detail" section looked empty at a glance — User Story, Acceptance Criteria, Components,
   all hidden behind an accordion nobody had a reason to click. `report-template.html`'s
   `<details class="story">` now ships `open` by default; `SKILL.md` step 4 calls this out
   explicitly so it doesn't regress.
2. **The AI-drafted User Story quotes buried the actual story under a paragraph of justification.**
   v1.1.0's rule said "label every drafted block distinctly... in the quote itself," and the first
   real attempt did that by prepending a sentence of cited evidence before the "As a... I want...
   so that..." line — technically labeled, but unreadable as a story. Fixed: the label is now a
   short one-time badge above the quote (`.quote-label`), and the quote itself contains only the
   story sentence. Evidence belongs in that story's "Why this matters," never inside the quote.
3. **Acceptance Criteria lists mixed real product criteria with report-methodology notes**, both
   under the same ✓/✕ marks — a line reading "there's no annotation to check this against" sat
   next to real, testable criteria marked with the same ✕ that elsewhere meant "this actually
   failed." Confusing by design, not by accident: ✕ was being asked to mean two different things.
   Fixed: Acceptance Criteria headings are plain ("Acceptance Criteria", no parenthetical), every
   line is now a real testable statement about the product, and a new △ mark covers "a real
   limitation that matters but wasn't fully verified" — see estimation-logic.md's "Acceptance
   Criteria marks mean what they say."
4. **Screenshots had no way to see them larger, and this team remembered a sibling skill that did.**
   `report-template.html` now ships a click-to-enlarge lightbox; `screenshot-capture.md` step 5
   has the actual reason it needs a *second*, larger processed image rather than just stretching
   the existing 380px thumbnail — a thumbnail enlarged via CSS alone just blows up the same blurry
   pixels.
5. **The report's own visible text used this skill's internal vocabulary** — "annotation layer,"
   "Design Review panel," "Prototype Settings panel," "Design Direction toggle" — meaningless to
   the Product/Compliance/Dev audience the report is actually for. `estimation-logic.md` now has a
   "Writing so a non-technical reader understands it" section: these terms stay in this team's own
   process files, never in the report's own prose. `report-template.html`'s default cover
   subtitle, draft-note, and footer — all of which had baked the old jargon in as literal default
   copy, not just instructions — are fixed too.

Also: when a design-system MCP is available for the system in play (`cds`, `mbds`, `webds`), its
`get_component` call is now the preferred way to resolve a real Figma key + node ID — it returns
both already joined to the correct library file, no search and no risk of a duplicated-file key
mismatch. The generic Figma plugin/connector flow is now the fallback for systems with no such
MCP, not the only path.

## v1.3.0 — Readiness Detail/Functions still read like a spec sheet, and a "download as PDF" button that silently did nothing (2026-09-14, same CIB report)

Two more rounds of feedback on the same report, after v1.2.0's fixes:

1. **Readiness Detail and Functions were still unreadable to a non-technical requester**, even after the User Story and Acceptance Criteria fixes — because both blocks kept re-listing real component names and implementation terms ("Card Container, Tag, Avatar... map to CDS components," "live search-filter with URL state") right next to the Components list, which is the one place that vocabulary belongs. Added "Readiness Detail and Functions are for the same non-technical reader as everything else" to `estimation-logic.md`: Readiness Detail states the same ✓/△/✕ judgment in plain terms ("the cards and buttons all have ready-made pieces to build from") without repeating component names; Functions describes what a person sees happen, banning implementation words outright (regex, prop, re-render, handshake, self-declared, URL state, bare component names). The Functions sub-headers changed from "✓ รองรับแล้ว / ✕ ยังขาด" to "✓ ทำงานได้แล้ว / ✕ ยังไม่มี" — the former reads like a spec-compliance checklist, the latter like what actually happened when someone used it.
2. **Asked for a "download as PDF" button; it silently did nothing when clicked.** Wired a button with `onclick="window.print()"` — looked reasonable, tested broken: no console error, the click just had no effect, while the viewer's own `Ctrl+P`/`Cmd+P` opened the print dialog correctly from the same page. The published Artifact runs inside a sandbox that blocks script-triggered print/download calls; only a real browser-level command bypasses it. Removed the button entirely rather than leave a false affordance in the report. Added "Never wire a script-triggered print or download button" to `estimation-logic.md` and `report-template.html` now ships `@media print` CSS by default (hides the TOC and lightbox, prevents a story/epic from splitting across a page break, forces `print-color-adjust: exact` so status badges keep their color) so a viewer's own keyboard shortcut produces something worth saving, with no button promising a click that can't work.
