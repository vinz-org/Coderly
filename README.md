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

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/github/license/vinz-org/Coderly?style=for-the-badge&color=blue)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.1.0-6f42c1?style=for-the-badge)](package.json)
[![Stars](https://img.shields.io/github/stars/vinz-org/Coderly?style=for-the-badge&color=yellow)](https://github.com/vinz-org/Coderly/stargazers)

[🌐 Web App](https://vinz-org.github.io/Coderly/) · [📦 Releases](https://github.com/vinz-org/Coderly/releases) · [🐛 Report Bug](https://github.com/vinz-org/Coderly/issues)

</div>

---

## 📋 Table of Contents

- [What is Coderly?](#-what-is-coderly)
- [Features](#-features)
- [Installation](#-installation)
- [API Key Setup](#-api-key-setup)
- [Running Coderly](#-running-coderly)
  - [Terminal](#-terminal)
  - [Browser](#-browser)
- [Project Structure](#-project-structure)
- [Customizing Skill.MD](#-customizing-skillmd)
- [Tweaking the HTML](#-tweaking-the-html)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🤖 What is Coderly?

Coderly is a **CLI-based autonomous AI coding agent** built on Node.js. You give it a task — it plans, writes, edits, and runs code on its own using a tool-use agentic loop, all from your terminal.

It also ships with a **browser-based UI** (`coderly.html`) for a no-install experience.

---

## ✨ Features

- 🔁 **Agentic loop** — reads files, writes code, runs commands autonomously until the task is done
- 🤖 **Multi-provider AI** — supports Gemini, OpenRouter, and HuggingFace out of the box
- 💬 **Multi-chat pages** — manage multiple independent conversation threads
- 🧠 **Skill system** — customize agent behavior via simple `.md` prompt files
- 🎨 **Polished terminal UI** — box-drawing chars, braille spinners, ASCII art branding
- 🌐 **Browser mode** — standalone `coderly.html`, no build step needed
- ⚡ **Zero config start** — one PowerShell command on Windows, or `npm start` after cloning

---

## 📦 Installation

### Prerequisites

Make sure these are installed before starting:

| Tool | Minimum Version | Download |
|---|---|---|
| Node.js | `v18.0.0` | [nodejs.org](https://nodejs.org) |
| npm | comes with Node | — |
| Git | any | [git-scm.com](https://git-scm.com) |

### Clone & Install

```bash
# 1. Clone the repository
git clone https://github.com/vinz-org/Coderly.git

# 2. Enter the project folder
cd Coderly

# 3. Install dependencies
npm install
```

---

## 🔑 API Key Setup

Coderly supports multiple AI providers. Set up whichever one you want to use.

### OpenRouter 🔀

1. Get your key at [openrouter.ai/keys](https://openrouter.ai/keys)
2. Enter the key when prompted on first run.

### HuggingFace 🤗

1. Get your key at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Enter the key when prompted on first run.

> **Tip:** Your API key is saved locally after the first time you enter it. You won't need to re-enter it on future runs.

---

## 🚀 Running Coderly

### 💻 Terminal

#### Option 1 — PowerShell one-liner (Windows, no setup needed)

Open **PowerShell** and paste:

```powershell
Invoke-RestMethod -Uri "https://raw.githubusercontent.com/Bruhrbx/Coderly/refs/heads/main/run.ps1" | Invoke-Expression
```

This downloads and runs Coderly automatically. No cloning required.

#### Option 2 — npm start

```bash
npm start
```

#### Option 3 — Node directly

```bash
node coderly.js
```

> ⚠️ **Make sure you're inside the `Coderly/` folder** before running Option 2 or 3.

---

### 🌐 Browser

Coderly has a self-contained browser UI in `coderly.html`. No server or build step needed.

#### Open locally

```bash
# Windows
start coderly.html

# macOS
open coderly.html

# Linux
xdg-open coderly.html
```

#### Hosted (GitHub Pages)

```
https://vinz-org.github.io/Coderly/
```

---

## 📁 Project Structure

```
Coderly/
├── coderly.js        ← main CLI agent (entry point)
├── coderly.html      ← standalone browser UI
├── run.ps1           ← PowerShell quick-start script
├── package.json
├── skills/
│   └── skill.md      ← agent behavior prompt files
└── README.md
```

---

## 🧠 Customizing Skill.MD

The `skills/` folder contains **Skill.MD** prompt files. These tell Coderly *how to think and behave* for specific tasks — like a personality/instruction file for the AI.

### How to Edit

1. Open any `.md` file inside `skills/`
2. Write your instructions in plain English
3. Save — Coderly picks it up on next run

### Tips for Writing Good Skills

- **Be specific** — avoid vague instructions like "write good code". Say "write clean JavaScript using ES modules with JSDoc comments."
- **Use bullet points** for rules and constraints — the AI follows lists well.
- **Create separate files** for different workflows: `debug.md`, `refactor.md`, `review.md`, etc.
- **Keep it focused** — one skill file = one responsibility.

### Example `skill.md`

```md
You are a senior JavaScript developer.

Rules:
- Always use ES module syntax (import/export)
- Add JSDoc comments for every exported function
- Prefer functional approaches over class-based OOP
- Keep functions under 30 lines
- Handle errors with try/catch — never silently swallow them
```

---

## 🎨 Tweaking the HTML

`coderly.html` is a single self-contained file. Open it in any text editor — no build tools needed.

```bash
code coderly.html       # VS Code
notepad coderly.html    # Windows Notepad
```

### What Can You Change?

| What | Where in the file |
|---|---|
| Color theme / neon accents | CSS variables block near top of `<style>` |
| Font | `font-family` in `:root` or `body` |
| Title / branding | `<title>` and header `<h1>` elements |
| Spacing & layout | CSS inside `<style>` |
| AI system prompt | `systemPrompt` variable in `<script>` |
| AI model / endpoint | The `fetch()` call in `<script>` |

### Changing the Color Theme

Find the `:root` CSS variables block:

```css
:root {
  --bg:     #0a0a0a;
  --accent: #00ffcc;   /* ← neon highlight color */
  --text:   #e0e0e0;
  --dim:    #555555;
}
```

Swap `--accent` to change the whole vibe:

| Color | Hex |
|---|---|
| 🟢 Cyan (default) | `#00ffcc` |
| 🟣 Purple | `#bf00ff` |
| 🔵 Electric Blue | `#00e5ff` |
| 🔴 Red | `#ff2d55` |
| 🟡 Gold | `#ffd700` |

### Changing the AI System Prompt

Find this inside the `<script>` tag:

```js
const systemPrompt = `You are Coderly, an autonomous AI coding agent...`;
```

Edit the string to change how the AI introduces itself, what it prioritizes, or what constraints it follows.

---

## 🛠 Troubleshooting

**`node: command not found`**
→ Node.js isn't installed or not in PATH. [Download here.](https://nodejs.org)

**`npm install` fails**
→ Try running with `--legacy-peer-deps`: `npm install --legacy-peer-deps`

**API key not working**
→ Double-check the key has no extra spaces. Make sure you're using the right provider's key.

**PowerShell one-liner blocked**
→ Run this first to allow scripts: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

**Browser UI shows blank page**
→ Some browsers block local file access. Try opening with VS Code Live Server, or use the [hosted version](https://vinz-org.github.io/Coderly/).

---

## 📄 License

This project is licensed under the **GPL-3.0 License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made by [Vin](https://github.com/vinz-org) · [yapings.vercel.app](https://yapings.vercel.app)

*If this helped you, consider giving the repo a ⭐*

</div>
