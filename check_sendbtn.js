const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

// Check around line 441
console.log('=== send-btn area ===');
for (let i = 435; i < 455; i++) {
    console.log(i + 1, lines[i]);
}