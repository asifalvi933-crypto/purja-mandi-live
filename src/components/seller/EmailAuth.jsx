// src/components/seller/EmailAuth.jsx
import { useState } from "react";
import Field from "../ui/Field";
import { inputCls } from "../ui/styles";

export default function EmailAuth({ onSignUp, onSignIn, busy }) {
  const [mode, setMode] = useState("signup"); // signup | login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [notice, setNotice] = useState("");

  const submit = async () => {
    setErr("");
    setNotice("");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErr("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }

    const { error } =
      mode === "signup"
        ? await onSignUp(email.trim(), password)
        : await onSignIn(email.trim(), password);

    if (error) {
      const msg = (error.message || "").toLowerCase();
      if (msg.includes("already registered")) {
        setErr("This email is already registered. Please log in.");
        setMode("login");
      } else if (msg.includes("invalid login")) {
        setErr("Incorrect email or password.");
      } else {
        setErr("Something went wrong. Please try again.");
      }
      return;
    }

    if (mode === "signup") {
      setNotice("Account created. If email confirmation is required, check your inbox then log in.");
    }
  };

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-bold text-slate-900">
        {mode === "signup" ? "Create a seller account" : "Seller login"}
      </h2>
      <p className="text-sm text-slate-600 mt-1">
        Choose your email and a password. You'll use the same to log in again.
      </p>

      <div className="mt-4 space-y-4">
        <Field label="Email">
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="shop@example.com"
            className={inputCls}
          />
        </Field>
        <Field label="Password" hint="At least 6 characters">
          <input
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            className={inputCls}
          />
        </Field>
      </div>

      {err && <p role="alert" className="mt-3 text-sm font-medium text-red-700">{err}</p>}
      {notice && <p className="mt-3 text-sm font-medium text-green-700">{notice}</p>}

      <button
        onClick={submit}
        disabled={busy}
        className="mt-5 w-full h-12 rounded-lg bg-amber-400 text-slate-900 font-bold text-base disabled:opacity-60"
      >
        {busy ? "One moment..." : mode === "signup" ? "Create account" : "Log in"}
      </button>

      <button
        onClick={() => {
          setMode(mode === "signup" ? "login" : "signup");
          setErr("");
          setNotice("");
        }}
        className="mt-3 w-full h-11 text-sm font-medium text-slate-700 underline"
      >
        {mode === "signup" ? "Already have an account? Log in" : "New seller? Create an account"}
      </button>
    </div>
  );
}
