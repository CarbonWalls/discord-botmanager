const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

// Fix 1: esc function (line 80 - 0-indexed: 79)
lines[79] = "function esc(s) { const map = {'&':'&','<':'<','>':'>','\"':'\"',\"'\":\"'\"}; return String(s).replace(/[&<>\"']/g, c => map[c]); }";

fs.writeFileSync('www/app.js', lines.join('\n'));
console.log('Fixed esc function');