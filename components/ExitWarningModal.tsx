"use client";

interface ExitWarningModalProps {
  open: boolean;
  downloadLoading: boolean;
  onDownloadNow: () => void;
  onLeaveAnyway: () => void;
}

/** Shown when leaving/resetting an unlocked-but-undownloaded HD photo session. */
export default function ExitWarningModal({
  open,
  downloadLoading,
  onDownloadNow,
  onLeaveAnyway,
}: ExitWarningModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-warning-modal-title"
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <h2
          id="exit-warning-modal-title"
          className="text-xl font-bold text-slate-900"
        >
          ⚠️ Wait! You haven&apos;t saved your HD photos yet!
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Your 300 DPI passport photo session will expire once you leave.
          Please download your files now. (Un-downloaded photo sessions
          cannot be retrieved and are non-refundable).
        </p>

        <button
          type="button"
          onClick={onDownloadNow}
          disabled={downloadLoading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 disabled:opacity-60"
        >
          {downloadLoading ? (
            <>
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Preparing HD Photo...
            </>
          ) : (
            <>📦 Download HD Photos Now (.zip)</>
          )}
        </button>

        <button
          type="button"
          onClick={onLeaveAnyway}
          className="mt-3 w-full py-2 text-sm font-medium text-slate-400 hover:text-slate-600"
        >
          Leave Anyway
        </button>
      </div>
    </div>
  );
}
