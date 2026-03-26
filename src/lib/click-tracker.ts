const STORAGE_KEY = "huodai_link_clicks";

interface ClickRecord {
  id: number;
  title: string;
  url: string;
  clicks: number;
  lastClick: number;
}

export function getClickData(): Record<string, ClickRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function trackClick(id: number, title: string, url: string) {
  const data = getClickData();
  const key = String(id);
  if (data[key]) {
    data[key].clicks += 1;
    data[key].lastClick = Date.now();
  } else {
    data[key] = { id, title, url, clicks: 1, lastClick: Date.now() };
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* quota exceeded */ }
}

export function getTopLinks(limit = 10): ClickRecord[] {
  const data = getClickData();
  return Object.values(data)
    .sort((a, b) => b.clicks !== a.clicks ? b.clicks - a.clicks : b.lastClick - a.lastClick)
    .slice(0, limit);
}
