const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

// Check clean_delete.onclick (starts around line 932)
console.log('=== clean_delete.onclick ===');
for (let i = 931; i < 965; i++) {
    console.log(i + 1, lines[i]);
}