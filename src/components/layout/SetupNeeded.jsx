export default function SetupNeeded() {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
      <div className="max-w-md bg-white rounded-xl border border-stone-200 p-5">
        <h1 className="text-lg font-bold text-slate-900">Supabase keys nahi mile</h1>
        <p className="text-sm text-slate-600 mt-2">
          Project folder mein <code>.env.local</code> file banayein aur usme{" "}
          <code>VITE_SUPABASE_URL</code> aur <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> daalein.
          Phir terminal mein <code>npm run dev</code> band karke dobara chalayein.
        </p>
      </div>
    </div>
  );
}
