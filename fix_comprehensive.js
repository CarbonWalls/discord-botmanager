const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

const fixes = [];

// Fix 1: esc function (line 80 - 0-indexed: 79)
if (lines[79].includes("'''")) {
    lines[79] = "function esc(s) { const map = {'&':'&','<':'<','>':'>','\"':'\"',\"'\":\"'\"}; return String(s).replace(/[&<>\"']/g, c => map[c]); }";
    fixes.push('esc function');
}

// Fix 2: addBot function - find and make async
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('function addBot(') && !lines[i].includes('async')) {
        lines[i] = lines[i].replace('function addBot(', 'async function addBot(');
        fixes.push('addBot async');
        break;
    }
}

// Fix 3: Optional chaining on event handlers AT STATEMENT START only
for (let i = 0; i < lines.length; i++) {
    // ?.onclick = at statement start
    if (lines[i].match(/^\s*document\.getElementById\('[^']+'\)\?\.onclick\s*=/)) {
        const m = lines[i].match(/document\.getElementById\('([^']+)'\)\?\.onclick\s*=/);
        if (m) {
            const varName = m[1].replace(/-/g, '_');
            lines[i] = lines[i].replace(/document\.getElementById\('[^']+'\)\?\.onclick\s*=/, 'const ' + varName + ' = document.getElementById(\'' + m[1] + '\'); if (' + varName + ') ' + varName + '.onclick =');
            fixes.push('onclick: ' + m[1]);
        }
    }
    // ?.onchange = at statement start
    if (lines[i].match(/^\s*document\.getElementById\('[^']+'\)\?\.onchange\s*=/)) {
        const m = lines[i].match(/document\.getElementById\('([^']+)'\)\?\.onchange\s*=/);
        if (m) {
            const varName = m[1].replace(/-/g, '_');
            lines[i] = lines[i].replace(/document\.getElementById\('[^']+'\)\?\.onchange\s*=/, 'const ' + varName + ' = document.getElementById(\'' + m[1] + '\'); if (' + varName + ') ' + varName + '.onchange =');
            fixes.push('onchange: ' + m[1]);
        }
    }
    // ?.onsubmit = at statement start
    if (lines[i].match(/^\s*document\.getElementById\('[^']+'\)\?\.onsubmit\s*=/)) {
        const m = lines[i].match(/document\.getElementById\('([^']+)'\)\?\.onsubmit\s*=/);
        if (m) {
            const varName = m[1].replace(/-/g, '_');
            lines[i] = lines[i].replace(/document\.getElementById\('[^']+'\)\?\.onsubmit\s*=/, 'const ' + varName + ' = document.getElementById(\'' + m[1] + '\'); if (' + varName + ') ' + varName + '.onsubmit =');
            fixes.push('onsubmit: ' + m[1]);
        }
    }
    // ?.addEventListener( at statement start
    if (lines[i].match(/^\s*document\.getElementById\('[^']+'\)\?\.addEventListener\(/)) {
        const m = lines[i].match(/document\.getElementById\('([^']+)'\)\?\.addEventListener\(/);
        if (m) {
            const varName = m[1].replace(/-/g, '_');
            lines[i] = lines[i].replace(/document\.getElementById\('[^']+'\)\?\.addEventListener\(/, 'const ' + varName + ' = document.getElementById(\'' + m[1] + '\'); if (' + varName + ') ' + varName + '.addEventListener(');
            fixes.push('addEventListener: ' + m[1]);
        }
    }
}

// Fix 4: Remove extra }); after send-btn onclick handler
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '});' && i > 0 && lines[i-1].includes('finally { btn.disabled = false; }')) {
        lines.splice(i, 1);
        fixes.push('removed extra });');
        break;
    }
}

// Fix 5: await in non-async functions in renderVoiceBotSelect
for (let i = 0; i < lines.length; i++) {
    // Line with: if (voiceToken) await loadVoiceGuilds();
    if (lines[i].includes('if (voiceToken) await loadVoiceGuilds();')) {
        lines[i] = "if (voiceToken) loadVoiceGuilds().then(() => updateVoiceStatus());";
        fixes.push('await loadVoiceGuilds 1');
    }
    // Line with: if (voiceBot) { await loadVoiceGuilds(); updateVoiceStatus(); }
    if (lines[i].includes('if (voiceBot) { await loadVoiceGuilds(); updateVoiceStatus(); }')) {
        lines[i] = "if (voiceBot) { loadVoiceGuilds().then(() => updateVoiceStatus()); }";
        fixes.push('await loadVoiceGuilds 2');
    }
}

fs.writeFileSync('www/app.js', lines.join('\n'));
console.log('Applied fixes:', fixes.join(', '));
console.log('Total lines:', lines.length);