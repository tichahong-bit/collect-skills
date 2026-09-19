---
name: design-figma-to-code-verification
description: >
  Verification checklist and workflow for making a coded prototype or dev
  handoff build match a Figma design exactly — not just "looks close."
  Covers pulling real values (icons, colors, copy, font style, alignment)
  straight from Figma instead of guessing them from a screenshot, plus a
  separate pass for structural mismatches a design-system component can
  introduce even when every value passed to it is correct (wrong default
  sizes, boolean/slot props left at their default, style props that don't
  reach the DOM node you think they do). Use this whenever the user asks
  to build, fix, or double-check a local/coded build against a Figma
  file — especially after they say it "doesn't match," "isn't right," or
  asks to check specific things like padding, alignment, spacing, or font
  style. Trigger: "ทำ local ให้เหมือน Figma" (make local match Figma),
  "ทำไมไม่เหมือนใน figma" (why doesn't it look like Figma), "เช็ค
  padding กับ alignment ด้วย" (check padding and alignment too), "pixel
  perfect", "match this Figma link exactly", "ห้ามเดา" (don't guess).
---

# Figma → Code Verification

## Where this comes from

Written after a real design-to-code session building a coded prototype
of a Bangkok Bank staff portal screen ("StaffPortal_ABC Dashboard") from
Figma, using the `cds-bbl` design system (published as an installable
shadcn registry). The build went through several rounds of "this doesn't
match Figma" from the designer, and each round turned up a *different
class* of bug — not the same mistake repeated. This skill exists so the
next build starts with all of those classes already covered, instead of
being caught one at a time by the person reviewing it.

## The core rule: never guess a concrete value

Icon name, color, copy, font size/weight/family, line-height, letter
spacing, text alignment — any of these is either extracted from the real
file, or it isn't written yet. Never fill one in because it "sounds
right" (an icon name that matches the menu label semantically), and never
decide a value by eyeballing a screenshot when the real data is available
another way.

**How to extract it, in order of preference:**

1. **`figma_execute`** (or equivalent Plugin-API access) — walk the node
   tree and read the actual properties: `fills` (resolve to hex),
   `characters`, `fontSize`, `fontName`, `fontWeight`, `lineHeight`,
   `letterSpacing`, `textAlignHorizontal`, and for icons, the
   `mainComponent`/`componentSet` name or a literal `icon/<slug>` layer
   name. This is ground truth — it's reading the file, not a rendering of
   it.
2. **Figma Dev Mode's "Copy as Code" export**, if the user pastes it — a
   real secondary source, though note it flattens vector icons into
   plain colored `<div>`s with no icon identity, so it can confirm colors
   and layout but not icon names.
3. A screenshot (even a high-res one) is the **last resort**, for things
   neither of the above can give you (overall visual proportion, whether
   something renders at all). Never let a screenshot override a fact
   already established by #1 or #2 — if a screenshot "looks like" a plain
   text tab but the real data says `data-style="Fill - Pill"`, the real
   data is right and the screenshot is misleading you (a white pill on a
   near-white background reads as flat at low res).

When reusing a design-system's own CSS utility class (e.g. a
`type-heading-sm-emphasized` token class) instead of writing raw values,
don't assume the class name implies the right size/weight — open the
stylesheet and check what pixel size and font-weight that class actually
resolves to, then match it against the extracted Figma value. Class names
lie less often than screenshots, but they still lie sometimes.

If a value genuinely can't be confirmed (Figma Desktop Bridge
disconnected, icon not in the published set, etc.), say so out loud
rather than filling the gap with a plausible guess. A stated gap is
useful information for the design system team; a silent guess is a bug
waiting to be found by someone else.

## The second, separate pass: structural mismatches

Getting every *value* right is necessary but not sufficient. A design
system component can render something wrong even when every prop you
gave it was correct, because of how the component itself is built. Run
this pass after the values pass, on every component the build uses:

1. **Component default sizing.** Before trusting that a component "just
   fits" the space you put it in, check its own default width/height.
   Design-system components often ship a fixed drawn size (e.g. a list
   item component drawn at a fixed width for its own documentation page)
   that's wider or taller than the real container it's meant to sit
   inside — placing it without an explicit size override then clips or
   overflows. If the component ships its own example usage (its default
   fallback children, a docs page, a Storybook story), check whether
   *that* usage overrides the size — if it does, that's a strong signal
   you need to as well.
2. **Boolean/slot prop defaults.** When a component takes a pair like
   `hasFooterContent` + `footerContent`, check the specific Figma
   instance's actual property value for that flag before deciding what to
   pass. Passing placeholder content "just in case" into a slot Figma
   explicitly turned off renders something that shouldn't be there at
   all — this is a different bug from a wrong value, and easy to miss
   because nothing about it looks like a typo.
3. **Whether a style override actually reaches the node you think it
   does.** Some components render as more than one DOM layer (an outer
   interactive/semantic wrapper plus an inner flex layout wrapper that
   actually arranges the children). A `style` prop exposed on the
   component's public API often only reaches the *outer* layer. Setting
   `alignItems: 'center'` there can silently do nothing to the actual
   child layout — and a fixed-size child (an icon) sitting next to
   variable-width text (which can *look* centered purely from inherited
   `text-align`, independent of flex alignment) is exactly the kind of
   mismatch this produces without any visible error. When you need
   control a prop doesn't expose, open the component's source once to see
   which node `style` lands on; if it's the wrong one, wrap your own
   content in a div you fully control instead of fighting the prop.
4. **Padding, gap, and axis-alignment tokens.** Pull the real
   `paddingLeft/Right/Top/Bottom`, `itemSpacing`, `primaryAxisAlignItems`,
   `counterAxisAlignItems` per container from Figma and diff them against
   both the token name used in code *and* that token's real resolved
   pixel value in the stylesheet — a component can reference a token that
   doesn't actually match what the file measures (a shipped inconsistency
   in the design system itself, not something you're free to silently
   "correct" in your own app code — flag it instead).
5. **Verify alignment by measurement, not by eye.** After a fix meant to
   align two elements, confirm it with real numbers —
   `getBoundingClientRect()` center-point comparisons in the browser (via
   a JS-eval tool), or the equivalent geometry query on the Figma side —
   not a screenshot glance. A one-hundredth-of-a-pixel match is easy to
   get and impossible to fake; "looks aligned to me" is neither.

## Reporting back

State the concrete field, value, or measurement that was wrong — not
"fixed the alignment" or "fixed the colors." Naming the actual cause (a
366px hardcoded default width against a 312px container; a `false`
boolean prop that was never set; two measured center-points that differ
by 12px) is what lets the person reviewing trust the fix without
re-checking it themselves, and it's what made each of these bugs findable
in the first place.
