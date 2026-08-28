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
        className="w-full max-w-sm rounded-3xl bg-white px-5 py-6 shadow-2xl sm:px-7 sm:py-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="login-modal-title"
          className="text-center text-[1.35rem] font-bold leading-snug text-slate-900 sm:text-2xl"
        >
          {t("loginModal.title")}
        </h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-gray-500">
          {t("loginModal.subtitle")}
        </p>

        <button
          type="button"
          onClick={() => void onSignIn()}
          aria-label={t("loginModal.continueWithGoogle")}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-4 text-base font-bold text-white shadow-lg transition hover:from-sky-500 hover:to-indigo-500"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
            <GoogleIcon />
          </span>
          {t("loginModal.continueWithGoogle")}
        </button>

        <p className="mt-3 text-center text-xs text-gray-500">
          {t("loginModal.trustNote")}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full py-2 text-sm text-slate-400 transition hover:text-slate-600"
        >
          {t("loginModal.notNow")}
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden>
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
