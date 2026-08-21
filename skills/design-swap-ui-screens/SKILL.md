---
name: design-swap-ui-screens
description: >
  Replace wireframe screens in a task-flow section with already-built
  Hi-Fi UI screens from another section of the same Figma file, while
  keeping the task flow's structure fully intact (status bar, purple
  diamonds, connectors, text labels, endpoint nodes). This is step 6 of
  the Design Agent Skills pipeline — it does NOT generate the Hi-Fi UI
  itself (that's step 5, "Gen UI Handoff"); it only swaps
  already-finished screens into an existing flow. Trigger: /design-swap-ui-screens,
  "swap UI screens", "เปลี่ยน wireframe เป็น UI" (change wireframe to
  UI), "เอา UI มาแทน wireframe" (put UI in place of wireframe), "switch
  UX เป็น UI" (switch UX to UI).
---

# Design Swap UI Screens

Source: Asana page "Design Agent Skills — 6. Swap UI Screens" (gid
`1217620691601447`,
https://app.asana.com/1/1153565613997788/note/1217620691601447), part of
the "Design Agent Skills" pipeline in workspace project gid
`1153565613997788`.

## Purpose / ทำอะไร (what it does)

Takes Hi-Fi UI screens that already exist (in a different section of the
Figma file) and uses them to replace the wireframe screens inside a task
flow section — while keeping the task flow's structure fully intact:
status bar, purple diamonds, connectors, text labels, and endpoint nodes
all stay as they are. Only the screen content changes; the flow's shape
does not.

## Not to be confused with skill 5 "Gen UI Handoff"

This is a hard boundary called out by the pipeline itself: this skill
does **not create** the Hi-Fi UI. It assumes the Hi-Fi UI screens are
already built and sitting in their own section of the file. If the Hi-Fi
UI doesn't exist yet, that's the job of **Design Agent Skills — 5. Gen UI
Handoff** (previous page in the pipeline, gid `1217629447470466`,
https://app.asana.com/1/1153565613997788/note/1217629447470466) — go
there first. Don't run this skill expecting it to design or generate
anything; it only relocates/maps already-finished screens into an
existing flow.

## When to use / ใช้เมื่อไหร่

- The Hi-Fi UI is already done, living in a separate section, and you
  want to swap it in to replace the wireframes currently in the task
  flow.

## When NOT to use / ไม่ใช้เมื่อไหร่

- There are no UI screens yet — this skill **does not create** UI. Go to
  skill 5 ("Gen UI Handoff") first.
- You don't yet have the node-id of the UI section — you need to locate
  that section first before this skill can run.

## What to type / พิมพ์ว่าอะไร (trigger phrases)

- `swap UI screens`
- `เปลี่ยน wireframe เป็น UI` (change wireframe to UI) / `เอา UI มาแทน wireframe` (put UI in place of wireframe)
- `switch UX เป็น UI` (switch UX to UI)

## Prerequisites / ต้องมีอะไรก่อน

Per the source page: **Figma Console MCP** ("Figma Console MCP" is the
term the page uses) plus 3 inputs:

- Figma file URL
- UX section node-id (the section containing the wireframes), e.g.
  `120:38608`
- UI section node-id (the section containing the Hi-Fi UI), e.g.
  `120:36481`

If you're given two links instead of raw node-ids, the skill parses the
`?node-id=` query param out of each URL itself.

**Dependency note (this repo's tooling):** in this environment, the
Figma-side operations this skill needs (reading document structure,
locating nodes/sections, reparenting/swapping nodes) should be done via
the **Figma Desktop Bridge MCP** tooling (`mcp__figma-bridge__*` — e.g.
`get_document`, `get_metadata`, `get_node`, `reparent_nodes`,
`duplicate_nodes`, `set_node_visibility`), consistent with how the
pipeline's decision guide routes "already-built hi-fi UI being moved
into a flow" work. Load the `figma-use` skill before making raw
`use_figma`-style calls, per that skill's own prerequisite rule.

## Output / ได้อะไรออกมา

The same task flow section as before, but with the screens now showing
the Hi-Fi UI instead of wireframes. The flow's structure is not broken.

## Common failure points / พังบ่อยตรงไหน — read this before running

- Wireframes and UI screens are matched to each other **by the name of
  the TEXT node** positioned above/below each screen (within roughly
  ~10px of x-axis alignment). If the label text doesn't match on both
  sides, the mapping fails. **Fix: make sure the label names match
  between the wireframe screen and its corresponding Hi-Fi UI screen
  before running this skill.**
- This is described as the shortest, most straightforward skill in the
  whole set. If it runs unusually long / hangs, that's a signal the
  input node-id is wrong — stop and re-check the node-ids rather than
  waiting it out.

## Pipeline links

- Previous: "Design Agent Skills — 5. Gen UI Handoff" (gid
  `1217629447470466`,
  https://app.asana.com/1/1153565613997788/note/1217629447470466)
- Next: "Design Agent Skills — 7. BBL Component Library (reference)"
  (gid `1217632203697536`,
  https://app.asana.com/1/1153565613997788/note/1217632203697536)
- Index: "Design Agent Skills — Start Here" (gid `1217622307070738`,
  https://app.asana.com/1/1153565613997788/note/1217622307070738)

## Boundaries

- Never attempt to design or generate the Hi-Fi UI as part of this
  skill — if it doesn't exist yet, stop and point to skill 5 ("Gen UI
  Handoff") instead of improvising a substitute.
- Never proceed without both node-ids (UX section and UI section) — if
  either is missing, locate/confirm it first rather than guessing.
- Before swapping, check that wireframe/UI screen label (TEXT node)
  names actually match — mismatched names are the #1 documented failure
  mode and will silently fail to map screens.
- Don't touch connectors, purple diamonds, status bar, text labels, or
  endpoint nodes — only the screen content should change.
