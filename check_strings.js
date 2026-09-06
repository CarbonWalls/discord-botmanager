const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');

// Check strings
let inString = false;
let stringChar = '';
let stringStart = -1;
for (let i = 0; i < t.length; i++) {
    const c = t[i];
    const prev = t[i-1];
    if (!inString) {
        if (c === '"' || c === "'") {
            inString = true;
            stringChar = c;
            stringStart = i;
        }
    } else {
        if (c === stringChar && prev !== '\\') {
            inString = false;
            stringChar = '';
            stringStart = -1;
        }
    }
}
if (inString) {
    console.log('Unclosed string starting at', stringStart, 'char:', stringChar);
    console.log('Context:', t.substring(stringStart, stringStart + 200));
} else {
    console.log('All strings are closed');
}

// Check regex
let inRegex = false;
let regexStart = -1;
for (let i = 0; i < t.length; i++) {
    const c = t[i];
    const prev = t[i-1];
    if (!inRegex) {
        // Heuristic: / at start of line or after (,=,:,[,{,;,? or after certain keywords
        if (c === '/' && prev !== '*' && prev !== '/') {
            inRegex = true;
            regexStart = i;
        }
    } else {
        if (c === '/' && prev !== '\\') {
            inRegex = false;
            regexStart = -1;
        } else if (c === '\n') {
            // Regex can't span lines without escaping
            console.log('Possible unclosed regex at', regexStart);
            inRegex = false;
        }
    }
}
if (inRegex) {
    console.log('Unclosed regex starting at', regexStart);
} else {
    console.log('All regexes appear closed');
}