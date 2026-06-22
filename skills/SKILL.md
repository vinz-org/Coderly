---
name: "nostalgia-design-system"
description: "Nostalgia Design System design system for AI coding agents."
metadata:
  author: typeui.sh
  source: workspace-importer
  projectName: "Nostalgia"
  projectLogoUrl: ""
  importSource: "Manual TypeUI setup"
  primaryColorReference: "#18181b"
  surfaceColorReference: "#ffffff"
  textColorReference: "#09090b"
  typographyScale: "Inter-style sans serif, 12/14/16/20/24/32 scale, medium labels, semibold headings."
  spacingScale: "4px base grid with 8px, 12px, 16px, 24px, and 32px layout steps."
  radiusScale: "6px controls, 8px cards, 12px overlays, nested radii reduced by inner padding."
---

# Design System — Agent Instructions

This skill describes the visual design language for all UI output. Every component, layout, and page should follow the design specs in the module files below. These describe *what the design looks like* — you choose how to implement the styles.

## Style
A nostalgic desktop-OS interface — toasted-cream surfaces, espresso-brown ink, and a glowing orange accent. UI is framed like a vintage operating system: a fixed top menu bar, draggable "windows" with title bars instead of plain cards, folder-style icons, and crisp 1px taupe borders on everything. Corners are sharp (3px), shadows are warm and directional, headings are set in a literary serif, body/UI text in a clean geometric sans, and code/metadata in a monospace. The result feels like a sun-faded retro manual in light mode and a CRT terminal at night in dark mode.

## Before Writing Any Code

1. **Read every module that applies.** For a landing page, read at minimum: `layout.md`, `typography.md`, `colors.md`, `buttons.md`, `cards.md`, `shadows.md`, `radius.md`, `borders.md`. Do NOT write any component markup until you have loaded all relevant modules.

## Critical Rules

- **Stay stack-agnostic.** This design system is technology-agnostic. Do not assume or hardcode any specific stack, framework, or styling library. The rules, colors, and styles must be implementable with any technology.

- **Tokens are AGNOSTIC design tokens, NOT utility classes:** The tokens defined in the `.md` files (like `neutral-primary-soft`, `heading`, `border-default`) are abstract design system tokens, NOT literal class names. Do not assume any predefined class exists — map each token to your project's styling layer yourself.

- **The desktop metaphor is the soul of this system.** Treat primary content containers as "windows": a title-bar header (with a label and, where appropriate, window controls) sitting on a bordered body. The orange `bg-desktop` is the *wallpaper behind windows only* — never a content surface.

- **Sharp, not soft.** Border-radius maxes out at 3px for surfaces and controls (pills/dots may use full radius). Never use large 8–16px rounding. Every surface, control, and panel carries a crisp 1px `border-default` (taupe-brown) line.

- **Flat chrome, physical feedback.** Buttons and controls are flat fills with a 1px border — no glossy gradients or glint highlights. Interactivity is expressed through a color/fill shift on hover and a subtle inset "pressed-key" shadow on `:active`.

- **Cross-reference modules.** A window containing buttons must satisfy both `cards.md` AND `buttons.md`.
- **Dark mode is automatic.** The CSS custom properties resolve differently in light/dark via `@media (prefers-color-scheme: dark)` (or a `data-theme` attribute). Never manually swap colors.
- **Every interactive element needs hover, focus, and disabled states** — defined in the relevant module. Focus uses a visible 2px outline offset from the control (keyboard-friendly retro outlines).
- **Use semantic HTML:** proper heading hierarchy (`h1`→`h6`), `<button>` for actions, `<a>` for navigation, ARIA attributes where needed.

## Module Index

### Foundation (read first for any UI work)
- [colors.md](colors.md) — all background, text, and border color tokens
- [typography.md](typography.md) — heading scale, paragraphs, labels, links
- [layout.md](layout.md) — spacing rhythm, containers, animation, visual depth
- [radius.md](radius.md) — border-radius scale
- [shadows.md](shadows.md) — elevation tokens
- [borders.md](borders.md) — border widths and styles

### Components
- [buttons.md](buttons.md) — flat retro button variants, sizes, states, pressed feedback
- [button-group.md](button-group.md) — grouped button structure
- [cards.md](cards.md) — window/title-bar chrome, panels, interactivity
- [inputs.md](inputs.md) — form controls, labels, states
- [alerts.md](alerts.md) — alert variants
- [badges.md](badges.md) — badge variants, sizes, dismissible chips
- [lists.md](lists.md) — list components
- [avatars.md](avatars.md) — avatar variants, sizes, indicators
- [icon-shapes.md](icon-shapes.md) — icon containers

### Complex Components
- [accordion.md](accordion.md) — accordion variants
- [dropdown.md](dropdown.md) — dropdown menus
- [modals.md](modals.md) — modal dialogs
- [tabs.md](tabs.md) — tab navigation
- [tables.md](tables.md) — table structure
- [pagination.md](pagination.md) — pagination components
- [sidebars.md](sidebars.md) — sidebar navigation
- [radios-checkboxes-toggle.md](radios-checkboxes-toggle.md) — selection controls
- [tooltips-popovers.md](tooltips-popovers.md) — tooltips and popovers
- [content.md](content.md) — grid system, responsiveness