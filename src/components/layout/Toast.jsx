export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-20 z-30 flex justify-center px-4 pointer-events-none"
    >
      <div className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
        {message}
      </div>
    </div>
  );
}
