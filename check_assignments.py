import json

# Load children data
with open('server/data/children.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check specific image assignments
target_images = ['NANDUDU-LINA', 'NAMBOZO-MERY', 'NAMBOZO-MIRACLE', 'NAMONO-GLADES']

print("Current assignments for specific images:")
print("=" * 80)
for child in data['children']:
    image = child.get('image', '')
    for target in target_images:
        if target in image:
            print(f"{target} → {child['name']}")
            break

print("\n\nChildren with matching names but no images:")
print("=" * 80)
name_mappings = {
    'NANDUDU-LINA': 'Nandudu Linah',
    'NAMBOZO-MERY': 'Nambozo Mary',
    'NAMBOZO-MIRACLE': 'Nambozo Miracle',
    'NAMONO-GLADES': 'Namono Gladys'
}

for child in data['children']:
    for image_name, expected_name in name_mappings.items():
        if expected_name.lower() in child['name'].lower() or child['name'].lower() in expected_name.lower():
            if not child.get('image'):
                print(f"{child['name']} (should have {image_name}) - NO IMAGE")
            else:
                print(f"{child['name']} - HAS: {child['image']}")
