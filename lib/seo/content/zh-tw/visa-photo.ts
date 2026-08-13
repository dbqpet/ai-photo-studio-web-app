import type { SeoPageContent } from "@/lib/seo/types";
import { footerZhTw } from "@/lib/seo/content/cn/shared";

export const visaPhotoZhTw: SeoPageContent = {
  slug: "visa-photo",
  meta: {
    title: "簽證相製作｜在線生成簽證照片｜AI Images Studio",
    description:
      "在線製作簽證相：從普通自拍生成背景乾淨、尺寸正確的簽證照片。支援申根、美國、英國等常見格式，免費預覽效果。",
    keywords: [
      "簽證相",
      "簽證照片",
      "簽證相製作",
      "在線簽證相",
      "申根簽證相",
      "簽證申請照片",
    ],
    htmlLang: "zh-Hant",
    locale: "zh_TW",
  },
  nav: { headerCta: "免費預覽證件相" },
  hero: {
    title: "簽證相製作：在線生成簽證照片",
    subtitle:
      "簽證申請通常需要近期、背景純色的證件相，且尺寸因目的地而異。AI Images Studio 協助你從普通照片出發，製作乾淨的簽證相——提交前請核對目的地官方規定。",
    primaryCta: "免費預覽證件相",
    secondaryCta: "為何簽證相較複雜",
    secondaryTargetId: "why-difficult",
  },
  sections: [
    {
      type: "prose",
      id: "why-difficult",
      title: "簽證相為何較複雜",
      paragraphs: [
        "每個目的地國家訂有自己的簽證相標準。尺寸、背景顏色、頭部比例，乃至數碼或紙本提交方式，在申根、美國、英國、加拿大等類別之間都可能不同。",
        "申請人常在後期才發現細節——已拍了休閒照或付了影相舖卻用錯尺寸。靈活的在線流程讓你重新裁剪及輸出，無需再拍一次。",
      ],
      bullets: [
        "不同寬×高要求（35×45 mm、2×2 英寸、33×48 mm 等）",
        "背景可能須為白、米白或淺灰",
        "部分領事館拒絕有陰影、眼鏡反光或頭部比例不符的照片",
        "數碼上傳可能有最低解像度或檔案大小限制",
      ],
    },
    {
      type: "prose",
      title: "請先查閱官方要求",
      paragraphs: [
        "提交任何簽證申請前，請閱讀目的地大使館、領事館或官方簽證平台的相片指引。要求可能更新，第三方摘要可能過時。",
        "AI Images Studio 是準備工具——協助製作背景乾淨、光線平衡、尺寸正確的人像，但不保證簽證獲批或符合所有國家規定。",
      ],
    },
    {
      type: "steps",
      title: "在線準備簽證相",
      items: [
        {
          title: "確認目的地相片規格",
          description: "記下所需尺寸、背景顏色，以及須沖印或數碼上傳。",
        },
        {
          title: "上傳合適人像",
          description: "使用近期正面照片，光線均勻，無濾鏡。",
        },
        {
          title: "套用匹配的尺寸預設",
          description: "選擇 35×45 mm、2×2 英寸等預設，調整裁剪。",
        },
        {
          title: "檢查背景及面部位置",
          description: "確保背景純淨，面部居中，頭頂留適當空間。",
        },
        {
          title: "按官方指示下載及提交",
          description: "如需沖印則用相片紙，否則直接上傳數碼檔至簽證平台。",
        },
      ],
    },
    {
      type: "features",
      title: "協助準備簽證相的工具",
      items: [
        {
          icon: "🌍",
          title: "多種尺寸預設",
          description: "切換常見國際格式，無需重拍原始人像。",
        },
        {
          icon: "🧹",
          title: "背景清理",
          description: "去除家居雜物，替換為純色背景。",
        },
        {
          icon: "🔆",
          title: "光線平衡",
          description: "減少陰影，降低被拒風險。",
        },
        {
          icon: "🖨️",
          title: "可沖印輸出",
          description: "輸出高解像檔或 4R 排版，供須實體照片的申請使用。",
        },
      ],
    },
    {
      type: "disclaimer",
      title: "免責聲明",
      paragraphs: [
        "簽證結果取決於多方面因素，相片只是其中之一。AI Images Studio 不提供移民建議，亦不保證任何領事館必然接受處理後的影像。",
        "請以政府及大使館官方來源為相片要求的最終權威。",
      ],
      links: [
        { href: "/zh/passport-photo-size", label: "證件相尺寸指南" },
        { href: "/zh/id-photo-print", label: "證件相沖印" },
      ],
    },
  ],
  faq: {
    title: "簽證相常見問題",
    items: [
      {
        question: "申根與美國簽證相尺寸相同嗎？",
        answer:
          "不同。申根常用 35×45 mm，美國簽證通常為 2×2 英寸（51×51 mm）。請確認你的申請規格。",
      },
      {
        question: "可以用舊照片經 AI 處理嗎？",
        answer:
          "許多規定要求六個月內拍攝。即使 AI 改善畫質，拍攝日期仍可能受審核。",
      },
      {
        question: "應沖印還是數碼上傳？",
        answer:
          "視簽證平台而定。部分只接受數碼上傳，部分須附沖印本。請按官方提交方式。",
      },
      {
        question: "背景必須是白色嗎？",
        answer:
          "多數要求白色或淺色，但部分指定米白或淺灰。查閱目的地官方規格。",
      },
    ],
  },
  bottomCta: {
    title: "準備簽證申請照片？",
    subtitle: "上傳人像，免費預覽 AI 處理效果，按目的地規格調整。",
    button: "免費預覽證件相",
  },
  relatedPages: [
    { slug: "passport-photo-size", label: "護照相尺寸" },
    { slug: "passport-photo-requirements", label: "護照相要求" },
    { slug: "id-photo-maker", label: "AI 證件相製作" },
    { slug: "4r-id-photo", label: "4R 證件相排版" },
  ],
  relatedPagesTitle: "相關指南",
  footer: footerZhTw,
};
