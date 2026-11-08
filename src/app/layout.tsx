import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

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
  title: "RoadmapAI — AI Roadmap & Todo Generator",
  description:
    "Generate structured, actionable project roadmaps and todo lists from your prompts using AI. Track your progress and save everything locally.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50/40 text-gray-900 font-sans">
        <GenerationProvider>
          <Header />
          <div className="flex-1 flex flex-col">{children}</div>
          <footer className="border-t border-gray-100 bg-white py-6 text-center text-xs text-gray-400">
            <p>RoadmapAI — Plan your goals with AI. Stored locally.</p>
          </footer>
        </GenerationProvider>
      </body>
    </html>
  );
}
