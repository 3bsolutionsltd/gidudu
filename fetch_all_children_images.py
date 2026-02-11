"""
Fetch all children data from the live site's JSON endpoint
and download all their images
"""

import requests
import json
import os
import time

def fetch_children_json(url):
    """Fetch children data from JSON endpoint"""
    print(f"Fetching children data from: {url}")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error: {e}")
        return None

def fetch_media_url(media_id, base_url="https://gidudu.org"):
    """Fetch media URL from WordPress API"""
    if not media_id or media_id == 0:
        return None, None
    
    try:
        url = f"{base_url}/wp-json/wp/v2/media/{media_id}"
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Get the full size image URL
        img_url = data.get('source_url') or data.get('guid', {}).get('rendered')
        alt_text = data.get('alt_text', '')
        
        return img_url, alt_text
    except:
        return None, None

def get_full_image_url(image_path, base_url="https://gidudu.org"):
    """Convert relative image path to full URL"""
    if not image_path:
        return None
    
    # Already a full URL
    if image_path.startswith('http'):
        return image_path
    
    # Handle wp-content paths
    if 'wp-content' in image_path:
        if image_path.startswith('/'):
            return base_url + image_path
        return base_url + '/' + image_path
    
    # Relative path from images folder
    if image_path.startswith('/'):
        return base_url + image_path
    
    # Just filename
    return f"{base_url}/wp-content/uploads/2025/09/{image_path}"

def download_image(url, save_path, retries=2):
    """Download an image with retry logic"""
    for attempt in range(retries):
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=30, stream=True)
            response.raise_for_status()
            
            with open(save_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            return True
        except Exception as e:
            if attempt < retries - 1:
                print(f"    Retry {attempt + 1}/{retries - 1}...")
                time.sleep(1)
            else:
                print(f"    Error: {str(e)[:100]}")
                return False
    return False

def main():
    print("="*70)
    print("Fetch ALL Children Images from Gidudu.org JSON Endpoint")
    print("="*70)
    
    # Try multiple possible JSON endpoints
    json_urls = [
        "https://gidudu.org/server/data/children.json",
        "https://gidudu.org/wp-json/wp/v2/child?per_page=100",
        "https://gidudu.org/wp-content/uploads/children.json",
    ]
    
    output_dir = "all_children_images"
    output_json = "all_children_data.json"
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Try to fetch children data
    children_data = None
    for url in json_urls:
        print(f"\nTrying: {url}")
        data = fetch_children_json(url)
        if data:
            # Handle different JSON structures
            if isinstance(data, dict) and 'children' in data:
                children_data = data['children']
                break
            elif isinstance(data, list):
                children_data = data
                break
    
    if not children_data:
        print("\n✗ Could not fetch children data from any endpoint")
        print("  The JSON endpoint might not be publicly accessible")
        print("  or might use a different structure.")
        return
    
    print(f"\n✓ Found {len(children_data)} children")
    
    # Save raw data
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump({
            'fetched_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            'total_children': len(children_data),
            'children': children_data
        }, f, indent=2, ensure_ascii=False)
    print(f"✓ Saved data to {output_json}")
    
    # Download images
    print(f"\n{'='*70}")
    print(f"Downloading images...")
    print(f"{'='*70}\n")
    
    successful = 0
    failed = 0
    skipped = 0
    
    for i, child in enumerate(children_data, 1):
        # Handle both WordPress API and custom JSON formats
        if 'title' in child and isinstance(child['title'], dict):
            # WordPress REST API format
            name = child['title'].get('rendered', 'Unknown')
            child_id = child.get('slug', str(child.get('id', name.lower().replace(' ', '-'))))
            featured_media_id = child.get('featured_media', 0)
        else:
            # Custom JSON format
            name = child.get('name', 'Unknown')
            child_id = child.get('id', name.lower().replace(' ', '-'))
            featured_media_id = None
        
        print(f"{i}/{len(children_data)}: {name}")
        
        # Try to get image URL
        image_url = None
        
        # First, try featured_media from WordPress API
        if featured_media_id:
            print(f"  Fetching media #{featured_media_id}...")
            image_url, alt_text = fetch_media_url(featured_media_id)
            if image_url:
                child['image_url'] = image_url
        
        # Fall back to direct image fields
        if not image_url:
            image_path = child.get('image') or child.get('featured_image') or child.get('thumbnail')
            if image_path:
                image_url = get_full_image_url(image_path)
        
        if not image_url:
            print(f"  ⊘ No image available")
            failed += 1
            continue
        
        # Filename from URL or ID
        if image_url:
            filename = os.path.basename(image_url).split('?')[0]
            if not filename or '.' not in filename:
                filename = f"{child_id}.jpg"
        else:
            filename = f"{child_id}.jpg"
        
        save_path = os.path.join(output_dir, filename)
        
        # Skip if exists
        if os.path.exists(save_path):
            print(f"  ⊘ Already exists")
            child['local_path'] = save_path
            skipped += 1
            continue
        
        print(f"  URL: {image_url}")
        
        if download_image(image_url, save_path):
            child['local_path'] = save_path
            successful += 1
            print(f"  ✓ Downloaded: {filename}")
        else:
            failed += 1
            print(f"  ✗ Failed")
        
        # Be nice to server
        time.sleep(0.3)
    
    # Update JSON with paths
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump({
            'fetched_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            'total_children': len(children_data),
            'images_downloaded': successful,
            'images_skipped': skipped,
            'images_failed': failed,
            'children': children_data
        }, f, indent=2, ensure_ascii=False)
    
    # Summary
    print(f"\n{'='*70}")
    print(f"SUMMARY")
    print(f"{'='*70}")
    print(f"Total children: {len(children_data)}")
    print(f"Images downloaded: {successful}")
    print(f"Images skipped: {skipped}")
    print(f"Images failed: {failed}")
    print(f"Data saved to: {output_json}")
    print(f"Images saved to: {output_dir}/")
    print(f"{'='*70}")
    
    # Show which endpoints might exist
    if successful > 0:
        print(f"\n✓ Successfully accessed the children data!")
        print(f"  You can use this script anytime to sync latest children.")

if __name__ == "__main__":
    main()
