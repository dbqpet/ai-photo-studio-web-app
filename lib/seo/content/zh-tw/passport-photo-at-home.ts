import type { SeoPageContent } from "@/lib/seo/types";
import { footerZhTw } from "@/lib/seo/content/cn/shared";

export const passportPhotoAtHomeZhTw: SeoPageContent = {
  slug: "passport-photo-at-home",
  meta: {
    title: "如何自己製作護照相？在家用手機完成｜AI Images Studio",
    description:
      "無需到相舖，在家用手機拍攝護照相，再用 AI 去除背景、調整尺寸。逐步指南教你設定光線、背景及構圖，輕鬆完成護照相。",
    keywords: [
      "在家拍護照相",
      "自己製作護照相",
      "DIY護照相",
      "手機護照相",
      "護照相在家",
      "護照相教學",
    ],
    htmlLang: "zh-Hant",
    locale: "zh_TW",
  },
  nav: { headerCta: "免費預覽證件相" },
  hero: {
    title: "如何自己製作護照相？在家用手機完成",
    subtitle:
      "並非每次都要到影相舖。在家設定好光線與背景，用手機拍攝正面人像，再用 AI 工具處理成乾淨的護照格式證件相——省時又方便。",
    primaryCta: "免費預覽證件相",
    secondaryCta: "逐步教學",
    secondaryTargetId: "steps",
  },
  sections: [
    {
      type: "prose",
      title: "為何選擇在家拍護照相？",
      paragraphs: [
        "影相舖方便但未必近身、快捷或划算，尤其需要為多位家人準備，或臨急申請時。",
        "在家拍攝可控制時間、重拍次數及舒適度。關鍵是分兩步：先拍好原始人像，再用專門工具處理成最終護照格式。",
      ],
    },
    {
      type: "prose",
      title: "開始前——選擇合適位置",
      bullets: [
        "盡量站在純色牆前，白色、米白或淺灰最佳",
        "面向窗戶取得柔和自然光，或用兩盞燈以 45° 角照射減少陰影",
        "避免背光（身後有亮窗）造成面部剪影",
        "清除畫面雜物，方便之後去除背景",
        "穿著與牆面有對比但不花俏的衣物",
      ],
    },
    {
      type: "steps",
      id: "steps",
      title: "逐步教學：從在家自拍到可沖印護照相",
      items: [
        {
          title: "設定光線與背景",
          description:
            "選擇面部光線均勻的牆面。關閉色溫偏黃的頂燈。與牆保持約一臂距離以減少陰影。",
        },
        {
          title: "固定手機位置",
          description:
            "將手機置於眼平高度，用三腳架、書本或請人代拍。構圖包含頭部及雙肩，頭頂留少許空間。",
        },
        {
          title: "拍攝多張自然表情照片",
          description:
            "直視鏡頭，雙眼睜開，表情放鬆。拍 10–15 張，選最清晰、陰影最少的一張。",
        },
        {
          title: "上傳至 AI Images Studio",
          description:
            "選擇最清晰的照片，工具會去除背景、平衡光線，並按護照相尺寸預設裁剪。",
        },
        {
          title: "預覽、下載及沖印",
          description:
            "仔細檢查預覽。下載高解像檔或 4R 排版，在家列印或到相舖沖印。",
        },
      ],
    },
    {
      type: "prose",
      title: "實用拍攝技巧",
      subsections: [
        {
          title: "表情與姿態",
          paragraphs: [
            "閉嘴、保持自然表情。正面面向鏡頭——即使微側也可能影響自動裁剪。",
          ],
        },
        {
          title: "衣著及飾物",
          bullets: [
            "除宗教原因外，避免戴帽",
            "若要求露出耳朵，將頭髮撥至耳後",
            "關閉手機美顏或重度濾鏡",
          ],
        },
        {
          title: "在家沖印",
          paragraphs: [
            "使用光面或啞面相片紙及最高列印品質。若家用機效果欠佳，可帶數碼檔到藥房或便利店影印機，通常更清晰。",
          ],
        },
      ],
    },
    {
      type: "solution",
      title: "AI Images Studio 的角色",
      paragraphs: [
        "手機負責拍攝原始人像，AI Images Studio 處理難以手動完成的工作：",
      ],
      bullets: [
        "乾淨的背景替換",
        "曝光及光線平衡",
        "按護照相尺寸預設裁剪",
        "高解像下載及 4R 多張排版",
      ],
    },
    {
      type: "disclaimer",
      title: "提交前請核對要求",
      paragraphs: [
        "在家拍攝很靈活，但各國護照相規定不同。提交前請查閱你申請項目的官方指引，AI Images Studio 不保證符合所有機構要求。",
      ],
      links: [
        { href: "/zh/passport-photo-requirements", label: "護照相要求" },
        { href: "/zh/passport-photo-size", label: "護照相尺寸" },
      ],
    },
  ],
  faq: {
    title: "在家拍護照相常見問題",
    items: [
      {
        question: "在家拍的照片質素夠嗎？",
        answer:
          "通常足夠。現代手機解像度已超越原始人像所需，光線均勻及相機穩定比設備價格更重要。",
      },
      {
        question: "在家應用什麼背景？",
        answer:
          "純色淺色牆最佳。若牆面有紋理或顏色，AI 背景去除仍可協助，但簡單背景效果最佳。",
      },
      {
        question: "可以戴眼鏡嗎？",
        answer:
          "規定各異。部分國家允許無反光眼鏡，部分則不建議。請查閱官方要求後再決定。",
      },
      {
        question: "需要專業相機嗎？",
        answer: "不需要。手機配合良好光線及穩定構圖已足夠作為起點。",
      },
    ],
  },
  bottomCta: {
    title: "已在家拍好照片？",
    subtitle: "立即上傳，免費預覽 AI 處理後的護照相效果。",
    button: "免費預覽證件相",
  },
  relatedPages: [
    { slug: "passport-photo-with-phone", label: "手機拍護照相" },
    { slug: "passport-photo-requirements", label: "護照相要求" },
    { slug: "passport-photo-size", label: "護照相尺寸" },
    { slug: "id-photo-maker", label: "AI 證件相製作" },
  ],
  relatedPagesTitle: "相關指南",
  footer: footerZhTw,
};
