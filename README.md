# Happy Valley Academy

A responsive four-page website built with React, Vite, HTML, CSS and JavaScript.

## Start the live preview

```sh
cd website
npm install
npm run dev
```

Open the local URL printed by Vite (normally http://localhost:5173).

## Pages

- `/` — Home, course previews and introduction
- `/about.html` — Academy story, values and photography
- `/courses.html` — All three courses, pricing, bundle, flyer and FAQs
- `/contact.html` — Contact details and a WhatsApp enquiry builder

## Build and verify

```sh
npm run build
npm run preview
node scripts/verify.mjs
```

Static production files are generated in `dist/client`. A minimal adapter in
`dist/server` supports Sites hosting. The website does not require a database.

## Enquiries

The floating WhatsApp widget and contact form use 061 117 3163. The form prepares
a message; the visitor reviews and sends it in WhatsApp. No enquiry is silently
submitted or stored. All three supplied phone numbers and the flyer email address
are included. Venue, timetable and registration arrangements must be confirmed
with the academy; no address, accreditation or employment guarantee is invented.

## Content and assets

`src/content.js` contains course details, FAQs and contact destinations.
`src/styles.css` and `src/pages.css` contain the responsive styles.
Original supplied images remain in the parent folder. Optimised WebP copies are
in `public/images`; run `node scripts/optimize-images.mjs` to regenerate them.
The flyer `unnamed.webp` is linked for download on the Courses page.

The bespoke link-preview image is `public/og.png`, generated using the built-in
Imagegen tool. Brief: an ivory, purple and forest-green editorial card, the exact
academy name and “Learn today. Care tomorrow.” headline, the three care subjects,
and a warm photograph of a caregiver and an older woman.

Each HTML page has its own title and description. The `scripts/prepare.mjs` helper
can refresh metadata; set `SITE_ORIGIN` to the deployment origin to include
absolute social image URLs, canonical links and a sitemap.

Build validation and React rendering checks cover all four pages, local assets,
page navigation, course anchors and enquiry preselection. Browser visual and
interaction testing has not been performed.
