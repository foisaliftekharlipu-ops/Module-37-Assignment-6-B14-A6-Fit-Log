import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WorkoutProvider } from "@/context/WorkoutContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const oswald = Oswald({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "FitLog — Workout Library",
  description: "Train with intent. Log every set.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} dark scroll-smooth`}>
      <body className="font-[family-name:var(--font-inter)] bg-[#0b0b0d] text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-[#ccff00] selection:text-black">
        <WorkoutProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#18181b",
                color: "#ffffff",
                border: "1px solid #27272a",
              },
            }}
          />

          <Navbar />

          <main className="flex-1 w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-6">
            {children}
          </main>

          <Footer />
        </WorkoutProvider>
      </body>
    </html>
  );
}