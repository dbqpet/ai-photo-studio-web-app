import type { SeoPageContent } from "@/lib/seo/types";
import { footerZhTw } from "@/lib/seo/content/cn/shared";

export const passportPhotoWithPhoneZhTw: SeoPageContent = {
  slug: "passport-photo-with-phone",
  meta: {
    title: "用手機自己影護照相｜普通自拍變正式證件相｜AI Images Studio",
    description:
      "用手機拍護照相實用指南：鏡頭位置、光線設定、拍攝距離及常見錯誤。上傳後用 AI 去除背景、調整尺寸，製作正式證件相。",
    keywords: [
      "手機護照相",
      "手機拍證件相",
      "iPhone護照相",
      "手機自拍證件相",
      "手機證件相",
      "智能手機護照相",
    ],
    htmlLang: "zh-Hant",
    locale: "zh_TW",
  },
  nav: { headerCta: "免費預覽證件相" },
  hero: {
    title: "用手機自己影護照相：由普通自拍製作正式證件相",
    subtitle:
      "你的手機已是功能強大的相機。本指南教你設定鏡頭、光線及距離，拍出適合作為護照相起點的人像，再用 AI 工具處理成正式證件相。",
    primaryCta: "免費預覽證件相",
    secondaryCta: "手機設定技巧",
    secondaryTargetId: "setup",
  },
  sections: [
    {
      type: "prose",
      title: "手機已足夠拍攝原始人像",
      paragraphs: [
        "護照及證件申請重視清晰度、光線及構圖，而非相機品牌。現代手機的解像度已超越頭肩人像所需，只要遵循幾個簡單設定。",
        "手機負責拍攝，AI Images Studio 負責後期——背景清理、尺寸裁剪及可沖印輸出。",
      ],
    },
    {
      type: "prose",
      id: "setup",
      title: "手機位置與拍攝距離",
      bullets: [
        "將手機置於眼平高度——用三腳架、書本或請人代持",
        "與相機保持約 1–1.5 米距離，取得自然頭肩構圖",
        "優先使用後置鏡頭，畫質通常優於前置自拍鏡頭",
        "開啟相機格線，保持面部居中",
        "使用定時器或遙控快門，避免手臂長度造成的廣角畸變",
      ],
    },
    {
      type: "prose",
      title: "光線與背景",
      subsections: [
        {
          title: "光線",
          bullets: [
            "日間面向窗戶，取得柔和均勻光線",
            "夜間室內可用兩盞燈以 45° 角照射",
            "避免正上方頂燈造成鼻影",
            "若他人代拍，注意螢幕反光",
          ],
        },
        {
          title: "背景",
          bullets: [
            "純色牆面最佳",
            "背景雜亂仍可後期處理，但簡單背景效果更好",
            "避免使用數位背景模糊，可能顯得不自然",
          ],
        },
      ],
    },
    {
      type: "steps",
      title: "從手機拍攝到可沖印護照相",
      items: [
        {
          title: "拍攝 10–15 張自然表情照片",
          description: "選最清晰的一張，雙眼睜開、頭部正直。",
        },
        {
          title: "傳送照片（如需要）",
          description:
            "AirDrop、雲端同步或電郵至電腦，或直接在手機瀏覽器上傳至 aiimagesstudio.com。",
        },
        {
          title: "上傳至 AI Images Studio",
          description: "選擇最佳人像，工具支援手機瀏覽器，無需安裝 App。",
        },
        {
          title: "選擇尺寸、裁剪及處理",
          description: "套用護照相預設，調整裁剪框，讓 AI 清理背景及光線。",
        },
        {
          title: "下載或沖印",
          description: "儲存高解像檔或 4R 排版，在家列印或到相舖沖印。",
        },
      ],
    },
    {
      type: "prose",
      title: "常見手機拍攝錯誤",
      bullets: [
        "手機位置過低或過高，造成不理想的拍攝角度",
        "距離太近，廣角鏡頭使面部變寬",
        "使用美顏模式使皮膚過度平滑",
        "裁切掉頭頂或肩部",
        "提交截圖而非原始影像檔",
      ],
    },
    {
      type: "solution",
      title: "拍攝後——在線處理證件相",
      paragraphs: ["取得合格手機人像後，AI Images Studio 接手："],
      bullets: [
        "背景去除，呈現護照風格純色背景",
        "光線優化，減少陰影",
        "對齊官方尺寸預設的裁剪工具",
        "可下載 4R 多張排版供沖印",
      ],
    },
    {
      type: "disclaimer",
      title: "提交前請核對",
      paragraphs: [
        "手機拍攝方便靈活，但各申請項目的護照相規定不同。提交前請查閱官方指引。",
      ],
      links: [
        { href: "/zh/passport-photo-requirements", label: "護照相要求" },
        { href: "/zh/passport-photo-at-home", label: "在家拍護照相" },
      ],
    },
  ],
  faq: {
    title: "手機護照相常見問題",
    items: [
      {
        question: "前置還是後置鏡頭？",
        answer:
          "後置鏡頭通常更清晰、畸變更少。若必須用前置，拉遠距離並使用定時器。",
      },
      {
        question: "可以全程用手機完成嗎？",
        answer:
          "可以。在手機瀏覽器開啟 aiimagesstudio.com，上傳照片並直接下載結果。",
      },
      {
        question: "應上傳什麼格式？",
        answer:
          "支援 JPEG、PNG 及 WebP。盡量使用相簿原始檔，避免通訊 App 壓縮後的版本。",
      },
    ],
  },
  bottomCta: {
    title: "手機照片已準備好？",
    subtitle: "立即上傳，免費預覽 AI 處理後的護照相效果。",
    button: "免費預覽證件相",
  },
  relatedPages: [
    { slug: "passport-photo-at-home", label: "在家拍護照相" },
    { slug: "id-photo-maker", label: "AI 證件相製作" },
    { slug: "passport-photo-size", label: "護照相尺寸" },
    { slug: "4r-id-photo", label: "4R 證件相排版" },
  ],
  relatedPagesTitle: "相關指南",
  footer: footerZhTw,
};
