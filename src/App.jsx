// src/App.jsx
// Sirf "jodne" ka kaam: tabs, hooks aur screens ko connect karta hai.
import { useState } from "react";
import { supabase } from "./lib/supabase";
import { updateDealerParts } from "./lib/partsApi";
import { useAuth } from "./hooks/useAuth";
import { useParts } from "./hooks/useParts";
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

  const goTab = async (t) => {
    setTab(t);
    window.scrollTo(0, 0);
    // Dealer ke pehli baar Bechein kholne par hi uska account banta hai
    if (t === "sell" && !auth.user) {
      const { error } = await auth.signInDealer();
      if (error) {
        console.error(error);
        say("Login nahi ho paya");
      }
    }
  };

  const saveProfile = async (profile) => {
    try {
      const user = await auth.saveProfile(profile);
      await updateDealerParts(user.id, profile);
      say("Jaankari save ho gayi");
      return true;
    } catch (e) {
      console.error(e);
      say("Save nahi hua. Dobara try karein");
      return false;
    }
  };

  if (!supabase) return <SetupNeeded />;

  return (
    <div className="min-h-screen bg-stone-100 text-slate-900 flex justify-center">
      <div className="w-full max-w-md bg-stone-100 pb-24 relative">
        <Header />

        {tab === "buy" ? (
          <BuyerScreen items={parts.items} status={parts.status} onRetry={parts.retry} />
        ) : (
          <SellerScreen
            me={auth.me}
            myId={auth.uid}
            authReady={!!auth.user}
            authBusy={auth.busy}
            onRetryAuth={() => goTab("sell")}
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
