// src/lib/partsApi.js
// All database and storage calls live here.
// UI files never talk to supabase directly.
import { supabase, PHOTO_BUCKET } from "./supabase";

// Converts a database row into the shape the UI uses
export const fromRow = (r) => ({
  id: r.id,
  dealerId: r.dealer_id,
  dealerName: r.dealer_name,
  phone: r.phone,
  location: r.location,
  brand: r.brand,
  model: r.model,
  part: r.part,
  price: r.price,
  photo: r.photo_url,
  sold: r.sold,
  createdAt: new Date(r.created_at).getTime(),
});

// Extracts the storage path from a photo's public URL (for deleting)
const photoPath = (url) => {
  const rest = url && url.split(`/${PHOTO_BUCKET}/`)[1];
  return rest ? decodeURIComponent(rest.split("?")[0]) : null;
};

// Everyone's available parts + this dealer's own sold parts
export async function fetchParts(dealerId) {
  let q = supabase
    .from("parts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);
  q = dealerId ? q.or(`sold.eq.false,dealer_id.eq.${dealerId}`) : q.eq("sold", false);
  const { data, error } = await q;
  if (error) throw error;
  return data.map(fromRow);
}

export async function uploadPhoto(dealerId, dataUrl) {
  const blob = await (await fetch(dataUrl)).blob();
  const path = `${dealerId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
  if (error) throw error;
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function insertPart({ me, brand, model, part, price, photoUrl }) {
  const { data, error } = await supabase
    .from("parts")
    .insert({
      dealer_name: me.shop,
      phone: me.phone,
      location: me.location,
      brand,
      model,
      part,
      price,
      photo_url: photoUrl,
    })
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function setPartSold(id, sold) {
  const { error } = await supabase.from("parts").update({ sold }).eq("id", id);
  if (error) throw error;
}

export async function deletePart(id, photoUrl) {
  const { error } = await supabase.from("parts").delete().eq("id", id);
  if (error) throw error;
  const path = photoPath(photoUrl);
  if (path) supabase.storage.from(PHOTO_BUCKET).remove([path]);
}

// When a dealer updates their details, it also applies to their existing parts
export async function updateDealerParts(dealerId, profile) {
  const { error } = await supabase
    .from("parts")
    .update({ dealer_name: profile.shop, phone: profile.phone, location: profile.location })
    .eq("dealer_id", dealerId);
  if (error) throw error;
}

// Live updates. Call the returned function to unsubscribe.
export function subscribeToParts({ onUpsert, onRemove }) {
  // A fresh channel name each time avoids double-subscribe errors in React StrictMode
  const channel = supabase
    .channel(`parts-live-${Math.random().toString(36).slice(2, 8)}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "parts" }, (payload) => {
      if (payload.eventType === "DELETE") onRemove(payload.old.id);
      else onUpsert(fromRow(payload.new));
    })
    .subscribe();
  return () => supabase.removeChannel(channel);
}

// Converts a database review row into the shape the UI uses
const fromReviewRow = (r) => ({
  id: r.id,
  dealerId: r.dealer_id,
  partId: r.part_id,
  rating: r.rating,
  comment: r.comment,
  createdAt: new Date(r.created_at).getTime(),
});

export async function fetchReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3000);
  if (error) throw error;
  return data.map(fromReviewRow);
}

// No need to send dealer_id from here - the database itself
// derives the real dealer from part_id (spoof-proof).
export async function insertReview({ partId, rating, comment, deviceId }) {
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      part_id: partId,
      rating,
      comment: comment || null,
      device_id: deviceId,
    })
    .select()
    .single();
  if (error) throw error;
  return fromReviewRow(data);
}

// Live updates: as soon as anyone submits a review, everyone sees it instantly
export function subscribeToReviews({ onInsert }) {
  const channel = supabase
    .channel(`reviews-live-${Math.random().toString(36).slice(2, 8)}`)
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "reviews" }, (payload) => {
      onInsert(fromReviewRow(payload.new));
    })
    .subscribe();
  return () => supabase.removeChannel(channel);
}
