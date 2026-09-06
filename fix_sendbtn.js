const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

// Add missing }; after send_btn.onclick handler (after finally block)
// Find the line with "finally { btn.disabled = false; }" followed by empty line then "async function handleVoiceMessage"
for (let i = 0; i < lines.length - 2; i++) {
    if (lines[i].includes('finally { btn.disabled = false; }') && 
        lines[i+1].trim() === '' && 
        lines[i+2].includes('async function handleVoiceMessage')) {
        lines.splice(i + 1, 0, '};');
        console.log('Added missing }; at line', i + 2);
        break;
    }
}

fs.writeFileSync('www/app.js', lines.join('\n'));
console.log('Fixed send_btn.onclick');