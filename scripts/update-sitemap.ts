#!/usr/bin/env tsx

/**
 * Update sitemap.xml with current date
 * Run this before deployment to keep lastmod dates current
 */

import * as fs from 'fs';
import * as path from 'path';

const SITEMAP_PATH = path.join(process.cwd(), 'public', 'sitemap.xml');

const today = new Date().toISOString().split('T')[0];

console.log(`📅 Updating sitemap.xml with date: ${today}`);

try {
  let sitemap = fs.readFileSync(SITEMAP_PATH, 'utf-8');

  // Replace all lastmod dates with today's date
  const updatedSitemap = sitemap.replace(
    /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g,
    `<lastmod>${today}</lastmod>`
  );

  fs.writeFileSync(SITEMAP_PATH, updatedSitemap, 'utf-8');

  console.log('✅ Sitemap updated successfully!');
  console.log(`   Updated all <lastmod> tags to: ${today}`);
} catch (error) {
  console.error('❌ Error updating sitemap:', error);
  process.exit(1);
}
