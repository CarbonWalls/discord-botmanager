const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');
for (let i = 980; i < 1080; i++) {
    console.log(i + 1, lines[i]);
}