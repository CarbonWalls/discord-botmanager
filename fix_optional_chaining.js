const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');

// Fix all instances of ?.onclick = and similar
t = t.replace(/document\.getElementById\('([^']+)'\)\?\.onclick = /g, "const $1 = document.getElementById('$1'); if ($1) $1.onclick = ");
fs.writeFileSync('www/app.js', t);
console.log('Fixed optional chaining assignments');