# Changelog — ds-governance-audit-asana

Full version history with the real defect/correction and reasoning behind each rule now in
`SKILL.md`. Read this file for the "why" — an agent running the skill does not need it.

Steps 1–4's classification logic is a direct port of `ds-governance-audit-notion` (see that
skill's own changelog, v1.1.0–v1.11.0, for the reasoning behind the base audit brain). This file
only covers what changed *in this Asana-backed variant*, from its own v1.0.0 onward.

---

## v2.4.0 (2026-09-19, bring back Impact/Why — v2.0.0 dropped them without a replacement)

Requester compared two live annotations on the same file (`[StaffPortal_ABC] Dashboard`) — node
`164:6081` (current, post-v2.0.0 shape: Status/Issue Type/Summary Reason/AI Recommend/Core System
Recommendation) against node `164:3337` (an older annotation, pre-v2.0.0 shape: Status/Issue
Type/**Impact**/**Why**) — and asked for the older shape back. It states the Gap's actual blast
radius in one line (`Impact: Project level only · 1 squad only`) and the root cause in one
scannable paragraph (`Why: cds has no ... component at all (0 of 71 sets match ...) — this donut
is hand-built with no component to bind to`), neither of which the current shape surfaces
explicitly — `Summary Reason` mixes "what was found" and "why" together in a longer narrative, and
nothing in the schema ever stated the finding's scope at all.

v2.0.0's own changelog entry already names the old shape (`Status`/`Issue type`/`Impact`/`Why`) as
what Figma carried before that version replaced it wholesale with Asana's 4-field shape — done to
fix two real problems: Figma and Asana disagreed on field names, and Figma never carried the
recommended fix at all. A straight revert to the old shape would reopen both of those. This
version merges the two instead of picking one: `impact` and `why` are restored as real fields in
§Unified Finding Schema — a superset of the old shape, not a swap — `why` replaces `summary_reason`
as the label everywhere (same underlying instruction: what was found, why neither Design System
covers it; just renamed to match, and tightened toward the one-paragraph scannable style node
`164:3337` demonstrates instead of a longer narrative). `impact` is a genuinely new field, sourced
from Step 6c's occurrence/cross-project search — that search already existed and already fed
`Occurrence Count`/`Suggest to add in Core System?`, and the guardrail against fabricating an
"Impact line" has existed since v2.0.0, but nothing ever actually wrote one until now. `ai_recommend`
and `core_system_recommendation` stay — dropping them again would reopen the exact gap v2.0.0
closed — with `core_system_recommendation`'s reasoning now pointing at `impact`'s stated scope
instead of restating the same numbers.

Updated: §Unified Finding Schema (table + worked example), Step 6b's `html_notes` template (new
`Impact` `h2`, `Summary Reason` `h2` renamed to `Why`), Step 6c (now states explicitly that its
search result is what `impact`'s content is drawn from), Step 7's Figma annotation template, the
chat summary template, the JSON output contract (`why` replaces `summary_reason`, `impact` added),
and the guardrail bullet naming the old field list.

**Breaking, by design, same precedent as v2.0.0:** existing already-created annotations/tasks
(including node `164:6081`) are not retroactively rewritten by this change — a future run does not
need to touch old ones unless asked.

## v2.3.1 (2026-09-18, no raw node IDs / hex / key hashes in the human-facing prose either)

After v2.3.0 shipped, pulled the actual annotations off the real test screen (Apple Pay hero
section, `407:87388`, MBDS) via `figma_get_annotations` to check the fix against real evidence, not
just the reported symptom. Found the deeper problem: even setting language aside, every finding was
written like a Figma-data debugging report — `"fillStyleId is overridden from the main component's
Foundation Neutral/Neutral1 (key e8f2…) to a same-named Neutral/Neutral1 under a different key
(7d09…)"` — raw node IDs (`147:24524`), hex codes (`#F7F7F7`), and key hashes woven directly into
the sentence as primary content. That's unreadable to a DS Designer regardless of language.

Added an explicit "don't do this" excerpt (the real finding, lightly trimmed) directly beside the
"do this instead" rewrite in §Unified Finding Schema's Writing style section, plus a rule: that
detail belongs to the agent's own investigation (Step 1), not the reader — the annotation is
already attached to the right node, so the prose doesn't need to re-derive its ID. New guardrail
added to match.

## v2.3.0 (2026-09-18, Summary Reason / AI Recommend are unreadable — write Thai, plain sentences)

A teammate tested the skill on a real screen (an Apple Pay button, no matching CDS component) and
reported `Summary Reason`/`AI Recommend` were very hard to read. Root cause: Step 6b's `html_notes`
template modeled each section with instructional fragments — e.g. `<li>Closest existing fragments
named specifically.</li>` — written as a directive telling the agent what to cover, not as example
prose. The agent was echoing that directive tone (and English) into the real Asana task/Figma
comment a Thai-speaking DS Designer then had to read.

Added a "Writing style" subsection to §Unified Finding Schema with an explicit rule (Thai, plain
complete sentences, never this document's own instructional wording) and two full worked examples
(one Gap, one Issue) grounded in the real Apple Pay test case. Field **labels** (`Summary Reason`,
`AI Recommend`, etc.) stay English — that's the real Asana/Notion column convention, unchanged.
Only the **content** under each label changed language/tone. Updated Step 6b's html template, Step
7's Figma annotation template, the chat summary template, and the JSON output contract's field
description to all point at the same worked example and rule, plus a new guardrail.

## v2.2.1 (2026-09-16, list the CDS Core Icon Library as a direct reference)

Requester added the ⭐️ Core Icon Library (fileKey `2kq1XNzoBuxqyDEzP9IaZO`) alongside the Core
Design Library under Step 0's CDS predefined resources — matches the same fileKey `cds-consumer`'s
own `AGENTS.md` already names for icons ("Icons come from the icon library, never from anywhere
else"). Previously Step 0 only pointed CDS at the `cds` MCP tools with no direct Figma links at
all, unlike MBDS's fuller list — this closes that gap for the two libraries actually named
elsewhere in this project.

## v2.2.0 (2026-09-16, MBDS whole-screen template check before Design System Gap)

Requester pointed at `https://mbds-bbl.vercel.app/#/bbl/templates` and `#/bbl/patterns` as MBDS's
own rule sources, parallel to what v2.1.0 just scoped `cds-consumer` to. Checked live via
`mcp__mbds__get_rules`: MBDS ships 20 full **screen templates**, not just components — its own
rulebook explicitly instructs "Step 0 — is the whole screen already built? Fetch
`.../r/templates.json`" before composing one by hand. CDS has no equivalent (no whole-screen
template layer), so this was previously entirely missing from Step 3's classification — an MBDS
composed section that actually matched a shipped template could have been wrongly flagged as N
separate component-level Gaps instead of "this screen already exists."

Also confirmed live: `mbds-bbl.vercel.app` is a client-rendered JS app — its `#/...` pages are a
human-readable mirror of the same data the `mbds` MCP tools and `.../r/*.json` endpoints already
serve, not an independently fetchable source (the DOM has no real content, same lesson as `cds`'s
own docs). Added an explicit warning against fetching those URLs directly.

Step 3 now runs an MBDS-only whole-screen template check (`list_templates`/`get_template`) before
the zero-category check, when the confirmed target is MBDS. Step 0's MBDS resource list and the
Pipeline table updated to match. This is the MBDS-side counterpart to v2.1.0's CDS-only gate —
different systems expose different governance surfaces, and this skill now uses whichever one the
confirmed target actually has instead of forcing parity between them.

## v2.1.0 (2026-09-16, cds-consumer's DRIFT.md is CDS-only — gate Step 4 on target Design System)

Requester flagged that `cds-consumer` (โย's repo) is scoped to CDS specifically — confirmed live:
its `AGENTS.md`/`context/DRIFT.md` are explicitly about `⭐️ Core Design Library` (fileKey
`ON8Azjo7wIi3P2oxnxKiBb`). v1.9.0 made Step 4 sync this repo live, but never checked which Design
System the audit was actually targeting before applying its rulings — after v1.7.0 added MBDS
support, an MBDS audit could cite a CDS owner ruling as if it applied, which is wrong in a
different way than stale data: it's the wrong system's authority entirely, not just old data from
the right one.

Step 4 now only runs when Step 0 confirmed the target Design System is CDS. For MBDS or another
target, it's skipped outright, and the skip is stated plainly in the summary rather than silently
omitted (an unmentioned skip reads as "nothing to check," not "this check doesn't apply"). Noted
in Step 4, the Pipeline table, Reference, and guardrails that a future MBDS-equivalent
drift/settled-rulings repo — if one is ever built — would need this step extended to read it, but
none exists yet so none is assumed.

## v2.0.0 (2026-09-16, one finding schema everywhere, explicit Pipeline index)

Requester asked for the skill to "organize more systematically, and produce the same output format
every time" — a real gap: the Figma annotation (Step 7) and the Asana task body (Step 6b) carried
two *different, disconnected* field shapes for the same finding (Figma had `Status`/`Issue
type`/`Impact`/`Why`; Asana had `Summary Reason`/`AI Recommend`/`Core System Recommendation`/
`Source`), and the Figma Gap annotation never even carried the recommended solution at all — only
Asana did. The chat summary had no fixed template either, and the JSON output contract only
reported counts, not itemized findings, so it couldn't be cross-checked against the other two.

Added **§Unified Finding Schema**: one field set per classification (Gap: `component` /
`status`+`issue_type` / `summary_reason` / `ai_recommend` / `core_system_recommendation` /
`origin`+`asana_task_url`; Existing DS Issue: `component` / `problem` / `fix`). The real,
already-verified Notion/Asana "Component issue" row shape is the source of truth — Figma's
annotation, the chat summary, and the JSON contract now mirror *its* field names (condensed for
Figma's panel), rather than each surface inventing its own. Step 7's Figma Gap annotation now
carries Summary Reason/AI Recommend/Core System Recommendation, same as Asana. The chat summary got
a fixed per-finding template. The JSON output contract's `findings` is now an itemized array using
the same field names, replacing the old counts-only object.

Also added a **Pipeline** index (Step 0–8 in one table) right after Inputs, and gave Design System
Identification an explicit **Step 0** label — it was previously a standalone section with no step
number, ambiguous about exactly when it ran relative to Step 1.

**Breaking, by design:** this changes what new Figma annotations and chat summaries look like going
forward. Existing already-created annotations/tasks are not retroactively rewritten by this change —
same precedent as v1.2.0 rewriting 3 live tasks by hand at the time; a future run does not need to
touch old ones unless asked.

**Correction, v2.4.0 (2026-09-19):** dropping `Impact`/`Why` here without a replacement turned out
to be a real regression, not a pure improvement — see v2.4.0 above. Both are now back as real
fields, merged with what this version added rather than reverting it.

## v1.9.0 (2026-09-16, align Step 4's sync method with the rest of the project)

v1.8.0 (below) fixed the right problem — Step 4 must never trust an unsynced local
`cds-consumer` checkout — but picked a one-off `gh api` fetch, inconsistent with how every other
skill in this repo already reads this same collaborator repo. `ds-governance-prototype-asana`
already establishes the real convention: `git -C ~/design-system-repos/<repo> pull 2>/dev/null ||
git clone <url> ~/design-system-repos/<repo>` before every read, for both `cds-consumer` (โย) and
`agent-design-kit` (กัน). Both clones already exist locally at that exact path, git-tracked to the
right remotes, already up to date — confirmed live.

Switched Step 4 to the same `git pull`-or-clone pattern against
`~/design-system-repos/cds-consumer`, then read `context/DRIFT.md` from the synced clone. Reference
table and guardrail updated to match. This also means Step 4 no longer depends on `gh` CLI
specifically — plain git credentials (already proven working) are enough.

## v1.8.0 (2026-09-16, fetch cds-consumer's DRIFT.md live, not from a local checkout)

Step 4's owner-ruling check ("has the owner already settled this as deliberate?") only ran if the
`cds-consumer` repo happened to be checked out locally — silently skipped otherwise, and even when
checked out, a clone can sit stale for weeks while `context/DRIFT.md` keeps changing upstream
(`therealveldt/cds-consumer`, owned by a collaborator, private). Same class of staleness problem as
v1.7.0's Design-System-defaulting issue: relying on whatever happens to be sitting on a local disk
instead of the tracked source.

Step 4 now fetches `context/DRIFT.md` live every run via `gh api
repos/therealveldt/cds-consumer/contents/context/DRIFT.md` (confirmed working against the real
private repo with an authenticated `gh` session) instead of requiring/trusting a local checkout.
Reference table and guardrails updated to match.

## v1.7.0 (2026-09-16, multi-Design-System support — never assume CDS)

Every "Core" reference in this skill (Step 1's instance check, Step 3's zero-category
`search_components` call) implicitly meant CDS, with no step that ever confirmed that with the
user. Requester flagged this is wrong for MBDS (Mobile Banking) screens and any future Design
System this org adds — auditing an MB screen against CDS produces findings that are actively
wrong, not just incomplete.

Added a new **Design System Identification** section (before Step 1): if the user already named a
Design System (CDS / MBDS-Mobile Banking / a Figma library link), use it; if not, stop and ask
with the 3-option question before auditing. Predefined MBDS resource links (web docs, component
library, icon library, illustration/assets library, template library) are listed so MBDS runs
don't need the user to re-supply links every time. Step 1 and Step 3's `search_components` call
now read from the confirmed target's MCP server (`cds`/`mbds`/equivalent), never defaulting to
`cds`.

Also hardened Step 2's Figma-file-name parsing: the `[Project_Squad] Feature` convention had no
documented fallback when a file's name didn't match it — added the explicit ask-the-user flow
(Platform/Squad/Feature) for that case, a Platform-inference-from-Design-System shortcut (confirm
before trusting an unclear mapping), and made explicit that Squad is optional (nickname accepted)
while Feature is required and must never be guessed.

## v1.6.0 (2026-09-05, requester policy: no Notion dependency in this skill, at all)

v1.5.0 (below, same day) had this skill mirror Context Knowledge into *both* Notion and the
dashboard. Requester overrode that within the hour: this Asana-backed skill should have **no Notion
dependency anywhere**, full stop — not "mirror both," migrate off Notion entirely. Reverted the
Notion half of Step 2/8: Context Knowledge is now dashboard-only for this skill (the Notion-backed
sibling keeps its own separate copy, untouched, no longer read or written by this skill). Updated
the Reference table, "How this relates to other skills," and the guardrails bullet on Context
Knowledge writes to match — this skill's only remaining Notion mentions are historical/naming
(the sibling skill's name, the companion doc, the fixed `Origin` enum string), none of them live I/O.

## v1.5.0 (2026-09-05, DS Governance Log gets its own Context Knowledge)

Context Knowledge existed only in Notion, with no `Squad` column at all — the
`[<Project>_<Squad>]` naming convention Step 2 already parsed had nowhere to put the Squad half of
what it extracted, so it silently got dropped after informing the Feature-name resolution and
never persisted anywhere. Meanwhile a separate DS Governance Log (Next.js + Vercel KV,
`ds-governance-dashboard.vercel.app`) got built the same day for Estimation Reports, and gained its
own Context Knowledge page with a real `squad` field and its own `[Project_Squad] Feature` parser —
built against this exact skill's own `[StaffPortal_ABC] Dashboard` example from v1.3.0/v1.4.0.

Step 2 now mirrors every Feature it resolves into both places: the existing Notion page (unchanged,
no Squad column there) and the dashboard's `/api/features` (with `squad`). Read-then-write per
Feature (GET, PATCH-if-found-and-link-missing, POST-if-not-found, treat a 409 as "found") — same
backfill-only discipline as the Notion column, just duplicated across two stores instead of one.

Two corrections from a real run:

1. Step 1's token/font check was underspecified — added the exact scan script and a
   consolidation rule (one annotation per container, not one per node — a 3-screen flow with raw
   text on every line produced 24 raw findings from 8 distinct text/fill nodes × 3 repeated
   screens; that's 3 annotations, not 24).
2. Step 7 corrected a false claim inherited from the older `ds-governance-audit` skill that
   annotation categories can only be *created* via Desktop Bridge (`figma-console`) and only
   *assigned* via the plain Plugin API. Verified live: `figma.annotations.addAnnotationCategoryAsync()`
   works standalone, no Desktop Bridge needed — it created both `Request Design system` and
   `Log Note` in a file that had neither. Use it directly instead of asking the user to add the
   category by hand.

## v1.2.0

Step 6b's task body was a flat field-order list (`Component Name → Request Type → ...`), copied
from the older `ds-governance-audit` skill's convention. Corrected against the real Notion
"Component issue" row body (verified live, `3bf7817ccced8117a0f4d5356b7b4650`-family pages): the
actual format is four narrative `h2` sections — Summary Reason, AI Recommend, Core System
Recommendation, Source — not a field-per-line dump. Rewrote 3 already-created Gap tasks
(GG_obie ×2, Wealth_G14 ×1) to match retroactively; new runs use the corrected template directly.

## v1.3.0 (2026-09-05, [StaffPortal_ABC] Dashboard)

Step 3 was silent on an entire class of finding: a hand-built element standing in for a whole
*category* of asset the DS never shipped at all — not a misused or detached copy of something
that exists, since nothing in the category exists to misuse in the first place.

Worked example: node `72:8371`, a hand-drawn donut chart built as an empty frame with a manual
gradient fill. `search_components` for `chart`, `donut`, `pie` each returned 0 of 71 cds sets — no
chart/data-visualization primitive exists anywhere in Core. Without an explicit rule this was at
risk of being waved through as "just a raw frame, not obviously a violation," since nothing on the
screen resembles a detached instance to compare it against.

Added the **zero-category check** to Step 3: run it before the ambiguous-composition question,
since that question ("mistake vs. intentional variant of an existing pattern") only makes sense
when an existing pattern might be the intended target — here there was no candidate pattern to
compare against at all, so asking would have been meaningless. Real result: `chart`/`donut`/`pie`
all returned 0 of 71 cds sets, so the finding went straight to Step 6, no question asked.

## v1.4.0 (2026-09-05, same StaffPortal audit, requester follow-up)

Every Gap task had a creation timestamp buried in Asana's own metadata but nothing that read as
an SLA. Added, set on every Gap task Step 6b creates:

- `Submitted Date` (custom field, gid `1218215634621446`, type `date`) = today.
- Native `due_on` = `Submitted Date` **+ 2.5 weeks (17.5 days, rounded up to 18 calendar days)** —
  rounded up rather than down so the SLA window is never shorter than 2.5 weeks.

Both fields were added live to the "📋 Component issue" project the same day. Both are write-once
at creation — a later Step 6c occurrence update to an existing row must not touch either field,
since a repeat sighting doesn't reset another team's SLA clock.
