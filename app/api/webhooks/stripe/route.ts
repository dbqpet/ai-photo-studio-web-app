import { POST as webhookPost } from "@/app/api/webhook/route";

export const runtime = "nodejs";

/** Alias path matching Stripe dashboard convention: /api/webhooks/stripe */
export const POST = webhookPost;
