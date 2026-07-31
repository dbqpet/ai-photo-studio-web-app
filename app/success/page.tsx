"use client";

/* eslint-disable @next/next/no-img-element -- purchase previews are data URLs */

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import { useTranslation } from "react-i18next";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import { downloadDataUrl, studioDownloadFilename } from "@/lib/imageUtils";
import { PRICING } from "@/lib/pricing";
import { readPendingPurchase, type PendingPurchase } from "@/lib/purchaseStore";
import type { VerifyPaymentResponse } from "@/lib/types";

type Status = "verifying" | "paid" | "unpaid" | "topup" | "error";

function purchaseStyle(purchase: PendingPurchase): string {
  return purchase.style || purchase.presetLabel || "photo";
}

function SuccessContent() {
  const { t } = useTranslation();
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<Status>("verifying");
  const [purchase, setPurchase] = useState<PendingPurchase | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!sessionId) {
        setStatus("error");
        return;
      }
      try {
        const res = await fetch(
          `/api/verify-payment?session_id=${encodeURIComponent(sessionId)}`,
        );
        const json = (await res.json()) as VerifyPaymentResponse;
        if (cancelled) return;
        if (!res.ok || !json.paid) {
          setStatus("unpaid");
          return;
        }
        const pending = await readPendingPurchase();
        if (
          !pending ||
          !pending.singleDataUrl?.startsWith("data:image/")
        ) {
          // Top-up from the out-of-tokens modal — no photo to download yet.
          track("view_success_page", { intent: "topup" });
          setStatus("topup");
          return;
        }
        track("view_success_page", { intent: "unlock_photo" });
        setPurchase(pending);
        setStatus("paid");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-6 px-5 py-12 text-center">
      {status === "verifying" && (
        <>
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
          <p className="text-slate-600">{t("successPage.verifying")}</p>
        </>
      )}

      {status === "paid" && purchase && (
        <>
          <span className="text-5xl" aria-hidden>
            ✅
          </span>
          <h1 className="text-2xl font-bold text-slate-900">
            {t("successPage.paidTitle")}
          </h1>
          <p className="text-sm text-slate-600">
            {t("successPage.paidDescription", {
              previewCredits: PRICING.previewCreditsBonus,
            })}
          </p>
          {purchase.summary && (
            <OrderSummaryCard summary={purchase.summary} className="w-full" />
          )}
          {purchase.singleDataUrl?.startsWith("data:image/") && (
            <img
              src={purchase.singleDataUrl}
              alt={t("successPage.photoAlt")}
              className="mx-auto w-40 rounded-lg border border-slate-200 shadow-md"
            />
          )}
          <div className="grid w-full gap-3">
            <button
              type="button"
              onClick={() => {
                if (!purchase.singleDataUrl?.startsWith("data:image/")) return;
                const isPng = purchase.singleDataUrl.startsWith("data:image/png");
                downloadDataUrl(
                  purchase.singleDataUrl,
                  studioDownloadFilename(
                    purchaseStyle(purchase),
                    isPng ? "png" : "jpg",
                  ),
                );
              }}
              className="rounded-xl bg-sky-600 px-5 py-3.5 text-sm font-semibold text-white shadow transition hover:bg-sky-500"
            >
              {t("successPage.downloadSingle")}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!purchase.sheetDataUrl?.startsWith("data:image/")) return;
                downloadDataUrl(
                  purchase.sheetDataUrl,
                  studioDownloadFilename(purchaseStyle(purchase), "jpg", "4r-sheet"),
                );
              }}
              className="rounded-xl bg-slate-800 px-5 py-3.5 text-sm font-semibold text-white shadow transition hover:bg-slate-700"
            >
              {t("successPage.downloadSheet")}
            </button>
          </div>
          <Link href="/" className="text-sm font-medium text-sky-600 hover:underline">
            {t("successPage.makeAnother")}
          </Link>
        </>
      )}

      {status === "topup" && (
        <>
          <h1 className="text-2xl font-bold text-slate-900">
            {t("successPage.topupTitle")}
          </h1>
          <p className="text-sm text-slate-600">
            {t("successPage.topupDescription", {
              previewCredits: PRICING.previewCreditsBonus,
            })}
          </p>
          <Link
            href="/"
            className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:from-sky-500 hover:to-indigo-500"
          >
            {t("successPage.startMakingPhotos")}
          </Link>
        </>
      )}

      {status === "unpaid" && (
        <>
          <span className="text-5xl" aria-hidden>
            ⏳
          </span>
          <h1 className="text-xl font-bold text-slate-900">
            {t("successPage.unpaidTitle")}
          </h1>
          <p className="text-sm text-slate-600">
            {t("successPage.unpaidDescription")}
          </p>
          <Link href="/" className="text-sm font-medium text-sky-600 hover:underline">
            {t("successPage.backToStudio")}
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <span className="text-5xl" aria-hidden>
            ⚠️
          </span>
          <h1 className="text-xl font-bold text-slate-900">
            {t("successPage.errorTitle")}
          </h1>
          <p className="text-sm text-slate-600">
            {t("successPage.errorDescription")}
          </p>
          <Link href="/" className="text-sm font-medium text-sky-600 hover:underline">
            {t("successPage.backToStudio")}
          </Link>
        </>
      )}
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
