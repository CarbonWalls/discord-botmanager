const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');
lines[248] = "async function addBot(name, token) {";
fs.writeFileSync('www/app.js', lines.join('\n'));
console.log('Fixed addBot');