# Tabs

> Dependencies: `colors.md`, `radius.md`, `shadows.md`

## Core Specs

- Typography: 13px sans, medium weight, body color
- Transitions: colors, 120ms

## Variants

### 1. Underline (Default)

**Wrapper:** bottom border, border-default

**Tab Item:**
- Padding: 14px horizontal, 10px vertical
- Bottom border: 2px, transparent
- Top corners: 3px radius
- Transition: colors, 120ms

| State | Appearance |
|---|---|
| Active | fg-brand text, border-brand bottom border |
| Inactive | transparent bottom border; hover → heading text, border-default-strong bottom border |
| Disabled | fg-disabled text, not-allowed cursor |

### 2. Pills

**Tab Item:**
- Padding: 14px horizontal, 7px vertical
- Radius: 3px (base)
- Border: 1px border-default
- Font weight: medium
- Transition: colors, 120ms

| State | Appearance |
|---|---|
| Active | button-primary background, cream/espresso text, inset-press feel |
| Inactive | body text; hover → neutral-secondary-medium background, heading text |
| Disabled | fg-disabled text, not-allowed cursor |

### 3. Full Width

Children overlap with -1px left margin on all except first.

**Tab Item:**
- Full width, centered text
- Padding: 14px horizontal, 10px vertical
- Background: neutral-primary-soft
- Border: 1px, border-default
- Transition: colors, 120ms
- Hover: neutral-secondary-medium background, heading text

| State | Appearance |
|---|---|
| Active | neutral-secondary background, fg-brand text |
| First item | rounded start (3px) |
| Last item | rounded end (3px) |

## Tabs with Icons

- Icon size: 16x16px or 20x20px
- Spacing: 8px right margin
- Layout: inline-flex, centered
- Icons inherit the text color of the tab state
