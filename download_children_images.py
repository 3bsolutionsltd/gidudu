"""
Download children images from Gidudu.org
Works with the existing children.json file or tries to fetch from the live site
"""

import json
import os
import requests
from urllib.parse import urljoin, urlparse
import time

def download_image(url, save_path, retries=3):
    """Download image from URL to local file with retries"""
    for attempt in range(retries):
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(url, timeout=30, headers=headers)
            response.raise_for_status()
            
            with open(save_path, 'wb') as f:
                f.write(response.content)
            return True
        except Exception as e:
            if attempt < retries - 1:
                print(f"  Retry {attempt + 1}/{retries - 1}...")
                time.sleep(2)
            else:
                print(f"  Error: {e}")
                return False
    return False

def load_children_data(local_path=None, remote_url=None):
    """Load children data from local file or remote URL"""
    children = []
    
    # Try local file first
    if local_path and os.path.exists(local_path):
        print(f"Loading data from local file: {local_path}")
        try:
            with open(local_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                children = data.get('children', [])
                print(f"✓ Loaded {len(children)} children from local file")
                return children
        except Exception as e:
            print(f"✗ Error reading local file: {e}")
    
    # Try remote URL
    if remote_url:
        print(f"Trying to load data from remote URL: {remote_url}")
        try:
            response = requests.get(remote_url, timeout=30)
            response.raise_for_status()
            data = response.json()
            children = data.get('children', [])
            print(f"✓ Loaded {len(children)} children from remote URL")
            return children
        except Exception as e:
            print(f"✗ Error fetching from remote: {e}")
    
    return children

def get_image_url(child, base_url="https://gidudu.org"):
    """Get the image URL for a child"""
    # Check if child already has an image URL
    if 'image' in child and child['image']:
        image = child['image']
        # If it's already a full URL
        if image.startswith('http'):
            return image
        # If it's a relative path
        if image.startswith('/'):
            return urljoin(base_url, image)
        # If it's just a filename or path
        return urljoin(base_url + '/images/', image)
    
    # Try to construct from child ID
    if 'id' in child:
        return f"{base_url}/images/{child['id']}.jpg"
    
    return None

def main():
    print("="*60)
    print("Children Image Downloader - Gidudu.org")
    print("="*60)
    
    # Configuration
    local_json_path = "server/data/children.json"
    alternative_json_path = "extracted_children.json"
    remote_json_url = "https://gidudu.org/server/data/children.json"
    base_url = "https://gidudu.org"
    output_dir = "downloaded_images"
    output_json = "downloaded_children_data.json"
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Load children data
    children = load_children_data(local_json_path, remote_json_url)
    
    # Try alternative path if first didn't work
    if not children:
        children = load_children_data(alternative_json_path, None)
    
    if not children:
        print("\n✗ Could not load children data from any source.")
        print("Please check that the JSON files exist or the website is accessible.")
        return
    
    print(f"\n{'='*60}")
    print(f"Found {len(children)} children. Starting image download...")
    print(f"{'='*60}\n")
    
    successful = 0
    failed = 0
    skipped = 0
    
    for i, child in enumerate(children, 1):
        name = child.get('name', 'Unknown')
        child_id = child.get('id', name.lower().replace(' ', '-'))
        
        print(f"{i}/{len(children)}: {name}")
        
        # Get image URL
        image_url = get_image_url(child, base_url)
        
        if not image_url:
            print(f"  ✗ No image URL available")
            failed += 1
            continue
        
        # Determine save path
        filename = f"{child_id}.jpg"
        save_path = os.path.join(output_dir, filename)
        
        # Skip if already downloaded
        if os.path.exists(save_path):
            print(f"  ⊘ Already exists: {filename}")
            child['local_image_path'] = save_path
            child['image_url'] = image_url
            skipped += 1
            continue
        
        print(f"  Downloading from: {image_url}")
        
        if download_image(image_url, save_path):
            child['local_image_path'] = save_path
            child['image_url'] = image_url
            successful += 1
            print(f"  ✓ Downloaded: {filename}")
        else:
            failed += 1
            print(f"  ✗ Failed to download")
        
        # Be nice to the server
        time.sleep(0.5)
    
    # Save updated JSON
    print(f"\nSaving data to {output_json}...")
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump({
            'downloaded_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            'total_children': len(children),
            'images_downloaded': successful,
            'images_failed': failed,
            'images_skipped': skipped,
            'children': children
        }, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print(f"\n{'='*60}")
    print(f"SUMMARY")
    print(f"{'='*60}")
    print(f"Total children: {len(children)}")
    print(f"Images downloaded: {successful}")
    print(f"Images skipped (already exist): {skipped}")
    print(f"Images failed: {failed}")
    print(f"Data saved to: {output_json}")
    print(f"Images saved to: {output_dir}/")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
