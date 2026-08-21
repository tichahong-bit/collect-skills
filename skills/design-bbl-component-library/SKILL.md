---
name: design-bbl-component-library
description: >
  Central reference skill for BBL's Design System — combines knowledge of
  all 5 libraries (Component, Template, Illustration & Assets, Icon,
  Foundation) in one place: component keys, variant counts, when-to-use
  rules, and design tokens. Normally NOT called directly — sibling skills
  "3. UX Wireframe Builder" (design-ux-wireframe-builder) and "5. Gen UI
  Handoff" auto-load it for design-system knowledge whenever they touch
  BBL UI. Invoke it directly only when someone wants a direct answer on
  which component/icon/template to use, or what a token's value is — not
  as part of building or fixing a wireframe. Trigger: direct questions
  like "which component should I use for X" / "ใช้ component ไหนดี",
  "BBL icon" / "BBL illustration" / "BBL template", "BBL token" /
  "typography" / "spacing" / "color palette". No explicit slash command
  is stated on the source page; this skill exposes
  /design-bbl-component-library by convention.
---

# Design BBL Component Library (reference)

Source: Asana page "Design Agent Skills — 7. BBL Component Library
(reference)" (gid `1217632203697536`,
https://app.asana.com/1/1153565613997788/note/1217632203697536), part of
the "Design Agent Skills" pipeline (Start Here: gid `1217622307070738`,
https://app.asana.com/1/1153565613997788/note/1217622307070738). Created
by Pakorn Proyrungroj; page last modified 2026-08-19.

Previous page in the pipeline list: "6. Swap UI Screens" (gid
`1217620691601447`,
https://app.asana.com/1/1153565613997788/note/1217620691601447). This is
the last page (7) in the numbered list, but it is not a pipeline "step" —
it's the reference the other steps pull from.

**Note on scope of this file:** the source Asana page describes this
skill's *purpose and operating rules* — it names the 5 libraries and says
what kind of facts they hold (component keys, variant counts,
when-to-use rules, design tokens) — but it does **not** itself enumerate
the actual component names or token values. Those live in the real
Figma design-system files. This skill's job is to go get them from
there (via the `figma-console` / `figma-bridge` MCP tools) using the
structure and caveats below, never to guess or fabricate them.

## ทำอะไร — What it does

Acts as BBL Design System's central reference skill, unifying knowledge
from all 5 libraries into one place:

1. 💠 **Component Library**
2. 📗 **Template Library**
3. 🎨 **Illustration & Assets Library**
4. 🍀 **Icon Library**
5. 🧱 **Foundation**

For each, it can surface: component key, variant count, when-to-use
rules, and design tokens (typography, spacing, color palette, etc.).

## ใช้เมื่อไหร่ — When to use

- Any work that touches BBL UI — **but normally you don't call this
  yourself.** The other skills in this pipeline, especially:
  - "Design Agent Skills — 3. UX Wireframe Builder" (gid
    `1217620395276106`,
    https://app.asana.com/1/1153565613997788/note/1217620395276106 —
    local skill: `design-ux-wireframe-builder`)
  - "Design Agent Skills — 5. Gen UI Handoff" (gid `1217629447470466`,
    https://app.asana.com/1/1153565613997788/note/1217629447470466)

  auto-load this skill for you as part of their own flow.
- Call it directly only when someone wants a direct answer to "which
  component should I use" or "what's this token's value" — a lookup
  question, not a build/fix task.

## ไม่ใช้เมื่อไหร่ — When NOT to use

- Don't call it yourself while already running "3. UX Wireframe Builder"
  or "5. Gen UI Handoff" — they load it automatically; a manual call on
  top of that is redundant.
- Don't use it to actually place/build UI — it answers "which
  component/token," it doesn't do the placing (that needs Figma Desktop
  + Desktop Bridge, see Prerequisites).

## พิมพ์ว่าอะไร — What to type / trigger phrases

No explicit `/slash-command` is stated on the source page. This skill
file's own `name:` (`design-bbl-component-library`) was derived from the
page title per the batch's fallback convention.

Natural-language triggers from the source page (Thai, with English
gloss):

- `ใช้ component ไหนดี` (which component is good to use) / `which
  component`
- `BBL icon` / `BBL illustration` / `BBL template`
- `BBL token` / `typography` / `spacing` / `color palette`

## ต้องมีอะไรก่อน — Prerequisites

- **Don't need Figma open just to ask a question** (ไม่ต้องเปิด Figma ถ้า
  แค่ถามข้อมูล) — a lookup/reference answer doesn't require the file to
  be open.
- **Do need Figma Desktop + Desktop Bridge** if the answer needs to
  result in actually placing a component (ถ้าจะให้วาง component จริงต้องมี
  Figma Desktop + Desktop Bridge).

## ได้อะไรออกมา — Output

An answer naming the specific component/icon/template to use, together
with its **key** and the **reasoning** for the pick — not a guess.

## พังบ่อยตรงไหน — Common failure points (preserve in full — do not skip)

1. **Components marked "⚠️ To be retired" exist** (มี component ที่ mark
   ⚠️ To be retired) — check for this mark before picking a component for
   new work; don't hand out a retiring component as the recommended
   answer.
2. **Components marked "🔄 has slotting variant" exist** (มี component ที่
   mark 🔄 has slotting variant) — if this isn't checked, the risk is
   manually re-assembling something the Design System already provides
   as a ready-made slotting variant.
3. **Always check the component's version before it gets placed** (ดู
   version ของ component ก่อนวางเสมอ) — an old version and a new version
   of "the same" component do not carry the same values; don't treat
   them as interchangeable.
4. **If an answer came from guessing rather than the actual library, say
   so and get it confirmed against the real thing** (ถ้าคำตอบมาจากการเดา
   ไม่ใช่จากไลบรารีจริง ให้สั่งให้เปิดของจริงมายืนยัน) — never present a
   guessed component key or token value as if it were confirmed from the
   live library.

## Boundaries

- Never fabricate a component key, variant count, or token value — pull
  it from the real Figma design-system files (via the `figma-console` /
  `figma-bridge` MCP tool families: e.g. `figma_search_components`,
  `figma_get_library_components`, `figma_get_library_variables`,
  `figma_get_design_system_kit`, `figma_get_variables`,
  `figma_get_token_values`) rather than from memory or pattern-matching
  on the name alone.
- Never recommend a component marked "⚠️ To be retired" for new work
  without flagging that mark to the requester.
- Never silently skip checking for a "🔄 has slotting variant" — recommend
  the slotting variant instead of telling someone to hand-assemble the
  equivalent.
- Never treat two versions of the same component as equivalent — always
  check version before an answer is used to place something.
- If the answer you're about to give is a guess rather than something
  confirmed against the live library file, say so explicitly and prompt
  for the real file to be opened/confirmed — don't present a guess as a
  verified fact.
- Don't call this skill yourself mid-flow while "3. UX Wireframe Builder"
  or "5. Gen UI Handoff" are already running — they auto-load it; call it
  directly only for standalone lookup questions.
