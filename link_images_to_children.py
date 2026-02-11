"""
Link downloaded images to local children data
Updates server/data/children.json with correct image filenames
"""

import json
import os
from difflib import SequenceMatcher

def similarity(a, b):
    """Calculate similarity between two strings"""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def normalize_name(name):
    """Normalize name for comparison"""
    return name.lower().strip().replace('-', ' ').replace('  ', ' ')

def find_best_match(child_name, image_files, used_images):
    """Find the best matching image file for a child name"""
    child_normalized = normalize_name(child_name)
    best_match = None
    best_score = 0
    
    for img_file in image_files:
        # Skip if image already used
        if img_file in used_images:
            continue
            
        # Remove extension and scaling suffixes
        img_name = img_file.replace('.jpg', '').replace('.jpeg', '').replace('.png', '')
        img_name = img_name.replace('-scaled-1', '').replace('-scaled', '').replace('-1', '')
        img_normalized = normalize_name(img_name)
        
        # Calculate similarity
        score = similarity(child_normalized, img_normalized)
        
        if score > best_score:
            best_score = score
            best_match = img_file
    
    return best_match, best_score

def main():
    print("="*70)
    print("Link Downloaded Images to Children Data")
    print("="*70)
    
    # Paths
    images_dir = "all_children_images"
    local_json = "server/data/children.json"
    downloaded_json = "all_children_data.json"
    backup_json = "server/data/children.json.backup"
    
    # Check if files exist
    if not os.path.exists(local_json):
        print(f"✗ Local children data not found: {local_json}")
        return
    
    if not os.path.exists(images_dir):
        print(f"✗ Images directory not found: {images_dir}")
        return
    
    # Get list of downloaded images
    image_files = [f for f in os.listdir(images_dir) 
                   if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    print(f"\n✓ Found {len(image_files)} downloaded images")
    
    # Load local children data
    print(f"✓ Loading local children data from {local_json}")
    with open(local_json, 'r', encoding='utf-8') as f:
        local_data = json.load(f)
    
    local_children = local_data.get('children', [])
    print(f"✓ Found {len(local_children)} children in local data")
    
    # Load downloaded children data for additional info
    wp_children_map = {}
    if os.path.exists(downloaded_json):
        print(f"✓ Loading WordPress children data from {downloaded_json}")
        with open(downloaded_json, 'r', encoding='utf-8') as f:
            wp_data = json.load(f)
        
        for child in wp_data.get('children', []):
            if 'title' in child and 'slug' in child:
                name = child['title'].get('rendered', '')
                slug = child['slug']
                img_url = child.get('image_url', '')
                if img_url:
                    wp_children_map[slug] = {
                        'name': name,
                        'image_url': img_url,
                        'filename': os.path.basename(img_url)
                    }
    
    # Create backup
    print(f"\n✓ Creating backup: {backup_json}")
    with open(backup_json, 'w', encoding='utf-8') as f:
        json.dump(local_data, f, indent=2, ensure_ascii=False)
    
    # Match images to children
    print(f"\n{'='*70}")
    print("Step 1: Checking for duplicate image assignments...")
    print(f"{'='*70}\n")
    
    # First pass: identify duplicate image assignments
    image_to_children = {}
    for child in local_children:
        img = child.get('image', '')
        if img:
            if img not in image_to_children:
                image_to_children[img] = []
            image_to_children[img].append(child)
    
    # Clear duplicates - keep only the child with BEST NAME MATCH
    duplicates_cleared = 0
    for img, children_list in image_to_children.items():
        if len(children_list) > 1:
            # Get image name without extension
            img_name = img.replace('.jpg', '').replace('.jpeg', '').replace('.png', '')
            img_name = img_name.replace('-scaled-1', '').replace('-scaled', '').replace('-1', '').replace('-683x1024', '').replace('-796x1024', '').replace('-701x1024', '')
            img_normalized = normalize_name(img_name)
            
            # Find child with best name match to image
            best_child = None
            best_score = 0
            for child in children_list:
                child_normalized = normalize_name(child.get('name', ''))
                score = similarity(child_normalized, img_normalized)
                if score > best_score:
                    best_score = score
                    best_child = child
            
            print(f"⚠️  Image '{img}' was assigned to {len(children_list)} children:")
            print(f"   Image name suggests: {img_name}")
            
            # Clear all except the best match
            for child in children_list:
                child_normalized = normalize_name(child.get('name', ''))
                score = similarity(child_normalized, img_normalized)
                if child == best_child:
                    print(f"   ✓ KEEPING (best match {score:.0%}): {child.get('name', 'Unknown')}")
                else:
                    print(f"   ✗ Clearing ({score:.0%} match): {child.get('name', 'Unknown')}")
                    child['image'] = ''
                    duplicates_cleared += 1
            print()
    
    if duplicates_cleared > 0:
        print(f"✓ Cleared {duplicates_cleared} duplicate assignments\n")
    
    print(f"{'='*70}")
    print("Step 2: Matching images to children...")
    print(f"{'='*70}\n")
    
    matched = 0
    updated = 0
    already_had = 0
    no_match = 0
    used_images = set()  # Track which images have been used
    
    # First, mark all currently assigned images as used
    for child in local_children:
        img = child.get('image', '')
        if img:
            used_images.add(img)
            already_had += 1
    
    print(f"ℹ️  {len(used_images)} images already assigned to children\n")
    
    # Now match images to children without images
    for i, child in enumerate(local_children, 1):
        child_name = child.get('name', 'Unknown')
        child_id = child.get('id', '')
        current_image = child.get('image', '')
        
        # Skip if child already has an image
        if current_image:
            continue
        
        # Try to match by ID first (from WordPress)
        if child_id in wp_children_map:
            wp_info = wp_children_map[child_id]
            filename = wp_info['filename']
            
            if filename in image_files and filename not in used_images:
                child['image'] = filename
                used_images.add(filename)  # Mark as used
                print(f"{i}. ✓ {child_name}")
                print(f"   Matched by ID: {filename}")
                matched += 1
                updated += 1
                continue
        
        # Try to match by name similarity
        best_match, score = find_best_match(child_name, image_files, used_images)
        
        if score >= 0.6:  # 60% similarity threshold
            child['image'] = best_match
            used_images.add(best_match)  # Mark as used
            print(f"{i}. ✓ {child_name}")
            print(f"   Matched by name ({score:.0%} similarity): {best_match}")
            matched += 1
            updated += 1
        else:
            if not current_image:
                print(f"{i}. ⊘ {child_name} - No good match found (best: {score:.0%})")
                no_match += 1
    
    # Step 2.5: Re-evaluate ALL existing assignments and swap if better match exists
    print(f"\n{'='*60}")
    print("Step 2.5: Re-evaluating existing assignments for better matches...")
    print(f"{'='*60}")
    
    swaps_made = 0
    
    # Create a list of children WITH images
    children_with_images = [c for c in local_data['children'] if c.get('image')]
    # Create a list of children WITHOUT images
    children_without_images_list = [c for c in local_data['children'] if not c.get('image')]
    
    # For each child that has an image, check if there's a better match
    for child_with_image in children_with_images:
        current_image = child_with_image['image']
        current_name = child_with_image['name']
        
        # Get the base image name without extension
        image_base = os.path.splitext(os.path.basename(current_image))[0]
        # Remove -scaled-1 or similar suffixes
        image_base = image_base.replace('-scaled-1', '').replace('-scaled', '')
        
        # Calculate current match similarity
        current_similarity = SequenceMatcher(None, 
                                            normalize_name(current_name), 
                                            normalize_name(image_base)).ratio()
        
        # Check if any child without an image is a better match
        best_alternative = None
        best_alternative_similarity = current_similarity
        
        for child_without_image in children_without_images_list:
            alternative_name = child_without_image['name']
            alternative_similarity = SequenceMatcher(None, 
                                                    normalize_name(alternative_name), 
                                                    normalize_name(image_base)).ratio()
            
            if alternative_similarity > best_alternative_similarity + 0.05:  # Must be at least 5% better
                best_alternative = child_without_image
                best_alternative_similarity = alternative_similarity
        
        # If we found a better match, swap them
        if best_alternative:
            print(f"\n🔄 Better match found for {image_base}:")
            print(f"   Current: {current_name} ({current_similarity:.1%})")
            print(f"   Better:  {best_alternative['name']} ({best_alternative_similarity:.1%})")
            
            # Swap the images
            best_alternative['image'] = current_image
            child_with_image['image'] = ''
            
            # Update the lists
            children_without_images_list.remove(best_alternative)
            children_without_images_list.append(child_with_image)
            
            swaps_made += 1
    
    print(f"\n✓ Swaps made: {swaps_made}")
    
    # Step 2.6: Consider swapping images between children who BOTH have images
    print(f"\n{'='*60}")
    print("Step 2.6: Checking for beneficial swaps between children with images...")
    print(f"{'='*60}")
    
    cross_swaps_made = 0
    
    # Reload the list of children with images after Step 2.5
    children_with_images = [c for c in local_data['children'] if c.get('image')]
    
    # For each pair of children with images, check if swapping would improve matches
    for i, child1 in enumerate(children_with_images):
        for child2 in children_with_images[i+1:]:
            image1 = child1.get('image', '')
            image2 = child2.get('image', '')
            name1 = child1['name']
            name2 = child2['name']
            
            if not image1 or not image2:
                continue
            
            # Get base image names
            image1_base = os.path.splitext(os.path.basename(image1))[0]
            image1_base = image1_base.replace('-scaled-1', '').replace('-scaled', '')
            image2_base = os.path.splitext(os.path.basename(image2))[0]
            image2_base = image2_base.replace('-scaled-1', '').replace('-scaled', '')
            
            # Calculate current similarities
            current_sim1 = SequenceMatcher(None, normalize_name(name1), normalize_name(image1_base)).ratio()
            current_sim2 = SequenceMatcher(None, normalize_name(name2), normalize_name(image2_base)).ratio()
            current_total = current_sim1 + current_sim2
            
            # Calculate swapped similarities
            swapped_sim1 = SequenceMatcher(None, normalize_name(name1), normalize_name(image2_base)).ratio()
            swapped_sim2 = SequenceMatcher(None, normalize_name(name2), normalize_name(image1_base)).ratio()
            swapped_total = swapped_sim1 + swapped_sim2
            
            # If swapping improves total similarity by at least 5%, do it
            if swapped_total > current_total + 0.05:  # At least 5% total improvement
                print(f"\n🔄 Beneficial swap found:")
                print(f"   {name1}: {image1_base} ({current_sim1:.1%}) → {image2_base} ({swapped_sim1:.1%})")
                print(f"   {name2}: {image2_base} ({current_sim2:.1%}) → {image1_base} ({swapped_sim2:.1%})")
                print(f"   Total improvement: {(swapped_total - current_total):.1%}")
                
                # Swap the images
                child1['image'] = image2
                child2['image'] = image1
                
                cross_swaps_made += 1
    
    print(f"\n✓ Cross-swaps made: {cross_swaps_made}")
    
    # Save updated data
    print(f"\n✓ Saving updated data to {local_json}")
    with open(local_json, 'w', encoding='utf-8') as f:
        json.dump(local_data, f, indent=2, ensure_ascii=False)
    
    # Check for any remaining duplicate images (should be none now)
    image_usage = {}
    for child in local_children:
        img = child.get('image', '')
        if img:
            if img not in image_usage:
                image_usage[img] = []
            image_usage[img].append(child.get('name', 'Unknown'))
    
    duplicates_found = False
    for img, children_list in image_usage.items():
        if len(children_list) > 1:
            if not duplicates_found:
                print(f"\n⚠️  WARNING: Duplicate images still detected!")
                print(f"{'='*70}")
                duplicates_found = True
            print(f"Image '{img}' assigned to {len(children_list)} children:")
            for child_name in children_list:
                print(f"  - {child_name}")
            print()
    
    # Count children with and without images
    children_with_images = sum(1 for c in local_children if c.get('image', ''))
    children_without_images = len(local_children) - children_with_images
    
    # Summary
    print(f"\n{'='*70}")
    print("SUMMARY")
    print(f"{'='*70}")
    print(f"Total children: {len(local_children)}")
    print(f"Available images: {len(image_files)}")
    print(f"Duplicates cleared: {duplicates_cleared}")
    print(f"New matches found: {matched}")
    print(f"Swaps made for better matches: {swaps_made}")
    print(f"Cross-swaps between children: {cross_swaps_made}")
    print(f"Total children with images: {children_with_images}")
    print(f"Children without images: {children_without_images}")
    print(f"Unique images used: {len(used_images)}")
    if not duplicates_found:
        print(f"✓ No duplicate images detected!")
    else:
        print(f"⚠️  Duplicates detected - please review above!")
    print(f"\nBackup saved to: {backup_json}")
    print(f"Updated data saved to: {local_json}")
    print(f"{'='*70}")
    
    # Show some examples
    if updated > 0:
        print("\n✓ Success! Your children now have linked images.")
        print("  Images are in: all_children_images/")
        print("  To use them on your website, update sponsor-loader.js to use:")
        print(f"    const imagePath = child.image ? `all_children_images/${{child.image}}` : 'images/placeholder-child.jpg';")

if __name__ == "__main__":
    main()
