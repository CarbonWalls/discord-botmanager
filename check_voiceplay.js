const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

// Check voice_play.onclick (starts around line 771)
console.log('=== voice_play.onclick ===');
for (let i = 770; i < 820; i++) {
    console.log(i + 1, lines[i]);
}