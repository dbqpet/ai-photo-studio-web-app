import type { SeoPageContent } from "@/lib/seo/types";
import { footerZhTw } from "@/lib/seo/content/cn/shared";

export const idPhotoPrintZhTw: SeoPageContent = {
  slug: "id-photo-print",
  meta: {
    title: "證件相打印／列印｜自己製作可打印證件相｜AI Images Studio",
    description:
      "自己製作可打印的證件相排版。將多張證件相排列至 4R 相紙，在家列印或到相舖沖印，一次取得多張相同尺寸副本。",
    keywords: [
      "證件相打印",
      "證件相列印",
      "打印證件相",
      "4R證件相",
      "可打印證件相",
      "證件相沖印",
    ],
    htmlLang: "zh-Hant",
    locale: "zh_TW",
  },
  nav: { headerCta: "免費預覽證件相" },
  hero: {
    title: "證件相打印／列印：自己製作可打印證件相",
    subtitle:
      "數碼檔方便上傳，但不少申請仍需要實體證件相，家庭亦常需多張相同副本。了解如何準備照片，並將多張排版至標準 4R 相紙一次沖印。",
    primaryCta: "免費預覽證件相",
    secondaryCta: "為何需要排版",
    secondaryTargetId: "why-print",
  },
  sections: [
    {
      type: "prose",
      id: "why-print",
      title: "數碼檔 vs 可打印證件相",
      paragraphs: [
        "部分領事館及政府平台只接受數碼上傳，另一些則要求將沖印本附於表格或帶至面試。",
        "即使數碼檔已足夠，備有沖印本仍有用——備用表格、續期提醒，或家人同時申請時。",
      ],
    },
    {
      type: "prose",
      title: "為何將多張排版至一張相紙？",
      bullets: [
        "一次 4R 沖印取得多張相同證件相，比逐張更划算",
        "減低其中一張弄污或表格需兩張時的困擾",
        "多位家人可從一次沖印取得各自副本",
        "便利店及相舖普遍支援 4R 尺寸",
      ],
    },
    {
      type: "prose",
      title: "什麼是 4R 打印排版？",
      paragraphs: [
        "4R 指約 4×6 英寸（102×152 mm）的標準沖印尺寸，自助影印機、便利店及網上沖印服務廣泛支援。",
        "AI Images Studio 可將多張證件相排列於一張 4R 版面，沖印後用剪刀或裁紙刀裁剪。",
      ],
      bullets: [
        "一張 4R → 多張護照尺寸證件相",
        "支援 35×45 mm、40×50 mm、2×2 英寸等常見預設",
        "適合香港、歐洲、美國及一般證件格式",
      ],
    },
    {
      type: "steps",
      title: "製作及打印證件相排版",
      items: [
        {
          title: "準備原始人像",
          description:
            "上傳清晰照片至 AI Images Studio，去除背景並選擇目標尺寸預設。",
        },
        {
          title: "生成 4R 排版",
          description: "選擇排版功能，將多張副本排列於一張 4R 頁面，下載前預覽間距。",
        },
        {
          title: "下載高解像排版檔",
          description: "以完整沖印解像度儲存，通常 300 DPI 以確保清晰。",
        },
        {
          title: "在家或相舖沖印",
          description:
            "在家：用相片紙及最高品質設定。相舖：透過 USB、App 或網上傳送檔案至影印機。",
        },
        {
          title: "裁剪及核對",
          description: "小心裁剪每張照片，用尺量度後再批量沖印。",
        },
      ],
    },
    {
      type: "prose",
      title: "在家列印 vs 相舖沖印",
      subsections: [
        {
          title: "在家列印",
          bullets: [
            "已有相片噴墨機時最快捷",
            "使用光面或啞面相片紙，非普通影印紙",
            "列印對話框關閉「縮放至頁面」",
            "待墨水乾透再裁剪",
          ],
        },
        {
          title: "相舖或便利店",
          bullets: [
            "色彩及銳度通常較家用機穩定",
            "可帶 4R 檔到手機，職員可協助",
            "單次費用通常低於影相舖套餐",
          ],
        },
      ],
    },
    {
      type: "disclaimer",
      title: "尺寸提示",
      paragraphs: [
        "實際沖印尺寸可能因打印機邊距或影印機設定而略有偏差，建議先列印一張測試再批量沖印。",
        "AI Images Studio 提供排版工具協助準備，但不保證每部設備輸出完全符合各機構毫米要求。",
      ],
      links: [
        { href: "/zh/4r-id-photo", label: "4R 證件相排版" },
        { href: "/zh/id-photo-maker", label: "AI 證件相製作" },
      ],
    },
  ],
  faq: {
    title: "證件相打印常見問題",
    items: [
      {
        question: "影印機應選什麼紙張？",
        answer: "選 4×6 英寸／4R／10×15 cm，各地命名不同但尺寸相同。",
      },
      {
        question: "一張排版可放不同尺寸嗎？",
        answer: "4R 排版針對同一尺寸重複排列，不同尺寸請分別製作。",
      },
      {
        question: "需要 300 DPI 嗎？",
        answer: "300 DPI 是沖印證件相的常用標準，AI Images Studio 輸出適合相片沖印的高解像檔。",
      },
    ],
  },
  bottomCta: {
    title: "準備打印多張證件相？",
    subtitle: "上傳照片，免費預覽 4R 排版，滿意後下載沖印。",
    button: "免費預覽證件相",
  },
  relatedPages: [
    { slug: "4r-id-photo", label: "4R 證件相排版" },
    { slug: "id-photo-maker", label: "AI 證件相製作" },
    { slug: "passport-photo-at-home", label: "在家拍護照相" },
    { slug: "passport-photo-size", label: "護照相尺寸" },
  ],
  relatedPagesTitle: "相關指南",
  footer: footerZhTw,
};
