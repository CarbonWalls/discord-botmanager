const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');
for (let i = 635; i < 750; i++) {
    console.log(i + 1, lines[i]);
}