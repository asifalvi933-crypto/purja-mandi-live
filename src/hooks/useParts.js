// src/hooks/useParts.js
// Parts list, live updates, and add / mark-sold / delete.
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

  // Initial load + live updates
  useEffect(() => {
    if (!supabase) return;
    load();

    const unsubscribe = subscribeToParts({
      onUpsert: (item) =>
        setItems((prev) => [item, ...prev.filter((i) => i.id !== item.id)]),
      onRemove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
    });

    // Re-sync when the phone wakes up from sleep
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
      say("Part listed successfully");
      return true;
    } catch (e) {
      console.error(e);
      say("Couldn't list the part. Check your internet connection");
      return false;
    }
  };

  const toggleSold = async (id) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;
    const next = !target.sold;
    const setSold = (value) =>
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, sold: value } : i)));

    setSold(next); // update the screen first, then the database
    try {
      await setPartSold(id, next);
      say(next ? "Marked as sold" : "Marked as available again");
    } catch (e) {
      console.error(e);
      setSold(!next);
      say("Couldn't update. Please try again");
    }
  };

  const removeItem = async (id) => {
    const target = items.find((i) => i.id === id);
    try {
      await deletePart(id, target?.photo);
      setItems((prev) => prev.filter((i) => i.id !== id));
      say("Part deleted");
    } catch (e) {
      console.error(e);
      say("Couldn't delete the part. Please try again");
    }
  };

  return { items, status, retry, addItem, toggleSold, removeItem };
}
