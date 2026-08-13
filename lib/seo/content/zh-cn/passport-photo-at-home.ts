import type { SeoPageContent } from "@/lib/seo/types";
import { footerZhCn } from "@/lib/seo/content/cn/shared";

export const passportPhotoAtHomeZhCn: SeoPageContent = {
  slug: "passport-photo-at-home",
  meta: {
    title: "如何自己制作护照照片？在家用手机完成｜AI Images Studio",
    description:
      "无需到照相馆，在家用手机拍摄护照照片，再用 AI 去除背景、调整尺寸。逐步指南教你设置光线、背景及构图，轻松完成护照照片。",
    keywords: [
      "在家拍护照照片",
      "自己制作护照照片",
      "DIY护照照片",
      "手机护照照片",
      "护照照片在家",
      "护照照片教程",
    ],
    htmlLang: "zh-Hans",
    locale: "zh_CN",
  },
  nav: { headerCta: "免费预览证件照" },
  hero: {
    title: "如何自己制作护照照片？在家用手机完成",
    subtitle:
      "并非每次都要到照相馆。在家设置好光线与背景，用手机拍摄正面人像，再用 AI 工具处理成干净的护照格式证件照——省时又方便。",
    primaryCta: "免费预览证件照",
    secondaryCta: "逐步教程",
    secondaryTargetId: "steps",
  },
  sections: [
    {
      type: "prose",
      title: "为何选择在家拍护照照片？",
      paragraphs: [
        "照相馆方便但未必就近、快捷或划算，尤其需要为多位家人准备，或临时申请时。",
        "在家拍摄可控制时间、重拍次数及舒适度。关键是分两步：先拍好原始人像，再用专门工具处理成最终护照格式。",
      ],
    },
    {
      type: "prose",
      title: "开始前——选择合适位置",
      bullets: [
        "尽量站在纯色墙前，白色、米白或浅灰最佳",
        "面向窗户取得柔和自然光，或用两盏灯以 45° 角照射减少阴影",
        "避免背光（身后有亮窗）造成面部剪影",
        "清除画面杂物，方便之后去除背景",
        "穿着与墙面有对比但不花哨的衣物",
      ],
    },
    {
      type: "steps",
      id: "steps",
      title: "逐步教程：从在家自拍到可冲印护照照片",
      items: [
        {
          title: "设置光线与背景",
          description:
            "选择面部光线均匀的墙面。关闭色温偏黄的顶灯。与墙保持约一臂距离以减少阴影。",
        },
        {
          title: "固定手机位置",
          description:
            "将手机置于眼平高度，用三脚架、书本或请人代拍。构图包含头部及双肩，头顶留少许空间。",
        },
        {
          title: "拍摄多张自然表情照片",
          description:
            "直视镜头，双眼睁开，表情放松。拍 10–15 张，选最清晰、阴影最少的一张。",
        },
        {
          title: "上传至 AI Images Studio",
          description:
            "选择最清晰的照片，工具会去除背景、平衡光线，并按护照照片尺寸预设裁剪。",
        },
        {
          title: "预览、下载及冲印",
          description:
            "仔细检查预览。下载高分辨率文件或 4R 排版，在家打印或到照相馆冲印。",
        },
      ],
    },
    {
      type: "prose",
      title: "实用拍摄技巧",
      subsections: [
        {
          title: "表情与姿态",
          paragraphs: [
            "闭嘴、保持自然表情。正面面向镜头——即使微侧也可能影响自动裁剪。",
          ],
        },
        {
          title: "衣着及饰物",
          bullets: [
            "除宗教原因外，避免戴帽",
            "若要求露出耳朵，将头发拨至耳后",
            "关闭手机美颜或重度滤镜",
          ],
        },
        {
          title: "在家冲印",
          paragraphs: [
            "使用光面或哑面相纸及最高打印品质。若家用机效果欠佳，可带数码文件到药店或便利店打印机，通常更清晰。",
          ],
        },
      ],
    },
    {
      type: "solution",
      title: "AI Images Studio 的角色",
      paragraphs: [
        "手机负责拍摄原始人像，AI Images Studio 处理难以手动完成的工作：",
      ],
      bullets: [
        "干净的背景替换",
        "曝光及光线平衡",
        "按护照照片尺寸预设裁剪",
        "高分辨率下载及 4R 多张排版",
      ],
    },
    {
      type: "disclaimer",
      title: "提交前请核对要求",
      paragraphs: [
        "在家拍摄很灵活，但各国护照照片规定不同。提交前请查阅你申请项目的官方指引，AI Images Studio 不保证符合所有机构要求。",
      ],
      links: [
        { href: "/zh-cn/passport-photo-requirements", label: "护照照片要求" },
        { href: "/zh-cn/passport-photo-size", label: "护照照片尺寸" },
      ],
    },
  ],
  faq: {
    title: "在家拍护照照片常见问题",
    items: [
      {
        question: "在家拍的照片质量够吗？",
        answer:
          "通常足够。现代手机分辨率已超越原始人像所需，光线均匀及相机稳定比设备价格更重要。",
      },
      {
        question: "在家应该用什么背景？",
        answer:
          "纯色浅色墙最佳。若墙面有纹理或颜色，AI 背景去除仍可协助，但简单背景效果最佳。",
      },
      {
        question: "可以戴眼镜吗？",
        answer:
          "规定各异。部分国家允许无反光眼镜，部分则不建议。请查阅官方要求后再决定。",
      },
      {
        question: "需要专业相机吗？",
        answer: "不需要。手机配合良好光线及稳定构图已足够作为起点。",
      },
    ],
  },
  bottomCta: {
    title: "已在家拍好照片？",
    subtitle: "立即上传，免费预览 AI 处理后的护照照片效果。",
    button: "免费预览证件照",
  },
  relatedPages: [
    { slug: "passport-photo-with-phone", label: "手机拍护照照片" },
    { slug: "passport-photo-requirements", label: "护照照片要求" },
    { slug: "passport-photo-size", label: "护照照片尺寸" },
    { slug: "id-photo-maker", label: "AI 证件照制作" },
  ],
  relatedPagesTitle: "相关指南",
  footer: footerZhCn,
};
