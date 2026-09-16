import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { sites } from '@openai/sites-vite-plugin';
import { mkdir, copyFile } from 'node:fs/promises';
const staticWorker = { name: 'static-site-worker', apply: 'build', async closeBundle() {
  await mkdir('dist/server', { recursive: true });
  await copyFile('scripts/static-worker.js', 'dist/server/index.js');
} };
export default defineConfig({ plugins: [react(), sites(), staticWorker], build: { outDir: 'dist/client', rolldownOptions: { input: {
  home: resolve(import.meta.dirname, 'index.html'), about: resolve(import.meta.dirname, 'about.html'),
  courses: resolve(import.meta.dirname, 'courses.html'), contact: resolve(import.meta.dirname, 'contact.html'),
} } } });
