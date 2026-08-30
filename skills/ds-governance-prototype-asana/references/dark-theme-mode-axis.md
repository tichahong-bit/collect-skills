# Dark theme (and other real DS mode axes with the same trap)

Read this in full before touching dark mode on any screen — do not rely on memory of these rules,
each one was earned from a real, measured defect.

Dark mode is a real, requestable mode axis in CDS/MBDS/webds — a genuine `[data-theme='dark']`
token block from the DS's own Figma modes, not a cosmetic filter. Apply `data-theme` at the
**true root** of the rendered tree — a narrower scope leaves anything outside it (shared
background, status bar) resolving the wrong theme while everything inside looks right (a real
WCAG failure found this way: white-on-near-white, 1.09:1).

**The "-inverse" flip trap.** A token named with "inverse" (e.g.
`surface-neutral-primary-inverse`) can deliberately mean *the opposite of whichever theme is
active* — dark navy in light mode, near-white in dark mode, by design. Correct CDS behavior — the
bug is code assuming that surface stays dark forever and hardcoding a matching
`rgba(255,255,255,X)` text/border color instead of reading the token's own paired `-inverse`
content/border family (`content-neutral-primary-inverse`, etc.), which flips in lockstep and stays
correctly paired in both themes. Grep for hardcoded `rgba(255,255,255,`/`rgba(0,0,0,` near any
`-inverse` surface token before calling dark mode done.

**The fixed-light-surface trap — more common.** CDS's `surface-accent-*` and
`surface-{positive,negative,warning}-primary` tokens stay a fixed light pastel in **both** themes.
The `content-{success,danger,warning,brand,accent-*}` tokens that look like their natural pairing
actually **flip lighter** under dark theme (built for the app's own dark canvas, not these
always-light tinted cards) — naive pairing turns "readable dark text on pale card" into "pale on
pale," often under 2:1. Use the correct non-flipping pair instead:

| Fixed-light surface | Use this content token |
|---|---|
| `surface-accent-blue` | `content-accent-on-accent-blue` |
| `surface-accent-green` | `content-accent-on-accent-green` |
| `surface-accent-red` | `content-accent-on-accent-red` |
| `surface-accent-purple` | `content-accent-on-accent-purple` |
| `surface-accent-yellow` | `content-accent-on-accent-yellow` |
| `surface-accent-orange` | `content-accent-on-accent-orange` |
| `surface-positive-primary` | `content-positive-on-positive-primary` |
| `surface-negative-primary` | `content-negative-on-negative-primary` |
| `surface-warning-primary` | `content-warning-on-warning-primary` |

**Systemic, not a one-off** — one build had this recur in 8+ unrelated files (sidebar nav,
dashboard cards, a passcode-error state, a stat-card row, a tone-pill component) once actually
swept for, after the first instance was fixed in isolation and reported done. Fixing the one
instance you were told about ≠ fixing the class of bug — before calling dark mode done, grep every
file for `surface-accent-`/`surface-{positive,negative,warning}-primary` and check the paired
content token on each result.

**A shared component's color variant can be correct in one usage and wrong in another,
simultaneously.** A `Tab`'s "On Neutral Primary Inverse" variant has a correct, non-flipping
SELECTED pair — but its UNSELECTED label reads from the generic flipping
`content-neutral-primary-inverse`, correct only when the tab bar sits on a surface that itself
flips with theme. The same variant on an *ordinary* dark surface (dark because the theme is dark,
not because it's inverse-flipping) gets SELECTED right and UNSELECTED wrong — while a blanket fix
applied everywhere breaks the first, correct usage. Scope a targeted override precisely (a
dedicated class at only the call sites that need it), verify it doesn't regress an
already-correct usage elsewhere, and measure both states' actual computed contrast before/after —
never fix by guessing.

**Standing verification.** After touching dark mode, run a real computed-contrast sweep — inject a
WCAG relative-luminance checker (`getComputedStyle` on every visible text node, walk to the actual
effective background, compute the real ratio, flag under 4.5:1 normal / 3:1 large text) across
every screen and every dimension-switcher state, not just the screen that prompted the fix — a
component can pass on one screen and fail the identical pairing on another because the two sit on
differently-behaving surfaces. Treat SVG `<text>` specially — its color comes from `fill`, not CSS
`color`; a scanner reading `color` on SVG text reports a false positive.
