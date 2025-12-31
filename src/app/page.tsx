"use client";

import { useState, useMemo, useEffect } from "react";
import navigationData from "@/data/navigation.json";

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

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Sort categories by order (descending)
  const categories: Category[] = useMemo(() => {
    return [...navigationData.categories].sort((a, b) => b.order - a.order);
  }, []);

  // Sort and filter sites
  const filteredSites = useMemo(() => {
    let sites = [...navigationData.sites] as Site[];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      sites = sites.filter(
        (site) =>
          site.title.toLowerCase().includes(query) ||
          site.description.toLowerCase().includes(query) ||
          site.category.toLowerCase().includes(query)
      );
    }

    return sites.sort((a, b) => b.order - a.order);
  }, [searchQuery]);

  // Group sites by category
  const sitesByCategory = useMemo(() => {
    const grouped: Record<string, Site[]> = {};
    
    categories.forEach((cat) => {
      grouped[cat.name] = filteredSites.filter(
        (site) => site.category === cat.name
      );
    });

    return grouped;
  }, [categories, filteredSites]);

  // Scroll to category
  const scrollToCategory = (categoryName: string) => {
    setActiveCategory(categoryName);
    const element = document.getElementById(`category-${categoryName}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Get first letter for fallback icon
  const getIconLetter = (title: string) => {
    return title.charAt(0).toUpperCase();
  };

  // Get high-quality logo URL from website (Clearbit first, then favicon fallback)
  const getLogoUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      // Clearbit provides high-quality company logos
      return `https://logo.clearbit.com/${domain}`;
    } catch {
      return null;
    }
  };

  // Fallback favicon URL
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

  // Handle link click
  const handleSiteClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Track scroll position for active category
  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map((cat) => ({
        name: cat.name,
        element: document.getElementById(`category-${cat.name}`),
      }));

      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveCategory(section.name);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <a href="/" className="sidebar-logo">
            货代导航网
          </a>
        </div>
        <nav className="sidebar-nav">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`nav-item ${
                activeCategory === category.name ? "active" : ""
              }`}
              onClick={() => scrollToCategory(category.name)}
            >
              <i className={category.icon}></i>
              <span>{category.name}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="search-box">
              <i className="fa fa-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="搜索网站、工具、服务..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="header-stats">
              <span className="stat-item">
                <i className="fa fa-folder-o"></i>
                {categories.length} 分类
              </span>
              <span className="stat-item">
                <i className="fa fa-link"></i>
                {navigationData.sites.length} 网站
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="content">
          {searchQuery && filteredSites.length === 0 ? (
            <div className="no-results">
              <i className="fa fa-search"></i>
              <p>没有找到匹配的结果</p>
              <p>请尝试其他关键词</p>
            </div>
          ) : (
            categories.map((category) => {
              const sites = sitesByCategory[category.name];
              if (!sites || sites.length === 0) return null;

              return (
                <section
                  key={category.id}
                  id={`category-${category.name}`}
                  className="category-section"
                >
                  <h2 className="category-title">
                    <i className={category.icon}></i>
                    {category.name}
                  </h2>
                  <div className="sites-grid">
                    {sites.map((site) => {
                      const logoUrl = getLogoUrl(site.url);
                      const faviconUrl = getFaviconUrl(site.url);
                      return (
                        <div
                          key={site.id}
                          className="site-card"
                          data-category={site.category}
                          onClick={() => handleSiteClick(site.url)}
                        >
                          <div className="site-icon">
                            {/* Try Clearbit logo first */}
                            <img
                              src={logoUrl || ''}
                              alt=""
                              className="site-logo"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                // If Clearbit fails, try favicon
                                if (faviconUrl && target.src !== faviconUrl) {
                                  target.src = faviconUrl;
                                } else {
                                  // If favicon also fails, hide image and show letter
                                  target.style.display = 'none';
                                  const letterEl = target.nextSibling as HTMLElement;
                                  if (letterEl) {
                                    letterEl.style.display = 'flex';
                                  }
                                }
                              }}
                            />
                            <span className="site-icon-letter">
                              {getIconLetter(site.title)}
                            </span>
                          </div>
                          <div className="site-info">
                            <div className="site-title">{site.title}</div>
                            <div className="site-desc">{site.description}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })
          )}
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>
            Copyright © 2025 货代导航网 |{" "}
            <a href="https://huodaiagent.com">huodaiagent.com</a>
          </p>
        </footer>
      </main>
    </div>
  );
}

