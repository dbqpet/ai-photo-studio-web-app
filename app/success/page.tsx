"use client";

/* eslint-disable @next/next/no-img-element -- purchase previews are data URLs */

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import { downloadDataUrl, studioDownloadFilename } from "@/lib/imageUtils";
import { readPendingPurchase, type PendingPurchase } from "@/lib/purchaseStore";
import type { VerifyPaymentResponse } from "@/lib/types";

type Status = "verifying" | "paid" | "unpaid" | "missing" | "error";

function purchaseStyle(purchase: PendingPurchase): string {
  return purchase.style || purchase.presetLabel || "photo";
}

function SuccessContent() {
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
        if (!pending) {
          setStatus("missing");
          return;
        }
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
          <p className="text-slate-600">Verifying your payment…</p>
        </>
      )}

      {status === "paid" && purchase && (
        <>
          <span className="text-5xl" aria-hidden>
            ✅
          </span>
          <h1 className="text-2xl font-bold text-slate-900">Payment successful!</h1>
          <p className="text-sm text-slate-600">
            Your payment is confirmed. Tap a button below to download your
            watermark-free high-res files.
          </p>
          {purchase.summary && (
            <OrderSummaryCard summary={purchase.summary} className="w-full" />
          )}
          {purchase.singleDataUrl?.startsWith("data:image/") && (
            <img
              src={purchase.singleDataUrl}
              alt="Your ID photo"
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
              ⬇️ Download Single ID Photo
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
              ⬇️ Download 4R Print Sheet (JPEG)
            </button>
          </div>
          <Link href="/" className="text-sm font-medium text-sky-600 hover:underline">
            ← Make another photo
          </Link>
        </>
      )}

      {status === "unpaid" && (
        <>
          <span className="text-5xl" aria-hidden>
            ⏳
          </span>
          <h1 className="text-xl font-bold text-slate-900">Payment not confirmed</h1>
          <p className="text-sm text-slate-600">
            We could not confirm this payment. If you completed checkout,
            please wait a moment and refresh this page.
          </p>
          <Link href="/" className="text-sm font-medium text-sky-600 hover:underline">
            ← Back to studio
          </Link>
        </>
      )}

      {status === "missing" && (
        <>
          <span className="text-5xl" aria-hidden>
            🗂️
          </span>
          <h1 className="text-xl font-bold text-slate-900">Photos not found</h1>
          <p className="text-sm text-slate-600">
            Your payment is confirmed, but the generated photos were not found
            in this browser session. Please regenerate your photo — no new
            payment is needed if you keep this page open and contact support.
          </p>
          <Link href="/" className="text-sm font-medium text-sky-600 hover:underline">
            ← Back to studio
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <span className="text-5xl" aria-hidden>
            ⚠️
          </span>
          <h1 className="text-xl font-bold text-slate-900">Something went wrong</h1>
          <p className="text-sm text-slate-600">
            We could not verify the payment session. Please refresh or return
            to the studio.
          </p>
          <Link href="/" className="text-sm font-medium text-sky-600 hover:underline">
            ← Back to studio
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
