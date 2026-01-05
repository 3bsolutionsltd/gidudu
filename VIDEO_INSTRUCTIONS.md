# Hero Video Setup Instructions

## Required Video File

To complete the Watoto.com-style hero section with motion video, you need to add a background video to your website.

### Video Specifications

- **Location**: Place your video file in the `images/` folder
- **Filename**: `hero-video.mp4` (primary) and/or `hero-video.webm` (optional, for better browser support)
- **Recommended Settings**:
  - Resolution: 1920x1080 (Full HD) or higher
  - Duration: 10-30 seconds (looping video)
  - File size: Keep under 10MB for fast loading
  - Format: MP4 (H.264 codec) is widely supported
  - Content: Should showcase your ministry work - children, community, hope, transformation

### How to Add Your Video

1. **Prepare your video**:
   - Use video editing software to trim and optimize your video
   - Compress the video to reduce file size while maintaining quality
   - Consider using tools like HandBrake or FFmpeg for optimization

2. **Upload the video**:
   ```
   gidudu/
   └── images/
       ├── hero-video.mp4    ← Place your video here
       └── hero-video.webm   ← Optional for better support
   ```

3. **Test the video**:
   - Open your website in a browser
   - The video should autoplay, loop, and be muted
   - Check loading speed and performance

### Alternative: Use YouTube Video

If you prefer to embed a YouTube video instead, replace the video section in `index.html` with:

```html
<div class="hero-video-container">
    <iframe 
        src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1&loop=1&controls=0&playlist=YOUR_VIDEO_ID" 
        frameborder="0" 
        allow="autoplay; encrypted-media" 
        allowfullscreen>
    </iframe>
</div>
```

### Fallback Background

If no video is added, the site will display the current background image (`gidudu_hero_section.jpg`) as a fallback. The overlay and text will still look great!

### Video Optimization Tools

- **HandBrake**: https://handbrake.fr/ (Free video converter)
- **CloudConvert**: https://cloudconvert.com/ (Online converter)
- **FFmpeg**: Command-line tool for video processing
- **Vimeo**: Professional video hosting with embed options

### Example Command (FFmpeg):
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -vf scale=1920:1080 hero-video.mp4
```

---

**Need Help?** If you need assistance sourcing or creating a hero video, consider:
- Recording footage at your ministry events
- Using stock footage from sites like Pexels or Unsplash
- Hiring a videographer to capture your ministry's story
