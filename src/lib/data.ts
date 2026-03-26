import navigationData from "@/data/navigation.json";
import type { NavigationData, Category, Site } from "./types";

const data = navigationData as NavigationData;

export function getCategories(): Category[] {
  return [...data.categories].sort((a, b) => b.order - a.order);
}

export function getSites(): Site[] {
  return [...data.sites].sort((a, b) => b.order - a.order);
}

export function getSitesByCategory(): Record<string, Site[]> {
  const sites = getSites();
  const grouped: Record<string, Site[]> = {};
  for (const site of sites) {
    if (!grouped[site.category]) grouped[site.category] = [];
    grouped[site.category].push(site);
  }
  return grouped;
}

export const totalSites = data.sites.length;
export const totalCategories = data.categories.length;
