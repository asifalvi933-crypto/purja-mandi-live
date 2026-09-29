// src/components/buyer/PartCard.jsx
import { useState } from "react";
import { Phone, MessageCircle, MapPin, Star, CheckCircle2 } from "lucide-react";
import Thumb from "../ui/Thumb";
import StarRating from "../ui/StarRating";
import RateSellerModal from "./RateSellerModal";
import { fmtPrice, telLink, waLink } from "../../utils/format";
import { hasContacted, markContacted, hasRated, markRated } from "../../utils/device";

export default function PartCard({ item, rating, onRate }) {
  const [showRate, setShowRate] = useState(false);
  const [contacted, setContacted] = useState(() => hasContacted(item.id));
  const [rated, setRated] = useState(() => hasRated(item.id));

  const handleContact = () => {
    markContacted(item.id);
    setContacted(true);
  };

  const handleSubmitRating = async ({ rating: r, comment }) => {
    const ok = await onRate({ partId: item.id, rating: r, comment });
    if (ok) {
      markRated(item.id);
      setRated(true);
    }
    return ok;
  };

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
          <div className="mt-1">
            <StarRating avg={rating.avg} count={rating.count} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 px-3">
        <a
          href={telLink(item)}
          onClick={handleContact}
          className="h-11 rounded-lg bg-slate-800 text-white font-semibold flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 active:bg-slate-900"
        >
          <Phone size={18} aria-hidden="true" /> Call Now
        </a>
        <a
          href={waLink(item)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleContact}
          className="h-11 rounded-lg bg-green-600 text-white font-semibold flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 active:bg-green-700"
        >
          <MessageCircle size={18} aria-hidden="true" /> WhatsApp
        </a>
      </div>

      <div className="px-3 pt-2 pb-3">
        {rated ? (
          <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-green-700 h-10">
            <CheckCircle2 size={16} aria-hidden="true" /> Thanks for rating!
          </p>
        ) : contacted ? (
          <button
            onClick={() => setShowRate(true)}
            className="w-full h-10 rounded-lg border border-stone-300 text-sm font-medium text-slate-700 flex items-center justify-center gap-1.5 active:bg-stone-50"
          >
            <Star size={15} className="text-amber-500" aria-hidden="true" />
            Rate this seller
          </button>
        ) : (
          <div className="text-center">
            <button
              disabled
              className="w-full h-10 rounded-lg border border-stone-200 text-sm font-medium text-stone-400 flex items-center justify-center gap-1.5"
            >
              <Star size={15} aria-hidden="true" />
              Rate this seller
            </button>
            <p className="text-xs text-slate-500 mt-1">
              Call or WhatsApp the seller first to unlock rating.
            </p>
          </div>
        )}
      </div>

      {showRate && (
        <RateSellerModal
          dealerName={item.dealerName}
          onSubmit={handleSubmitRating}
          onClose={() => setShowRate(false)}
        />
      )}
    </article>
  );
}
