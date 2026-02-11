import json
import os

# Load children data
with open('server/data/children.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

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

print(f"Total images in folder: {len(all_images)}")
print(f"Assigned images: {len(assigned_images)}")
print(f"Unassigned images: {len(unassigned_images)}")
print("\n" + "=" * 80)
print("UNASSIGNED IMAGES:")
print("=" * 80)

for i, img in enumerate(sorted(unassigned_images), 1):
    # Remove file extension and -scaled-1 suffix to show the name
    base_name = os.path.splitext(img)[0]
    base_name = base_name.replace('-scaled-1', '').replace('-scaled', '')
    print(f"{i}. {base_name}")
