import json
from difflib import SequenceMatcher
import re

def normalize_name(name):
    return re.sub(r'[^a-z]', '', name.lower())

# Load children data
with open('server/data/children.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find all children with Sarah in their name
print("Children with 'Sarah' in name:")
print("=" * 80)
for child in data['children']:
    if 'sarah' in child['name'].lower():
        image = child.get('image', 'NO IMAGE')
        print(f"{child['name']}: {image}")

print("\n\nChildren with 'Mary' in name:")
print("=" * 80)
for child in data['children']:
    if 'mary' in child['name'].lower():
        image = child.get('image', 'NO IMAGE')
        print(f"{child['name']}: {image}")

print("\n\nChildren with 'Esther' in name:")
print("=" * 80)
for child in data['children']:
    if 'esther' in child['name'].lower():
        image = child.get('image', 'NO IMAGE')
        print(f"{child['name']}: {image}")

print("\n\nSimilarity Scores:")
print("=" * 80)
print(f"NAMBOZO-SARAH vs Namataka Sarah: {SequenceMatcher(None, normalize_name('Namataka Sarah'), normalize_name('NAMBOZO-SARAH')).ratio():.1%}")
print(f"NAMBOZO-SARAH vs Nambozo Mary: {SequenceMatcher(None, normalize_name('Nambozo Mary'), normalize_name('NAMBOZO-SARAH')).ratio():.1%}")
print(f"NAMBOZO-MERY vs Nambozo Esther: {SequenceMatcher(None, normalize_name('Nambozo Esther'), normalize_name('NAMBOZO-MERY')).ratio():.1%}")
print(f"NAMBOZO-MERY vs Nambozo Mary: {SequenceMatcher(None, normalize_name('Nambozo Mary'), normalize_name('NAMBOZO-MERY')).ratio():.1%}")
