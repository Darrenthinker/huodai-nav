/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // false：保证 /baidu_verify_*.html 等根目录验证文件不被重定向到 .../ 导致 404（百度站长验证）
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  devIndicators: false
};

export default nextConfig;
