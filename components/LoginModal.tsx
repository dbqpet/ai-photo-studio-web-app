"use client";

import { useTranslation } from "react-i18next";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSignIn: () => Promise<void>;
}

/** Google OAuth gate shown when Generate is clicked while logged out. */
export default function LoginModal({
  open,
  onClose,
  onSignIn,
}: LoginModalProps) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="login-modal-title"
          className="text-xl font-bold text-slate-900"
        >
          {t("loginModal.title")}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{t("loginModal.subtitle")}</p>

        <ul className="mt-5 space-y-2.5">
          <li className="flex items-start gap-2.5 text-sm text-slate-700">
            <span aria-hidden>🎁</span>
            <span>{t("loginModal.benefit1")}</span>
          </li>
          <li className="flex items-start gap-2.5 text-sm text-slate-700">
            <span aria-hidden>📂</span>
            <span>{t("loginModal.benefit2")}</span>
          </li>
          <li className="flex items-start gap-2.5 text-sm text-slate-700">
            <span aria-hidden>📐</span>
            <span>{t("loginModal.benefit3")}</span>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => void onSignIn()}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
        >
          <GoogleIcon />
          {t("loginModal.continueWithGoogle")}
        </button>

        <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-500">
          {t("loginModal.privacyNote")}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          {t("loginModal.notNow")}
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.1 5.5l.1.1 6.3 5.3C39.3 37.3 44 32 44 24c0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}
