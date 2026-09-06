const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

// Fix line 643: await in non-async function
lines[642] = "if (voiceToken) loadVoiceGuilds().then(() => updateVoiceStatus());";

// Fix line 646: await in non-async function  
lines[645] = "if (voiceBot) { loadVoiceGuilds().then(() => updateVoiceStatus()); }";

fs.writeFileSync('www/app.js', lines.join('\n'));
console.log('Fixed await in non-async functions');