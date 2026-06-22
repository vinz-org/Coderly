# Radios, Checkboxes & Toggles

> Dependencies: `colors.md`, `radius.md`

## Checkbox

- Size: 16x16px
- Radius: 2px (sharp, near-square)
- Border: 1px, border-default
- Background: neutral-secondary-soft
- Checked: button-primary fill, cream/espresso checkmark
- Focus: 2px border-brand outline, 2px offset

### Disabled
- Border: border-light
- Text: fg-disabled

## Radio

- Size: 16x16px
- Radius: fully rounded (999px)
- Border: 1px, border-default
- Background: neutral-secondary-soft
- Focus: 2px border-brand outline, 2px offset
- Checked: border-brand, indicator: button-primary fill dot

### Disabled
- Border: border-light-medium
- Text: fg-disabled

Group all radio items under the same `name` attribute.

## Toggle

### Track
- Fully rounded (999px), 1px border-default
- Background: neutral-quaternary
- Focus-within: 2px border-brand outline, 2px offset
- Checked track: brand background
- Disabled track: neutral-tertiary background

### Thumb
- Fully rounded (999px)
- Background: white (cream)
- Border: 1px border-default

### Disabled
- Track: neutral-tertiary background
- Label: fg-disabled text

## Rules

- All selection inputs must have `id` matching label `htmlFor`
- Focus states use a 2px border-brand outline offset 2px (no soft glow)
- Selection controls carry a visible 1px border-default at rest
- Disabled states: no hover/focus interaction
