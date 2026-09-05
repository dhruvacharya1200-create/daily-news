// fetch-news.mjs
// Pulls fresh headlines from Google News RSS (free, no API key needed)
// and writes them into news.json, which index.html reads and displays.
//
// Run manually with:  node fetch-news.mjs
// Runs automatically every day via .github/workflows/update-news.yml

import fs from 'fs';

// Add, remove, or reorder sections here. `topic` values map to
// Google News' own section codes.
const FEEDS = [
  { key: 'india', label: 'India', topic: 'NATION' },
  { key: 'world', label: 'World', topic: 'WORLD' },
  { key: 'business', label: 'Business', topic: 'BUSINESS' },
  { key: 'technology', label: 'Technology', topic: 'TECHNOLOGY' },
  { key: 'sports', label: 'Sports', topic: 'SPORTS' },
];

const LANG = 'en-IN';
const COUNTRY = 'IN';
const CEID = 'IN:en';
const ITEMS_PER_SECTION = 8;

function feedUrl(topic) {
  return `https://news.google.com/rss/headlines/section/topic/${topic}?hl=${LANG}&gl=${COUNTRY}&ceid=${CEID}`;
}

function decodeEntities(str) {
  return str
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
}

function tagContent(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match ? decodeEntities(match[1]) : '';
}

function parseItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    items.push({
      title: tagContent(block, 'title'),
      link: tagContent(block, 'link'),
      pubDate: tagContent(block, 'pubDate'),
      source: tagContent(block, 'source'),
    });
  }
  return items;
}

async function fetchSection(feed) {
  const res = await fetch(feedUrl(feed.topic), {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DailyBulletinBot/1.0)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  return parseItems(xml).slice(0, ITEMS_PER_SECTION);
}

async function main() {
  const sections = [];

  for (const feed of FEEDS) {
    try {
      const items = await fetchSection(feed);
      sections.push({ key: feed.key, label: feed.label, items });
      console.log(`✔ ${feed.label}: ${items.length} stories`);
    } catch (err) {
      console.error(`✘ ${feed.label} failed: ${err.message}`);
      sections.push({ key: feed.key, label: feed.label, items: [] });
    }
  }

  const output = {
    updatedAt: new Date().toISOString(),
    sections,
  };

  fs.writeFileSync('news.json', JSON.stringify(output, null, 2));
  console.log('\nnews.json written.');
}

main();
