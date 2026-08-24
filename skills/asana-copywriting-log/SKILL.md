---
name: asana-copywriting-log
description: >
  Log a copywriting/UX-writing knowledge source (a house style guide, a
  tone-of-voice quick guide, a grammar/component-writing reference, or
  any other copy guideline material) into Asana Knowledge as two linked
  pages: one row on the Copy Writing Guideline index, and a full source
  page whose section structure adapts to what kind of source it is — a
  formal style guide's grammar/component rules differ completely from a
  short tone-of-voice quick guide. Trigger: /asana-copywriting-log, "log
  this copywriting guideline to asana", "log copy writing source", "add
  copywriting reference to asana".
---

# Asana Copywriting Log

## Purpose

Bangkok Bank's copy/UX-writing guidance isn't in one single document —
there's a formal house style guide (currently "MB Writing Style Guide"),
plus lighter tactical guides for specific surfaces (e.g. a tone-of-voice
quick guide for a particular feature), and potentially more over time.
This skill captures each source as its own page in Asana Knowledge,
indexed centrally, mirroring `asana-branding-log`'s pattern for the
sibling Branding Guideline index:

1. **Index page** (one page, shared by everyone writing copy) — one row
   per source: title, source type, one-line summary, date, who it came
   from, and a link to the full source page.
2. **Source page** (one per source) — the actual extracted content.
   Section structure is **not fixed** — pick the shape that fits this
   source (see "Adaptive structure" below).

Like `asana-branding-log`, there's no version/changelog tier here — a
source doesn't get "versions" the way a skill does. A living style guide
(one that gets revised in place, e.g. "V2" superseding "V1" as the same
ongoing document) gets its source page updated/replaced when a new
version lands; a narrower, surface-specific quick guide is point-in-time
and gets a new page instead, with a cross-reference note.

## Index page

Right now that's `"Copy Writing Guideline"` (gid `1217629510106643`,
https://app.asana.com/1/1153565613997788/note/1217629510106643). Confirm
with `page_get` it's still the right page before writing — pages get
renamed/restructured over time (this one started as a mock/placeholder
page and gets replaced the first time a real source is logged).

It's a real Asana `<table>`, one row per source: title (linked to the
source page), type, one-line summary, date, who/logged by.

**Why a companion file, not `page_get`.** `page_update` replaces the
whole body, so appending normally means "read, then merge, then write."
But `page_get` can never return a table's actual cell content (only a
placeholder line) — so once the index is a table, there is no way to
recover other sources' rows from Asana itself. `copywriting-index-state.json`,
checked into this skill's own folder in the repo, is the **real source of
truth** for every row on the index — never trust what's currently
rendered on the Asana page as the input to a merge.

**⚠ One-time reconciliation needed.** The live index page was converted
to a table before this companion file existed, so its current rows are
not yet captured anywhere machine-readable — `copywriting-index-state.json`
starts empty. **Do not `page_update` the index page until a human has
opened it in a browser and transcribed its current rows into the JSON
file first** — writing from an empty/incomplete file would silently erase
whatever's already there, with no way to recover it afterward. At least
two sources are known to already exist as their own pages and likely
correspond to existing rows: "MB Writing Style Guide V2" (gid
`1217637687658864`) and "Quick Guide to UX Writing for Trip Space" (gid
`1217636635097373`) — their exact row text (summary/date/who as originally
logged) still needs to come from the live table, not be reconstructed by
guessing.

Every run, in order:
1. Fetch the current `copywriting-index-state.json` from GitHub raw (same
   pattern as syncing this file) — not the local copy, which can be stale
   if someone else logged a source since you last synced.
2. If the file has fewer rows than you can see on the live page (check
   visually — `page_get` won't show them), **stop and ask the user** to
   reconcile before continuing; don't append on top of an incomplete file.
3. Append this run's row to the fetched JSON (never remove/edit another
   source's row).
4. Render the table fresh from **every** row now in the JSON and
   `page_update` the index page with the full table.
5. Commit and push the updated JSON back to `main` — skipping this means
   the next run starts from a stale file and silently drops rows added in
   between.

## Source types (pick what fits, invent more if needed)

- **House style guide** — the current, living, comprehensive reference
  (e.g. "MB Writing Style Guide") covering grammar protocol, tone of
  voice, component-level writing patterns, common screens. Usually the
  one other skills should treat as the primary/broadest source of truth.
- **Tone-of-voice / quick guide** — shorter, tactical guidance for a
  specific surface or feature (e.g. a UX-writing quick guide for one
  product area). Useful and often more actionable for a narrow case, but
  narrower in scope than the house style guide — see "Cross-referencing"
  below.
- **Word list / do-and-don't reference** — a focused terminology or
  approved-phrasing list without broader voice/grammar content.
- **Other reference** — anything else (a localization note, a
  compliance-driven copy ruling, meeting notes on a copy decision).

## Adaptive structure — the source page

Don't reuse one rigid section list for every source. Shape sections
around what the source actually contains:

- **A house style guide (Word doc, Notion doc, etc.):** mirror the
  source's own part/chapter structure if it has one (e.g. "Part 1:
  Introduction & Grammar protocol", "Part 2: Tone of voice", "Part 3:
  Common screens") — one section per part, bullet the concrete rules.
  If the source is under active construction (e.g. a comment says "TBC
  for V.3: Part 3, Part 4"), say so rather than presenting it as
  finished/complete.
- **A tone-of-voice / quick guide:** Objective/context → the
  voice-attribute framework itself (e.g. named tone attributes and what
  each means in practice) → do/don't examples table → cautions/pitfalls.
- **A word list:** Context (what surface/product it governs) → the
  actual do/don't or approved-term pairs, grouped logically (e.g. by UI
  area) rather than dumped as one flat list if the source itself groups
  them.

Common backbone worth keeping across most source pages even so: a short
**breadcrumb** at the top (see template).

## Extraction discipline — never guess copy rules

- Pull actual text from the source before writing anything. For a
  `.docx`, extract real paragraph/table text (e.g. by reading
  `word/document.xml` inside the zip) rather than inferring content from
  the filename or headings alone. For an Asana task/subtask structure
  standing in for a doc, check task `notes`, comments, and attachments on
  every subtask — don't assume the content lives where you expect it; if
  you can't find the actual content after a reasonable search, stop and
  ask the user where it actually lives rather than fabricating rules
  from the task titles.
- If part of a source has no extractable content (empty task notes, a
  locked/inaccessible doc, missing attachment), **say so explicitly**
  rather than describing what you imagine it contains.
- Never invent example copy, do/don't pairs, tone attributes, or grammar
  rules. If a rule isn't in the extracted text, don't add a
  plausible-looking one.
- Preserve bilingual content as-is (many BBL copy sources mix Thai and
  English do/don't examples) — don't translate or paraphrase example
  copy, since the exact wording is the point.

## Cross-referencing between sources

When logging a narrower/tactical source (e.g. a feature-specific
tone-of-voice quick guide) alongside a broader house style guide already
on the index:

- Add a closing note on the narrower page linking to the broader style
  guide and naming how the two relate (e.g. "this quick guide is a
  practical companion to MB Writing Style Guide's tone-of-voice section,
  scoped to Trip Space specifically").
- Do not edit the broader page to point back — it doesn't need to know
  about every narrower guide that references it.

## Required inputs

Ask for whichever of these you don't already have from the conversation —
never invent source content:

- `source_title` — short, specific (e.g. "Quick Guide to UX Writing for
  Trip Space")
- `source_type` — house style guide, tone-of-voice/quick guide, word
  list, other reference (see above)
- the actual source — a file path, Asana task/page link, or pasted
  notes. If given a file or a task tree, extract its real content
  yourself rather than asking the user to pre-summarize it.
- `source_date` — the date the source itself is from (doc's own date,
  task creation/completion date) — distinct from today's log date.
- `author` (optional) — team/person the source came from; defaults to
  the caller of `asana_whoami` if it's genuinely self-authored.

## Process

1. **Resolve workspace_gid** if not already known this session
   (`asana_whoami` or `asana_find`).
2. **Confirm the index page** is still `"Copy Writing Guideline"` (gid
   `1217629510106643`) via `page_get` — don't assume the gid is current
   without checking, page names/gids can change.
3. **Extract the source's real content** (see "Extraction discipline").
   If the source can't be located or read, stop and ask the user rather
   than guessing.
4. **Build the source page** using the adaptive structure above, with a
   cross-reference note if a narrower source is being logged after a
   broader one already exists. `page_create` it.
5. `page_get` the new page once to get its `permalink_url` (`page_create`
   doesn't return it).
6. **Append a row to the Index table** via `copywriting-index-state.json`
   as described above — fetch, append this row, render the full table
   from every row, `page_update`, then commit+push the JSON.
7. **Report back both links** to the user.

## Language & formatting

Narrative content on the source page (breadcrumb, adaptive sections'
framing text, index row's summary) is written in **Thai**, concise, easy
to read — break long text into bullets rather than a wall of text.
Exceptions (stay in original language): extracted source content itself
(bilingual Thai/English copy examples, preserved verbatim per Extraction
discipline), proper nouns/technical terms, and any code/CLI snippets.

## Templates

### Source page — top of body (always)

```html
<body>
<strong>Breadcrumb:</strong>

<a href="<index_permalink>">Copy Writing Guideline</a> / <strong><source_title></strong>

<em>Source: <where this came from — file name, Asana task link, doc link>. Logged <date> by <logger>.</em>

<hr>

<!-- adaptive sections follow — see "Adaptive structure" above -->
</body>
```

### Index table row

```html
<tr><td><a href="<source_permalink>"><source_title></a></td><td><source_type></td><td><one-line summary></td><td><date the source itself is from></td><td><author/team> · logged by <logger></td></tr>
```

Header row (bold cells, no `thead`/`th` support):

```html
<tr><td><strong>Source</strong></td><td><strong>Type</strong></td><td><strong>Summary</strong></td><td><strong>Date</strong></td><td><strong>Who</strong></td></tr>
```

## Boundaries

- Never fabricate example copy, tone attributes, grammar rules, or
  do/don't pairs — extract real content from the source, or explicitly
  flag a section as not-extractable rather than guessing.
- Never force every source into the same section template — shape it to
  what the source actually is (house style guide vs. quick guide vs.
  word list).
- Never edit or remove another source's row on the Index page.
- Never `page_update` the Index page from a `copywriting-index-state.json`
  you haven't just freshly fetched from GitHub this run, and never skip
  pushing the updated JSON back afterward.
- Never write to the Index table while the companion JSON is known to be
  missing rows the live page actually has — reconcile first (see Index
  page section above).
- Never silently let a narrower/tactical guide read as the full house
  style — add the cross-reference note when relevant.
- If the index page's gid/name looks wrong when you `page_get` it, stop
  and ask the user rather than guessing which page is now the index.
