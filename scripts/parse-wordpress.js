/**
 * WordPress XML 解析脚本
 * 从 WordPress 导出的 XML 文件中提取导航链接和分类数据
 */

const fs = require('fs');
const path = require('path');

// 读取 XML 文件
const xmlPath = path.join(__dirname, '../../WordPress.2026-03-26.xml');
const xmlContent = fs.readFileSync(xmlPath, 'utf-8');

// 提取 CDATA 内容的辅助函数
function extractCDATA(str) {
  if (!str) return '';
  const match = str.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return match ? match[1].trim() : str.trim();
}

// 解码 URL 编码的字符串
function decodeSlug(slug) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

// 提取所有分类（favorites）
function extractCategories() {
  const categories = [];
  const termRegex = /<wp:term>[\s\S]*?<wp:term_taxonomy><!\[CDATA\[favorites\]\]><\/wp:term_taxonomy>[\s\S]*?<\/wp:term>/g;
  
  let match;
  while ((match = termRegex.exec(xmlContent)) !== null) {
    const termXml = match[0];
    
    const idMatch = termXml.match(/<wp:term_id>(\d+)<\/wp:term_id>/);
    const nameMatch = termXml.match(/<wp:term_name><!\[CDATA\[(.*?)\]\]><\/wp:term_name>/);
    const slugMatch = termXml.match(/<wp:term_slug><!\[CDATA\[(.*?)\]\]><\/wp:term_slug>/);
    const iconMatch = termXml.match(/<wp:meta_key><!\[CDATA\[_term_ico\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]><\/wp:meta_value>/);
    const orderMatch = termXml.match(/<wp:meta_key><!\[CDATA\[_term_order\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]><\/wp:meta_value>/);
    
    if (nameMatch) {
      categories.push({
        id: idMatch ? parseInt(idMatch[1]) : 0,
        name: nameMatch[1],
        slug: slugMatch ? decodeSlug(slugMatch[1]) : '',
        icon: iconMatch ? iconMatch[1] : 'fa fa-link',
        order: orderMatch ? parseFloat(orderMatch[1]) : 0
      });
    }
  }
  
  // 按 order 降序排列
  categories.sort((a, b) => b.order - a.order);
  return categories;
}

// 提取所有导航链接（sites）
function extractSites() {
  const sites = [];
  
  // 先提取所有独立的 <item>...</item> 块，避免跨 item 边界匹配
  const allItemRegex = /<item>[\s\S]*?<\/item>/g;
  
  let match;
  while ((match = allItemRegex.exec(xmlContent)) !== null) {
    const itemXml = match[0];
    
    // 仅处理 post_type 为 sites 的 item
    const postTypeMatch = itemXml.match(/<wp:post_type><!\[CDATA\[(.*?)\]\]><\/wp:post_type>/);
    if (!postTypeMatch || postTypeMatch[1] !== 'sites') continue;
    
    // 检查状态是否为 publish
    const statusMatch = itemXml.match(/<wp:status><!\[CDATA\[(.*?)\]\]><\/wp:status>/);
    if (statusMatch && statusMatch[1] !== 'publish') continue;
    
    const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
    const categoryMatch = itemXml.match(/<category domain="favorites"[^>]*><!\[CDATA\[(.*?)\]\]><\/category>/);
    const linkMatch = itemXml.match(/<wp:meta_key><!\[CDATA\[_sites_link\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]><\/wp:meta_value>/);
    const descMatch = itemXml.match(/<wp:meta_key><!\[CDATA\[_sites_sescribe\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]><\/wp:meta_value>/);
    const orderMatch = itemXml.match(/<wp:meta_key><!\[CDATA\[_sites_order\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]><\/wp:meta_value>/);
    const thumbnailMatch = itemXml.match(/<wp:meta_key><!\[CDATA\[_thumbnail\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]><\/wp:meta_value>/);
    const postIdMatch = itemXml.match(/<wp:post_id>(\d+)<\/wp:post_id>/);
    
    if (titleMatch && linkMatch && linkMatch[1]) {
      sites.push({
        id: postIdMatch ? parseInt(postIdMatch[1]) : 0,
        title: titleMatch[1],
        url: linkMatch[1],
        description: descMatch ? descMatch[1] : '',
        category: categoryMatch ? categoryMatch[1] : '未分类',
        order: orderMatch ? parseFloat(orderMatch[1]) : 0,
        thumbnail: thumbnailMatch ? thumbnailMatch[1] : ''
      });
    }
  }
  
  // 按 order 降序排列
  sites.sort((a, b) => b.order - a.order);
  return sites;
}

// 主函数
function main() {
  console.log('开始解析 WordPress XML 文件...\n');
  
  const categories = extractCategories();
  const sites = extractSites();
  
  console.log(`✅ 提取到 ${categories.length} 个分类`);
  console.log(`✅ 提取到 ${sites.length} 个导航链接\n`);
  
  // 按分类组织数据
  const data = {
    categories: categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      order: cat.order
    })),
    sites: sites
  };
  
  // 输出目录
  const outputDir = path.join(__dirname, '../src/data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 写入 JSON 文件
  const outputPath = path.join(outputDir, 'navigation.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
  
  console.log(`✅ 数据已保存到: ${outputPath}\n`);
  
  // 打印分类统计
  console.log('分类统计:');
  console.log('─'.repeat(40));
  categories.forEach(cat => {
    const count = sites.filter(s => s.category === cat.name).length;
    console.log(`${cat.name}: ${count} 个链接`);
  });
  
  // 统计未分类
  const uncategorized = sites.filter(s => !categories.find(c => c.name === s.category));
  if (uncategorized.length > 0) {
    console.log(`未分类: ${uncategorized.length} 个链接`);
  }
}

main();

