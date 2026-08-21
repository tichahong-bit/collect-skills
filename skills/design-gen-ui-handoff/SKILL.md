---
name: design-gen-ui-handoff
description: >
  Convert an approved wireframe into Hi-Fi UI screens in Figma, using only
  components and variables already linked from the design system library
  — never inventing new components, colors, or styles unless the thing
  genuinely doesn't exist in the library. Step 5 of the Design Agent
  Skills pipeline (after wireframes are approved, before Swap UI Screens
  in step 6). Enforces a Step 0 Pre-flight Gate that must never be
  skipped even on a single failing check. Trigger: "wireframe to UI",
  "convert wireframe", "สร้าง UI จาก wireframe" (create UI from
  wireframe), "ทำ UI Screen จาก Wireframe" (make a UI screen from a
  wireframe), "gen ui handoff".
---

# Design Gen UI Handoff

Source: Asana page "Design Agent Skills — 5. Gen UI Handoff" (gid
`1217629447470466`,
https://app.asana.com/1/1153565613997788/note/1217629447470466).

## What it does (ทำอะไร)

Converts wireframe screens into Hi-Fi UI screens in Figma, using
components and variables from the design system library already linked
to the file — does **not** create new components, colors, or styles,
unless that exact thing genuinely does not already exist in the library.

## When to use (ใช้เมื่อไหร่)

- The wireframe is finished and already approved, and it's time to build
  the UI.

## When NOT to use (ไม่ใช้เมื่อไหร่)

- The Hi-Fi UI is already built and you just want to move it into the
  task flow — that's page 6, "Swap UI Screens," not this skill.

## How to invoke (พิมพ์ว่าอะไร)

- `wireframe to UI` / `convert wireframe`
- `สร้าง UI จาก wireframe` (create UI from wireframe) / `ทำ UI Screen จาก
  Wireframe` (make a UI screen from a wireframe)
- `gen ui handoff`

## Prerequisites (ต้องมีอะไรก่อน)

- The file must already be linked to the DS (design system) library.
- Figma Desktop + Desktop Bridge (this skill depends on Figma Desktop
  Bridge MCP tooling — it is not usable through Figma web alone).

## Output (ได้อะไรออกมา)

Hi-Fi UI screens made purely of instances from the library, passing the
skill's own output checklist.

## Common failure points (พังบ่อยตรงไหน) — read the first one carefully

This section is preserved in full from the source page. It opens with
"อ่านข้อแรกให้ดี" (read the first item carefully) for a reason — the
first point below is the single most important caveat in this skill.

- **⚠ Step 0 Pre-flight Gate คือจุดตาย — ห้ามกดผ่าน.** ("Step 0
  Pre-flight Gate is the point of death — never click through it.")
  Nearly 100% of this skill's errors trace back to letting this gate pass
  while it was still incomplete. **If the gate reports failure on even a
  single check item, do not instruct it to continue anyway.** Fix the
  actual root cause first, then re-run the gate. This is not a soft
  recommendation — it is the one rule in this skill that must never be
  bypassed, softened, or rushed past under deadline pressure.
- If the input is not a genuine BBL wireframe (it's an outside concept
  design / mood board / external mock instead), the flow routes into
  **Branch C** — you must **confirm the component mapping before
  executing**, never click through without that confirmation.
- If the input is ambiguous, the skill will stop and ask whether it's a
  wireframe or a concept — answer clearly and unambiguously so it can
  route correctly.
- **Never use a gradient as the background for a hero or login screen**
  — that pattern is retired.
- **Use New mode only** — values from Old mode are not allowed.
- **Selection cards use Outlined, not shadow. Popovers use shadow, not
  Outlined.** Don't swap these two treatments.

## Depends on: BBL Component Library reference

This skill relies on the DS knowledge held in "Design Agent Skills — 7.
BBL Component Library (reference)" (gid `1217632203697536`) — the
component/variable source of truth this skill reads from when mapping
wireframe elements to library instances. That reference is auto-loaded
by this skill as needed; it is not meant to be invoked directly by the
user (it's likely installed locally as something like
`design-bbl-component-library`, though the exact slug may differ).

## Pipeline position

- Previous: "Design Agent Skills — 4. Wireframe Component Fixer" (gid
  `1217629447379980`,
  https://app.asana.com/1/1153565613997788/note/1217629447379980)
- Next: "Design Agent Skills — 6. Swap UI Screens" (gid
  `1217620691601447`,
  https://app.asana.com/1/1153565613997788/note/1217620691601447)
- Index: "Design Agent Skills — Start Here" (gid `1217622307070738`,
  https://app.asana.com/1/1153565613997788/note/1217622307070738)

## Boundaries

- Never let the Step 0 Pre-flight Gate pass while any check is failing —
  this is the single hard rule of this skill. Fix the root cause, don't
  override the gate.
- Never invent a new component, color, or style if an equivalent already
  exists in the linked DS library.
- Never execute a Branch C (non-wireframe input) conversion without first
  confirming the component mapping with the user.
- Never guess when input is ambiguous between "wireframe" and "concept" —
  stop and ask.
- Never use a gradient background on hero/login screens.
- Never pull values from Old mode — New mode only.
- Never swap the Outlined/shadow convention between selection cards and
  popovers.
- Do not use this skill once Hi-Fi UI already exists and the only
  remaining task is moving it into the task flow — hand off to the "Swap
  UI Screens" skill instead.
