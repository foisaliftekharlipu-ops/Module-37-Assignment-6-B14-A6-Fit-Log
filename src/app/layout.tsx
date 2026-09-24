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
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "FitLog — Workout Library & Plan",
  description: "Train with intent. Log every set. FitLog is your ultimate gym companion.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} scroll-smooth dark`}>
      <body className="bg-[#12141a] text-zinc-100 antialiased font-sans flex flex-col min-h-screen">
        <WorkoutProvider>

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1c1f26",
                color: "#ffffff",
                border: "1px solid #27272a",
                fontSize: "14px",
                borderRadius: "8px",
              },
              success: {
                iconTheme: {
                  primary: "#ccff00",
                  secondary: "#000000",
                },
              },
            }}
          />

          <Navbar />

          <main className="flex-1">{children}</main>

          <Footer />
        </WorkoutProvider>
      </body>
    </html>
  );
}