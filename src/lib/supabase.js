// src/lib/supabase.js
// The Supabase connection is set up here, in one place.
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const PHOTO_BUCKET = "part-photos";

// Stays null if keys are missing from .env.local
// (the App then shows a clear message instead of a blank screen).
export const supabase = url && key ? createClient(url, key) : null;
