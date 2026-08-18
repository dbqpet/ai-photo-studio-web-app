import type { SeoPageContent } from "@/lib/seo/types";
import { footerZhTw } from "@/lib/seo/content/cn/shared";

export const fourRIdPhotoZhTw: SeoPageContent = {
  slug: "4r-id-photo",
  meta: {
    title: "4R證件相｜證件相自製4R打印排版｜AI Images Studio",
    description:
      "用普通自拍製作4R證件相打印排版。AI Images Studio 可自動去除背景、調整尺寸，並將多張證件相排版至一張4R相紙，方便在家或相舖列印。",
    keywords: [
      "4R證件相",
      "證件相打印",
      "4R排版",
      "證件相自製",
      "4R列印",
      "證件相4R",
    ],
    htmlLang: "zh-Hant",
    locale: "zh_TW",
  },
  nav: { headerCta: "⚡ 立即免費製作4R證件相" },
  hero: {
    title: "4R證件相：自己製作4R證件相打印排版",
    subtitle:
      "不少申請仍需要實體證件相，一次申請往往要準備多張相同尺寸。從手機自拍出發，AI 幫你處理背景與尺寸，再自動排版至標準 4R 相紙，一次列印多張，省時又省錢。",
    primaryCta: "⚡ 立即免費製作4R證件相",
    secondaryCta: "了解4R排版流程",
    secondaryTargetId: "workflow",
  },
  ctaHref: "/",
  ctaLocale: "zh",
  prominentCta: true,
  sections: [
    {
      type: "prose",
      title: "什麼是4R證件相排版？",
      image: {
        src: "/images/4r_layout_illustration_1.png",
        alt: "4R 相紙上排版六張證件相的示意圖",
        caption: "一張 4R 相紙排版 6 張證件相，方便裁剪",
        layout: "aside",
      },
      paragraphs: [
        "4R 是常見的沖曬尺寸，約 4×6 英寸（102×152 mm），便利店自助影印機、相舖及網上沖印大多支援此規格。",
        "與單張證件相檔案不同，4R 排版會將同一尺寸的多張證件相排列在一張相紙上，列印後再沿邊裁剪，比逐張沖印更划算。",
      ],
      bullets: [
        "一張 4R 相紙可排版多張 35×45 mm、40×50 mm 或 2×2 英寸證件相",
        "適合護照、簽證、回鄉證及一般證件用途",
        "可在家用相片紙列印，或帶檔案到相舖沖印",
      ],
    },
    {
      type: "steps",
      id: "workflow",
      title: "4R證件相製作流程",
      items: [
        {
          title: "普通自拍",
          description:
            "用手機在光線充足、背景簡單的地方拍攝正面人像，保留頭頂及雙肩，表情自然。",
        },
        {
          title: "AI 證件相處理",
          description:
            "上傳至 AI Images Studio，自動去除背景、平衡光線，並選擇所需證件相尺寸預設。",
        },
        {
          title: "4R 自動排版",
          description:
            "選擇 4R 排版功能，預覽多張證件相在相紙上的排列與間距，確認後再下載。",
        },
        {
          title: "打印／下載",
          description:
            "下載高解像度排版檔，在家列印或使用便利店影印機沖印，裁剪後即可使用。",
        },
      ],
    },
    {
      type: "features",
      title: "4R 排版的好處",
      items: [
        {
          icon: "📄",
          title: "一次列印多張",
          description: "同一申請常需 2–4 張相同證件相，4R 排版可一次完成。",
        },
        {
          icon: "💰",
          title: "節省沖印費用",
          description: "比逐張在相舖沖印更經濟，尤其家庭多人同時申請時。",
        },
        {
          icon: "📐",
          title: "尺寸預設齊全",
          description: "支援常見護照、簽證及證件尺寸，減少手動裁剪誤差。",
        },
        {
          icon: "🖨️",
          title: "高解像輸出",
          description: "以適合沖印的解像度輸出，確保列印後清晰銳利。",
        },
      ],
    },
    {
      type: "prose",
      title: "在家列印 vs 相舖沖印",
      image: {
        src: "/images/4r_layout_illustration_2.png",
        alt: "手機即時預覽 4R 排版並輕鬆列印的示意圖",
        caption: "手機即時預覽排版效果，下載後即可在家或便利店輕鬆列印",
        layout: "below",
      },
      subsections: [
        {
          title: "在家列印",
          bullets: [
            "需使用相片紙及支援相片列印的噴墨機",
            "列印時關閉「縮放至頁面」選項",
            "列印後待墨水乾透再裁剪，避免弄污",
          ],
        },
        {
          title: "相舖或便利店沖印",
          bullets: [
            "色彩及銳度通常較家用機穩定",
            "可透過手機 App 或 USB 上傳 4R 排版檔",
            "單次費用低，適合不常列印的家庭",
          ],
        },
      ],
    },
    {
      type: "disclaimer",
      title: "尺寸提示",
      paragraphs: [
        "實際列印尺寸可能因打印機邊距或影印機設定而略有偏差，建議先列印一張測試，用尺量度後再批量沖印。",
        "AI Images Studio 提供排版工具協助準備證件相，但不保證每部設備的輸出完全符合各機構的毫米級要求，提交前請查閱官方指引。",
      ],
      links: [
        { href: "/zh/passport-photo-size", label: "護照相尺寸指南" },
        { href: "/zh/id-photo-maker", label: "AI 證件相製作" },
      ],
    },
  ],
  faq: {
    title: "4R 證件相常見問題",
    items: [
      {
        question: "影印機上應選擇什麼紙張尺寸？",
        answer:
          "選擇 4×6 英寸、4R 或 10×15 cm——各地命名不同，但尺寸相同。",
      },
      {
        question: "一張 4R 可排版幾張證件相？",
        answer:
          "視證件相尺寸而定，常見 35×45 mm 規格通常可排版 6–8 張，實際數量以預覽為準。",
      },
      {
        question: "需要 300 DPI 嗎？",
        answer:
          "300 DPI 是沖印證件相的常用標準，AI Images Studio 輸出高解像檔案，適合相片沖印。",
      },
      {
        question: "可以混排不同尺寸嗎？",
        answer:
          "4R 排版針對同一尺寸重複排列，如需不同尺寸請分別製作排版檔。",
      },
    ],
  },
  bottomCta: {
    title: "準備好製作 4R 證件相排版？",
    subtitle: "上傳自拍，預覽 4R 多張排版效果，滿意後再下載沖印。",
    button: "⚡ 立即免費製作4R證件相",
  },
  relatedPages: [
    { slug: "id-photo-print", label: "證件相打印／列印" },
    { slug: "id-photo-maker", label: "AI 證件相製作" },
    { slug: "passport-photo-size", label: "護照相尺寸指南" },
    { slug: "passport-photo-at-home", label: "在家製作護照相" },
  ],
  relatedPagesTitle: "相關指南",
  footer: footerZhTw,
};
