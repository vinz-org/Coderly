# Border Radius

This is a **sharp-cornered** system. Corners are barely rounded — just enough to soften a pixel edge, never enough to read as "modern rounded UI". The retro desktop look depends on crisp, near-square corners.

| Token | Value | Default usage |
|---|---|---|
| base | 3px | Windows, cards, buttons, inputs, modals, menus, badges, panels — almost everything |
| sm | 2px | Checkboxes, tiny chips, nested controls |
| none | 0 | Edge-to-edge elements: menu-bar, full-bleed dividers, window title bars flush to the frame |
| full | 999px | Pills, status dots, toggles, radio dots, circular avatars |

## Rules

- **3px is the default radius across the entire product.** When in doubt, use 3px.
- Never use 8px, 12px, 16px or other "soft" radii — they break the retro chrome.
- A window and its title bar share the same outer radius; the title bar's bottom corners stay square where it meets the body.
- Radius must be consistent within each component family.
- Only true pills, dots, toggles, and circular avatars may use `full`.
