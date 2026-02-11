"""
Clear all image assignments from children.json
This prepares for a clean re-match without duplicates
"""

import json
import shutil

# Paths
json_file = "server/data/children.json"
backup_file = "server/data/children.json.backup-before-clear"

print("="*70)
print("Clear Image Assignments")
print("="*70)

# Create backup
print(f"Creating backup: {backup_file}")
shutil.copy(json_file, backup_file)

# Load data
with open(json_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Clear all images
children = data.get('children', [])
cleared = 0
for child in children:
    if child.get('image'):
        child['image'] = ''
        cleared += 1

print(f"Cleared {cleared} image assignments from {len(children)} children")

# Save
with open(json_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"✓ Saved to: {json_file}")
print(f"✓ Backup at: {backup_file}")
print("="*70)
print("\nNow run: python link_images_to_children.py")
