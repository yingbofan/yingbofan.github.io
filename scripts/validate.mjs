import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const failures = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function resolveInternal(url) {
  const clean = url.split('#')[0].split('?')[0];
  if (!clean) return null;
  if (clean.startsWith('/')) {
    if (path.extname(clean)) return path.join(dist, clean);
    return path.join(dist, clean, 'index.html');
  }
  return null;
}

const htmlFiles = walk(dist).filter((file) => file.endsWith('.html'));
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(dist, file);
  if (!html.startsWith('<!doctype html>')) failures.push(`${relative}: missing HTML5 doctype`);
  for (const required of ['<html lang="en">', '<main id="main">', '<title>']) {
    if (!html.includes(required)) failures.push(`${relative}: missing ${required}`);
  }
  if ((html.match(/<h1[ >]/g) || []).length !== 1) failures.push(`${relative}: expected exactly one h1`);
  if (html.includes('href="#"')) failures.push(`${relative}: contains placeholder href`);

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) failures.push(`${relative}: duplicate ids ${[...new Set(duplicateIds)].join(', ')}`);

  for (const match of html.matchAll(/<(?:a|link)[^>]+href="([^"]+)"/g)) {
    const url = match[1];
    if (/^(?:https?:|mailto:|#)/.test(url)) continue;
    const resolved = resolveInternal(url);
    if (resolved && !fs.existsSync(resolved)) failures.push(`${relative}: missing href target ${url}`);
  }

  for (const match of html.matchAll(/<(?:img|script)[^>]+src="([^"]+)"/g)) {
    const url = match[1];
    if (/^https?:/.test(url)) continue;
    const resolved = path.join(dist, url.replace(/^\//, ''));
    if (!fs.existsSync(resolved)) failures.push(`${relative}: missing src target ${url}`);
  }

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]*"/.test(match[0])) failures.push(`${relative}: image missing alt`);
  }
}

const css = fs.readFileSync(path.join(dist, 'assets/site.css'), 'utf8');
const openBraces = (css.match(/{/g) || []).length;
const closeBraces = (css.match(/}/g) || []).length;
if (openBraces !== closeBraces) failures.push(`site.css: unbalanced braces ${openBraces}/${closeBraces}`);

for (const svgFile of walk(path.join(dist, 'assets')).filter((file) => file.endsWith('.svg'))) {
  const svg = fs.readFileSync(svgFile, 'utf8');
  if (!svg.startsWith('<svg') || !svg.trim().endsWith('</svg>')) failures.push(`${path.basename(svgFile)}: malformed SVG wrapper`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML pages, ${walk(path.join(dist, 'assets')).length} assets, internal paths, headings, image alternatives, and CSS structure.`);
