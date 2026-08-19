---
name: asana-branding-log
description: >
  Log a brand-identity knowledge source (a master guideline file, a vendor
  workshop deck, meeting notes, or any other branding reference) into
  Asana Knowledge as two linked pages: one row on the Branding Guideline
  index, and a full source page whose section structure adapts to what
  kind of source it is — a design file's chapters differ completely from
  a workshop deck's roadmap/status content, don't force one template.
  Trigger: /asana-branding-log, "log this branding guideline to asana",
  "log branding source", "add branding reference to asana".
---

# Asana Branding Log

## Purpose

Bangkok Bank's brand identity isn't captured in one single place — there's
an evolving master guideline (currently a Figma file), plus vendor
workshop decks, meeting notes, and other reference material collected
over time. This skill captures each source as its own page in Asana
Knowledge, indexed centrally, instead of letting it live only in a Figma
link or a PDF in someone's Downloads folder:

1. **Index page** (one page, shared by everyone working on brand
   identity) — one row per source: title, source type, one-line summary,
   date, who/where it came from, and a link to the full source page.
2. **Source page** (one per source) — the actual extracted content.
   Section structure is **not fixed** — pick the shape that fits this
   source (see "Adaptive structure" below).

Unlike `asana-skill-changelog`, there's no version/changelog tier — a
source doesn't get "versions" the way a skill does. If a source is
re-exported or updated later (e.g. the Figma file gets a new chapter),
that's either an edit to the same source page (design files, since
they're a living reference) or a new page entirely (workshop decks,
meeting notes — those are point-in-time and shouldn't be silently
rewritten). Use judgment: a living reference file gets updated in place;
a dated document gets a new page and a cross-reference note.

## Index page

Right now that's `"Branding Guideline"` (gid `1217632285949369`,
https://app.asana.com/1/1153565613997788/note/1217632285949369). Confirm
with `page_get` it's still the right page before writing — pages get
renamed (this one was renamed from "Bradning Guidline" already).

Each source gets one row/block, appended (never remove or edit another
source's row):

```html
🔹 <a href="<source_permalink>"><source_title></a>

<ul>
<li>Type: <source_type></li>
<li>Summary: <one-line takeaway></li>
<li>Date: <date the source itself is from, not today></li>
<li>Who: <author/vendor/team> · logged by <logger></li>
</ul>
```

Read the index's `html_text` first, append the new block, `page_update`
with the full merged body.

## Source types (pick what fits, invent more if needed)

- **Master guideline** — the current, living design-system-style
  reference (e.g. a Figma brand guideline file). Usually the one other
  skills (like `ds-governance-prototype-asana`) should treat as ground
  truth.
- **Vendor workshop / agency deck** — process decks from an external
  design/branding agency (roadmaps, delivery status, work-in-progress
  design ambition). Historical/process context, not necessarily current
  spec — see "Cross-referencing" below.
- **Meeting notes** — internal or vendor-facing meeting notes touching
  brand decisions.
- **Other reference** — anything else (a style test, a one-off brand
  ruling, a legal/compliance note on brand usage).

## Adaptive structure — the source page

Don't reuse one rigid section list for every source. Shape sections
around what the source actually contains:

- **A design file (Figma, etc.):** mirror the file's own table of
  contents/index if it has one — one section per chapter, bullet the key
  rules per chapter (don't try to enumerate every token if the file has
  hundreds — e.g. full color/type scales — summarize the pattern and
  point back to the file for exact values).
- **A workshop/agency deck:** Context (who/why/when) → status-by-area
  (what's done, in progress, under development) → timeline/roadmap →
  open items. A closing "Reading this against the current guideline"
  section is valuable when the deck is older than the current master
  guideline — call out what's since been superseded, don't leave the
  reader to guess.
- **Meeting notes:** Context → decisions made → open questions → who
  owns follow-up.

Common backbone worth keeping across most source pages even so: a short
**breadcrumb** at the top (see template).

## Extraction discipline — never guess brand content

- Pull actual text from the source before writing anything: for a Figma
  file, use `get_metadata` (text-layer names are usually the literal
  copy) rather than paying for full `get_design_context` code-gen on
  every section — much cheaper for a read-only content summary. For a
  PDF, extract real text (e.g. via a PDF text-extraction library) rather
  than inferring content from slide titles alone.
- If part of a source has no extractable text (e.g. image-only slides,
  scanned pages), **say so explicitly** in that section rather than
  describing what you imagine the image shows. Point the reader back to
  the original file for those parts.
- Never fabricate colors, measurements, rules, or copy. If a value isn't
  in the extracted text, don't invent a plausible-looking one.

## Cross-referencing between sources

Brand-identity sources can go stale relative to each other (a 2023
workshop deck vs. a 2026 Figma file). When logging a source that's
clearly older or narrower than an existing one on the index:

- Add a closing note on the new (older/narrower) page linking to the
  newer/broader source and naming what's since changed or been
  finalized, so a reader doesn't mistake outdated content for current
  spec.
- Do not edit the newer page to point back — the newer page doesn't need
  to know about every older source that references it.

## Required inputs

Ask for whichever of these you don't already have from the conversation —
never invent source content:

- `source_title` — short, specific (e.g. "🚧BETA — Master Brand Guideline
  Reference (Figma)")
- `source_type` — master guideline, vendor workshop/agency deck, meeting
  notes, other reference (see above)
- the actual source — a Figma link/file, a PDF/doc path, or pasted notes.
  If given a file, extract its real content yourself rather than asking
  the user to pre-summarize it.
- `source_date` — the date the source itself is from (file's own date,
  deck's cover date, meeting date) — distinct from today's log date.
- `author` (optional) — vendor/team/person the source came from; defaults
  to the caller of `asana_whoami` if it's genuinely self-authored.

## Process

1. **Resolve workspace_gid** if not already known this session
   (`asana_whoami` or `asana_find`).
2. **Confirm the index page** is still `"Branding Guideline"` (gid
   `1217632285949369`) via `page_get` — don't assume the gid is current
   without checking, page names/gids can change.
3. **Extract the source's real content** (see "Extraction discipline").
4. **Build the source page** using the adaptive structure above, with a
   cross-reference note if an older/narrower source is being logged
   after a newer/broader one already exists. `page_create` it.
5. `page_get` the new page once to get its `permalink_url` (`page_create`
   doesn't return it).
6. **Append a row to the Index page** (read-then-merge, never overwrite
   existing rows) linking to the new source.
7. **Report back both links** to the user.

## Templates

### Source page — top of body (always)

```html
<body>
<strong>Breadcrumb:</strong>

<a href="<index_permalink>">Branding Guideline</a> / <strong><source_title></strong>

<em>Source: <where this came from — file name, Figma link, meeting>. Logged <date> by <logger>.</em>

<hr>

<!-- adaptive sections follow — see "Adaptive structure" above -->
</body>
```

## Boundaries

- Never fabricate colors, measurements, copy, or rules — extract real
  content from the source, or explicitly flag a section as
  not-extractable rather than guessing.
- Never force every source into the same section template — shape it to
  what the source actually is (design file vs. workshop deck vs. notes).
- Never edit or remove another source's row on the Index page.
- Never silently let an outdated source read as current spec — add the
  cross-reference note when relevant.
- If the index page's gid/name looks wrong when you `page_get` it, stop
  and ask the user rather than guessing which page is now the index.
