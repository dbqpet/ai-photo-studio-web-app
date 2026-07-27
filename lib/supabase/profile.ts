import type { SupabaseClient, User } from "@supabase/supabase-js";
import { PRICING } from "@/lib/pricing";

export interface Profile {
  id: string;
  email: string | null;
  previewCredits: number;
  hdUnlocks: number;
}

export type ProfileResult =
  | { ok: true; profile: Profile }
  | { ok: false; error: string; needsMigration?: boolean };

function isMissingProfilesTable(message: string): boolean {
  return (
    message.includes("Could not find the table") ||
    message.includes("public.profiles") ||
    message.includes("schema cache")
  );
}

function isMissingColumn(message: string): boolean {
  return (
    message.includes("preview_credits") ||
    message.includes("hd_unlocks") ||
    message.includes("column") ||
    message.includes("schema cache")
  );
}

function mapProfile(row: {
  id: string;
  email: string | null;
  preview_credits?: number | null;
  hd_unlocks?: number | null;
}): Profile {
  return {
    id: row.id,
    email: row.email,
    previewCredits: row.preview_credits ?? 0,
    hdUnlocks: row.hd_unlocks ?? 0,
  };
}

/** Fetch the profile, creating a seeded row on first login if needed. */
export async function ensureProfile(
  supabase: SupabaseClient,
  user: User,
): Promise<ProfileResult> {
  const { data: existing, error: selectError } = await supabase
    .from("profiles")
    .select("id, email, preview_credits, hd_unlocks")
    .eq("id", user.id)
    .maybeSingle();

  if (selectError) {
    console.error("[profile] select failed:", selectError.message);
    if (isMissingProfilesTable(selectError.message) || isMissingColumn(selectError.message)) {
      return {
        ok: false,
        needsMigration: true,
        error:
          "Database setup incomplete: re-run supabase/migrations/001_profiles_and_credits.sql in the Supabase SQL editor, then refresh this page.",
      };
    }
    return {
      ok: false,
      error: selectError.message,
    };
  }
  if (existing) {
    return { ok: true, profile: mapProfile(existing) };
  }

  const { data: created, error: insertError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email ?? null,
        preview_credits: PRICING.signupPreviewCredits,
        hd_unlocks: 0,
      },
      { onConflict: "id", ignoreDuplicates: true },
    )
    .select("id, email, preview_credits, hd_unlocks")
    .maybeSingle();

  if (insertError) {
    console.error("[profile] upsert failed:", insertError.message);
    if (isMissingProfilesTable(insertError.message) || isMissingColumn(insertError.message)) {
      return {
        ok: false,
        needsMigration: true,
        error:
          "Database setup incomplete: re-run supabase/migrations/001_profiles_and_credits.sql in the Supabase SQL editor, then refresh this page.",
      };
    }
    return { ok: false, error: insertError.message };
  }

  if (created) return { ok: true, profile: mapProfile(created) };

  const { data: retry, error: retryError } = await supabase
    .from("profiles")
    .select("id, email, preview_credits, hd_unlocks")
    .eq("id", user.id)
    .maybeSingle();

  if (retryError) {
    return { ok: false, error: retryError.message };
  }
  if (retry) return { ok: true, profile: mapProfile(retry) };

  return { ok: false, error: "Could not load your profile." };
}
