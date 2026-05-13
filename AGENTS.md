# 货代导航网 - AI 协作指南

## 核心规则
1. **不要修改现有 UI 界面**。界面已定型，只完善数据和功能逻辑。
2. 端口固定为 **3018**，不要更改。
3. 这是**静态导出**项目 (next export)，不能使用需要服务器端运行时的 Next.js 功能。
4. 数据核心文件是 `src/data/navigation.json`，改动需谨慎。

## 数据流
WordPress XML → import 页面解析 → navigation.json → 静态页面渲染

## 部署方式
仅部署到 **Cloudflare Pages**（不使用 Vercel）。

- 构建命令: `npm run build`
- 输出目录: `out`
- 边缘配置走 Cloudflare Pages 原生文件：
  - `public/_redirects` —— 重定向规则（构建后输出到 `out/_redirects`）
  - `public/_headers` —— 自定义响应头（构建后输出到 `out/_headers`）
- 域名（apex 与 www）均接入同一个 Pages 项目，Cloudflare 管 DNS。
