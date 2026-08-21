---
name: asana-design-knowledge-capture
description: >
  Capture an external reference — a web link (article, spec, design
  pattern doc) or an existing Asana page — into the "Design Knowledge"
  tree in Asana Knowledge. Reads the source for real content, decides
  which existing category/page it belongs under by walking the current
  tree, and either merges it into a matching page or creates a new page
  in the right spot if nothing matches yet. Trigger:
  /asana-design-knowledge-capture, "log this to design knowledge",
  "capture this link", "add to design knowledge", or pasting a URL/Asana
  page link with no other instruction while working in this workspace's
  Design Knowledge context.
---

# Asana Design Knowledge Capture

## Purpose

The user collects design/UX reference material — articles, specs,
pattern libraries, other teams' Asana pages — as they run into it, and
wants it triaged into a growing category tree instead of staying loose
in chat or a browser tab. Unlike `asana-research-log` /
`asana-branding-log` / `asana-copywriting-log` (each a flat Index +
one-page-per-source list), the **Design Knowledge** hub is a
**hierarchical tree that the user is actively growing** — categories
nest, and the right shape for a new piece of knowledge isn't always "add
a row to a list"; it might be "this belongs inside an existing page",
"this needs a new leaf under an existing category", or, rarely, "this
needs a whole new top-level category".

This skill's job each time: read the source for real, walk the current
tree, decide the best-fitting spot, act (merge or create), and report
back what was done and why — not just where a link got filed.

## Root hub

`"Design Knowledge"` (gid `1217629510106645`,
https://app.asana.com/1/1153565613997788/note/1217629510106645). Confirm
with `page_get` it's still the right page/name before writing — as with
the other Asana Knowledge hubs in this workspace, names and gids can
drift over time.

As of this skill's creation the tree looked like:

```
Design Knowledge
├─ Device Template
│  ├─ Tablet
│  ├─ Website
│  └─ Mobile
└─ UX Behaviour
   └─ <title>   (an empty placeholder the user hasn't filled in yet)
```

Don't treat that shape as fixed — always re-read the live tree (see
"Walking the tree" below), since the user adds categories and pages to
it independently of this skill.

## Walking the tree

`page_get` only returns one page's own body — a page's body here is
just a bold category label followed by `<a data-asana-type="note">`
links to its children (see "Templates" below for the exact shape). To
see the current tree:

1. `page_get` the hub. Its body lists top-level category labels, each
   with one or more child-page links.
2. For each child that looks relevant to the new source's topic,
   `page_get` it too — a child may itself be a category (more links
   inside, no real content yet) or a leaf (real content, no further
   links). Keep descending only into branches that could plausibly be
   relevant; don't eagerly fetch the whole tree if it's obviously in an
   unrelated branch (e.g. skip "UX Behaviour" entirely for a pure
   visual-layout topic).
3. An empty body (`<body></body>`) means an uncreated leaf or a
   placeholder like `<title>` — the user stubbed out a slot but hasn't
   populated it. Treat a `<title>`-named page as available-but-unnamed:
   if the new source is a good fit for what that stub was clearly meant
   to hold (judge from its parent category), you may rename it and fill
   it in rather than creating a sibling; if it's ambiguous what the stub
   was for, leave it alone and create a new page instead.

## Deciding where it goes

Three outcomes, in order of preference:

1. **Merge into an existing leaf** — a page already covers this exact
   topic (e.g. a "Grid" page already exists with breakpoint content and
   the new source adds more grid detail). Read its current `html_text`,
   append a new dated block (don't overwrite what's there), `page_update`.
2. **New leaf under an existing category** — the topic is new but an
   existing category is clearly its home (e.g. a responsive-grid spec
   belongs under "Device Template" even though no grid page exists yet).
   `page_create` the new leaf, then edit the category page to add a link
   to it (read-then-merge — never drop the category's existing links).
3. **New top-level category** — nothing in the tree is a reasonable
   parent. Add a new bold label + page link block to the hub page itself
   (read-then-merge, append after existing categories), and `page_create`
   the new leaf under it. This is the biggest structural call — if it's
   genuinely unclear whether the topic deserves its own category or is a
   stretch-fit for an existing one, say so and pick the more conservative
   option (fit it under the closest existing category) rather than
   fragmenting the tree; note the judgment call when reporting back.

One piece of source material can legitimately apply to more than one
leaf (e.g. a responsive-grid article is relevant to Tablet, Website,
*and* Mobile individually, since breakpoints differ per device). When
that happens, don't force it into one arbitrary leaf — either place it
under the closest shared parent category (if one exists and fits), or
place the full content in the single most relevant leaf and add a short
cross-reference link from the other relevant leaves rather than
duplicating the full write-up three times.

## Extraction discipline — read the actual source

- **Web link:** fetch it and use the real page content — don't
  summarize from the URL slug or guess from the domain. Capture what the
  source actually says (key concepts, specs, rules, numbers), not a
  generic paraphrase of what a page at that URL probably contains.
- **Asana page link:** `page_get` it and use its real `html_text` /
  content, the same way.
- If a source is paywalled, login-gated, or otherwise unreadable, say so
  explicitly rather than inventing plausible-sounding content.
- Never fabricate specs, measurements, or rules that aren't actually in
  the source.

## Write-up language — Thai, easy to read, still accurate

Write the captured leaf content in **Thai**, phrased so it's easy to
read (plain, everyday wording — not a stiff word-for-word translation),
while keeping every fact, number, and rule from the source exactly as
accurate as the English original. This applies to the body content —
not to things that should stay untranslated: proper nouns, source
titles, author names, URLs, and load-bearing technical terms (e.g.
"confidence interval", "nondeterministic") can stay in English inline,
optionally with a short Thai gloss, when a Thai term would be unclear or
lose precision. Never let "easy to read" become "vaguer than the
source" — simplify sentence structure, not the substance.

## Process

1. **Resolve workspace_gid** if not already known this session.
2. **Confirm the hub** is still `"Design Knowledge"` (gid
   `1217629510106645`) via `page_get`.
3. **Read the source** (web fetch or Asana `page_get`) for its real
   content and topic.
4. **Walk the tree** (see above) to find candidate matches.
5. **Decide the placement** (merge / new leaf / new category — see
   above), erring toward reusing existing structure over creating new
   branches.
6. **Act:** `page_update` (merge) or `page_create` + link it in from the
   parent category page (read-then-merge on the parent).
7. `page_get` any newly created page once to get its `permalink_url`
   (`page_create` doesn't return it).
8. **Report back:** where it landed (full path in the tree), a one-line
   summary of what was captured, and — if a new category was created or
   a placement was a judgment call — a short note on why.

## Templates

### Category page body (hub or any category-level page)

```html
<body>
<strong><category_label></strong>

<a href="<child_permalink>"><child_title></a>

<a href="<child_permalink>"><child_title></a>


<strong><next_category_label></strong>

<a href="<child_permalink>"><child_title></a>
</body>
```

### Leaf page body (actual captured content)

```html
<body>
<strong>Breadcrumb:</strong>

<a href="<hub_permalink>">Design Knowledge</a> / <a href="<category_permalink>"><category_label></a> / <strong><leaf_title></strong>

<em>Source: <url_or_asana_link>. Captured <date> by <logger>.</em>

<hr>

<!-- real extracted content: key points, specs, rules -->
</body>
```

When merging a second source into an existing leaf, append a new block
under a `<hr>` divider with its own `Source:` line rather than
interleaving it into the first source's write-up — keep each captured
source's content attributable to where it came from.

## Boundaries

- Never fabricate content from a source you haven't actually read.
- Never overwrite an existing category page's links or an existing
  leaf's content — always read-then-merge.
- Don't create a new top-level category as a first resort — check
  whether an existing one is a reasonable (even if imperfect) fit first,
  and default to the conservative placement when it's a close call.
- If the hub's gid/name looks wrong when you `page_get` it, stop and ask
  the user rather than guessing which page is now the hub.
