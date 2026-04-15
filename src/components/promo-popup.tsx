"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, Check } from "lucide-react";

const URL_REGISTER  = "https://www.forwarderspn.com/company-registration";
const URL_DIRECTORY = "https://www.forwarderspn.com/logistics-directory";
const STORAGE_KEY   = "huodai_promo_v2";
const SHOW_INTERVALS = [0, 7 * 24 * 3600 * 1000, 14 * 24 * 3600 * 1000];

// 与网站实际服务大类保持一致
const SERVICE_TAGS = [
  "传统国际物流",
  "跨境电商物流",
  "物流服务",
  "企业服务",
  "外贸展会",
  "物流活动",
];

export function PromoPopup({ onFilled }: { onFilled: () => void }) {
  const [visible,    setVisible]    = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    try {
      const raw  = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : { count: 0, filled: false, lastShown: 0 };
      if (data.filled) { onFilled(); return; }
      if (data.count >= SHOW_INTERVALS.length) return;

      const now        = Date.now();
      const firstVisit = data.firstVisit || now;
      if (!data.firstVisit) {
        data.firstVisit = now;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      if (now - firstVisit < SHOW_INTERVALS[data.count]) return;
      if (data.lastShown && now - data.lastShown < 24 * 3600 * 1000) return;

      const t = setTimeout(() => {
        setVisible(true);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, count: data.count + 1, lastShown: now }));
      }, 2500);
      return () => clearTimeout(t);
    } catch { /* */ }
  }, [onFilled]);

  const dismiss = () => { setAnimateOut(true); setTimeout(() => setVisible(false), 380); };

  const handleRegister = () => {
    try {
      const raw  = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : { count: 3 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, filled: true }));
    } catch { /* */ }
    setAnimateOut(true);
    setTimeout(() => { setVisible(false); onFilled(); }, 380);
    window.open(URL_REGISTER, "_blank", "noopener,noreferrer");
  };

  if (!visible) return null;

  return (
    <>
      {/* ── 遮罩 ── */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-500 ${animateOut ? "opacity-0" : "opacity-100"}`}
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
        onClick={dismiss}
      />

      {/* ── 弹窗 ── */}
      <div
        className={`fixed z-[61] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]
          ${animateOut ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
        style={{ width: "min(640px, 96vw)" }}
      >
        <div
          className="relative rounded-[26px] overflow-hidden"
          style={{
            background: "#ffffff",
            boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 12px 36px rgba(0,0,0,0.1), 0 40px 80px rgba(0,0,0,0.12)",
          }}
        >

          {/* ═══════════════ 深色顶部 Header ═══════════════ */}
          <div
            className="relative px-6 pt-5 pb-5 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0d1b3e 0%, #112155 50%, #0d2060 100%)",
            }}
          >
            {/* 微光装饰 */}
            <div className="absolute -top-14 -right-14 w-52 h-52 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(99,179,237,0.1) 0%, transparent 65%)" }} />
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />

            {/* 关闭按钮 */}
            <button
              onClick={dismiss}
              aria-label="关闭"
              className="absolute right-4 top-4 z-10 w-7 h-7 flex items-center justify-center rounded-full
                transition-all duration-200 hover:bg-white/20 active:scale-95"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <X size={13} className="text-white/70" strokeWidth={2.5} />
            </button>

            <div className="flex items-center gap-4">
              {/* Logo */}
              <div
                className="w-12 h-12 rounded-[15px] flex items-center justify-center text-[22px] flex-shrink-0"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                🌐
              </div>

              {/* 品牌文字 */}
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-[16px] leading-tight" style={{ letterSpacing: "-0.01em" }}>
                  货代服务商
                </div>
                <div className="text-white/50 text-[12px] mt-0.5">货代资源中心 · 仰度科技</div>
              </div>

              {/* 免费标签 */}
              <div
                className="flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold"
                style={{
                  background: "rgba(255,159,10,0.2)",
                  color: "#FFD60A",
                  border: "1px solid rgba(255,214,10,0.3)",
                }}
              >
                完全免费
              </div>
            </div>
          </div>

          {/* ═══════════════ 主体内容 ═══════════════ */}
          <div className="flex">

            {/* ── 左侧主内容 ── */}
            <div className="flex-1 px-6 py-5 flex flex-col gap-4 min-w-0">

              {/* 核心价值标题 */}
              <div>
                <h2
                  className="font-bold text-[#1d1d1f] leading-[1.2]"
                  style={{ fontSize: "clamp(20px, 3.6vw, 26px)", letterSpacing: "-0.025em" }}
                >
                  让货主主动找到<br />你的公司
                </h2>
                <p className="text-[#6e6e73] text-[13px] mt-2 leading-relaxed">
                  免费入驻货代黄页，填写一次，长期获客
                </p>
              </div>

              {/* 3 大核心优势 */}
              <div className="flex flex-col gap-2">
                {[
                  { icon: "✍️", title: "3 分钟填完",    desc: "公司信息、航线、联系方式" },
                  { icon: "🌏", title: "即时上线展示",   desc: "提交后无需审核等待" },
                  { icon: "🤝", title: "同行资源互找",   desc: "查找全球货代，拓展合作网络" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[15px] flex-shrink-0 mt-0.5"
                      style={{ background: "#f0f4ff" }}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[#1d1d1f] font-semibold text-[13px]">{item.title}</span>
                      <span className="text-[#6e6e73] text-[12px] ml-1.5">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 两个快捷入口 */}
              <div className="flex flex-col gap-2">
                {[
                  {
                    url:   URL_REGISTER,
                    icon:  "✍️",
                    color: "#0A84FF",
                    bg:    "#EFF6FF",
                    label: "信息填写",
                    desc:  "免费入驻，填写公司资料",
                  },
                  {
                    url:   URL_DIRECTORY,
                    icon:  "🔍",
                    color: "#34C759",
                    bg:    "#F0FFF4",
                    label: "信息查看",
                    desc:  "浏览货代黄页，查找同行",
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
                    className="group flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-left
                      transition-all duration-150 hover:brightness-95 active:scale-[0.98]"
                    style={{ background: item.bg, border: `1px solid ${item.color}22` }}
                  >
                    <span className="text-[16px] flex-shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-[13px]" style={{ color: item.color }}>
                        {item.label}
                      </span>
                      <span className="text-[#6e6e73] text-[11px] ml-1.5">{item.desc}</span>
                    </div>
                    <ChevronRight size={14} className="flex-shrink-0 text-[#c7c7cc] group-hover:translate-x-0.5 transition-transform duration-150" />
                  </button>
                ))}
              </div>
            </div>

            {/* ── 竖分割线 ── */}
            <div className="w-px self-stretch my-5 flex-shrink-0 bg-[#e5e5ea]" />

            {/* ── 右侧 CTA 区域 ── */}
            <div
              className="flex flex-col items-center justify-center gap-4 px-5 py-5 flex-shrink-0"
              style={{ width: "clamp(160px, 27%, 185px)" }}
            >
              {/* 核心利益点 */}
              <div
                className="w-full rounded-[14px] px-4 py-4 text-center"
                style={{ background: "#f5f5f7" }}
              >
                <div className="text-[#1d1d1f] font-black text-[32px] leading-none" style={{ letterSpacing: "-0.04em" }}>
                  免费
                </div>
                <div className="text-[#6e6e73] text-[11px] mt-1.5">无隐藏费用</div>
                <div className="h-px w-8 mx-auto my-2.5 bg-[#d1d1d6]" />
                {/* checklist */}
                <div className="flex flex-col gap-1.5 text-left">
                  {["立即上线", "长期展示", "免费使用"].map((t) => (
                    <div key={t} className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "#34C759" }}>
                        <Check size={9} className="text-white" strokeWidth={3} />
                      </div>
                      <span className="text-[#3a3a3c] text-[11px]">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 主 CTA — 暖橙色高转化按钮 */}
              <button
                onClick={handleRegister}
                className="w-full py-3 rounded-[14px] font-bold text-white text-[14px]
                  transition-all duration-200 active:scale-[0.96] hover:brightness-110"
                style={{
                  background: "linear-gradient(135deg, #FF9F0A 0%, #FF6B00 100%)",
                  boxShadow: "0 4px 16px rgba(255,107,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
                  letterSpacing: "0.01em",
                }}
              >
                立即免费入驻
              </button>

              <button
                onClick={dismiss}
                className="text-[11px] text-[#aeaeb2] hover:text-[#6e6e73] transition-colors duration-200"
              >
                以后再说
              </button>
            </div>
          </div>

          {/* ═══════════════ 底部服务大类（与网站一致） ═══════════════ */}
          <div
            className="flex items-center flex-wrap gap-x-3 gap-y-1.5 px-6 py-3"
            style={{ background: "#f9f9f9", borderTop: "1px solid #e5e5ea" }}
          >
            <span className="text-[#aeaeb2] text-[10px] font-medium flex-shrink-0">服务大类</span>
            {SERVICE_TAGS.map((tag) => (
              <span
                key={tag}
                className="text-[11px] text-[#3a3a3c] px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: "#ededf0" }}
              >
                {tag}
              </span>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
