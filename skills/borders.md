# Borders

Borders are the backbone of this retro system. **Almost everything has a visible 1px border** in the taupe-brown `border-default` color — windows, panels, buttons, inputs, badges, list rows, menu bars. The border is what makes the UI feel like crisp, drawn OS chrome rather than soft floating cards.

## Width Scale

| Context | Width |
|---|---|
| Default (windows, cards, buttons, inputs, list rows, badges, chrome) | 1px |
| Focus outline | 2px (outline, offset 2px from the control) |
| Heavy emphasis / window active frame | 2px (rare) |

## Rules

- Use **solid** borders everywhere by default.
- The default border color is `border-default` (taupe-brown). Use `border-default-strong` (espresso) for high-contrast emphasis and active window frames; `border-default-subtle` for the faintest dividers.
- Dashed borders only for special cases like file dropzones or "empty desktop" placeholders.
- Components in the same family must use matching border widths.
- Never mix 1px and 2px borders within a single component.
- Borders are always visible — do not rely on shadow alone to separate in-flow elements.

## Usage

| Context | Width / Color |
|---|---|
| Windows / panels / cards | 1px `border-default` (1px `border-default-strong` for the active/focused window) |
| Menu bar | 1px `border-default` bottom edge only |
| Inputs / selects / textareas | 1px `border-default`; 1px `border-brand` on focus (plus 2px focus outline), 1px `border-danger` on error |
| Buttons | 1px border matching the variant (see `buttons.md`) |
| Dividers | 1px `border-default-subtle` |
| Focus outline | 2px solid `border-brand`, 2px offset, on every interactive element |
