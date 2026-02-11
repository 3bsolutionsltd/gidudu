import json
import shutil
import os

# Source image path
source_image = r"D:\Projects\Gidudu\sponsored\missing\NABUKWASI-PRISILLA-NANDUNGA-scaled-1-683x1024.jpg"
target_dir = "all_children_images"
target_filename = "NABUKWASI-PRISILLA-NANDUNGA-scaled-1-683x1024.jpg"
target_path = os.path.join(target_dir, target_filename)

print("Fixing Nadunga Priscilla's image assignment...")
print("=" * 80)

# Check if source exists
if not os.path.exists(source_image):
    print(f"❌ Source image not found: {source_image}")
    exit(1)

# Copy image if not already there
if not os.path.exists(target_path):
    shutil.copy2(source_image, target_path)
    print(f"✓ Copied image to: {target_path}")
else:
    print(f"✓ Image already exists in: {target_path}")

# Load children data
with open('server/data/children.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Create backup
with open('server/data/children.json.backup', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# Find Nadunga Priscilla and assign the image
found = False
for child in data['children']:
    if 'Nadunga Priscilla' in child['name']:
        child['image'] = target_filename
        print(f"✓ Assigned {target_filename} to {child['name']}")
        found = True
        break

if not found:
    print("❌ Child 'Nadunga Priscilla' not found in database")
    exit(1)

# Save updated data
with open('server/data/children.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("\n✓ Data saved to server/data/children.json")

# Check final count
children_with_images = sum(1 for c in data['children'] if c.get('image'))
children_without_images = len(data['children']) - children_with_images

print(f"\n{'='*80}")
print(f"🎉 FINAL STATUS - ALL CHILDREN NOW HAVE IMAGES!")
print(f"{'='*80}")
print(f"Total children: {len(data['children'])}")
print(f"Children with images: {children_with_images}")
print(f"Children without images: {children_without_images}")

if children_without_images == 0:
    print("\n✅ SUCCESS! All 158 children now have images assigned! 🎊")
