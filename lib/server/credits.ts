import type { SupabaseClient } from "@supabase/supabase-js";
import { PRICING } from "@/lib/pricing";

export type CreditCheckResult =
  | { ok: true; previewCredits: number; hdUnlocks: number; userId: string }
  | { ok: false; status: 401 | 400 | 503; error: string; code: string };

export type CreditSpendResult =
  | { ok: true; previewCredits: number; userId: string }
  | { ok: false; status: 401 | 400 | 503; error: string; code: string };

export type HdUnlockSpendResult =
  | {
      ok: true;
      hdUnlocks: number;
      userId: string;
      alreadyUnlocked?: boolean;
    }
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

/**
 * Idempotent HD unlock for a specific generation_id (one AI output).
 * - Already unlocked → no token deduction
 * - Not unlocked + requireToken → spend 1 hd_unlock then mark unlocked
 * - Not unlocked + !requireToken (paid) → mark unlocked without spending
 *
 * Unlock is NEVER inherited by a later regenerate of the same upload.
 */
export async function unlockGenerationIdempotent(
  supabase: SupabaseClient,
  generationId: string,
  options: { source?: "token" | "payment"; requireToken?: boolean } = {},
): Promise<HdUnlockSpendResult> {
  const source = options.source ?? "token";
  const requireToken = options.requireToken ?? true;

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

  const { data, error } = await supabase.rpc("unlock_generation_idempotent", {
    p_generation_id: generationId,
    p_source: source,
    p_require_token: requireToken,
  });

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
      // Prefer new RPC; fall back to old RPC name, then table fallback.
      const legacy = await supabase.rpc("unlock_photo_idempotent", {
        p_photo_id: generationId,
        p_source: source,
        p_require_token: requireToken,
      });
      if (!legacy.error) {
        const row = Array.isArray(legacy.data) ? legacy.data[0] : legacy.data;
        return {
          ok: true,
          alreadyUnlocked: Boolean(row?.already_unlocked),
          hdUnlocks: Number(row?.out_hd_unlocks ?? 0),
          userId: user.id,
        };
      }
      return unlockGenerationFallback(supabase, user.id, generationId, {
        source,
        requireToken,
      });
    }
    console.error("[credits] unlock_generation_idempotent failed:", error);
    return {
      ok: false,
      status: 503,
      error: "Could not unlock photo. Please try again.",
      code: "CREDITS_ERROR",
    };
  }

  const row = Array.isArray(data) ? data[0] : data;
  return {
    ok: true,
    alreadyUnlocked: Boolean(row?.already_unlocked),
    hdUnlocks: Number(row?.out_hd_unlocks ?? 0),
    userId: user.id,
  };
}

/** @deprecated Use unlockGenerationIdempotent */
export async function unlockPhotoIdempotent(
  supabase: SupabaseClient,
  photoId: string,
  options: { source?: "token" | "payment"; requireToken?: boolean } = {},
): Promise<HdUnlockSpendResult> {
  return unlockGenerationIdempotent(supabase, photoId, options);
}

async function unlockGenerationFallback(
  supabase: SupabaseClient,
  userId: string,
  generationId: string,
  options: { source: "token" | "payment"; requireToken: boolean },
): Promise<HdUnlockSpendResult> {
  // Prefer generation_id column; fall back to legacy photo_id.
  let existing: { generation_id?: string; photo_id?: string } | null = null;

  const byGeneration = await supabase
    .from("unlocked_photos")
    .select("generation_id")
    .eq("user_id", userId)
    .eq("generation_id", generationId)
    .maybeSingle();

  if (!byGeneration.error) {
    existing = byGeneration.data;
  } else {
    const byPhoto = await supabase
      .from("unlocked_photos")
      .select("photo_id")
      .eq("user_id", userId)
      .eq("photo_id", generationId)
      .maybeSingle();
    existing = byPhoto.data;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("hd_unlocks")
    .eq("id", userId)
    .maybeSingle();

  if (existing) {
    return {
      ok: true,
      alreadyUnlocked: true,
      hdUnlocks: profile?.hd_unlocks ?? 0,
      userId,
    };
  }

  let hdUnlocks = profile?.hd_unlocks ?? 0;
  if (options.requireToken) {
    if (hdUnlocks <= 0) {
      return {
        ok: false,
        status: 400,
        error: "No HD unlocks left. Please purchase a pack.",
        code: "NO_HD_UNLOCKS",
      };
    }
    const spend = await spendHdUnlock(supabase);
    if (!spend.ok) return spend;
    hdUnlocks = spend.hdUnlocks;
  }

  const insertNew = await supabase.from("unlocked_photos").insert({
    user_id: userId,
    generation_id: generationId,
    source: options.source,
  });

  if (insertNew.error) {
    // Legacy schema still using photo_id
    const insertLegacy = await supabase.from("unlocked_photos").insert({
      user_id: userId,
      photo_id: generationId,
      source: options.source,
    });
    if (insertLegacy.error && insertLegacy.error.code !== "23505") {
      console.error(
        "[credits] unlocked_photos insert failed:",
        insertNew.error,
        insertLegacy.error,
      );
      return {
        ok: false,
        status: 503,
        error: "Could not record unlock. Please try again.",
        code: "CREDITS_ERROR",
      };
    }
  }

  return {
    ok: true,
    alreadyUnlocked: false,
    hdUnlocks,
    userId,
  };
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

/**
 * Grant a purchase pack exactly once per Stripe Checkout session.
 *
 * Both the webhook (source of truth) and the client-triggered
 * /api/verify-payment fallback call this with the same `sessionId`. The
 * first caller to insert the session id into `processed_stripe_sessions`
 * performs the grant; every later caller for the same session is a no-op.
 * This makes it safe to grant credits from two independent paths, which is
 * what fixes "payment succeeded but tokens were not added" when the webhook
 * is delayed, misconfigured, or (in local dev) not running at all.
 */
export async function grantUnlockPackOnceForSession(
  admin: SupabaseClient,
  params: { sessionId: string; userId: string; email?: string | null },
): Promise<{ granted: boolean; previewCredits: number; hdUnlocks: number }> {
  const { sessionId, userId, email } = params;

  const claim = await admin
    .from("processed_stripe_sessions")
    .insert({ session_id: sessionId, user_id: userId })
    .select()
    .maybeSingle();

  if (claim.error) {
    // 23505 = unique_violation → another caller already claimed and granted
    // this session (webhook or verify-payment got there first).
    if (claim.error.code === "23505") {
      const { data: profile } = await admin
        .from("profiles")
        .select("preview_credits, hd_unlocks")
        .eq("id", userId)
        .maybeSingle();
      return {
        granted: false,
        previewCredits: profile?.preview_credits ?? 0,
        hdUnlocks: profile?.hd_unlocks ?? 0,
      };
    }
    // Ledger table missing (migration not applied yet) or another error —
    // fail open and grant anyway so a real purchase is never silently
    // dropped. Run supabase/migrations/006_processed_stripe_sessions.sql to
    // enable proper dedupe.
    console.error(
      "[credits] processed_stripe_sessions insert failed, granting anyway:",
      claim.error,
    );
  }

  const granted = await grantUnlockPackAdmin(admin, userId, email);
  return { granted: true, ...granted };
}

/**
 * Grant purchase pack via service role (webhook / mock verify).
 * Every purchase ($4.99) grants +{PRICING.previewCreditsBonus} preview_credits
 * and +{PRICING.hdUnlocksPerPurchase} banked hd_unlocks, regardless of intent.
 * unlock_photo purchases additionally mark the specific generation unlocked
 * (handled separately via unlocked_photos, not here).
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

  const { data: profile } = await admin
    .from("profiles")
    .select("preview_credits, hd_unlocks")
    .eq("id", userId)
    .maybeSingle();

  const previewCredits =
    (profile?.preview_credits ?? 0) + PRICING.previewCreditsBonus;
  const hdUnlocks = (profile?.hd_unlocks ?? 0) + PRICING.hdUnlocksPerPurchase;

  await admin.from("profiles").upsert({
    id: userId,
    email: email ?? undefined,
    preview_credits: previewCredits,
    hd_unlocks: hdUnlocks,
    updated_at: new Date().toISOString(),
  });

  return { previewCredits, hdUnlocks };
}
