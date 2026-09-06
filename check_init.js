const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');
for (let i = 1035; i < 1060; i++) {
    console.log(i + 1, lines[i]);
}