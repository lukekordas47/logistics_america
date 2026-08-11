# logistics_america
# Ports · Rail · Interstates · Relief — Drawable Reference Map

An interactive US map layering major transportation and terrain datasets, with a drawing overlay so you can annotate it as a reference. Waterways are intentionally omitted.

## Layers

- **Saltwater ports** — 20 ranked points (1–20), shaded by tier (top 5 / 6–10 / 11–20), with leader lines to coastal locations.
- **Freshwater ports** — 5 interior points (F1–F5), labeled above the map.
- **Interstates** — I-5, I-10, I-35, I-40, I-70, I-75, I-80, I-90, I-95.
- **Class-I rail** — BNSF/UP (green), CSX/NS (blue), CPKC/CN (pink), shown as dashed routes.
- **Relief** — terrain shading keyed Uplands / High / Highest.

## Drawing

Open `index.html` in a browser. Tools:

- Pen with a color palette, custom color picker, and adjustable size.
- Eraser, Undo (Ctrl/Cmd+Z), and Clear.
- **Save PNG** exports a flattened image of the map plus your marks.
- Keyboard: `P` pen, `E` eraser.

Your marks persist locally in the browser until you Clear them.

## View it live

Once GitHub Pages is enabled (Settings → Pages → deploy from `main` / root), the map is served at:

**https://lukekordas47.github.io/logistics_america/**

Repo: https://github.com/lukekordas47/logistics_america

## Files

- `index.html` — the app.
- `map.png` — base map image (rendered 2026-08-06).

