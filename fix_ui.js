#!/usr/bin/env node
/**
 * Fix script for Discord Manager UI issues.
 * Run this from the discord-manager directory: node fix_ui.js
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const BASE = __dirname;

function fetch(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        }).on('error', reject);
    });
}

async function checkBridge() {
    try {
        const r = await fetch('http://127.0.0.1:8787/i18n/languages');
        if (r.status === 200) {
            const data = JSON.parse(r.data);
            console.log(`✓ /i18n/languages OK: ${data.languages?.length || 0} languages`);
            return true;
        } else {
            console.log(`✗ /i18n/languages returned ${r.status}`);
            return false;
        }
    } catch (e) {
        console.log(`✗ Bridge not reachable: ${e.message}`);
        return false;
    }
}

async function checkLocale(code) {
    try {
        const r = await fetch(`http://127.0.0.1:8787/i18n/locales/${code}`);
        if (r.status === 200) {
            const data = JSON.parse(r.data);
            const keys = Object.keys(data.strings || {}).length;
            console.log(`✓ /i18n/locales/${code} OK: ${keys} translation keys`);
            return true;
        } else {
            console.log(`✗ /i18n/locales/${code} returned ${r.status}`);
            return false;
        }
    } catch (e) {
        console.log(`✗ Locale fetch failed: ${e.message}`);
        return false;
    }
}

async function checkStatic(file) {
    try {
        const r = await fetch(`http://127.0.0.1:8787/${file}`);
        if (r.status === 200) {
            console.log(`✓ /${file} OK (${r.data.length} bytes)`);
            return true;
        } else {
            console.log(`✗ /${file} returned ${r.status}`);
            return false;
        }
    } catch (e) {
        console.log(`✗ Static file fetch failed: ${e.message}`);
        return false;
    }
}

function clearElectronCache() {
    const dirs = [
        process.env.APPDATA ? path.join(process.env.APPDATA, 'Discord Manager') : null,
        process.env.HOME ? path.join(process.env.HOME, 'Library', 'Application Support', 'Discord Manager') : null,
        process.env.HOME ? path.join(process.env.HOME, '.config', 'Discord Manager') : null,
    ].filter(Boolean);
    
    for (const d of dirs) {
        if (fs.existsSync(d)) {
            console.log(`Removing cache: ${d}`);
            fs.rmSync(d, { recursive: true, force: true });
        }
    }
}

function verifyWwwFiles() {
    const required = ['index.html', 'app.js', 'styles.css', 'locales/en.json', 'locales/zh.json', 'locales/it.json'];
    for (const f of required) {
        const p = path.join(BASE, 'www', f);
        if (fs.existsSync(p)) {
            console.log(`  ✓ www/${f}`);
        } else {
            console.log(`  ✗ MISSING: www/${f}`);
        }
    }
}

function checkPackageJson() {
    const pkg = JSON.parse(fs.readFileSync(path.join(BASE, 'package.json'), 'utf8'));
    const asarUnpack = pkg.build?.asarUnpack || [];
    if (asarUnpack.includes('www/locales/**/*')) {
        console.log('  ✓ asarUnpack includes www/locales/**/*');
    } else {
        console.log('  ✗ asarUnpack MISSING www/locales/**/*');
    }
}

async function main() {
    console.log('='.repeat(60));
    console.log('Discord Manager UI Fix Script');
    console.log('='.repeat(60));
    
    // 1. Clear Electron cache
    console.log('\n1. Clearing Electron cache...');
    clearElectronCache();
    
    // 2. Check if bridge is running
    console.log('\n2. Checking bridge endpoints...');
    const bridgeOk = await checkBridge();
    
    if (bridgeOk) {
        await checkLocale('en');
        await checkLocale('zh');
        await checkLocale('it');
        await checkStatic('styles.css');
        await checkStatic('app.js');
    } else {
        console.log('\nBridge not running. Starting it...');
        const env = { ...process.env };
        env.WWW_DIR = path.join(BASE, 'www');
        env.DATA_DIR = path.join(BASE, 'data', 'messages');
        env.VOICE_DIR = path.join(BASE, 'data', 'voice');
        env.LOCALES_DIR = path.join(BASE, 'www', 'locales');
        
        const proc = spawn('node', ['bridge.js'], { cwd: BASE, env, stdio: 'inherit' });
        console.log(`Bridge started (PID: ${proc.pid}), waiting 3s...`);
        await new Promise(r => setTimeout(r, 3000));
        
        if (await checkBridge()) {
            await checkLocale('en');
            await checkStatic('styles.css');
            await checkStatic('app.js');
        } else {
            console.log('ERROR: Bridge failed to start. Check console for errors.');
            proc.kill();
            process.exit(1);
        }
    }
    
    // 3. Verify www files
    console.log('\n3. Verifying www/ files...');
    verifyWwwFiles();
    
    // 4. Check package.json
    console.log('\n4. Checking package.json...');
    checkPackageJson();
    
    console.log('\n' + '='.repeat(60));
    console.log('NEXT STEPS:');
    console.log('='.repeat(60));
    console.log('If all checks passed above, run:');
    console.log('  npm run dev');
    console.log('');
    console.log('If bridge failed, run manually to see errors:');
    console.log('  node bridge.js');
    console.log('');
    console.log('Common issues:');
    console.log('  - Missing ws module: npm install ws');
    console.log('  - Port 8787 in use: kill other node processes');
    console.log('  - Locale files not found: check www/locales/ exists');
}

main().catch(console.error);