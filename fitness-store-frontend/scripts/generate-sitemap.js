#!/usr/bin/env node

/**
 * Sitemap Generator for CrunchFit Pro
 * Generates XML sitemaps for search engines
 * Run: node scripts/generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = process.env.SITE_URL || 'https://www.crunchfit.com';
const PUBLIC_DIR = path.join(__dirname, '../public');

// Public pages (static)
const publicPages = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/locations', priority: 0.9, changefreq: 'weekly' },
  { url: '/classes', priority: 0.9, changefreq: 'daily' },
  { url: '/training', priority: 0.8, changefreq: 'weekly' },
  { url: '/crunch-plus', priority: 0.8, changefreq: 'monthly' },
  { url: '/membership', priority: 0.9, changefreq: 'monthly' },
  { url: '/about', priority: 0.7, changefreq: 'monthly' },
  { url: '/free-trial', priority: 0.8, changefreq: 'weekly' },
  { url: '/contact', priority: 0.7, changefreq: 'monthly' },
];

// Mock gym data - in production, fetch from API
const mockGyms = [
  { id: 'gym-1', name: 'Times Square' },
  { id: 'gym-2', name: 'East Village' },
  { id: 'gym-3', name: 'Midtown' },
];

// Mock class data - in production, fetch from API
const mockClasses = [
  { id: 'class-1', name: 'HIIT Zone' },
  { id: 'class-2', name: 'Spin Class' },
  { id: 'class-3', name: 'Yoga Flow' },
];

const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
`;

const xmlFooter = `</urlset>
`;

/**
 * Generate URL entry in sitemap
 */
function generateUrlEntry(url, priority = 0.5, changefreq = 'weekly', lastmod = new Date().toISOString().split('T')[0]) {
  return `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
}

/**
 * Generate main sitemap
 */
function generateMainSitemap() {
  let xml = xmlHeader;

  publicPages.forEach((page) => {
    xml += generateUrlEntry(page.url, page.priority, page.changefreq);
  });

  xml += xmlFooter;
  return xml;
}

/**
 * Generate gyms sitemap
 */
function generateGymsSitemap() {
  let xml = xmlHeader;

  mockGyms.forEach((gym) => {
    xml += generateUrlEntry(`/locations/${gym.id}`, 0.7, 'weekly');
  });

  xml += xmlFooter;
  return xml;
}

/**
 * Generate classes sitemap
 */
function generateClassesSitemap() {
  let xml = xmlHeader;

  mockClasses.forEach((cls) => {
    xml += generateUrlEntry(`/classes/${cls.id}`, 0.6, 'daily');
  });

  xml += xmlFooter;
  return xml;
}

/**
 * Generate sitemap index
 */
function generateSitemapIndex() {
  const today = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-gyms.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-classes.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`;
}

/**
 * Write sitemap file
 */
function writeSitemap(filename, content) {
  const filepath = path.join(PUBLIC_DIR, filename);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  fs.writeFileSync(filepath, content);
  console.log(`✓ Generated ${filename}`);
}

/**
 * Main execution
 */
function main() {
  try {
    console.log(`🔄 Generating sitemaps for ${SITE_URL}...\n`);

    // Generate all sitemaps
    writeSitemap('sitemap.xml', generateMainSitemap());
    writeSitemap('sitemap-gyms.xml', generateGymsSitemap());
    writeSitemap('sitemap-classes.xml', generateClassesSitemap());
    writeSitemap('sitemap-index.xml', generateSitemapIndex());

    console.log('\n✅ Sitemap generation complete!');
    console.log(`📍 Files generated in: ${PUBLIC_DIR}`);
  } catch (error) {
    console.error('❌ Error generating sitemaps:', error);
    process.exit(1);
  }
}

main();
