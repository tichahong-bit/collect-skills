---
name: design-setup-wireframe-section
description: >
  First step of every wireframe job — takes the parsed requirement .md
  produced by the PO Requirement Parser and places the task flow's full
  section into the Task Flow Library file's Workspace page, either by
  cloning an existing flow wholesale (full-fidelity same-file clone) or
  by scaffolding an empty section per the Wireframe Guidelines for a new
  flow, ready for ux-wireframe-builder to fill in screens. Runs against
  Figma via the Figma Desktop Bridge MCP tools (figma-console /
  figma-bridge tool families) — requires Figma Desktop open on the Task
  Flow Library file with the Desktop Bridge plugin running. Trigger:
  "setup wireframe", "เริ่ม feature ใหม่" (start a new feature),
  "เตรียมไฟล์ wireframe" (prepare the wireframe file), "วาง task flow"
  (place/lay down the task flow), "reuse flow จาก library" / "clone flow
  เก่า" (reuse a flow from the library / clone an old flow).
---

# Design Setup Wireframe Section

Source: Asana page "Design Agent Skills — 2. Setup Wireframe Section"
(gid `1217620193313424`,
https://app.asana.com/1/1153565613997788/note/1217620193313424).

## Purpose (ทำอะไร)

The first step of every wireframe job — it takes the parsed requirement
`.md` (produced by page 1, PO Requirement Parser) and places the entire
task-flow **section** into the **Task Flow Library** file's Workspace
page.

- A flow that's already been done before = clone the existing one
  wholesale (a same-file clone preserves full fidelity — "clone ของเดิม
  มาทั้งดุ้น (same-file clone ได้ fidelity ครบ)").
- A brand-new flow = create an empty section per the Wireframe
  Guidelines, left for `ux-wireframe-builder` to come fill in the actual
  screens.

## When to use (ใช้เมื่อไหร่)

- Starting a new feature that doesn't have a section in the file yet
  (เริ่ม feature ใหม่ ยังไม่มี section ในไฟล์).
- You already have the parsed `.md` from page 1 in hand (มี parsed .md
  จากหน้า 1 อยู่ในมือแล้ว).

## When NOT to use (ไม่ใช้เมื่อไหร่)

- When you want to create the actual screens *inside* a section — that's
  page 3, UX Wireframe Builder (จะสร้างหน้าจอข้างใน section — นั่นคือ
  หน้า 3).
- When you want to work in a file other than Task Flow Library — the
  skill enforces its scope, so it cannot do this (จะทำงานในไฟล์อื่นที่
  ไม่ใช่ Task Flow Library — skill บังคับ scope ไว้ ทำให้ไม่ได้).

## What to type / trigger phrases (พิมพ์ว่าอะไร)

- `setup wireframe`
- `เริ่ม feature ใหม่` (start a new feature)
- `เตรียมไฟล์ wireframe` (prepare the wireframe file)
- `วาง task flow` (place/lay down the task flow)
- `reuse flow จาก library` / `clone flow เก่า` (reuse a flow from the
  library / clone an old flow)

## Prerequisites (ต้องมีอะไรก่อน)

- **Figma Desktop** must have the **Task Flow Library** file
  (`sHsREW41viyFqqz706ngP8`) open and left open, with the **Desktop
  Bridge plugin running**. This skill depends on Figma Desktop Bridge MCP
  tooling (the `figma-console` / `figma-bridge` tool families) — nothing
  runs without it.
- The `.md` file produced by page 1 (PO Requirement Parser).
- For MCP / Desktop Bridge install instructions, see "Design Agent
  Skills — Start Here":
  https://app.asana.com/1/1153565613997788/note/1217622307070738

## Output (ได้อะไรออกมา)

A Main Section plus sub-sections arranged in columns left-to-right
according to the scenario:

- **Linear** = 1 step per column
- **Branched** = a column can hold several sub-steps

Section color is bound to a variable — never hardcoded — and the result
passes a quality gate before being handed off.

## Common failure points (พังบ่อยตรงไหน)

This section is preserved in full — do not skip any of these:

- **Before it starts, a confirmation table appears** showing which flows
  are REUSE and which are NEW — read it completely before confirming.
  Skimming past it produces an entirely wrong set of sections (ก่อนลงมือ
  มันจะขึ้น ตารางยืนยัน ว่า flow ไหน REUSE flow ไหน NEW — อ่านให้ครบก่อน
  กดยืนยัน ถ้าปล่อยผ่านจะได้ section ผิดทั้งชุด).
- **Sub-steps per step are capped at 3** — beyond that, the flow must be
  split/broken up (Sub-step ต่อ step cap ไว้ที่ 3 เกินกว่านั้นต้องแตก
  flow).
- **If Desktop Bridge isn't open, it simply won't start** — this is not a
  bug in the skill itself (ถ้าไม่ได้เปิด Desktop Bridge มันจะไม่เริ่ม
  (ไม่ใช่ error ของ skill)).
- **It only operates on the Workspace page** — never instruct it to
  create or touch any other page (ทำงานเฉพาะหน้า Workspace เท่านั้น
  ห้ามสั่งให้ไปสร้างหน้าอื่น).

## Pipeline position

- **Previous:** "Design Agent Skills — 1. PO Requirement Parser" —
  https://app.asana.com/1/1153565613997788/note/1217620217403592
- **Next:** "Design Agent Skills — 3. UX Wireframe Builder" —
  https://app.asana.com/1/1153565613997788/note/1217620395276106
- **Index:** "Design Agent Skills — Start Here" —
  https://app.asana.com/1/1153565613997788/note/1217622307070738

## Boundaries

- Never work in any file other than the Task Flow Library
  (`sHsREW41viyFqqz706ngP8`) — scope is fixed to that file's Workspace
  page.
- Never create the actual wireframe screens inside a section here — that
  belongs to the next skill in the pipeline (UX Wireframe Builder, page
  3).
- Never proceed past the REUSE/NEW confirmation table without reading it
  in full.
- Never let a step exceed 3 sub-steps — split the flow instead.
- Never hardcode section colors — bind to a variable.
- If Figma Desktop Bridge is not running, stop and tell the user rather
  than attempting to proceed — this is an environment gap, not something
  the skill can work around.
