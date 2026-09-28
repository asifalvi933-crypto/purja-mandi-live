// src/hooks/useParts.js
// Parts ki list, live updates, aur add / sold / delete.
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  fetchParts,
  uploadPhoto,
  insertPart,
  setPartSold,
  deletePart,
  subscribeToParts,
} from "../lib/partsApi";

export function useParts({ uid, me, say }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  const load = useCallback(async () => {
    if (!supabase) return;
    try {
      setItems(await fetchParts(uid));
      setStatus("ready");
    } catch (e) {
      console.error(e);
      setStatus((s) => (s === "ready" ? s : "error"));
    }
  }, [uid]);

  // Pehli baar load + live updates
  useEffect(() => {
    if (!supabase) return;
    load();

    const unsubscribe = subscribeToParts({
      onUpsert: (item) =>
        setItems((prev) => [item, ...prev.filter((i) => i.id !== item.id)]),
      onRemove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
    });

    // Phone sleep se wapas aaye to data dobara sync karo
    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      unsubscribe();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  const retry = useCallback(() => {
    setStatus("loading");
    load();
  }, [load]);

  const addItem = async ({ brand, model, part, price, photo }) => {
    try {
      const photoUrl = photo ? await uploadPhoto(uid, photo) : null;
      const item = await insertPart({ me, brand, model, part, price, photoUrl });
      setItems((prev) => [item, ...prev.filter((i) => i.id !== item.id)]);
      say("Part list ho gaya");
      return true;
    } catch (e) {
      console.error(e);
      say("Part list nahi hua. Internet check karein");
      return false;
    }
  };

  const toggleSold = async (id) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;
    const next = !target.sold;
    const setSold = (value) =>
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, sold: value } : i)));

    setSold(next); // pehle screen badlo, phir database
    try {
      await setPartSold(id, next);
      say(next ? "Sold mark ho gaya" : "Wapas available ho gaya");
    } catch (e) {
      console.error(e);
      setSold(!next);
      say("Update nahi hua. Dobara try karein");
    }
  };

  const removeItem = async (id) => {
    const target = items.find((i) => i.id === id);
    try {
      await deletePart(id, target?.photo);
      setItems((prev) => prev.filter((i) => i.id !== id));
      say("Part hata diya");
    } catch (e) {
      console.error(e);
      say("Part nahi hata. Dobara try karein");
    }
  };

  return { items, status, retry, addItem, toggleSold, removeItem };
}
