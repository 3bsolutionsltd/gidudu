import os
import json
import shutil
from difflib import SequenceMatcher
import re
from collections import defaultdict

def normalize_name(name):
    """Remove all non-alphabetic characters and convert to lowercase"""
    return re.sub(r'[^a-z]', '', name.lower())

# Load children data
with open('server/data/children.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Get children without images
children_without_images = [c for c in data['children'] if not c.get('image')]

# Search directory
search_dir = r"D:\Projects\Gidudu\2025\2025\09"
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

# Group images by their base name (without size variants)
image_groups = defaultdict(list)

for image_path in all_files:
    image_name = os.path.basename(image_path)
    # Remove size variants like -150x150, -200x300, -683x1024, -768x1152, etc.
    base_name = re.sub(r'-\d+x\d+', '', image_name)
    # Also remove -scaled-1
    base_name = base_name.replace('-scaled-1', '').replace('-scaled', '')
    # Remove extension for grouping
    base_name_no_ext = os.path.splitext(base_name)[0]
    
    image_groups[base_name_no_ext].append(image_path)

print(f"✓ Found {len(image_groups)} unique images (with size variants)")

# For each unique image group, find the largest/original version
unique_images = []

for base_name, paths in image_groups.items():
    # Prefer images without size suffix (original), or largest file
    original = None
    largest = None
    largest_size = 0
    
    for path in paths:
        filename = os.path.basename(path)
        # Check if it's the scaled-1 version (usually the largest)
        if '-scaled-1.jpg' in filename and '-scaled-1-' not in filename:
            original = path
            break
        
        # Track largest file
        size = os.path.getsize(path)
        if size > largest_size:
            largest_size = size
            largest = path
    
    # Prefer original, fall back to largest
    best_image = original if original else largest
    unique_images.append(best_image)

print(f"✓ Selected {len(unique_images)} best quality images")
print("\n" + "=" * 80)
print("MATCHING IMAGES TO CHILDREN:")
print("=" * 80)

# Match images to children
matches = []

for image_path in unique_images:
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
    
    if best_match and best_score >= 0.50:  # 50% threshold
        matches.append({
            'image_path': image_path,
            'image_name': image_name,
            'image_base': image_base,
            'child_name': best_match['name'],
            'score': best_score
        })

# Sort by score
matches.sort(key=lambda x: x['score'], reverse=True)

print(f"\nFound {len(matches)} matches:\n")

for i, match in enumerate(matches[:20], 1):  # Show top 20
    print(f"{i}. {match['child_name']} ← {match['image_base']}")
    print(f"   Score: {match['score']:.1%} | {os.path.basename(match['image_path'])}")

if len(matches) > 20:
    print(f"\n... and {len(matches) - 20} more matches")

# Automatically copy the images
print("\n" + "=" * 80)
print(f"COPYING {len(matches)} IMAGES")
print("=" * 80)
print(f"From: {search_dir}")
print(f"To:   {target_dir}")

print("\nCopying images...")
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
            continue
        
        # Copy the file
        shutil.copy2(match['image_path'], target_path)
        copied += 1
        if copied <= 10:  # Show first 10
            print(f"✓ Copied: {target_filename}")
        elif copied == 11:
            print(f"  ... copying remaining files ...")
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
