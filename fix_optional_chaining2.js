const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');

// Fix all instances of ?.onclick = etc. - convert ID to valid var name
t = t.replace(/document\.getElementById\('([^']+)'\)\?\.onclick = /g, (match, id) => {
    const varName = id.replace(/-/g, '_');
    return `const ${varName} = document.getElementById('${id}'); if (${varName}) ${varName}.onclick = `;
});

t = t.replace(/document\.getElementById\('([^']+)'\)\?\.onchange = /g, (match, id) => {
    const varName = id.replace(/-/g, '_');
    return `const ${varName} = document.getElementById('${id}'); if (${varName}) ${varName}.onchange = `;
});

t = t.replace(/document\.getElementById\('([^']+)'\)\?\.onsubmit = /g, (match, id) => {
    const varName = id.replace(/-/g, '_');
    return `const ${varName} = document.getElementById('${id}'); if (${varName}) ${varName}.onsubmit = `;
});

t = t.replace(/document\.getElementById\('([^']+)'\)\?\.addEventListener\(/g, (match, id) => {
    const varName = id.replace(/-/g, '_');
    return `const ${varName} = document.getElementById('${id}'); if (${varName}) ${varName}.addEventListener(`;
});

fs.writeFileSync('www/app.js', t);
console.log('Fixed optional chaining assignments');