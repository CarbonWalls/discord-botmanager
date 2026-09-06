#!/usr/bin/env python3
"""
Extract all files from www/ folder into a single .txt file
for sharing with another LLM for UI redesign.
"""
import os
import sys
from pathlib import Path

WWW_DIR = Path(__file__).parent / "www"
OUTPUT_FILE = Path(__file__).parent / "www_dump.txt"

def main():
    if not WWW_DIR.exists():
        print(f"ERROR: {WWW_DIR} not found")
        sys.exit(1)

    files = []
    for root, dirs, filenames in os.walk(WWW_DIR):
        # Skip backup files
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        for fname in filenames:
            if fname.startswith('.'):
                continue
            fpath = Path(root) / fname
            files.append(fpath)

    files.sort(key=lambda p: str(p.relative_to(WWW_DIR)))

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as out:
        out.write(f"# Discord Manager - www/ folder dump\n")
        out.write(f"# Generated: {__import__('datetime').datetime.now().isoformat()}\n")
        out.write(f"# Total files: {len(files)}\n")
        out.write("=" * 80 + "\n\n")

        for fpath in files:
            rel = fpath.relative_to(WWW_DIR)
            out.write(f"# FILE: {rel}\n")
            out.write(f"# PATH: {fpath}\n")
            out.write("-" * 80 + "\n")
            try:
                content = fpath.read_text(encoding='utf-8')
                out.write(content)
            except UnicodeDecodeError:
                out.write(f"[BINARY FILE - {fpath.stat().st_size} bytes]")
            out.write("\n")
            out.write("=" * 80 + "\n\n")

    print(f"Done! Wrote {len(files)} files to {OUTPUT_FILE}")
    print(f"Size: {OUTPUT_FILE.stat().st_size / 1024:.1f} KB")

if __name__ == "__main__":
    main()