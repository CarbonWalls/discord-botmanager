const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

// Check changepw_form.onsubmit (starts around line 977)
console.log('=== changepw_form.onsubmit ===');
for (let i = 976; i < 1010; i++) {
    console.log(i + 1, lines[i]);
}