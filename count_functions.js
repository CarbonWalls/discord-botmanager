const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

let functions = [];
for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('function ') || line.startsWith('async function ') || 
        line.includes('function(') || line.includes('=> {') || line.includes('=> {')) {
        functions.push({ line: i + 1, text: line.substring(0, 80) });
    }
}

console.log('Function-like declarations:');
functions.forEach(f => console.log(f.line, f.text));
console.log('Total:', functions.length);