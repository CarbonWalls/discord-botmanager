const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const idx = t.indexOf('function esc(');
console.log('esc at:', idx);
console.log(t.substring(idx - 100, idx + 50));