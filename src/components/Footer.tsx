import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 bg-[#09090b] py-6 px-4 sm:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-[#ccff00] p-1.5 rounded text-black font-black flex items-center justify-center">
            <Dumbbell className="w-4 h-4" />
          </div>
          <span className="font-extrabold tracking-wider text-base uppercase text-white">
            FIT<span className="text-[#ccff00]">LOG</span>
          </span>
        </Link>
        <p className="text-zinc-500 text-xs sm:text-sm tracking-wide">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}