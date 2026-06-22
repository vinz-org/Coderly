# Button Groups

> Dependencies: `buttons.md`, `colors.md`, `radius.md`

## Core Specs

- **Wrapper:** inline-flex, 3px radius, no shadow (the shared border defines the group)
- **Children overlap:** -1px left margin on all except first button (borders merge into a single seam)
- **Buttons inside the group must NOT have individual shadows.**

## Anatomy

### Wrapper
- Display: inline-flex
- Radius: 3px
- Shadow: none

### First Button
- 3px radius on inline-start side only, 0 on inline-end

### Middle Button(s)
- No radius (0 on all corners)

### Last Button
- 3px radius on inline-end side only, 0 on inline-start

### All buttons except first
- -1px left margin to overlap borders into one crisp seam

## Rules

- Buttons inside groups follow all styles from `buttons.md` (background, border, focus outline) except individual shadows
- Icon-only buttons: 14–16px icon, match height of text buttons
