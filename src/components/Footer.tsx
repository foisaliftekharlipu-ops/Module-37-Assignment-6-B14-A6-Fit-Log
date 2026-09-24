import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-900 bg-[#07080a] py-8 mt-16 font-[family-name:var(--font-inter)]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Brand Logo with the Dumbbell Icon */}
        <Link
          href="/"
          className="flex items-center gap-2 font-[family-name:var(--font-oswald)] text-lg font-bold tracking-wider text-white hover:opacity-90 transition-opacity"
        >
          <Dumbbell className="w-5 h-5 text-[#ccff00]" />
          <span>FITLOG</span>
        </Link>

        {/* Right: Copyright line */}
        <p className="text-zinc-500 text-xs sm:text-[13px] text-center sm:text-right">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}