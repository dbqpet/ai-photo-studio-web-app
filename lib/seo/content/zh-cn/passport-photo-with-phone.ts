import type { SeoPageContent } from "@/lib/seo/types";
import { footerZhCn } from "@/lib/seo/content/cn/shared";

export const passportPhotoWithPhoneZhCn: SeoPageContent = {
  slug: "passport-photo-with-phone",
  meta: {
    title: "用手机自己拍护照照片｜普通自拍变正式证件照｜AI Images Studio",
    description:
      "用手机拍护照照片实用指南：镜头位置、光线设置、拍摄距离及常见错误。上传后用 AI 去除背景、调整尺寸，制作正式证件照。",
    keywords: [
      "手机护照照片",
      "手机拍证件照",
      "iPhone护照照片",
      "手机自拍证件照",
      "手机证件照",
      "智能手机护照照片",
    ],
    htmlLang: "zh-Hans",
    locale: "zh_CN",
  },
  nav: { headerCta: "免费预览证件照" },
  hero: {
    title: "用手机自己拍护照照片：从普通自拍制作正式证件照",
    subtitle:
      "你的手机已是功能强大的相机。本指南教你设置镜头、光线及距离，拍出适合作为护照照片起点的人像，再用 AI 工具处理成正式证件照。",
    primaryCta: "免费预览证件照",
    secondaryCta: "手机设置技巧",
    secondaryTargetId: "setup",
  },
  sections: [
    {
      type: "prose",
      title: "手机已足够拍摄原始人像",
      paragraphs: [
        "护照及证件申请重视清晰度、光线及构图，而非相机品牌。现代手机的分辨率已超越头肩人像所需，只要遵循几个简单设置。",
        "手机负责拍摄，AI Images Studio 负责后期——背景清理、尺寸裁剪及可冲印输出。",
      ],
    },
    {
      type: "prose",
      id: "setup",
      title: "手机位置与拍摄距离",
      bullets: [
        "将手机置于眼平高度——用三脚架、书本或请人代持",
        "与相机保持约 1–1.5 米距离，取得自然头肩构图",
        "优先使用后置镜头，画质通常优于前置自拍镜头",
        "开启相机网格线，保持面部居中",
        "使用定时器或遥控快门，避免手臂长度造成的广角畸变",
      ],
    },
    {
      type: "prose",
      title: "光线与背景",
      subsections: [
        {
          title: "光线",
          bullets: [
            "日间面向窗户，取得柔和均匀光线",
            "夜间室内可用两盏灯以 45° 角照射",
            "避免正上方顶灯造成鼻影",
            "若他人代拍，注意屏幕反光",
          ],
        },
        {
          title: "背景",
          bullets: [
            "纯色墙面最佳",
            "背景杂乱仍可后期处理，但简单背景效果更好",
            "避免使用数字背景模糊，可能显得不自然",
          ],
        },
      ],
    },
    {
      type: "steps",
      title: "从手机拍摄到可冲印护照照片",
      items: [
        {
          title: "拍摄 10–15 张自然表情照片",
          description: "选最清晰的一张，双眼睁开、头部正直。",
        },
        {
          title: "传送照片（如需要）",
          description:
            "微信、云同步或邮件至电脑，或直接在手机浏览器上传至 aiimagesstudio.com。",
        },
        {
          title: "上传至 AI Images Studio",
          description: "选择最佳人像，工具支持手机浏览器，无需安装 App。",
        },
        {
          title: "选择尺寸、裁剪及处理",
          description: "套用护照照片预设，调整裁剪框，让 AI 清理背景及光线。",
        },
        {
          title: "下载或冲印",
          description: "保存高分辨率文件或 4R 排版，在家打印或到照相馆冲印。",
        },
      ],
    },
    {
      type: "prose",
      title: "常见手机拍摄错误",
      bullets: [
        "手机位置过低或过高，造成不美观角度",
        "距离太近，广角镜头使面部变宽",
        "使用美颜模式使皮肤过度平滑",
        "裁切掉头顶或肩部",
        "提交截图而非原始影像文件",
      ],
    },
    {
      type: "solution",
      title: "拍摄后——在线处理证件照",
      paragraphs: ["取得合格手机人像后，AI Images Studio 接手："],
      bullets: [
        "背景去除，呈现护照风格纯色背景",
        "光线优化，减少阴影",
        "对齐官方尺寸预设的裁剪工具",
        "可下载 4R 多张排版供冲印",
      ],
    },
    {
      type: "disclaimer",
      title: "提交前请核对",
      paragraphs: [
        "手机拍摄方便灵活，但各申请项目的护照照片规定不同。提交前请查阅官方指引。",
      ],
      links: [
        { href: "/zh-cn/passport-photo-requirements", label: "护照照片要求" },
        { href: "/zh-cn/passport-photo-at-home", label: "在家拍护照照片" },
      ],
    },
  ],
  faq: {
    title: "手机护照照片常见问题",
    items: [
      {
        question: "前置还是后置镜头？",
        answer:
          "后置镜头通常更清晰、畸变更少。若必须用前置，拉远距离并使用定时器。",
      },
      {
        question: "可以全程用手机完成吗？",
        answer:
          "可以。在手机浏览器开启 aiimagesstudio.com，上传照片并直接下载结果。",
      },
      {
        question: "应上传什么格式？",
        answer:
          "支持 JPEG、PNG 及 WebP。尽量使用相册原始文件，避免通讯 App 压缩后的版本。",
      },
    ],
  },
  bottomCta: {
    title: "手机照片已准备好？",
    subtitle: "立即上传，免费预览 AI 处理后的护照照片效果。",
    button: "免费预览证件照",
  },
  relatedPages: [
    { slug: "passport-photo-at-home", label: "在家拍护照照片" },
    { slug: "id-photo-maker", label: "AI 证件照制作" },
    { slug: "passport-photo-size", label: "护照照片尺寸" },
    { slug: "4r-id-photo", label: "4R 证件照排版" },
  ],
  relatedPagesTitle: "相关指南",
  footer: footerZhCn,
};
