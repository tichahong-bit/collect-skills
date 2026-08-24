---
name: asana-requirement-log
description: >
  Log a requirement — typically a user story with acceptance criteria,
  pasted from a PO/BA deck or written directly — into the Requirement
  collections tree in Asana Knowledge: Project → Feature/Epic → User
  Story. Walks the existing tree to find or create the right project and
  feature/epic branch before filing the story as a leaf page.
  Structure/depth is fixed (unlike the open-ended Design Knowledge tree),
  and the User Story leaf schema is what ds-governance-prototype-asana
  reads before asking the user anything and writes clarifications back
  into — keep that schema stable. Trigger: /asana-requirement-log, "log
  this requirement to asana", "log this user story", "add requirement to
  asana".
---

# Asana Requirement Log

## Purpose

Requirements arrive from multiple projects (e.g. "Wealth") as user
stories with acceptance criteria, grouped under features/epics (e.g.
"Wealth Dashboard (Web)", "Wealth Investment Insight (Mobile)"), usually
pasted straight out of a PO/BA requirement deck. This skill captures each
story as a leaf page in a fixed three-level tree in Asana Knowledge:

```
Requirement collections
└─ <Project>                    e.g. Wealth
   └─ <Feature/Epic>            e.g. Wealth Dashboard (Web)
      └─ <User Story>           e.g. US01 — Filter dashboard by date range
                                 (the actual content lives here)
```

**Leaf naming convention.** The User Story page title is never a bare ID
— it's always `<ID> — <short, scannable one-line description>` (e.g. "US01
— Filter dashboard by date range", not just "US01"), so a reader browsing
the Feature/Epic page's list of links can tell stories apart without
opening each one. Write the description from the story's own "I want
___" clause — don't invent detail beyond what the story states.

so that:

- Anyone can browse by project → feature/epic → story instead of
  scanning one long flat list.
- `ds-governance-prototype-asana` (and anything else building off a
  requirement) can check this tree **first** before asking the
  requester anything — "someone may have already clarified this."
- When that skill *does* clarify an ambiguity while building, it writes
  the resolution back onto the same User Story leaf — so that leaf's
  schema needs a stable place for that to land, not just the story as
  originally given.

There's no version tier — a User Story leaf is a **living document**,
updated in place as it gets clarified or re-scoped, not re-logged as a
new page each time (that's what its "Clarifications" section is for).

## Root hub

`"Requirement collections"` (gid `1217617725712351`,
https://app.asana.com/1/1153565613997788/note/1217617725712351). Confirm
with `page_get` it's still the right page before writing. Its body is
just a "Projects" list of links to Project pages — nothing deeper lives
directly on the hub itself.

## Walking the tree

Three fixed levels — don't add a fourth or collapse to fewer. `page_get`
only returns one page's own body, so:

1. `page_get` the hub → find the **Project** link (e.g. "Wealth"). If no
   project link matches, this is a new project — see "Creating a new
   branch" below.
2. `page_get` the Project page → find the **Feature/Epic** link that
   matches this story's feature area (e.g. "Wealth Dashboard (Web)"). Its
   body is a short one-line description of the project plus a flat list
   of feature/epic links. If none matches, this is a new feature/epic
   under an existing project.
3. `page_get` the Feature/Epic page → find the **User Story** link if
   this exact story (by ID or by story content) is already logged — if
   so, this is a re-log/update, not a new leaf (upsert: update the
   existing leaf, don't create a duplicate). Its body is a short
   one-line description of the feature/epic plus a flat list of story
   links.
4. The **User Story** page itself is the leaf with the real content (see
   schema below).

## Creating a new branch

- **New project** (no match at step 1): `page_create` the Project page
  (template below), then edit the hub to add its link under "Projects"
  (read-then-merge — never drop existing project links).
- **New feature/epic under an existing project** (no match at step 2):
  `page_create` the Feature/Epic page, then edit the Project page to add
  its link (read-then-merge).
- **New user story under an existing feature/epic** (no match at step
  3): `page_create` the User Story leaf, then edit the Feature/Epic page
  to add its link (read-then-merge).

Never guess which project/feature a story belongs to if it's not stated
or inferable from the story's own heading (e.g. "US02 — Wealth
Investment Insight (Mobile)" already states both project and
feature/epic) — ask.

## User Story leaf schema (keep stable — another skill depends on this shape)

`ds-governance-prototype-asana` reads this leaf's sections by name and
writes into "Clarifications" — don't rename or reorder these without
updating that skill too:

1. **Breadcrumb** — `Requirement collections / <Project> / <Feature/Epic>
   / <US title>`, each segment linked to its actual page except the last.
2. **User Story** — verbatim "As a ___, I want ___, so that ___." Don't
   paraphrase; if the source phrases it differently (bug report,
   one-line ask, etc.) preserve that framing rather than forcing it into
   the As-a/I-want/So-that template.
3. **Acceptance Criteria** — verbatim bullet list from the source. Don't
   summarize, merge, or drop any criterion, and don't invent one that
   wasn't given.
4. **Status** — one line: e.g. "Received as-is from &lt;source&gt;, not yet
   clarified or prototyped" for a fresh log, or whatever the current
   state actually is on a re-log.
5. **Clarifications** — a running, timestamped log of ambiguities found
   and how they were resolved (from existing knowledge vs. asked the
   requester), each entry appended by whichever skill did the
   clarifying. **Leave this section present but empty on first log** (a
   single placeholder line is fine) — don't invent clarifications that
   didn't happen.
6. **Related prototype runs** (optional, added by `ds-governance-prototype-asana`
   the first time it builds against this story) — leave absent on first
   log rather than pre-creating an empty section for it.

## Extraction discipline

- Use the user story and acceptance criteria **exactly as given** — this
  is requirement text, not a source to summarize. Never paraphrase
  acceptance criteria, never add a criterion that wasn't stated, never
  soften or reinterpret the "so that" outcome.
- If a pasted batch mixes multiple stories from different
  projects/features, split by story and file each under its own
  project/feature branch, not once for the whole batch.

## Required inputs

- The requirement text itself — a user story + acceptance criteria
  (pasted, or a link/file to read from). Never invent story content.
- `project_name` and `feature_epic_name` — ask if not stated or not
  inferable from the story's own heading.
- `date` (optional) — defaults to today if the source doesn't state when
  the requirement was written/received.
- `author` (optional) — defaults to the caller of `asana_whoami` if no
  PO/BA is named as the source.

## Process

1. **Resolve workspace_gid** if not already known this session.
2. **Confirm the hub page** is still `"Requirement collections"` (gid
   `1217617725712351`) via `page_get`.
3. **Walk the tree** (see above) for this story's project → feature/epic
   → story, creating any missing branch level along the way.
4. **Build/update the User Story leaf** using the schema above.
   `page_create` for a new one, or read-then-merge `page_update` for an
   existing one (only touch the sections that actually changed — e.g.
   adding a Clarifications entry should never touch the User Story or
   Acceptance Criteria sections).
5. `page_get` any newly created page once to get its `permalink_url`.
6. **Link the new page in from its parent** at every level created this
   run (read-then-merge at each level — never drop existing sibling
   links).
7. **Report back** the full path (hub → project → feature/epic → story)
   and every page link touched this run.

## Templates

### Project page / Feature-Epic page (category level)

```html
<body>
<strong>Requirement collections</strong> / <strong><project_or_breadcrumb_so_far></strong>

<one-line description of this project/feature-epic>

<a href="<child_permalink>"><child_title></a>

<a href="<child_permalink>"><child_title></a>
</body>
```

### User Story leaf — first creation

```html
<body>
<strong>Breadcrumb:</strong>

<a href="<hub_permalink>">Requirement collections</a> / <a href="<project_permalink>"><project_name></a> / <a href="<feature_epic_permalink>"><feature_epic_name></a> / <strong><us_title></strong>

<em>Source: <where this came from — PO deck, BA doc, pasted directly>. Logged <date> by <logger>.</em>

<hr>

<strong>User Story</strong>

<em>As a <role>, I want <goal>, so that <outcome>.</em>

<hr>

<strong>Acceptance Criteria</strong>

<ul>
<li><criterion 1, verbatim></li>
<li><criterion 2, verbatim></li>
</ul>

<hr>

<strong>Status</strong>

Received as-is from <source>, not yet clarified or prototyped.

<hr>

<strong>Clarifications</strong>

<em>No clarifications logged yet.</em>
</body>
```

## Boundaries

- Never invent, paraphrase, merge, or drop acceptance criteria — log
  exactly what was given.
- Never rename or reorder the User Story leaf's sections
  (`ds-governance-prototype-asana` depends on this shape) — if the
  schema genuinely needs to change, update that skill's read/write logic
  in the same pass.
- Keep the tree exactly three levels deep (Project → Feature/Epic → User
  Story) — don't collapse levels or add a fourth.
- Never duplicate a project/feature-epic/story that's already logged at
  its level — upsert (read-then-merge) instead.
- Never title a User Story leaf with a bare ID — always `<ID> — <short
  description>` (see Leaf naming convention above).
- If the hub page's gid/name looks wrong when you `page_get` it, stop
  and ask the user rather than guessing which page is now the hub.
