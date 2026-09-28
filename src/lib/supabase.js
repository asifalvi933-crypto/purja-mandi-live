// src/lib/supabase.js
// Supabase ka connection yahin ek jagah set hota hai.
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const PHOTO_BUCKET = "part-photos";

// Agar .env.local mein keys nahi hain to null rehta hai
// (App tab saaf message dikhata hai, blank screen nahi).
export const supabase = url && key ? createClient(url, key) : null;
