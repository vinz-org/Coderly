# Pagination

> Dependencies: `colors.md`, `radius.md`

## Container

Font: 13px sans (mono is fine for page numbers, tabular-nums). Items displayed as flex with -1px overlap for seamless borders.

## Pagination Item

- Layout: flex, centered both axes
- Size: 34x34px (or 36x36px)
- Text: body color, medium weight
- Background: neutral-secondary-soft
- Border: 1px, border-default
- Hover: neutral-secondary-medium background, heading text
- Focus: 2px border-brand outline, 2px offset
- Overlap: -1px left margin

## Previous / Next Buttons

- Horizontal padding: 12px, height: 34px
- First item: 3px radius on inline-start side
- Last item: 3px radius on inline-end side

## Active Page Item

- Text: cream/espresso text on button-primary background
- Background: button-primary
- Hover text: stays the same

## Rules

- Display as flex with -1px child overlap for seamless borders
- Items: neutral-secondary-soft background, border-default border, body text
- Active: button-primary background with cream/espresso text
- First item: rounded start (3px), Last item: rounded end (3px)
- All items need hover and focus states (focus = 2px border-brand outline, offset 2px)
