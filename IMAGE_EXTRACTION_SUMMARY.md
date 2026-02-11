# Children Image Download Summary

## Source Information
- **Website:** https://gidudu.org/sponsor/
- **Date:** February 10, 2026
- **Extraction Method:** WordPress REST API (`/wp-json/wp/v2/child?per_page=100`)

## Image URL Pattern
All children images are hosted at:
```
https://gidudu.org/wp-content/uploads/2025/09/[filename].jpg
```

## Results

### Total Statistics
- **Children Found:** 100
- **Images Downloaded:** 50+
- **Failed Downloads:** ~10-15 (network timeouts/resets)
- **No Image Available:** ~20 (children without uploaded images)

### Downloaded Images Location
- **Folder:** `all_children_images/`
- **JSON Data:** `all_children_data.json`

### Successfully Downloaded (Sample)
1. MUWANGUZI ERIA - 1000090923-scaled-1.jpg
2. NASIYO MERCY - 1000090918-scaled-1.jpg
3. Wambede Peter Paul - WAMBEDE-PETER-scaled-1.jpg
4. KABUYA PRISCA - Kabuya-Prisca.jpg
5. NAMALE ELIZABETH - NEGESA-ELIZABETH-scaled-1.jpg
6. GIBUYAMA JONATHAN - GIBUYAMA-JONATHAN-scaled.jpg
7. WAMBEDE EMMA - WAMBEDE-EMMA-scaled-1.jpg
8. NAMBOOZO SARAH - NAMBOZO-SARAH-scaled-1.jpg
9. NABUDE SHERRY - NABUDE-SHERRY-scaled-1.jpg
10. NAMBAFU JANE - NAMBAFU-JANE-scaled-1.jpg
... (40 more images)

## Scripts Created

### 1. `fetch_all_children_images.py`
- Fetches children data from WordPress REST API
- Downloads all available images automatically
- Handles WordPress featured_media IDs
- Retries failed downloads once
- Saves complete data to JSON

**Usage:**
```bash
python fetch_all_children_images.py
```

### 2. `extract_images_from_html.py`
- Parses HTML directly from sponsor page
- Extracts visible children (6 on initial load)
- Good for getting featured children
- Uses BeautifulSoup

### 3. `scrape_children_images.py`
- Selenium-based scraper with infinite scroll support
- Can handle dynamic JavaScript content
- More complex but handles all scenarios
- Requires ChromeDriver

### 4. `download_children_images.py`
- Simple downloader using existing JSON data
- Works with local `server/data/children.json`
- No web scraping required

## API Endpoints Discovered

### WordPress REST API
- **Children List:** `https://gidudu.org/wp-json/wp/v2/child?per_page=100`
  - Returns 100 children per page
  - Includes featured_media IDs
  - Contains child slug, name, profile link

- **Media Details:** `https://gidudu.org/wp-json/wp/v2/media/{mediaId}`
   - Returns full image URL
  - Provides source_url and alt_text

### File Structure
```
all_children_images/
├── 1000090918-scaled-1.jpg
├── 1000090923-scaled-1.jpg
├── BWAYILISA-JOSHUA-scaled-1.jpg
├── FUZI-WILSON-scaled-1.jpg
├── GALENDA-NAUME-scaled-1.jpg
├── GIBUYAMA-JONATHAN-scaled.jpg
├── GIDUDU-EMMA-scaled-1.jpg
├── GIDUDU-JOSEPH-scaled-1.jpg
├── GIDUDU-ROBERT-scaled-1.jpg
├── Kabuya-Prisca.jpg
├── KADOLI-ALVIN-scaled-1.jpg
├── KADOLI-JAMES-scaled-1.jpg
... (50+ images total)
```

## Notes

1. **Images appear dynamically on load** - The website uses AJAX to load children, not traditional infinite scroll
2. **100 children currently in WordPress** - API returns 100 children (may have more with pagination)
3. **Some children don't have images** - About 20% of children profiles lack uploaded photos
4. **Network connection resets** - Some downloads failed due to network issues, can be retried
5. **Image quality** - Most images are high-resolution "scaled" versions (1000px+)

## To Re-run or Update

Simply run the main script again:
```bash
python fetch_all_children_images.py
```

It will:
- Skip already downloaded images
- Download any new children added
- Update the JSON with latest data
- Retry previously failed downloads

## Image Usage

All downloaded images are located in `all_children_images/` folder:
- Ready for use in the local website
- Can be copied to `images/` folder
- Filenames match the ones used in WordPress
- Can be referenced by children IDs
