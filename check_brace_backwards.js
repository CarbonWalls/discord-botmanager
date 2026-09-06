const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

// Check brace balance from end backwards
let brace = 0;
for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    for (let j = line.length - 1; j >= 0; j--) {
        const c = line[j];
        if (c === '}') brace++;
        else if (c === '{') brace--;
        if (brace < 0) {
            console.log('Missing opening brace at line', i + 1, ':', line.trim());
            break;
        }
    }
    if (brace < 0) break;
}
console.log('Final brace from end:', brace);