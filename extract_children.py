"""
Extract children data from WordPress SQL dump and convert to JSON format
This script reads the giduduorg_wp669.sql file and extracts child/sponsorship data
Children are stored in wp_postmeta table with ACF (Advanced Custom Fields)
"""

import re
import json
from datetime import datetime

def calculate_age(birth_date_str):
    """Calculate age from birth date in format YYYYMMDD"""
    try:
        if not birth_date_str or birth_date_str == '':
            return 0
        year = int(birth_date_str[:4])
        month = int(birth_date_str[4:6])
        day = int(birth_date_str[6:8])
        birth_date = datetime(year, month, day)
        today = datetime.now()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        return age
    except:
        return 0

def format_birth_date(birth_date_str):
    """Convert YYYYMMDD to 'Month DD, YYYY' format"""
    try:
        if not birth_date_str or birth_date_str == '':
            return ''
        year = birth_date_str[:4]
        month = birth_date_str[4:6]
        day = birth_date_str[6:8]
        month_names = ['', 'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December']
        month_name = month_names[int(month)]
        return f"{month_name} {int(day)}, {year}"
    except:
        return ''

def parse_sql_file(sql_file_path):
    """Parse WordPress SQL file to extract children data from wp_postmeta"""
    print("Reading SQL file...")
    with open(sql_file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Find all entries with 'name' field in wp_postmeta (these are our children)
    # Pattern: (id, post_id, 'name', 'CHILD NAME')
    name_pattern = r"\((\d+),\s*(\d+),\s*'name',\s*'([^']+)'\)"
    name_matches = re.findall(name_pattern, content)
    
    print(f"Found {len(name_matches)} children with 'name' field")
    
    children = []
    child_post_ids = {}
    
    # Group by post_id
    for match in name_matches:
        meta_id, post_id, name = match
        if post_id not in child_post_ids:
            child_post_ids[post_id] = {'name': name.strip()}
    
    print(f"Unique children post IDs: {len(child_post_ids)}")
    
    # Now extract all meta fields for each post_id
    valid_children = []
    skipped = 0
    processed = 0
    
    for post_id in child_post_ids:
        child_name = child_post_ids[post_id]['name']
        processed += 1
        
        # Progress indicator every 100 entries
        if processed % 100 == 0:
            print(f"Processed {processed}/1205 children...")
        
        # Extract date_of_birth
        dob_pattern = rf"\(\d+,\s*{post_id},\s*'date_of_birth',\s*'([^']+)'\)"
        dob_match = re.search(dob_pattern, content)
        dob = dob_match.group(1) if dob_match else ''
        
        # Extract sex/gender
        sex_pattern = rf"\(\d+,\s*{post_id},\s*'sex',\s*'([^']+)'\)"
        sex_match = re.search(sex_pattern, content)
        sex = sex_match.group(1) if sex_match else ''
        gender = 'Male' if sex == 'm' else 'Female' if sex == 'f' else ''
        
        # FILTER: Skip if no valid gender or date of birth (spam entries)
        if not gender or not dob or len(dob) != 8:
            skipped += 1
            continue
        
        # Extract nationality
        nationality_pattern = rf"\(\d+,\s*{post_id},\s*'nationality',\s*'([^']+)'\)"
        nationality_match = re.search(nationality_pattern, content)
        nationality = nationality_match.group(1) if nationality_match else 'Ugandan'
        
        # Extract story
        story_pattern = rf"\(\d+,\s*{post_id},\s*'story',\s*'([^']+)'\)"
        story_match = re.search(story_pattern, content)
        story_text = story_match.group(1) if story_match else ''
        
        # FILTER: Skip if no substantial story (likely spam/test) - reduced to 20 chars
        if not story_text or len(story_text) < 20:
            skipped += 1
            continue
        
        # Split story into paragraphs
        story_paragraphs = []
        if story_text:
            # Split by common paragraph markers
            story_paragraphs = [p.strip() for p in re.split(r'\n\n+|\r\n\r\n+', story_text) if p.strip()]
            if not story_paragraphs:
                story_paragraphs = [story_text]
        
        # Find image attachment
        thumbnail_pattern = rf"\(\d+,\s*{post_id},\s*'_thumbnail_id',\s*'(\d+)'\)"
        thumbnail_match = re.search(thumbnail_pattern, content)
        
        image = ''
        if thumbnail_match:
            attachment_id = thumbnail_match.group(1)
            image_pattern = rf"\({attachment_id},\s*'_wp_attached_file',\s*'[^']*?/([^'/]+\.jpg)'\)"
            image_match = re.search(image_pattern, content)
            if image_match:
                image = image_match.group(1)
        
        # Create child ID from name
        child_id = child_name.lower().replace(' ', '-').replace("'", "")
        
        # Format the data
        child = {
            'id': child_id,
            'name': child_name.title(),  # Proper case
            'birthday': format_birth_date(dob),
            'age': calculate_age(dob),
            'gender': gender,
            'nationality': nationality.title(),
            'location': 'Uganda',  # Default
            'image': image,
            'story': story_paragraphs,
            'dream': None
        }
        
        valid_children.append(child)
    
    print(f"\n{skipped} spam/invalid entries skipped")
    children = valid_children
    
    return children

def main():
    sql_file = "C:\\Users\\DELL\\gidudu\\docs\\giduduorg_wp669.sql"
    output_file = "C:\\Users\\DELL\\gidudu\\extracted_children.json"
    
    print("=" * 60)
    print("WordPress Children Data Extractor")
    print("=" * 60)
    
    children = parse_sql_file(sql_file)
    
    # Sort by name
    children.sort(key=lambda x: x['name'])
    
    print(f"\n{'=' * 60}")
    print(f"Successfully extracted {len(children)} children!")
    print(f"{'=' * 60}")
    
    # Display first few
    print("\nFirst 5 children:")
    for child in children[:5]:
        print(f"  - {child['name']} ({child['gender']}, Age {child['age']})")
    
    # Save to JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({"children": children}, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Data saved to: {output_file}")
    print(f"✓ Ready to replace server/data/children.json")

if __name__ == "__main__":
    main()
