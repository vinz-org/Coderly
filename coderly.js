import { GoogleGenAI } from '@google/genai';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';

const execAsync = promisify(exec);
const CONFIG_FILE  = path.join(process.cwd(), '.coderly-config.json');
const SESSIONS_DIR = path.join(process.cwd(), '.coderly-sessions');
const MAX_AGENT_STEPS = 15;

// ─── Colors ───────────────────────────────────────────────────────────────────
const orange     = chalk.hex('#FF6F00');
const orangeBold = chalk.hex('#FF6F00').bold;
const gray       = chalk.gray;
const cyan       = chalk.cyan;
const green      = chalk.green;
const yellow     = chalk.yellow;
const red        = chalk.red;
const white      = chalk.white;

// ─── Spinner ──────────────────────────────────────────────────────────────────
const FRAMES = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];

function createSpinner() {
    let fi = 0, text = '', id = null;
    return {
        start(msg = 'Thinking...') {
            text = msg; fi = 0;
            if (id) clearInterval(id);
            id = setInterval(() => {
                process.stdout.write(`\r  ${cyan(FRAMES[fi++ % FRAMES.length])} ${gray(text)}   `);
            }, 80);
        },
        stop() {
            if (!id) return;
            clearInterval(id); id = null;
            process.stdout.write('\r' + ' '.repeat(Math.max(text.length + 10, 50)) + '\r');
        }
    };
}

// ─── Config ───────────────────────────────────────────────────────────────────
async function getApiKey() {
    try { return JSON.parse(await fs.readFile(CONFIG_FILE, 'utf8')).apiKey || null; }
    catch { return null; }
}
async function saveApiKey(key) {
    await fs.writeFile(CONFIG_FILE, JSON.stringify({ apiKey: key }, null, 2));
}

// ─── Undo ─────────────────────────────────────────────────────────────────────
const undoStack = [];
async function snapshotFile(fp) {
    const full = path.resolve(fp);
    try   { undoStack.push({ full, prev: await fs.readFile(full, 'utf8') }); }
    catch { undoStack.push({ full, prev: null }); }
}
async function performUndo() {
    if (!undoStack.length) return 'Nothing to undo.';
    const { full, prev } = undoStack.pop();
    const rel = path.relative(process.cwd(), full);
    if (prev === null) {
        try { await fs.unlink(full); return `Undone — deleted ${rel}`; }
        catch { return `Nothing to undo for ${rel}`; }
    }
    await fs.writeFile(full, prev, 'utf8');
    return `Undone — restored ${rel}`;
}

// ─── Disk Sessions ────────────────────────────────────────────────────────────
async function ensureSessionsDir() { await fs.mkdir(SESSIONS_DIR, { recursive: true }); }

async function saveSession(name, history) {
    await ensureSessionsDir();
    await fs.writeFile(path.join(SESSIONS_DIR, `${name}.json`), JSON.stringify(history, null, 2));
    return `Session saved as "${name}"`;
}
async function loadSession(name) {
    return JSON.parse(await fs.readFile(path.join(SESSIONS_DIR, `${name}.json`), 'utf8'));
}
async function listSessions() {
    await ensureSessionsDir();
    return (await fs.readdir(SESSIONS_DIR)).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5));
}

// ─── Chat Pages (in-memory) ───────────────────────────────────────────────────
const pages = new Map();

function getPage(name) {
    if (!pages.has(name)) pages.set(name, { history: [], tokenTotal: 0 });
    return pages.get(name);
}

function printPages(current) {
    console.log(`\n${orangeBold('Chat Pages:')}`);
    for (const [name, p] of pages) {
        const active = name === current;
        const msgs   = Math.floor(p.history.length / 2);
        console.log(
            `  ${active ? orange('▶') : gray('·')} ` +
            `${active ? orangeBold(name) : white(name)}  ` +
            gray(`${msgs} msg${msgs !== 1 ? 's' : ''} · ${p.tokenTotal.toLocaleString()} tokens`)
        );
    }
    console.log(`\n  ${gray('/newchat [name]')} ${gray('·')} ${gray('/chat <name>')}\n`);
}

// ─── Tools ────────────────────────────────────────────────────────────────────
const tools = {
    createFolder: async ({ folderPath }) => {
        await fs.mkdir(path.resolve(folderPath), { recursive: true });
        return `Folder created: ${folderPath}`;
    },
    createFile: async ({ filePath, content }) => {
        await snapshotFile(filePath);
        const full = path.resolve(filePath);
        await fs.mkdir(path.dirname(full), { recursive: true });
        await fs.writeFile(full, content, 'utf8');
        return `File created: ${filePath}`;
    },
    readFile: async ({ filePath }) => fs.readFile(path.resolve(filePath), 'utf8'),
    listDir: async ({ dirPath = '.' }) => {
        const entries = await fs.readdir(path.resolve(dirPath), { withFileTypes: true });
        if (!entries.length) return '(empty directory)';
        return entries.map(e => `${e.isDirectory() ? '[dir] ' : '[file]'} ${e.name}`).join('\n');
    },
    editFile: async ({ filePath, oldContent, newContent }) => {
        await snapshotFile(filePath);
        const full = path.resolve(filePath);
        const src  = await fs.readFile(full, 'utf8');
        if (!src.includes(oldContent)) return `Error: exact string not found in ${filePath}. No changes made.`;
        await fs.writeFile(full, src.replace(oldContent, newContent), 'utf8');
        return `File edited: ${filePath}`;
    },
    deleteFile: async ({ filePath }) => {
        await snapshotFile(filePath);
        await fs.unlink(path.resolve(filePath));
        return `File deleted: ${filePath}`;
    },
    runCommand: async ({ command }) => {
        try {
            const { stdout, stderr } = await execAsync(command, { timeout: 120_000 });
            return `Output:\n${stdout}${stderr ? '\nStderr:\n' + stderr : ''}`.trim();
        } catch (e) {
            return `Failed: ${e.message}`;
        }
    }
};

// ─── Tool Declarations ────────────────────────────────────────────────────────
const toolDeclarations = [{
    functionDeclarations: [
        {
            name: 'createFolder',
            description: 'Creates a new directory at the specified path.',
            parameters: {
                type: 'OBJECT',
                properties: { folderPath: { type: 'STRING', description: 'Relative or absolute folder path.' } },
                required: ['folderPath']
            }
        },
        {
            name: 'createFile',
            description: 'Creates a new file with the given content. Supports undo.',
            parameters: {
                type: 'OBJECT',
                properties: {
                    filePath: { type: 'STRING', description: 'Path of the file to create.' },
                    content:  { type: 'STRING', description: 'Text or code content to write.' }
                },
                required: ['filePath', 'content']
            }
        },
        {
            name: 'readFile',
            description: 'Reads and returns the full content of an existing file. Always use this before editing.',
            parameters: {
                type: 'OBJECT',
                properties: { filePath: { type: 'STRING', description: 'Path to the file to read.' } },
                required: ['filePath']
            }
        },
        {
            name: 'listDir',
            description: 'Lists all files and subfolders in a directory. Use first to understand project structure.',
            parameters: {
                type: 'OBJECT',
                properties: { dirPath: { type: 'STRING', description: 'Directory to list. Defaults to "." (current directory).' } },
                required: []
            }
        },
        {
            name: 'editFile',
            description: 'Makes a targeted edit to an existing file by replacing an exact string. Prefers over full rewrite. Supports undo.',
            parameters: {
                type: 'OBJECT',
                properties: {
                    filePath:   { type: 'STRING', description: 'Path to the file.' },
                    oldContent: { type: 'STRING', description: 'The exact string to find. Must match perfectly.' },
                    newContent: { type: 'STRING', description: 'The replacement string.' }
                },
                required: ['filePath', 'oldContent', 'newContent']
            }
        },
        {
            name: 'deleteFile',
            description: 'Deletes a file permanently. Supports undo.',
            parameters: {
                type: 'OBJECT',
                properties: { filePath: { type: 'STRING', description: 'Path of the file to delete.' } },
                required: ['filePath']
            }
        },
        {
            name: 'runCommand',
            description: 'Executes a shell command (npm install, node, git, etc.).',
            parameters: {
                type: 'OBJECT',
                properties: { command: { type: 'STRING', description: 'The shell command to execute.' } },
                required: ['command']
            }
        }
    ]
}];

// ─── Display Helpers ──────────────────────────────────────────────────────────
const ICONS = {
    createFolder: '📁', createFile: '📝', readFile:   '📖',
    listDir:      '📋', editFile:   '✏️ ', deleteFile: '🗑️ ',
    runCommand:   '⚡'
};

function printToolAction(name, args) {
    const label = args.command ?? args.filePath ?? args.folderPath ?? args.dirPath ?? '';
    console.log(`  ${yellow((ICONS[name] ?? '⚙️') + ' ' + name)}${label ? gray(' › ' + label) : ''}`);
}

// Helper: detect package manager install commands
const PKG_RE = /^\s*(npm|yarn|pnpm|bun)\s+(install|i|add|ci)\b/;
function getInstallLabel(command = '') {
    const pkg = command.replace(/^\s*(npm|yarn|pnpm|bun)\s+(install|i|add|ci)\s*/, '').trim();
    return pkg || 'packages';
}

// ─── Agentic Loop ─────────────────────────────────────────────────────────────
async function runAgentLoop(ai, sysInstr, history, tokenTotal) {
    let step = 0, tokens = tokenTotal;
    const spinner = createSpinner();

    while (step < MAX_AGENT_STEPS) {
        // ── AI call ──────────────────────────────────────────────────────────
        spinner.start('Thinking...');
        const resp = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: history,
            config: { systemInstruction: sysInstr, tools: toolDeclarations }
        });
        spinner.stop();

        const usage = resp.usageMetadata;
        tokens += usage?.totalTokenCount ?? usage?.total_token_count ?? 0;

        const calls = resp.functionCalls;

        // No function calls → final text reply, done
        if (!calls?.length) {
            const txt = resp.text ?? '';
            if (txt) {
                console.log(white(`\n${txt}`));
                history.push({ role: 'model', parts: [{ text: txt }] });
            }
            break;
        }

        step++;
        console.log(orange(`\n── Step ${step} ${'─'.repeat(50 - String(step).length)}`));

        history.push({
            role: 'model',
            parts: calls.map(c => ({ functionCall: { name: c.name, args: c.args } }))
        });

        // ── Execute tools ─────────────────────────────────────────────────────
        const responses = [];
        for (const { name, args } of calls) {
            printToolAction(name, args);

            // Spinner for commands (special label for package installs)
            if (name === 'runCommand') {
                const cmd = args.command ?? '';
                if (PKG_RE.test(cmd)) {
                    spinner.start(`Installing ${getInstallLabel(cmd)}...`);
                } else {
                    const short = cmd.length > 45 ? cmd.slice(0, 42) + '...' : cmd;
                    spinner.start(`Running › ${short}`);
                }
            }

            let result;
            if (tools[name]) {
                result = await tools[name](args);
                if (name === 'runCommand') spinner.stop();

                if (name === 'readFile') {
                    console.log(green(`     ✔ Read ${args.filePath} (${result.length} chars)`));
                } else if (name === 'listDir') {
                    console.log(green(`     ✔ Listed ${result.split('\n').length} entries`));
                } else {
                    // trim long output for display
                    const display = result.length > 120 ? result.slice(0, 117) + '...' : result;
                    console.log(green(`     ✔ ${display}`));
                }
            } else {
                result = `Unknown tool: ${name}`;
                console.log(red(`     ✖ ${result}`));
            }

            responses.push({ functionResponse: { name, response: { result } } });
        }

        history.push({ role: 'user', parts: responses });
    }

    if (step >= MAX_AGENT_STEPS) {
        console.log(yellow(`\n⚠️  Reached max agent steps (${MAX_AGENT_STEPS}). Stopping.`));
    }

    return tokens;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.clear();
    const username = os.userInfo().username;
    const cwd      = process.cwd();

    // ── Header box (with ASCII character) ────────────────────────────────────
    console.log(orange('┌──────────────────────────────────────────────────────────┐'));
    console.log(`${orange('│')}  ${orange('▐▛███▜▌')}  ${orangeBold('●  Coderly')}                         ${gray('v2.0.0')}      ${orange('│')}`);
    console.log(`${orange('│')}  ${orange('▜█████▛▘')} ${gray('Autonomous Terminal AI Agent for Coding')}        ${orange('│')}`);
    console.log(`${orange('│')}   ${orange('▘▘ ▝▝')}                                                  ${orange('│')}`);
    console.log(orange('└──────────────────────────────────────────────────────────┘'));

    console.log(`\nHello, ${cyan(username)}  ·  ${gray('gemini-2.5-flash')}`);
    console.log(`${gray('Type your request  ·  ')}${orange('/help')}${gray(' for commands  ·  Ctrl+C to exit')}`);
    console.log(`${gray('Running in')}  ${cyan(cwd)}`);
    console.log(gray('................................................................\n'));

    // ── API key setup ─────────────────────────────────────────────────────────
    let apiKey = await getApiKey();
    if (!apiKey) {
        console.log(yellow('⚠️  No API key found.'));
        const { key } = await inquirer.prompt([{ type: 'input', name: 'key', message: 'Enter your Gemini API Key:' }]);
        apiKey = key.trim();
        await saveApiKey(apiKey);
        console.log(green('✔ API Key saved!\n'));
    }

    const ai = new GoogleGenAI({ apiKey });

    // ── Baca Instruksi dari skill.md ──────────────────────────────────────────
    let sysInstr = '';
    try {
        const skillPath = path.join(process.cwd(), 'skills/skill.md');
        sysInstr = await fs.readFile(skillPath, 'utf8');
    } catch (err) {
        console.log(yellow('⚠️  File skill.md tidak ditemukan. Menggunakan instruksi bawaan.'));
        sysInstr = `You are Coderly, an autonomous terminal AI coding agent.

TOOLS AVAILABLE: listDir, readFile, createFile, editFile, deleteFile, createFolder, runCommand

BEHAVIOR RULES:
1. Always start with listDir to understand project structure before making changes
2. Always readFile before editFile — never assume file content
3. Prefer editFile for targeted changes; only use createFile for new files
4. After changes, verify by reading the file or running relevant commands
5. Chain tools autonomously to complete tasks end-to-end without asking for confirmation
6. Keep final text summaries concise — list what was done, not what you plan to do`;
    }

    // ── Chat page state ───────────────────────────────────────────────────────
    let currentPage = 'main';
    getPage('main');

    // ── REPL ─────────────────────────────────────────────────────────────────
    while (true) {
        const page = getPage(currentPage);

        const { userInput } = await inquirer.prompt([{
            type:    'input',
            name:    'userInput',
            message: (
                `\n${cyan(username)} ` +
                `${orange(`[${currentPage}]`)} ` +
                `${gray(`[${page.tokenTotal.toLocaleString()} tokens]`)} in ${orange('~')}\n` +
                `${orangeBold('➔')} `
            )
        }]);

        const trimmed = userInput.trim();
        if (!trimmed) continue;
        const lower = trimmed.toLowerCase();

        // ── Built-in commands ─────────────────────────────────────────────────
        if (lower === '/help') {
            console.log(`
${orangeBold('Commands:')}
  ${orange('/help')}               ${gray('Show this help')}
  ${orange('/clear')}              ${gray('Reset current chat history & tokens')}
  ${orange('/undo')}               ${gray('Undo the last file operation')}
  ${orange('/tokens')}             ${gray('Show token usage for current chat')}
  ${orange('/save [name]')}        ${gray('Save current chat history to disk')}
  ${orange('/load <name>')}        ${gray('Load a session from disk into current chat')}
  ${orange('/sessions')}           ${gray('List saved sessions on disk')}
  ${orange('/config')}             ${gray('Update Gemini API key')}

${orangeBold('Chat Pages:')}
  ${orange('/chats')}              ${gray('List all open chat pages')}
  ${orange('/newchat [name]')}     ${gray('Create a new chat page and switch to it')}
  ${orange('/chat <name>')}        ${gray('Switch to an existing chat page')}
  ${orange('/closechat')}          ${gray('Close current page and return to main')}

  ${orange('exit / quit')}         ${gray('Exit Coderly')}
`);
            continue;
        }

        if (lower === 'exit' || lower === 'quit' || lower === '/exit') {
            console.log(orange('\nGoodbye! Happy coding! 🚀'));
            break;
        }

        if (lower === '/clear') {
            page.history.length = 0; page.tokenTotal = 0;
            console.log(green(`✔ Chat "${currentPage}" cleared.`));
            continue;
        }

        if (lower === '/undo') {
            console.log(green(`✔ ${await performUndo()}`));
            continue;
        }

        if (lower === '/tokens') {
            console.log(gray(`  "${currentPage}" · ${orange(page.tokenTotal.toLocaleString())} tokens used`));
            continue;
        }

        if (lower === '/sessions') {
            const ss = await listSessions();
            if (!ss.length) { console.log(gray('No saved sessions.')); }
            else { console.log(gray('Saved sessions:')); ss.forEach(s => console.log(`  ${orange('·')} ${s}`)); }
            continue;
        }

        if (lower === '/save' || lower.startsWith('/save ')) {
            const name = trimmed.slice(5).trim() || `session-${Date.now()}`;
            console.log(green(`✔ ${await saveSession(name, page.history)}`));
            continue;
        }

        if (lower === '/load' || lower.startsWith('/load ')) {
            const name = trimmed.slice(5).trim();
            if (!name) {
                const ss = await listSessions();
                if (!ss.length) { console.log(gray('No saved sessions. Use /save [name] first.')); }
                else { ss.forEach(s => console.log(`  ${orange('·')} ${s}`)); console.log(gray('Usage: /load <name>')); }
                continue;
            }
            try {
                const loaded = await loadSession(name);
                page.history.length = 0; page.history.push(...loaded);
                console.log(green(`✔ Session "${name}" loaded (${loaded.length} messages).`));
            } catch { console.log(red(`✖ Session "${name}" not found.`)); }
            continue;
        }

        if (lower === '/config' || lower === 'set key') {
            const { key } = await inquirer.prompt([{ type: 'input', name: 'key', message: 'Enter new Gemini API Key:' }]);
            await saveApiKey(key.trim());
            console.log(green('✔ API Key updated. Please restart.'));
            break;
        }

        // ── Chat page commands ─────────────────────────────────────────────────
        if (lower === '/chats') {
            printPages(currentPage);
            continue;
        }

        if (lower === '/newchat' || lower.startsWith('/newchat ')) {
            const name = trimmed.slice(8).trim() || `chat-${pages.size + 1}`;
            getPage(name); currentPage = name;
            console.log(green(`✔ Created & switched to "${name}"`));
            continue;
        }

        if (lower.startsWith('/chat ')) {
            const name = trimmed.slice(6).trim();
            if (!name) { console.log(gray('Usage: /chat <name>')); continue; }
            if (!pages.has(name)) {
                console.log(red(`✖ Chat "${name}" not found. Use /newchat ${name} to create it.`));
                continue;
            }
            currentPage = name;
            const p = pages.get(name);
            console.log(green(`✔ Switched to "${name}" (${Math.floor(p.history.length / 2)} msgs)`));
            continue;
        }

        if (lower === '/closechat') {
            if (currentPage === 'main') { console.log(gray('Cannot close the main chat.')); continue; }
            pages.delete(currentPage); currentPage = 'main';
            console.log(green('✔ Chat closed. Back to "main".'));
            continue;
        }

        // ── Agent ─────────────────────────────────────────────────────────────
        page.history.push({ role: 'user', parts: [{ text: trimmed }] });
        try {
            page.tokenTotal = await runAgentLoop(ai, sysInstr, page.history, page.tokenTotal);
        } catch (err) {
            page.history.pop();
            console.error(red(`\n✖ Error: ${err.message}\n`));
        }
    }
}

main();
