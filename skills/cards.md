# Cards / Windows

> Dependencies: `colors.md`, `radius.md`, `shadows.md`, `borders.md`, `typography.md`

In this system a "card" is a **window** — a framed panel modeled on a vintage OS window. Most content containers should adopt the window pattern: a **title bar** on top of a **body**. Plain borderless cards do not belong here.

## Anatomy

```
┌───────────────────────────────┐  ← 1px border-default frame, 3px radius
│ ● ●  Window Title          ▢ ✕ │  ← title bar (menu-bar surface, bottom border)
├───────────────────────────────┤
│                               │
│  Body content on              │  ← neutral-primary-soft surface
│  neutral-primary-soft         │
│                               │
└───────────────────────────────┘  ← shadow-window when floating
```

## Core Specs

- **Frame:** 1px solid `border-default`, 3px radius (`base`). The active/focused window may use `border-default-strong`.
- **Title bar:** `menu-bar` background, 32px tall, 1px `border-default` bottom edge, holds the window title (12–13px, semibold, sans) and optional window controls. Top corners follow the 3px radius; the bottom edge is square where it meets the body.
- **Window controls (optional):** small circular dots (`full` radius, ~10px) or tiny bordered squares for minimize/expand/close, sized to match the title-bar height. Decorative-but-accessible: real controls need labels/ARIA.
- **Body:** `neutral-primary-soft` background, 20–24px padding.
- **Shadow:** `shadow-window` when the window floats over the wallpaper; `shadow-none` for windows that sit in-flow within a page layout.

## Card Heading

- The window **title** (in the title bar) is the container label: 12–13px, semibold, sans, heading color.
- A content heading *inside* the body uses the serif scale (see `typography.md`): desktop 18–22px, mobile 16–18px, medium weight, heading color.
- Never skip heading levels — the page hierarchy must logically arrive at the card heading level.

## Variants

### Window Card (default)
- Full anatomy: title bar + body.
- Frame: 1px border-default, 3px radius.
- Floating: shadow-window. In-flow: shadow-none.

### Panel (title-less)
- A simpler bordered panel for nested/secondary content: 1px border-default, 3px radius, `neutral-primary-soft` (or `neutral-secondary-soft` for inset/recessed panels), no title bar, no shadow.

## States

### Static (no interactivity)
- No hover styles. Non-interactive windows/panels must NOT have hover background changes.

### Interactive (clickable card / opens a window)
- Same base styles.
- Hover: `neutral-secondary-medium` body background, and/or border shifts to `border-default-strong`.
- Active: `inset-press` shadow.
- Cursor: pointer.

## Rules

- Default container = **window** (title bar + body). Reach for a title-less **panel** only for nested/secondary content.
- Frame: always 1px `border-default`; 3px radius.
- Body surface: `neutral-primary-soft`. Inset/recessed panels: `neutral-secondary-soft`.
- Title bar surface: `menu-bar`, with a 1px bottom border.
- Floating windows use `shadow-window`; in-flow cards use no shadow.
- Non-interactive cards: no hover styles.
- Never round corners beyond 3px (except true pill/dot controls).
