---
name: design-ux-wireframe-builder
description: >
  Takes a parsed requirement .md and builds a full wireframe inside an
  already-placed Figma section, per BBL Wireframe Guidelines — screens,
  decision diamonds, arrows, and annotations — and includes a Wireflow
  Layout Mode for evenly re-spacing screens/diamonds that already exist.
  Requires Figma Desktop + the Desktop Bridge plugin running, and
  auto-loads the BBL Component Library reference skill for design-system
  knowledge (not called directly by the user). Trigger:
  /design-ux-wireframe-builder, "สร้าง wireframe" / "create wireframe",
  "wireframe จาก requirement" / "wireframe from requirement", "แปลง
  requirement เป็น wireframe" / "convert requirement to wireframe", "สร้าง
  wireflow" / "create wireflow", "จัดวาง wireflow" / "arrange wireflow",
  "จัดระยะห่าง wireframe" / "space out wireframe", "เรียง screens ใหม่" /
  "rearrange screens".
---

# Design UX Wireframe Builder

Source: Asana page "Design Agent Skills — 3. UX Wireframe Builder"
(gid `1217620395276106`,
https://app.asana.com/1/1153565613997788/note/1217620395276106), part of
the "Design Agent Skills" pipeline (Start Here: gid `1217622307070738`,
https://app.asana.com/1/1153565613997788/note/1217622307070738).

Pipeline position: step 3. Comes after step 2, **"Setup Wireframe
Section"** (gid `1217620193313424`,
https://app.asana.com/1/1153565613997788/note/1217620193313424), which is
where the section itself gets placed in the file. Feeds into step 4,
**"Wireframe Component Fixer"** (gid `1217629447379980`,
https://app.asana.com/1/1153565613997788/note/1217629447379980), which is
where you go instead if the job is fixing a misused existing component
rather than building new screens.

## ทำอะไร — What it does

Takes a parsed requirement `.md` file and builds the wireframe in Figma
per BBL Wireframe Guidelines, end to end — sections, screens, diamonds,
arrows, annotations, all filled in.

Also includes a **Wireflow Layout Mode**: a mode for arranging existing
screens + diamonds with even, clean spacing (ระยะห่างเท่ากันสวยงาม —
uniform, tidy spacing) without necessarily building new content.

## ใช้เมื่อไหร่ — When to use

- A section has already been placed (from step 2 / page 2 in the
  pipeline) and needs screens filled in inside it.
- You want to re-arrange / re-space screens that already exist.

## ไม่ใช้เมื่อไหร่ — When NOT to use

- There is no section in the file yet — go to page 2 ("Setup Wireframe
  Section") first.
- The job is fixing an old/existing component that's being used
  incorrectly — go to page 4 ("Wireframe Component Fixer") instead.

## พิมพ์ว่าอะไร — What to type / trigger phrases

The page doesn't state an explicit `/slash-command` — these are the
natural-language Thai trigger phrases it lists:

- `สร้าง wireframe` / `wireframe จาก requirement` (create a wireframe /
  wireframe from a requirement)
- `แปลง requirement เป็น wireframe` (convert a requirement into a
  wireframe)
- `สร้าง wireflow` / `จัดวาง wireflow` (create a wireflow / arrange a
  wireflow)
- `จัดระยะห่าง wireframe` / `เรียง screens ใหม่` (space out a wireframe /
  rearrange screens)

This skill file's own `name:` (`design-ux-wireframe-builder`, exposed as
`/design-ux-wireframe-builder`) was derived from the page title since no
explicit command was given.

## ต้องมีอะไรก่อน — Prerequisites

- Figma Desktop with the Desktop Bridge plugin running.
- The `.md` file produced by step 1 of the pipeline.
- **Before scanning anything**, the skill must announce the list of files
  that need to be opened first — the Task Flow Library, the destination
  file, and a reference file if one applies — and then **wait for the
  user to confirm** those files are open before proceeding. This is not
  optional (see failure points below).

## ได้อะไรออกมา — Output

Wireframe screens complete with diamonds, arrows, and annotations, built
to whatever guidelines are defined in the destination file.

## พังบ่อยตรงไหน — Common failure points (preserve in full — do not skip)

- **When the skill asks you to open all the required files and wait for
  confirmation — do not skip that step.** If it's left to hunt for the
  files itself instead, it burns a large amount of token budget doing so
  (จะเผา token ทิ้งเยอะมาก). Always get explicit confirmation that the
  Task Flow Library, destination file, and any reference file are open
  before scanning proceeds.
- **Connectors between screens must be dragged by hand.** The skill
  handles layout/arrangement, but it does **not** draw the connectors
  between screens — that's a manual step every time.
- **It auto-loads the BBL Component Library reference** — "Design Agent
  Skills — 7. BBL Component Library (reference)" (gid `1217632203697536`,
  https://app.asana.com/1/1153565613997788/note/1217632203697536) — for
  design-system knowledge. This happens automatically as part of running
  this skill; **do not call that reference skill directly yourself.**

## Boundaries

- Don't attempt to build wireframe screens into a file that has no
  section placed yet — send the user to the "Setup Wireframe Section"
  skill/page first.
- Don't use this skill to fix a misused existing component — that's the
  "Wireframe Component Fixer" skill/page (step 4).
- Don't skip the confirm-files-are-open step, even under time pressure —
  it's the single biggest token-burn risk called out on the source page.
- Don't draw connector arrows automatically and claim the wireframe is
  "done" — connectors are a manual, human step; say so if asked whether
  the wireframe is complete.
- Don't call the BBL Component Library reference skill directly — it
  loads on its own as part of this skill's flow.
- This skill depends on Figma Desktop + Desktop Bridge MCP tooling being
  connected; if it isn't running, stop and ask the user to start it
  rather than guessing at file state.
