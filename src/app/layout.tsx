import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { WorkoutProvider } from "@/context/WorkoutContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "FitLog — Workout Library & Plan",
  description: "Track and log your daily gym workouts with FitLog.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-[#0b0b0d]">
      <body
        className={`${inter.variable} ${oswald.variable} min-h-screen bg-[#0b0b0d] text-zinc-100 antialiased flex flex-col`}
      >
        <WorkoutProvider>
          <Navbar />
          <div className="flex-1 bg-[#0b0b0d]">{children}</div>
          <Toaster position="bottom-right" />
        </WorkoutProvider>
      </body>
    </html>
  );
}