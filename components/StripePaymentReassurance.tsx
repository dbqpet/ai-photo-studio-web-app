/** Small Stripe reassurance line for payment CTAs — not a hero credibility badge. */
export default function StripePaymentReassurance({ className = "" }: { className?: string }) {
  return (
    <p className={`text-center text-[11px] text-slate-400 ${className}`}>
      🔒 Secure payment powered by Stripe
    </p>
  );
}
