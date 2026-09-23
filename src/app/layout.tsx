import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WorkoutProvider } from "@/context/WorkoutContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "FitLog — Train With Intent",
  description: "A dark, no-nonsense gym companion: pick a lift, lock it into today's plan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#0e0e10] text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-[#ccff00] selection:text-black">
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
          <main className="flex-1">{children}</main>
          <Footer />
        </WorkoutProvider>
      </body>
    </html>
  );
}