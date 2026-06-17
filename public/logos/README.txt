本地站点图标（可选）
====================

把图片放在本目录后，卡片会优先使用这里文件，再尝试网络 favicon。

命名方式（任选其一，支持 png / webp / svg）：

1) 按站点 ID（与 navigation.json 里每条 "id" 一致，最稳妥）
   例如：45.png

2) 按浏览器地址栏里的主机名，把点换成横线（与链接里域名一致）
   例如：saudiacargo.com → saudiacargo-com.png
        uat6ecargo.goindigo.in → uat6ecargo-goindigo-in.png
   若子域与父域不同，想用父域图标可改用站点 ID 命名。

批量从「网站自己首页」抓图标（og:image / apple-touch-icon 等）：
  在项目根目录执行：
    npm run fetch-logos
  只抓新增站点（id≥2837，含航司二字码 CDN 兜底）：
    npm run fetch-logos:new
  可选：--limit 50   只跑前 50 个未缓存的
        --id 4328    只测一条
        --force      含 WordPress 缩略图的也重抓
  结果写入 src/data/logo-discovered.json，可提交到 Git。

建议尺寸：64～128 像素方形，透明底更佳。
