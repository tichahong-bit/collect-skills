---
name: design-po-requirement-parser
description: >
  Convert a PO's requirement deck (.pptx / .pdf / raw text) into one
  structured .md file — feature name, Release/ADO ID, background, scope,
  Main Flows, Task Flows, New-vs-Update flag, and a UX scope summary —
  with zero added interpretation, so the UX team can start straight from
  it. This is step 1 of the Design Agent Skills pipeline; its output file
  is the direct input to step 2 (Setup Wireframe Section). Trigger:
  /design-po-requirement-parser, or attaching a requirement file and
  typing "แปลง requirement นี้" (convert this requirement), "parse ไฟล์นี้
  ให้หน่อย" (parse this file for me), "สรุป requirement จาก PO" (summarize
  the PO's requirement), "แปลง PPTX เป็น MD" (convert PPTX to MD), "เตรียม
  requirement ให้ทีม" (prepare the requirement for the team).
---

# Design PO Requirement Parser

Source: Asana page "Design Agent Skills — 1. PO Requirement Parser"
(gid `1217620217403592`,
https://app.asana.com/1/1153565613997788/note/1217620217403592).

## What it does (ทำอะไร)

Converts a requirement file from a PO (.pptx / .pdf / plain text) into one
clearly structured `.md` file, ready to hand to the UX team with no
further interpretation needed. This is the very first step of the
pipeline — its output feeds directly into step 2.

## When to use (ใช้เมื่อไหร่)

- You've just received a requirement deck from a PO and need to pass it
  on to UX.
- This page's output = the input for page 2, "Setup Wireframe Section."

## When NOT to use (ไม่ใช้เมื่อไหร่)

- When what's actually wanted is a short summary, or an opinion on how the
  thing should be designed — this skill is deliberately built to **not**
  interpret or editorialize on the requirement content.

## How to invoke (พิมพ์ว่าอะไร)

Attach the file, then type any one of:

- `แปลง requirement นี้` (convert this requirement)
- `parse ไฟล์นี้ให้หน่อย` (parse this file for me)
- `สรุป requirement จาก PO` (summarize the requirement from the PO)
- `แปลง PPTX เป็น MD` (convert PPTX to MD)
- `เตรียม requirement ให้ทีม` (prepare the requirement for the team)

## Prerequisites (ต้องมีอะไรก่อน)

- No need to have Figma open.
- The skill installs `markitdown` itself at run time.
- For how to install Claude Code + the plugin, see the page "Design Agent
  Skills — Start Here"
  (https://app.asana.com/1/1153565613997788/note/1217622307070738, gid
  `1217622307070738`).

## Output (ได้อะไรออกมา)

One `.md` file (e.g. `requirement-revolving-card.md`) containing:

- Feature name
- Release / ADO ID
- Background
- Scope
- Main Flows
- Task Flows
- A New-vs-Update classification for the work
- A scope summary for UX

## Common failure points (พังบ่อยตรงไหน)

Preserved in full from the source page — check every one of these before
trusting an output file:

- **Main Flow count must match the PO's own section breakdown exactly.**
  Whatever number of topics/sections the PO split the deck into, that's
  exactly how many Main Flows must come out — never merged, never
  renamed. If the output looks like it collapsed multiple sections into
  one, that's wrong — redo it.
- **Task Flow must be pulled verbatim from the Customer Journey section.**
  If the deck has no Customer Journey section, that field is left
  intentionally blank — go back and ask the PO, do not let the AI guess
  or fill in steps to make it look complete.
- **Anything unclear in the requirement must be marked** with
  `[⚠️ ไม่ชัดเจน — ต้องยืนยันกับ PO]` (⚠️ unclear — needs PO confirmation).
  All of these markers must be chased down and resolved before wireframe
  work starts.
- **The file must keep the requirement's original language.** Do not
  translate back and forth between Thai and English.
- **Always check New vs. Update.** An Update task must reference the
  existing screens — this check must happen every time.

## Pipeline position

- Previous: "Design Agent Skills — Start Here"
  (https://app.asana.com/1/1153565613997788/note/1217622307070738, gid
  `1217622307070738`)
- Next: "Design Agent Skills — 2. Setup Wireframe Section"
  (https://app.asana.com/1/1153565613997788/note/1217620193313424, gid
  `1217620193313424`) — consumes this skill's `.md` output directly.

## Boundaries

- Never summarize or offer a design opinion in place of the structured
  parse — that's explicitly out of scope for this skill.
- Never invent Task Flow steps when the source deck has no Customer
  Journey section — leave the field blank and flag it for the PO instead.
- Never silently merge or rename Main Flow sections to "clean up" the
  PO's structure — preserve their count and naming exactly.
- Never translate the requirement's language.
- Never skip the New-vs-Update check.
