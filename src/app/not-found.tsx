import Link from "next/link";
import { Dumbbell, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 font-(family-name:--font-inter)">
      <div className="p-4 rounded-2xl bg-[#0e1015] border border-zinc-800 mb-6">
        <Dumbbell className="w-12 h-12 text-[#ccff00]" />
      </div>
      
      <h1 className="font-(family-name:--font-oswald) text-6xl sm:text-7xl font-bold tracking-wider text-white mb-2">
        404
      </h1>
      <h2 className="font-(family-name:--font-oswald) text-xl sm:text-2xl font-bold uppercase text-zinc-300 mb-3">
        PAGE NOT FOUND
      </h2>
      <p className="text-zinc-400 text-xs sm:text-sm max-w-md mb-8 leading-relaxed">
        The lift or page you are looking for does not exist. Head back to the workout library to keep training.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-md"
      >
        <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        <span>BACK TO LIBRARY</span>
      </Link>
    </div>
  );
}