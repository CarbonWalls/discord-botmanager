const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

// Fix 3: Optional chaining on event handlers AT STATEMENT START only
const patterns = [
    { regex: /^\s*document\.getElementById\('([^']+)'\)\?\.onclick\s*=/, replacement: (m, id) => { const v = id.replace(/-/g, '_'); return `const ${v} = document.getElementById('${id}'); if (${v}) ${v}.onclick =`; } },
    { regex: /^\s*document\.getElementById\('([^']+)'\)\?\.onchange\s*=/, replacement: (m, id) => { const v = id.replace(/-/g, '_'); return `const ${v} = document.getElementById('${id}'); if (${v}) ${v}.onchange =`; } },
    { regex: /^\s*document\.getElementById\('([^']+)'\)\?\.onsubmit\s*=/, replacement: (m, id) => { const v = id.replace(/-/g, '_'); return `const ${v} = document.getElementById('${id}'); if (${v}) ${v}.onsubmit =`; } },
    { regex: /^\s*document\.getElementById\('([^']+)'\)\?\.addEventListener\(/, replacement: (m, id) => { const v = id.replace(/-/g, '_'); return `const ${v} = document.getElementById('${id}'); if (${v}) ${v}.addEventListener(`; } },
];

for (let i = 0; i < lines.length; i++) {
    for (const p of patterns) {
        const m = lines[i].match(p.regex);
        if (m) {
            lines[i] = lines[i].replace(p.regex, p.replacement(lines[i], m[1]));
            console.log('Fixed', p.regex.toString().split('\\?')[1].split('\\')[0], ':', m[1], 'at line', i + 1);
            break;
        }
    }
}

fs.writeFileSync('www/app.js', lines.join('\n'));
console.log('Fixed optional chaining assignments');