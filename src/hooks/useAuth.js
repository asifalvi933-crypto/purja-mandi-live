// src/hooks/useAuth.js
// Seller email + password login.
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email, password) => {
    setBusy(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setBusy(false);
    return { error };
  }, []);

  const signIn = useCallback(async (email, password) => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const saveProfile = useCallback(async (profile) => {
    const { data, error } = await supabase.auth.updateUser({ data: profile });
    if (error) throw error;
    setUser(data.user);
    return data.user;
  }, []);

  const meta = user?.user_metadata || {};
  const me = meta.shop ? { shop: meta.shop, phone: meta.phone, location: meta.location } : null;

  return {
    user, uid: user?.id, email: user?.email, me,
    loading, busy, signUp, signIn, signOut, saveProfile,
  };
}
