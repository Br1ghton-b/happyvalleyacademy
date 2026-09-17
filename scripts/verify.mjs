import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { existsSync } from 'node:fs';
const routes = ['/', '/about.html', '/courses.html', '/contact.html'];
for (const path of routes) {
  globalThis.window = {location:{pathname:path,search:path==='/contact.html'?'?course=Elderly%20Care':''}};
  const server = await createServer({server:{middlewareMode:true},appType:'custom'});
  try {
    const { App } = await server.ssrLoadModule('/src/main.jsx');
    const html = renderToStaticMarkup(React.createElement(App));
    assert.equal((html.match(/<h1[ >]/g)||[]).length, 1, path+' must have one primary heading');
    assert.ok(html.includes('aria-current="page"'), path+' must mark active navigation');
    assert.ok(html.includes('Open WhatsApp enquiry'), path+' must contain WhatsApp widget');
    for(const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)[^"]*"/g)){
      const ref=match[1];
      if(ref==='/')continue;
      assert.ok(existsSync(ref.endsWith('.html')?ref.slice(1):'public'+ref),'Missing local asset or page: '+ref);
    }
    if(path==='/courses.html')for(const id of ['elderly-care','first-aid','baby-care','package'])assert.ok(html.includes(`id="${id}"`));
    if(path==='/contact.html'){assert.ok(html.includes('selected="">Elderly Care'));assert.ok(html.includes('WhatsApp Inquiry'));assert.ok(html.includes('Email Inquiry'));}
    console.log('PASS '+path+' — renders, navigation, images, links and page controls verified.');
  } finally {await server.close();}
}
delete globalThis.window;
