import {
  Crosshair, Plane, Globe, Ship, Package, ArrowLeftRight,
  Boxes, Building2, Zap, Monitor, ShieldAlert, Newspaper,
  MoreVertical, type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "fa fa-location-arrow": Crosshair,
  "fa fa-plane": Plane,
  "fa fa-globe": Globe,
  "fa fa-ship": Ship,
  "fa fa-amazon": Package,
  "fa fa-arrows-h": ArrowLeftRight,
  "fa fa-cubes": Boxes,
  "fa fa-building": Building2,
  "fa fa-superscript": Zap,
  "fa fa-television": Monitor,
  "fa fa-share": ShieldAlert,
  "fa fa-list-alt": Newspaper,
  "fa fa-ellipsis-v": MoreVertical,
};

export function getIcon(faClass: string): LucideIcon {
  return iconMap[faClass] || Globe;
}

const gradients: Record<string, string> = {
  自研工具: "from-pink-400 to-rose-300",
  国际空运: "from-blue-400 to-blue-300",
  国际快递: "from-emerald-400 to-emerald-300",
  国际海运: "from-sky-400 to-sky-300",
  FBA头程: "from-amber-400 to-amber-300",
  国际专线: "from-violet-400 to-violet-300",
  国际小包: "from-orange-400 to-orange-300",
  海关常用: "from-indigo-400 to-indigo-300",
  效率工具: "from-red-400 to-red-300",
  外贸导航: "from-teal-400 to-teal-300",
  打击老赖: "from-yellow-400 to-yellow-300",
  新闻资讯: "from-cyan-400 to-cyan-300",
  业务推荐: "from-fuchsia-400 to-fuchsia-300",
};

export function getCategoryGradient(name: string): string {
  return gradients[name] || "from-gray-400 to-gray-300";
}

const badges: Record<string, string> = {
  自研工具: "bg-pink-50/80 text-pink-600",
  国际空运: "bg-blue-50/80 text-blue-600",
  国际快递: "bg-emerald-50/80 text-emerald-600",
  国际海运: "bg-sky-50/80 text-sky-600",
  FBA头程: "bg-amber-50/80 text-amber-600",
  国际专线: "bg-violet-50/80 text-violet-600",
  国际小包: "bg-orange-50/80 text-orange-600",
  海关常用: "bg-indigo-50/80 text-indigo-600",
  效率工具: "bg-red-50/80 text-red-600",
  外贸导航: "bg-teal-50/80 text-teal-600",
  打击老赖: "bg-yellow-50/80 text-yellow-600",
  新闻资讯: "bg-cyan-50/80 text-cyan-600",
  业务推荐: "bg-fuchsia-50/80 text-fuchsia-600",
};

export function getCategoryBadge(name: string): string {
  return badges[name] || "bg-gray-50 text-gray-600";
}
