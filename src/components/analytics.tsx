// 网站分析 ID 配置（拿到新 ID 直接填这里即可全站生效）
const CLARITY_ID = "x97nt8cgj9"; // Microsoft Clarity 项目ID（热图/录屏/行为）
const BAIDU_ID = "5ed66e6ddeb75ba92fcf1f2672de52bc"; // 百度统计：hm.js? 后面那串
const GA4_ID = ""; // Google Analytics 4：G- 开头的测量ID

/**
 * 全站网站分析。直接渲染为静态 HTML 内的内联脚本（服务端导出即在页面中），
 * 这样百度统计的"代码安装检查"能抓到 hm.js，同时脚本本身按 async 异步加载、不阻塞首屏。
 */
export function Analytics() {
  return (
    <>
      {BAIDU_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `var _hmt=_hmt||[];(function(){var hm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?${BAIDU_ID}";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s);})();`,
          }}
        />
      )}
      {CLARITY_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`,
          }}
        />
      )}
      {GA4_ID && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}');`,
            }}
          />
        </>
      )}
    </>
  );
}
