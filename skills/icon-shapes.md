# Icon Shapes

> Dependencies: `colors.md`, `radius.md`

## Core Specs

- Box sizing: border-box
- Icon must be perfectly centered (inline-flex, centered both axes)
- Circle: fully rounded (999px)
- Squared (default, retro): 3px radius at every size, with a 1px border-default frame

Prefer the **squared** (3px) shape — it matches the OS-icon aesthetic. Use circle only when a round container is explicitly wanted.

## Sizes

| Size | Container | Icon |
|---|---|---|
| XS | 24x24px | 14x14px |
| SM | 32x32px | 16x16px |
| MD | 40x40px | 20x20px |
| LG | 48x48px | 24x24px |
| XL | 56x56px | 28x28px |

## Color Variants

### Brand
- Shape: squared (3px)
- Background: brand-softer
- Border: border-brand-subtle
- Icon color: fg-brand-strong

### Gray
- Shape: squared (3px)
- Background: neutral-secondary-soft
- Border: border-default
- Icon color: body

### Danger
- Shape: squared (3px)
- Background: danger-soft
- Border: border-danger-subtle
- Icon color: fg-danger-strong

### Success
- Shape: squared (3px)
- Background: success-soft
- Border: border-success-subtle
- Icon color: fg-success-strong

### Warning
- Shape: squared (3px)
- Background: warning-soft
- Border: border-warning-subtle
- Icon color: fg-warning
