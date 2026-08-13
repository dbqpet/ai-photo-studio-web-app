import type { SeoPageContent } from "@/lib/seo/types";
import { footerZhCn } from "@/lib/seo/content/cn/shared";

export const passportPhotoSizeZhCn: SeoPageContent = {
  slug: "passport-photo-size",
  meta: {
    title: "护照照片尺寸与证件照尺寸｜常见规格一览｜AI Images Studio",
    description:
      "护照照片及证件照常见尺寸指南：35×45 mm、2×2 英寸、33×48 mm 等规格说明，以及如何选择正确尺寸并用 AI 工具裁剪。",
    keywords: [
      "护照照片尺寸",
      "证件照尺寸",
      "35x45mm",
      "2x2英寸",
      "护照照片大小",
      "证件照规格",
    ],
    htmlLang: "zh-Hans",
    locale: "zh_CN",
  },
  nav: { headerCta: "免费预览证件照" },
  hero: {
    title: "护照照片尺寸与证件照尺寸：常见规格与注意事项",
    subtitle:
      "不同国家及用途的证件照尺寸各异——毫米、英寸及像素要求都可能不同。了解常见规格，再选择正确预设裁剪，避免因尺寸不符而需重拍。",
    primaryCta: "免费预览证件照",
    secondaryCta: "常见尺寸一览",
    secondaryTargetId: "common-sizes",
  },
  sections: [
    {
      type: "prose",
      id: "common-sizes",
      title: "常见护照照片及证件照尺寸",
      paragraphs: [
        "证件照尺寸通常以毫米或英寸标示，部分数码提交还会订明像素或文件大小。以下是最常见的规格，但各机构可能略有调整。",
      ],
      bullets: [
        "35×45 mm——欧盟申根签证、香港护照及多国签证常用",
        "33×48 mm——部分亚洲国家护照及签证（含中国护照常用规格）",
      ],
    },
    {
      type: "prose",
      title: "尺寸之外还须注意什么？",
      subsections: [
        {
          title: "头部比例",
          paragraphs: [
            "许多规格要求面部（下巴至头顶）占照片高度的特定比例，通常约 70–80%。裁剪时需保留适当的头顶及下巴空间。",
          ],
        },
        {
          title: "数码 vs 实体",
          bullets: [
            "数码提交可能要求特定像素（如 600×600 px）及文件大小上限",
            "实体冲印需以毫米尺寸为准，打印分辨率通常 300 DPI",
            "同一申请可能同时需要数码文件及冲印本",
          ],
        },
        {
          title: "背景及边距",
          bullets: [
            "部分规格要求背景延伸至照片边缘，不可有白边",
            "裁剪框应对齐面部中心，避免头部偏上或偏下",
          ],
        },
      ],
    },
    {
      type: "features",
      title: "如何用 AI Images Studio 选择正确尺寸",
      items: [
        {
          icon: "📐",
          title: "多种预设",
          description: "内置 35×45 mm、2×2 英寸等常见预设，一键切换。",
        },
        {
          icon: "🔧",
          title: "自定义毫米",
          description: "若机构有特定尺寸，可输入自定义宽高。",
        },
        {
          icon: "👁️",
          title: "即时预览",
          description: "调整裁剪框时即时查看面部比例是否合适。",
        },
        {
          icon: "🖨️",
          title: "4R 排版",
          description: "确认尺寸后可生成 4R 多张排版，方便冲印。",
        },
      ],
    },
    {
      type: "steps",
      title: "按尺寸制作证件照",
      items: [
        {
          title: "查阅官方尺寸要求",
          description: "在申请表或政府网站确认所需毫米、英寸或像素规格。",
        },
        {
          title: "上传正面人像",
          description: "使用光线均匀、背景简单的近期照片。",
        },
        {
          title: "选择或输入尺寸",
          description: "选择匹配的预设，或输入自定义毫米数值。",
        },
        {
          title: "调整裁剪并预览",
          description: "确保面部居中、头顶及下巴空间符合比例要求。",
        },
        {
          title: "下载或排版冲印",
          description: "取得数码文件或 4R 排版文件，按申请方式提交。",
        },
      ],
    },
    {
      type: "disclaimer",
      title: "以官方规格为准",
      paragraphs: [
        "本文列出常见尺寸作参考，各国及机构要求可能更新或存在特殊规定。提交前请以你申请项目的官方指引为最终依据。",
        "AI Images Studio 提供尺寸预设及裁剪工具，但不保证输出符合所有机构的毫米级或像素级要求。",
      ],
      links: [
        { href: "/zh-cn/passport-photo-requirements", label: "护照照片要求" },
        { href: "/zh-cn/4r-id-photo", label: "4R 证件照排版" },
      ],
    },
  ],
  faq: {
    title: "护照照片尺寸常见问题",
    items: [
      {
        question: "35×45 mm 与 2×2 英寸是否相同？",
        answer:
          "不同。35×45 mm 约 1.38×1.77 英寸，2×2 英寸为 51×51 mm 正方形。请按申请要求选择。",
      },
      {
        question: "可以用厘米代替毫米吗？",
        answer:
          "3.5×4.5 cm 等同 35×45 mm。打印时注意单位换算，避免选错纸张设置。",
      },
      {
        question: "数码提交需要多少像素？",
        answer:
          "各平台要求不同，常见最低 600×600 px 或 1200×1200 px。查阅申请网站的技术规格。",
      },
    ],
  },
  bottomCta: {
    title: "已知所需尺寸？",
    subtitle: "上传照片，选择预设，免费预览裁剪效果。",
    button: "免费预览证件照",
  },
  relatedPages: [
    { slug: "passport-photo-requirements", label: "护照照片要求" },
    { slug: "4r-id-photo", label: "4R 证件照排版" },
    { slug: "id-photo-maker", label: "AI 证件照制作" },
    { slug: "visa-photo", label: "签证照片制作" },
  ],
  relatedPagesTitle: "相关指南",
  footer: footerZhCn,
};
