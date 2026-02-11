# Children Image Scraper - Gidudu.org

This script scrapes children's images from https://gidudu.org/sponsor/ which uses infinite scroll to load children dynamically.

## Features

- ✅ Handles infinite scroll to load all children
- ✅ Extracts child data (name, ID, info)
- ✅ Downloads all images automatically
- ✅ Saves data to JSON file
- ✅ Progress tracking and summary report

## Prerequisites

1. **Python 3.7+** installed
2. **Google Chrome** browser installed
3. **ChromeDriver** installed (same version as your Chrome)

## Installation

### Step 1: Install Python Dependencies

```bash
# Activate your virtual environment if you have one
.venv\Scripts\Activate.ps1

# Install required packages
pip install -r scraper_requirements.txt
```

### Step 2: Install ChromeDriver

**Option A: Automatic (Recommended)**
```bash
pip install webdriver-manager
```

Then modify the script to use:
```python
from webdriver_manager.chrome import ChromeDriverManager
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=chrome_options)
```

**Option B: Manual**
1. Check your Chrome version: `chrome://version/`
2. Download matching ChromeDriver from: https://chromedriver.chromium.org/downloads
3. Extract and add to your PATH, or place in project directory

## Usage

### Run the scraper:

```bash
python scrape_children_images.py
```

### What it does:

1. Opens Chrome browser (visible by default)
2. Navigates to https://gidudu.org/sponsor/
3. Scrolls down repeatedly to trigger infinite scroll
4. Waits for all children to load
5. Extracts data from each child card
6. Downloads all images to `scraped_images/` folder
7. Saves complete data to `scraped_children_data.json`

### Output

- **scraped_images/**: Folder containing all downloaded images
  - Images named by child ID: `abbas-bollo.jpg`, `ajambo-faith-mary.jpg`, etc.
- **scraped_children_data.json**: JSON file containing:
  - Child ID, name, info text
  - Original image URL
  - Local image path
  - Download statistics

## Customization

### Run in Headless Mode (no browser window)

Edit `scrape_children_images.py` and uncomment:
```python
chrome_options.add_argument('--headless')
```

### Adjust Scroll Settings

Modify these variables in the script:
```python
max_scroll_attempts = 50  # Maximum scrolls before stopping
time.sleep(2)             # Wait time between scrolls
```

### Change Output Locations

```python
output_dir = "scraped_images"           # Image folder
output_json = "scraped_children_data.json"  # Data file
```

## Troubleshooting

### "ChromeDriver not found"
- Install webdriver-manager or download ChromeDriver manually
- Ensure ChromeDriver is in your PATH or project directory

### "No children found"
- The website structure may have changed
- Check if the website is accessible
- Verify the CSS class names match (currently using `child-card`)

### Slow Loading
- Increase `time.sleep(2)` to give more time between scrolls
- Check your internet connection

### Not All Children Loading
- Increase `max_scroll_attempts` value
- Check if the website has rate limiting

## Example Output

```
============================================================
Children Image Scraper - Gidudu.org
============================================================
Setting up browser...
Loading https://gidudu.org/sponsor/...
Page loaded. Starting to scroll...
Loaded 12 children so far...
Loaded 24 children so far...
Loaded 36 children so far...
...
Reached the bottom of the page.

Total children loaded: 84

Extracting child data...
1. Abbas Bollo - https://gidudu.org/images/abbas-bollo.jpg
2. Ajambo Faith Mary - https://gidudu.org/images/ajambo-faith-mary.jpg
...

Saving data to scraped_children_data.json...

Downloading images to scraped_images/...
✓ Downloaded: abbas-bollo.jpg
✓ Downloaded: ajambo-faith-mary.jpg
...

============================================================
SUMMARY
============================================================
Total children found: 84
Images downloaded: 82
Images failed: 2
Data saved to: scraped_children_data.json
Images saved to: scraped_images/
============================================================
```

## Notes

- The script respects the website structure and doesn't overload the server
- Images are downloaded one at a time with proper error handling
- All data is saved locally for offline use
- Run periodically to update with new children

## Legal & Ethical Considerations

- This script is for authorized use only
- Respect the website's robots.txt and terms of service
- Use scraped data responsibly and according to privacy laws
- Consider rate limiting to avoid server overload
