# Screenshot capture

Read this before opening the Browser pane. The short version: click through the prototype for real, then recover the screenshots from this session's own transcript — the tool never hands you a file directly.

## 1. Open the prototype and set the Design Direction first

Open the prototype's Artifact URL in the Browser pane. If it exposes a Design Direction toggle (see `estimation-logic.md`), find the control that opens "Prototype Settings" (often a badge in the corner labeled something like "Presentation Mode") and toggle to the target option **before** doing anything else. Every screenshot and every annotation read in the same report must come from the same toggled state — don't read annotations under one option and screenshot another by accident.

Once toggled, the Prototype Settings and Design Review panels are often floating overlays sitting on top of the screen content. If they block the view, drag them out of frame — their header usually has a small drag-handle icon; a `left_click_drag` from that handle down toward the bottom of the viewport moves the panel below the fold without closing it, leaving a clean shot of the actual screen underneath.

## 2. Navigate to each screen with real interaction

For every existing screen the report needs, and for every explicitly named state (e.g. a passcode modal's success state *and* its error state, if the Acceptance Criteria calls out both), actually drive the UI:

- `read_page` or `find` to locate the element you need if coordinates aren't obvious.
- `computer{action:"left_click", coordinate:[x,y]}` (or `ref:`) to click sidebar items, tabs, buttons.
- `computer{action:"screenshot"}` after every meaningful step to confirm you're actually looking at the state you think you are, before treating it as the "final" capture for that screen.
- For anything requiring typed input (a 6-digit passcode, a search field), click the field, then either `type` or repeated `key` presses per character — some custom input components only advance focus correctly on discrete key events, not a single fast `type` call. If a `type` call doesn't seem to register (the field still looks empty on the next screenshot), fall back to clicking the corresponding on-screen button or pressing one key at a time.

Capture both a "happy path" and an explicit error/exceptional state whenever the Acceptance Criteria names both — e.g. a passcode entered correctly vs. incorrectly. Never capture a screenshot for a screen or modal the annotation says doesn't exist — see `estimation-logic.md` for the Existing vs. Missing distinction; those get the dashed ghost placeholder in the template instead.

## 3. Recover the screenshots as real files

The Browser pane's screenshot action only returns an inline image in the tool result — there's no file path, and no separate "save this" tool. Once you've taken every screenshot you need for this report, run the bundled script to pull them all out of this session's own transcript at once, rather than trying to save each one individually as you go:

```bash
python3 <skill-dir>/scripts/extract_screenshots.py \
  --session ~/.claude/projects/<project-dir>/<session-id>.jsonl \
  --out <some-scratch-dir> \
  --crop-top 50 --resize-width 380 --quality 55
```

- Find `<project-dir>` and `<session-id>.jsonl` under `~/.claude/projects/` — it's the transcript for the session you're currently running in.
- The script walks the transcript, finds every embedded image block, dedupes identical ones (the same screenshot is often echoed twice), and writes each unique image to `<out>/raw/`, plus a cropped-and-resized copy to `<out>/processed/` if you pass `--crop-top`/`--resize-width`.
- It prints an ordered table of index / timestamp / file path. Match entries back to the screen you meant by **timestamp order**, not by guessing from a hash-based filename — read a candidate file if you're not sure which is which.
- `--crop-top 50` is tuned for this Artifact viewer's own header bar; adjust if the chrome you're cropping looks different in a screenshot.

## 4. Always downsize before embedding

Use the `processed/` output (small, cropped) in the report — never the `raw/` full-resolution shot. This isn't just tidiness: embedding full-resolution screenshots as inline base64 `<img>` tags has been observed to push a single report's HTML past ~1.3MB of inline image data, at which point the published Artifact's preview stopped responding to clicks and scroll entirely (it wasn't a CSS bug — cutting the same images down to ~140KB total fixed it immediately, no other change). `--resize-width 380 --quality 55` is a good default for a small thumbnail card; go smaller if a report has a lot of screens.

## 5. If the Browser pane stops responding

Independent of anything in your report, the Browser pane in this environment can go silently hidden or stop responding to scroll/click/screenshot mid-session. If that happens, it's almost always a pane-visibility hiccup on the host side — ask the user to reopen or focus the Browser panel and retry the same action, rather than assuming your HTML/CSS broke something. If `read_page`/`get_page_text` also come back empty right after this, the pane is probably still hidden; wait for it to be confirmed visible (`tabs_context` reports whether it's displayed) before trusting a "nothing there" result.
