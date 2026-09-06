const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

// Fix 2: addBot function - make it async
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('function addBot(') && !lines[i].includes('async')) {
        lines[i] = lines[i].replace('function addBot(', 'async function addBot(');
        console.log('Fixed addBot at line', i + 1);
        break;
    }
}

fs.writeFileSync('www/app.js', lines.join('\n'));
console.log('Fixed addBot');