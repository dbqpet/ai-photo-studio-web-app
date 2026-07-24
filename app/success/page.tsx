"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { downloadDataUrl } from "@/lib/imageUtils";
import { readPendingPurchase, type PendingPurchase } from "@/lib/purchaseStore";
import type { VerifyPaymentResponse } from "@/lib/types";

type Status = "verifying" | "paid" | "unpaid" | "missing" | "error";

function slugify(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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
        const pending = readPendingPurchase();
        if (!pending) {
          setStatus("missing");
          return;
        }
        setPurchase(pending);
        setStatus("paid");
        // Instant high-res download of the clean single photo.
        const slug = slugify(pending.presetLabel);
        downloadDataUrl(pending.singleDataUrl, `id-photo-${slug}-high-res.jpg`);
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
            Your watermark-free high-res photo download has started. You can
            also grab each file again below.
          </p>
          <div className="grid w-full gap-3">
            <button
              type="button"
              onClick={() =>
                downloadDataUrl(
                  purchase.singleDataUrl,
                  `id-photo-${slugify(purchase.presetLabel)}-high-res.jpg`,
                )
              }
              className="rounded-xl bg-sky-600 px-5 py-3.5 text-sm font-semibold text-white shadow transition hover:bg-sky-500"
            >
              ⬇️ Download Single ID Photo (JPEG)
            </button>
            <button
              type="button"
              onClick={() =>
                downloadDataUrl(
                  purchase.sheetDataUrl,
                  `id-photo-${slugify(purchase.presetLabel)}-4r-sheet.jpg`,
                )
              }
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
