import os
import json
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

print(f"Searching for images for {len(children_without_images)} children...")
print("=" * 80)

# Search directory
search_dir = r"D:\Projects\Gidudu\2025\2025\09"

if not os.path.exists(search_dir):
    print(f"❌ Directory not found: {search_dir}")
    print("\nPlease verify the path and try again.")
else:
    print(f"✓ Directory found: {search_dir}")
    
    # Get all image files
    image_extensions = ('.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp')
    all_files = []
    
    for root, dirs, files in os.walk(search_dir):
        for file in files:
            if file.lower().endswith(image_extensions):
                all_files.append(os.path.join(root, file))
    
    print(f"✓ Found {len(all_files)} image files in directory")
    print("\n" + "=" * 80)
    print("MATCHING IMAGES TO CHILDREN:")
    print("=" * 80)
    
    # Try to match each image to children without images
    potential_matches = []
    
    for image_path in all_files:
        image_name = os.path.basename(image_path)
        image_base = os.path.splitext(image_name)[0]
        # Remove common suffixes
        image_base = image_base.replace('-scaled-1', '').replace('-scaled', '')
        image_base = image_base.replace('-683x1024', '').replace('-1024x683', '')
        
        # Try to match with children
        best_match = None
        best_score = 0
        
        for child in children_without_images:
            child_name = child['name']
            score = SequenceMatcher(None, normalize_name(child_name), normalize_name(image_base)).ratio()
            
            if score > best_score and score >= 0.5:  # 50% threshold
                best_score = score
                best_match = child
        
        if best_match:
            potential_matches.append({
                'image_path': image_path,
                'image_name': image_name,
                'image_base': image_base,
                'child_name': best_match['name'],
                'score': best_score
            })
    
    # Sort by score (best matches first)
    potential_matches.sort(key=lambda x: x['score'], reverse=True)
    
    print(f"\nFound {len(potential_matches)} potential matches:\n")
    
    for i, match in enumerate(potential_matches, 1):
        print(f"{i}. {match['child_name']} ← {match['image_base']}")
        print(f"   Score: {match['score']:.1%}")
        print(f"   Path: {match['image_path']}")
        print()
    
    # Show unmatched children
    matched_children = {m['child_name'] for m in potential_matches}
    unmatched_children = [c['name'] for c in children_without_images if c['name'] not in matched_children]
    
    print("\n" + "=" * 80)
    print(f"SUMMARY:")
    print("=" * 80)
    print(f"Total children without images: {len(children_without_images)}")
    print(f"Potential matches found: {len(potential_matches)}")
    print(f"Still unmatched: {len(unmatched_children)}")
    
    if unmatched_children:
        print(f"\nChildren still without matches:")
        for name in unmatched_children[:10]:  # Show first 10
            print(f"  • {name}")
        if len(unmatched_children) > 10:
            print(f"  ... and {len(unmatched_children) - 10} more")
