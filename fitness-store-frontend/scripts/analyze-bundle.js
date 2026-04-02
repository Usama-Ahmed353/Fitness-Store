#!/usr/bin/env node

/**
 * Bundle Analyzer for CrunchFit Pro
 * Analyzes bundle size and generates report
 * Run: node scripts/analyze-bundle.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../dist');
const assetsDir = path.join(distDir, 'assets');

/**
 * Get file size in KB
 */
function getFileSizeInKB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(2);
  } catch {
    return 0;
  }
}

/**
 * Get file size with color formatting
 */
function colorizeSize(sizeKB) {
  const size = parseFloat(sizeKB);
  if (size > 100) return `\x1b[31m${sizeKB}KB\x1b[0m`; // Red
  if (size > 50) return `\x1b[33m${sizeKB}KB\x1b[0m`; // Yellow
  return `\x1b[32m${sizeKB}KB\x1b[0m`; // Green
}

/**
 * Analyze bundle
 */
function analyzeBundle() {
  if (!fs.existsSync(distDir)) {
    console.error('❌ Dist directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  console.log('\n📦 Bundle Analysis Report\n');
  console.log('═'.repeat(70));

  const files = fs.readdirSync(assetsDir)
    .filter(file => file.endsWith('.js') || file.endsWith('.css'))
    .map(file => ({
      name: file,
      size: parseFloat(getFileSizeInKB(path.join(assetsDir, file))),
      path: path.join(assetsDir, file),
    }))
    .sort((a, b) => b.size - a.size);

  let totalSize = 0;
  const jsFiles = [];
  const cssFiles = [];

  files.forEach(file => {
    totalSize += file.size;

    if (file.name.endsWith('.js')) {
      jsFiles.push(file);
    } else {
      cssFiles.push(file);
    }
  });

  // JavaScript Files
  console.log('\n📄 JavaScript Files:');
  console.log('─'.repeat(70));
  console.log('File Name'.padEnd(40) + 'Size'.padEnd(15) + 'Type');
  console.log('─'.repeat(70));

  jsFiles.forEach(file => {
    const name = file.name.length > 37 ? file.name.substring(0, 34) + '...' : file.name;
    const size = colorizeSize(file.size.toFixed(2));
    const type = file.size > 50 ? 'Large' : file.size > 10 ? 'Medium' : 'Small';
    console.log(name.padEnd(40) + size.padEnd(20) + type);
  });

  // CSS Files
  console.log('\n🎨 CSS Files:');
  console.log('─'.repeat(70));

  if (cssFiles.length > 0) {
    cssFiles.forEach(file => {
      const name = file.name.length > 37 ? file.name.substring(0, 34) + '...' : file.name;
      const size = colorizeSize(file.size.toFixed(2));
      console.log(name.padEnd(40) + size);
    });
  } else {
    console.log('(CSS bundled with JS)');
  }

  // Summary
  console.log('\n' + '═'.repeat(70));
  console.log('\n📊 Summary:');
  console.log(`  • Total JS Size: ${colorizeSize(jsFiles.reduce((a, b) => a + b.size, 0).toFixed(2))}`);
  console.log(`  • Total CSS Size: ${colorizeSize(cssFiles.reduce((a, b) => a + b.size, 0).toFixed(2))}`);
  console.log(`  • Total Assets Size: ${colorizeSize(totalSize.toFixed(2))}`);
  console.log(`  • Number of Files: ${files.length}`);
  console.log(`  • Large Files (>50KB): ${files.filter(f => f.size > 50).length}`);
  console.log(`  • Medium Files (>10KB): ${files.filter(f => f.size > 10 && f.size <= 50).length}`);
  console.log(`  • Small Files: ${files.filter(f => f.size <= 10).length}`);

  // Recommendations
  console.log('\n💡 Recommendations:');
  const largeFiles = files.filter(f => f.size > 100);

  if (largeFiles.length > 0) {
    console.log(`  ⚠️  ${largeFiles.length} file(s) > 100KB detected:`);
    largeFiles.forEach(file => {
      console.log(`     - ${file.name} (${file.size.toFixed(2)}KB)`);
    });
    console.log('     Consider code-splitting or compression.');
  } else {
    console.log('  ✅ No excessively large files detected.');
  }

  console.log('\n' + '═'.repeat(70) + '\n');
}

analyzeBundle();
