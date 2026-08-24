---
name: asana-skill-changelog
description: >
  Log a skill's version update into Asana Knowledge as a 3-page structure:
  one row on the central skills registry, a per-skill "how to use +
  changelog list" page, and a per-version detail page. Any team member can
  reuse this on their own skill — not tied to one specific skill or
  project. Trigger: /asana-skill-changelog, "log this skill update to
  asana", "log changelog", "add version log", "skill version history in
  asana", "add my skill to the registry".
---

# Asana Skill Changelog

## Purpose

Team members build their own Claude Code skills (audit, prototype, PR-sync,
etc.), try them, and once one works they want it discoverable and its
history tracked in Asana Knowledge — not buried in git commits. Three
pages per skill family, linked in a chain:

1. **Page 1 — central registry** (one page, shared by everyone). One row
   per skill: name, what it does, what it outputs, latest version, when it
   was last updated, and a link to that skill's Page 2.
2. **Page 2 — per-skill page** (one per skill). Top half: "How to use" —
   the trigger and a copy-pasteable example prompt, written so a first-time
   user fills in the least possible. Below an `<hr>` divider: the
   changelog list for that skill, one line per version, each linking to
   that version's Page 3.
3. **Page 3 — per-version detail** (one per version). What changed and
   why. This part was already right — keep doing it the way it's been
   done (see template below).

Asana Knowledge pages do not support real nested sub-pages via the API.
`<table>` HTML *is* accepted by `page_create`/`page_update` (along with
strong, em, u, s, ul, ol, li, a, blockquote, code, pre, hr, img, h1, h2 —
`<p>` is still rejected) — but `page_get` can **never** read a table's
content back, only a placeholder line. That blind spot is fine for Page 3
(written once, never revisited) but dangerous for anything upserted across
runs: a table on Page 1 is used as the real registry format (see below,
with a companion state file to make the upsert safe); the Change log on
Page 2 stays a plain `<ul>` on purpose, since prepending it each version
still needs to read the previous entries back, which a table can't give
us. This skill reproduces the "click a row → see detail" feel with linked
lists and separate flat pages except where noted otherwise.

## Language & formatting

All narrative content written into Page 1/2/3 (what it does, output, log
detail, why, example scenarios, breadcrumbs) is written in **Thai** —
concise, easy to read. If a piece of narrative text would run long, break
it into bullets (`<ul>`/`<li>`) instead of a wall of text.

Exceptions (stay in their original language, usually English):
- Prompt examples (the copy-pasteable "Use the X skill..." blocks)
- The Markdown detail snapshot (the skill's own `SKILL.md`/file content,
  verbatim)
- Code/CLI snippets (install commands, etc.)
- Proper nouns, technical terms, and product/API names

On Page 2, every prompt example must be wrapped in a `<pre>`/`<code>`
block (already the template below) — never left as plain paragraph text.

## Central registry page (Page 1)

Right now that's gid `1217561826992798`
(https://app.asana.com/1/1153565613997788/note/1217561826992798) — its
name has been renamed before ("Design system Governance " →
"Operation Skills") and may be renamed again, so **always `page_get` it
and use its live `name` field** for breadcrumb text — never hardcode a
title string in a page you write. Under a `"🆕 Skill changelogs"` heading
it holds one real `<table>` with one row per skill: name (linked to its
Page 2), what it does, output, latest version + updated date, and who
triggered that log.

**Scope boundary — this skill owns only the top of the page.** Below the
registry table, the page also carries a `"Design Agent Skills — ขั้นตอน
PO requirement → wireframe → UI hi-fi"` section and everything under it —
that belongs to a *different* pipeline (the wireframe/UI Design Agent
Skills, not skill-changelog logging) and is completely out of scope.
Never read it for context, never rewrite it, never move or reorder it.
When you `page_get` the page to merge, treat that section and everything
after it as an opaque tail: carry it through byte-for-byte, unchanged, at
the end of whatever `html_text` you `page_update` with. Only the content
above it (`🔧 Asana-backed Skills` / `🆕 Skill changelogs`) is this
skill's to manage.

**Why a companion file, not `page_get`.** `page_update` replaces the whole
body, so an upsert normally means "read, then merge, then write." But
`page_get` can never return a table's actual cell content — so once Page 1
is a table, Claude has no way to recover other skills' rows from Asana
itself. The fix: `registry-state.json`, checked into this skill's own
folder in the `collect-skills` repo, is the **real source of truth** for
every row on Page 1 — never trust what's currently rendered on the Asana
page as the input to a merge.

Every run, in order:
1. Fetch the current `registry-state.json` from GitHub raw (same pattern
   as syncing `SKILL.md` in step 0) — not the local copy, which can be
   stale if someone else logged a skill since you last synced.
2. Upsert this run's row into the fetched JSON (match on `skill_name`;
   replace in place if found, append if not).
3. Render the table fresh from **every** row now in the JSON (not just
   this one) and `page_update` Page 1 with the full table.
4. Commit and push the updated `registry-state.json` back to `main`. This
   step is not optional cleanup — skipping it means the next run (a
   different session, maybe a different person) starts from a stale file
   and will silently drop every row added in between.

If you can't push to the repo (no access, offline, push rejected), **stop
before writing Page 1** and tell the user — do not `page_update` a table
built from a JSON copy you know might be stale, since that risks
overwriting other skills' rows with no way to recover them afterward.

If a different page should be the central registry, ask the user which —
don't assume the hardcoded gid above is still current; confirm with
`page_get` that it still exists and still looks like the registry before
writing to it.

## Required inputs

**The user should only have to type the skill name.** Everything else —
version, summary, detail, and (first time only) what it does/output/
trigger/example prompt — Claude checks for itself where possible and
otherwise asks as follow-up questions in the conversation, not as fields
the user must pre-fill into one prompt. Never guess a version number,
date, or change description; asking a quick follow-up question beats
inventing one.

- `skill_name` — the only thing the user must supply upfront. e.g.
  `ds-governance-audit-notion`
- `workspace` — don't ask if already known this session (resolve name →
  gid with `asana_find`, or reuse a gid already established this
  conversation)

Then, before writing anything:

1. Check whether this skill already has a real `SKILL.md`/similar file
   the user can point you to, or whether they already told you what
   changed earlier in the conversation — pull `version`, `short_summary`,
   `detail` from there first. Only ask the user directly for whatever you
   still can't determine.
2. `page_list` to check if Page 2 already exists for this skill.
   - Exists → you still need `version`, `short_summary`, `detail` for the
     new entry — ask if not already known.
   - Doesn't exist (first log) → also need `what_it_does`, `output`,
     `trigger`, `example_prompt` (a realistic, minimal-input prompt for
     actually *running* the skill being logged — specific to their skill,
     don't invent it) — ask for whichever of these you can't infer.
3. `author` defaults to the caller of `asana_whoami`; `date` defaults to
   today — don't ask for these unless the user wants to override them.

## Process

0. **Sync from GitHub first, every run.** Before anything else, fetch this
   skill's own latest source straight from GitHub
   (`WebFetch https://raw.githubusercontent.com/tichahong-bit/collect-skills/main/skills/asana-skill-changelog/SKILL.md`)
   and follow *that* content as authoritative for the rest of this run —
   the local copy at `~/.claude/skills/asana-skill-changelog/SKILL.md` can
   be behind if nobody's re-run the Install/Update command recently.
   Also refresh the local file so next time starts from the same place:
   ```
   mkdir -p ~/.claude/skills/asana-skill-changelog && curl -fsSL https://raw.githubusercontent.com/tichahong-bit/collect-skills/main/skills/asana-skill-changelog/SKILL.md -o ~/.claude/skills/asana-skill-changelog/SKILL.md
   ```
   Also fetch the current `registry-state.json` the same way (see Central
   registry page section below) — it's the live source of truth for
   Page 1's table and it changes independently of `SKILL.md`:
   ```
   curl -fsSL https://raw.githubusercontent.com/tichahong-bit/collect-skills/main/skills/asana-skill-changelog/registry-state.json -o /tmp/registry-state.json
   ```
   If GitHub is unreachable, say so and continue with the local copy —
   don't block the log on it, but do skip the Page 1 write (step 5) rather
   than risk building its table from a copy you can't confirm is current.

1. **Resolve workspace_gid.** If not already known this session, call
   `asana_whoami` (gives default workspace) or `asana_find` if the user
   names a specific workspace.

2. **Find or create Page 2** for this skill.
   - `page_list` on the workspace, look for a page named `"<skill_name>"`.
   - If found: `page_get` it to read current `html_text` (must read before
     writing — `page_update` replaces the whole body).
   - If not found: this is the first logged version. Collect the
     first-time-only inputs above, then `page_create` it (template below).

3. **Create Page 3** (this version's detail page) via `page_create`:
   - `name`: `"<skill_name> — v<version>"`.
   - `html_text`: full detail write-up (template below) — this MUST
     include the "Markdown detail" section holding the skill's own
     `SKILL.md` (or equivalent) file content, **verbatim, in full**, as it
     stands at this version. Read the actual file (ask the owner for its
     path if you don't have it) and paste its raw text into the `<pre>` —
     don't summarize or truncate it. Each version's Page 3 is a full
     snapshot of the file at that point, not just a diff.
   - Capture the returned `gid`, then `page_get` it once to get its
     `permalink_url` (`page_create`'s response doesn't include it).

4. **Update Page 2**: keep the Breadcrumb, Skill Details, and Example
   scenario sections untouched, prepend a new `<li>` (newest first) to the
   `<ul>` in the Change log section (the last section), then `page_update`
   with the full merged body.

5. **Upsert the row on Page 1** (central registry) via `registry-state.json`
   as described above — fetch, upsert this row, render the full table from
   every row, `page_update`, then commit+push the JSON.

6. **Report back all three links** to the user: central registry, Page 2,
   and the new Page 3.

## Templates

### Page 1 — registry table

One `<table>` under the `"🆕 Skill changelogs"` heading, bold the header
row's cells (no `thead`/`th` support). Keep it at 5 columns — a 6th risks
overflow/clipping on the page.

```html
<strong>🆕 Skill changelogs</strong>

<table>
<tr><td><strong>Skill</strong></td><td><strong>What it does</strong></td><td><strong>Output</strong></td><td><strong>Latest version</strong></td><td><strong>Who</strong></td></tr>
<tr><td><a href="<page2_permalink>"><skill_name></a></td><td><what_it_does></td><td><output></td><td>v<version> — <date></td><td><author></td></tr>
</table>
```

Render one `<tr>` per row currently in `registry-state.json` — this table
is rebuilt in full every run, not edited in place.

### Page 2 — first creation

Four labeled sections, each separated by an `<hr>`: **Breadcrumb**,
**Skill Details** (how to use + download link), **Example scenario**
(a short walkthrough story), **Change log**.

```html
<body>
<strong>Breadcrumb:</strong>

<a href="<central_registry_permalink>"><central_registry_name — from page_get, don't hardcode></a> / <strong><skill_name></strong>

<hr>

<strong>Skill Details</strong>

<strong>Install / Update</strong> (run anytime — always pulls latest from GitHub main, no manual download needed):

<pre>mkdir -p ~/.claude/skills/<skill_name> && curl -fsSL <github raw url> -o ~/.claude/skills/<skill_name>/SKILL.md</pre>

<strong>Browse</strong>: <a href="<github raw url, if the skill file is published there>">SKILL.md (GitHub)</a> · <a href="<github blob url>">repo</a>

<strong>How to use</strong>
Trigger: <code><trigger></code>

<strong>Prompt example (real usage):</strong>

<pre>Use the <this skill's own name> skill.
Skill: <skill name e.g. <skill_name>></pre>

Required: skill name. Claude checks/asks for the rest. First time logging a skill also adds a row for it on the <a href="<central_registry_permalink>"><central_registry_name></a> central page.

<hr>

<strong>Example scenario</strong>

<a short, concrete walkthrough of someone actually using this specific
skill end-to-end — not generic filler. For asana-skill-changelog itself,
this is: build + test your own skill → push it somewhere downloadable
(Asana Knowledge can't attach files) → log it here with a one-line prompt
→ share the Page 2 link so teammates can read how to use it and download
it. Numbered list (<ol>) reads well here.>

<hr>

<strong>Change log</strong>

Version history for the <skill_name> skill. Click a version's link for the full detail.

<ul>
<li><strong>v<version></strong> — <date> — <short_summary> — <a href="<page3_permalink>"><skill_name> — v<version></a></li>
</ul>
</body>
```

Omit the Install/Update and Browse lines if the skill isn't published to
GitHub yet. The Example scenario should be specific to the skill being logged —
ask the owner what a real end-to-end use of their skill looks like rather
than inventing a generic one.

### Page 2 — later versions

Keep the Breadcrumb, Skill Details, and Example scenario sections
untouched — only touch the `<ul>` inside the Change log section (last).
Insert the new `<li>` as the **first** item (newest-first), then
`page_update` the whole body.

### Page 3 — detail page

Three labeled sections, each separated by an `<hr>`: **Breadcrumb**,
**Log detail information** (what changed + why), **Markdown detail**
(full file snapshot).

```html
<body>
<strong>Breadcrumb</strong>
<a href="<page1_permalink>"><central_registry_name — from page_get></a> / <a href="<page2_permalink>"><skill_name></a> / <strong>v<version></strong>

<hr>

<strong>Log detail information</strong>

<date> · logged by <author>

<strong>What changed</strong>
<ul>
<li><bullet 1></li>
<li><bullet 2></li>
</ul>

<strong>Why</strong>
<why this change was needed — bug hit, gap found, request, etc.>

<hr>

<strong>Markdown detail</strong>

<pre><the FULL raw content of the skill's own SKILL.md (or equivalent) file, verbatim, exactly as it stands at this version — not a summary, not just the diff. This is the archived snapshot of the file at this version.></pre>
</body>
```

The `<pre>` block holds the actual file's raw markdown source (frontmatter,
headings, everything) copy-pasted as-is — don't convert it to rendered
`<ul>`/`<h2>` tags, and don't shorten it. This makes every version's Page 3
a full, standalone snapshot of the skill file at that point in time.

## Boundaries

- Never invent a version number, date, change description, or example
  prompt — ask the skill's owner.
- Never overwrite existing rows/sections you didn't mean to touch — Page 2
  and Page 3 read-then-merge via `page_get`; Page 1's table read-then-merge
  goes through `registry-state.json` instead, since `page_get` can't see
  table content (see Central registry page section).
- Never `page_update` Page 1 from a `registry-state.json` you haven't just
  freshly fetched from GitHub this run — and never skip pushing the
  updated JSON back afterward.
- One Page 2 per skill (not per team, not global).
- If the user hasn't named a skill, ask which one and what changed before
  creating anything.
