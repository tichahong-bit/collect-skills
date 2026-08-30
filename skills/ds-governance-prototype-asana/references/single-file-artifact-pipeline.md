# When the deliverable is a single HTML file / Artifact

Read this in full before building for an Artifact target — do not improvise the pipeline from
memory, each step exists because skipping it broke a real published build.

An Artifact's CSP blocks every external host except Google Fonts — no runtime fetch of CSS/fonts/
a shadcn registry, no build step inside it. **A delivery-format constraint, not a license to
fall back to hand-authored look-alike CSS** — Step 3 still applies in full. Correct sequence:

1. Build the screen as a real Vite+React project **outside** the artifact sandbox (a scratch
   directory).
2. Install every component from the real registry (same `npx shadcn@latest add ...` as Step 3) —
   pulls in the real foundation and component code, unmodified.
3. Inline the system's web font(s) as `data:` URIs in place of the foundation's `url(...)`
   references (BBL Sans is ~14 files/~620KB as of writing — check the current foundation CSS,
   don't assume that count still holds).
4. Inline whatever components fetch at runtime rather than importing statically (e.g. CDS's `Icon`
   fetches an SVG sprite per size) — shim `window.fetch` to answer with the inlined sprite so the
   fetch resolves inside the sandbox instead of silently failing.
5. Build with `vite-plugin-singlefile` (or equivalent) so markup/styles/fonts/icons collapse into
   one file with no external references.
6. **Verify before publishing — the plugin doesn't catch everything.** It inlines built JS/CSS but
   nothing a component fetches by a *runtime* string path (icon sprite fetch, an icon mask-image
   pointing at `public/`) — invisible to it since they're computed in-browser, not imported in
   source. Grep the built HTML for the DS's font/asset hostnames and the icon base path; inline
   anything still there (a small generated data-URI map keyed only to names this build actually
   uses). `<script type="module">` doesn't need stripping — confirmed fine in-sandbox by actually
   loading the built file and checking `read_console_messages`, not by assuming a clean build log.
   Serve `dist/` with a plain local static server to preview — `file://` is blocked by browser
   automation tooling.

**A real cold-load can genuinely take 10–20+ seconds** for a full component tree plus an inlined
web font (~2MB total is normal) — expected sandboxed-iframe load, not a broken build; a quick
"wait a couple seconds, still blank" check can misread a still-loading page as a crash. Give a
fresh load real time before concluding a publish is broken. If a render failure is still
suspected, verify with a non-destructive **on-page error overlay** (`try/catch` around the root
render call + `window.addEventListener('error'/'unhandledrejection')`, writing any caught error as
visible DOM text) — browser-extension console tools only capture the top-level wrapper page's
console, not the artifact's own sandboxed iframe, so a real crash inside can read as "zero console
errors." Remove the overlay before final publish. Republishing to an artifact URL not freshly
`read` this turn can be refused ("identical content, resent unchanged") even with real new
changes — call `read` once on the target before retrying a just-refused publish.

**Two DS systems in the same project (a compare build) collide on token names unless scoped.** CDS
and MBDS each publish their own `:root {...}` block; where both use the same token name (several
do, apparently by convention not coordination) the textually-later one in the merged stylesheet
silently wins for *both* systems, since custom properties cascade regardless of which file
declared them. Fix by re-targeting each system's `:root` (and `.dark`) to a scoping class —
`.ds-cds`/`.ds-mbds` — and mounting each system's subtree inside a wrapper carrying that class.
Selector-only edit, never touch a token's value, do this before wiring the compare toggle.

**Same scoping applies even with only one system rendering** — when mode 2's project DS doesn't
cover something, Core fills the gap, but that Core component still resolves via `.ds-cds`; a
screen otherwise entirely scoped to the other system has no `.ds-cds` ancestor for it to inherit
from. Wrap just that leaf usage: `<div className="ds-cds" style={{display:'contents'}}>` — narrow
enough to give the borrowed component real CDS values without pulling the other system's own
components (rendered as children elsewhere on the same screen) into CDS's scope too.

Never skip to CSS that merely *looks like* the DS because the real pipeline is more work — that's
exactly the defect Step 3 forbids (wrong tokens under a mode switch, missing type-scale classes,
wrong font loaded). If the pipeline is genuinely infeasible for a request, say so and ask before
falling back to anything else — don't decide unilaterally that hand-authored CSS is acceptable.
