export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  order: number;
}

export interface Site {
  id: number;
  title: string;
  url: string;
  description: string;
  category: string;
  order: number;
  /** WordPress 自定义缩略图 URL，优先用于卡片图标 */
  thumbnail?: string;
}

export interface NavigationData {
  categories: Category[];
  sites: Site[];
}
