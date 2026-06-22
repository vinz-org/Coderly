# Avatars

> Dependencies: `colors.md`, `radius.md`

## Core Specs

- **Circular shape:** fully rounded (999px)
- **Squared shape:** 3px radius (sharp — the retro default; reads like a framed photo/portrait tile)
- **Default size:** 40x40px
- **Image fit:** cover
- **Frame:** squared avatars carry a 1px border-default frame

Prefer the **squared** (3px) shape for the retro look; use circular only when a round portrait is explicitly desired.

## Sizes

| Size | Dimensions | Radius |
|---|---|---|
| Extra Small | 18x18px | 3px |
| Small | 24x24px | 3px |
| Base | 32x32px | 3px |
| Large | 44x44px | 3px |
| XL | 56x56px | 3px |
| 2XL | 64x64px | 3px |

## Bordered Avatar

- 4px padding, fully rounded, 2px outline in border-default color
- Alternative: 2px box-shadow ring in border-default color

## Stacked Avatars

- Displayed in a row (flex)
- Each avatar: 40x40px, fully rounded, 2px border in border-buffer color
- Overlap: -16px negative margin on all except first

### Stacked Counter
- Same size as avatars (40x40px), fully rounded
- Background: dark-strong, text: white, 12px font, medium weight
- Same overlap margin as other avatars

## Avatar with Text

- Flex row, 10px gap between avatar and text
- Avatar: 40x40px, fully rounded, cover fit
- Name: heading color, medium weight
- Subtitle: 14px, body color
