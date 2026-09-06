const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

// Find all top-level function starts and track braces within each
let functions = [];
let inFunction = false;
let funcStart = -1;
let braceInFunc = 0;
let inString = false;
let stringChar = '';
let inTemplate = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Simple detection of function start at top level (not indented or minimally indented)
    const trimmed = line.trim();
    if (!inFunction && (trimmed.startsWith('function ') || trimmed.startsWith('async function '))) {
        // Check if it's at top level (no leading whitespace or just spaces for the file)
        if (!line.startsWith('    ') && !line.startsWith('\t')) {
            inFunction = true;
            funcStart = i;
            braceInFunc = 0;
            console.log('Function starts at line', i + 1, ':', trimmed.substring(0, 60));
        }
    }
    
    if (inFunction) {
        // Count braces in this line (simplified)
        for (let j = 0; j < line.length; j++) {
            const c = line[j];
            if (!inString && !inTemplate) {
                if (c === '"' || c === "'") { inString = true; stringChar = c; }
                else if (c === '`') { inTemplate = true; }
                else if (c === '{') braceInFunc++;
                else if (c === '}') braceInFunc--;
            } else if (inString) {
                if (c === stringChar && line[j-1] !== '\\') inString = false;
            } else if (inTemplate) {
                if (c === '`') inTemplate = false;
            }
        }
        
        // Check if function ends (brace returns to 0 and we're at a line with just })
        if (braceInFunc <= 0 && trimmed === '}') {
            console.log('Function ends at line', i + 1, '(brace:', braceInFunc, ')');
            inFunction = false;
            functions.push({ start: funcStart, end: i, balanced: braceInFunc === 0 });
            braceInFunc = 0;
        }
    }
}

console.log('\nFunction balance check:');
functions.forEach(f => {
    if (!f.balanced) {
        console.log('UNBALANCED:', f.start + 1, 'to', f.end + 1);
    }
});