import type { SeoPageContent } from "@/lib/seo/types";
import { footerZhTw } from "@/lib/seo/content/cn/shared";

export const passportPhotoRequirementsZhTw: SeoPageContent = {
  slug: "passport-photo-requirements",
  meta: {
    title: "護照相要求｜背景、尺寸、光線與拍攝注意事項｜AI Images Studio",
    description:
      "護照相及證件相常見要求：背景顏色、尺寸規格、光線條件、表情姿態及衣著飾物。了解要點後用 AI 工具協助準備合規影像。",
    keywords: [
      "護照相要求",
      "證件相要求",
      "護照照片規定",
      "證件相背景",
      "護照相規格",
      "證件相標準",
    ],
    htmlLang: "zh-Hant",
    locale: "zh_TW",
  },
  nav: { headerCta: "免費預覽證件相" },
  hero: {
    title: "護照相要求：背景、尺寸、光線與拍攝注意事項",
    subtitle:
      "各國護照及簽證對證件相有不同標準。本文整理背景、尺寸、光線、表情等常見要求，協助你在拍攝及後期處理時更有方向——提交前仍須查閱官方指引。",
    primaryCta: "免費預覽證件相",
    secondaryCta: "背景要求",
    secondaryTargetId: "background",
  },
  sections: [
    {
      type: "prose",
      id: "background",
      title: "背景要求",
      paragraphs: [
        "大多數護照相及證件相要求純色、均勻的背景，常見為白色、米白或淺灰色。背景不應有陰影、花紋或漸變。",
        "若在家拍攝時背景不理想，AI 背景去除可協助替換為純色背景，但最終效果仍須符合你申請項目的具體規定。",
      ],
      bullets: [
        "背景顏色：白色、米白或淺灰最常見",
        "背景須均勻，無明顯陰影或色差",
        "避免使用有圖案或紋理的牆面",
        "部分規格禁止數位背景模糊效果",
      ],
    },
    {
      type: "prose",
      title: "尺寸與構圖",
      bullets: [
        "常見尺寸：35×45 mm、2×2 英寸、33×48 mm 等",
        "面部（下巴至頭頂）通常佔照片高度約 70–80%",
        "正面直視鏡頭，雙眼睜開且清晰可見",
        "構圖包含頭部及雙肩，頭頂留適當空間",
        "照片須為近期拍攝，部分規定六個月內",
      ],
    },
    {
      type: "prose",
      title: "光線與影像品質",
      subsections: [
        {
          title: "光線",
          bullets: [
            "面部光線均勻，避免一側明顯陰影",
            "避免背光造成面部過暗",
            "避免過曝導致面部細節流失",
            "避免在混合色溫燈光下拍攝造成偏色",
          ],
        },
        {
          title: "清晰度",
          bullets: [
            "影像銳利，無模糊或動態虛化",
            "解像度足夠，縮小後面部仍清晰",
            "避免過度修圖或美顏濾鏡",
          ],
        },
      ],
    },
    {
      type: "prose",
      title: "表情、姿態及飾物",
      bullets: [
        "自然表情，嘴巴閉合",
        "正面面向鏡頭，頭部不可傾斜或轉側",
        "除宗教原因外，通常不可戴帽",
        "眼鏡：部分允許但不可有反光，部分則禁止",
        "頭髮不可遮蓋面部或眼睛",
        "部分規格要求耳朵可見",
      ],
    },
    {
      type: "solution",
      title: "AI Images Studio 如何協助",
      paragraphs: [
        "了解要求後，AI Images Studio 可協助處理難以手動完成的部分：",
      ],
      bullets: [
        "將雜亂背景替換為純色背景",
        "平衡光線，減少陰影",
        "按尺寸預設裁剪，調整頭部比例",
        "輸出高解像檔或 4R 排版供沖印",
      ],
    },
    {
      type: "disclaimer",
      title: "重要提示",
      paragraphs: [
        "各國及機構的護照相要求可能隨時更新，且細節各異。本文僅作一般參考，不能替代官方指引。",
        "AI Images Studio 是影像準備工具，協助製作乾淨、尺寸正確的證件相，但不保證任何機構必然接受，亦不構成移民或法律建議。",
      ],
      links: [
        { href: "/zh/passport-photo-size", label: "護照相尺寸" },
        { href: "/zh/passport-photo-at-home", label: "在家拍護照相" },
      ],
    },
  ],
  faq: {
    title: "護照相要求常見問題",
    items: [
      {
        question: "白色背景是否適用所有申請？",
        answer:
          "大多數要求白色或淺色背景，但部分機構指定米白或淺灰。請查閱官方規格中的背景顏色要求。",
      },
      {
        question: "可以微笑嗎？",
        answer:
          "多數規定要求自然、中性的表情，嘴巴閉合。過度微笑可能被拒。",
      },
      {
        question: "舊照片經 AI 處理後可以用嗎？",
        answer:
          "許多規定要求近期照片（如六個月內）。即使 AI 改善畫質，拍攝日期仍可能受審核。",
      },
      {
        question: "數碼提交與沖印要求是否相同？",
        answer:
          "尺寸及背景要求通常一致，但數碼提交可能另有像素、檔案格式及大小限制。",
      },
    ],
  },
  bottomCta: {
    title: "了解要求，準備你的護照相",
    subtitle: "上傳自拍，免費預覽 AI 處理效果，按官方規格調整後下載。",
    button: "免費預覽證件相",
  },
  relatedPages: [
    { slug: "passport-photo-size", label: "護照相尺寸" },
    { slug: "passport-photo-at-home", label: "在家拍護照相" },
    { slug: "passport-photo-with-phone", label: "手機拍護照相" },
    { slug: "visa-photo", label: "簽證相製作" },
  ],
  relatedPagesTitle: "相關指南",
  footer: footerZhTw,
};
