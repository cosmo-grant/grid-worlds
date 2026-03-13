# Styling Design Spec

## Goal

Add clean, accessible styling to Grid Worlds. Must work in light and dark mode,
on mobile and desktop. No frameworks -- pure CSS, with small HTML structural changes.

## Theming

CSS custom properties on `:root`, overridden inside
`@media (prefers-color-scheme: dark)`. Also set `color-scheme: light dark` so the
browser adapts scrollbars and form control chrome.

### Color palette

| Variable           | Light     | Dark      | Used for                |
| ------------------ | --------- | --------- | ----------------------- |
| `--bg`             | `#ffffff` | `#1a1a1a` | Page background         |
| `--text`           | `#1a1a1a` | `#e0e0e0` | Body text               |
| `--text-muted`     | `#555`    | `#999`    | Secondary text          |
| `--cell-on`        | `#1a1a1a` | `#1a1a1a` | "On" cells (both modes) |
| `--cell-off`       | `#f0f0f0` | `#f0f0f0` | "Off" cells (both modes)|
| `--grid-border`    | `#ccc`    | `#444`    | Grid gap/border         |
| `--control-bg`     | `#f5f5f5` | `#2a2a2a` | Button/input background |
| `--control-border` | `#ccc`    | `#444`    | Button/input borders    |
| `--focus-ring`     | `#2563eb` | `#60a5fa` | Focus outlines          |

Cell colors are intentionally fixed across modes so that "on" and "off" always look
the same. This avoids confusion when discussing patterns in the mosaic.

## Layout

Single centered column. Max-width ~1060px (fits a 50-column grid at 20px cells plus
gaps and padding). Grid centered horizontally within the column via `margin: 0 auto`
on its `width: fit-content`. Controls below the grid. About section below the controls
at the same column width.

When switching between grids of different sizes, the grid's centered positioning means
only the grid itself changes width -- the surrounding layout stays stable, no jumping.

On narrow screens, `overflow-x: auto` on the grid container allows horizontal scrolling
for wide grids without breaking the page layout.

## Control groups

Controls are grouped into `<div class="control-group">` wrappers, each styled as a
flex row with `gap: 8px` and `flex-wrap: wrap`. All groups share the same class and
same styling.

Order (top to bottom):

1. **Frame navigation:** Prev, frame indicator (e.g. "Frame 0/14"), Next
2. **Frame editing:** Add Frame, Delete Frame, Clear, Invert
3. **Grid size:** Rows label + input, Cols label + input, Resize button
4. **Title:** text input, full width
5. **Description:** textarea, full width
6. **File I/O:** Download JSON, Upload JSON
7. **Persistence:** Save, saved-grids dropdown, Delete, Reset Grid

Spacing: ~12-16px between groups. No visible borders or boxes around groups -- just
whitespace.

## Typography

System font stack (no web fonts):

```
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
```

Sizes:
- `<h1>`: 1.5rem
- `<h2>`: 1.25rem
- Body text: 1rem
- Buttons/inputs: 0.875rem

Line-height: 1.6 on body text for readability in the about section.

Blockquote: left border, indented. Citation in italics.

## Controls styling

- **Buttons:** `--control-bg` background, 1px `--control-border` border, 4px
  border-radius. Slightly darker on hover. `cursor: pointer`.
- **Inputs/select:** Same border and background treatment as buttons.
- **Title input and description textarea:** Full width of controls area.
- **Number inputs (rows, cols):** Narrow, ~60px.
- **Textarea:** Default ~3-4 rows tall, resizable vertically (`resize: vertical`).
  Scrolling is fine for long content.
- **Focus states:** `2px solid var(--focus-ring)` outline on `:focus-visible` for all
  interactive elements. Keyboard users see the ring; mouse users don't.

## HTML changes

These are structural only -- no functionality changes.

1. **Add `<main>` wrapper** around h1, grid, controls, and about section. This
   constrains max-width and centers the page column.
2. **Group controls** into `<div class="control-group">` wrappers within
   `<div id="controls">`.
3. **Reorder controls** in the HTML to match the group order above.
4. **Swap description `<input type="text">`** for `<textarea id="description-input">`.
5. **Add `<label>` elements** for rows and cols number inputs (accessibility).

## JS changes

Minimal:
- The description input reference changes from `<input>` to `<textarea>`, but `.value`
  works identically on both. No logic changes needed.

## Accessibility

- `color-scheme: light dark` for browser chrome adaptation.
- `:focus-visible` outlines on all interactive elements.
- `<label>` elements for number inputs.
- Sufficient color contrast in both modes.
- Semantic HTML (`<main>`, `<section>`, `<blockquote>`).

## Mobile

- Centered column takes full width minus padding on narrow screens.
- Control groups wrap via flexbox.
- Grid scrolls horizontally (`overflow-x: auto`) if wider than the viewport.
- No breakpoints needed -- the layout adapts naturally.

## Files modified

- `docs/style.css` -- rewritten with the full styling.
- `docs/index.html` -- structural changes listed above.
- `docs/main.js` -- no changes expected (textarea `.value` is compatible).
