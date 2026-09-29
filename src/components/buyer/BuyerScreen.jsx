// src/components/buyer/BuyerScreen.jsx
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Chip from "../ui/Chip";
import InfoCard from "../ui/InfoCard";
import PartCard from "./PartCard";
import { inputBase, inputCls } from "../ui/styles";

export default function BuyerScreen({ items, status, onRetry, ratingFor, onRate }) {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");

  const available = useMemo(() => items.filter((i) => !i.sold), [items]);

  const brands = useMemo(() => {
    const count = {};
    available.forEach((i) => {
      count[i.brand] = (count[i.brand] || 0) + 1;
    });
    return Object.keys(count).sort((a, b) => count[b] - count[a]);
  }, [available]);

  const models = useMemo(() => {
    if (!brand) return [];
    const seen = new Map();
    available
      .filter((i) => i.brand === brand)
      .forEach((i) => {
        const k = i.model.toLowerCase();
        if (!seen.has(k)) seen.set(k, i.model);
      });
    return [...seen.values()].sort();
  }, [available, brand]);

  const results = useMemo(() => {
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    return available
      .filter((i) => {
        if (brand && i.brand !== brand) return false;
        if (model && i.model.toLowerCase() !== model.toLowerCase()) return false;
        const hay = `${i.part} ${i.brand} ${i.model} ${i.location} ${i.dealerName}`.toLowerCase();
        return tokens.every((t) => hay.includes(t));
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [available, q, brand, model]);

  const hasFilter = q || brand || model;
  const clearAll = () => {
    setQ("");
    setBrand("");
    setModel("");
  };

  let body;
  if (status === "loading") {
    body = <p className="text-center text-slate-600 py-10">Loading parts...</p>;
  } else if (status === "error") {
    body = (
      <InfoCard
        title="Couldn't load parts"
        text="Check your internet connection and try again."
        action="Try again"
        onAction={onRetry}
      />
    );
  } else if (available.length === 0) {
    body = (
      <InfoCard
        title="No parts listed yet"
        text="Sellers can add their first part from the Sell tab."
      />
    );
  } else if (results.length === 0) {
    body = (
      <InfoCard
        title="No matching parts found"
        text="Try a different search term or clear the filters."
        action="Show all parts"
        onAction={clearAll}
      />
    );
  } else {
    body = (
      <div className="space-y-3">
        {results.map((i) => (
          <PartCard key={i.id} item={i} rating={ratingFor(i.dealerId)} onRate={onRate} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-10 bg-stone-100 px-4 pt-3 pb-2 border-b border-stone-200">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={20}
            aria-hidden="true"
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a part or car, e.g. Swift headlight"
            aria-label="Search parts"
            className={inputBase + " pl-10 pr-3"}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto mt-2 pb-1">
          <Chip
            active={!brand}
            onClick={() => {
              setBrand("");
              setModel("");
            }}
          >
            All cars
          </Chip>
          {brands.map((b) => (
            <Chip
              key={b}
              active={brand === b}
              onClick={() => {
                setBrand(brand === b ? "" : b);
                setModel("");
              }}
            >
              {b}
            </Chip>
          ))}
        </div>

        {brand && models.length > 0 && (
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            aria-label="Select model"
            className={inputCls + " mt-2"}
          >
            <option value="">All {brand} models</option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="px-4 py-3">
        {status === "ready" && available.length > 0 && (
          <div className="flex items-center justify-between mb-2 text-sm text-slate-600">
            <span>{results.length} parts found</span>
            {hasFilter && (
              <button onClick={clearAll} className="font-medium text-slate-900 underline">
                Clear filters
              </button>
            )}
          </div>
        )}
        {body}
      </div>
    </div>
  );
}
