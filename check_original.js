const { execSync } = require('child_process');
const t = execSync('git show HEAD:www/app.js', { cwd: process.cwd(), encoding: 'utf8' });
console.log(t.substring(5700, 6200));