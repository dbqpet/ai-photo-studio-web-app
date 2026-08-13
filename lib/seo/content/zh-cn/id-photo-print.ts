import type { SeoPageContent } from "@/lib/seo/types";
import { footerZhCn } from "@/lib/seo/content/cn/shared";

export const idPhotoPrintZhCn: SeoPageContent = {
  slug: "id-photo-print",
  meta: {
    title: "证件照打印｜自己制作可打印的证件照｜AI Images Studio",
    description:
      "自己制作可打印的证件照排版。将多张证件照排列至 4R 相纸，在家打印或到照相馆冲印，一次取得多张相同尺寸副本。",
    keywords: [
      "证件照打印",
      "打印证件照",
      "4R证件照",
      "可打印证件照",
      "证件照冲印",
      "证件照排版",
    ],
    htmlLang: "zh-Hans",
    locale: "zh_CN",
  },
  nav: { headerCta: "免费预览证件照" },
  hero: {
    title: "证件照打印：自己制作可打印的证件照",
    subtitle:
      "数码文件方便上传，但不少申请仍需要实体证件照，家庭亦常需多张相同副本。了解如何准备照片，并将多张排版至标准 4R 相纸一次冲印。",
    primaryCta: "免费预览证件照",
    secondaryCta: "为何需要排版",
    secondaryTargetId: "why-print",
  },
  sections: [
    {
      type: "prose",
      id: "why-print",
      title: "数码文件 vs 可打印证件照",
      paragraphs: [
        "部分领事馆及政府平台只接受数码上传，另一些则要求将冲印本附于表格或带至面试。",
        "即使数码文件已足够，备有冲印本仍有用——备用表格、续期提醒，或家人同时申请时。",
      ],
    },
    {
      type: "prose",
      title: "为何将多张排版至一张相纸？",
      bullets: [
        "一次 4R 冲印取得多张相同证件照，比逐张更划算",
        "减低其中一张弄污或表格需两张时的困扰",
        "多位家人可从一次冲印取得各自副本",
        "便利店及照相馆普遍支持 4R 尺寸",
      ],
    },
    {
      type: "prose",
      title: "什么是 4R 打印排版？",
      paragraphs: [
        "4R 指约 4×6 英寸（102×152 mm）的标准冲印尺寸，自助打印机、便利店及网上冲印服务广泛支持。",
        "AI Images Studio 可将多张证件照排列于一张 4R 版面，冲印后用剪刀或裁纸刀裁剪。",
      ],
      bullets: [
        "一张 4R → 多张护照尺寸证件照",
        "支持 35×45 mm、40×50 mm、2×2 英寸等常见预设",
        "适合香港、欧洲、美国及一般证件格式",
      ],
    },
    {
      type: "steps",
      title: "制作及打印证件照排版",
      items: [
        {
          title: "准备原始人像",
          description:
            "上传清晰照片至 AI Images Studio，去除背景并选择目标尺寸预设。",
        },
        {
          title: "生成 4R 排版",
          description: "选择排版功能，将多张副本排列于一张 4R 页面，下载前预览间距。",
        },
        {
          title: "下载高分辨率排版文件",
          description: "以完整冲印分辨率保存，通常 300 DPI 以确保清晰。",
        },
        {
          title: "在家或照相馆冲印",
          description:
            "在家：用相纸及最高品质设置。照相馆：通过 USB、App 或网上传送文件至打印机。",
        },
        {
          title: "裁剪及核对",
          description: "小心裁剪每张照片，用尺测量后再批量冲印。",
        },
      ],
    },
    {
      type: "prose",
      title: "在家打印 vs 照相馆冲印",
      subsections: [
        {
          title: "在家打印",
          bullets: [
            "已有照片喷墨机时最快捷",
            "使用光面或哑面相纸，非普通复印纸",
            "打印对话框关闭「缩放至页面」",
            "待墨水干透再裁剪",
          ],
        },
        {
          title: "照相馆或便利店",
          bullets: [
            "色彩及锐度通常较家用机稳定",
            "可带 4R 文件到手机，店员可协助",
            "单次费用通常低于照相馆套餐",
          ],
        },
      ],
    },
    {
      type: "disclaimer",
      title: "尺寸提示",
      paragraphs: [
        "实际冲印尺寸可能因打印机边距或复印机设置而略有偏差，建议先打印一张测试再批量冲印。",
        "AI Images Studio 提供排版工具协助准备，但不保证每台设备输出完全符合各机构毫米要求。",
      ],
      links: [
        { href: "/zh-cn/4r-id-photo", label: "4R 证件照排版" },
        { href: "/zh-cn/id-photo-maker", label: "AI 证件照制作" },
      ],
    },
  ],
  faq: {
    title: "证件照打印常见问题",
    items: [
      {
        question: "打印机应选什么纸张？",
        answer: "选 4×6 英寸/4R/10×15 cm，各地命名不同但尺寸相同。",
      },
      {
        question: "一张排版可放不同尺寸吗？",
        answer: "4R 排版针对同一尺寸重复排列，不同尺寸请分别制作。",
      },
      {
        question: "需要 300 DPI 吗？",
        answer: "300 DPI 是冲印证件照的常用标准，AI Images Studio 输出适合照片冲印的高分辨率文件。",
      },
    ],
  },
  bottomCta: {
    title: "准备打印多张证件照？",
    subtitle: "上传照片，免费预览 4R 排版，满意后下载冲印。",
    button: "免费预览证件照",
  },
  relatedPages: [
    { slug: "4r-id-photo", label: "4R 证件照排版" },
    { slug: "id-photo-maker", label: "AI 证件照制作" },
    { slug: "passport-photo-at-home", label: "在家拍护照照片" },
    { slug: "passport-photo-size", label: "护照照片尺寸" },
  ],
  relatedPagesTitle: "相关指南",
  footer: footerZhCn,
};
