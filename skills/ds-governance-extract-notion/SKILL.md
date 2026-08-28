---
name: ds-governance-extract-notion
version: 0.1.1
description: PROPOSAL, UNTESTED — extracts a non-Figma prototype (e.g. an HTML/web prototype from ds-governance-prototype-notion) into real Figma frames on the target file, binding each screen to the Design System as it's built and annotating anything the DS doesn't cover yet. Composes the generic figma-generate-design skill with โย's (Yo's) ui-designer/figma-ds-consumer skills and borrows ds-governance-audit-notion's own annotation format for the "missing" case. Second step of the wider Requirement → Applied workflow, between ds-governance-prototype-notion and manual UX/BA wireframing. This is the riskiest composed step in the whole workflow — three differently-owned skills chained together, never run end to end.
---

# Extract Agent (proposal — composed from existing tools, never run end to end)

> **Status: proposal, not yet verified working — highest risk in the whole Requirement →
> Applied chain.** This composes a generic Figma-MCP skill (`figma-generate-design`, not owned
> by anyone on this team) with two of โย's (Yo's) `cds-consumer` skills, and borrows an
> annotation convention from a third skill (`ds-governance-audit-notion`) that was never
> designed with this use case in mind. Treat every step as a hypothesis. The first real run
> should be watched closely and this file corrected from what actually happens.

## Expected input

- **Prototype source** (required) — a link to, or file for, the prototype to extract (typically
  `ds-governance-prototype-notion`'s output, but any non-Figma prototype works in principle).
- **Target Figma file** (required) — the Figma file screens should be placed into.
- **Design system project** (optional, but ask if missing) — link to the Core or Project DS
  library to bind against. Without this, Step 2's bind pass has nothing to bind to.

## Prerequisites

- Load `figma-generate-design` (the generic Figma-MCP skill covering "translate an app page or
  layout into Figma") — this is not owned by กัน, โย, or กร, it's part of the standard Figma
  toolset available in this environment.
- Load โย's `figma-build` **before** Step 2 — per โย's own skills README, this is the mandatory
  companion for any build/edit/token-binding work, and both `figma-ds-consumer` and `ui-designer`
  are documented as loading it themselves. An earlier version of this file listed the other two
  skills as prerequisites without this one — fixed in a self-review pass, 2026-08-16.
- Confirm โย's `ui-designer` and `figma-ds-consumer` skills are loaded — this skill only
  orchestrates them for the binding pass (Step 2), it does not reimplement DS-binding logic.
- Read `ds-governance-audit-notion`'s Step 9 annotation format (category **"Log Note"**,
  yellow, bold-title + bullets) before Step 3 below — the annotation this skill writes for a
  missing component must match that convention exactly, not invent a new one. Two different
  annotation styles in the same file is the single biggest way this proposal could go wrong in
  practice — don't let it happen.

## Step 1 — Translate the prototype into real Figma frames

Run `figma-generate-design` against the Prototype source, targeting the Target Figma file. This
is a structural translation only at this stage — layout, hierarchy, content — not a DS-binding
pass yet (that's Step 2, deliberately separate so a failure in one doesn't silently corrupt the
other).

## Step 2 — Bind to the Design System (โย's skills)

For each frame Step 1 produced:

1. Run `figma-ds-consumer` to discover and bind real components/tokens by name against the
   Design system project link, wherever a match exists.
2. Run `ui-designer` for composition judgment on anything `figma-ds-consumer` didn't resolve on
   its own (which layer should assemble from what, per โย's own skill contract).

**Component genuinely not in the DS** → do not silently leave a raw/hand-built layer. Go to
Step 3 and annotate it, same as `ds-governance-audit-notion` would if it found this during a
later audit — the point of doing it here is to catch it *before* handoff, not duplicate work
after.

## Step 3 — Annotate what's missing (borrowed format, not a new one)

For every frame/layer Step 2 couldn't bind to a real DS component, write a Figma annotation using
`ds-governance-audit-notion`'s own Step 9 convention exactly:

```markdown
**Log Note**
- **Component:** {what this layer is trying to be}
- **Problem:** not available in the Design System yet
- **Note:** extracted from prototype as a placeholder — needs a real component before hand-off
```

Category **"Log Note"** (yellow) — same category audit-notion uses for an Existing DS Issue, not
a new category. This intentionally does **not** create a Notion row — that's still
`ds-governance-audit-notion`'s job later in the chain (Step 6, Design System Gap), once wireframe
and binding are both actually done. Writing a row here would be premature and would double-count
against what the later real audit finds.

## Final chat summary

- Frames created in the target Figma file, with links.
- Per frame: how many layers bound successfully to a real DS component vs. got a Step 3
  annotation.
- Anything Step 1's translation produced that looks structurally wrong (this is the step most
  likely to misbehave — say so plainly if the output looks off, don't paper over it).
- Same standing note as `ds-governance-prototype-notion`: this is a proposal-status skill, invite
  correction from how this run actually went.

## Out of scope for this skill

- Building the prototype itself — that's `ds-governance-prototype-notion`, the step before this
  one.
- Collecting additional cases / completing the wireframe set beyond what the prototype already
  covers — that's a manual UX+BA step after this one, not this skill's job.
- Auditing the result against the DS with full classification (Existing DS Issue vs. Gap,
  DRIFT.md checks, Context Knowledge growth) — that's `ds-governance-audit-notion`, run later
  after UI Designer binding and manual adjustment (see the workflow page this skill was proposed
  on).
- Creating any row in 📋 Component issue — see Step 3, this skill never writes to that database.
