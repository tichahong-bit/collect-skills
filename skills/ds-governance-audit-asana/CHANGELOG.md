# Changelog — ds-governance-audit-asana

Full version history with the real defect/correction and reasoning behind each rule now in
`SKILL.md`. Read this file for the "why" — an agent running the skill does not need it.

Steps 1–4's classification logic is a direct port of `ds-governance-audit-notion` (see that
skill's own changelog, v1.1.0–v1.11.0, for the reasoning behind the base audit brain). This file
only covers what changed *in this Asana-backed variant*, from its own v1.0.0 onward.

---

## v1.1.0 (2026-08-18, Wealth_G14 schedule-payment screen)

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
