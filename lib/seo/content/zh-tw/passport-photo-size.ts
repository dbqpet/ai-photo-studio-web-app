import type { SeoPageContent } from "@/lib/seo/types";
import { footerZhTw } from "@/lib/seo/content/cn/shared";

export const passportPhotoSizeZhTw: SeoPageContent = {
  slug: "passport-photo-size",
  meta: {
    title: "護照相尺寸與證件相尺寸｜常見規格一覽｜AI Images Studio",
    description:
      "護照相及證件相常見尺寸指南：35×45 mm、2×2 英寸、33×48 mm 等規格說明，以及如何選擇正確尺寸並用 AI 工具裁剪。",
    keywords: [
      "護照相尺寸",
      "證件相尺寸",
      "35x45mm",
      "2x2英寸",
      "護照照片大小",
      "證件相規格",
    ],
    htmlLang: "zh-Hant",
    locale: "zh_TW",
  },
  nav: { headerCta: "免費預覽證件相" },
  hero: {
    title: "護照相尺寸與證件相尺寸：常見規格與注意事項",
    subtitle:
      "不同國家及用途的證件相尺寸各異——毫米、英寸及像素要求都可能不同。了解常見規格，再選擇正確預設裁剪，避免因尺寸不符而需重拍。",
    primaryCta: "免費預覽證件相",
    secondaryCta: "常見尺寸一覽",
    secondaryTargetId: "common-sizes",
  },
  sections: [
    {
      type: "prose",
      id: "common-sizes",
      title: "常見護照相及證件相尺寸",
      paragraphs: [
        "證件相尺寸通常以毫米或英寸標示，部分數碼提交還會訂明像素或檔案大小。以下是最常見的規格，但各機構可能略有調整。",
      ],
      bullets: [
        "35×45 mm——歐盟申根簽證、香港護照及多國簽證常用",
        "33×48 mm——部分亞洲國家護照及簽證",
        "40×50 mm——部分中東及亞洲證件",
        "2×2 英寸（51×51 mm）——美國護照及簽證",
        "30×40 mm——部分歐洲及亞洲證件",
        "25×35 mm——部分舊式證件或特殊用途",
      ],
    },
    {
      type: "prose",
      title: "尺寸之外還須注意什麼？",
      subsections: [
        {
          title: "頭部比例",
          paragraphs: [
            "許多規格要求面部（下巴至頭頂）佔照片高度的特定比例，通常約 70–80%。裁剪時需保留適當的頭頂及下巴空間。",
          ],
        },
        {
          title: "數碼 vs 實體",
          bullets: [
            "數碼提交可能要求特定像素（如 600×600 px）及檔案大小上限",
            "實體沖印需以毫米尺寸為準，列印解像度通常 300 DPI",
            "同一申請可能同時需要數碼檔及沖印本",
          ],
        },
        {
          title: "背景及邊距",
          bullets: [
            "部分規格要求背景延伸至照片邊緣，不可有白邊",
            "裁剪框應對齊面部中心，避免頭部偏上或偏下",
          ],
        },
      ],
    },
    {
      type: "features",
      title: "如何用 AI Images Studio 選擇正確尺寸",
      items: [
        {
          icon: "📐",
          title: "多種預設",
          description: "內建 35×45 mm、2×2 英寸等常見預設，一鍵切換。",
        },
        {
          icon: "🔧",
          title: "自訂毫米",
          description: "若機構有特定尺寸，可輸入自訂寬高。",
        },
        {
          icon: "👁️",
          title: "即時預覽",
          description: "調整裁剪框時即時查看面部比例是否合適。",
        },
        {
          icon: "🖨️",
          title: "4R 排版",
          description: "確認尺寸後可生成 4R 多張排版，方便沖印。",
        },
      ],
    },
    {
      type: "steps",
      title: "按尺寸製作證件相",
      items: [
        {
          title: "查閱官方尺寸要求",
          description: "在申請表或政府網站確認所需毫米、英寸或像素規格。",
        },
        {
          title: "上傳正面人像",
          description: "使用光線均勻、背景簡單的近期照片。",
        },
        {
          title: "選擇或輸入尺寸",
          description: "選擇匹配的預設，或輸入自訂毫米數值。",
        },
        {
          title: "調整裁剪並預覽",
          description: "確保面部居中、頭頂及下巴空間符合比例要求。",
        },
        {
          title: "下載或排版沖印",
          description: "取得數碼檔或 4R 排版檔，按申請方式提交。",
        },
      ],
    },
    {
      type: "disclaimer",
      title: "以官方規格為準",
      paragraphs: [
        "本文列出常見尺寸作參考，各國及機構要求可能更新或存在特殊規定。提交前請以你申請項目的官方指引為最終依據。",
        "AI Images Studio 提供尺寸預設及裁剪工具，但不保證輸出符合所有機構的毫米級或像素級要求。",
      ],
      links: [
        { href: "/zh/passport-photo-requirements", label: "護照相要求" },
        { href: "/zh/4r-id-photo", label: "4R 證件相排版" },
      ],
    },
  ],
  faq: {
    title: "護照相尺寸常見問題",
    items: [
      {
        question: "35×45 mm 與 2×2 英寸是否相同？",
        answer:
          "不同。35×45 mm 約 1.38×1.77 英寸，2×2 英寸為 51×51 mm 正方形。請按申請要求選擇。",
      },
      {
        question: "可以用厘米代替毫米嗎？",
        answer:
          "3.5×4.5 cm 等同 35×45 mm。列印時注意單位換算，避免選錯紙張設定。",
      },
      {
        question: "數碼提交需要多少像素？",
        answer:
          "各平台要求不同，常見最低 600×600 px 或 1200×1200 px。查閱申請網站的技術規格。",
      },
    ],
  },
  bottomCta: {
    title: "已知所需尺寸？",
    subtitle: "上傳照片，選擇預設，免費預覽裁剪效果。",
    button: "免費預覽證件相",
  },
  relatedPages: [
    { slug: "passport-photo-requirements", label: "護照相要求" },
    { slug: "4r-id-photo", label: "4R 證件相排版" },
    { slug: "id-photo-maker", label: "AI 證件相製作" },
    { slug: "visa-photo", label: "簽證相製作" },
  ],
  relatedPagesTitle: "相關指南",
  footer: footerZhTw,
};
