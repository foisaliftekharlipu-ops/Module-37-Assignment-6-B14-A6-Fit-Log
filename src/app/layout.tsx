import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WorkoutProvider } from "@/context/WorkoutContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const metadata: Metadata = {
  title: "FitLog — Workout Library",
  description: "Train with intent. Log every set.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#0b0b0d] text-white antialiased font-(family-name:--font-inter)">
        <WorkoutProvider>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#161922",
                color: "#f4f4f5",
                border: "1px solid #27272a",
                borderRadius: "12px",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: 500,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              },
              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#161922",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#161922",
                },
              },
            }}
          />

          <Navbar />
          <div className="flex-1 w-full">{children}</div>
          <Footer />
        </WorkoutProvider>
      </body>
    </html>
  );
}