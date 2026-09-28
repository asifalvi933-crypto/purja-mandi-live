// src/lib/partsApi.js
// Database aur storage ke saare calls yahin hain.
// UI ki files mein supabase ka koi seedha code nahi hota.
import { supabase, PHOTO_BUCKET } from "./supabase";

// Database ki row ko UI ke item mein badalta hai
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

// Photo ke public link se storage ka path nikalta hai (delete ke liye)
const photoPath = (url) => {
  const rest = url && url.split(`/${PHOTO_BUCKET}/`)[1];
  return rest ? decodeURIComponent(rest.split("?")[0]) : null;
};

// Sab ke available parts + dealer ke apne sold parts
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

// Dealer ki jaankari badalne par uske purane parts par bhi lagti hai
export async function updateDealerParts(dealerId, profile) {
  const { error } = await supabase
    .from("parts")
    .update({ dealer_name: profile.shop, phone: profile.phone, location: profile.location })
    .eq("dealer_id", dealerId);
  if (error) throw error;
}

// Live updates. Band karne ke liye jo function milta hai use call karein.
export function subscribeToParts({ onUpsert, onRemove }) {
  // Har baar naya naam: React dev mode (StrictMode) mein double-subscribe error se bachata hai
  const channel = supabase
    .channel(`parts-live-${Math.random().toString(36).slice(2, 8)}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "parts" }, (payload) => {
      if (payload.eventType === "DELETE") onRemove(payload.old.id);
      else onUpsert(fromRow(payload.new));
    })
    .subscribe();
  return () => supabase.removeChannel(channel);
}
