# Changelog — ds-governance-pr-asana

Full version history with the real defect/correction and reasoning behind each rule now in
`SKILL.md`. Read this file for the "why" — an agent running the skill does not need it.

Derived from `ds-governance-pr-notion` v1.4.0 — that skill's own changelog has the reasoning behind
the base PR/publish-sync logic (the Applied/Publish/Reject/Consult branches, the two verified-live
annotation shapes). This file only covers what changed *in this Asana-backed variant*, from its own
v1.0.0 onward.

---

## v1.4.0 (2026-09-05, caught during the first real dry-run right after v1.3.0's push)

A Donut Chart Component issue task had **two** flagged nodes in its Source section (`72:8371` and
`96:17406` — same file, different sections, from a recurring finding, both linked to task
`1218194469266241`). Running the skill against that task updated only one of them — the other kept
showing the stale blue "Request Design system" annotation after the task had already moved to
`Publish & Pending refine`.

Step 1 now reads *every* Source link as a checklist, not just the first. Step 3 got a dedicated
enumeration pass that resolves and writes to every node the checklist names — same file (one
Desktop Bridge connection covers every section/node in it) or a different file entirely
(cross-project duplicates need their own Desktop Bridge connection each, same pattern
`ds-governance-audit-asana` Step 6c already uses for multi-project attribution). The output
contract's `figma_node_annotated` became `figma_nodes_annotated` (plural array) plus a
`figma_nodes_skipped` list for anything unreachable, so a partial run is visible in the output
instead of silently looking complete.

## v1.3.0 (2026-09-05, logic pass before this skill's first push to GitHub)

Previous versions (v1.0–v1.2) only ever existed as a local dev copy — never pushed, never run
against a fresh environment. Fixed everything that assumed the original dev environment:

- Replaced every tool reference to the official `use_figma`/`search_design_system`/`get_metadata`/
  `get_screenshot` names (not available in every environment) with the `figma-console` Desktop
  Bridge tool names confirmed working in the environment this push happened from — `figma_execute`,
  `figma_search_components`, `figma_capture_screenshot`, `figma_set_annotations`,
  `figma_get_annotation_categories`. An environment that does expose `use_figma` directly can run
  the same JS bodies unchanged — only the wrapping tool call differs.
- Removed every "see `ds-governance-pr-notion` Step X" cross-reference — the skill is now
  self-contained; the Notion sibling is prior art, not a runtime dependency.
- **Fixed a wrong field name:** the Publish branch said to set `Governance Status` = `Publish` on
  *any* Inventory task. Checked live against both real Inventory projects — `Governance Status`
  (gid `1217567936300826`) only exists on **🗂 Project Component Inventory** (gid
  `1217568055044505`); the **🗂 Core Design System Library (Inventory)** (gid `1217578024173799`)
  has no such field at all. Step 2's Publish branch now only touches it for a Project-Inventory
  match.
- **Fixed a field that doesn't exist:** the Rejected branch referenced a "`Related Core Component`"
  field on the Component issue task — no such field exists (checked live against the project's real
  custom fields). Rejected now just says to search the Inventory project by task name, same
  technique Step 2's Publish branch already uses.
- Added the Reference table now in `SKILL.md` — every gid this skill reads or writes, in one place,
  instead of scattered inline through the steps (matches `ds-governance-audit-asana`'s own
  Reference section).

## v1.2.0

Made the Asana-initiated direction explicit and non-optional: DS team changes `Issue Status` to
`Publish & Pending refine` or `Rejected` in Asana, runs this skill, and the Figma annotation on the
original node **must** flip from blue (`Request Design system`) to orange/red in the same run. This
was always the design (it's the primary trigger), but wasn't stated as a hard guarantee anywhere —
added a dedicated callout so it can't be read as optional or Figma-initiated-only.

## v1.1.0

The Applied template was a guess, ported from `ds-governance-pr-notion`'s documented shape without
a live check. Verified live against `0ZPE1y1pXUAmFoYhrFdc2X` node `110:1467`: the real shape has no
separate Component-Link/Resolved split — the component link is inlined into **Why**, and a
*partial* Applied (the most common real case — a designer usually fixes one site at a time) has no
closing checkmark and stays a plain status line with a `(test — N of total sites)` suffix. Only a
fully-resolved Applied closes the case.

Also made explicit: the normal path into the Applied branch is annotation-driven, and the
**original annotation is expected to be gone** — swapping a raw/broken frame for a real component
instance deletes the old node, and annotations attach to a node's own id. Write a fresh annotation
on the new node; there's nothing to "restore."
