#!/usr/bin/env python3
"""
Sync Traditional Chinese content with Simplified Chinese content
Converts contentZh to contentZhTraditional using OpenCC
"""

import json
import os
from pathlib import Path

try:
    from opencc import OpenCC
except ImportError:
    print("Installing opencc-python-reimplemented...")
    os.system("pip3 install opencc-python-reimplemented")
    from opencc import OpenCC

# Initialize OpenCC converter (Simplified to Traditional)
cc = OpenCC('s2t')  # s2t = Simplified to Traditional

def convert_to_traditional(text):
    """Convert simplified Chinese text to traditional Chinese"""
    if isinstance(text, str):
        return cc.convert(text)
    elif isinstance(text, list):
        return [cc.convert(item) for item in text]
    else:
        return text

def sync_chapter_file(file_path):
    """Sync traditional Chinese content with simplified Chinese content"""
    print(f"\nProcessing: {file_path.name}")

    # Read JSON file
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Check if contentZh exists
    if 'contentZh' not in data:
        print(f"  ⚠️  No contentZh found, skipping...")
        return False

    # Convert contentZh to contentZhTraditional
    content_zh = data['contentZh']

    if isinstance(content_zh, list):
        content_zh_traditional = [cc.convert(item) for item in content_zh]
        print(f"  ✅ Converted {len(content_zh)} paragraphs")
    else:
        print(f"  ⚠️  contentZh is not a list, skipping...")
        return False

    # Update contentZhTraditional
    data['contentZhTraditional'] = content_zh_traditional

    # Write back to file with proper formatting
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"  ✅ Updated contentZhTraditional")
    return True

def main():
    """Main function to process all chapter files"""
    chapters_dir = Path(__file__).parent / 'src' / 'data' / 'chapters'

    # Find all chapter JSON files
    chapter_files = sorted(chapters_dir.glob('chapter-*.json'))

    print(f"Found {len(chapter_files)} chapter files")
    print("=" * 60)

    success_count = 0
    for chapter_file in chapter_files:
        if sync_chapter_file(chapter_file):
            success_count += 1

    print("\n" + "=" * 60)
    print(f"✅ Successfully processed {success_count}/{len(chapter_files)} files")

if __name__ == '__main__':
    main()
