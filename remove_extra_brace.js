const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');
lines.splice(489, 1); // Remove the extra }); at line 490
fs.writeFileSync('www/app.js', lines.join('\n'));
console.log('Removed extra });');