import { readFile, writeFile, mkdir } from 'node:fs/promises';
const pages = {
  index: ['Happy Valley Academy | Learn Today. Care Tomorrow.', 'Discover elderly care, first aid and baby care training at Happy Valley Academy. Three-month courses with practical placements.'],
  about: ['Our Academy | Happy Valley Academy', 'Meet Happy Valley Academy. Care training that brings together compassion, theory and practical learning.'],
  courses: ['Courses & Fees | Happy Valley Academy', 'Explore Elderly Care at R2,500, First Aid Level 101 at R1,700, and Baby Care / Nanny at R1,000. All three courses for R4,000.'],
  contact: ['Contact & Enquiries | Happy Valley Academy', 'Contact Happy Valley Academy about courses, practical placements and registration. Call 061 117 3163 or prepare your WhatsApp enquiry.'],
};
const origin = process.env.SITE_ORIGIN?.replace(/\/$/, '');
for (const [page, [title, description]] of Object.entries(pages)) {
  const url = origin ? origin + (page === 'index' ? '/' : '/' + page + '.html') : '';
  await writeFile(page + '.html', `<!doctype html>
<html lang="en-ZA">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#27183d" />
    <meta name="description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_ZA" />
    <meta property="og:site_name" content="Happy Valley Academy" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    ${origin ? `<link rel="canonical" href="${url}" />\n    <meta property="og:url" content="${url}" />\n    <meta property="og:image" content="${origin}/og.png" />\n    <meta name="twitter:image" content="${origin}/og.png" />\n    <meta property="og:image:alt" content="Happy Valley Academy. Learn today. Care tomorrow." />` : ''}
    <link rel="icon" type="image/webp" href="/images/logo.webp" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <noscript>Please enable JavaScript to explore Happy Valley Academy. Call <a href="tel:+27611173163">061 117 3163</a> or email <a href="mailto:happyvalleyacademy@outlook.com">happyvalleyacademy@outlook.com</a> for course enquiries.</noscript>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>\n`);
}
let css = await readFile('src/styles.css', 'utf8');
await writeFile('src/styles.css', css.replace(/\n@import '\.\/pages.css';\s*$/, '\n'));
let main = await readFile('src/main.jsx', 'utf8');
await writeFile('src/main.jsx', main.replace('<div className="photo-counter">01 <span>/ 03</span></div>', '<div className="photo-counter">CARE IN PRACTICE</div>'));
if (origin) {
  await writeFile('public/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + Object.keys(pages).map(p=>`<url><loc>${origin}${p==='index'?'/':'/'+p+'.html'}</loc></url>`).join('') + '</urlset>');
  await writeFile('public/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
}
console.log('Prepared four pages with individual metadata.');
