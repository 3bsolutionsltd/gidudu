import os
import json
import shutil
from difflib import SequenceMatcher
import re

def normalize_name(name):
    """Remove all non-alphabetic characters and convert to lowercase"""
    return re.sub(r'[^a-z]', '', name.lower())

# Load children data
with open('server/data/children.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Get children without images
children_without_images = [c for c in data['children'] if not c.get('image')]

# Search directory
search_dir = r"D:\Projects\Gidudu\sponsored\missing"
target_dir = "all_children_images"

if not os.path.exists(search_dir):
    print(f"❌ Directory not found: {search_dir}")
    exit(1)

print(f"Searching for images in: {search_dir}")
print("=" * 80)

# Get all image files
image_extensions = ('.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp')
all_files = []

for root, dirs, files in os.walk(search_dir):
    for file in files:
        if file.lower().endswith(image_extensions):
            all_files.append(os.path.join(root, file))

print(f"✓ Found {len(all_files)} image files")

# Match images to children
matches = []

for image_path in all_files:
    image_name = os.path.basename(image_path)
    image_base = os.path.splitext(image_name)[0]
    # Remove suffixes
    image_base = image_base.replace('-scaled-1', '').replace('-scaled', '')
    image_base = re.sub(r'-\d+x\d+', '', image_base)
    
    # Try to match with children
    best_match = None
    best_score = 0
    
    for child in children_without_images:
        child_name = child['name']
        score = SequenceMatcher(None, normalize_name(child_name), normalize_name(image_base)).ratio()
        
        if score > best_score:
            best_score = score
            best_match = child
    
    if best_match and best_score >= 0.40:  # 40% threshold
        matches.append({
            'image_path': image_path,
            'image_name': image_name,
            'image_base': image_base,
            'child_name': best_match['name'],
            'score': best_score
        })

# Sort by score
matches.sort(key=lambda x: x['score'], reverse=True)

print(f"\nFound {len(matches)} matches to copy\n")

for i, match in enumerate(matches, 1):
    print(f"{i}. {match['child_name']} ← {match['image_base']} ({match['score']:.1%})")

# Copy the images
print("\n" + "=" * 80)
print(f"COPYING {len(matches)} IMAGES")
print("=" * 80)

copied = 0
errors = 0
skipped = 0

for match in matches:
    try:
        # Create target filename
        target_filename = os.path.basename(match['image_path'])
        target_path = os.path.join(target_dir, target_filename)
        
        # Skip if already exists
        if os.path.exists(target_path):
            skipped += 1
            print(f"⊘ Skipped (exists): {target_filename}")
            continue
        
        # Copy the file
        shutil.copy2(match['image_path'], target_path)
        copied += 1
        print(f"✓ Copied: {target_filename}")
    except Exception as e:
        errors += 1
        print(f"✗ Error copying {os.path.basename(match['image_path'])}: {e}")

print(f"\n{'='*80}")
print(f"COPY COMPLETE")
print(f"{'='*80}")
print(f"Successfully copied: {copied} images")
if skipped > 0:
    print(f"Skipped (already exist): {skipped}")
if errors > 0:
    print(f"Errors: {errors}")

print(f"\nNext step: Run link_images_to_children.py to assign the new images")
