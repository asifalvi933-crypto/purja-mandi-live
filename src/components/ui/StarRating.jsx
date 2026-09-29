// src/components/ui/StarRating.jsx
import { Star } from "lucide-react";

export default function StarRating({ avg = 0, count = 0, size = 14 }) {
  if (count === 0) {
    return <span className="text-xs text-slate-500">New seller, no ratings yet</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
      <Star size={size} className="text-amber-500 fill-amber-500" aria-hidden="true" />
      {avg}
      <span className="font-normal text-slate-500">({count})</span>
    </span>
  );
}
