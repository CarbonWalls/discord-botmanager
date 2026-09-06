const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
let brace = 0;
let inString = false;
let stringChar = '';
let inTemplate = false;

for (let i = 0; i < t.length; i++) {
    const c = t[i];
    const next = t[i + 1];

    if (!inString && !inTemplate) {
        if (c === '"' || c === "'") { inString = true; stringChar = c; }
        else if (c === '`') { inTemplate = true; }
        else if (c === '{') brace++;
        else if (c === '}') { brace--; if (brace < 0) { console.log('Negative brace at', i, 'context:', t.substring(Math.max(0, i - 50), i + 50)); break; } }
    } else if (inString) {
        if (c === stringChar && t[i - 1] !== '\\') inString = false;
    } else if (inTemplate) {
        if (c === '`') inTemplate = false;
        else if (c === '$' && next === '{') { i++; }
        else if (c === '{') brace++;
        else if (c === '}') brace--;
    }
}
console.log('Final brace:', brace);

if (brace > 0) {
    console.log('Missing', brace, 'closing brace(s)');
    // Find where the unmatched opening braces are
    brace = 0;
    for (let i = 0; i < t.length; i++) {
        const c = t[i];
        if (c === '{') { brace++; if (brace > 0 && i > t.length - 5000) console.log('Open brace at', i, 'context:', t.substring(Math.max(0, i - 30), i + 30)); }
        else if (c === '}') brace--;
    }
}