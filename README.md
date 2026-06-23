```
  ██████╗ ██████╗ ██████╗ ███████╗██████╗ ██╗  ██╗   ██╗
 ██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗██║  ╚██╗ ██╔╝
 ██║     ██║   ██║██║  ██║█████╗  ██████╔╝██║   ╚████╔╝ 
 ██║     ██║   ██║██║  ██║██╔══╝  ██╔══██╗██║    ╚██╔╝      ██▛██▜▌
 ╚██████╗╚██████╔╝██████╔╝███████╗██║  ██║███████╗██║       ██████▌
  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝        ▘▘▝▝            v2.1.0
```

<div align="center">

**Autonomous Terminal AI Agent for Coding**

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![License](https://img.shields.io/github/license/vinz-org/Coderly?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.1.0-blue?style=flat-square)](package.json)

[🌐 Web App](https://vinz-org.github.io/Coderly/) · [📦 Repo](https://github.com/vinz-org/Coderly)

</div>

---

## 📋 Table of Contents

- [Installation](#-installation)
- [Running Coderly](#-running-coderly)
  - [Terminal](#-terminal)
  - [Browser](#-browser)
- [Customizing Skill.MD](#-customizing-skillmd)
- [Tweaking the HTML](#-tweaking-the-html)
- [License](#-license)

---

## 📦 Installation

### Prerequisites

Before installing, make sure you have:

- **Node.js** `v18.0.0` or higher → [Download](https://nodejs.org)
- **npm** (comes with Node.js)
- **Git** → [Download](https://git-scm.com)

### Clone & Install

```bash
# Clone the repository
git clone https://github.com/vinz-org/Coderly.git

# Navigate into the project folder
cd Coderly

# Install dependencies
npm install
```

---

## 🚀 Running Coderly

### 💻 Terminal

#### Option 1 — PowerShell (Windows, one-liner)

No cloning needed. Just paste this into PowerShell and hit Enter:

```powershell
Invoke-RestMethod -Uri "https://raw.githubusercontent.com/Bruhrbx/Coderly/refs/heads/main/run.ps1" | Invoke-Expression
```

#### Option 2 — npm start (after cloning)

```bash
npm start
```

#### Option 3 — Node directly

```bash
node coderly.js
```

> **Note:** Make sure you're inside the `Coderly/` folder before running any of the commands above.

---

### 🌐 Browser

Coderly also has a browser-based interface via `coderly.html`.

**Option 1 — Open locally:**

```bash
# Just open the file in your browser
open coderly.html         # macOS
start coderly.html        # Windows
xdg-open coderly.html     # Linux
```

**Option 2 — Live via GitHub Pages:**

Visit the hosted version directly:

```
https://vinz-org.github.io/Coderly/
```

---

## 🧠 Customizing Skill.MD

The `skills/` folder contains **Skill.MD** files — these are prompt files that tell Coderly *how to behave* for specific tasks (e.g. writing code, reviewing files, debugging).

### Structure

```
skills/
└── your-skill.md   ← each file = one skill/behavior
```

### How to Edit

1. Open any `.md` file inside the `skills/` folder.
2. Edit the content — write clear, specific instructions in plain English.
3. Save the file. Coderly will pick it up on the next run.

### Tips for Writing Skills

- Be **specific** — instead of "write good code", say "write clean JavaScript using ES modules with detailed comments."
- Use **bullet points** to list rules or constraints.
- You can create **multiple skill files** for different workflows (e.g. `debug.md`, `refactor.md`, `review.md`).

### Example `skill.md`

```md
You are a senior JavaScript developer.
- Always use ES module syntax (import/export)
- Add JSDoc comments for every function
- Prefer functional approaches over OOP when possible
- Keep functions under 30 lines
```

---

## 🎨 Tweaking the HTML

`coderly.html` is the standalone browser UI for Coderly. It's a single self-contained file — no build step needed.

### Opening the file

```bash
# Open in your editor
code coderly.html        # VS Code
notepad coderly.html     # Windows Notepad
```

### Common tweaks

| What to change | Where to look in the file |
|---|---|
| Color theme / neon accents | CSS variables at the top (`--color-*`) |
| Font family | `font-family` inside `:root` or `body` |
| Title / branding text | `<title>` tag and any `<h1>` / header elements |
| Layout & spacing | CSS inside `<style>` tag |
| AI behavior / system prompt | The `systemPrompt` variable in `<script>` |
| API endpoint or model | The `fetch()` call inside the script |

### Quick theme change example

Find the CSS variables block (usually near the top of `<style>`):

```css
:root {
  --bg: #0a0a0a;
  --accent: #00ffcc;   /* ← change this for a different neon color */
  --text: #e0e0e0;
}
```

Change `--accent` to any color you want:
- Purple: `#bf00ff`
- Cyan: `#00e5ff`
- Red: `#ff2d55`

---

## 📄 License

This project is licensed under the **GPL-3.0 License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Made by <a href="https://github.com/vinz-org">Vin</a> · <a href="https://yapings.vercel.app">yapings.vercel.app</a>
</div>
