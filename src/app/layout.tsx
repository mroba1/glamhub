import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME } from "@/constants";
import { KeepAlive } from "@/components/shared/keep-alive";
import { SessionRestorer } from "@/components/shared/session-restorer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: ["beauty", "salon", "booking", "marketplace", "skincare", "haircare", "Nigeria"],
  authors: [{ name: APP_NAME }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-[hsl(0,0%,4%)] text-[hsl(0,0%,95%)] antialiased">
        <KeepAlive />
        <SessionRestorer />
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "hsl(0,0%,9%)",
              border: "1px solid hsl(0,0%,15%)",
              color: "hsl(0,0%,95%)",
            },
          }}
        />
      </body>
    </html>
  );
}
