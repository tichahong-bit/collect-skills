---
name: asana-research-log
description: >
  Log a UX research report into Asana Knowledge as two linked pages: one
  row on the Research index, and a full report page whose section
  structure adapts to the kind of research it is — not a fixed template,
  since research varies a lot (contextual interview, usability test,
  survey, analytics review, concept review, ...). Trigger:
  /asana-research-log, "log this research to asana", "log research
  report", "add research to asana".
---

# Asana Research Log

## Purpose

A UX researcher finishes a study and wants the full report captured in
Asana Knowledge — not just a summary buried in a doc elsewhere. Two pages,
linked:

1. **Index page** (one page, shared by everyone doing research) — one row
   per study: title, research type, one-line summary, date, who ran it,
   and a link to the full report.
2. **Report page** (one per study) — the actual findings. Section
   structure is **not fixed** — pick the shape that fits this study's
   content (see "Adaptive structure" below), don't force every report
   into the same mold.

There's no version/changelog tier here unlike `asana-skill-changelog` — a
research report doesn't get "versions" the way a skill does. If a study
gets a genuine follow-up round later, that's a new report page linking
back to the earlier one, not an edit-in-place.

## Index page

Right now that's `"Research "` (gid `1217101228810755`,
https://app.asana.com/1/1153565613997788/note/1217101228810755). Confirm
with `page_get` it's still the right page before writing — pages get
renamed (this has already happened to the skills registry page in this
same workspace).

Each study gets one row/block, appended (never remove or edit another
report's row):

```html
🔹 <a href="<report_permalink>"><report_title></a>

<ul>
<li>Type: <research_type></li>
<li>Summary: <one-line takeaway></li>
<li>Date: <date></li>
<li>Who: <author></li>
</ul>
```

Read the index's `html_text` first, append the new block, `page_update`
with the full merged body.

## Adaptive structure — the report page

Don't reuse one rigid section list for every study. Look at what the
researcher actually gives you and shape sections around it. As a
reference point (not a mandate), a contextual-interview-style study might
use: Research context → Participants → Key observations → Insight →
Design implication. A survey might use: Method + sample size → Results
by question → Statistically notable findings → Recommendation. An
analytics review might use: Data source + date range → Metrics observed
→ Interpretation → Recommendation. Pick what actually fits; invent new
section names freely if the study calls for it.

Common backbone worth keeping across most reports even so: a short
**breadcrumb** at the top (see template), and a closing **recommendation
/ implication** section near the end so a reader who skims to the bottom
still gets the "so what."

## Mock / placeholder data — flag it, always

If the researcher is drafting a mock, hypothetical, or placeholder study
(demo data, not a real fielded study), **say so visibly at the very top
of the report page**, e.g. `<strong>⚠ Mock research — not a real fielded
study</strong>`. Never let a mocked report read as if it were real
findings — this has already burned trust once in this workspace (see the
"🔎 Mock Research — E-Statement Request History Card" page,
https://app.asana.com/1/1153565613997788/note/1217598652870645, which
flags itself this way). Same rule for any individual fabricated data
point inside an otherwise-real report — flag the specific row/quote, not
just the page.

## Required inputs

Ask for whichever of these you don't already have from the conversation —
never invent research findings, quotes, or participant details:

- `report_title` — short, specific (e.g. "E-Statement Request History
  Card — Contextual Interview")
- `research_type` — contextual interview, usability test, survey,
  concept review, analytics review, etc.
- the actual content — findings, quotes, data. If the researcher pastes
  raw notes, organize them into the adaptive structure above rather than
  asking them to pre-format everything themselves.
- whether this is real fielded research or a mock/placeholder (see
  above) — ask if it's not obvious.
- `author` (optional) — defaults to the caller of `asana_whoami`
- `date` (optional) — defaults to today

## Process

1. **Resolve workspace_gid** if not already known this session
   (`asana_whoami` or `asana_find`).
2. **Confirm the index page** is still `"Research "` (gid
   `1217101228810755`) via `page_get` — don't assume the gid is current
   without checking, page names/gids can change.
3. **Build the report page** using the adaptive structure above, with the
   mock-data warning at the top if applicable. `page_create` it.
4. `page_get` the new page once to get its `permalink_url` (`page_create`
   doesn't return it).
5. **Append a row to the Index page** (read-then-merge, never overwrite
   existing rows) linking to the new report.
6. **Report back both links** to the user.

## Templates

### Report page — top of body (always)

```html
<body>
<strong>Breadcrumb:</strong>

<a href="<index_permalink>">Research</a> / <strong><report_title></strong>

<em>⚠ Mock research — not a real fielded study</em>  <!-- only if applicable, omit entirely for real studies -->

<hr>

<!-- adaptive sections follow — see "Adaptive structure" above -->
</body>
```

## Boundaries

- Never fabricate findings, quotes, participant counts, or data points —
  ask the researcher for the real content, or flag clearly as mock if
  they're intentionally drafting placeholder data.
- Never force every report into the same section template — shape it to
  the study.
- Never edit or remove another study's row on the Index page.
- If the index page's gid/name looks wrong when you `page_get` it, stop
  and ask the user rather than guessing which page is now the index.
