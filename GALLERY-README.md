# Gallery — The Natural Ones

## How to Add Photos

1. **Place the image** in the correct folder under `public/images/gallery/<category>/`.
   - `public/images/gallery/rehearsals/`
   - `public/images/gallery/comic-con/`
   - `public/images/gallery/unicorn-theatre/`
   - `public/images/gallery/group-photos/`

2. **Name your file** with a zero-padded numeric prefix for display ordering:
   ```
   01-rehearsal-warmup.jpg
   02-rehearsal-blocking.jpg
   03-scene-run.jpg
   ```
   Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`

3. **Register the image** in `src/gallery-data.js`. Add one line to the `images` array of the correct category:
   ```js
   { src: "01-rehearsal-warmup.jpg", alt: "Cast warming up before rehearsal" },
   ```
   - `src` (required): The filename only (not the full path).
   - `alt` (optional but recommended): Alt text for accessibility. If omitted, alt text is auto-generated from the filename.

4. **Deploy**. That's it. No other files need editing.

## How to Add a New Category

1. Create a new folder: `public/images/gallery/your-category-name/`

2. Add a new entry in `src/gallery-data.js`:
   ```js
   {
     id: 'your-category-name',
     title: 'Your Category Title',
     folder: 'your-category-name',
     images: [
       { src: "01-first-photo.jpg", alt: "Description" },
     ],
   },
   ```

3. The order of categories in the array controls their display order on the page.

## Notes

- Categories with no images are automatically hidden.
- Images display at their natural aspect ratio — no cropping.
- The gallery grid adapts to screen size (3-4 columns desktop, 2-3 tablet, 1-2 mobile).
- Clicking a photo opens a lightbox with keyboard (arrow keys, Escape) and swipe navigation.
