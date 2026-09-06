const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
fs.writeFileSync('www/app_test.js', t + '\n}');
console.log('Created test file');