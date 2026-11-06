# Leo Vernor — portfolio

A photography site built with [Astro](https://astro.build).

## Preview on your computer

```bash
npm install      # first time only
npm run dev      # then open http://localhost:4321
```

Press Ctrl+C in the terminal to stop the preview.

## Pages

- `/` — home: the photo in `src/assets/home/websitebackground.jpg` fills the screen.
  To change it, replace that file with another photo of the same name.
- `/photography/` — every photo in `src/photos.json`.

The menu is in `src/components/SiteHeader.astro`.

## Add or change photos

1. Put the photo in `Photos/`, named with its date and caption:
   `2025-06 Lake Michigan at dusk.jpg` (a year alone, like `2025 ...`, works too).
2. Run `npm run photos`. This makes a web-sized copy in `src/assets/photos/`
   (with location data removed) and adds the photo to `src/photos.json`.
3. Optional: edit `src/photos.json` to
   - **reorder** photos (the list is the order on the page, top to bottom),
   - **fix a caption** (`caption`) or **date** (`date`, as `YYYY-MM` or `YYYY`),
   - **describe the photo** for screen readers (`alt`).

Photos from the same month that sit next to each other in the list are shown side by side.

To remove a photo, delete it from `Photos/` and run `npm run photos` again.

## Publish

Commit and push to the `main` branch on GitHub (GitHub Desktop: write a summary,
**Commit to main**, then **Push origin**). The site rebuilds and goes live in a minute or two.

The original photos in `Photos/` and anything else in this folder that isn't part of
the website stay on your computer; see `.gitignore`.
