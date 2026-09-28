import { Phone, MessageCircle, MapPin } from "lucide-react";
import Thumb from "../ui/Thumb";
import { fmtPrice, telLink, waLink } from "../../utils/format";

export default function PartCard({ item }) {
  return (
    <article className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="flex gap-3 p-3">
        <Thumb src={item.photo} alt={item.part} />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-base leading-snug text-slate-900">{item.part}</h3>
          <p className="text-sm text-slate-600">
            {item.brand} {item.model}
          </p>
          <p className="mt-1.5 inline-block bg-amber-400 text-slate-900 text-lg font-bold px-2.5 py-0.5 rounded">
            {fmtPrice(item.price)}
          </p>
          <p className="mt-1.5 flex items-center gap-1 text-sm text-slate-700">
            <MapPin size={14} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{item.location}</span>
          </p>
          <p className="text-xs text-slate-500 truncate">{item.dealerName}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 px-3 pb-3">
        <a
          href={telLink(item)}
          className="h-11 rounded-lg bg-slate-800 text-white font-semibold flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 active:bg-slate-900"
        >
          <Phone size={18} aria-hidden="true" /> Call Now
        </a>
        <a
          href={waLink(item)}
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 rounded-lg bg-green-600 text-white font-semibold flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 active:bg-green-700"
        >
          <MessageCircle size={18} aria-hidden="true" /> WhatsApp
        </a>
      </div>
    </article>
  );
}
