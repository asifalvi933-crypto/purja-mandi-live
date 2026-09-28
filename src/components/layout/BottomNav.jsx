import { ShoppingBag, Store } from "lucide-react";

function NavBtn({ active, icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={
        "h-16 flex flex-col items-center justify-center gap-0.5 text-sm font-semibold border-t-4 focus:outline-none focus-visible:bg-stone-100 " +
        (active ? "border-amber-400 text-slate-900" : "border-transparent text-slate-500")
      }
    >
      <Icon size={22} aria-hidden="true" />
      {label}
    </button>
  );
}

export default function BottomNav({ tab, onChange }) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-stone-200"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-md mx-auto grid grid-cols-2">
        <NavBtn
          active={tab === "buy"}
          icon={ShoppingBag}
          label="Kharidein"
          onClick={() => onChange("buy")}
        />
        <NavBtn
          active={tab === "sell"}
          icon={Store}
          label="Bechein"
          onClick={() => onChange("sell")}
        />
      </div>
    </nav>
  );
}
