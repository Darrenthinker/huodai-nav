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

### 新增站点固定流程

每次在 `navigation.json` 中新增一个站点，按以下步骤执行，不要跳步：

1. **确定 id**：取当前文件中最大 id + 1（`grep -o '"id": [0-9]*' src/data/navigation.json | sort -n | tail -1`），确保唯一。
2. **确定 order**：找到目标分类下希望排在其前面的那条记录的 `order` 值，取一个比它略小、比下一条略大的数（如 `1998.03` 和 `1998.0299` 之间插入 `1998.02995`），越靠前 `order` 越大。
3. **写入条目**：`id`、`title`、`url`、`description`、`category`、`order`、`thumbnail`（留空字符串）。标题优先使用目标站点官网上的自称名称，不要臆造。
4. **抓取 logo**：`node scripts/fetch-all-logos.mjs --id <新id>`，只处理这一个站点，避免误触发全量抓取。
5. **人工核验 logo**：用 Read 工具打开生成的 `public/logos/<id>.png` 实际看一眼。脚本会抓取页面里第一个匹配到的 favicon/`og:image`/含 "logo" 关键字的图片，容易误抓到与站点身份无关的图（例如"诚信网站"认证徽章、空白 data URI、聚合站默认图标）。
   - 如果不对：手动 `curl` 目标站的 `<link rel="icon">`/`shortcut icon` 地址或官网 header 区域的真实 logo 图，人工确认后用 Write/Bash 覆盖到 `public/logos/<id>.png`。
6. **提交**：`git add src/data/navigation.json public/logos/<id>.png` 后单独 commit，commit message 说明新增的站点名。不要顺带把无关的未提交改动（其他 logo、sitemap、脚本产物等）一起 `git add`。
7. **推送前检查残留锁**：本仓库偶发 `.git/index.lock`、`.git/HEAD.lock`、`.git/refs/remotes/origin/*.lock*` 残留（历史上某次 git 进程异常退出所致）。若 push/commit 报 "Unable to create ... lock file" 且 `ps aux | grep git` 确认无 git 进程在跑，可直接删除该 lock 文件后重试；如与远端有分叉，用 `git fetch` + `git rebase origin/master`（若有无关改动先 `git stash push -u`）。
