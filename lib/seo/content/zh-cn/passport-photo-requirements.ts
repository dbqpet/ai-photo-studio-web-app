import type { SeoPageContent } from "@/lib/seo/types";
import { footerZhCn } from "@/lib/seo/content/cn/shared";

export const passportPhotoRequirementsZhCn: SeoPageContent = {
  slug: "passport-photo-requirements",
  meta: {
    title: "护照照片要求｜背景、尺寸、光线与拍摄注意事项｜AI Images Studio",
    description:
      "护照照片及证件照常见要求：背景颜色、尺寸规格、光线条件、表情姿态及衣着饰物。了解要点后用 AI 工具协助准备合规影像。",
    keywords: [
      "护照照片要求",
      "证件照要求",
      "护照照片规定",
      "证件照背景",
      "护照照片规格",
      "证件照标准",
    ],
    htmlLang: "zh-Hans",
    locale: "zh_CN",
  },
  nav: { headerCta: "免费预览证件照" },
  hero: {
    title: "护照照片要求：背景、尺寸、光线与拍摄注意事项",
    subtitle:
      "各国护照及签证对证件照有不同标准。本文整理背景、尺寸、光线、表情等常见要求，协助你在拍摄及后期处理时更有方向——提交前仍须查阅官方指引。",
    primaryCta: "免费预览证件照",
    secondaryCta: "背景要求",
    secondaryTargetId: "background",
  },
  sections: [
    {
      type: "prose",
      id: "background",
      title: "背景要求",
      paragraphs: [
        "大多数护照照片及证件照要求纯色、均匀的背景，常见为白色、米白或浅灰色。背景不应有阴影、花纹或渐变。",
        "若在家拍摄时背景不理想，AI 背景去除可协助替换为纯色背景，但最终效果仍须符合你申请项目的具体规定。",
      ],
      bullets: [
        "背景颜色：白色、米白或浅灰最常见",
        "背景须均匀，无明显阴影或色差",
        "避免使用有图案或纹理的墙面",
        "部分规格禁止数字背景模糊效果",
      ],
    },
    {
      type: "prose",
      title: "尺寸与构图",
      bullets: [
        "常见尺寸：35×45 mm、2×2 英寸、33×48 mm 等",
        "面部（下巴至头顶）通常占照片高度约 70–80%",
        "正面直视镜头，双眼睁开且清晰可见",
        "构图包含头部及双肩，头顶留适当空间",
        "照片须为近期拍摄，部分规定六个月内",
      ],
    },
    {
      type: "prose",
      title: "光线与影像品质",
      subsections: [
        {
          title: "光线",
          bullets: [
            "面部光线均匀，避免一侧明显阴影",
            "避免背光造成面部过暗",
            "避免过曝导致面部细节流失",
            "避免在混合色温灯光下拍摄造成偏色",
          ],
        },
        {
          title: "清晰度",
          bullets: [
            "影像锐利，无模糊或动态虚化",
            "分辨率足够，缩小后面部仍清晰",
            "避免过度修图或美颜滤镜",
          ],
        },
      ],
    },
    {
      type: "prose",
      title: "表情、姿态及饰物",
      bullets: [
        "自然表情，嘴巴闭合",
        "正面面向镜头，头部不可倾斜或转侧",
        "除宗教原因外，通常不可戴帽",
        "眼镜：部分允许但不可有反光，部分则禁止",
        "头发不可遮盖面部或眼睛",
        "部分规格要求耳朵可见",
      ],
    },
    {
      type: "solution",
      title: "AI Images Studio 如何协助",
      paragraphs: [
        "了解要求后，AI Images Studio 可协助处理难以手动完成的部分：",
      ],
      bullets: [
        "将杂乱背景替换为纯色背景",
        "平衡光线，减少阴影",
        "按尺寸预设裁剪，调整头部比例",
        "输出高分辨率文件或 4R 排版供冲印",
      ],
    },
    {
      type: "disclaimer",
      title: "重要提示",
      paragraphs: [
        "各国及机构的护照照片要求可能随时更新，且细节各异。本文仅作一般参考，不能替代官方指引。",
        "AI Images Studio 是影像准备工具，协助制作干净、尺寸正确的证件照，但不保证任何机构必然接受，亦不构成移民或法律建议。",
      ],
      links: [
        { href: "/zh-cn/passport-photo-size", label: "护照照片尺寸" },
        { href: "/zh-cn/passport-photo-at-home", label: "在家拍护照照片" },
      ],
    },
  ],
  faq: {
    title: "护照照片要求常见问题",
    items: [
      {
        question: "白色背景是否适用所有申请？",
        answer:
          "大多数要求白色或浅色背景，但部分机构指定米白或浅灰。请查阅官方规格中的背景颜色要求。",
      },
      {
        question: "可以微笑吗？",
        answer:
          "多数规定要求自然、中性的表情，嘴巴闭合。过度微笑可能被拒。",
      },
      {
        question: "旧照片经 AI 处理后可以用吗？",
        answer:
          "许多规定要求近期照片（如六个月内）。即使 AI 改善画质，拍摄日期仍可能受审核。",
      },
      {
        question: "数码提交与冲印要求是否相同？",
        answer:
          "尺寸及背景要求通常一致，但数码提交可能另有像素、文件格式及大小限制。",
      },
    ],
  },
  bottomCta: {
    title: "了解要求，准备你的护照照片",
    subtitle: "上传自拍，免费预览 AI 处理效果，按官方规格调整后下载。",
    button: "免费预览证件照",
  },
  relatedPages: [
    { slug: "passport-photo-size", label: "护照照片尺寸" },
    { slug: "passport-photo-at-home", label: "在家拍护照照片" },
    { slug: "passport-photo-with-phone", label: "手机拍护照照片" },
    { slug: "visa-photo", label: "签证照片制作" },
  ],
  relatedPagesTitle: "相关指南",
  footer: footerZhCn,
};
