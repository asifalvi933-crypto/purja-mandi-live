import { CheckCircle2, Trash2, Undo2 } from "lucide-react";
import Thumb from "../ui/Thumb";
import { fmtPrice } from "../../utils/format";

export default function MyPartRow({ item, armed, onToggleSold, onDelete }) {
  return (
    <div
      className={
        "bg-white rounded-xl border border-stone-200 p-3 " + (item.sold ? "opacity-75" : "")
      }
    >
      <div className="flex gap-3">
        <Thumb src={item.photo} alt={item.part} className="w-20 h-20" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900 leading-snug">{item.part}</h3>
            {item.sold && (
              <span className="shrink-0 bg-red-700 text-white text-xs font-semibold px-2 py-0.5 rounded">
                Sold
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600">
            {item.brand} {item.model}
          </p>
          <p className="font-bold text-slate-900">{fmtPrice(item.price)}</p>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={onToggleSold}
          className={
            "flex-1 h-11 rounded-lg font-semibold flex items-center justify-center gap-2 " +
            (item.sold
              ? "border border-stone-300 bg-white text-slate-700"
              : "bg-slate-900 text-white")
          }
        >
          {item.sold ? (
            <>
              <Undo2 size={18} aria-hidden="true" /> Wapas available karein
            </>
          ) : (
            <>
              <CheckCircle2 size={18} aria-hidden="true" /> Sold ho gaya
            </>
          )}
        </button>
        <button
          onClick={onDelete}
          aria-label="Part hatayein"
          className={
            "h-11 rounded-lg border font-medium flex items-center justify-center gap-1 " +
            (armed
              ? "px-3 bg-red-700 border-red-700 text-white"
              : "w-11 border-stone-300 bg-white text-red-700")
          }
        >
          <Trash2 size={18} aria-hidden="true" />
          {armed && <span className="text-sm">Pakka?</span>}
        </button>
      </div>
    </div>
  );
}
