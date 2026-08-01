import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - static assets and image optimizations
     * - /api/* routes (each route creates its own request-scoped Supabase
     *   client via lib/supabase/server.ts / admin.ts, so they never rely on
     *   this middleware's cookie refresh). This matters most for webhook
     *   endpoints like /api/webhook and /api/webhooks/stripe: Stripe's
     *   requests carry no Supabase cookies, so routing them through
     *   supabase.auth.getUser() here only adds latency and an extra point
     *   of failure (e.g. a transient Supabase Auth error would 500 the
     *   request before Stripe's signature is even verified).
     */
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
