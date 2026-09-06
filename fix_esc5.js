const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');
lines[80] = "function esc(s) { const map = {'&':'&','<':'<','>':'>','\"':'\"',\"'\":\"'\"}; return String(s).replace(/[&<>\"']/g, c => map[c]); }";
fs.writeFileSync('www/app.js', lines.join('\n'));
console.log('Fixed');