# Layout & Spacing

This system is organized around a **desktop-OS metaphor**: an orange wallpaper backdrop (`bg-desktop`), a fixed top menu bar, and content presented inside bordered "windows". Spacing is tighter and more utilitarian than a typical marketing site — it should feel like a well-organized application, not an airy landing page.

## Spacing Rhythm

Base unit: **4px**. Spacing values are multiples of 4px (8px is the most common step).

| Context | Value |
|---|---|
| Menu-bar height | 36px |
| Window title-bar height | 32px |
| Window body padding | 20px or 24px |
| Section vertical padding (within a window/page) | 48px or 64px |
| Section header → content | 32px or 48px |
| Heading → paragraph | 12px |
| Flex/grid row gap | 12px or 16px |
| Card/window grid gap | 16px or 24px |
| Desktop icon grid gap | 16px |
| Container horizontal padding | 16px (mobile) / 24px (desktop) |

## Container

Standard content container: max-width 1100px, centered, 24px horizontal padding. Inside a window, content respects the window body padding instead.

## The Desktop Shell

A typical page is composed as:
1. **Wallpaper** — full-viewport `bg-desktop` (orange) backdrop. No content sits directly on it except desktop icons.
2. **Menu bar** — fixed top bar (36px), `menu-bar` surface, 1px `border-default` bottom edge, holds the app/brand mark and menu items.
3. **Desktop icons** (optional) — folder-style icons with a label, arranged top-left.
4. **Windows** — one or more bordered windows (see `cards.md`) floating on the wallpaper, each with a title bar and body. Long-form content lives inside a window body.

## Content Composition Order

Inside each window/section, follow this order:
1. Title bar / heading (`h1`–`h3`, serif)
2. Leading paragraph
3. Normal paragraph(s)
4. Lists, CTA links, or component grids

## Motion & Animation

- Prefer CSS-native: `transition`, `animation`, `@keyframes`. Use a motion library only when CSS cannot achieve the behavior.
- Lean into the OS metaphor: windows can fade/scale-in on open, a brief "boot/loading" sheen, staggered desktop-icon reveals. Keep durations short (120–220ms) and snappy — retro UIs feel responsive, not floaty.
- Hover/press feedback is immediate: a fill shift on hover, an inset press on `:active`.
- Reserve scroll-triggered transitions for moments that reinforce hierarchy.

## Backgrounds & Visual Depth

- Depth comes from **borders + warm directional shadows**, not gradients or glass.
- The orange wallpaper provides the atmospheric color; windows are opaque cream/espresso panels layered on top with `shadow-window`.
- Optional period-appropriate texture (subtle paper grain, faint scanlines, dithered patterns) is welcome on the wallpaper but must never reduce content legibility.
- Every decorative element must serve a compositional purpose (depth, separation, emphasis).

## Must

- Wallpaper = `bg-desktop` only; all real content lives inside bordered windows on cream/espresso surfaces.
- Consistent 4px-based spacing; avoid crowded or uneven gaps.
- Every window carries a 1px `border-default` frame and a title bar.
- Layouts readable and properly spaced on both desktop and mobile (windows may go full-width / stack on small screens).
