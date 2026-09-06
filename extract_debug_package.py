#!/usr/bin/env python3
"""
Extract all relevant files for debugging the Discord Manager UI issue.
Run this from the discord-manager directory.
"""
import os
import shutil
from pathlib import Path

BASE = Path(r"C:\Users\ww163\Documents\projects\messing\discord-manager-backup2\discord-manager")
OUT = BASE / "debug_package"

# Files to include
FILES = [
    "bridge.js",
    "electron/main.js",
    "electron/preload.js",
    "www/index.html",
    "www/app.js",
    "www/styles.css",
    "www/locales/en.json",
    "www/locales/zh.json",
    "www/locales/it.json",
    "package.json",
    "DEBUG_PROMPT.md",
]

# Also include backup UI for comparison
BACKUP_DIRS = [
    "www-backup-*",
]

def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)
    
    print(f"Extracting to {OUT}")
    
    for f in FILES:
        src = BASE / f
        if src.exists():
            dst = OUT / f
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
            print(f"  ✓ {f}")
        else:
            print(f"  ✗ MISSING: {f}")
    
    # Find and copy latest backup
    backups = sorted(BASE.glob("www-backup-*"))
    if backups:
        latest = backups[-1]
        dst = OUT / "www-backup-latest"
        shutil.copytree(latest, dst)
        print(f"  ✓ {latest.name} -> www-backup-latest/")
    
    # Create a zip for easy sharing
    shutil.make_archive(str(OUT), 'zip', OUT)
    print(f"\nCreated {OUT}.zip")
    print(f"\nShare this zip with the external LLM along with DEBUG_PROMPT.md")

if __name__ == "__main__":
    main()