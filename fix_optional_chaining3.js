const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');

// Fix all instances of ?.onclick = etc. - convert ID to valid var name
t = t.replace(/document\.getElementById\('([^']+)'\)\?\./g, (match, id) => {
    const varName = id.replace(/-/g, '_');
    return `const ${varName} = document.getElementById('${id}'); if (${varName}) ${varName}.`;
});

fs.writeFileSync('www/app.js', t);
console.log('Fixed optional chaining assignments');