// src/components/buyer/RateSellerModal.jsx
import { useState } from "react";
import { Star, X } from "lucide-react";

export default function RateSellerModal({ dealerName, onSubmit, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    if (rating === 0) {
      setErr("Please select at least 1 star.");
      return;
    }
    setErr("");
    setSaving(true);
    const ok = await onSubmit({ rating, comment: comment.trim() });
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-2xl p-5 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 pr-2">
            Rate {dealerName}
          </h3>
          <button onClick={onClose} aria-label="Close" className="shrink-0">
            <X size={22} className="text-slate-500" aria-hidden="true" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mt-1">
          Did you get the right part? Was it on time? Help other buyers decide.
        </p>

        <div className="flex justify-center gap-2 mt-5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setRating(n)}
              aria-label={`${n} star`}
              className="p-1"
            >
              <Star
                size={36}
                className={n <= rating ? "text-amber-500 fill-amber-500" : "text-stone-300"}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={300}
          rows={3}
          placeholder="Share your experience (optional) — e.g. got the right part, delivered on time"
          className="mt-4 w-full rounded-lg border border-stone-300 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        {err && (
          <p role="alert" className="mt-2 text-sm font-medium text-red-700">
            {err}
          </p>
        )}

        <button
          onClick={submit}
          disabled={saving}
          className="mt-4 w-full h-12 rounded-lg bg-amber-400 text-slate-900 font-bold text-base disabled:opacity-60"
        >
          {saving ? "Submitting..." : "Submit rating"}
        </button>
      </div>
    </div>
  );
}
