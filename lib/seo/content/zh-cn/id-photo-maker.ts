import type { SeoPageContent } from "@/lib/seo/types";
import { footerZhCn } from "@/lib/seo/content/cn/shared";

export const idPhotoMakerZhCn: SeoPageContent = {
  slug: "id-photo-maker",
  meta: {
    title: "AI证件照制作｜在线生成专业证件照",
    description:
      "用 AI 将普通自拍变成专业证件照。自动去除背景、调整光线与尺寸，适合员工证、学生证、签证及一般证件申请，免费预览效果。",
    keywords: [
      "AI证件照",
      "证件照制作",
      "在线证件照",
      "证件照生成",
      "专业证件照",
      "证件照编辑",
    ],
    htmlLang: "zh-Hans",
    locale: "zh_CN",
  },
  nav: { headerCta: "免费预览证件照" },
  hero: {
    title: "AI证件照制作：普通自拍变专业证件照",
    subtitle:
      "员工证、学生证、会员卡及网上身份验证都需要清晰、背景干净的证件照。无需到照相馆，上传一张日常自拍，AI 帮你处理背景、光线与裁剪。",
    primaryCta: "免费预览证件照",
    secondaryCta: "查看前后对比",
    secondaryTargetId: "before-after",
  },
  sections: [
    {
      type: "prose",
      title: "证件照与普通自拍的差别",
      paragraphs: [
        "证件照的目的是清楚辨认你的样貌，而非展示生活场景。通常需要纯色背景、均匀光线、正面凝视，以及包含面部及上肩的构图。",
        "普通自拍常因滤镜、斜角、杂乱背景或阴影而不适合证件用途。即使机构没有严格规定，一张干净的证件照在证件及网上验证时都更专业。",
      ],
    },
    {
      type: "prose",
      title: "常见证件照用途",
      bullets: [
        "公司员工证及外包人员证",
        "大学及中小学学生证",
        "专业牌照及资格申请",
        "会员卡及门禁系统",
        "网上身份验证及 KYC 流程",
        "内部人事档案及通讯录",
      ],
    },
    {
      type: "beforeAfter",
      id: "before-after",
      title: "AI 处理前后的变化",
      beforeTitle: "一般自拍",
      afterTitle: "处理后证件照",
      before: [
        "背景杂乱或有颜色",
        "面部一侧有明显阴影",
        "头部微侧或构图偏离中心",
        "裁剪不当，肩部被截断",
      ],
      after: [
        "纯色、中性背景",
        "面部光线均匀平衡",
        "正面构图，适合证件用途",
        "一致裁剪，缩小打印仍清晰",
      ],
    },
    {
      type: "features",
      title: "AI Images Studio 如何处理证件照",
      items: [
        {
          icon: "✂️",
          title: "AI 背景去除",
          description: "将杂乱环境替换为适合证件照的纯色背景。",
        },
        {
          icon: "💡",
          title: "光线平衡",
          description: "改善曝光，确保缩小打印时面部细节仍清晰可见。",
        },
        {
          icon: "👤",
          title: "保留真实样貌",
          description: "专注于清理而非改变五官，确保仍像本人。",
        },
        {
          icon: "📐",
          title: "多种尺寸预设",
          description: "支持常见护照、签证及证件尺寸，亦可自定义毫米数值。",
        },
      ],
    },
    {
      type: "steps",
      title: "四步完成证件照",
      items: [
        {
          title: "上传正面人像",
          description: "使用近期、面部清晰的照片，避免团体照或重度滤镜。",
        },
        {
          title: "选择所需尺寸",
          description: "选择符合机构要求的预设，或输入自定义宽高。",
        },
        {
          title: "调整裁剪并预览",
          description: "微调头部位置，确认背景干净、构图合适。",
        },
        {
          title: "下载数码文件或排版文件",
          description: "取得高分辨率文件用于网上提交，或 4R 排版用于实体冲印。",
        },
      ],
    },
    {
      type: "disclaimer",
      title: "请查阅机构要求",
      paragraphs: [
        "雇主、学校及牌照机构有时会订明证件照规格。AI Images Studio 协助制作专业影像，但提交前请确认尺寸、背景颜色及文件格式是否符合要求。",
      ],
      links: [
        { href: "/zh-cn/passport-photo-requirements", label: "护照照片要求指南" },
        { href: "/zh-cn/4r-id-photo", label: "4R 证件照排版" },
      ],
    },
  ],
  faq: {
    title: "AI 证件照常见问题",
    items: [
      {
        question: "证件照与护照照片是否相同？",
        answer:
          "风格相似（纯色背景、清晰面部），但要求因用途而异。护照申请通常有严格政府规定；内部员工证可能较宽松。",
      },
      {
        question: "一张照片可用于多个申请吗？",
        answer:
          "若尺寸及风格符合各机构要求，有时可以。如有疑问，建议按各规格分别裁剪。",
      },
      {
        question: "输出是什么格式？",
        answer: "可下载高分辨率 JPEG，适合冲印及大部分网上提交。",
      },
    ],
  },
  bottomCta: {
    title: "今天就需要证件照？",
    subtitle: "上传自拍，免费预览 AI 处理效果，满意后再下载。",
    button: "免费预览证件照",
  },
  relatedPages: [
    { slug: "4r-id-photo", label: "4R 证件照排版" },
    { slug: "passport-photo-at-home", label: "在家制作护照照片" },
    { slug: "passport-photo-with-phone", label: "手机拍护照照片" },
    { slug: "id-photo-print", label: "证件照打印" },
  ],
  relatedPagesTitle: "相关指南",
  footer: footerZhCn,
};
