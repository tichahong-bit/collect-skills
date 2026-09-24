#!/usr/bin/env node
// Builds Figma-importable design tokens (W3C DTCG JSON) and a component map
// from the open-source SGDS web component package (@govtechsg/sgds-web-component, MIT).
//
// Usage:
//   node scripts/build-tokens.mjs [path/to/extracted/package]
// With no path, the pinned version is fetched with `npm pack` into a temp dir.

import { execSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SGDS_VERSION = "3.29.0";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REM = 16;

function fetchPackage() {
  const dir = mkdtempSync(join(tmpdir(), "sgds-"));
  execSync(`npm pack @govtechsg/sgds-web-component@${SGDS_VERSION} --silent`, { cwd: dir, stdio: "pipe" });
  execSync(`tar xzf *.tgz`, { cwd: dir, shell: "/bin/bash" });
  return join(dir, "package");
}

const pkg = process.argv[2] ?? fetchPackage();
const read = (f) => readFileSync(join(pkg, f), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

// ---------- CSS parsing ----------
// Returns { base: {name: value}, media: { "1024": {...}, "1440": {...} } }
function parseCss(css) {
  const out = { base: {}, media: {} };
  const decls = (block, into) => {
    for (const m of block.matchAll(/--sgds-([a-z0-9-]+)\s*:\s*([^;]+);/g)) into[m[1]] = m[2].trim();
  };
  const mediaRe = /@media[^{]*min-width:\s*(\d+)px[^{]*\{([\s\S]*?\})\s*\}/g;
  for (const m of css.matchAll(mediaRe)) decls(m[2], (out.media[m[1]] ??= {}));
  decls(css.replace(mediaRe, ""), out.base);
  return out;
}

const root = parseCss(read("themes/root.css"));
const responsive = parseCss(read("themes/responsive.css"));
const day = parseCss(read("themes/day.css")).base;
const night = parseCss(read("themes/night.css")).base;

// ---------- naming ----------
// Longest-prefix grouping so "--sgds-product-primary-100" -> palette/product-primary/100
// ("palette" rather than "color" so it never collides with the semantic --sgds-color-* text tokens)
const COLOR_FAMILIES = ["product-primary", "purple", "cyan", "green", "blue", "yellow", "red", "gray"];
const MULTI_WORD_GROUPS = [
  "font-size", "font-weight", "font-family", "line-height", "letter-spacing", "border-width",
  "border-radius", "border-color", "z-index", "icon-size", "outline-offset", "box-shadow",
  "form-height", "motion-duration", "motion-easing", "opacity",
];
function tokenPath(name) {
  for (const fam of COLOR_FAMILIES) {
    if (name.startsWith(fam + "-") && /^\d+$/.test(name.slice(fam.length + 1))) return ["palette", fam, name.slice(fam.length + 1)];
  }
  const multi = MULTI_WORD_GROUPS.filter((g) => name.startsWith(g + "-")).sort((a, b) => b.length - a.length)[0];
  if (multi) return [multi, name.slice(multi.length + 1)];
  const [head, ...rest] = name.split("-");
  return rest.length ? [head, rest.join("-")] : ["misc", head];
}

// ---------- value conversion ----------
const allRaw = { ...root.base, ...responsive.base, ...day };
function resolveRaw(v, lookup, depth = 0) {
  const m = v.match(/^var\(--sgds-([a-z0-9-]+)\)$/);
  if (!m || depth > 10) return v;
  return lookup[m[1]] !== undefined ? resolveRaw(lookup[m[1]], lookup, depth + 1) : v;
}
function hexWithAlpha(hex, a) {
  const full = hex.length === 4 ? "#" + [...hex.slice(1)].map((c) => c + c).join("") : hex.slice(0, 7);
  return full + Math.round(a * 255).toString(16).padStart(2, "0");
}
function convert(name, raw, lookup) {
  const alias = raw.match(/^var\(--sgds-([a-z0-9-]+)\)$/);
  if (alias) {
    const target = resolveRaw(raw, lookup);
    const t = convert(alias[1], target, lookup);
    if (!t) return null;
    return { $type: t.$type, $value: `{${tokenPath(alias[1]).join(".")}}` };
  }
  if (/^#[0-9a-f]{3,8}$/i.test(raw)) return { $type: "color", $value: raw.toLowerCase() };
  if (raw === "transparent") return { $type: "color", $value: "#00000000" };
  const ok = raw.match(/^oklch\(from var\(--sgds-([a-z0-9-]+)\) l c h \/ ([\d.]+)\)$/);
  if (ok) {
    const base = resolveRaw(`var(--sgds-${ok[1]})`, lookup);
    return /^#/.test(base) ? { $type: "color", $value: hexWithAlpha(base, Number(ok[2])) } : null;
  }
  const px = raw.match(/^(-?[\d.]+)px$/);
  if (px) return { $type: "number", $value: Number(px[1]), $extensions: { unit: "px" } };
  const rem = raw.match(/^(-?[\d.]+)rem$/);
  if (rem) return { $type: "number", $value: Number(rem[1]) * REM, $extensions: { unit: "px", source: raw } };
  if (/^-?[\d.]+%?$/.test(raw)) return { $type: "number", $value: parseFloat(raw) };
  if (name.startsWith("font-family")) return { $type: "string", $value: raw.split(",")[0].replace(/["']/g, "").trim() };
  return null; // shadows, easings, durations, calc() -> not representable as Figma variables
}

function build(entries, lookup) {
  const tree = {};
  const skipped = [];
  for (const [name, raw] of Object.entries(entries)) {
    const tok = convert(name, raw, lookup);
    if (!tok) { skipped.push(`--sgds-${name}: ${raw}`); continue; }
    const path = tokenPath(name);
    let node = tree;
    for (const seg of path.slice(0, -1)) node = node[seg] ??= {};
    node[path.at(-1)] = { ...tok, $description: `--sgds-${name}` };
  }
  return { tree, skipped };
}

const write = (rel, data) => {
  const f = join(ROOT, rel);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, typeof data === "string" ? data : JSON.stringify(data, null, 2) + "\n");
  console.log("wrote", rel);
};

// Collection 1: Primitives (single mode)
const prim = build(root.base, allRaw);
write("tokens/primitives.tokens.json", prim.tree);

// Collection 2: Responsive (modes Mobile / Tablet / Desktop)
const modes = { mobile: responsive.base, tablet: { ...responsive.base, ...responsive.media["1024"] }, desktop: { ...responsive.base, ...responsive.media["1024"], ...responsive.media["1440"] } };
for (const [mode, vals] of Object.entries(modes)) write(`tokens/responsive.${mode}.tokens.json`, build(vals, { ...allRaw, ...vals }).tree);

// Collection 3: Semantic (modes Day / Night)
const dayB = build(day, { ...allRaw, ...day });
write("tokens/semantic.day.tokens.json", dayB.tree);
write("tokens/semantic.night.tokens.json", build(night, { ...root.base, ...responsive.base, ...night }).tree);

write("tokens/skipped.txt", [...new Set([...prim.skipped, ...dayB.skipped])].join("\n") + "\n");

// Plain CSS copies for code usage
for (const f of ["root.css", "responsive.css", "day.css", "night.css"]) copyFileSync(join(pkg, "themes", f), join(ROOT, "tokens/css", f));

// ---------- component map (code <-> Figma) ----------
const manifest = JSON.parse(readFileSync(join(pkg, "custom-elements.json"), "utf8"));
const components = [];
for (const mod of manifest.modules) {
  for (const d of mod.declarations ?? []) {
    if (!d.tagName || !d.tagName.startsWith("sgds-") || d.tagName === "sgds-element") continue;
    const parts = mod.path.split("/");
    const folder = parts[parts.indexOf("components") + 1] ?? "";
    components.push({
      tag: d.tagName,
      group: folder,
      description: (d.summary ?? d.description ?? "").split("\n")[0],
      props: (d.attributes ?? []).map((a) => ({ name: a.name, type: a.type?.text, default: a.default })),
      slots: (d.slots ?? []).map((s) => s.name || "default"),
      events: (d.events ?? []).map((e) => e.name).filter(Boolean),
      figma: { componentName: null, nodeUrl: null, componentKey: null },
    });
  }
}
components.sort((a, b) => a.tag.localeCompare(b.tag));
write("components/component-map.json", { sgdsVersion: SGDS_VERSION, count: components.length, components });
