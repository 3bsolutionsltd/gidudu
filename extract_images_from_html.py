"""
Extract child image URLs from Gidudu.org sponsor page
by fetching and parsing the HTML directly
"""

import requests
from bs4 import BeautifulSoup
import json
import os
import time
import re

def fetch_sponsor_page(url):
    """Fetch the sponsor page HTML"""
    print(f"Fetching page: {url}")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"Error fetching page: {e}")
        return None

def parse_children_from_html(html):
    """Parse children data from HTML"""
    soup = BeautifulSoup(html, 'html.parser')
    children_data = []
    
    # Look for Elementor posts (WordPress structure on live site)
    elementor_posts = soup.find_all('article', class_='elementor-post')
    
    if elementor_posts:
        print(f"✓ Found {len(elementor_posts)} Elementor posts (children)")
        
        for post in elementor_posts:
            # Extract image from thumbnail link
            img = post.find('img')
            if not img:
                continue
                
            img_src = img.get('src')
            img_srcset = img.get('srcset', '')
            img_alt = img.get('alt', '')
            
            # Get higher resolution image from srcset if available
            if img_srcset:
                # Parse srcset to find largest image
                srcset_entries = [entry.strip().split(' ')[0] for entry in img_srcset.split(',')]
                # Get the original (largest) image
                if srcset_entries:
                    img_src = srcset_entries[-1]  # Last entry is usually largest
            
            # Extract link to child profile
            profile_link = post.find('a', class_='elementor-post__thumbnail__link')
            profile_url = profile_link.get('href') if profile_link else None
            
            # Extract child ID and name from URL
            child_id = None
            name = img_alt or 'Unknown'
            
            if profile_url and '/child/' in profile_url:
                # Extract ID from URL like: https://gidudu.org/child/muwanguzi-eria/
                child_id = profile_url.rstrip('/').split('/')[-1]
                # Generate name from ID (capitalize each word)
                name = ' '.join(word.capitalize() for word in child_id.replace('-', ' ').split())
            
            # Try to find title in post
            title_elem = post.find(class_='elementor-post__title')
            if title_elem:
                name = title_elem.get_text(strip=True)
            
            if not child_id:
                child_id = name.lower().replace(' ', '-')
            
            children_data.append({
                'id': child_id,
                'name': name,
                'image_url': img_src,
                'profile_url': profile_url,
                'alt_text': img_alt
            })
        
        return children_data
    
    # Fallback: Try other selectors
    print("  No Elementor posts found, trying other selectors...")
    selectors_to_try = [
        {'class': 'child'},
        {'class': 'sponsor-child'},  
        {'class': 'child-profile'},
        {'class': 'profile-card'},
        {'class': re.compile(r'child')},
    ]
    
    for selector in selectors_to_try:
        child_elements = soup.find_all('div', selector)
        if child_elements:
            print(f"✓ Found {len(child_elements)} elements with selector: {selector}")
            
            for child_elem in child_elements:
                # Extract image
                img = child_elem.find('img')
                img_url = img.get('src') if img else None
                img_alt = img.get('alt') if img else None
                
                # Extract name
                name_elem = child_elem.find(['h2', 'h3', 'h4', 'p'], class_=re.compile(r'name|title'))
                name = name_elem.get_text(strip=True) if name_elem else (img_alt or 'Unknown')
                
                # Extract any link
                link = child_elem.find('a')
                profile_url = link.get('href') if link else None
                
                # Extract ID from profile URL or image filename
                child_id = None
                if profile_url:
                    # Try to extract ID from URL
                    match = re.search(r'/child/([^/]+)', profile_url)
                    if match:
                        child_id = match.group(1)
                if not child_id and img_url:
                    # Extract from image filename
                    filename = os.path.basename(img_url)
                    child_id = os.path.splitext(filename)[0]
                if not child_id:
                    # Generate from name
                    child_id = name.lower().replace(' ', '-')
                
                children_data.append({
                    'id': child_id,
                    'name': name,
                    'image_url': img_url,
                    'profile_url': profile_url
                })
            
            break  # Found children, stop trying other selectors
    
    return children_data

def download_image(url, save_path):
    """Download an image"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        with open(save_path, 'wb') as f:
            f.write(response.content)
        return True
    except Exception as e:
        print(f"    Error: {e}")
        return False

def main():
    print("="*70)
    print("Extract Child Images from Gidudu.org - HTML Parser")
    print("="*70)
    
    url = "https://gidudu.org/sponsor/"
    output_dir = "extracted_images"
    output_json = "extracted_image_urls.json"
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Fetch page
    html = fetch_sponsor_page(url)
    if not html:
        print("✗ Could not fetch the page.")
        return
    
    # Save HTML for inspection
    with open("sponsor_page.html", "w", encoding="utf-8") as f:
        f.write(html)
    print(f"✓ Saved HTML to sponsor_page.html for inspection")
    
    # Parse children
    print("\nParsing children data from HTML...")
    children = parse_children_from_html(html)
    
    if not children:
        print("✗ No children found in HTML")
        print("  The page structure may be different than expected.")
        print("  Check sponsor_page.html to see the actual structure.")
        return
    
    print(f"✓ Found {len(children)} children\n")
    
    # Save JSON with image URLs
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump({
            'source': url,
            'extracted_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            'total_children': len(children),
            'children': children
        }, f, indent=2, ensure_ascii=False)
    print(f"✓ Saved data to {output_json}\n")
    
    # Download images
    print(f"{'='*70}")
    print("Downloading images...")
    print(f"{'='*70}\n")
    
    successful = 0
    failed = 0
    
    for i, child in enumerate(children, 1):
        name = child['name']
        img_url = child['image_url']
        
        print(f"{i}/{len(children)}: {name}")
        
        if not img_url:
            print("  ✗ No image URL")
            failed += 1
            continue
        
        # Determine filename
        filename = os.path.basename(img_url).split('?')[0]  # Remove query params
        if not filename or '.' not in filename:
            filename = f"{child['id']}.jpg"
        
        save_path = os.path.join(output_dir, filename)
        
        print(f"  URL: {img_url}")
        print(f"  Saving to: {filename}")
        
        if download_image(img_url, save_path):
            child['local_path'] = save_path
            successful += 1
            print(f"  ✓ Downloaded")
        else:
            failed += 1
            print(f"  ✗ Failed")
        
        time.sleep(0.5)  # Be nice to the server
    
    # Update JSON with local paths
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump({
            'source': url,
            'extracted_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            'total_children': len(children),
            'images_downloaded': successful,
            'images_failed': failed,
            'children': children
        }, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print(f"\n{'='*70}")
    print(f"SUMMARY")
    print(f"{'='*70}")
    print(f"Children found: {len(children)}")
    print(f"Images downloaded: {successful}")
    print(f"Images failed: {failed}")
    print(f"Data saved to: {output_json}")
    print(f"Images saved to: {output_dir}/")
    print(f"Page HTML saved to: sponsor_page.html")
    print(f"{'='*70}")

if __name__ == "__main__":
    main()
