# Buttons

> Dependencies: `colors.md`, `radius.md`, `shadows.md`, `borders.md`

Retro OS buttons are **flat, bordered keys** — no gradients, no glossy glint. They read like physical buttons on a vintage interface: a solid fill, a crisp 1px border, sharp 3px corners, and a tactile inset "press" on click.

## Core Specs (all buttons except ghost and disabled)

- **Radius:** 3px (base). Use `full` (999px) only for explicit pill buttons.
- **Border:** 1px solid (color depends on variant).
- **Shadow:** none at rest (the border separates it). On `:active`, apply `inset-press`.
- **Font:** sans (DM Sans), weight 500 (medium).
- **Box sizing:** border-box.
- **Transition:** background-color and color, ~120ms.
- **Active (pressed):** apply the `inset-press` inset shadow and shift content down 1px — feels like pushing a key.
- **Focus:** 2px solid `border-brand` outline, 2px offset (visible keyboard focus). No soft glow.

## Sizes

| Size | Font size | Horizontal padding | Vertical padding |
|---|---|---|---|
| Extra small | 11px | 8px | 4px |
| Small | 12px | 10px | 5px |
| Base (default) | 13px | 14px | 7px |
| Large | 14px | 18px | 9px |
| Extra large | 15px | 22px | 11px |

## Variants

### Primary
- **Background:** button-primary (espresso in light, glowing orange in dark)
- **Border:** border-default-strong
- **Text:** white (cream) in light; black (espresso) in dark
- **Hover:** brand background (orange) in light; brand-strong in dark — the button "lights up"
- **Active:** inset-press
- **Focus ring:** 2px border-brand outline, offset 2px

### Secondary
- **Background:** button-secondary (rust)
- **Border:** border-default-strong
- **Text:** white (cream)
- **Hover:** brand-strong background
- **Active:** inset-press
- **Focus ring:** 2px border-brand outline, offset 2px

### Tertiary (neutral bordered)
- **Background:** neutral-primary-soft
- **Border:** border-default
- **Text:** heading color
- **Hover:** neutral-secondary-medium background
- **Active:** inset-press
- **Focus ring:** 2px border-brand outline, offset 2px

### Success
- **Background:** success token
- **Border:** border-success
- **Text:** white (cream)
- **Hover:** success-strong background
- **Active:** inset-press

### Danger
- **Background:** danger token
- **Border:** border-danger
- **Text:** white (cream)
- **Hover:** danger-strong background
- **Active:** inset-press

### Warning
- **Background:** warning token
- **Border:** border-warning
- **Text:** white (cream)
- **Hover:** warning-strong background
- **Active:** inset-press

### Ghost (NO border fill, NO shadow)
- **Background:** transparent
- **Border:** transparent (becomes border-default on hover, optional)
- **Text:** heading color
- **Hover:** neutral-secondary-medium background
- **Active:** neutral-secondary-strong background
- **Focus ring:** 2px border-brand outline, offset 2px
- Used for menu-bar items and low-emphasis actions.

### Disabled (NO hover, NO active)
- **Background:** disabled token
- **Border:** border-default-subtle
- **Text:** fg-disabled color
- **Cursor:** not-allowed
- **No hover, no focus ring, no press**

## Icons in Buttons

- Icon size: 14–16px
- Spacing: 6px gap between icon and label
- Layout: inline-flex, vertically centered
- Icon-only buttons stay square (equal padding) with a 3px radius.
