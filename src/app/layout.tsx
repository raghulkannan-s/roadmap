import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { GenerationProvider } from "@/context/generation-context";
import { Header } from "@/components/header";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RoadmapAI — AI Todo Studio",
  description:
    "Generate structured, actionable todo lists using AI and save them securely to the cloud.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-[#090d16] dark:text-slate-100 font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <GenerationProvider>
              <Header />
              <div className="flex-1 flex flex-col">{children}</div>
              <footer className="border-t border-slate-200/70 bg-white/50 py-6 text-center text-xs text-slate-400 backdrop-blur-xs dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-500">
                <p>RoadmapAI — Precision goal planning and execution studio.</p>
              </footer>
            </GenerationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
