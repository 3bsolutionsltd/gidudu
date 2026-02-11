import json

# Load children data
with open('server/data/children.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find children without images
children_without_images = [c for c in data['children'] if not c.get('image')]

print(f"Children without images: {len(children_without_images)} out of {len(data['children'])}")
print("=" * 80)
print()

# Group by first letter of name for easier viewing
from collections import defaultdict
grouped = defaultdict(list)

for child in children_without_images:
    first_letter = child['name'][0].upper()
    grouped[first_letter].append(child)

# Print grouped by first letter
for letter in sorted(grouped.keys()):
    print(f"\n{letter}:")
    print("-" * 40)
    for child in grouped[letter]:
        age = child.get('age', 'N/A')
        gender = child.get('gender', 'N/A')
        location = child.get('location', 'N/A')
        print(f"  • {child['name']} ({gender}, {age} years) - {location}")

# Print full list
print("\n\n" + "=" * 80)
print("FULL LIST (for easy copying):")
print("=" * 80)
for i, child in enumerate(children_without_images, 1):
    print(f"{i}. {child['name']}")
