import type { SupabaseClient, User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  email: string | null;
  credits: number;
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

/** Fetch the profile, creating a 2-credit row on first login if needed. */
export async function ensureProfile(
  supabase: SupabaseClient,
  user: User,
): Promise<ProfileResult> {
  const { data: existing, error: selectError } = await supabase
    .from("profiles")
    .select("id, email, credits")
    .eq("id", user.id)
    .maybeSingle();

  if (selectError) {
    console.error("[profile] select failed:", selectError.message);
    if (isMissingProfilesTable(selectError.message)) {
      return {
        ok: false,
        needsMigration: true,
        error:
          "Database setup incomplete: run supabase/migrations/001_profiles_and_credits.sql in the Supabase SQL editor, then refresh this page.",
      };
    }
    return {
      ok: false,
      error: selectError.message,
    };
  }
  if (existing) {
    return { ok: true, profile: existing as Profile };
  }

  const { data: created, error: insertError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email ?? null,
        credits: 2,
      },
      { onConflict: "id", ignoreDuplicates: true },
    )
    .select("id, email, credits")
    .maybeSingle();

  if (insertError) {
    console.error("[profile] upsert failed:", insertError.message);
    if (isMissingProfilesTable(insertError.message)) {
      return {
        ok: false,
        needsMigration: true,
        error:
          "Database setup incomplete: run supabase/migrations/001_profiles_and_credits.sql in the Supabase SQL editor, then refresh this page.",
      };
    }
    return { ok: false, error: insertError.message };
  }

  if (created) return { ok: true, profile: created as Profile };

  const { data: retry, error: retryError } = await supabase
    .from("profiles")
    .select("id, email, credits")
    .eq("id", user.id)
    .maybeSingle();

  if (retryError) {
    return { ok: false, error: retryError.message };
  }
  if (retry) return { ok: true, profile: retry as Profile };

  return { ok: false, error: "Could not load your profile." };
}
