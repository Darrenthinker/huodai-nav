"use client";

import { useState, type FormEvent } from "react";
import { X, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface SubmitFormProps {
  open: boolean;
  onClose: () => void;
}

const WEB3FORMS_KEY = "2d9084e7-af3b-48df-b618-96e5c04ddeb4";

const categoryOptions = [
  "自研工具", "国际空运", "国际快递", "国际海运", "FBA头程",
  "国际专线", "国际小包", "海关常用", "效率工具", "外贸导航",
  "打击老赖", "新闻资讯", "业务推荐",
];

type Status = "idle" | "sending" | "success" | "error";
type Tab = "submit" | "report";

export function SubmitForm({ open, onClose }: SubmitFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [tab, setTab] = useState<Tab>("submit");

  if (!open) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("access_key", WEB3FORMS_KEY);
    data.append("from_name", "货代导航网");
    data.append(
      "subject",
      tab === "submit"
        ? "货代导航网 - 新网址提交"
        : "货代导航网 - 网址报错反馈"
    );
    data.append("type", tab === "submit" ? "新网址提交" : "网址报错");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrorMsg("提交失败，请稍后再试");
      }
    } catch {
      setStatus("error");
      setErrorMsg("网络错误，请检查网络连接");
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setErrorMsg("");
    onClose();
  };

  const switchTab = (t: Tab) => {
    if (status === "sending") return;
    setTab(t);
    setStatus("idle");
    setErrorMsg("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with tabs */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#e5e5e5]">
          <div className="flex gap-1 bg-[#f5f5f7] rounded-lg p-0.5">
            <button
              onClick={() => switchTab("submit")}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                tab === "submit"
                  ? "bg-white text-[#1d1d1f] shadow-sm"
                  : "text-[#86868b] hover:text-[#1d1d1f]"
              }`}
            >
              提交网址
            </button>
            <button
              onClick={() => switchTab("report")}
              className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all ${
                tab === "report"
                  ? "bg-white text-[#ff9f0a] shadow-sm"
                  : "text-[#86868b] hover:text-[#ff9f0a]"
              }`}
            >
              网址报错
            </button>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {status === "success" ? (
          <div className="px-6 py-10 text-center">
            <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${
              tab === "submit" ? "bg-green-50" : "bg-orange-50"
            }`}>
              <CheckCircle size={32} className={tab === "submit" ? "text-green-500" : "text-[#ff9f0a]"} />
            </div>
            <p className="text-[17px] font-semibold text-[#1d1d1f]">
              {tab === "submit" ? "提交成功" : "反馈已收到"}
            </p>
            <p className="text-[13px] text-[#86868b] mt-1.5">
              {tab === "submit"
                ? "我们会尽快审核并收录，感谢您的推荐！"
                : "我们会尽快核实并修复，感谢您的反馈！"}
            </p>

            <div className="mt-5 mx-auto max-w-[260px] px-4 py-3.5 rounded-xl bg-[#f5f5f7] text-left">
              <p className="text-[12px] text-[#86868b] leading-relaxed">如需催促或有疑问，欢迎添加微信咨询：</p>
              <p className="text-[13px] font-medium text-[#1d1d1f] mt-1.5">陈闯</p>
              <div className="flex flex-col gap-0.5 mt-1">
                <a href="tel:13424240034" className="text-[13px] text-[#0A84FF] hover:underline">13424240034</a>
                <a href="tel:13424243144" className="text-[13px] text-[#0A84FF] hover:underline">13424243144</a>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="mt-6 px-8 py-2.5 rounded-lg bg-[#1d1d1f] text-white text-[13px] font-medium hover:bg-[#333] transition-colors"
            >
              关闭
            </button>
          </div>
        ) : tab === "submit" ? (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[#86868b] mb-1.5">网站名称 *</label>
              <input
                name="site_name"
                required
                placeholder="例如：货代服务商"
                className="w-full px-3 py-2 rounded-lg border border-[#d2d2d7] text-[13px] text-[#1d1d1f] placeholder-[#a1a1a6] outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#86868b] mb-1.5">网站地址 *</label>
              <input
                name="site_url"
                type="text"
                required
                placeholder="www.example.com"
                className="w-full px-3 py-2 rounded-lg border border-[#d2d2d7] text-[13px] text-[#1d1d1f] placeholder-[#a1a1a6] outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#86868b] mb-1.5">推荐分类</label>
              <select
                name="category"
                className="w-full px-3 py-2 rounded-lg border border-[#d2d2d7] text-[13px] text-[#1d1d1f] bg-white outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/10 transition-all"
              >
                <option value="">请选择分类</option>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#86868b] mb-1.5">网站简介</label>
              <textarea
                name="description"
                rows={2}
                placeholder="简单描述网站的功能或服务"
                className="w-full px-3 py-2 rounded-lg border border-[#d2d2d7] text-[13px] text-[#1d1d1f] placeholder-[#a1a1a6] outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/10 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#86868b] mb-1.5">您的联系方式</label>
              <input
                name="contact"
                placeholder="邮箱或微信（选填）"
                className="w-full px-3 py-2 rounded-lg border border-[#d2d2d7] text-[13px] text-[#1d1d1f] placeholder-[#a1a1a6] outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/10 transition-all"
              />
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-[12px] text-red-500">
                <AlertCircle size={14} />
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#0A84FF] text-white text-[13px] font-medium hover:bg-[#0070d8] disabled:opacity-60 transition-colors"
            >
              {status === "sending" ? (
                <><Loader2 size={15} className="animate-spin" /> 提交中...</>
              ) : (
                <><Send size={14} /> 提交</>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div className="px-3 py-2.5 rounded-lg bg-[#fff8ef] border border-[#ff9f0a]/20">
              <p className="text-[12px] text-[#86868b] leading-relaxed">
                发现网址打不开、链接错误或信息有误？请告诉我们，收到后会尽快修复。
              </p>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#86868b] mb-1.5">问题网址 *</label>
              <input
                name="error_url"
                type="text"
                required
                placeholder="粘贴打不开或有误的网址"
                className="w-full px-3 py-2 rounded-lg border border-[#d2d2d7] text-[13px] text-[#1d1d1f] placeholder-[#a1a1a6] outline-none focus:border-[#ff9f0a] focus:ring-2 focus:ring-[#ff9f0a]/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#86868b] mb-1.5">网站名称</label>
              <input
                name="error_site_name"
                placeholder="出问题的网站叫什么（选填）"
                className="w-full px-3 py-2 rounded-lg border border-[#d2d2d7] text-[13px] text-[#1d1d1f] placeholder-[#a1a1a6] outline-none focus:border-[#ff9f0a] focus:ring-2 focus:ring-[#ff9f0a]/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#86868b] mb-1.5">错误类型 *</label>
              <select
                name="error_type"
                required
                className="w-full px-3 py-2 rounded-lg border border-[#d2d2d7] text-[13px] text-[#1d1d1f] bg-white outline-none focus:border-[#ff9f0a] focus:ring-2 focus:ring-[#ff9f0a]/10 transition-all"
              >
                <option value="">请选择错误类型</option>
                <option value="网址打不开">网址打不开 / 404</option>
                <option value="链接地址错误">链接地址错误 / 跳转不对</option>
                <option value="网站已关闭">网站已关闭 / 域名过期</option>
                <option value="信息有误">名称或描述信息有误</option>
                <option value="分类不对">分类放错了</option>
                <option value="重复收录">重复收录</option>
                <option value="其他">其他问题</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#86868b] mb-1.5">补充说明</label>
              <textarea
                name="error_detail"
                rows={2}
                placeholder="描述具体问题，或提供正确的网址（选填）"
                className="w-full px-3 py-2 rounded-lg border border-[#d2d2d7] text-[13px] text-[#1d1d1f] placeholder-[#a1a1a6] outline-none focus:border-[#ff9f0a] focus:ring-2 focus:ring-[#ff9f0a]/10 transition-all resize-none"
              />
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-[12px] text-red-500">
                <AlertCircle size={14} />
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#ff9f0a] text-white text-[13px] font-medium hover:bg-[#e68f09] disabled:opacity-60 transition-colors"
            >
              {status === "sending" ? (
                <><Loader2 size={15} className="animate-spin" /> 提交中...</>
              ) : (
                <><AlertCircle size={14} /> 提交报错</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
