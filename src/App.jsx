// src/App.jsx
// Just wires things together: tabs, hooks, and screens.
import { useState } from "react";
import { supabase } from "./lib/supabase";
import { updateDealerParts } from "./lib/partsApi";
import { useAuth } from "./hooks/useAuth";
import { useParts } from "./hooks/useParts";
import { useReviews } from "./hooks/useReviews";
import { useToast } from "./hooks/useToast";
import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";
import Toast from "./components/layout/Toast";
import SetupNeeded from "./components/layout/SetupNeeded";
import BuyerScreen from "./components/buyer/BuyerScreen";
import SellerScreen from "./components/seller/SellerScreen";

export default function App() {
  const [tab, setTab] = useState("buy");
  const [toast, say] = useToast();
  const auth = useAuth();
  const parts = useParts({ uid: auth.uid, me: auth.me, say });
  const reviews = useReviews({ say });

  const goTab = (t) => {
    setTab(t);
    window.scrollTo(0, 0);
  };

  const saveProfile = async (profile) => {
    try {
      const user = await auth.saveProfile(profile);
      await updateDealerParts(user.id, profile);
      say("Details saved");
      return true;
    } catch (e) {
      console.error(e);
      say("Couldn't save. Please try again");
      return false;
    }
  };

  if (!supabase) return <SetupNeeded />;

  return (
    <div className="min-h-screen bg-stone-100 text-slate-900 flex justify-center">
      <div className="w-full max-w-md bg-stone-100 pb-24 relative">
        <Header />

        {tab === "buy" ? (
          <BuyerScreen
            items={parts.items}
            status={parts.status}
            onRetry={parts.retry}
            ratingFor={reviews.ratingFor}
            onRate={reviews.addReview}
          />
        ) : (
          <SellerScreen
            auth={auth}
            rating={reviews.ratingFor(auth.uid)}
            saveProfile={saveProfile}
            items={parts.items}
            addItem={parts.addItem}
            toggleSold={parts.toggleSold}
            removeItem={parts.removeItem}
          />
        )}
      </div>

      <Toast message={toast} />
      <BottomNav tab={tab} onChange={goTab} />
    </div>
  );
}
