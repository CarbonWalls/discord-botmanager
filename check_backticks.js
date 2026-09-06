const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
let inTemplate = false;
let templateStart = -1;
for (let i = 0; i < t.length; i++) {
    if (t[i] === '`') {
        if (!inTemplate) {
            inTemplate = true;
            templateStart = i;
        } else {
            inTemplate = false;
            templateStart = -1;
        }
    }
}
if (inTemplate) {
    console.log('Unclosed template literal starting at', templateStart);
    console.log('Context:', t.substring(templateStart, templateStart + 200));
} else {
    console.log('All template literals are closed');
}