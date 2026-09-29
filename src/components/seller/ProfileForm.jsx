import { useState } from "react";
import Field from "../ui/Field";
import { inputCls } from "../ui/styles";
import { isValidPhone } from "../../utils/format";

export default function ProfileForm({ initial, onSave, onCancel }) {
  const [shop, setShop] = useState(initial?.shop || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [location, setLocation] = useState(initial?.location || "");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!shop.trim() || !location.trim()) {
      setErr("Please enter your shop name and location.");
      return;
    }
    if (!isValidPhone(phone)) {
      setErr("Please enter a valid 10-digit mobile number.");
      return;
    }
    setErr("");
    setSaving(true);
    await onSave({ shop: shop.trim(), phone: phone.trim(), location: location.trim() });
    setSaving(false);
  };

  return (
    <div className="px-4 py-5">
      <h2 className="text-xl font-bold text-slate-900">Your shop details</h2>
      <p className="text-sm text-slate-600 mt-1">
        Buyers will call or WhatsApp you on this number.
      </p>

      <div className="mt-4 space-y-4">
        <Field label="Shop name">
          <input
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            placeholder="e.g. Sharma Auto Spares"
            maxLength={60}
            className={inputCls}
          />
        </Field>
        <Field label="Mobile number (WhatsApp)">
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="98XXXXXXXX"
            maxLength={20}
            className={inputCls}
          />
        </Field>
        <Field label="Location" hint="Area and city, e.g. Mayapuri, Delhi">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Area, city"
            maxLength={80}
            className={inputCls}
          />
        </Field>
      </div>

      {err && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-700">
          {err}
        </p>
      )}

      <div className="mt-5 flex gap-2">
        <button
          onClick={submit}
          disabled={saving}
          className="flex-1 h-12 rounded-lg bg-amber-400 text-slate-900 font-bold text-base disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="h-12 px-4 rounded-lg border border-stone-300 bg-white text-slate-700 font-medium"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
