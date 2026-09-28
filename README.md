# Purja Mandi

Purani gaadi ke spare parts ka mobile web app (React + Tailwind + Supabase).

## Chalane ke steps
1. `supabase-setup.sql` ko Supabase Dashboard > SQL Editor mein paste karke Run karein (sirf ek baar).
2. Supabase mein Authentication > Anonymous sign-ins ON karein.
3. `.env.example` ki copy banakar naam `.env.local` rakhein aur apni URL + Publishable key daalein.
4. Terminal mein:
   ```bash
   npm install
   npm run dev
   ```

## Folder ka naksha
- `src/lib/supabase.js`   Supabase connection (sirf yahin keys padhi jaati hain)
- `src/lib/partsApi.js`   Database + photo storage ke saare calls
- `src/hooks/`            useAuth (dealer login), useParts (list + live updates), useToast
- `src/constants/`        Brand, model, part ki suggestion lists
- `src/utils/`            Price/phone/WhatsApp links, photo compress
- `src/components/`       ui (chhote parts), layout, buyer, seller screens
- `src/App.jsx`           Sab kuch jodta hai
