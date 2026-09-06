const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

// Check initUnlock (starts around line 1018)
console.log('=== initUnlock ===');
for (let i = 1017; i < 1060; i++) {
    console.log(i + 1, lines[i]);
}