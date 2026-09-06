const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

// Check further
console.log('=== send-btn area continued ===');
for (let i = 455; i < 500; i++) {
    console.log(i + 1, lines[i]);
}