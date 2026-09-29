// src/hooks/useReviews.js
// Loads all reviews, live updates, and computes average rating.
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { fetchReviews, insertReview, subscribeToReviews } from "../lib/partsApi";
import { getDeviceId } from "../utils/device";

export function useReviews({ say }) {
  const [reviews, setReviews] = useState([]);

  const load = useCallback(async () => {
    if (!supabase) return;
    try {
      setReviews(await fetchReviews());
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    load();
    const unsubscribe = subscribeToReviews({
      onInsert: (r) => setReviews((prev) => [r, ...prev]),
    });
    return unsubscribe;
  }, [load]);

  // Returns average rating and count for a given dealer
  const ratingFor = useCallback(
    (dealerId) => {
      const mine = reviews.filter((r) => r.dealerId === dealerId);
      if (mine.length === 0) return { avg: 0, count: 0 };
      const avg = mine.reduce((sum, r) => sum + r.rating, 0) / mine.length;
      return { avg: Math.round(avg * 10) / 10, count: mine.length };
    },
    [reviews]
  );

  // true = submitted (or was already submitted), false = a real error
  const addReview = async ({ partId, rating, comment }) => {
    try {
      const deviceId = getDeviceId();
      const r = await insertReview({ partId, rating, comment, deviceId });
      setReviews((prev) => [r, ...prev]);
      say("Rating submitted. Thank you!");
      return true;
    } catch (e) {
      console.error(e);
      const isDuplicate = e?.code === "23505" || /duplicate key/i.test(e?.message || "");
      if (isDuplicate) {
        say("You've already rated this part.");
        return true; // this device can't do it again, so treat it as "rated"
      }
      say("Couldn't submit the rating. Please try again");
      return false;
    }
  };

  return { reviews, ratingFor, addReview };
}
