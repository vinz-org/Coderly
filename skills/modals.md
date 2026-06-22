# Modals

> Dependencies: `colors.md`, `radius.md`, `shadows.md`, `buttons.md`, `inputs.md`

A modal is a **floating window dialog** — same anatomy as a window (see `cards.md`): a title bar with a label and close control, sitting over a dimmed wallpaper.

## Core Specs

### Overlay (Backdrop)
- Fixed, covers full screen
- Z-index: 40
- Background: the espresso ink / black at ~55% opacity (warm dim, not neutral gray)
- Backdrop blur: small amount, optional

### Content Container (Window)
- Background: neutral-primary-soft
- Border: 1px border-default-strong (active-window frame)
- Radius: 3px (base)
- Shadow: shadow-window
- Padding: 0 (header/body/footer manage their own padding)

## Anatomy

### Title Bar (Header)
- Background: menu-bar surface
- Height: 32px (or auto with 8px vertical padding for taller dialogs)
- Bottom border: 1px border-default
- Title: 12–13px, semibold, sans, heading color (left aligned)
- Close control: small bordered/dot control on the right (Ghost button from `buttons.md`, 4px padding) with an accessible label

### Body
- Padding: 20px
- Vertical spacing between elements: 16px
- Heading inside body (if any): serif scale per `typography.md`
- Text: 14px sans, 1.5 line-height, body color

### Footer
- Top border: border-default
- Padding: 12px 20px
- Action buttons right-aligned (primary + secondary per `buttons.md`)

## Variants

### Default (Information)
Standard header + body + footer with primary/secondary action buttons.

### Pop-up (Confirmation)
A classic system alert dialog. Centered text, prominent icon, reduced padding:
- Body: 20px padding, text centered
- Icon: centered, 12px bottom margin, 40x40px, in a squared icon-shape per `icon-shapes.md`

### Form Modal
Body contains inputs following `inputs.md`. Vertical spacing between form elements: 16px.

## Rules

- Backdrop covers full screen with fixed positioning (warm espresso dim, not gray)
- Content is a window: neutral-primary-soft background, 1px border-default-strong frame, 3px radius, shadow-window
- Title bar uses the menu-bar surface with a 1px bottom border
- Header/Footer separated by border-default borders
- Close control must be present, labeled, and functional
- Accessibility: `role="dialog"`, implement focus trap in code
- Dark mode automatic via token system
