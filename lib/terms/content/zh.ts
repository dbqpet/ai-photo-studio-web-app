import type { TermsContent } from "@/lib/terms/types";

export const termsZh: TermsContent = {
  meta: {
    title: "條款及細則 | AI Images Studio",
    description: "AI Images Studio 條款及細則 — AI 智能證件相、護照相及簽證相處理服務。",
    htmlLang: "zh-HK",
    locale: "zh_HK",
  },
  nav: {
    backToStudio: "← 返回工作室",
    switchLang: "English",
    switchLangLabel: "語言",
  },
  pageTitle: "條款及細則",
  lastUpdated: "最後更新：2026 年 8 月 16 日",
  disclaimer: {
    title: "免責聲明",
    text: "雖然本系統專為符合護照及簽證規格而優化，但最終照片接納與否，取決於相關政府部門的最終決定。建議您提交前再次核對相關部門的最新指引。",
  },
  sections: [
    {
      id: "acceptance",
      title: "1. 接受條款",
      paragraphs: [
        "使用 AI Images Studio（「本服務」）即表示您同意受本條款及細則約束。如不同意，請勿使用本服務。",
        "我們可能不時更新本條款。更新後繼續使用本服務，即視為接受修訂後的條款。",
      ],
    },
    {
      id: "service",
      title: "2. 服務說明",
      paragraphs: [
        "AI Images Studio 提供線上 AI 輔助工具，協助您從上傳的影像製作護照相、簽證相及證件相。功能可能包括去背、裁剪、風格優化、含水印預覽，以及付費高清下載。",
        "除非另有書面約定，本服務僅供個人非商業用途。",
      ],
    },
    {
      id: "accounts",
      title: "3. 帳戶及免費預覽",
      paragraphs: [
        "部分功能需要登入。您須妥善保管帳戶憑證，並對帳戶下的一切活動負責。",
        "免費預覽點數由我們酌情提供。預覽結果可能包含水印，不適合用作正式提交。",
      ],
    },
    {
      id: "payments",
      title: "4. 付款及退款",
      paragraphs: [
        "付費功能（如高清下載及排版）透過第三方付款平台處理。價格會於結帳前顯示。",
        "由於數碼產品於付款成功後即時交付，除適用法律另有規定，或因我方技術故障而酌情處理外，一般不提供退款。",
      ],
    },
    {
      id: "acceptable-use",
      title: "5. 可接受使用",
      paragraphs: ["您同意不會："],
      bullets: [
        "上傳您無權使用、或違反法律或第三方權利的內容。",
        "嘗試逆向工程、爬取或濫用本服務或其基礎設施。",
        "利用本服務製作誤導、欺詐或非法的身份文件。",
        "規避付款、水印或存取控制。",
      ],
    },
    {
      id: "ip",
      title: "6. 知識產權",
      paragraphs: [
        "您保留所上傳相片的全部權利。使用本服務即表示您授予我們有限許可，僅為提供服務而處理您的影像。",
        "AI Images Studio 的品牌、軟件及網站內容歸我們或授權方所有，未經許可不得複製。",
      ],
    },
    {
      id: "privacy",
      title: "7. 私隱及資料處理",
      paragraphs: [
        "相片僅為提供服務而處理。處理完成後，我們不會長期儲存您上傳的影像。",
        "登入及付款資料可能由第三方（如 Supabase、Stripe）處理，並受其各自政策約束。",
      ],
    },
    {
      id: "liability",
      title: "8. 責任限制",
      paragraphs: [
        "本服務按「現狀」及「可用性」提供，不作任何明示或暗示保證，包括適用於特定用途或不侵权。",
        "在法律允許的最大範圍內，AI Images Studio 不對因使用本服務而產生的間接、附帶、特殊或後果性損害承擔責任，包括護照或簽證申請被拒。",
        "就任何與服務相關的索賠，我們的總責任不超過您在索賠前十二（12）個月內向我們支付的金額。",
      ],
    },
    {
      id: "contact",
      title: "9. 聯絡我們",
      paragraphs: ["如對本條款及細則有任何疑問，請電郵至 info@aiimagesstudio.com。"],
    },
  ],
  footer: {
    privacy: "AI Images Studio · 相片安全處理，處理完成後自動刪除，不長期儲存於伺服器。",
    supportLabel: "支援：",
    terms: "條款及細則",
  },
};
