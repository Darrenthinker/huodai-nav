import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "页面未找到",
  description: "该页面不存在或已迁移，请返回货代导航网首页查找国际物流、货代工具、海关报关、空运海运和跨境资源。",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-dvh bg-[#f5f5f7] flex items-center justify-center px-6">
      <section className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm border border-[#e5e5e5]/70">
        <p className="text-sm font-medium text-[#86868b]">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-[#1d1d1f]">页面未找到</h1>
        <p className="mt-3 text-sm leading-6 text-[#6e6e73]">
          该页面不存在或已经迁移。你可以返回首页，继续查找货代工具和国际物流资源。
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-[#0A84FF] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0071E3]"
        >
          返回货代导航网首页
        </Link>
      </section>
    </main>
  );
}
