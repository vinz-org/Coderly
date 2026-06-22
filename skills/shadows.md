# Shadows

Shadows here are **warm and directional** — tinted with the espresso-brown ink color (not neutral gray) so they read like sunlight falling across a physical desktop. They are used sparingly: flat chrome rarely needs elevation, but floating surfaces (windows, menus, popovers, modals) lift clearly off the wallpaper.

The shadow color is the brown ink at low alpha in light mode, and near-black in dark mode (resolved via custom properties `--shadow-window`, `--shadow-window-active`, `--shadow-menu`).

| Token | Light value | Dark value | Use |
|---|---|---|---|
| shadow-none | none | none | Flat, in-flow chrome (buttons, inputs, badges, list rows) |
| shadow-menu | `0 5px 16px rgba(56,28,0,0.15)` | `0 5px 16px rgba(0,0,0,0.40)` | Dropdowns, context menus, popovers, tooltips |
| shadow-menu-lg | `0 8px 22px rgba(56,28,0,0.15)` | `0 8px 22px rgba(0,0,0,0.40)` | Larger floating menus, command palettes |
| shadow-window | `0 4px 10px rgba(56,28,0,0.18), 0 20px 38px rgba(56,28,0,0.28)` | `0 4px 10px rgba(0,0,0,0.46), 0 20px 38px rgba(0,0,0,0.62)` | Windows, modals, prominent floating cards |
| inset-press | `inset 0 2px 4px rgba(56,28,0,0.28)` | `inset 0 2px 4px rgba(0,0,0,0.55)` | `:active` pressed-key feedback on buttons/controls |

## Component Mapping

| Component type | Token |
|---|---|
| Buttons, inputs, badges, inline chips, list rows, in-flow cards | shadow-none |
| Dropdowns, popovers, tooltips, context menus | shadow-menu |
| Large floating menus / palettes | shadow-menu-lg |
| Windows, modals, dialogs, dragged/active windows | shadow-window |
| Pressed (`:active`) buttons and controls | inset-press (combine with the control's own border) |

## Rules

- The default for in-flow, bordered chrome is **shadow-none** — the 1px border does the separation work, not a shadow.
- Floating surfaces (anything that overlays content) get exactly one of the menu/window tokens. Never stack two elevation tokens.
- Shadows are tinted brown/black via the custom properties — never use neutral gray shadows.
- Use `shadow-window` only for true overlay surfaces; never for dense list items or body containers.
- `inset-press` is the only inset shadow and is reserved for the pressed state.
