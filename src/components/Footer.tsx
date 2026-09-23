import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-[#0b0b0d] py-6 mt-auto">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="FitLog Logo"
            width={20}
            height={20}
            className="w-5 h-5 object-contain -scale-x-100 -rotate-12"
            priority
          />
          <span className="font-[family-name:var(--font-oswald)] text-xl font-normal tracking-wider text-white uppercase leading-none pt-0.5">
            FITLOG
          </span>
        </div>

        <p className="font-[family-name:var(--font-inter)] text-xs text-zinc-400 font-normal tracking-wide">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>

      </div>
    </footer>
  );
}