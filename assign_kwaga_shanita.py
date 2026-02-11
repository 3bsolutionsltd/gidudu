import json

# Load children data
with open('server/data/children.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Create backup
with open('server/data/children.json.backup', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# Find Kwaga Shanita and assign the image
for child in data['children']:
    if 'Kwaga Shanita' in child['name']:
        child['image'] = 'kwga-shan-683x1024.jpg'
        print(f"✓ Assigned kwga-shan-683x1024.jpg to {child['name']}")
        break

# Save updated data
with open('server/data/children.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("\n✓ Data saved to server/data/children.json")

# Check final count
children_with_images = sum(1 for c in data['children'] if c.get('image'))
children_without_images = len(data['children']) - children_with_images

print(f"\n{'='*80}")
print(f"FINAL STATUS:")
print(f"{'='*80}")
print(f"Total children: {len(data['children'])}")
print(f"Children with images: {children_with_images}")
print(f"Children without images: {children_without_images}")

if children_without_images > 0:
    print(f"\nRemaining children without images:")
    for child in data['children']:
        if not child.get('image'):
            print(f"  • {child['name']}")
