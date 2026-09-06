const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

// Check ICONS object end
console.log('=== ICONS end ===');
for (let i = 28; i < 40; i++) {
    console.log(i + 1, lines[i]);
}