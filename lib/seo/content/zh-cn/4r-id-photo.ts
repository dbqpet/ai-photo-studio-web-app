import type { SeoPageContent } from "@/lib/seo/types";
import { footerZhCn } from "@/lib/seo/content/cn/shared";

export const fourRIdPhotoZhCn: SeoPageContent = {
  slug: "4r-id-photo",
  meta: {
    title: "4R证件照｜证件照自制4R打印排版｜AI Images Studio",
    description:
      "用普通自拍制作4R证件照打印排版。AI Images Studio 可自动去除背景、调整尺寸，并将多张证件照排版至一张4R相纸，方便在家或照相馆打印。",
    keywords: [
      "4R证件照",
      "证件照打印",
      "4R排版",
      "证件照自制",
      "4R打印",
      "证件照4R",
    ],
    htmlLang: "zh-Hans",
    locale: "zh_CN",
  },
  nav: { headerCta: "免费预览证件照" },
  hero: {
    title: "4R证件照：自己制作4R证件照打印排版",
    subtitle:
      "不少申请仍需要实体证件照，一次申请往往要准备多张相同尺寸。从手机自拍出发，AI 帮你处理背景与尺寸，再自动排版至标准 4R 相纸，一次打印多张，省时又省钱。",
    primaryCta: "免费预览证件照",
    secondaryCta: "了解4R排版流程",
    secondaryTargetId: "workflow",
  },
  sections: [
    {
      type: "prose",
      title: "什么是4R证件照排版？",
      image: {
        src: "/images/4r_layout_illustration_1.png",
        alt: "4R 相纸上排版六张证件照的示意图",
        caption: "一张 4R 相纸排版 6 张证件照，方便裁剪",
        layout: "aside",
      },
      paragraphs: [
        "4R 是常见的冲印尺寸，约 4×6 英寸（102×152 mm），便利店自助打印机、照相馆及网上冲印大多支持此规格。",
        "与单张证件照文件不同，4R 排版会将同一尺寸的多张证件照排列在一张相纸上，打印后再沿边裁剪，比逐张冲印更划算。",
      ],
      bullets: [
        "一张 4R 相纸可排版多张 35×45 mm、40×50 mm 或 2×2 英寸证件照",
        "适合护照、签证、回乡证及一般证件用途",
        "可在家用相纸打印，或带文件到照相馆冲印",
      ],
    },
    {
      type: "steps",
      id: "workflow",
      title: "4R证件照制作流程",
      items: [
        {
          title: "普通自拍",
          description:
            "用手机在光线充足、背景简单的地方拍摄正面人像，保留头顶及双肩，表情自然。",
        },
        {
          title: "AI 证件照处理",
          description:
            "上传至 AI Images Studio，自动去除背景、平衡光线，并选择所需证件照尺寸预设。",
        },
        {
          title: "4R 自动排版",
          description:
            "选择 4R 排版功能，预览多张证件照在相纸上的排列与间距，确认后再下载。",
        },
        {
          title: "打印/下载",
          description:
            "下载高分辨率排版文件，在家打印或使用便利店打印机冲印，裁剪后即可使用。",
        },
      ],
    },
    {
      type: "features",
      title: "4R 排版的好处",
      items: [
        {
          icon: "📄",
          title: "一次打印多张",
          description: "同一申请常需 2–4 张相同证件照，4R 排版可一次完成。",
        },
        {
          icon: "💰",
          title: "节省冲印费用",
          description: "比逐张在照相馆冲印更经济，尤其家庭多人同时申请时。",
        },
        {
          icon: "📐",
          title: "尺寸预设齐全",
          description: "支持常见护照、签证及证件尺寸，减少手动裁剪误差。",
        },
        {
          icon: "🖨️",
          title: "高分辨率输出",
          description: "以适合冲印的分辨率输出，确保打印后清晰锐利。",
        },
      ],
    },
    {
      type: "prose",
      title: "在家打印 vs 照相馆冲印",
      image: {
        src: "/images/4r_layout_illustration_2.png",
        alt: "手机即时预览 4R 排版并轻松打印的示意图",
        caption: "手机即时预览排版效果，下载后即可在家或便利店轻松打印",
        layout: "below",
      },
      subsections: [
        {
          title: "在家打印",
          bullets: [
            "需使用相纸及支持照片打印的喷墨机",
            "打印时关闭「缩放至页面」选项",
            "打印后待墨水干透再裁剪，避免弄脏",
          ],
        },
        {
          title: "照相馆或便利店冲印",
          bullets: [
            "色彩及锐度通常较家用机稳定",
            "可通过手机 App 或 USB 上传 4R 排版文件",
            "单次费用低，适合不常打印的家庭",
          ],
        },
      ],
    },
    {
      type: "disclaimer",
      title: "尺寸提示",
      paragraphs: [
        "实际打印尺寸可能因打印机边距或复印机设置而略有偏差，建议先打印一张测试，用尺测量后再批量冲印。",
        "AI Images Studio 提供排版工具协助准备证件照，但不保证每台设备的输出完全符合各机构的毫米级要求，提交前请查阅官方指引。",
      ],
      links: [
        { href: "/zh-cn/passport-photo-size", label: "护照照片尺寸指南" },
        { href: "/zh-cn/id-photo-maker", label: "AI 证件照制作" },
      ],
    },
  ],
  faq: {
    title: "4R 证件照常见问题",
    items: [
      {
        question: "打印机上应选择什么纸张尺寸？",
        answer:
          "选择 4×6 英寸、4R 或 10×15 cm——各地命名不同，但尺寸相同。",
      },
      {
        question: "一张 4R 可排版几张证件照？",
        answer:
          "视证件照尺寸而定，常见 35×45 mm 规格通常可排版 6–8 张，实际数量以预览为准。",
      },
      {
        question: "需要 300 DPI 吗？",
        answer:
          "300 DPI 是冲印证件照的常用标准，AI Images Studio 输出高分辨率文件，适合照片冲印。",
      },
      {
        question: "可以混排不同尺寸吗？",
        answer:
          "4R 排版针对同一尺寸重复排列，如需不同尺寸请分别制作排版文件。",
      },
    ],
  },
  bottomCta: {
    title: "准备好制作 4R 证件照排版？",
    subtitle: "上传自拍，预览 4R 多张排版效果，满意后再下载冲印。",
    button: "免费预览证件照",
  },
  relatedPages: [
    { slug: "id-photo-print", label: "证件照打印" },
    { slug: "id-photo-maker", label: "AI 证件照制作" },
    { slug: "passport-photo-size", label: "护照照片尺寸指南" },
    { slug: "passport-photo-at-home", label: "在家制作护照照片" },
  ],
  relatedPagesTitle: "相关指南",
  footer: footerZhCn,
};
