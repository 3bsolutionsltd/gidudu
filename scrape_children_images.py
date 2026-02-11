"""
Scrape children images from https://gidudu.org/sponsor/
Handles infinite scroll to load all children and extract their images
"""

import time
import json
import os
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from urllib.parse import urljoin, urlparse

def setup_driver():
    """Setup Chrome driver with appropriate options"""
    chrome_options = Options()
    # Uncomment the line below to run in headless mode (no browser window)
    # chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--window-size=1920,1080')
    
    # Automatically download and manage ChromeDriver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver

def scroll_and_load_all(driver, url):
    """Scroll to load all children with infinite scroll"""
    print(f"Loading {url}...")
    driver.get(url)
    
    # Wait for page to load completely
    print("Waiting for page to load...")
    time.sleep(5)  # Give JavaScript time to execute
    
    # Wait for children grid to be present
    try:
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.ID, "children-grid"))
        )
        print("Children grid found. Waiting for children to populate...")
        time.sleep(3)  # Additional time for cards to render
    except Exception as e:
        print(f"Could not find children grid: {e}")
        # Try to find any child cards anyway
        pass
    
    # Check if child cards exist
    child_cards = driver.find_elements(By.CLASS_NAME, "child-card")
    if not child_cards:
        print("No child cards found initially.")
        print("\n--- Debugging: Checking page structure ---")
        
        # Debug: Check what's actually on the page
        try:
            grid = driver.find_element(By.ID, "children-grid")
            print(f"✓ Found children-grid element")
            grid_html = grid.get_attribute('innerHTML')
            print(f"  Grid content length: {len(grid_html)} characters")
            if len(grid_html) < 100:
                print(f"  Grid HTML: {grid_html}")
        except:
            print("✗ No element with id 'children-grid' found")
        
        # Try alternative selectors
        alternative_selectors = [
            (By.CLASS_NAME, "child"),
            (By.CLASS_NAME, "sponsor-child"),
            (By.CLASS_NAME, "profile-card"),
            (By.CSS_SELECTOR, "[class*='child-card']"),
            (By.CSS_SELECTOR, ".grid > div"),
        ]
        
        print("  Trying alternative selectors...")
        for selector_type, selector_value in alternative_selectors:
            elements = driver.find_elements(selector_type, selector_value)
            if elements:
                print(f"  ✓ Found {len(elements)} elements with: {selector_value}")
                child_cards = elements
                break
        
        if not child_cards:
            print("\n✗ Could not find any child elements.")
            print("Saving page source to debug_page_source.html for inspection...")
            with open("debug_page_source.html", "w", encoding="utf-8") as f:
                f.write(driver.page_source)
            print("--- End debugging ---\n")
            return []
        print("--- End debugging ---\n")
    else:
        print(f"✓ Found {len(child_cards)} child cards initially")
    
    print("Starting to scroll to load more children...")
    
    # Determine which selector to use for counting during scroll
    selector_to_use = (By.CLASS_NAME, "child-card")
    if not driver.find_elements(By.CLASS_NAME, "child-card"):
        # Try to find which selector actually works
        if driver.find_elements(By.CLASS_NAME, "child"):
            selector_to_use = (By.CLASS_NAME, "child")
        elif driver.find_elements(By.CSS_SELECTOR, "[class*='child-card']"):
            selector_to_use = (By.CSS_SELECTOR, "[class*='child-card']")
    
    last_height = driver.execute_script("return document.body.scrollHeight")
    children_loaded = len(child_cards)
    scroll_attempts = 0
    max_scroll_attempts = 50  # Prevent infinite loops
    
    while scroll_attempts < max_scroll_attempts:
        # Scroll down to bottom
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        
        # Wait for new content to load
        time.sleep(2)
        
        # Calculate new scroll height and compare with last scroll height
        new_height = driver.execute_script("return document.body.scrollHeight")
        
        # Count current children using the selector that works
        current_children = len(driver.find_elements(*selector_to_use))
        
        if current_children > children_loaded:
            print(f"Loaded {current_children} children so far...")
            children_loaded = current_children
            scroll_attempts = 0  # Reset attempts counter
        else:
            scroll_attempts += 1
        
        # Break if we've reached the bottom
        if new_height == last_height:
            # Try scrolling one more time to be sure
            if scroll_attempts >= 3:
                print("Reached the bottom of the page.")
                break
        
        last_height = new_height
    
    print(f"\nTotal children loaded: {children_loaded}")
    # Return all found children using the selector that worked
    final_children = driver.find_elements(*selector_to_use)
    print(f"Returning {len(final_children)} child elements")
    return final_children

def extract_child_data(child_element, base_url):
    """Extract data from a single child card element"""
    try:
        # Extract image
        img_element = child_element.find_element(By.TAG_NAME, "img")
        img_src = img_element.get_attribute("src")
        img_url = urljoin(base_url, img_src) if img_src else None
        
        # Extract name
        try:
            name_element = child_element.find_element(By.CLASS_NAME, "child-name")
            name = name_element.text.strip()
        except:
            name = "Unknown"
        
        # Extract age and gender
        try:
            info_element = child_element.find_element(By.CLASS_NAME, "child-info")
            info_text = info_element.text.strip()
        except:
            info_text = ""
        
        # Extract ID from link or other attribute
        try:
            link_element = child_element.find_element(By.TAG_NAME, "a")
            href = link_element.get_attribute("href")
            # Extract ID from URL (e.g., child.html?id=abbas-bollo)
            if '?id=' in href:
                child_id = href.split('?id=')[-1]
            elif '#' in href:
                child_id = href.split('#')[-1]
            else:
                # Generate ID from name
                child_id = name.lower().replace(' ', '-')
        except:
            child_id = name.lower().replace(' ', '-')
        
        return {
            'id': child_id,
            'name': name,
            'info': info_text,
            'image_url': img_url,
            'image_filename': os.path.basename(urlparse(img_url).path) if img_url else None
        }
    except Exception as e:
        print(f"Error extracting child data: {e}")
        return None

def download_image(url, save_path):
    """Download image from URL to local file"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        with open(save_path, 'wb') as f:
            f.write(response.content)
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

def main():
    url = "https://gidudu.org/sponsor/"
    output_dir = "scraped_images"
    output_json = "scraped_children_data.json"
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Setup Selenium driver
    print("Setting up browser...")
    driver = setup_driver()
    
    try:
        # Load all children by scrolling
        child_elements = scroll_and_load_all(driver, url)
        
        if not child_elements:
            print("No children found on the page.")
            return
        
        # Extract data from each child
        print("\nExtracting child data...")
        children_data = []
        
        for i, child_element in enumerate(child_elements, 1):
            child_data = extract_child_data(child_element, url)
            if child_data:
                children_data.append(child_data)
                print(f"{i}. {child_data['name']} - {child_data['image_url']}")
        
        # Save JSON data
        print(f"\nSaving data to {output_json}...")
        with open(output_json, 'w', encoding='utf-8') as f:
            json.dump({
                'scraped_at': time.strftime('%Y-%m-%d %H:%M:%S'),
                'total_children': len(children_data),
                'children': children_data
            }, f, indent=2, ensure_ascii=False)
        
        # Download images
        print(f"\nDownloading images to {output_dir}/...")
        successful = 0
        failed = 0
        
        for child in children_data:
            if child['image_url']:
                filename = f"{child['id']}.jpg"
                save_path = os.path.join(output_dir, filename)
                
                if download_image(child['image_url'], save_path):
                    child['local_image_path'] = save_path
                    successful += 1
                    print(f"✓ Downloaded: {filename}")
                else:
                    failed += 1
                    print(f"✗ Failed: {filename}")
            else:
                print(f"✗ No image URL for {child['name']}")
                failed += 1
        
        # Update JSON with local paths
        with open(output_json, 'w', encoding='utf-8') as f:
            json.dump({
                'scraped_at': time.strftime('%Y-%m-%d %H:%M:%S'),
                'total_children': len(children_data),
                'images_downloaded': successful,
                'images_failed': failed,
                'children': children_data
            }, f, indent=2, ensure_ascii=False)
        
        print(f"\n{'='*60}")
        print(f"SUMMARY")
        print(f"{'='*60}")
        print(f"Total children found: {len(children_data)}")
        print(f"Images downloaded: {successful}")
        print(f"Images failed: {failed}")
        print(f"Data saved to: {output_json}")
        print(f"Images saved to: {output_dir}/")
        print(f"{'='*60}")
        
    finally:
        print("\nClosing browser...")
        driver.quit()

if __name__ == "__main__":
    print("="*60)
    print("Children Image Scraper - Gidudu.org")
    print("="*60)
    main()
