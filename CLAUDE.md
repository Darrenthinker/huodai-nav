# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Rules

1. **不要修改现有 UI 界面**。界面已定型，只完善数据和功能逻辑。
2. 端口固定为 **3018**，不要更改。
3. 这是**静态导出**项目（`output: 'export'`），不能使用需要服务器端运行时的 Next.js 功能（无 API Routes、无 SSR、无 `getServerSideProps`）。
4. 核心数据文件是 `src/data/navigation.json`，改动需谨慎。

## Commands

```bash
npm run dev          # 开发服务器（自动 kill 3018 端口后启动）
npm run dev:clean    # 清除 .next 缓存后启动开发服务器
npm run build        # 构建 → 注入搜狗 meta → 生成 sitemap（输出到 out/）
npm run rebuild      # 清除 .next 缓存后重新构建
npm run preview      # 本地预览 out/ 目录（静态文件，端口 3018）
npm run lint         # ESLint 检查
```

Logo 相关脚本（按需运行）：

```bash
npm run fetch-logos           # 抓取全部站点 logo
npm run fetch-logos:new       # 仅抓取 id >= 2837 的新站点 logo
```

## Architecture

### 数据流

```
WordPress 后台导出 XML
  → /import 页面（浏览器端解析）
  → 下载/复制 navigation.json
  → 替换 src/data/navigation.json
  → npm run build → out/（静态 HTML）
  → 部署到 Cloudflare Pages
```

### 核心模块

| 文件 | 职责 |
|------|------|
| `src/data/navigation.json` | 唯一数据源，包含 `categories[]` 和 `sites[]` |
| `src/lib/types.ts` | `Category`、`Site`、`NavigationData` 接口定义 |
| `src/lib/data.ts` | 数据访问层，读取 JSON 并按 `order` 字段降序排列 |
| `src/lib/icons.ts` | WordPress FA class → Lucide React 图标映射；分类渐变色和 badge 色配置（按分类名硬编码） |
| `src/lib/click-tracker.ts` | localStorage 点击计数，供"常用链接"功能排序（key: `huodai_link_clicks`） |
| `src/lib/ad-config.ts` | 广告定价、功能文案、联系人信息 |

### 页面路由

- `/`（`src/app/page.tsx`）：主导航页，客户端组件，实现搜索过滤、侧边栏滚动联动（scroll-spy）、侧边栏折叠
- `/import`（`src/app/import/page.tsx`）：WordPress XML 导入工具，纯浏览器端解析，不依赖后端

### 主页逻辑要点

- 侧边栏 active 项通过监听 `window.scroll` + `getBoundingClientRect()` 实现联动，滚动后有 800ms 锁定防止抖动
- 搜索（`query` state）在客户端用 `useMemo` 过滤，覆盖 title / description / category 字段
- 每个分类区块的 DOM id 格式为 `cat-{category.id}`，供 `scrollIntoView` 定位

### 部署

仅部署到 **Cloudflare Pages**（不使用 Vercel）：

- 构建命令：`npm run build`
- 输出目录：`out`
- `public/_redirects` / `public/_headers` 构建后原样输出，用于 Cloudflare Pages 边缘配置
- `trailingSlash: false`（保证百度站长验证等根目录文件不被重定向 404）

### 新增分类注意事项

在 `navigation.json` 中新增分类后，还需在 `src/lib/icons.ts` 中同步添加：

1. `iconMap` 中的 FA class → Lucide 图标映射
2. `gradients` 中的分类名 → Tailwind 渐变色
3. `badges` 中的分类名 → badge 背景/文字色
