"use client";

import { useState } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  order: number;
}

interface Site {
  id: number;
  title: string;
  url: string;
  description: string;
  category: string;
  order: number;
}

export default function ImportPage() {
  const [status, setStatus] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [jsonOutput, setJsonOutput] = useState<string>("");

  const parseWordPressXML = (xmlContent: string) => {
    setStatus("正在解析 XML 文件...");

    try {
      // Extract categories (favorites)
      const categoryRegex =
        /<wp:term>[\s\S]*?<wp:term_taxonomy><!\[CDATA\[favorites\]\]><\/wp:term_taxonomy>[\s\S]*?<\/wp:term>/g;
      const extractedCategories: Category[] = [];

      let catMatch;
      while ((catMatch = categoryRegex.exec(xmlContent)) !== null) {
        const termXml = catMatch[0];

        const idMatch = termXml.match(/<wp:term_id>(\d+)<\/wp:term_id>/);
        const nameMatch = termXml.match(
          /<wp:term_name><!\[CDATA\[(.*?)\]\]><\/wp:term_name>/
        );
        const iconMatch = termXml.match(
          /<wp:meta_key><!\[CDATA\[_term_ico\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]><\/wp:meta_value>/
        );
        const orderMatch = termXml.match(
          /<wp:meta_key><!\[CDATA\[_term_order\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]><\/wp:meta_value>/
        );

        if (nameMatch) {
          extractedCategories.push({
            id: idMatch ? parseInt(idMatch[1]) : extractedCategories.length + 1,
            name: nameMatch[1],
            slug: nameMatch[1]
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]/g, ""),
            icon: iconMatch ? iconMatch[1] : "fa fa-link",
            order: orderMatch ? parseFloat(orderMatch[1]) : 0,
          });
        }
      }

      // Sort categories by order (descending)
      extractedCategories.sort((a, b) => b.order - a.order);
      setCategories(extractedCategories);
      setStatus(`已提取 ${extractedCategories.length} 个分类`);

      // Extract sites
      const extractedSites: Site[] = [];
      let siteId = 1;

      // Split by item tags
      const items = xmlContent.split(/<item>/);

      for (let i = 1; i < items.length; i++) {
        const itemXml = items[i].split(/<\/item>/)[0];

        // Check if it's a sites post type
        if (!itemXml.includes("<wp:post_type><![CDATA[sites]]></wp:post_type>"))
          continue;

        // Check if status is publish
        if (!itemXml.includes("<wp:status><![CDATA[publish]]></wp:status>"))
          continue;

        const titleMatch = itemXml.match(
          /<title><!\[CDATA\[(.*?)\]\]><\/title>/
        );
        const categoryMatch = itemXml.match(
          /<category domain="favorites"[^>]*><!\[CDATA\[(.*?)\]\]><\/category>/
        );
        const linkMatch = itemXml.match(
          /<wp:meta_key><!\[CDATA\[_sites_link\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]><\/wp:meta_value>/
        );
        const descMatch = itemXml.match(
          /<wp:meta_key><!\[CDATA\[_sites_sescribe\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]><\/wp:meta_value>/
        );
        const orderMatch = itemXml.match(
          /<wp:meta_key><!\[CDATA\[_sites_order\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]><\/wp:meta_value>/
        );

        if (titleMatch && linkMatch && linkMatch[1]) {
          extractedSites.push({
            id: siteId++,
            title: titleMatch[1],
            url: linkMatch[1],
            description: descMatch ? descMatch[1] : "",
            category: categoryMatch ? categoryMatch[1] : "未分类",
            order: orderMatch ? parseFloat(orderMatch[1]) : 0,
          });
        }
      }

      // Sort sites by order (descending)
      extractedSites.sort((a, b) => b.order - a.order);
      setSites(extractedSites);

      // Generate JSON output
      const output = {
        categories: extractedCategories,
        sites: extractedSites,
      };

      const jsonStr = JSON.stringify(output, null, 2);
      setJsonOutput(jsonStr);

      setStatus(
        `✅ 解析完成！提取到 ${extractedCategories.length} 个分类，${extractedSites.length} 个导航链接`
      );
    } catch (error) {
      setStatus(`❌ 解析失败: ${error}`);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus("正在读取文件...");

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      parseWordPressXML(content);
    };
    reader.onerror = () => {
      setStatus("❌ 文件读取失败");
    };
    reader.readAsText(file);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput);
    alert("已复制到剪贴板！请将内容保存到 src/data/navigation.json 文件中");
  };

  const downloadJSON = () => {
    const blob = new Blob([jsonOutput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "navigation.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        background: "#f5f5f7",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{ marginBottom: "8px", color: "#1d1d1f", fontSize: "2rem", fontWeight: 600 }}
      >
        WordPress XML 数据导入工具
      </h1>

      <p style={{ marginBottom: "30px", color: "#86868b", lineHeight: 1.6, fontSize: "15px" }}>
        上传你的 WordPress 导出的 XML 文件，自动提取所有导航链接数据。
        <br />
        导出方法：WordPress 后台 → 工具 → 导出 → 选择"所有内容" → 下载
      </p>

      <div
        style={{
          padding: "48px",
          border: "2px dashed #d2d2d7",
          borderRadius: "16px",
          textAlign: "center",
          marginBottom: "30px",
          background: "#ffffff",
        }}
      >
        <input
          type="file"
          accept=".xml"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          id="file-input"
        />
        <label
          htmlFor="file-input"
          style={{
            display: "inline-block",
            padding: "14px 28px",
            background: "#007aff",
            color: "white",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: 500,
          }}
        >
          选择 WordPress XML 文件
        </label>
      </div>

      {status && (
        <div
          style={{
            padding: "16px 20px",
            background: "#ffffff",
            borderRadius: "12px",
            marginBottom: "20px",
            fontSize: "14px",
            color: "#1d1d1f",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          {status}
        </div>
      )}

      {categories.length > 0 && (
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ marginBottom: "16px", color: "#1d1d1f", fontSize: "17px", fontWeight: 600 }}>提取的分类：</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {categories.map((cat) => (
              <span
                key={cat.id}
                style={{
                  padding: "6px 14px",
                  background: "#ffffff",
                  borderRadius: "20px",
                  fontSize: "13px",
                  color: "#1d1d1f",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }}
              >
                <i className={cat.icon} style={{ marginRight: "6px", color: "#007aff" }}></i>
                {cat.name} ({sites.filter((s) => s.category === cat.name).length})
              </span>
            ))}
          </div>
        </div>
      )}

      {jsonOutput && (
        <div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <button
              onClick={copyToClipboard}
              style={{
                padding: "12px 24px",
                background: "#ffffff",
                color: "#007aff",
                border: "1px solid #d2d2d7",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              复制 JSON
            </button>
            <button
              onClick={downloadJSON}
              style={{
                padding: "12px 24px",
                background: "#007aff",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              下载 navigation.json
            </button>
          </div>

          <textarea
            readOnly
            value={jsonOutput}
            style={{
              width: "100%",
              height: "400px",
              padding: "16px",
              background: "#ffffff",
              border: "1px solid #d2d2d7",
              borderRadius: "12px",
              color: "#1d1d1f",
              fontFamily: "SF Mono, Menlo, monospace",
              fontSize: "12px",
              resize: "vertical",
            }}
          />
        </div>
      )}

      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <a
          href="/"
          style={{
            color: "#007aff",
            textDecoration: "none",
            fontSize: "15px",
          }}
        >
          ← 返回首页
        </a>
      </div>
    </div>
  );
}

