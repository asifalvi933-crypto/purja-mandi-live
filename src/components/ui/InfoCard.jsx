export default function InfoCard({ title, text, action, onAction }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 text-center">
      <p className="font-semibold text-slate-900">{title}</p>
      {text && <p className="text-sm text-slate-600 mt-1">{text}</p>}
      {action && (
        <button
          onClick={onAction}
          className="mt-4 h-11 px-5 rounded-lg bg-amber-400 text-slate-900 font-semibold"
        >
          {action}
        </button>
      )}
    </div>
  );
}
