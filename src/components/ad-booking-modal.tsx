"use client";

import { useState, forwardRef, type FormEvent } from "react";
import { Check, Copy, MessageCircle, Phone, User, X, Send, Loader2, CheckCircle } from "lucide-react";
import { AD_PRICING, AD_FEATURES, AD_CONTACT } from "@/lib/ad-config";

const WEB3FORMS_KEY = "2d9084e7-af3b-48df-b618-96e5c04ddeb4";

type Status = "idle" | "sending" | "success" | "error";

export const AdBookingPanel = forwardRef<HTMLDivElement, { onClose: () => void }>(
  function AdBookingPanel({ onClose }, ref) {
    const [monthsIdx, setMonthsIdx] = useState(1);
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [contact, setContact] = useState("");
    const [copied, setCopied] = useState<string | null>(null);
    const [status, setStatus] = useState<Status>("idle");

    const pack = AD_PRICING[monthsIdx];

    const copyText = (text: string, key: string) => {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(key);
        setTimeout(() => setCopied(null), 1500);
      });
    };

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      if (!name.trim()) return;
      setStatus("sending");

      const data = new FormData();
      data.append("access_key", WEB3FORMS_KEY);
      data.append("from_name", "货代导航网");
      data.append("subject", `广告位投放意向 - ${name}`);
      data.append("广告名称", name);
      data.append("跳转网址", url || "未填写");
      data.append("投放时长", `${pack.label}（${pack.months}个月）`);
      data.append("投放金额", `¥${pack.price}`);
      data.append("联系方式", contact || "未填写");

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: data,
        });
        setStatus(res.ok ? "success" : "error");
      } catch {
        setStatus("error");
      }
    };

    return (
      <div
        ref={ref}
        className="absolute right-0 top-[calc(100%+8px)] w-[310px] rounded-2xl bg-white/95 backdrop-blur-xl shadow-lg shadow-black/[0.08] border border-[#d2d2d7]/50 z-50 overflow-hidden animate-[fadeSlideIn_0.18s_ease-out]"
      >
        {/* 头部 */}
        <div className="px-4 pt-4 pb-3 border-b border-[#e5e5ea]/60">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[15px] font-semibold text-[#1d1d1f]">广告位投放</h3>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                {AD_FEATURES.map((f) => (
                  <span key={f} className="flex items-center gap-1 text-[10px] text-[#86868b]">
                    <Check size={8} className="text-[#34c759] flex-shrink-0" />{f}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 -mr-1 rounded-full text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {status === "success" ? (
          <div className="px-4 py-8 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#34c759]/10 flex items-center justify-center">
              <CheckCircle size={26} className="text-[#34c759]" />
            </div>
            <p className="text-[15px] font-semibold text-[#1d1d1f]">提交成功</p>
            <p className="text-[12px] text-[#86868b] mt-1">我们会尽快与您联系确认排期</p>
            <div className="mt-4 rounded-xl bg-[#f5f5f7] p-3 text-left space-y-1">
              <p className="flex items-center gap-1.5 text-[12px] text-[#1d1d1f]">
                <User size={11} className="text-[#86868b]" />
                联系人：{AD_CONTACT.name}
              </p>
              <p className="flex items-center gap-1.5 text-[12px] text-[#1d1d1f]">
                <MessageCircle size={11} className="text-[#34c759]" />
                微信：{AD_CONTACT.wechat}
              </p>
              <p className="flex items-center gap-1.5 text-[12px] text-[#1d1d1f]">
                <Phone size={11} className="text-[#0071e3]" />
                电话：{AD_CONTACT.phone}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-6 py-2 rounded-lg bg-[#1d1d1f] text-white text-[12px] font-medium hover:bg-[#333] transition-colors"
            >
              关闭
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-4 py-3 space-y-3">
            {/* 价格 */}
            <div className="grid grid-cols-3 gap-1.5">
              {AD_PRICING.map((p, i) => (
                <button
                  key={p.months}
                  type="button"
                  onClick={() => setMonthsIdx(i)}
                  className={`relative rounded-xl border py-2.5 text-center transition-all ${
                    monthsIdx === i
                      ? "border-[#0071e3] bg-[#0071e3]/[0.04] ring-1 ring-[#0071e3]/20"
                      : "border-[#e5e5ea] hover:border-[#d2d2d7]"
                  }`}
                >
                  {p.badge && (
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px] font-semibold text-white bg-[#0071e3] px-1.5 py-px rounded-full whitespace-nowrap leading-tight">
                      {p.badge}
                    </span>
                  )}
                  <p className="text-[10px] text-[#86868b]">{p.label}</p>
                  <p className="text-[16px] font-semibold text-[#1d1d1f] mt-px">¥{p.price}</p>
                </button>
              ))}
            </div>

            {/* 广告信息 */}
            <div className="space-y-1.5">
              <input
                type="text"
                placeholder="广告名称 *"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#f5f5f7] border border-transparent text-[12px] text-[#1d1d1f] placeholder-[#aeaeb2] outline-none focus:bg-white focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/10 transition-all"
              />
              <input
                type="text"
                placeholder="跳转网址（如 www.example.com）"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#f5f5f7] border border-transparent text-[12px] text-[#1d1d1f] placeholder-[#aeaeb2] outline-none focus:bg-white focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/10 transition-all"
              />
              <input
                type="text"
                placeholder="您的微信或手机号 *"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#f5f5f7] border border-transparent text-[12px] text-[#1d1d1f] placeholder-[#aeaeb2] outline-none focus:bg-white focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/10 transition-all"
              />
            </div>

            {status === "error" && (
              <p className="text-[11px] text-red-500">提交失败，请稍后再试</p>
            )}

            {/* 提交 */}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0071e3] text-white text-[13px] font-medium hover:bg-[#0077ed] disabled:opacity-60 transition-colors active:scale-[0.98]"
            >
              {status === "sending" ? (
                <><Loader2 size={13} className="animate-spin" /> 提交中...</>
              ) : (
                <><Send size={12} /> 提交意向</>
              )}
            </button>

            {/* 联系方式 */}
            <div className="rounded-xl bg-[#f5f5f7] p-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[12px] text-[#1d1d1f] font-medium mb-1">
                <User size={12} className="text-[#86868b]" />
                联系人：{AD_CONTACT.name}
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[12px] text-[#1d1d1f]">
                  <MessageCircle size={11} className="text-[#34c759]" />
                  微信：{AD_CONTACT.wechat}
                </span>
                <button
                  type="button"
                  onClick={() => copyText(AD_CONTACT.wechat, "wx")}
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] text-[#0071e3] hover:bg-[#0071e3]/[0.06] transition-colors"
                >
                  {copied === "wx" ? <Check size={10} /> : <Copy size={10} />}
                  {copied === "wx" ? "已复制" : "复制"}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[12px] text-[#1d1d1f]">
                  <Phone size={11} className="text-[#0071e3]" />
                  电话：{AD_CONTACT.phone}
                </span>
                <button
                  type="button"
                  onClick={() => copyText(AD_CONTACT.phone, "tel")}
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] text-[#0071e3] hover:bg-[#0071e3]/[0.06] transition-colors"
                >
                  {copied === "tel" ? <Check size={10} /> : <Copy size={10} />}
                  {copied === "tel" ? "已复制" : "复制"}
                </button>
              </div>
              <p className="text-[10px] text-[#aeaeb2] leading-relaxed pt-0.5">
                提交后我们会收到邮件通知，也可直接加微信咨询
              </p>
            </div>
          </form>
        )}
      </div>
    );
  }
);
