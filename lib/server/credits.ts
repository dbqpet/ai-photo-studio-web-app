import type { SupabaseClient } from "@supabase/supabase-js";

export type CreditCheckResult =
  | { ok: true; previewCredits: number; hdUnlocks: number; userId: string }
  | { ok: false; status: 401 | 400 | 503; error: string; code: string };

export type CreditSpendResult =
  | { ok: true; previewCredits: number; userId: string }
  | { ok: false; status: 401 | 400 | 503; error: string; code: string };

export type HdUnlockSpendResult =
  | { ok: true; hdUnlocks: number; userId: string }
  | { ok: false; status: 401 | 400 | 503; error: string; code: string };

const NO_PREVIEW_MESSAGE =
  "No preview credits left. Please purchase a pack.";

/**
 * Preview-credit check only — never deducts.
 * Call BEFORE the AI API so empty balances never hit generation.
 */
export async function requirePreviewCredit(
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
    .select("preview_credits, hd_unlocks")
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

  const previewCredits = profile?.preview_credits ?? 0;
  const hdUnlocks = profile?.hd_unlocks ?? 0;
  if (!profile || previewCredits <= 0) {
    return {
      ok: false,
      status: 400,
      error: NO_PREVIEW_MESSAGE,
      code: "NO_PREVIEW_CREDITS",
    };
  }

  return {
    ok: true,
    previewCredits,
    hdUnlocks,
    userId: user.id,
  };
}

/** Atomically spend 1 preview credit AFTER a successful generation. */
export async function spendPreviewCredit(
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

  const { data, error } = await supabase.rpc("deduct_preview_credit");

  if (error) {
    const message = error.message ?? "";
    if (
      message.includes("NO_PREVIEW_CREDITS") ||
      message.includes("NO_CREDITS")
    ) {
      return {
        ok: false,
        status: 400,
        error: NO_PREVIEW_MESSAGE,
        code: "NO_PREVIEW_CREDITS",
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
    console.error("[credits] deduct_preview_credit failed:", error);
    return {
      ok: false,
      status: 503,
      error: "Could not deduct preview credits. Please try again.",
      code: "CREDITS_ERROR",
    };
  }

  return { ok: true, previewCredits: Number(data), userId: user.id };
}

/** Atomically spend 1 HD unlock before releasing a clean download. */
export async function spendHdUnlock(
  supabase: SupabaseClient,
): Promise<HdUnlockSpendResult> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false,
      status: 401,
      error: "Please sign in to download HD photos.",
      code: "NOT_AUTHENTICATED",
    };
  }

  const { data, error } = await supabase.rpc("spend_hd_unlock");

  if (error) {
    const message = error.message ?? "";
    if (message.includes("NO_HD_UNLOCKS")) {
      return {
        ok: false,
        status: 400,
        error: "No HD unlocks left. Please purchase a pack.",
        code: "NO_HD_UNLOCKS",
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
          "HD unlock RPC is not installed. Run supabase/migrations/001_profiles_and_credits.sql.",
        code: "CREDITS_ERROR",
      };
    }
    console.error("[credits] spend_hd_unlock failed:", error);
    return {
      ok: false,
      status: 503,
      error: "Could not spend HD unlock. Please try again.",
      code: "CREDITS_ERROR",
    };
  }

  return { ok: true, hdUnlocks: Number(data), userId: user.id };
}

/** Grant purchase pack via service role (webhook / mock verify).
 *  Adds bonus preview credits only — does NOT bank hd_unlocks.
 *  HD download for the purchased photo is unlocked via payment verification.
 */
export async function grantUnlockPackAdmin(
  admin: SupabaseClient,
  userId: string,
  email?: string | null,
): Promise<{ previewCredits: number; hdUnlocks: number }> {
  const { data, error } = await admin.rpc("grant_unlock_pack", {
    target_user_id: userId,
  });

  if (!error && data) {
    const row = Array.isArray(data) ? data[0] : data;
    return {
      previewCredits: Number(
        row.out_preview_credits ?? row.preview_credits ?? 0,
      ),
      hdUnlocks: Number(row.out_hd_unlocks ?? row.hd_unlocks ?? 0),
    };
  }

  // Fallback if RPC is missing: preview credits only (no hd_unlocks increment).
  const { data: profile } = await admin
    .from("profiles")
    .select("preview_credits, hd_unlocks")
    .eq("id", userId)
    .maybeSingle();

  const previewCredits = (profile?.preview_credits ?? 0) + 5;
  const hdUnlocks = profile?.hd_unlocks ?? 0;

  await admin.from("profiles").upsert({
    id: userId,
    email: email ?? undefined,
    preview_credits: previewCredits,
    hd_unlocks: hdUnlocks,
    updated_at: new Date().toISOString(),
  });

  return { previewCredits, hdUnlocks };
}
