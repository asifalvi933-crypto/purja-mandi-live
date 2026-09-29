export default function SetupNeeded() {
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
      <div className="max-w-md bg-white rounded-xl border border-stone-200 p-5">
        <h1 className="text-lg font-bold text-slate-900">Supabase keys not found</h1>
        <p className="text-sm text-slate-600 mt-2">
          Create a <code>.env.local</code> file in the project folder and add{" "}
          <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> to it.
          Then stop and restart <code>npm run dev</code> in the terminal.
        </p>
      </div>
    </div>
  );
}
