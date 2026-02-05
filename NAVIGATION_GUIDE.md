# Centralized Navigation System

## Overview
This project now uses a centralized navigation system to ensure consistent menu appearance and functionality across all pages. The navigation is loaded dynamically via JavaScript.

## Implementation

### How It Works
1. **nav-loader.js** - Contains the navigation HTML template and loads it into each page
2. **Navigation Placeholder** - Each HTML page has a `<div id="nav-placeholder"></div>` where the navigation is injected
3. **Automatic Active State** - The navigation automatically highlights the current page based on the URL
4. **Dropdown Support** - The navigation includes dropdown menus for "Ministries" and "Get Involved" sections

### Files Modified
- **js/nav-loader.js** (NEW) - Central navigation loader
- **index.html** - Updated to use centralized navigation
- **about.html** - Updated to use centralized navigation
- **stories.html** - Updated to use centralized navigation
- **faith.html** - Updated to use centralized navigation
- **hospital.html** - Updated to use centralized navigation
- **sponsor.html** - Updated to use centralized navigation
- **partner.html** - Updated to use centralized navigation
- **child.html** - Updated to use centralized navigation
- **js/script.js** - Updated to work with dynamically loaded navigation

### Navigation Structure
```
Home
About
Ministries (Dropdown)
  ├─ Our Faith
  ├─ Berakhah Hospital
  └─ Call to Prayer
Stories
Get Involved (Dropdown)
  ├─ Sponsor a Child
  └─ Partner With Us
Contact
Donate (Button)
```

## How to Update the Navigation

To update the navigation menu for all pages, you only need to edit **ONE file**:

1. Open `js/nav-loader.js`
2. Find the `navigationHTML` constant at the top of the file
3. Modify the HTML structure as needed
4. Save the file

The changes will automatically apply to all pages that use the navigation!

## Adding a New Page

When creating a new HTML page that needs navigation:

1. Add this script reference in the `<head>` section:
   ```html
   <script src="js/nav-loader.js"></script>
   ```

2. Add the navigation placeholder in the `<body>` section (right after the opening `<body>` tag):
   ```html
   <!-- Navigation (loaded dynamically) -->
   <div id="nav-placeholder"></div>
   ```

3. Make sure to add a `data-page` attribute to identify the page in the navigation template:
   ```html
   <li><a href="newpage.html" class="nav-link" data-page="newpage">New Page</a></li>
   ```

## Features

### Automatic Active State
The navigation automatically adds the `active` class to the current page's link based on the URL. This works for both main navigation items and dropdown items.

### Dropdown Menus
Dropdown menus work on both desktop (hover) and mobile (click). On mobile devices, clicking a dropdown parent will expand/collapse the menu.

### Mobile Hamburger Menu
The hamburger menu for mobile devices is automatically initialized and works across all pages.

### Scroll Effects
The navigation bar changes its appearance when scrolling down the page (handled by `script.js`).

## Browser Compatibility
The navigation system is compatible with all modern browsers and works on both desktop and mobile devices.

## Benefits

✅ **Single Source of Truth** - Navigation is defined in one place only
✅ **Consistency** - All pages have identical navigation
✅ **Easy Updates** - Change navigation once, updates everywhere
✅ **Maintainability** - Easier to maintain and update
✅ **Automatic Active State** - Current page is automatically highlighted
✅ **Dropdown Support** - Organized menu with dropdown sections
