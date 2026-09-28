import { Cog } from "lucide-react";

export default function Thumb({ src, alt, className = "w-28 h-28" }) {
  return (
    <div
      className={`${className} shrink-0 rounded-lg overflow-hidden bg-stone-200 flex items-center justify-center`}
    >
      {src ? (
        <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover" />
      ) : (
        <Cog className="text-stone-400" size={30} aria-hidden="true" />
      )}
    </div>
  );
}
