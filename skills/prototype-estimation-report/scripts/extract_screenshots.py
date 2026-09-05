#!/usr/bin/env python3
"""
Recover Browser-pane screenshots as real files.

Why this exists: the Browser pane's computer{action:"screenshot"} tool never
returns a file path — the image only round-trips as an inline base64 block in
the tool result. The only way to turn a screenshot you already took into a
file on disk is to pull it back out of this session's own transcript, where
the harness logs every tool result verbatim (including images).

Usage:
    python3 extract_screenshots.py --session <path-to-session.jsonl> --out <dir>
    python3 extract_screenshots.py --session <path-to-session.jsonl> --out <dir> \
        --crop-top 50 --resize-width 380 --quality 55

What it does:
    1. Walks the transcript line by line (each line is one JSON message).
    2. Recursively finds every content block shaped like
       {"type": "image", "source": {"data": "<base64>", "media_type": "..."}}.
    3. Dedupes by a hash of the base64 payload — the same screenshot is
       usually echoed 2x (once in the tool_result, once in the assistant's
       own transcript copy), and you don't want two files for one shot.
    4. Saves each unique image to <out>/raw/<index>_<hash10>.<ext>, and
       prints a table of index / filename / timestamp / byte size in the
       order they were captured.
    5. If --crop-top and/or --resize-width are given, also writes a
       processed copy to <out>/processed/ with the same filename: crops the
       artifact-viewer chrome bar off the top, then downscales to a small
       thumbnail. ALWAYS do this before embedding screenshots in a report —
       embedding full-resolution shots as inline base64 can bloat one HTML
       report to 1MB+ of inline image data, which has been observed to make
       the published Artifact's preview pane hang and stop responding to
       clicks/scroll entirely. A processed set at ~380px wide / quality 55
       keeps a report with a dozen screenshots under ~150KB total.

Matching a saved file back to the screen you meant to capture is on you:
the printed timestamps are in the same order you took the screenshots, so
read them alongside the list of actions you just ran (sidebar click, tab
click, passcode entry, ...) rather than guessing from the filename alone.
Open a few candidates with the Read tool if you're not sure.
"""

import argparse
import base64
import hashlib
import json
import os
import sys


def iter_json_lines(path):
    with open(path, encoding="utf-8") as f:
        for lineno, line in enumerate(f):
            line = line.strip()
            if not line:
                continue
            try:
                yield lineno, json.loads(line)
            except json.JSONDecodeError:
                continue


def find_images(obj, results, seen_hashes, top_level_ts):
    if isinstance(obj, dict):
        if (
            obj.get("type") == "image"
            and isinstance(obj.get("source"), dict)
            and obj["source"].get("data")
        ):
            data = obj["source"]["data"]
            media_type = obj["source"].get("media_type", "image/jpeg")
            h = hashlib.sha1(data.encode()).hexdigest()[:10]
            if h not in seen_hashes:
                seen_hashes.add(h)
                ext = "jpg" if "jpeg" in media_type else media_type.split("/")[-1]
                results.append(
                    {
                        "hash": h,
                        "data": data,
                        "ext": ext,
                        "timestamp": top_level_ts,
                        "bytes": len(data) * 3 // 4,
                    }
                )
        for v in obj.values():
            find_images(v, results, seen_hashes, top_level_ts)
    elif isinstance(obj, list):
        for v in obj:
            find_images(v, results, seen_hashes, top_level_ts)


def extract(session_path, out_dir):
    results = []
    seen = set()
    for _lineno, msg in iter_json_lines(session_path):
        ts = msg.get("timestamp") if isinstance(msg, dict) else None
        find_images(msg, results, seen, ts)

    raw_dir = os.path.join(out_dir, "raw")
    os.makedirs(raw_dir, exist_ok=True)

    manifest = []
    for i, item in enumerate(results):
        fn = f"{i:02d}_{item['hash']}.{item['ext']}"
        path = os.path.join(raw_dir, fn)
        with open(path, "wb") as out:
            out.write(base64.b64decode(item["data"]))
        manifest.append(
            {"index": i, "file": path, "timestamp": item["timestamp"], "bytes": item["bytes"]}
        )
    return manifest


def process(manifest, out_dir, crop_top, resize_width, quality):
    try:
        from PIL import Image
    except ImportError:
        print(
            "PIL/Pillow not installed — skipping crop/resize. "
            "Install it (pip install pillow) to enable --crop-top/--resize-width.",
            file=sys.stderr,
        )
        return

    processed_dir = os.path.join(out_dir, "processed")
    os.makedirs(processed_dir, exist_ok=True)

    for entry in manifest:
        im = Image.open(entry["file"]).convert("RGB")
        w, h = im.size
        if crop_top:
            im = im.crop((0, min(crop_top, h - 1), w, h))
        if resize_width and im.size[0] > resize_width:
            new_h = int(im.size[1] * resize_width / im.size[0])
            im = im.resize((resize_width, new_h), Image.LANCZOS)
        out_path = os.path.join(processed_dir, os.path.basename(entry["file"]))
        im.save(out_path, quality=quality, optimize=True)
        entry["processed_file"] = out_path
        entry["processed_bytes"] = os.path.getsize(out_path)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--session", required=True, help="Path to this session's transcript .jsonl")
    p.add_argument("--out", required=True, help="Directory to write raw/ (and processed/) into")
    p.add_argument("--crop-top", type=int, default=0, help="Pixels to crop off the top of every image (e.g. 50 for the artifact-viewer chrome bar)")
    p.add_argument("--resize-width", type=int, default=0, help="Downscale to this width in px, preserving aspect ratio (e.g. 380 for a report thumbnail)")
    p.add_argument("--quality", type=int, default=55, help="JPEG quality for the processed copies (default 55)")
    args = p.parse_args()

    manifest = extract(args.session, args.out)
    if not manifest:
        print("No embedded images found in that transcript.", file=sys.stderr)
        sys.exit(1)

    if args.crop_top or args.resize_width:
        process(manifest, args.out, args.crop_top, args.resize_width, args.quality)

    print(f"{len(manifest)} unique screenshot(s) extracted, in capture order:\n")
    for e in manifest:
        line = f"  [{e['index']:02d}] {e['timestamp'] or '(no timestamp)'}  {e['file']}  ({e['bytes']} bytes)"
        if "processed_file" in e:
            line += f"\n       -> {e['processed_file']} ({e['processed_bytes']} bytes)"
        print(line)


if __name__ == "__main__":
    main()
