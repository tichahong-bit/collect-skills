---
name: design-dev-handoff-prototype
description: >
  End-to-end workflow for handing a Figma screen to a developer as a
  working, git-hosted code prototype — not a static mockup and not a zip
  file. Takes a Figma link (ideally a section literally named something
  like "hand-off to dev") plus its linked requirement doc, builds the
  screen from the team's real design-system components with the
  design-figma-to-code-verification checklist, adds real interactivity
  where the requirement calls for it, writes a README + GAPS.md, and
  pushes it to a git repository the developer can clone straight into
  their own machine. Use this whenever the user wants to "hand off",
  "ส่งงานให้เดฟ", "ส่ง handoff", or asks how to package a design for a
  developer to build from — and especially once they already have a
  Figma screen and a requirement doc in hand and want the whole pipeline
  run, not just advice. Trigger: "ทำ hand-off ให้เดฟหน่อย", "ส่ง code
  prototype ให้เดฟ", "อยากส่งงานให้เดฟแบบมี GitHub", "package this for
  dev", "build a dev handoff from this Figma + this requirement".
---

# Design → Dev Hand-off (prototype + repo)

## Where this comes from

Written after handing off the "Investment Module" screen of a Bangkok
Bank staff portal (StaffPortal_ABC) — a Figma section the file itself
named "hand-off to dev", paired with an Asana requirement doc with four
user stories. The process below is what actually got a developer
something they could clone and run, after a few rounds of the designer
pointing out that a coded screen isn't the same thing as a *working*
one.

## Inputs this needs before starting

- A Figma link. If the file has a section literally named something like
  "hand-off to dev", that's the intended scope — don't assume a smaller
  or larger boundary without checking.
- A requirement doc (Asana, Notion, wherever the team keeps it) with
  acceptance criteria. If the user gives a Figma link with no
  requirement doc, ask for one before building interactivity — the
  visual alone won't tell you what "done" means for validation rules,
  state, or button behavior.
- Confirmation of which design system / component library the code
  should use (don't assume — a team can have more than one design system
  in flight at once, and using the wrong one under the right name is
  worse than building it from scratch).

## The workflow

1. **Read the requirement doc fully before touching Figma.** Acceptance
   criteria often specify behavior a static screen can't show — a slider
   range, a validation threshold, what happens after a successful
   submit. Building from the screen alone produces a mockup with extra
   steps, not what the requirement actually asks for.
2. **Build the screen using [`design-figma-to-code-verification`](../design-figma-to-code-verification/SKILL.md).**
   Every visual value comes from the real Figma file, not a guess — that
   skill is the full checklist for this step, including the structural
   checks (component defaults, boolean props, style props that don't
   reach where you'd expect) that a values-only pass misses.
3. **Reconcile the requirement against what Figma actually shows.**
   These two sources drift — a requirement doc can ask for something the
   design was never built to show (a chart, a filter, a default value
   tied to real customer data). When they conflict, ask the user which
   one is authoritative for that point rather than inventing a resolution;
   record whichever way it's decided in GAPS.md (below) so the decision
   isn't silently lost.
4. **Add the interactivity the requirement asks for, not just what the
   static screen shows.** A progress-bar-looking element that the
   requirement calls a "slider" needs to actually respond to drag/click,
   with the validation and disabled-states the acceptance criteria
   describe (a sum that must equal 100% before a button enables, a
   single-select that visibly excludes the others, a confirmation state
   after a successful action). Match the requirement's *behavior*, and
   match Figma's *pixels* — building only one of the two isn't done.
5. **Write `README.md`**: how to run the project, and a table mapping
   each user story / acceptance-criterion group to the screen or
   component that implements it. This is what lets a developer verify
   coverage without reading every file.
6. **Write `GAPS.md`**, grouped by who owns fixing it — don't leave this
   implicit in code comments alone:
   - Requirement ↔ design conflicts (needs a product decision)
   - Things hand-built because the design system doesn't have a matching
     component yet (chart, custom interaction) — note it was checked
     against the real component registry, not assumed missing
   - Substitutions (an icon or asset that isn't published yet, using the
     closest real equivalent) — named specifically, not just "some icons
     approximate"
   - Design-system bugs found along the way that aren't this app's to
     fix (a shipped default that doesn't match what the file measures,
     with no prop to override it)
   - Open product questions the requirement doc itself flags, carried
     forward rather than silently decided one way in the code
7. **`git init`, commit, and push to a real remote** (GitHub or whatever
   the team uses) — check `gh auth status` (or equivalent) first to
   confirm there's an authenticated account before creating the repo.
   **This replaces zipping the folder, it doesn't happen alongside it** —
   a repo has version history and lets a developer open a PR against the
   work; a zip sent next to it adds nothing and confuses which one is
   authoritative.
8. **Hand off the repo link** — together with the original Figma link
   and requirement doc link, ideally in the README itself so a developer
   opening the repo has both without being sent three separate messages.

## What "done" looks like

A developer who clones the repo can run it immediately, see which user
stories are covered and where, and knows — from `GAPS.md`, not from
asking around — which parts are provisional, which are design-system
gaps that aren't this project's to fix, and which open product questions
still need an answer before this becomes real behavior.
