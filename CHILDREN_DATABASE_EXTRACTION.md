# Children Database Extraction Summary

## Overview
Successfully extracted **158 children** from the WordPress SQL database (`giduduorg_wp669.sql`) and replaced the previous 6-child subset with the complete dataset.

## Extraction Details

### Source
- **Database File:** `docs/giduduorg_wp669.sql` (50MB+ WordPress SQL dump)
- **Theme:** Alone – Charity Multipurpose Non-profit WordPress Theme
- **Storage Method:** ACF (Advanced Custom Fields) in `wp_postmeta` table

### Database Structure Discovered
Children data stored in `wp_postmeta` with the following fields:
- `name` - Child's name (text)
- `date_of_birth` - Format: YYYYMMDD (8 digits)
- `sex` - Gender: 'm' or 'f'
- `nationality` - Text field (typically "Ugandan" or "UGANDA")
- `story` - Longtext with child's background story
- `_thumbnail_id` - Reference to image attachment post_id

### Extraction Process
1. **Search Strategy:** Used known child names (Kabuya Prisca, Wandera Allan) to identify database structure
2. **Pattern Discovery:** Found ACF field pattern at line 56536: `(190048, 22918, 'name', 'KABUYA PRISCA')`
3. **Regex Extraction:** Created Python script (`extract_children.py`) to parse SQL file
4. **Spam Filtering:** Implemented validation to exclude test/spam entries:
   - Must have valid gender (m/f)
   - Must have 8-digit date of birth
   - Must have story text (minimum 20 characters)

### Results

**Total Entries Found:** 1,205 records with 'name' field
**Spam/Invalid Entries:** 1,047 filtered out
**Valid Children Extracted:** 158

### Known Children Verified
✓ Kabuya Prisca - Age 14, Female, Ugandan
✓ Wandera Allan - Age 14, Female, Ugandan
✓ Muwanguzi Eria - Age 12, Male, Ugandan
✓ Muwanguzi Trevor - Age 11, Male, Uganda

### Files Updated
- **Backup Created:** `server/data/children.json.backup` (7KB - original 6 children)
- **New Database:** `server/data/children.json` (159KB - 158 children)
- **Extraction Script:** `extract_children.py`
- **Raw Extracted Data:** `extracted_children.json`

## Data Format
Each child record includes:
```json
{
  "id": "child-name-slug",
  "name": "Child Name",
  "birthday": "Month DD, YYYY",
  "age": 14,
  "gender": "Male|Female",
  "nationality": "Ugandan",
  "location": "Uganda",
  "image": "child-photo.jpg",
  "story": ["Paragraph 1", "Paragraph 2", ...],
  "dream": null
}
```

## Growth
- **Before:** 6 children (hardcoded)
- **After:** 158 children (complete database)
- **Increase:** 2,533% more children available for sponsorship

## Next Steps
1. Update `sponsor.html` to dynamically load children from JSON
2. Implement pagination or filtering for 158 children
3. Consider creating individual child profile pages
4. Add search functionality to help sponsors find children
5. Update any hardcoded child references in HTML

## Notes
- The WordPress database contained many spam entries from form submissions (Eric Jones, test emails, etc.)
- Real children entries always had complete data (gender, DOB, substantial story)
- Some children may have missing images (attachment references need separate handling)
- Ages calculated from birthdates as of extraction date (February 2026)
- Story paragraphs are automatically split by line breaks in the original content

## Extraction Script
The Python script (`extract_children.py`) can be rerun if new children are added to the WordPress database:
```bash
python extract_children.py
```

Location: `C:\Users\DELL\gidudu\extract_children.py`
