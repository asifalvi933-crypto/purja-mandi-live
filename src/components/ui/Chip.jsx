export default function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={
        "shrink-0 h-9 px-4 rounded-full text-sm font-medium border focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 " +
        (active
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white text-slate-700 border-stone-300")
      }
    >
      {children}
    </button>
  );
}
