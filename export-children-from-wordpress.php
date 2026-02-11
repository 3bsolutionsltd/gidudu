<?php
/**
 * WordPress Children Data Exporter
 * Upload this file to your WordPress root directory and access it via browser
 * Example: https://oldsite.gidudu.org/export-children-from-wordpress.php
 */

// Load WordPress
require_once('wp-load.php');

// Set JSON header
header('Content-Type: application/json');
header('Content-Disposition: attachment; filename="children-export.json"');

// Query for children - adjust post_type based on what the Alone theme uses
// Common post types: 'alone_cause', 'cause', 'child', 'sponsorship'
$args = array(
    'post_type' => array('alone_cause', 'cause', 'child'),  // Try multiple post types
    'posts_per_page' => -1,  // Get all
    'post_status' => 'publish',
    'orderby' => 'title',
    'order' => 'ASC'
);

$children_query = new WP_Query($args);
$children = array();

if ($children_query->have_posts()) {
    while ($children_query->have_posts()) {
        $children_query->the_post();
        $post_id = get_the_ID();
        
        // Get post meta/custom fields
        $birthday = get_post_meta($post_id, 'birthday', true);
        $age = get_post_meta($post_id, 'age', true);
        $gender = get_post_meta($post_id, 'gender', true);
        $nationality = get_post_meta($post_id, 'nationality', true);
        $location = get_post_meta($post_id, 'location', true);
        $dream = get_post_meta($post_id, 'dream', true);
        
        // Get featured image
        $image = '';
        if (has_post_thumbnail()) {
           $image_data = wp_get_attachment_image_src(get_post_thumbnail_id(), 'full');
            if ($image_data) {
                $image = basename($image_data[0]);
            }
        }
        
        // Get content as story paragraphs
        $content = get_the_content();
        $content = strip_tags($content);
        $story_paragraphs = array_filter(explode("\n\n", $content));
        
        // Create sanitized ID
        $child_id = sanitize_title(get_the_title());
        
        $child = array(
            'id' => $child_id,
            'name' => get_the_title(),
            'birthday' => $birthday ?: '',
            'age' => (int)$age ?: 0,
            'gender' => $gender ?: '',
            'nationality' => $nationality ?: 'Ugandan',
            'location' => $location ?: 'Uganda',
            'image' => $image,
            'story' => $story_paragraphs,
            'dream' => $dream ?: null
        );
        
        $children[] = $child;
    }
}
wp_reset_postdata();

// Output JSON
echo json_encode(array('children' => $children), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
exit;
