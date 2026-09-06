const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

// Fix line 643 (0-indexed: 642): await in non-async function
lines[642] = "if (voiceToken) loadVoiceGuilds().then(() => updateVoiceStatus());";

// Fix line 646 (0-indexed: 645): await in non-async function  
lines[645] = "if (voiceBot) { loadVoiceGuilds().then(() => updateVoiceStatus()); }";

fs.writeFileSync('www/app.js', lines.join('\n'));
console.log('Fixed await in non-async functions');