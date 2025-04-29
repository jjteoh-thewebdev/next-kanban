import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
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

        {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true" && (
          <Analytics />
        )}
      </body>

    </html>
  );
}
