/**
 * Gallery Data — The Natural Ones
 * ================================
 *
 * HOW TO ADD NEW PHOTOS:
 * 1. Place the image file in the correct folder under public/images/gallery/<category-folder>/
 * 2. Name it with a zero-padded numeric prefix for ordering, e.g. "01-description.jpg"
 * 3. Add one line to the appropriate category's `images` array below.
 * 4. That's it — the gallery page reads from this file automatically.
 *
 * HOW TO ADD A NEW CATEGORY:
 * 1. Create a new folder under public/images/gallery/<your-category>/
 * 2. Add a new entry to the `galleryCategories` array below following the pattern.
 * 3. Add your images to the folder and list them in the `images` array.
 *
 * ENTRY FORMAT:
 *   { src: "filename.jpg" }                          — minimal (alt text auto-generated from filename)
 *   { src: "filename.jpg", alt: "Custom alt text" }  — with explicit alt text (recommended for accessibility)
 *
 * NOTES:
 * - The `folder` value must match the folder name in public/images/gallery/
 * - Images are displayed in the order listed below (use numeric prefixes in filenames for consistency)
 * - If a category has no images, it will be hidden from the page automatically
 * - Supported formats: .jpg, .jpeg, .png, .webp
 */

const galleryCategories = [
  {
    id: 'rehearsals',
    title: 'Rehearsals',
    folder: 'rehearsals',
    images: [
      // { src: "01-rehearsal-warmup.jpg", alt: "Cast warming up before rehearsal" },
      // { src: "02-rehearsal-blocking.jpg" },
    ],
  },
  {
    id: 'comic-con',
    title: 'MCM London Comic Con',
    folder: 'comic-con',
    images: [
      // { src: "01-comic-con-booth.jpg", alt: "Our booth at MCM London Comic Con" },
    ],
  },
  {
    id: 'unicorn-theatre',
    title: 'Unicorn Theatre',
    folder: 'unicorn-theatre',
    images: [
      // { src: "01-unicorn-stage.jpg", alt: "On stage at the Unicorn Theatre" },
    ],
  },
  {
    id: 'group-photos',
    title: 'Group Photos',
    folder: 'group-photos',
    images: [
      // { src: "01-full-cast.jpg", alt: "Full cast group photo" },
    ],
  },
];

export default galleryCategories;
