"use client";

import { useState, useEffect } from "react";
import { X, BookOpen, ExternalLink } from "lucide-react";

const PROMO_URL = "https://www.forwarderspn.com/spn?category=logistics-directory";
const STORAGE_KEY = "huodai_promo_v2";
const SHOW_INTERVALS = [0, 7 * 24 * 3600 * 1000, 14 * 24 * 3600 * 1000];

export function PromoPopup({ onFilled }: { onFilled: () => void }) {
  const [visible, setVisible] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : { count: 0, filled: false, lastShown: 0 };
      if (data.filled) { onFilled(); return; }
      if (data.count >= SHOW_INTERVALS.length) return;

      const now = Date.now();
      const interval = SHOW_INTERVALS[data.count];
      const firstVisit = data.firstVisit || now;
      if (!data.firstVisit) {
        data.firstVisit = now;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }

      if (now - firstVisit < interval) return;
      if (data.lastShown && now - data.lastShown < 24 * 3600 * 1000) return;

      const timer = setTimeout(() => {
        setVisible(true);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, count: data.count + 1, lastShown: now }));
      }, 2500);
      return () => clearTimeout(timer);
    } catch { /* */ }
  }, [onFilled]);

  const handleClose = () => {
    setAnimateOut(true);
    setTimeout(() => setVisible(false), 300);
  };

  const handleFill = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : { count: 3, filled: false };
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, filled: true }));
    } catch { /* */ }

    setAnimateOut(true);
    setTimeout(() => {
      setVisible(false);
      onFilled();
    }, 300);

    window.open(PROMO_URL, "_blank", "noopener,noreferrer");
  };

  if (!visible) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-500 ${animateOut ? "opacity-0" : "opacity-100"}`}
        style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)" }}
        onClick={handleClose}
      />

      <div
        className={`fixed z-[61] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] max-w-[90vw] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${animateOut ? "opacity-0 scale-[0.92]" : "opacity-100 scale-100"}`}
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.98)",
            boxShadow: "0 20px 60px -10px rgba(0,0,0,0.2), 0 0 0 0.5px rgba(0,0,0,0.05)",
          }}
        >
          {/* Content */}
          <div className="px-7 pt-8 pb-5 text-center">
            <button
              onClick={handleClose}
              className="absolute right-3.5 top-3.5 w-[26px] h-[26px] flex items-center justify-center rounded-full bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed] transition-colors duration-200"
            >
              <X size={12} strokeWidth={2.5} />
            </button>

            <div
              className="w-14 h-14 mx-auto rounded-[16px] flex items-center justify-center mb-5"
              style={{ background: "linear-gradient(145deg, #007AFF, #5856D6)", boxShadow: "0 6px 20px -4px rgba(0,122,255,0.4)" }}
            >
              <BookOpen size={26} className="text-white" strokeWidth={1.6} />
            </div>

            <h3 className="text-[19px] font-semibold text-[#1d1d1f] tracking-[-0.01em] mb-1.5">
              货代黄页
            </h3>
            <p className="text-[13px] text-[#86868b] leading-[1.6]">
              汇聚 <span className="text-[#1d1d1f] font-medium">10,000+</span> 家货代服务商信息
              <br />
              免费入驻，让全球客户找到你
            </p>
          </div>

          {/* Divider */}
          <div className="mx-7 h-px bg-[#e5e5ea]" />

          {/* Features */}
          <div className="px-7 py-4 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-[#007AFF]/[0.07] flex items-center justify-center flex-shrink-0">
                <span className="text-[15px]">✏️</span>
              </div>
              <div>
                <p className="text-[13px] text-[#1d1d1f]">填写公司信息</p>
                <p className="text-[11px] text-[#86868b]">业务范围、优势航线、联系方式</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-[#5856D6]/[0.07] flex items-center justify-center flex-shrink-0">
                <span className="text-[15px]">🔍</span>
              </div>
              <div>
                <p className="text-[13px] text-[#1d1d1f]">查找同行资源</p>
                <p className="text-[11px] text-[#86868b]">按地区、航线搜索全球货代</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-[#34C759]/[0.07] flex items-center justify-center flex-shrink-0">
                <span className="text-[15px]">🆓</span>
              </div>
              <div>
                <p className="text-[13px] text-[#1d1d1f]">完全免费</p>
                <p className="text-[11px] text-[#86868b]">填写即上线，无任何费用</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-7 h-px bg-[#e5e5ea]" />

          {/* Actions */}
          <div className="px-5 py-4 flex flex-col gap-2">
            <button
              onClick={handleFill}
              className="w-full py-[11px] rounded-xl text-[15px] font-medium text-white transition-all duration-200 active:scale-[0.98]"
              style={{ background: "#007AFF" }}
            >
              免费入驻
            </button>
            <button
              onClick={handleClose}
              className="w-full py-[9px] rounded-xl text-[13px] text-[#007AFF] hover:bg-[#f5f5f7] transition-colors duration-200"
            >
              以后再说
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
