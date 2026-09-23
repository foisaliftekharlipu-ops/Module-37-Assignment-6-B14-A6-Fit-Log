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
          {/* আপডেটেড কাস্টম ডার্ক টোস্টার কনফিগারেশন */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2500,
              style: {
                background: "#121316",
                color: "#ffffff",
                border: "1px solid #27272a",
                fontSize: "13px",
                fontWeight: "500",
                padding: "10px 16px",
                borderRadius: "10px",
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#ffffff",
                },
              },
              success: {
                iconTheme: {
                  primary: "#ccff00",
                  secondary: "#000000",
                },
              },
            }}
          />

          {/* Sticky Header */}
          <Navbar />

          {/* Centered Main Layout */}
          <main className="flex-1 w-full max-w-[1100px] mx-auto px-4 sm:px-6 py-6">
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </WorkoutProvider>
      </body>
    </html>
  );
}