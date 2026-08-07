/**
 * Emits a static HTML file per case-study route with route-specific meta tags.
 *
 * Why this exists: the site is a client-rendered SPA, so every route ships the
 * same index.html. Slack, LinkedIn, iMessage, and search crawlers do not run
 * JavaScript, which means a forwarded link to /case-study/zendeb previews as the
 * landing page ("I build and fix websites for small businesses"). Since these
 * pages are meant to be shared by other people, that preview is the first thing
 * most readers ever see of them.
 *
 * Writing dist/case-study/<slug>/index.html means Vercel serves real HTML with
 * correct tags for that path, and the SPA takes over on hydration as usual.
 *
 * Metadata is parsed out of the single source of truth (src/content/caseStudies.ts)
 * rather than duplicated here, so the two cannot drift. If parsing fails the build
 * fails loudly; shipping silently-wrong preview cards is the failure worth avoiding.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://jakemosher.dev';

const source = readFileSync(join(root, 'src/content/caseStudies.ts'), 'utf8');

function field(name) {
  const m = source.match(new RegExp(`\\n\\s{2}${name}:\\s*\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  return m ? m[1].replace(/\\"/g, '"') : null;
}

const slug = field('slug');
const title = field('title');
const summary = field('summary');

if (!slug || !title || !summary) {
  console.error('[emit-route-meta] could not parse slug/title/summary from caseStudies.ts');
  console.error(`  slug=${slug} title=${title ? 'ok' : 'MISSING'} summary=${summary ? 'ok' : 'MISSING'}`);
  process.exit(1);
}

const routes = [
  {
    path: `case-study/${slug}`,
    title: `${title} · Jake Mosher`,
    description: summary,
    image: `${SITE}/og-case-study-${slug}.png`,
  },
];

const html = readFileSync(join(root, 'dist/index.html'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

for (const route of routes) {
  const url = `${SITE}/${route.path}`;
  let out = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(route.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(route.description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(route.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(route.description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${route.image}$2`)
    .replace(/(<meta property="og:type" content=")[^"]*(")/, `$1article$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(route.title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(route.description)}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${route.image}$2`);

  if (/<link rel="canonical"/.test(out)) {
    out = out.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  }

  const dir = join(root, 'dist', route.path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), out);
  console.log(`[emit-route-meta] wrote dist/${route.path}/index.html`);
}
