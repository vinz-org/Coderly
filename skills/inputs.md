# Inputs

> Dependencies: `colors.md`, `radius.md`

## Core Specs

- **Display:** block, full width
- **Radius:** 3px (base) — sharp, like a recessed OS field
- **Border:** 1px, border-default
- **Background:** neutral-secondary-soft (slightly recessed/inset against the window body)
- **Shadow:** none (the border defines the field)
- **Font:** 13px sans, heading color
- **Padding:** 10px horizontal, 7px vertical
- **Placeholder:** body-subtle color
- **Transition:** border-color and background-color, 120ms

## Label

- Display: block
- Font: 13px sans, medium weight, heading color
- Margin bottom: 6px
- Label `htmlFor` must match the input `id`

## States

### Default
- Border: border-default
- Background: neutral-secondary-soft

### Hover
- Border: border-default-strong

### Focus
- Border: border-brand
- Outline: 2px solid border-brand, 2px offset (visible retro focus outline)

### Success
- Border: border-success
- Focus outline: 2px border-success, 2px offset

### Error / Danger
- Border: border-danger
- Focus outline: 2px border-danger, 2px offset

### Disabled
- Background: disabled
- Text: fg-disabled
- Cursor: not-allowed

## Input with Icons

- Icon size: 16x16px
- Icon color: body
- Container: relative positioned wrapper
- Start icon: absolutely positioned left, 12px left padding — input gets 36px left padding
- End icon: absolutely positioned right, 12px right padding — input gets 36px right padding
- Icons vertically centered within the wrapper

## Rules

- Every input must have a unique `id`
- Every label must have a matching `htmlFor`
- Padding: 10px horizontal, 7px vertical unless overridden for icon variants
- No arbitrary hex or hardcoded colors
