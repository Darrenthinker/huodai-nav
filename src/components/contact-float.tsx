"use client";

import { Phone, Mail } from "lucide-react";

export function ContactFloat() {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[95]">
      <div className="bg-white/90 backdrop-blur rounded shadow-sm border border-black/[0.05] flex flex-col divide-y divide-black/[0.04]">
        {/* WeChat */}
        <div className="group/wc relative">
          <div className="pointer-events-none opacity-0 group-hover/wc:opacity-100 group-hover/wc:pointer-events-auto absolute right-8 top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl border border-black/[0.06] p-2 w-[130px] transition-opacity duration-150">
            <div className="w-full aspect-square bg-[#f9f9f9] rounded overflow-hidden">
              <img src="/wechat-qr.jpg" alt="微信二维码" className="w-full h-full object-contain" />
            </div>
            <p className="text-[8px] text-[#999] mt-1 text-center">陈闯 · 13424240034</p>
          </div>
          <div className="w-7 h-7 flex items-center justify-center text-[#999] group-hover/wc:text-[#07c160] transition-colors cursor-pointer">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05a6.127 6.127 0 0 1-.247-1.722c0-3.615 3.236-6.553 7.228-6.553.283 0 .558.022.832.05C16.688 4.924 13.084 2.188 8.691 2.188zm-2.32 4.17c-.573 0-1.037-.47-1.037-1.05 0-.58.464-1.05 1.038-1.05.573 0 1.037.47 1.037 1.05 0 .58-.464 1.05-1.037 1.05zm5.398 0c-.573 0-1.037-.47-1.037-1.05 0-.58.464-1.05 1.037-1.05.574 0 1.038.47 1.038 1.05 0 .58-.464 1.05-1.038 1.05zM23.998 14.555c0-3.3-3.236-5.978-7.228-5.978-3.992 0-7.228 2.678-7.228 5.978 0 3.3 3.236 5.978 7.228 5.978.67 0 1.317-.085 1.937-.244a.71.71 0 0 1 .59.08l1.538.9a.265.265 0 0 0 .135.044c.132 0 .241-.108.241-.241 0-.06-.023-.117-.039-.174l-.317-1.197a.481.481 0 0 1 .174-.541c1.516-1.098 2.469-2.74 2.469-4.583h.5zm-9.582-1.69c-.466 0-.845-.383-.845-.856s.38-.856.845-.856c.467 0 .846.383.846.856s-.38.856-.846.856zm4.709 0c-.466 0-.845-.383-.845-.856s.38-.856.845-.856c.467 0 .846.383.846.856s-.38.856-.846.856z"/></svg>
          </div>
        </div>

        {/* Phone */}
        <div className="group/ph relative">
          <div className="pointer-events-none opacity-0 group-hover/ph:opacity-100 group-hover/ph:pointer-events-auto absolute right-8 top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl border border-black/[0.06] p-2 w-[120px] transition-opacity duration-150">
            <p className="text-[9px] font-medium text-[#333] mb-0.5 text-center">电话咨询</p>
            <a href="tel:13424240034" className="block text-[11px] text-[#0A84FF] hover:underline text-center">13424240034</a>
            <a href="tel:13424243144" className="block text-[11px] text-[#0A84FF] hover:underline text-center">13424243144</a>
          </div>
          <div className="w-7 h-7 flex items-center justify-center text-[#999] group-hover/ph:text-[#0A84FF] transition-colors cursor-pointer">
            <Phone size={13} strokeWidth={1.8} />
          </div>
        </div>

        {/* Email */}
        <div className="group/em relative">
          <div className="pointer-events-none opacity-0 group-hover/em:opacity-100 group-hover/em:pointer-events-auto absolute right-8 top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl border border-black/[0.06] p-2 w-[145px] transition-opacity duration-150">
            <p className="text-[9px] font-medium text-[#333] mb-0.5 text-center">邮箱联系</p>
            <a href="mailto:837323977@qq.com" className="block text-[11px] text-[#0A84FF] hover:underline break-all text-center">837323977@qq.com</a>
          </div>
          <div className="w-7 h-7 flex items-center justify-center text-[#999] group-hover/em:text-[#0A84FF] transition-colors cursor-pointer">
            <Mail size={13} strokeWidth={1.8} />
          </div>
        </div>
      </div>
    </div>
  );
}
