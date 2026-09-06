const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
t = t.replace(
    /function esc\(s\) \{ return String\(s\)\.replace\(\/\[\&<>"'\/g, c => \(\{'&':'&','<':'<','>':'>','"':'"',"'":'''\}\[c\]\)\); \}/,
    "function esc(s) { return String(s).replace(/[&<>\"/g, c => ({\"&\":\"&\",\"<\":\"<\",\">\":\"\">\",\"\\\"\":\"\\\"\"}); }"
);
fs.writeFileSync('www/app.js', t);
console.log('Fixed');