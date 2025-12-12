#!/usr/bin/env python3
"""
Sync Traditional Chinese content with Simplified Chinese content
Converts contentZh to contentZhTraditional using OpenCC
with custom word replacements
"""

import json
import os
import re
from pathlib import Path

try:
    from opencc import OpenCC
except ImportError:
    print("Installing opencc-python-reimplemented...")
    os.system("pip3 install opencc-python-reimplemented")
    from opencc import OpenCC

# Initialize OpenCC converter (Simplified to Traditional)
cc = OpenCC('s2t')  # s2t = Simplified to Traditional

# Custom word replacement dictionary
# Format: "simplified_word": "traditional_word"
# These replacements will be applied AFTER OpenCC conversion
CUSTOM_REPLACEMENTS = {
    "悉尼": "雪梨",
    # Add more custom replacements here:
    # "北京": "北京",
    # "上海": "上海",
}

def apply_custom_replacements(text):
    """Apply custom word replacements to the text"""
    for simplified, traditional in CUSTOM_REPLACEMENTS.items():
        # Use word boundary matching to avoid partial replacements
        text = text.replace(simplified, traditional)
    return text

def convert_to_traditional(text):
    """Convert simplified Chinese text to traditional Chinese with custom replacements"""
    if isinstance(text, str):
        # First, apply OpenCC conversion
        converted = cc.convert(text)
        # Then, apply custom replacements
        converted = apply_custom_replacements(converted)
        return converted
    elif isinstance(text, list):
        return [convert_to_traditional(item) for item in text]
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
        # Use the new convert_to_traditional function with custom replacements
        content_zh_traditional = convert_to_traditional(content_zh)
        print(f"  ✅ Converted {len(content_zh)} paragraphs")

        # Count custom replacements
        replacement_count = 0
        for simplified, traditional in CUSTOM_REPLACEMENTS.items():
            count = sum(item.count(traditional) for item in content_zh_traditional)
            if count > 0:
                print(f"  🔄 Applied custom replacement: '{simplified}' → '{traditional}' ({count} times)")
                replacement_count += count
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
