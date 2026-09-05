---
name: prototype-estimation-report
description: Turns a coded Claude Artifact prototype into a published design-estimation report Artifact — scope, per-user-story effort/complexity, real component-readiness checked against the team's actual design system, risks, and next steps. Use this whenever someone shares a prototype Artifact link and asks for an estimation report, a design-effort estimate, scope sizing, or "how long will this take to build" — phrases like "ทำ estimation report", "สร้าง design estimation report จาก prototype นี้", "ประเมิน effort จาก prototype", "estimate this prototype", "scope this design", or "how much work is this screen". Also trigger if they ask to update or add more detail (e.g. real screenshots, real component links) to an estimation report already made with this skill. Do NOT use this for estimating a from-scratch feature with no prototype yet, or for a generic project-timeline request unrelated to a Claude Artifact prototype.
---

# Prototype estimation report

Reads a coded prototype's own in-app annotations (not guesswork) and turns them into a structured, presentable estimation report — the kind a design lead can hand to Product/Compliance/Dev to scope a build. The report is itself a published HTML Artifact, styled to match the target design system.

This is a judgment-heavy skill, not a fill-in-the-blanks one. The three reference files below carry the actual know-how; read them before doing the corresponding step, don't try to wing it from memory:

- `references/estimation-logic.md` — how scope, effort, complexity, and component-readiness are actually decided. Read before you write a single Estimate or Components block.
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

1. **Open the prototype, set the Design Direction, and read its own annotations.** Most of this team's prototypes carry a "Design Review" panel (Requirement / UX Rationale / Design System Evaluation, per screen) and a "Prototype Settings" panel (the Design Direction toggle, among others). That annotation content is the scope — read `estimation-logic.md` for exactly how to turn it into Epics and User Stories without inventing anything beyond what's written. The raw saved Artifact HTML is a minified JS bundle, not readable prose, so also regex-scan it for Thai/English text runs as a fast inventory pass (something like `[฀-๿][฀-๿0-9A-Za-z .,()%/\-฿:]{1,80}`) before deciding your click-through plan — it surfaces screen labels and copy you'd otherwise have to click through to discover.

2. **Crawl the design system's real component catalog** before estimating anything in the Components sections — see `estimation-logic.md`. Don't map a single UI element to a component name until you've actually seen it in the real catalog.

3. **Capture screenshots** for every existing screen and every explicitly named state (success/error pairs, etc.) — follow `references/screenshot-capture.md` exactly, including running `extract_screenshots.py` at the end to turn what you saw into real files. Missing/exceptional screens (per `estimation-logic.md`'s Existing-vs-Missing distinction) never get a screenshot — they get the ghost placeholder card the template already defines.

4. **Write the report** by copying `references/report-template.html` and filling every `{{TOKEN}}`:
   - Duplicate the worked Epic/Story example once per real epic/story — the count isn't fixed.
   - Embed each processed screenshot as an inline `data:image/jpeg;base64,...` `<img src>` (read the processed file, base64-encode it, splice it in — a Python one-liner over the file is fine). Never embed the raw/full-resolution capture; see `screenshot-capture.md` for why.
   - Section 05's four category ranges must reconcile with the sum of every per-story range in section 04 (see `estimation-logic.md`) — check the arithmetic before publishing, don't let §01, §04, and §05 quietly disagree on the total.
   - If this design system uses different brand colors/type than the default navy-and-blue BBL/CDS palette baked into the template, swap the CSS custom properties in `:root` (and the two dark-mode blocks) and the Google Fonts `<link>` — the rest of the CSS reads entirely off those tokens.

5. **Publish** the finished HTML as a new Artifact (unless the user is explicitly asking you to update a report you already published earlier in this conversation, in which case republish to that same Artifact — see the Artifact tool's own guidance on updating vs. creating). Give it a real title (e.g. "`<Prototype Name>` Estimation"), a one-line description, and a favicon. Before publishing, remember to actually look at the rendered report once — a clipped image, a broken link, or a token left un-filled is much cheaper to catch here than after the user opens it.

## A known environment gotcha worth knowing up front

The Browser pane can silently go hidden or stop responding mid-session, independent of anything in the report itself — `screenshot-capture.md` covers what to do when it happens. Don't spend time debugging your own generated HTML/CSS when the actual symptom is that scroll and click stopped working entirely; that's very rarely a bug in the artifact.
