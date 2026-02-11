import json
import os
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

# Get all assigned images
assigned_images = set()
for child in data['children']:
    image = child.get('image', '')
    if image:
        assigned_images.add(image)

# Get all available images
image_folder = 'all_children_images'
all_images = [f for f in os.listdir(image_folder) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]

# Find unassigned images
unassigned_images = [img for img in all_images if img not in assigned_images]

print(f"Children without images: {len(children_without_images)}")
print(f"Unassigned images: {len(unassigned_images)}")
print("\n" + "=" * 80)
print("CHECKING FOR POTENTIAL MATCHES:")
print("=" * 80)

for child in children_without_images:
    child_name = child['name']
    print(f"\n{child_name}:")
    
    # Find best matches
    matches = []
    for img in unassigned_images:
        img_base = os.path.splitext(img)[0]
        img_base = img_base.replace('-scaled-1', '').replace('-scaled', '')
        img_base = re.sub(r'-\d+x\d+', '', img_base)
        
        score = SequenceMatcher(None, normalize_name(child_name), normalize_name(img_base)).ratio()
        if score >= 0.40:  # Lower threshold to see more possibilities
            matches.append((img_base, score))
    
    # Sort by score
    matches.sort(key=lambda x: x[1], reverse=True)
    
    if matches:
        for img_base, score in matches[:5]:  # Show top 5
            print(f"  {score:.1%} - {img_base}")
    else:
        print(f"  No potential matches found")
