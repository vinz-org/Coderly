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
const blue       = chalk.hex('#38BDF8');

// ─── Spinner ──────────────────────────────────────────────────────────────────
const FRAMES = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];

function createSpinner() {
    let fi = 0, text = '', id = null;
    return {
        start(msg = '🤔 Thinking...') {
            text = msg; fi = 0;
            if (id) clearInterval(id);
            id = setInterval(() => {
                process.stdout.write(`\r  ${orange(FRAMES[fi++ % FRAMES.length])} ${gray(text)}   `);
            }, 80);
        },
        stop() {
            if (!id) return;
            clearInterval(id); id = null;
            process.stdout.write(`\r` + ' '.repeat(Math.max(text.length + 10, 50)) + '\r');
        }
    };
}

// ─── Config ───────────────────────────────────────────────────────────────────
async function getConfig() {
    try { return JSON.parse(await fs.readFile(CONFIG_FILE, 'utf8')); }
    catch { return {}; }
}

async function saveConfig(cfg) {
    await fs.writeFile(CONFIG_FILE, JSON.stringify(cfg, null, 2));
}

// Backward-compat: kalau config lama (hanya punya apiKey flat), migrate otomatis
async function migrateOldConfig(cfg) {
    if (cfg.apiKey && !cfg.provider) {
        const migrated = {
            provider: 'openrouter',
            openrouter: { apiKey: cfg.apiKey },
            huggingface: {}
        };
        await saveConfig(migrated);
        return migrated;
    }
    return cfg;
}

// ─── HuggingFace URL Resolver ─────────────────────────────────────────────────
// Menerima berbagai format:
//   • https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2  → model page URL
//   • mistralai/Mistral-7B-Instruct-v0.2                         → model ID
//   • https://api-inference.huggingface.co/models/xxx             → inference API URL
//   • https://xxx.endpoints.huggingface.cloud                     → custom endpoint
//   • URL langsung berisi /v1/chat/completions                    → pakai as-is
function resolveHFEndpoint(input) {
    const s = input.trim().replace(/\/$/, '');

    // Sudah endpoint lengkap
    if (s.includes('/v1/chat/completions')) return s;

    // URL halaman model HuggingFace
    if (s.startsWith('https://huggingface.co/')) {
        const modelId = s.replace('https://huggingface.co/', '').split('?')[0];
        return `https://api-inference.huggingface.co/models/${modelId}/v1/chat/completions`;
    }

    // URL inference API resmi (tanpa /v1/chat/completions)
    if (s.startsWith('https://api-inference.huggingface.co/models/')) {
        return `${s}/v1/chat/completions`;
    }

    // Custom Inference Endpoint (*.endpoints.huggingface.cloud)
    if (s.startsWith('https://') && s.includes('endpoints.huggingface.cloud')) {
        return `${s}/v1/chat/completions`;
    }

    // URL https lain (endpoint custom apapun yang OpenAI-compatible)
    if (s.startsWith('https://') || s.startsWith('http://')) {
        return `${s}/v1/chat/completions`;
    }

    // Model ID mentah: "org/model-name"
    if (s.includes('/')) {
        return `https://api-inference.huggingface.co/models/${s}/v1/chat/completions`;
    }

    // Fallback: anggap model ID tanpa org
    return `https://api-inference.huggingface.co/models/${s}/v1/chat/completions`;
}

// Ekstrak nama model yang readable dari endpoint URL
function extractModelLabel(url) {
    try {
        const u = new URL(url);
        // api-inference.huggingface.co/models/{org}/{model}/v1/chat/completions
        const m = u.pathname.match(/\/models\/(.+?)\/v1\/chat\/completions/);
        if (m) return m[1];
        // endpoints.huggingface.cloud: pakai hostname
        if (u.hostname.includes('endpoints.huggingface.cloud')) return u.hostname.split('.')[0];
        return u.hostname;
    } catch {
        return url.slice(0, 40);
    }
}

// ─── Provider Setup Wizard ────────────────────────────────────────────────────
async function setupProvider() {
    console.log(yellow('\n⚠️  No configuration found. Let\'s set up Coderly.\n'));

    const { provider } = await inquirer.prompt([{
        type:    'list',
        name:    'provider',
        message: 'Choose AI provider:',
        choices: [
            { name: `${orange('OpenRouter')}  ${gray('(gpt-4o, Claude, Gemini, dll via openrouter.ai)')}`, value: 'openrouter' },
            { name: `${blue('HuggingFace')} ${gray('(model via URL, model ID, atau Inference Endpoint)')}`, value: 'huggingface' }
        ]
    }]);

    const cfg = {
        provider,
        openrouter:  {},
        huggingface: {}
    };

    if (provider === 'openrouter') {
        const { key } = await inquirer.prompt([{ type: 'password', name: 'key', message: 'Enter OpenRouter API Key:', mask: '●' }]);
        const { model } = await inquirer.prompt([{
            type:    'input',
            name:    'model',
            message: 'Model name (default: gpt-oss-120b):',
            default: 'gpt-oss-120b'
        }]);
        cfg.openrouter = { apiKey: key.trim(), model: model.trim() };
    } else {
        const { key } = await inquirer.prompt([{ type: 'password', name: 'key', message: 'Enter HuggingFace API Token (hf_...):', mask: '●' }]);
        const { urlInput } = await inquirer.prompt([{
            type:    'input',
            name:    'urlInput',
            message: 'Model URL / ID / Endpoint:\n  ' + gray('Contoh:') + '\n  ' +
                     gray('  • https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2') + '\n  ' +
                     gray('  • mistralai/Mistral-7B-Instruct-v0.2') + '\n  ' +
                     gray('  • https://xxx.endpoints.huggingface.cloud') + '\n' +
                     '❯ '
        }]);
        const endpoint = resolveHFEndpoint(urlInput.trim());
        cfg.huggingface = { apiKey: key.trim(), endpoint, rawInput: urlInput.trim() };
        console.log(green(`\n✔ Endpoint: ${gray(endpoint)}`));
    }

    await saveConfig(cfg);
    console.log(green('✔ Konfigurasi tersimpan!\n'));
    return cfg;
}

// ─── /config Wizard ───────────────────────────────────────────────────────────
async function reconfigureProvider(cfg) {
    const { action } = await inquirer.prompt([{
        type:    'list',
        name:    'action',
        message: 'Apa yang ingin diubah?',
        choices: [
            { name: 'Ganti provider (OpenRouter ↔ HuggingFace)', value: 'switch' },
            { name: 'Update API Key provider saat ini',           value: 'key' },
            { name: 'Update model/URL HuggingFace',              value: 'url' },
            { name: 'Update model OpenRouter',                    value: 'ormodel' },
            { name: 'Lihat konfigurasi saat ini',                value: 'show' },
            { name: 'Batal',                                      value: 'cancel' }
        ]
    }]);

    if (action === 'cancel') return cfg;

    if (action === 'show') {
        const p = cfg.provider;
        console.log(`\n  Provider : ${p === 'openrouter' ? orange('OpenRouter') : blue('HuggingFace')}`);
        if (p === 'openrouter') {
            console.log(`  API Key  : ${gray('●'.repeat(8) + (cfg.openrouter?.apiKey?.slice(-4) ?? '???'))}`);
            console.log(`  Model    : ${orange(cfg.openrouter?.model ?? 'gpt-oss-120b')}`);
        } else {
            console.log(`  API Token: ${gray('●'.repeat(8) + (cfg.huggingface?.apiKey?.slice(-4) ?? '???'))}`);
            console.log(`  Input    : ${blue(cfg.huggingface?.rawInput ?? '-')}`);
            console.log(`  Endpoint : ${gray(cfg.huggingface?.endpoint ?? '-')}`);
        }
        console.log('');
        return cfg;
    }

    if (action === 'switch') {
        return setupProvider();
    }

    if (action === 'key') {
        const { key } = await inquirer.prompt([{ type: 'password', name: 'key', message: `New API Key:`, mask: '●' }]);
        if (cfg.provider === 'openrouter') cfg.openrouter.apiKey = key.trim();
        else cfg.huggingface.apiKey = key.trim();
        await saveConfig(cfg);
        console.log(green('✔ API Key diupdate. Silakan restart.'));
        return cfg;
    }

    if (action === 'url') {
        if (cfg.provider !== 'huggingface') {
            console.log(yellow('Provider saat ini bukan HuggingFace.'));
            return cfg;
        }
        const { urlInput } = await inquirer.prompt([{ type: 'input', name: 'urlInput', message: 'Model URL / ID / Endpoint baru:' }]);
        const endpoint = resolveHFEndpoint(urlInput.trim());
        cfg.huggingface.endpoint  = endpoint;
        cfg.huggingface.rawInput  = urlInput.trim();
        await saveConfig(cfg);
        console.log(green(`✔ Endpoint diupdate: ${gray(endpoint)}`));
        return cfg;
    }

    if (action === 'ormodel') {
        if (cfg.provider !== 'openrouter') {
            console.log(yellow('Provider saat ini bukan OpenRouter.'));
            return cfg;
        }
        const { model } = await inquirer.prompt([{ type: 'input', name: 'model', message: 'Model name baru:' }]);
        cfg.openrouter.model = model.trim();
        await saveConfig(cfg);
        console.log(green(`✔ Model OpenRouter diupdate ke: ${orange(model.trim())}`));
        return cfg;
    }

    return cfg;
}

// ─── Unified AI Caller ────────────────────────────────────────────────────────
async function callAI(cfg, messages, tools) {
    const provider = cfg.provider ?? 'openrouter';

    // ── OpenRouter ──────────────────────────────────────────────────────────
    if (provider === 'openrouter') {
        const modelName = cfg.openrouter?.model ?? 'gpt-oss-120b';
        const apiKey    = cfg.openrouter?.apiKey;
        if (!apiKey) throw new Error('OpenRouter API Key tidak ditemukan. Jalankan /config.');

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method:  'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type':  'application/json',
                'HTTP-Referer':  'https://github.com/coderly',
                'X-Title':       'Coderly Terminal Agent'
            },
            body: JSON.stringify({ model: modelName, messages, tools })
        });

        if (!res.ok) throw new Error(`OpenRouter Error (${res.status}): ${await res.text()}`);
        return await res.json();
    }

    // ── HuggingFace ─────────────────────────────────────────────────────────
    if (provider === 'huggingface') {
        const apiKey   = cfg.huggingface?.apiKey;
        const endpoint = cfg.huggingface?.endpoint;
        if (!apiKey)   throw new Error('HuggingFace API Token tidak ditemukan. Jalankan /config.');
        if (!endpoint) throw new Error('HuggingFace endpoint tidak dikonfigurasi. Jalankan /config.');

        const res = await fetch(endpoint, {
            method:  'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type':  'application/json'
            },
            body: JSON.stringify({
                model:      'tgi',   // required by HF Inference API
                messages,
                tools,
                max_tokens: 4096,
                stream:     false
            })
        });

        if (!res.ok) {
            const errText = await res.text();
            // Model tidak support tool calling? Kasih pesan lebih jelas
            if (res.status === 422 || errText.includes('tool')) {
                throw new Error(
                    `HuggingFace Error (${res.status}): Model mungkin tidak mendukung tool calling.\n` +
                    `Coba model yang support function calling seperti mistralai/Mixtral-8x7B-Instruct-v0.1\n` +
                    `Detail: ${errText.slice(0, 200)}`
                );
            }
            throw new Error(`HuggingFace Error (${res.status}): ${errText.slice(0, 300)}`);
        }

        const data = await res.json();

        // HF kadang return error dalam body dengan status 200
        if (data.error) throw new Error(`HuggingFace: ${data.error}`);

        return data;
    }

    throw new Error(`Provider tidak dikenal: ${provider}`);
}

// Helper: label provider & model untuk ditampilkan di header/prompt
function getProviderLabel(cfg) {
    if (cfg.provider === 'huggingface') {
        const raw = cfg.huggingface?.rawInput ?? cfg.huggingface?.endpoint ?? 'HuggingFace';
        return `${blue('HF')} ${gray('›')} ${blue(extractModelLabel(cfg.huggingface?.endpoint ?? raw))}`;
    }
    return `${orange('OR')} ${gray('›')} ${orange(cfg.openrouter?.model ?? 'gpt-oss-120b')}`;
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
        return entries.map(e => `${e.isDirectory() ? '[dir]' : '[file]'} ${e.name}`).join('\n');
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

// ─── Tool Declarations (OpenAI/OpenRouter/HuggingFace compatible) ─────────────
const openRouterTools = [
    {
        type: 'function',
        function: {
            name: 'createFolder',
            description: 'Creates a new directory at the specified path.',
            parameters: {
                type: 'object',
                properties: { folderPath: { type: 'string', description: 'Relative or absolute folder path.' } },
                required: ['folderPath']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'createFile',
            description: 'Creates a new file with the given content. Supports undo.',
            parameters: {
                type: 'object',
                properties: {
                    filePath: { type: 'string', description: 'Path of the file to create.' },
                    content:  { type: 'string', description: 'Text or code content to write.' }
                },
                required: ['filePath', 'content']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'readFile',
            description: 'Reads and returns the full content of an existing file. Always use this before editing.',
            parameters: {
                type: 'object',
                properties: { filePath: { type: 'string', description: 'Path to the file to read.' } },
                required: ['filePath']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'listDir',
            description: 'Lists all files and subfolders in a directory. Use first to understand project structure.',
            parameters: {
                type: 'object',
                properties: { dirPath: { type: 'string', description: 'Directory to list. Defaults to "." (current directory).' } },
                required: []
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'editFile',
            description: 'Makes a targeted edit to an existing file by replacing an exact string. Prefers over full rewrite. Supports undo.',
            parameters: {
                type: 'object',
                properties: {
                    filePath:   { type: 'string', description: 'Path to the file.' },
                    oldContent: { type: 'string', description: 'The exact string to find. Must match perfectly.' },
                    newContent: { type: 'string', description: 'The replacement string.' }
                },
                required: ['filePath', 'oldContent', 'newContent']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'deleteFile',
            description: 'Deletes a file permanently. Supports undo.',
            parameters: {
                type: 'object',
                properties: { filePath: { type: 'string', description: 'Path of the file to delete.' } },
                required: ['filePath']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'runCommand',
            description: 'Executes a shell command (npm install, node, git, etc.).',
            parameters: {
                type: 'object',
                properties: { command: { type: 'string', description: 'The shell command to execute.' } },
                required: ['command']
            }
        }
    }
];

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

const PKG_RE = /^\s*(npm|yarn|pnpm|bun)\s+(install|i|add|ci)\b/;
function getInstallLabel(command = '') {
    const pkg = command.replace(/^\s*(npm|yarn|pnpm|bun)\s+(install|i|add|ci)\s*/, '').trim();
    return pkg || 'packages';
}

// ─── Agentic Loop ─────────────────────────────────────────────────────────────
async function runAgentLoop(cfg, sysInstr, history, tokenTotal) {
    let step = 0, tokens = tokenTotal;
    const spinner = createSpinner();

    while (step < MAX_AGENT_STEPS) {
        spinner.start('Thinking...');

        const messages = [{ role: 'system', content: sysInstr }, ...history];

        let data;
        try {
            data = await callAI(cfg, messages, openRouterTools);
        } catch (err) {
            spinner.stop();
            throw err;
        }

        spinner.stop();

        const choice  = data.choices?.[0];
        const message = choice?.message;

        if (!message) throw new Error('Invalid response payload received from AI provider.');

        tokens += data.usage?.total_tokens ?? 0;

        const toolCalls = message.tool_calls;

        if (!toolCalls || toolCalls.length === 0) {
            const txt = message.content ?? '';
            if (txt) {
                console.log(white(`\n${txt}`));
                history.push({ role: 'assistant', content: txt });
            }
            break;
        }

        step++;
        console.log(orange(`\n── Step ${step} ${'─'.repeat(50 - String(step).length)}`));

        history.push(message);

        // ── Execute tools ─────────────────────────────────────────────────────
        for (const call of toolCalls) {
            const name = call.function.name;
            let args = {};
            try { args = JSON.parse(call.function.arguments); } catch { args = {}; }

            printToolAction(name, args);

            if (name === 'runCommand') {
                const cmd = args.command ?? '';
                if (PKG_RE.test(cmd)) spinner.start(`Installing ${getInstallLabel(cmd)}...`);
                else {
                    const short = cmd.length > 45 ? cmd.slice(0, 42) + '...' : cmd;
                    spinner.start(`Running › ${short}`);
                }
            }

            let result;
            if (tools[name]) {
                result = await tools[name](args);
                if (name === 'runCommand') spinner.stop();

                if (name === 'readFile')
                    console.log(green(`     ✔ Read ${args.filePath} (${result.length} chars)`));
                else if (name === 'listDir')
                    console.log(green(`     ✔ Listed ${result.split('\n').length} entries`));
                else {
                    const display = result.length > 120 ? result.slice(0, 117) + '...' : result;
                    console.log(green(`     ✔ ${display}`));
                }
            } else {
                result = `Unknown tool: ${name}`;
                console.log(red(`     ✖ ${result}`));
            }

            history.push({
                role:         'tool',
                tool_call_id: call.id,
                name:         name,
                content:      result
            });
        }
    }

    if (step >= MAX_AGENT_STEPS)
        console.log(yellow(`\n⚠️  Reached max agent steps (${MAX_AGENT_STEPS}). Stopping.`));

    return tokens;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.clear();
    const username = os.userInfo().username;
    const cwd      = process.cwd();

    console.log(orange('┌──────────────────────────────────────────────────────────┐'));
    console.log(`${orange('│')}  ${orange('▐█▛██▜▌')}  ${orangeBold('●  Coderly')}                          ${gray('v2.1.0')}     ${orange('│')}`);
    console.log(`${orange('│')}  ${orange('▐█████▌')}  ${gray('Autonomous Terminal AI Agent for Coding')}        ${orange('│')}`);
    console.log(`${orange('│')}  ${orange(' ▘▘▝▝  ')}  ${gray('Providers: OpenRouter · HuggingFace')}            ${orange('│')}`);
    console.log(orange('└──────────────────────────────────────────────────────────┘'));

    // ── Load / migrate config ──────────────────────────────────────────────────
    let cfg = await getConfig();
    cfg = await migrateOldConfig(cfg);

    // Belum punya config sama sekali → setup wizard
    const needsSetup = !cfg.provider || (
        cfg.provider === 'openrouter'  && !cfg.openrouter?.apiKey  ||
        cfg.provider === 'huggingface' && (!cfg.huggingface?.apiKey || !cfg.huggingface?.endpoint)
    );
    if (needsSetup) cfg = await setupProvider();

    console.log(`\nHello, ${cyan(username)}  ·  ${getProviderLabel(cfg)}`);
    console.log(`${gray('Type your request  ·  ')}${orange('/help')}${gray(' for commands  ·  Ctrl+C to exit')}`);
    console.log(`${gray('Running in')}  ${cyan(cwd)}`);
    console.log(gray('................................................................\n'));

    // ── System Prompt (skill.md) ───────────────────────────────────────────────
    let sysInstr = '';
    try {
        sysInstr = await fs.readFile(path.join(cwd, 'skills/skill.md'), 'utf8');
    } catch {
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

    let currentPage = 'main';
    getPage('main');

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

        // ── Commands ──────────────────────────────────────────────────────────
        if (lower === '/help') {
            console.log(`
${orangeBold('Commands:')}
  ${orange('/help')}                ${gray('Show this help')}
  ${orange('/clear')}               ${gray('Reset current chat history & tokens')}
  ${orange('/undo')}                ${gray('Undo the last file operation')}
  ${orange('/tokens')}              ${gray('Show token usage for current chat')}
  ${orange('/save [name]')}         ${gray('Save current chat history to disk')}
  ${orange('/load <name>')}         ${gray('Load a session from disk into current chat')}
  ${orange('/sessions')}            ${gray('List saved sessions on disk')}
  ${orange('/config')}              ${gray('Update provider, API key, atau model/URL')}
  ${orange('/provider')}            ${gray('Tampilkan provider & model aktif')}

${orangeBold('Chat Pages:')}
  ${orange('/chats')}               ${gray('List all open chat pages')}
  ${orange('/newchat [name]')}      ${gray('Create a new chat page and switch to it')}
  ${orange('/chat <name>')}         ${gray('Switch to an existing chat page')}
  ${orange('/closechat')}           ${gray('Close current page and return to main')}

${orangeBold('HuggingFace URL formats:')}
  ${blue('https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2')}
  ${blue('mistralai/Mistral-7B-Instruct-v0.2')}
  ${blue('https://xxx.endpoints.huggingface.cloud')}

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
            if (!ss.length) console.log(gray('No saved sessions.'));
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
                if (!ss.length) console.log(gray('No saved sessions. Use /save [name] first.'));
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
            cfg = await reconfigureProvider(cfg);
            continue;
        }

        if (lower === '/provider') {
            console.log(`\n  Provider aktif: ${getProviderLabel(cfg)}\n`);
            if (cfg.provider === 'huggingface') {
                console.log(`  Endpoint : ${gray(cfg.huggingface?.endpoint ?? '-')}`);
            }
            console.log('');
            continue;
        }

        if (lower === '/chats') { printPages(currentPage); continue; }

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
        page.history.push({ role: 'user', content: trimmed });
        try {
            page.tokenTotal = await runAgentLoop(cfg, sysInstr, page.history, page.tokenTotal);
        } catch (err) {
            page.history.pop();
            console.error(red(`\n✖ Error: ${err.message}\n`));
        }
    }
}

//═══════════════════════════════════════════════════════════
//  Web Server Mode ( --web flag )
// ═══════════════════════════════════════════════════════════
import { createServer } from 'http';
import { fileURLToPath } from 'url';


async function startWebServer() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    // Load config
    let cfg = await getConfig();
    cfg = await migrateOldConfig(cfg);

    const needsSetup = !cfg.provider || (
        cfg.provider === 'openrouter'  && !cfg.openrouter?.apiKey  ||
        cfg.provider === 'huggingface' && (!cfg.huggingface?.apiKey || !cfg.huggingface?.endpoint) ||
        cfg.provider === 'local'       && !cfg.local?.endpoint
    );
    if (needsSetup) {
        console.log(yellow('\n⚠️  No configuration found. Run CLI mode first to configure:'));
        console.log(gray('   node coderly.js'));
        console.log(gray('   Then restart with --web flag.\n'));
        // Auto-setup default local supaya bisa lanjut
        cfg = {
            provider: 'local',
            openrouter: {},
            huggingface: {},
            local: { endpoint: 'http://localhost:11434/v1/chat/completions', baseUrl: 'http://localhost:11434', model: '', apiKey: '' }
        };
        await saveConfig(cfg);
    }

    // Load system instruction
    let sysInstr = '';
    try { sysInstr = await fs.readFile(path.join(process.cwd(), 'skills/skill.md'), 'utf8'); }
    catch {
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

    // In-memory state untuk web sessions
    const webSessions = new Map();

    // ── SSE Agent Loop ─────────────────────────────────────────────────────
    async function runAgentLoopSSE(cfg, sysInstr, history, tokenTotal, sendEvent) {
        let step = 0, tokens = tokenTotal;

        while (step < MAX_AGENT_STEPS) {
            sendEvent('status', { text: 'Thinking...' });

            const messages = [{ role: 'system', content: sysInstr }, ...history];
            let data;
            try {
                data = await callAI(cfg, messages, openRouterTools);
            } catch (err) {
                sendEvent('error', { message: err.message });
                return tokens;
            }

            const choice  = data.choices?.[0];
            const message = choice?.message;
            if (!message) {
                sendEvent('error', { message: 'Invalid response from AI provider.' });
                return tokens;
            }

            tokens += data.usage?.total_tokens ?? 0;
            const toolCalls = message.tool_calls;

            if (!toolCalls || toolCalls.length === 0) {
                const txt = message.content ?? '';
                if (txt) {
                    // Kirim per bagian agar client bisa render incremental
                    const chunkSize = 200;
                    for (let i = 0; i < txt.length; i += chunkSize) {
                        sendEvent('assistant', { content: txt.slice(i, i + chunkSize) });
                    }
                    history.push({ role: 'assistant', content: txt });
                }
                break;
            }

            step++;
            sendEvent('step', { step, total: MAX_AGENT_STEPS });
            history.push(message);

            for (const call of toolCalls) {
                const name = call.function.name;
                let args = {};
                try { args = JSON.parse(call.function.arguments); } catch { args = {}; }

                sendEvent('tool_call', { name, args, step });

                let result;
                if (tools[name]) {
                    result = await tools[name](args);
                    sendEvent('tool_result', { name, result: result.slice(0, 2000), step, error: false });
                } else {
                    result = `Unknown tool: ${name}`;
                    sendEvent('tool_result', { name, result, step, error: true });
                }

                history.push({ role: 'tool', tool_call_id: call.id, name, content: result });
            }
        }

        if (step >= MAX_AGENT_STEPS) {
            sendEvent('warning', { message: `Reached max agent steps (${MAX_AGENT_STEPS}).` });
        }

        return tokens;
    }

    // ── HTTP Server ────────────────────────────────────────────────────────
    const server = createServer(async (req, res) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        // CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

        // ── Serve coderly.html ──────────────────────────────────────────
        if (pathname === '/' || pathname === '/index.html') {
            try {
                const html = await fs.readFile(path.join(__dirname, 'coderly.html'), 'utf8');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(html);
            } catch {
                res.writeHead(404);
                res.end('coderly.html not found');
            }
            return;
        }

        // ── POST /api/chat (SSE) ────────────────────────────────────────
        if (pathname === '/api/chat' && req.method === 'POST') {
            const body = await readBody(req);
            let parsed;
            try { parsed = JSON.parse(body); } catch {
                res.writeHead(400); res.end('Invalid JSON'); return;
            }

            const { message, history, pageName } = parsed;
            const chatHistory = history || [];

            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no'
            });

            const sendEvent = (event, data) => {
                res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
            };

            try {
                const tokens = await runAgentLoopSSE(cfg, sysInstr, chatHistory, 0, sendEvent);
                sendEvent('done', { tokens, history: chatHistory });
            } catch (err) {
                sendEvent('error', { message: err.message });
            }
            res.end();
            return;
        }

        // ── GET /api/config ─────────────────────────────────────────────
        if (pathname === '/api/config' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(cfg));
            return;
        }

        // ── POST /api/config ────────────────────────────────────────────
        if (pathname === '/api/config' && req.method === 'POST') {
            const body = await readBody(req);
            let newCfg;
            try { newCfg = JSON.parse(body); } catch {
                res.writeHead(400); res.end('Invalid JSON'); return;
            }

            // Resolve endpoints
            if (newCfg.provider === 'huggingface' && newCfg.huggingface?.rawInput) {
                newCfg.huggingface.endpoint = resolveHFEndpoint(newCfg.huggingface.rawInput);
            }
            if (newCfg.provider === 'local' && newCfg.local?.baseUrl) {
                newCfg.local.endpoint = resolveLocalEndpoint(newCfg.local.baseUrl);
            }
            if (newCfg.provider === 'openrouter' && !newCfg.openrouter?.model) {
                newCfg.openrouter.model = 'gpt-oss-120b';
            }

            cfg = newCfg;
            await saveConfig(cfg);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true }));
            return;
        }

        // ── GET /api/provider ───────────────────────────────────────────
        if (pathname === '/api/provider' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ label: getProviderLabel(cfg).replace(/\x1b\[[0-9;]*m/g, '') }));
            return;
        }

        // ── POST /api/undo ──────────────────────────────────────────────
        if (pathname === '/api/undo' && req.method === 'POST') {
            const msg = await performUndo();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: msg }));
            return;
        }

        // ── Session endpoints ───────────────────────────────────────────
        if (pathname === '/api/session/save' && req.method === 'POST') {
            const body = await readBody(req);
            let parsed;
            try { parsed = JSON.parse(body); } catch {
                res.writeHead(400); res.end('Invalid JSON'); return;
            }
            const msg = await saveSession(parsed.name, parsed.history);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: msg }));
            return;
        }

        if (pathname === '/api/sessions' && req.method === 'GET') {
            const sessions = await listSessions();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ sessions }));
            return;
        }

        // ── POST /api/testlocal ─────────────────────────────────────────
        if (pathname === '/api/testlocal' && req.method === 'POST') {
            if (cfg.provider !== 'local') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: false, message: 'Current provider is not Local Server.' }));
                return;
            }
            const endpoint = cfg.local?.endpoint;
            if (!endpoint) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: false, message: 'No endpoint configured.' }));
                return;
            }
            try {
                const headers = { 'Content-Type': 'application/json' };
                if (cfg.local?.apiKey) headers['Authorization'] = `Bearer ${cfg.local.apiKey}`;
                const body = { messages: [{ role: 'user', content: 'Hi' }], max_tokens: 5, stream: false };
                if (cfg.local?.model) body.model = cfg.local.model;
                const r = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) });
                if (r.ok) {
                    const data = await r.json();
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ ok: true, message: `Server responded! Status: ${r.status}. Model: ${data.model || 'unknown'}` }));
                } else {
                    const errText = await r.text();
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ ok: false, message: `Server error (${r.status}): ${errText.slice(0, 200)}` }));
                }
            } catch (err) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: false, message: `Connection failed: ${err.message}` }));
            }
            return;
        }

        // 404
        res.writeHead(404);
        res.end('Not found');
    });

    // Helper: baca body dari request
    function readBody(req) {
        return new Promise((resolve, reject) => {
            let data = '';
            req.on('data', chunk => data += chunk);
            req.on('end', () => resolve(data));
            req.on('error', reject);
        });
    }

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(orange('\n┌──────────────────────────────────────────────────────────┐'));
        console.log(`${orange('│')}  ${orangeBold('Coderly Web Server')}                                   ${orange('│')}`);
        console.log(`${orange('│')}  ${cyan(`http://localhost:${PORT}`)}                             ${orange('│')}`);
        console.log(`${orange('│')}  ${gray('Provider:')} ${getProviderLabel(cfg)}${' '.repeat(40 - getProviderLabel(cfg).replace(/\x1b\[[0-9;]*m/g, '').length)}${orange('│')}`);
        console.log(orange('└──────────────────────────────────────────────────────────┘\n'));
    });
}

// ═══════════════════════════════════════════════════════════
//  Entry Point
// ═══════════════════════════════════════════════════════════
if (process.argv.includes('--web')) {
    startWebServer();
} else {
    main();
}
