import type { SeoPageContent } from "@/lib/seo/types";
import { footerZhCn } from "@/lib/seo/content/cn/shared";

export const visaPhotoZhCn: SeoPageContent = {
  slug: "visa-photo",
  meta: {
    title: "签证照片制作｜在线生成签证照片｜AI Images Studio",
    description:
      "在线制作签证照片：从普通自拍生成背景干净、尺寸正确的签证照片。支持申根、美国、英国等常见格式，免费预览效果。",
    keywords: [
      "签证照片",
      "签证照",
      "签证照片制作",
      "在线签证照片",
      "申根签证照片",
      "签证申请照片",
    ],
    htmlLang: "zh-Hans",
    locale: "zh_CN",
  },
  nav: { headerCta: "免费预览证件照" },
  hero: {
    title: "签证照片制作：在线生成签证照片",
    subtitle:
      "签证申请通常需要近期、背景纯色的证件照，且尺寸因目的地而异。AI Images Studio 协助你从普通照片出发，制作干净的签证照片——提交前请核对目的地官方规定。",
    primaryCta: "免费预览证件照",
    secondaryCta: "为何签证照片较复杂",
    secondaryTargetId: "why-difficult",
  },
  sections: [
    {
      type: "prose",
      id: "why-difficult",
      title: "签证照片为何较复杂",
      paragraphs: [
        "每个目的地国家订有自己的签证照片标准。尺寸、背景颜色、头部比例，乃至数码或纸质提交方式，在申根、美国、英国、加拿大等类别之间都可能不同。",
        "申请人常在后期才发现细节——已拍了休闲照或付了照相馆却用错尺寸。灵活的在线流程让你重新裁剪及输出，无需再拍一次。",
      ],
      bullets: [
        "不同宽×高要求（35×45 mm、2×2 英寸、33×48 mm 等）",
        "背景可能须为白、米白或浅灰",
        "部分领事馆拒绝有阴影、眼镜反光或头部比例不符的照片",
        "数码上传可能有最低分辨率或文件大小限制",
      ],
    },
    {
      type: "prose",
      title: "请先查阅官方要求",
      paragraphs: [
        "提交任何签证申请前，请阅读目的地大使馆、领事馆或官方签证平台的照片指引。要求可能更新，第三方摘要可能过时。",
        "AI Images Studio 是准备工具——协助制作背景干净、光线平衡、尺寸正确的人像，但不保证签证获批或符合所有国家规定。",
      ],
    },
    {
      type: "steps",
      title: "在线准备签证照片",
      items: [
        {
          title: "确认目的地照片规格",
          description: "记下所需尺寸、背景颜色，以及须冲印或数码上传。",
        },
        {
          title: "上传合适人像",
          description: "使用近期正面照片，光线均匀，无滤镜。",
        },
        {
          title: "套用匹配的尺寸预设",
          description: "选择 35×45 mm、2×2 英寸等预设，调整裁剪。",
        },
        {
          title: "检查背景及面部位置",
          description: "确保背景纯净，面部居中，头顶留适当空间。",
        },
        {
          title: "按官方指示下载及提交",
          description: "如需冲印则用相纸，否则直接上传数码文件至签证平台。",
        },
      ],
    },
    {
      type: "features",
      title: "协助准备签证照片的工具",
      items: [
        {
          icon: "🌍",
          title: "多种尺寸预设",
          description: "切换常见国际格式，无需重拍原始人像。",
        },
        {
          icon: "🧹",
          title: "背景清理",
          description: "去除家居杂物，替换为纯色背景。",
        },
        {
          icon: "🔆",
          title: "光线平衡",
          description: "减少阴影，降低被拒风险。",
        },
        {
          icon: "🖨️",
          title: "可冲印输出",
          description: "输出高分辨率文件或 4R 排版，供须实体照片的申请使用。",
        },
      ],
    },
    {
      type: "disclaimer",
      title: "免责声明",
      paragraphs: [
        "签证结果取决于多方面因素，照片只是其中之一。AI Images Studio 不提供移民建议，亦不保证任何领事馆必然接受处理后的影像。",
        "请以政府及大使馆官方来源为照片要求的最终权威。",
      ],
      links: [
        { href: "/zh-cn/passport-photo-size", label: "证件照尺寸指南" },
        { href: "/zh-cn/id-photo-print", label: "证件照冲印" },
      ],
    },
  ],
  faq: {
    title: "签证照片常见问题",
    items: [
      {
        question: "申根与美国签证照片尺寸相同吗？",
        answer:
          "不同。申根常用 35×45 mm，美国签证通常为 2×2 英寸（51×51 mm）。请确认你的申请规格。",
      },
      {
        question: "可以用旧照片经 AI 处理吗？",
        answer:
          "许多规定要求六个月内拍摄。即使 AI 改善画质，拍摄日期仍可能受审核。",
      },
      {
        question: "应冲印还是数码上传？",
        answer:
          "视签证平台而定。部分只接受数码上传，部分须附冲印本。请按官方提交方式。",
      },
      {
        question: "背景必须是白色吗？",
        answer:
          "多数要求白色或浅色，但部分指定米白或浅灰。查阅目的地官方规格。",
      },
    ],
  },
  bottomCta: {
    title: "准备签证申请照片？",
    subtitle: "上传人像，免费预览 AI 处理效果，按目的地规格调整。",
    button: "免费预览证件照",
  },
  relatedPages: [
    { slug: "passport-photo-size", label: "护照照片尺寸" },
    { slug: "passport-photo-requirements", label: "护照照片要求" },
    { slug: "id-photo-maker", label: "AI 证件照制作" },
    { slug: "4r-id-photo", label: "4R 证件照排版" },
  ],
  relatedPagesTitle: "相关指南",
  footer: footerZhCn,
};
