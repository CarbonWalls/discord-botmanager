const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

// Fix 1: esc function (line 80 - 0-indexed: 79)
lines[79] = "function esc(s) { const map = {'&':'&','<':'<','>':'>','\"':'\"',\"'\":\"'\"}; return String(s).replace(/[&<>\"']/g, c => map[c]); }";

// Fix 2: addBot function (find line with "function addBot")
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('function addBot(')) {
        lines[i] = lines[i].replace('function addBot(', 'async function addBot(');
        break;
    }
}

// Fix 3: Optional chaining on event handlers AT STATEMENT START
// Pattern: document.getElementById('xxx')?.onclick = ...
// Replace only when at start of statement (after const/let/var or at line start)
for (let i = 0; i < lines.length; i++) {
    // ?.onclick = at statement start
    if (lines[i].match(/^\s*document\.getElementById\('[^']+'\)\?\.onclick\s*=/)) {
        const m = lines[i].match(/document\.getElementById\('([^']+)'\)\?\.onclick\s*=/);
        if (m) {
            const varName = m[1].replace(/-/g, '_');
            lines[i] = lines[i].replace(/document\.getElementById\('[^']+'\)\?\.onclick\s*=/, 'const ' + varName + ' = document.getElementById(\'' + m[1] + '\'); if (' + varName + ') ' + varName + '.onclick =');
        }
    }
    // ?.onchange = at statement start
    if (lines[i].match(/^\s*document\.getElementById\('[^']+'\)\?\.onchange\s*=/)) {
        const m = lines[i].match(/document\.getElementById\('([^']+)'\)\?\.onchange\s*=/);
        if (m) {
            const varName = m[1].replace(/-/g, '_');
            lines[i] = lines[i].replace(/document\.getElementById\('[^']+'\)\?\.onchange\s*=/, 'const ' + varName + ' = document.getElementById(\'' + m[1] + '\'); if (' + varName + ') ' + varName + '.onchange =');
        }
    }
    // ?.onsubmit = at statement start
    if (lines[i].match(/^\s*document\.getElementById\('[^']+'\)\?\.onsubmit\s*=/)) {
        const m = lines[i].match(/document\.getElementById\('([^']+)'\)\?\.onsubmit\s*=/);
        if (m) {
            const varName = m[1].replace(/-/g, '_');
            lines[i] = lines[i].replace(/document\.getElementById\('[^']+'\)\?\.onsubmit\s*=/, 'const ' + varName + ' = document.getElementById(\'' + m[1] + '\'); if (' + varName + ') ' + varName + '.onsubmit =');
        }
    }
    // ?.addEventListener( at statement start
    if (lines[i].match(/^\s*document\.getElementById\('[^']+'\)\?\.addEventListener\(/)) {
        const m = lines[i].match(/document\.getElementById\('([^']+)'\)\?\.addEventListener\(/);
        if (m) {
            const varName = m[1].replace(/-/g, '_');
            lines[i] = lines[i].replace(/document\.getElementById\('[^']+'\)\?\.addEventListener\(/, 'const ' + varName + ' = document.getElementById(\'' + m[1] + '\'); if (' + varName + ') ' + varName + '.addEventListener(');
        }
    }
}

fs.writeFileSync('www/app.js', lines.join('\n'));
console.log('Fixed all issues');