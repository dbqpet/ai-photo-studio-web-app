"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { ensureProfile, type Profile } from "@/lib/supabase/profile";

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  credits: number | null;
  profileError: string | null;
  needsDbSetup: boolean;
  loading: boolean;
  isConfigured: boolean;
  refreshProfile: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function useAuth(): AuthState {
  const configured = isSupabaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [needsDbSetup, setNeedsDbSetup] = useState(false);
  const [loading, setLoading] = useState(configured);

  const loadProfile = useCallback(async (nextUser: User | null) => {
    if (!nextUser || !isSupabaseConfigured()) {
      setProfile(null);
      setProfileError(null);
      setNeedsDbSetup(false);
      return;
    }
    const supabase = createClient();
    const result = await ensureProfile(supabase, nextUser);
    if (result.ok) {
      setProfile(result.profile);
      setProfileError(null);
      setNeedsDbSetup(false);
    } else {
      setProfile(null);
      setProfileError(result.error);
      setNeedsDbSetup(result.needsMigration ?? false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await loadProfile(user);
  }, [user, loadProfile]);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      setUser(data.user);
      void loadProfile(data.user).finally(() => {
        if (!cancelled) setLoading(false);
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      void loadProfile(nextUser);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [configured, loadProfile]);

  const signInWithGoogle = useCallback(async () => {
    if (!configured) {
      throw new Error(
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
    }

    // Preflight: avoid dumping users on a JSON "pretty print" page when
    // Google is not enabled in the Supabase dashboard.
    const settingsRes = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
      },
    );
    if (settingsRes.ok) {
      const settings = (await settingsRes.json()) as {
        external?: { google?: boolean };
      };
      if (!settings.external?.google) {
        throw new Error(
          "Google login is not enabled in Supabase. Open Authentication → Providers → Google, turn it on, and paste your Google Client ID + Client Secret.",
        );
      }
    }

    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }, [configured]);

  const signOut = useCallback(async () => {
    if (!configured) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [configured]);

  return {
    user,
    profile,
    credits: profile?.credits ?? null,
    profileError,
    needsDbSetup,
    loading,
    isConfigured: configured,
    refreshProfile,
    signInWithGoogle,
    signOut,
  };
}
