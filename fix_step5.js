const fs = require('fs');
let t = fs.readFileSync('www/app.js', 'utf8');
const lines = t.split('\n');

// Fix 5: await in non-async functions in renderVoiceBotSelect
for (let i = 0; i < lines.length; i++) {
    // Line with: if (voiceToken) await loadVoiceGuilds();
    if (lines[i].includes('if (voiceToken) await loadVoiceGuilds();')) {
        lines[i] = "if (voiceToken) loadVoiceGuilds().then(() => updateVoiceStatus());";
        console.log('Fixed await loadVoiceGuilds 1 at line', i + 1);
    }
    // Line with: if (voiceBot) { await loadVoiceGuilds(); updateVoiceStatus(); }
    if (lines[i].includes('if (voiceBot) { await loadVoiceGuilds(); updateVoiceStatus(); }')) {
        lines[i] = "if (voiceBot) { loadVoiceGuilds().then(() => updateVoiceStatus()); }";
        console.log('Fixed await loadVoiceGuilds 2 at line', i + 1);
    }
    // Line with: if (cleanToken) await loadCleanGuilds();
    if (lines[i].includes('if (cleanToken) await loadCleanGuilds();')) {
        lines[i] = "if (cleanToken) loadCleanGuilds();";
        console.log('Fixed await loadCleanGuilds at line', i + 1);
    }
}

fs.writeFileSync('www/app.js', lines.join('\n'));
console.log('Fixed await in non-async functions');