import type { SeoPageContent } from "@/lib/seo/types";
import { footerZhTw } from "@/lib/seo/content/cn/shared";

export const idPhotoMakerZhTw: SeoPageContent = {
  slug: "id-photo-maker",
  meta: {
    title: "AI證件相製作｜在線生成專業證件相",
    description:
      "用 AI 將普通自拍變成專業證件相。自動去除背景、調整光線與尺寸，適合員工證、學生證、簽證及一般證件申請，免費預覽效果。",
    keywords: [
      "AI證件相",
      "證件相製作",
      "在線證件相",
      "證件相生成",
      "專業證件相",
      "證件相編輯",
    ],
    htmlLang: "zh-Hant",
    locale: "zh_TW",
  },
  nav: { headerCta: "免費預覽證件相" },
  hero: {
    title: "AI證件相製作：普通自拍變專業證件相",
    subtitle:
      "員工證、學生證、會員卡及網上身份驗證都需要清晰、背景乾淨的證件相。無需到相舖，上傳一張日常自拍，AI 幫你處理背景、光線與裁剪。",
    primaryCta: "免費預覽證件相",
    secondaryCta: "查看前後對比",
    secondaryTargetId: "before-after",
  },
  sections: [
    {
      type: "prose",
      title: "證件相與普通自拍的差別",
      paragraphs: [
        "證件相的目的是清楚辨認你的樣貌，而非展示生活場景。通常需要純色背景、均勻光線、正面凝視，以及包含面部及上肩的構圖。",
        "普通自拍常因濾鏡、斜角、雜亂背景或陰影而不適合證件用途。即使機構沒有嚴格規定，一張乾淨的證件相在證件及網上驗證時都更專業。",
      ],
    },
    {
      type: "prose",
      title: "常見證件相用途",
      bullets: [
        "公司員工證及外判人員證",
        "大學及中小學學生證",
        "專業牌照及資格申請",
        "會員卡及門禁系統",
        "網上身份驗證及 KYC 流程",
        "內部人事檔案及通訊錄",
      ],
    },
    {
      type: "beforeAfter",
      id: "before-after",
      title: "AI 處理前後的變化",
      beforeTitle: "一般自拍",
      afterTitle: "處理後證件相",
      before: [
        "背景雜亂或有顏色",
        "面部一側有明顯陰影",
        "頭部微側或構圖偏離中心",
        "裁剪不當，肩部被截斷",
      ],
      after: [
        "純色、中性背景",
        "面部光線均勻平衡",
        "正面構圖，適合證件用途",
        "一致裁剪，縮小列印仍清晰",
      ],
    },
    {
      type: "features",
      title: "AI Images Studio 如何處理證件相",
      items: [
        {
          icon: "✂️",
          title: "AI 背景去除",
          description: "將雜亂環境替換為適合證件相的純色背景。",
        },
        {
          icon: "💡",
          title: "光線平衡",
          description: "改善曝光，確保縮小列印時面部細節仍清晰可見。",
        },
        {
          icon: "👤",
          title: "保留真實樣貌",
          description: "專注於清理而非改變五官，確保仍像本人。",
        },
        {
          icon: "📐",
          title: "多種尺寸預設",
          description: "支援常見護照、簽證及證件尺寸，亦可自訂毫米數值。",
        },
      ],
    },
    {
      type: "steps",
      title: "四步完成證件相",
      items: [
        {
          title: "上傳正面人像",
          description: "使用近期、面部清晰的照片，避免團體照或重度濾鏡。",
        },
        {
          title: "選擇所需尺寸",
          description: "選擇符合機構要求的預設，或輸入自訂寬高。",
        },
        {
          title: "調整裁剪並預覽",
          description: "微調頭部位置，確認背景乾淨、構圖合適。",
        },
        {
          title: "下載數碼檔或排版檔",
          description: "取得高解像檔用於網上提交，或 4R 排版用於實體沖印。",
        },
      ],
    },
    {
      type: "disclaimer",
      title: "請查閱機構要求",
      paragraphs: [
        "僱主、學校及牌照機構有時會訂明證件相規格。AI Images Studio 協助製作專業影像，但提交前請確認尺寸、背景顏色及檔案格式是否符合要求。",
      ],
      links: [
        { href: "/zh/passport-photo-requirements", label: "護照相要求指南" },
        { href: "/zh/4r-id-photo", label: "4R 證件相排版" },
      ],
    },
  ],
  faq: {
    title: "AI 證件相常見問題",
    items: [
      {
        question: "證件相與護照相是否相同？",
        answer:
          "風格相似（純色背景、清晰面部），但要求因用途而異。護照申請通常有嚴格政府規定；內部員工證可能較寬鬆。",
      },
      {
        question: "一張照片可用於多個申請嗎？",
        answer:
          "若尺寸及風格符合各機構要求，有時可以。如有疑問，建議按各規格分別裁剪。",
      },
      {
        question: "輸出是什麼格式？",
        answer: "可下載高解像 JPEG，適合沖印及大部分網上提交。",
      },
    ],
  },
  bottomCta: {
    title: "今日就需要證件相？",
    subtitle: "上傳自拍，免費預覽 AI 處理效果，滿意後再下載。",
    button: "免費預覽證件相",
  },
  relatedPages: [
    { slug: "4r-id-photo", label: "4R 證件相排版" },
    { slug: "passport-photo-at-home", label: "在家製作護照相" },
    { slug: "passport-photo-with-phone", label: "手機拍護照相" },
    { slug: "id-photo-print", label: "證件相打印／列印" },
  ],
  relatedPagesTitle: "相關指南",
  footer: footerZhTw,
};
