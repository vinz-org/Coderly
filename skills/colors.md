# Color Tokens

A warm, nostalgic desktop-OS palette: toasted cream surfaces, espresso-brown ink, and a glowing orange accent that powers the "wallpaper", folder icons, and primary actions. Light mode reads like a sun-faded vintage manual; dark mode like a CRT terminal at night.

## Background Tokens

### Neutral
| Token | Light | Dark |
|---|---|---|
| neutral-primary-soft | #FFEEDD | #221811 |
| neutral-primary | #FFEEDD | #1F150E |
| neutral-primary-medium | #F6E3D2 | #2A1E15 |
| neutral-primary-strong | #ECD9C8 | #30231B |
| neutral-secondary-soft | #F6E6D6 | #2A1E15 |
| neutral-secondary | #E5D4C5 | #30231B |
| neutral-secondary-medium | #DBC8B6 | #3A2A1F |
| neutral-secondary-strong | #CDB7A1 | #463225 |
| neutral-tertiary-soft | #EADAC9 | #2A1E15 |
| neutral-tertiary | #DBC8B6 | #30231B |
| neutral-tertiary-medium | #CDB7A1 | #3A2A1F |
| neutral-quaternary | #C3A98E | #463225 |
| quaternary-medium | #B79A7E | #5A4233 |
| gray | #8D6C5D | #7F6759 |

### Brand (orange accent — the signature glow)
| Token | Light | Dark |
|---|---|---|
| brand-softer | #FFF1EB | #2E1C12 |
| brand-soft | #FFD2B8 | #3C2519 |
| brand | #FF631A | #FF9A63 |
| brand-medium | #FFBA94 | #4A3120 |
| brand-strong | #D94A00 | #FFB07E |

### Status
| Token | Light | Dark |
|---|---|---|
| success-soft | #E2F4DB | #182A14 |
| success | #2F6C2D | #6FBF6A |
| success-medium | #CDEAC4 | #20361C |
| success-strong | #1F4F1D | #98E2A8 |
| danger-soft | #FFF1EB | #2E1410 |
| danger | #B0300A | #FF8F7E |
| danger-medium | #F6DDD2 | #4A1A12 |
| danger-strong | #7A2200 | #FFB0A3 |
| warning-soft | #FFEFD6 | #2E2110 |
| warning | #C2410C | #E5A85A |
| warning-medium | #FBE3C0 | #46341A |
| warning-strong | #8A4A08 | #F0C58A |

### Desktop / OS surfaces (retro-specific)
These power the desktop metaphor: the wallpaper, the menu bar, window primary actions, folder icon bodies, and code/terminal panes.
| Token | Light | Dark | Role |
|---|---|---|---|
| bg-desktop | #FF631A | #7F492F | Wallpaper / desktop backdrop behind windows |
| bg-fourth | #8D6C5D | #7F6759 | Muted brown used for chrome borders & folder outlines |
| menu-bar | #E5D4C5 | #30231B | Fixed top menu bar surface |
| button-primary | #3F1400 | #FF9A63 | Primary action fill (espresso in light, glowing orange in dark) |
| button-secondary | #9D3200 | #BE7247 | Secondary action fill (rust) |
| button-tertiary | #8D6C5D | #7F6759 | Tertiary action fill (taupe) |
| code-bg | #2B1B11 | #130D09 | Code blocks / terminal background |
| code-text | #FFE6D1 | #EAD7C4 | Code blocks / terminal foreground |

### Button Pressed/Inset (CSS custom properties, used for the retro "pushed key" inset)
Buttons here are flat — no glossy glint. A pressed (`:active`) state uses an inset shadow to feel like a physical key going down.
| Variable | Light | Dark |
|---|---|---|
| `--inset-press` | rgba(56,28,0,0.28) | rgba(0,0,0,0.55) |

### Utility
| Token | Light | Dark |
|---|---|---|
| dark | #3F1400 | #2A1E15 |
| dark-strong | #2A0E00 | #1F150E |
| disabled | #E5D4C5 | #30231B |

### Accent (theme-switchable hues; orange is the default)
| Token | Value (same both modes) |
|---|---|
| purple | #8B58DD |
| sky | #2D7FF0 |
| teal | #2F9B7A |
| pink | #D94A6E |
| cyan | #2F9B9B |
| fuchsia | #B03990 |
| indigo | #55308C |
| orange | #FF631A |

## Text Color Tokens

### Base
| Token | Light | Dark |
|---|---|---|
| white | #FFF6EE | #FFF6EE |
| black | #381C00 | #381C00 |
| heading | #381C00 | #F2DFCB |
| body | #4A3826 | #E4D3C0 |
| body-subtle | #6C5945 | #C3AB97 |

### Brand
| Token | Light | Dark |
|---|---|---|
| fg-brand-subtle | #C26A3A | #FFB07E |
| fg-brand | #9D3200 | #FF9A63 |
| fg-brand-strong | #7A2200 | #FFB07E |

### Status
| Token | Light | Dark |
|---|---|---|
| fg-success | #2F6C2D | #79CA8E |
| fg-success-strong | #1F4F1D | #98E2A8 |
| fg-danger | #7A2200 | #FF8F7E |
| fg-danger-strong | #5A1800 | #FFB0A3 |
| fg-warning-subtle | #C2410C | #E5B57A |
| fg-warning | #8A4A08 | #F0C58A |
| fg-disabled | #A8917C | #7F6B59 |

### Informational / Accent
| Token | Light | Dark |
|---|---|---|
| fg-yellow | #B8860B | #E5C97A |
| fg-info | #184B8F | #7EB0FF |
| fg-purple | #7242BB | #BB93FF |
| fg-purple-strong | #55308C | #D0B3FF |
| fg-cyan | #2F8A8A | #7FB8B8 |
| fg-indigo | #55308C | #A78FB5 |
| fg-pink | #C03A6A | #E59AB0 |
| fg-lime | #4C8A2D | #98D27E |

## Border Color Tokens

Retro chrome leans on one workhorse border — a muted taupe-brown (`border-default` = `bg-fourth`). Borders are crisp, 1px, and always visible; they define every window, control, and panel.

| Token | Light | Dark |
|---|---|---|
| border-dark | #3F1400 | #A8876F |
| border-buffer | #FFEEDD | #221811 |
| border-buffer-medium | #F6E3D2 | #2A1E15 |
| border-buffer-strong | #E5D4C5 | #30231B |
| border-muted | #EADAC9 | #2A1E15 |
| border-light-subtle | #E5D4C5 | #2A1E15 |
| border-light | #DBC8B6 | #30231B |
| border-light-medium | #CDB7A1 | #3A2A1F |
| border-default-subtle | #C3A98E | #5A4233 |
| border-default | #8D6C5D | #7F6759 |
| border-default-medium | #6C5945 | #8A6F5C |
| border-default-strong | #3F1400 | #A8876F |
| border-success-subtle | #CDEAC4 | #20361C |
| border-success | #2F6C2D | #6FBF6A |
| border-danger-subtle | #F6DDD2 | #4A1A12 |
| border-danger | #B0300A | #FF8F7E |
| border-warning-subtle | #FBE3C0 | #46341A |
| border-warning | #C2410C | #E5A85A |
| border-brand-subtle | #FFD2B8 | #4A3120 |
| border-brand-light | #FFBA94 | #BE7247 |
| border-brand | #FF631A | #FF9A63 |
| border-dark-subtle | #6C5945 | #5A4233 |
| border-purple | #8B58DD | #8B58DD |
| border-orange | #FF631A | #FF9A63 |

## Semantic Usage Rules

- **Wallpaper vs. windows:** `bg-desktop` (orange) is the backdrop *behind* windows only. Window/card/panel content surfaces use `neutral-primary-soft` (cream / espresso).
- Page/section backgrounds: neutral-primary-soft (default), neutral-secondary-soft (alternating/inset panels).
- Top menu bar: `menu-bar` background with a 1px `border-default` bottom edge.
- Primary buttons: `button-primary` fill (espresso ink in light, glowing orange in dark) with cream/espresso text respectively.
- Secondary buttons: `button-secondary` (rust). Tertiary buttons: `button-tertiary` (taupe) or a bordered neutral button.
- Headings: heading text color. Body text: body color. Captions/meta: body-subtle.
- Links / CTAs: fg-brand text color, underlined.
- Default borders: border-default (taupe-brown) — the defining line of all retro chrome.
- Status borders match intent: success → border-success, danger → border-danger, warning → border-warning.
- Code / terminal panes: code-bg background with code-text foreground.
- Disabled: disabled background + fg-disabled text.

## Prohibited

- No raw hex/rgb values in component code — always use design tokens.
- No brand text color for long-form paragraphs.
- No accent text tokens (fg-purple, etc.) for body copy or navigation.
- Do NOT use the orange `bg-desktop` as a content/section surface — it is wallpaper only. Content lives on cream/espresso window surfaces.
- No manual light/dark value swapping — let the CSS custom properties handle it.
- No soft pastel/glassy fills — surfaces are opaque, warm, and bordered.
