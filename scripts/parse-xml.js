const fs = require('fs');
const path = require('path');

// Read the XML file
const xmlPath = path.join(__dirname, '../../cursor-projects/货代导航网分析/WordPress.2025-12-29.xml');
const xmlContent = fs.readFileSync(xmlPath, 'utf-8');

// Parse categories (favorites taxonomy)
const categories = [];
const categoryRegex = /<wp:term>\s*<wp:term_id>(\d+)<\/wp:term_id>\s*<wp:term_taxonomy><!\[CDATA\[favorites\]\]><\/wp:term_taxonomy>\s*<wp:term_slug><!\[CDATA\[([^\]]*)\]\]><\/wp:term_slug>\s*<wp:term_parent><!\[CDATA\[([^\]]*)\]\]><\/wp:term_parent>\s*<wp:term_name><!\[CDATA\[([^\]]*)\]\]><\/wp:term_name>([\s\S]*?)<\/wp:term>/g;

let match;
while ((match = categoryRegex.exec(xmlContent)) !== null) {
  const id = parseInt(match[1]);
  const slug = match[2];
  const name = match[4];
  const metaContent = match[5];
  
  // Extract icon
  const iconMatch = metaContent.match(/<wp:meta_key><!\[CDATA\[_term_ico\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[([^\]]*)\]\]><\/wp:meta_value>/);
  const icon = iconMatch ? iconMatch[1] : 'fa fa-link';
  
  // Extract order
  const orderMatch = metaContent.match(/<wp:meta_key><!\[CDATA\[_term_order\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[([^\]]*)\]\]><\/wp:meta_value>/);
  const order = orderMatch ? parseFloat(orderMatch[1]) : 0;
  
  categories.push({ id, name, slug, icon, order });
}

console.log(`Found ${categories.length} categories`);

// Parse sites
const sites = [];
let siteId = 1;

// Split by item tags and process each
const items = xmlContent.split(/<item>/);

for (let i = 1; i < items.length; i++) {
  const item = items[i];
  const endIndex = item.indexOf('</item>');
  if (endIndex === -1) continue;
  
  const itemContent = item.substring(0, endIndex);
  
  // Check if it's a site
  if (!itemContent.includes('<wp:post_type><![CDATA[sites]]></wp:post_type>')) continue;
  
  // Check if published
  if (!itemContent.includes('<wp:status><![CDATA[publish]]></wp:status>')) continue;
  
  // Extract title
  const titleMatch = itemContent.match(/<title><!\[CDATA\[([^\]]*)\]\]><\/title>/);
  const title = titleMatch ? titleMatch[1] : '';
  
  // Extract category
  const categoryMatch = itemContent.match(/<category domain="favorites"[^>]*><!\[CDATA\[([^\]]*)\]\]><\/category>/);
  const category = categoryMatch ? categoryMatch[1] : '';
  
  // Extract URL (_sites_link)
  const urlMatch = itemContent.match(/<wp:meta_key><!\[CDATA\[_sites_link\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[([^\]]*)\]\]><\/wp:meta_value>/);
  const url = urlMatch ? urlMatch[1] : '';
  
  // Extract description (_sites_sescribe)
  const descMatch = itemContent.match(/<wp:meta_key><!\[CDATA\[_sites_sescribe\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[([^\]]*)\]\]><\/wp:meta_value>/);
  const description = descMatch ? descMatch[1] : '';
  
  // Extract order (_sites_order)
  const orderMatch = itemContent.match(/<wp:meta_key><!\[CDATA\[_sites_order\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[([^\]]*)\]\]><\/wp:meta_value>/);
  const order = orderMatch ? parseFloat(orderMatch[1]) : 0;
  
  if (title && url && category) {
    sites.push({
      id: siteId++,
      title,
      url,
      description: description || title,
      category,
      order
    });
  }
}

console.log(`Found ${sites.length} sites`);

// Create navigation data
const navigationData = {
  categories: categories.sort((a, b) => b.order - a.order),
  sites: sites.sort((a, b) => b.order - a.order)
};

// Write to file
const outputPath = path.join(__dirname, '../src/data/navigation.json');
fs.writeFileSync(outputPath, JSON.stringify(navigationData, null, 2), 'utf-8');

console.log(`\nData written to ${outputPath}`);
console.log(`Categories: ${categories.length}`);
console.log(`Sites: ${sites.length}`);

