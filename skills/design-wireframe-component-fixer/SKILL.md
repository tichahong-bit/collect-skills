---
name: design-wireframe-component-fixer
description: >
  Scan wireframe sections in a Figma file for old/non-conforming nodes — a
  raw Ellipse standing in for a warp/loading connector, instances of
  components that predate the current Wireframe Guidelines library,
  overflowing text, fills not bound to a variable — and replace them with
  the correct library component: fill bound to a library variable, label
  text filled in, resized to fit. This is step 4 of the Design Agent
  Skills pipeline (after "3. UX Wireframe Builder", before "5. Gen UI
  Handoff"). Must be invoked through ux-agent, not called directly — see
  Prerequisites. Trigger: /design-wireframe-component-fixer, "แก้
  component wireframe" (fix wireframe component) / "swap component เก่า"
  (swap out the old component), "แก้ ellipse เป็น warp" (fix the ellipse
  into a warp) / "ใส่ warp ให้ครบ" (fill in the missing warp indicators),
  "component ไม่ตรง guideline" (component doesn't match the guideline) /
  "ยังใช้ component เก่าอยู่" (still using the old component), "text ล้น"
  (text overflowing) / "text overflow ใน node" (text overflow in a node).
---

# Design Wireframe Component Fixer

Source: Asana page "Design Agent Skills — 4. Wireframe Component Fixer"
(gid `1217629447379980`,
https://app.asana.com/1/1153565613997788/note/1217629447379980), part of
the Design Agent Skills pipeline. Previous step: "3. UX Wireframe Builder"
(gid `1217620395276106`). Next step: "5. Gen UI Handoff" (gid
`1217629447470466`). Pipeline index: "Design Agent Skills — Start Here"
(gid `1217622307070738`).

## What it does (ทำอะไร)

Scans wireframe sections in Figma for old elements — a raw Ellipse used in
place of a warp connector, or instances from an old component that don't
come from the current Wireframe Guidelines library — then replaces them
with the correct library component: bind the fill to the library
variable, fill in the text label, and resize it to fit.

## When to use (ใช้เมื่อไหร่)

- Old files made before the current guidelines existed.
- QA found a node that doesn't match the library, or text overflowing its
  frame.

## When NOT to use (ไม่ใช้เมื่อไหร่)

- Building a **new** wireframe from scratch — that's step 3, "UX
  Wireframe Builder" (gid `1217620395276106`), not this skill.

## How to invoke it (พิมพ์ว่าอะไร)

Slash command: `/design-wireframe-component-fixer`

Natural-language triggers from the source page (Thai, with English
gloss):

- `แก้ component wireframe` (fix wireframe component) / `swap component
  เก่า` (swap out the old component)
- `แก้ ellipse เป็น warp` (fix the ellipse into a warp) / `ใส่ warp ให้
  ครบ` (fill in warp indicators so they're all there)
- `component ไม่ตรง guideline` (component doesn't match the guideline) /
  `ยังใช้ component เก่าอยู่` (still using the old component)
- `text ล้น` (text overflowing) / `text overflow ใน node` (text overflow
  in a node)

## Prerequisites (ต้องมีอะไรก่อน)

- **Figma Desktop + Desktop Bridge** — this skill needs the Figma Desktop
  Bridge MCP tooling (the `mcp__figma-bridge__*` / `mcp__figma-console__*`
  tool set) to inspect and edit nodes; it is not usable against Figma web
  alone.
- **Do not call this skill directly** (อย่าเรียก skill นี้ตรงๆ) — route
  through **ux-agent** first. ux-agent needs to do a pre-flight context
  check before this runs, and once the fix is done, ux-agent is
  responsible for handing the finished work off to **Design Ops QA**.
  Calling this skill standalone skips both of those steps.

## Output (ได้อะไรออกมา)

Nodes that fully match the Wireframe Guidelines library: fill bound to a
library variable, and labels complete (no missing/placeholder text).

## Common failure points (พังบ่อยตรงไหน) — read before running

These are called out explicitly on the source page as the places this
skill breaks in practice. Do not skip or summarize these away:

1. **If scope exceeds 10 nodes, it will ask for a label list** (ถ้า scope
   เกิน 10 nodes มันจะถามหา label list) — have the label list ready to
   paste in directly; that is faster and cheaper than letting it scan for
   labels itself.
2. **If there's a reference section in the same file, give the node ID
   directly** (ถ้ามี reference section อยู่ในไฟล์เดียวกัน ให้ node ID ไป
   ตรงๆ) — don't let it search for the reference section on its own.
3. **Auto-detect is not 100% accurate** (auto-detect ไม่ได้แม่น 100%) —
   which component it picks as "correct" is driven by the node's
   **text**. If the text is ambiguous, it will pick the wrong component.
   **Check the pick before approving.**
4. **Always confirm scope before running** (ยืนยันขอบเขตทุกครั้งว่าจะแก้
   section ไหน) — confirm which section is being fixed, not the whole
   file.

## Boundaries

- Never invoke this skill directly on a user's ad hoc request without
  going through ux-agent's pre-flight check first (see Prerequisites).
- Never let the skill silently guess at a reference section's node — ask
  for or supply the node ID explicitly when a reference section exists in
  the same file.
- Never approve an auto-detected component swap without checking it
  against the node's text first — ambiguous text is a known source of
  wrong picks.
- Never widen scope past the section the user confirmed — reconfirm scope
  every time rather than assuming "the whole file" is fair game.
- Not for creating new wireframes — redirect to the "UX Wireframe
  Builder" step instead.
