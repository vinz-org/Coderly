# Typography

> Dependencies: `colors.md`

Three typefaces work together to create the nostalgic feel:

- **Display / Headings — a literary serif** (e.g. *Newsreader*, fallback Georgia/Times/serif). Gives headings an editorial, old-print character.
- **Body / UI — a clean geometric sans** (e.g. *DM Sans*, fallback system sans-serif). Used for paragraphs, labels, buttons, navigation.
- **Mono — a monospace** (e.g. *Geist Mono*, fallback ui-monospace/monospace). Used for code, terminal panes, timestamps, file metadata, keyboard hints, and "system" labels that should feel machine-printed.

## Core Rules

- **Headings use the serif display font**, heading text color, medium weight (500). They may use a slightly tighter line-height for a nostalgic-print look.
- **Body copy uses the sans font**, body text color. Never use brand/accent color for paragraphs longer than one sentence.
- **Mono is intentional, not decorative** — reserve it for code, timestamps, metadata, file names, and short system labels.
- **Semantic HTML:** Use `h1`–`h6` in order, never skip levels.

## Heading Scale (serif)

### Desktop

| Element | Size | Line-height | Letter-spacing | Margin-bottom |
|---|---|---|---|---|
| `h1` | 52px | 1.05 | -0.5px | 24px |
| `h2` | 40px | 1.1 | -0.3px | — |
| `h3` | 32px | 1.15 | — | — |
| `h4` | 26px | 1.2 | — | — |
| `h5` | 22px | 1.3 | — | — |
| `h6` | 18px | 1.35 | — | — |

### Responsive

| Element | Tablet (≥768px) | Mobile (default) |
|---|---|---|
| `h1` | 38px | 30px |
| `h2` | 32px | 26px |
| `h3` | 28px | 22px |
| `h4` | 24px | 20px |
| `h5` | 20px | 18px |
| `h6` | 17px | 16px |

Mobile-first: start with mobile sizes, scale up at tablet and desktop breakpoints. Never reduce a heading's line-height below 1.05.

## Paragraphs (sans)

### Leading Paragraph
- Size: 18px
- Weight: normal
- Color: body
- Line-height: 1.65
- Max width: ~70 characters

### Normal Paragraph
- Size: 15px
- Weight: normal
- Color: body
- Line-height: 1.65
- Max width: ~65 characters

### Small Supporting Copy
- Size: 13px
- Weight: normal
- Color: body-subtle
- Line-height: 1.5
- Use only for helper text, legal text, captions, metadata.

## UI Labels (sans, unless noted)

| Context | Size | Weight |
|---|---|---|
| Button labels | 13–14px | 500 (medium) |
| Input labels | 13–14px | 500 (medium) |
| Menu-bar items | 12–13px | 500–600 |
| Window title-bar label | 12–13px | 600 (semibold) |
| Captions / meta / badges | 11–12px | 500 (medium) |
| Timestamps / file names / system labels | 11–13px | 500, **mono**, tabular-nums |

Do not apply paragraph line-height to control labels.

## Mono Usage

- Code blocks & inline code: mono, `code-text` on `code-bg`.
- Terminal / console panes: mono, `terminal`-style foreground on `code-bg`.
- Timestamps, durations, counts: mono with tabular figures so digits don't shift.
- Short uppercase "system" tags (e.g. `README.TXT`, `v1.0`): mono, uppercase, 0.4px letter-spacing.

## Links

- **Inline links:** Same size as surrounding text, fg-brand (rust) color, underline, hover → no underline.
- **CTA links:** fg-brand color, medium weight, underline, hover → no underline.

## Emphasis

- `<strong>` for high-priority emphasis in body text.
- `<em>` for tone emphasis only, not visual hierarchy.
- All-caps only for short labels: uppercase, 0.4px letter-spacing, 11–12px (often mono).

## Dark Mode

Hierarchy and typefaces stay identical. Only color tokens change (automatic via CSS custom properties). Size, weight, and spacing remain constant.
