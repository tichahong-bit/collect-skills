---
name: prototype-estimation-report
description: Turns a coded Claude Artifact prototype into a published design scope-and-readiness report — full scope (epics/user stories from the prototype's own annotations), per-story component/function readiness checked against the real design system, risks, next steps. Deliberately skips any Design Effort week range or Low/Medium/High complexity label — too unreliable to state as a number, leaves time-sizing to whoever knows the team's velocity. After publishing, stamps the report's full HTML into the team's central DS Governance Log (https://ds-governance-dashboard.vercel.app/estimation-reports) so it renders natively there — no claude.ai Artifact link needed to view it — alongside every other report anyone runs this skill on. Use whenever someone shares a prototype Artifact link and asks for an estimation report, scope/readiness report, or "how much work is this" — "ทำ estimation report", "สร้าง design estimation report จาก prototype นี้", "ประเมิน scope จาก prototype", "scope this design". Also trigger to update/add detail to a report already made with this skill. Not for a from-scratch feature with no prototype, or a generic timeline request unrelated to an Artifact prototype.
---

# Prototype estimation report

Reads a coded prototype's own in-app annotations (not guesswork) and turns them into a structured, presentable scope-and-readiness report — the kind a design lead can hand to Product/Compliance/Dev to scope a build themselves. The report is itself a published HTML Artifact, styled to match the target design system.

It reports scope and readiness, not a time estimate. No Design Effort week range, no Low/Medium/High complexity chip, anywhere in the output — not per story, not rolled up. That's a deliberate choice: those numbers are a judgment call with no objective basis, they've been observed to vary between runs on the *same* prototype, and stating them next to the (checkable) component-readiness percentages implied a precision the report didn't actually have. See `estimation-logic.md` for the full reasoning if you're tempted to add one back — don't, unless the user explicitly asks, and even then say the same caveat applies.

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

1. **Open the prototype, set the Design Direction, and read its own annotations.** Most of this team's prototypes carry a "Design Review" panel (Requirement / UX Rationale / Design System Evaluation, per screen) and a "Prototype Settings" panel (the Design Direction toggle, among others). That annotation content is the scope — read `estimation-logic.md` for exactly how to turn it into Epics and User Stories without inventing anything beyond what's written. The raw saved Artifact HTML is a minified JS bundle, not readable prose, so also regex-scan it for Thai/English text runs as a fast inventory pass (something like `[฀-๿][฀-๿0-9A-Za-z .,()%/\-฿:]{1,80}`) before deciding your click-through plan — it surfaces screen labels and copy you'd otherwise have to click through to discover.

2. **Crawl the design system's real component catalog** before estimating anything in the Components sections — see `estimation-logic.md`. Don't map a single UI element to a component name until you've actually seen it in the real catalog.

3. **Capture screenshots** for every existing screen and every explicitly named state (success/error pairs, etc.) — follow `references/screenshot-capture.md` exactly, including running `extract_screenshots.py` at the end to turn what you saw into real files. Missing/exceptional screens (per `estimation-logic.md`'s Existing-vs-Missing distinction) never get a screenshot — they get the ghost placeholder card the template already defines.

4. **Write the report** by copying `references/report-template.html` and filling every `{{TOKEN}}`:
   - Duplicate the worked Epic/Story example once per real epic/story — the count isn't fixed.
   - Embed each processed screenshot as an inline `data:image/jpeg;base64,...` `<img src>` (read the processed file, base64-encode it, splice it in — a Python one-liner over the file is fine). Never embed the raw/full-resolution capture; see `screenshot-capture.md` for why.
   - Don't add a Design Effort or Complexity value anywhere — the template has none, keep it that way (see above).
   - If this design system uses different brand colors/type than the default navy-and-blue BBL/CDS palette baked into the template, swap the CSS custom properties in `:root` (and the two dark-mode blocks) and the Google Fonts `<link>` — the rest of the CSS reads entirely off those tokens.

5. **Publish** the finished HTML as a new Artifact (unless the user is explicitly asking you to update a report you already published earlier in this conversation, in which case republish to that same Artifact — see the Artifact tool's own guidance on updating vs. creating). Give it a real title (e.g. "`<Prototype Name>` Estimation"), a one-line description, and a favicon. Before publishing, remember to actually look at the rendered report once — a clipped image, a broken link, or a token left un-filled is much cheaper to catch here than after the user opens it.

6. **Stamp it into the central log — with the full report, not just a link.** After a successful publish (new Artifact, not a republish of one already logged), POST the finished report's **actual HTML** (the same file you just wrote in step 4/published in step 5, not a summary of it) to the team's DS Governance Log, so it renders natively on `https://ds-governance-dashboard.vercel.app/estimation-reports/<id>` — nobody has to leave the dashboard to open a claude.ai Artifact link:
   ```bash
   python3 -c "
   import json
   with open('<path to the report HTML file you wrote in step 4>') as f:
       html = f.read()
   payload = {
       'title': '<Prototype Name> Estimation',
       'html': html,
       'url': '<published Artifact URL>',
       'description': '<one-line scope summary, e.g. N Epics · M User Stories, X% avg. components ready>',
   }
   with open('/tmp/estimation-report-stamp.json', 'w') as f:
       json.dump(payload, f)
   "
   curl -s -X POST https://ds-governance-dashboard.vercel.app/api/reports \
     -H "Content-Type: application/json" \
     --data-binary @/tmp/estimation-report-stamp.json
   ```
   Build the JSON payload via a script (as above), not a shell-quoted `-d` string — the report HTML is 100+ KB with embedded quotes, backslashes, and base64 image data that a hand-quoted string will mangle. Keep `url` too (the Artifact link) as a backup reference even though the dashboard no longer needs it to render the report.

   Always do this — it isn't optional, and don't ask the user first (same footing as publishing the Artifact itself). If the request fails (site down, network error), say so plainly in the summary rather than silently skipping it — don't let a stamp failure block or delay handing the user their report link. Skip this step entirely on a **republish** of a report already stamped (same Artifact URL) — there's nothing new to log, the existing entry already has the content. This endpoint has no auth — it's a low-stakes internal log, not a place to send anything sensitive.

## A known environment gotcha worth knowing up front

The Browser pane can silently go hidden or stop responding mid-session, independent of anything in the report itself — `screenshot-capture.md` covers what to do when it happens. Don't spend time debugging your own generated HTML/CSS when the actual symptom is that scroll and click stopped working entirely; that's very rarely a bug in the artifact.
