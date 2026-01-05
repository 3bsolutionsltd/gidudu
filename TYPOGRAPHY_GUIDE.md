# Typography Guide - IGFM Website

## Font Families

### Primary Fonts (Already Loaded)
```css
/* Body & Interface */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;

/* Headings & Display */
font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

## Typography Scale

### Headings
```css
H1 - Hero Titles
├─ Size: 4rem (64px)
├─ Weight: 800 (Extra Bold)
├─ Letter Spacing: -0.03em
└─ Line Height: 1.1

H2 - Section Headings  
├─ Size: 3rem (48px)
├─ Weight: 700 (Bold)
├─ Letter Spacing: -0.02em
└─ Line Height: 1.2

H3 - Subsections
├─ Size: 2rem (32px)
├─ Weight: 600 (Semi-Bold)
├─ Letter Spacing: -0.01em
└─ Line Height: 1.2

H4 - Card Titles
├─ Size: 1.5rem (24px)
├─ Weight: 600 (Semi-Bold)
└─ Line Height: 1.2
```

### Body Text
```css
Body - Regular Content
├─ Size: 17px
├─ Weight: 400 (Regular)
├─ Letter Spacing: -0.01em
└─ Line Height: 1.75

Lead Text - Emphasis
├─ Size: 1.25rem (20px)
├─ Weight: 500 (Medium)
└─ Line Height: 1.7

Small Text - Captions
├─ Size: 0.9rem (14.4px)
├─ Weight: 400 (Regular)
└─ Line Height: 1.5
```

### Buttons
```css
Button Text
├─ Size: 16px
├─ Weight: 600 (Semi-Bold)
├─ Letter Spacing: 0.5px
├─ Transform: UPPERCASE
└─ Font: Poppins

Large Buttons
├─ Size: 18px
├─ Weight: 700 (Bold)
└─ Letter Spacing: 0.5px
```

### Navigation
```css
Nav Links
├─ Size: 15px
├─ Weight: 600 (Semi-Bold)
├─ Letter Spacing: 0.3px
└─ Line Height: 1.5
```

## Font Weights Reference

| Weight | Name | Usage |
|--------|------|-------|
| 300 | Light | Subtle text, mission statements |
| 400 | Regular | Body text, paragraphs |
| 500 | Medium | Lead paragraphs, emphasis |
| 600 | Semi-Bold | Subheadings, nav links, buttons |
| 700 | Bold | H2 headings, major sections |
| 800 | Extra Bold | H1 hero titles, impact text |

## Color Usage

### Text Colors
```css
--text-dark: #334155     /* Primary text */
--text-light: #64748b    /* Secondary text */
--dark-color: #1e293b    /* Headings */
--white: #ffffff         /* Hero text, buttons */
```

### Brand Colors
```css
--primary-color: #2563eb   /* Blue - CTAs, links */
--secondary-color: #10b981 /* Green - Success */
--accent-color: #f59e0b    /* Orange - Highlights */
```

## Usage Examples

### Hero Section
```html
<h1 class="hero-title">
  4rem / 800 weight / White / Poppins
  Loving God. Loving People. Changing Lives.
</h1>
<p class="hero-subtitle">
  1.5rem / 400 weight / White 95% / Inter
  Transforming communities in Uganda...
</p>
```

### Section Header
```html
<span class="section-tag">
  0.9rem / 600 weight / Uppercase / Poppins
  OUR MISSION
</span>
<h2>
  3rem / 700 weight / Dark / Poppins
  Demonstrating God's Love Through Service
</h2>
```

### Body Content
```html
<p class="lead">
  1.25rem / 500 weight / Dark / Inter
  International Great Faith Ministries...
</p>
<p>
  17px / 400 weight / Light gray / Inter
  We share God's love through...
</p>
```

## Responsive Typography

### Mobile (max-width: 768px)
```css
H1: 3rem (48px)
H2: 2.2rem (35.2px)
Body: 16px
Hero Title: 3rem
```

### Small Mobile (max-width: 480px)
```css
H1: 2.2rem (35.2px)
H2: 1.8rem (28.8px)
Body: 16px
Hero Title: 2.2rem
```

## Best Practices

1. **Hierarchy**: Maintain clear visual hierarchy using size, weight, and color
2. **Contrast**: Ensure sufficient contrast between text and background (WCAG AA)
3. **Readability**: Line length should be 50-75 characters for body text
4. **Consistency**: Use the defined scale consistently across all pages
5. **Performance**: Fonts are already optimized and loading from Google Fonts CDN

## Font Loading
```html
<!-- Already included in index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
```

## CSS Classes for Typography

```css
.hero-title        /* 4.5rem / 800 / White */
.hero-subtitle     /* 1.5rem / 400 / White */
.section-tag       /* 0.9rem / 600 / Uppercase */
.mission-text      /* 1.5rem / 300 / Light weight */
.lead              /* 1.25rem / 500 / Emphasis */
.note              /* 0.9rem / 400 / Italic */
```

---

**Your typography is now optimized and matches the professional style of watoto.com!**
