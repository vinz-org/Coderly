# Tables

> Dependencies: `colors.md`, `radius.md`, `shadows.md`

## Wrapper

- Horizontal scroll overflow
- Background: neutral-primary-soft
- Radius: 3px (base)
- Border: 1px, border-default
- Shadow: none (bordered, in-flow). A table presented as its own window may use shadow-window.

## Table Element

- Full width, left-aligned text (right-aligned for RTL)
- Font: 13px sans, body color (mono is appropriate for numeric/ID columns, tabular-nums)

## Table Head

- Font: 12px sans, body color, semibold weight (optionally uppercase, 0.4px letter-spacing — a "column header" system look)
- Background: menu-bar surface
- Bottom border: border-default
- Cell padding: 16px horizontal, 9px vertical

## Table Body

- Row background: neutral-primary-soft
- Row bottom border: border-default-subtle (omit on last row to avoid doubling with wrapper border)
- Row hover: neutral-secondary-soft background (optional)
- Row header: medium weight, heading color, no-wrap
- Cell padding: 16px horizontal, 10px vertical

## Rules

- Wrapper must have horizontal scroll overflow for responsive scrolling
- Last row: omit bottom border to avoid doubling with wrapper border
- Row headers: always `scope="row"` for semantic structure
- Hover on rows is optional
- No arbitrary hex codes — use token colors only
