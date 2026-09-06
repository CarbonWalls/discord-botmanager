const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

for (let i = 0; i < lines.length; i++) {
    // Fix ?.onclick = patterns
    if (lines[i].includes('?.onclick =')) {
        const m = lines[i].match(/document\.getElementById\('([^']+)'\)\?\.onclick =/);
        if (m) {
            const varName = m[1].replace(/-/g, '_');
            lines[i] = lines[i].replace(/document\.getElementById\('([^']+)'\)\?\.onclick =/, 'const ' + varName + ' = document.getElementById(\'' + m[1] + '\'); if (' + varName + ') ' + varName + '.onclick =');
        }
    }
    // Fix ?.onchange = patterns
    if (lines[i].includes('?.onchange =')) {
        const m = lines[i].match(/document\.getElementById\('([^']+)'\)\?\.onchange =/);
        if (m) {
            const varName = m[1].replace(/-/g, '_');
            lines[i] = lines[i].replace(/document\.getElementById\('([^']+)'\)\?\.onchange =/, 'const ' + varName + ' = document.getElementById(\'' + m[1] + '\'); if (' + varName + ') ' + varName + '.onchange =');
        }
    }
    // Fix ?.onsubmit = patterns
    if (lines[i].includes('?.onsubmit =')) {
        const m = lines[i].match(/document\.getElementById\('([^']+)'\)\?\.onsubmit =/);
        if (m) {
            const varName = m[1].replace(/-/g, '_');
            lines[i] = lines[i].replace(/document\.getElementById\('([^']+)'\)\?\.onsubmit =/, 'const ' + varName + ' = document.getElementById(\'' + m[1] + '\'); if (' + varName + ') ' + varName + '.onsubmit =');
        }
    }
    // Fix ?.addEventListener( patterns
    if (lines[i].includes('?.addEventListener(')) {
        const m = lines[i].match(/document\.getElementById\('([^']+)'\)\?\.addEventListener\(/);
        if (m) {
            const varName = m[1].replace(/-/g, '_');
            lines[i] = lines[i].replace(/document\.getElementById\('([^']+)'\)\?\.addEventListener\(/, 'const ' + varName + ' = document.getElementById(\'' + m[1] + '\'); if (' + varName + ') ' + varName + '.addEventListener(');
        }
    }
    // Fix ?.value patterns (like ?.value || '')
    if (lines[i].includes('?.value') && !lines[i].includes('const')) {
        const m = lines[i].match(/document\.getElementById\('([^']+)'\)\?\.value/);
        if (m) {
            const varName = m[1].replace(/-/g, '_');
            lines[i] = lines[i].replace(/document\.getElementById\('([^']+)'\)\?\.value/, '(' + varName + ' = document.getElementById(\'' + m[1] + '\'), ' + varName + ' ? ' + varName + '.value : \'\')');
        }
    }
}

fs.writeFileSync('www/app.js', lines.join('\n'));
console.log('Fixed');