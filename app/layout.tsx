import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";


export const metadata: Metadata = {
  title: "Kanban Board",
  description: "A simple Kanban board app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col h-screen overflow-hidden">
        {children}
        <Toaster />

        <SpeedInsights />
        <Analytics />
      </body>

    </html>
  );
}
