import { useState } from "react";
import { Camera, X } from "lucide-react";
import Field from "../ui/Field";
import { inputCls } from "../ui/styles";
import { BRANDS, MODEL_HINTS, PART_HINTS } from "../../constants/carData";
import { compressImage } from "../../utils/image";

export default function PartForm({ onAdd }) {
  const [photo, setPhoto] = useState(null);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [part, setPart] = useState("");
  const [price, setPrice] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  const pickPhoto = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      setPhoto(await compressImage(file));
    } catch {
      setErr("Photo nahi khul payi. Doosri photo try karein.");
    }
    setBusy(false);
  };

  const submit = async () => {
    const p = Number(price);
    if (!brand || !model.trim() || !part.trim() || !p || p <= 0) {
      setErr("Brand, model, part ka naam aur price bharna zaroori hai.");
      return;
    }
    setErr("");
    setSaving(true);
    const ok = await onAdd({
      brand,
      model: model.trim().replace(/\s+/g, " "),
      part: part.trim().replace(/\s+/g, " "),
      price: Math.round(p),
      photo,
    });
    setSaving(false);
    if (ok) {
      // Brand aur model rakhte hain: ek gaadi ke kai parts jaldi daal sakein
      setPart("");
      setPrice("");
      setPhoto(null);
    }
  };

  return (
    <section className="bg-white rounded-xl border border-stone-200 p-4">
      <h2 className="text-lg font-bold text-slate-900">Naya part daalein</h2>

      <div className="mt-3 space-y-4">
        <div>
          <label className="relative block h-44 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 overflow-hidden cursor-pointer focus-within:ring-2 focus-within:ring-amber-400">
            <input type="file" accept="image/*" onChange={pickPhoto} className="sr-only" />
            {photo ? (
              <img src={photo} alt="Part ki photo" className="w-full h-full object-cover" />
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-1 text-slate-600">
                <Camera size={32} aria-hidden="true" />
                <span className="font-medium">
                  {busy ? "Photo lag rahi hai..." : "Part ki photo lagayein"}
                </span>
                <span className="text-xs text-slate-500">Camera ya gallery se</span>
              </div>
            )}
          </label>
          {photo && (
            <button
              onClick={() => setPhoto(null)}
              className="mt-2 flex items-center gap-1 text-sm font-medium text-red-700"
            >
              <X size={16} aria-hidden="true" /> Photo hatayein
            </button>
          )}
        </div>

        <Field label="Gaadi ka brand">
          <select value={brand} onChange={(e) => setBrand(e.target.value)} className={inputCls}>
            <option value="">Brand chunein</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Model">
          <input
            list="model-list"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Jaise Swift, i10, Bolero"
            maxLength={40}
            className={inputCls}
          />
          <datalist id="model-list">
            {(MODEL_HINTS[brand] || []).map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </Field>

        <Field label="Part ka naam">
          <input
            list="part-list"
            value={part}
            onChange={(e) => setPart(e.target.value)}
            placeholder="Jaise Headlight, Gearbox"
            maxLength={80}
            className={inputCls}
          />
          <datalist id="part-list">
            {PART_HINTS.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </Field>

        <Field label="Price (₹)">
          <input
            type="number"
            inputMode="numeric"
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Jaise 1800"
            className={inputCls}
          />
        </Field>
      </div>

      {err && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-700">
          {err}
        </p>
      )}

      <button
        onClick={submit}
        disabled={saving || busy}
        className="mt-4 w-full h-12 rounded-lg bg-amber-400 text-slate-900 font-bold text-base active:bg-amber-500 disabled:opacity-60"
      >
        {saving ? "List ho raha hai..." : "Part list karein"}
      </button>
    </section>
  );
}
