#!/usr/bin/env python3
"""
Fix script for Discord Manager UI issues.
Run this from the discord-manager directory.
"""
import subprocess
import sys
import os
import time
import requests
from pathlib import Path

BASE = Path(__file__).parent

def run_cmd(cmd, cwd=None, timeout=30):
    """Run command and return (success, output)"""
    try:
        result = subprocess.run(cmd, cwd=cwd or BASE, capture_output=True, text=True, timeout=timeout, shell=True)
        return result.returncode == 0, result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return False, "Timeout"
    except Exception as e:
        return False, str(e)

def check_bridge():
    """Check if bridge is running and endpoints work"""
    try:
        r = requests.get("http://127.0.0.1:8787/i18n/languages", timeout=3)
        if r.status_code == 200:
            data = r.json()
            print(f"✓ /i18n/languages OK: {len(data.get('languages', []))} languages")
            return True
        else:
            print(f"✗ /i18n/languages returned {r.status_code}")
            return False
    except Exception as e:
        print(f"✗ Bridge not reachable: {e}")
        return False

def check_locale(code='en'):
    try:
        r = requests.get(f"http://127.0.0.1:8787/i18n/locales/{code}", timeout=3)
        if r.status_code == 200:
            data = r.json()
            keys = len(data.get('strings', {}))
            print(f"✓ /i18n/locales/{code} OK: {keys} translation keys")
            return True
        else:
            print(f"✗ /i18n/locales/{code} returned {r.status_code}")
            return False
    except Exception as e:
        print(f"✗ Locale fetch failed: {e}")
        return False

def check_static_file(path):
    try:
        r = requests.get(f"http://127.0.0.1:8787/{path}", timeout=3)
        if r.status_code == 200:
            print(f"✓ /{path} OK ({len(r.content)} bytes)")
            return True
        else:
            print(f"✗ /{path} returned {r.status_code}")
            return False
    except Exception as e:
        print(f"✗ Static file fetch failed: {e}")
        return False

def clear_electron_cache():
    """Clear Electron user data cache"""
    import shutil
    cache_dirs = [
        Path(os.environ.get('APPDATA', '')) / 'Discord Manager',
        Path.home() / 'Library' / 'Application Support' / 'Discord Manager',
        Path.home() / '.config' / 'Discord Manager',
    ]
    for d in cache_dirs:
        if d.exists():
            print(f"Removing cache: {d}")
            shutil.rmtree(d, ignore_errors=True)

def main():
    print("=" * 60)
    print("Discord Manager UI Fix Script")
    print("=" * 60)
    
    # 1. Check if we're in the right directory
    if not (BASE / 'bridge.js').exists():
        print(f"ERROR: Run this from discord-manager directory")
        sys.exit(1)
    
    # 2. Clear Electron cache (fixes stale UI)
    print("\n1. Clearing Electron cache...")
    clear_electron_cache()
    
    # 3. Check if bridge is running
    print("\n2. Checking bridge endpoints...")
    if check_bridge():
        check_locale('en')
        check_locale('zh')
        check_locale('it')
        check_static_file('styles.css')
        check_static_file('app.js')
    else:
        print("\nBridge not running. Starting it...")
        # Start bridge in background
        env = os.environ.copy()
        env['WWW_DIR'] = str(BASE / 'www')
        env['DATA_DIR'] = str(BASE / 'data' / 'messages')
        env['VOICE_DIR'] = str(BASE / 'data' / 'voice')
        env['LOCALES_DIR'] = str(BASE / 'www' / 'locales')
        
        proc = subprocess.Popen(['node', 'bridge.js'], cwd=BASE, env=env)
        print(f"Bridge started (PID: {proc.pid}), waiting 3s...")
        time.sleep(3)
        
        if check_bridge():
            check_locale('en')
            check_static_file('styles.css')
            check_static_file('app.js')
        else:
            print("ERROR: Bridge failed to start. Check console for errors.")
            proc.terminate()
            sys.exit(1)
    
    # 4. Verify www files exist
    print("\n3. Verifying www/ files...")
    required = ['index.html', 'app.js', 'styles.css', 'locales/en.json', 'locales/zh.json', 'locales/it.json']
    for f in required:
        p = BASE / 'www' / f
        if p.exists():
            print(f"  ✓ www/{f}")
        else:
            print(f"  ✗ MISSING: www/{f}")
    
    # 5. Check package.json has asarUnpack
    print("\n4. Checking package.json...")
    import json
    with open(BASE / 'package.json') as f:
        pkg = json.load(f)
    asar_unpack = pkg.get('build', {}).get('asarUnpack', [])
    if 'www/locales/**/*' in asar_unpack:
        print("  ✓ asarUnpack includes www/locales/**/*")
    else:
        print("  ✗ asarUnpack MISSING www/locales/**/*")
    
    print("\n" + "=" * 60)
    print("NEXT STEPS:")
    print("=" * 60)
    print("If all checks passed above, run:")
    print("  npm run dev")
    print()
    print("If bridge failed, check terminal for errors when running:")
    print("  node bridge.js")
    print()
    print("Common issues:")
    print("  - Missing 'ws' module: npm install ws")
    print("  - Port 8787 in use: kill other node processes")
    print("  - Locale files not found: check www/locales/ exists")

if __name__ == '__main__':
    main()