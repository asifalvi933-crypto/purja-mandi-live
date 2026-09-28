import { useState } from "react";
import { Pencil } from "lucide-react";
import InfoCard from "../ui/InfoCard";
import ProfileForm from "./ProfileForm";
import PartForm from "./PartForm";
import MyPartRow from "./MyPartRow";

export default function SellerScreen({
  me, myId, authReady, authBusy, onRetryAuth,
  saveProfile, items, addItem, toggleSold, removeItem,
}) {
  const [editing, setEditing] = useState(false);
  const [armedId, setArmedId] = useState(null);

  // Dealer ka account abhi ban raha hai (ya nahi bana)
  if (!authReady) {
    return (
      <div className="px-4 py-10 text-center">
        {authBusy ? (
          <p className="text-slate-600">Ek second...</p>
        ) : (
          <InfoCard
            title="Dealer login nahi ho paya"
            text="Internet check karein aur dobara try karein."
            action="Dobara try karein"
            onAction={onRetryAuth}
          />
        )}
      </div>
    );
  }

  // Pehli baar (ya "Badlein" dabane par) dukaan ki jaankari
  if (!me || editing) {
    return (
      <ProfileForm
        initial={me}
        onSave={async (p) => {
          if (await saveProfile(p)) setEditing(false);
        }}
        onCancel={me ? () => setEditing(false) : null}
      />
    );
  }

  const mine = items
    .filter((i) => i.dealerId === myId)
    .sort((a, b) => Number(a.sold) - Number(b.sold) || b.createdAt - a.createdAt);
  const liveCount = mine.filter((i) => !i.sold).length;

  // Delete ke liye do baar tap: pehle "Pakka?", phir hatega
  const handleDelete = (id) => {
    if (armedId === id) {
      removeItem(id);
      setArmedId(null);
    } else {
      setArmedId(id);
    }
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="bg-white rounded-xl border border-stone-200 p-3">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900 truncate">{me.shop}</p>
            <p className="text-sm text-slate-600 truncate">
              {me.phone}, {me.location}
            </p>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="h-10 px-3 rounded-lg border border-stone-300 text-sm font-medium text-slate-700 flex items-center gap-1"
          >
            <Pencil size={14} aria-hidden="true" /> Badlein
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Apne parts sirf isi phone ke browser se badal sakte hain. Browser data clear na karein.
        </p>
      </div>

      <PartForm onAdd={addItem} />

      <section>
        <h2 className="text-lg font-bold text-slate-900">Meri inventory</h2>
        <p className="text-sm text-slate-600 mb-3">
          {liveCount} available, {mine.length - liveCount} sold
        </p>

        {mine.length === 0 ? (
          <InfoCard title="Abhi koi part list nahi hai" text="Upar form bharke pehla part daalein." />
        ) : (
          <div className="space-y-3">
            {mine.map((i) => (
              <MyPartRow
                key={i.id}
                item={i}
                armed={armedId === i.id}
                onToggleSold={() => toggleSold(i.id)}
                onDelete={() => handleDelete(i.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
