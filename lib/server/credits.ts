import type { SupabaseClient } from "@supabase/supabase-js";

export type CreditCheckResult =
  | { ok: true; credits: number; userId: string }
  | { ok: false; status: 401 | 402 | 503; error: string; code: string };

export type CreditSpendResult = CreditCheckResult;

/** Require an authenticated user with at least one credit (no deduction yet). */
export async function requireGenerationCredit(
  supabase: SupabaseClient,
): Promise<CreditCheckResult> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false,
      status: 401,
      error: "Please sign in with Google to generate a photo.",
      code: "NOT_AUTHENTICATED",
    };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[credits] profile select failed:", error);
    return {
      ok: false,
      status: 503,
      error: "Could not verify credits. Please try again.",
      code: "CREDITS_ERROR",
    };
  }

  const credits = profile?.credits ?? 0;
  if (!profile || credits <= 0) {
    return {
      ok: false,
      status: 402,
      error: "You're out of free credits. Unlock high-res to continue.",
      code: "NO_CREDITS",
    };
  }

  return { ok: true, credits, userId: user.id };
}

/**
 * Atomically spend 1 credit after a successful generation.
 * Returns remaining credits on success.
 */
export async function spendGenerationCredit(
  supabase: SupabaseClient,
): Promise<CreditSpendResult> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false,
      status: 401,
      error: "Please sign in with Google to generate a photo.",
      code: "NOT_AUTHENTICATED",
    };
  }

  const { data, error } = await supabase.rpc("deduct_credit");

  if (error) {
    const message = error.message ?? "";
    if (message.includes("NO_CREDITS")) {
      return {
        ok: false,
        status: 402,
        error: "You're out of free credits. Unlock high-res to continue.",
        code: "NO_CREDITS",
      };
    }
    if (
      message.includes("function") ||
      message.includes("does not exist") ||
      error.code === "PGRST202"
    ) {
      return {
        ok: false,
        status: 503,
        error:
          "Credits RPC is not installed. Run supabase/migrations/001_profiles_and_credits.sql.",
        code: "CREDITS_ERROR",
      };
    }
    console.error("[credits] deduct_credit failed:", error);
    return {
      ok: false,
      status: 503,
      error: "Could not verify credits. Please try again.",
      code: "CREDITS_ERROR",
    };
  }

  return { ok: true, credits: Number(data), userId: user.id };
}
