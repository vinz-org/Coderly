# Tooltips & Popovers

> Dependencies: `colors.md`, `radius.md`, `shadows.md`

## Tooltips

### Core Specs
- Padding: 8px horizontal, 5px vertical
- Font: 12px sans, medium weight
- Radius: 3px (default)
- Border: 1px (matches variant)
- Shadow: shadow-menu
- Transition: opacity, 120ms

### Dark (Default)
- Background: dark (espresso)
- Text: white (cream)
- Border: border-default-strong

### Light
- Background: neutral-primary-medium
- Text: heading color
- Border: 1px, border-default

## Popovers

A popover is a small floating **window/panel**: bordered, sharp, with a warm directional shadow.

### Core Specs
- Background: neutral-primary-soft
- Radius: 3px (base)
- Shadow: shadow-menu
- Border: 1px, border-default
- Transition: opacity, 120ms

### Header / Title
- Padding: 8px horizontal, 6px vertical
- Background: menu-bar surface
- Bottom border: border-default
- Font: 12–13px sans, semibold weight, heading color

### Body / Content
- Standard: 10px horizontal, 8px vertical padding; 13px, body color
- Rich: 16px padding; 13px, body color

## Arrows

- Size: 8x8px rotated 45deg, with a 1px border-default on the exposed edges
- Color must match the background of the tooltip/popover variant

## Rules

- Tooltips & popovers: 3px radius, always bordered
- Floating shadow: shadow-menu (warm, directional)
- Dark tooltips: espresso background, cream text
- Light tooltips/popovers: semantic neutral background + border tokens
- Arrows match parent background color and border
