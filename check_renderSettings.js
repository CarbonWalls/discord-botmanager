const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

// Check renderSettings (starts at line 962)
console.log('=== renderSettings ===');
for (let i = 961; i < 980; i++) {
    console.log(i + 1, lines[i]);
}