// src/components/seller/SellerScreen.jsx
import { useState } from "react";
import { LogOut, Pencil } from "lucide-react";
import InfoCard from "../ui/InfoCard";
import StarRating from "../ui/StarRating";
import EmailAuth from "./EmailAuth";
import ProfileForm from "./ProfileForm";
import PartForm from "./PartForm";
import MyPartRow from "./MyPartRow";

export default function SellerScreen({
  auth, rating, saveProfile, items, addItem, toggleSold, removeItem,
}) {
  const [editing, setEditing] = useState(false);
  const [armedId, setArmedId] = useState(null);

  if (auth.loading) {
    return <div className="px-4 py-10 text-center text-slate-600">One moment...</div>;
  }

  // Login/Signup screen
  if (!auth.user) {
    return <EmailAuth onSignUp={auth.signUp} onSignIn={auth.signIn} busy={auth.busy} />;
  }

  // First time (or after tapping "Edit") - shop details
  if (!auth.me || editing) {
    return (
      <ProfileForm
        initial={auth.me}
        onSave={async (p) => {
          if (await saveProfile(p)) setEditing(false);
        }}
        onCancel={auth.me ? () => setEditing(false) : null}
      />
    );
  }

  const me = auth.me;
  const mine = items
    .filter((i) => i.dealerId === auth.uid)
    .sort((a, b) => Number(a.sold) - Number(b.sold) || b.createdAt - a.createdAt);
  const liveCount = mine.filter((i) => !i.sold).length;

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
            <p className="text-xs text-slate-500 truncate">{auth.email}</p>
            <div className="mt-1">
              <StarRating avg={rating.avg} count={rating.count} />
            </div>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="h-10 px-3 rounded-lg border border-stone-300 text-sm font-medium text-slate-700 flex items-center gap-1"
          >
            <Pencil size={14} aria-hidden="true" /> Edit
          </button>
        </div>
        <button
          onClick={auth.signOut}
          className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-500"
        >
          <LogOut size={14} aria-hidden="true" /> Log out
        </button>
      </div>

      <PartForm onAdd={addItem} />

      <section>
        <h2 className="text-lg font-bold text-slate-900">My inventory</h2>
        <p className="text-sm text-slate-600 mb-3">
          {liveCount} available, {mine.length - liveCount} sold
        </p>
        {mine.length === 0 ? (
          <InfoCard title="No parts listed yet" text="Fill in the form above to add your first part." />
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
