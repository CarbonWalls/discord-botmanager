const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

// Fix 4: Remove extra }); after send-btn onclick handler
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '});' && i > 0 && lines[i-1].includes('finally { btn.disabled = false; }')) {
        lines.splice(i, 1);
        console.log('Removed extra }); at line', i + 1);
        break;
    }
}

fs.writeFileSync('www/app.js', lines.join('\n'));
console.log('Removed extra });');