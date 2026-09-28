// src/hooks/useAuth.js
// Dealer ka login. Buyers ke liye login nahi banta.
// Dealer jab pehli baar "Bechein" kholta hai tabhi anonymous account banta hai.
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [busy, setBusy] = useState(false);

  // Purana login (agar dealer pehle aa chuka hai) wapas uthao
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signInDealer = useCallback(async () => {
    if (!supabase) return { error: new Error("Supabase keys missing") };
    setBusy(true);
    const { error } = await supabase.auth.signInAnonymously();
    setBusy(false);
    return { error };
  }, []);

  // Dukaan ka naam, number, location dealer ke account mein save hota hai
  const saveProfile = useCallback(async (profile) => {
    const { data, error } = await supabase.auth.updateUser({ data: profile });
    if (error) throw error;
    setUser(data.user);
    return data.user;
  }, []);

  const meta = user?.user_metadata || {};
  const me = meta.shop
    ? { shop: meta.shop, phone: meta.phone, location: meta.location }
    : null;

  return { user, uid: user?.id, me, busy, signInDealer, saveProfile };
}
