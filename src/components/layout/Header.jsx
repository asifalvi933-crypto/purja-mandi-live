import { Cog } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-slate-900 text-white px-4 py-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center">
        <Cog size={24} strokeWidth={2.5} aria-hidden="true" />
      </div>
      <div>
        <h1 className="text-xl font-bold leading-tight">Purja Mandi</h1>
        <p className="text-sm text-slate-300">Purani gaadi ke spare parts</p>
      </div>
    </header>
  );
}
