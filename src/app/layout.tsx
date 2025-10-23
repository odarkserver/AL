import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProviderWrapper } from "@/components/providers/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ODARK AI Assistant - Advanced AI Chat, Image Generation & Web Search",
  description: "Powerful AI assistant with chat, image generation, and web search capabilities. Built with Next.js 15, TypeScript, and modern AI technologies.",
  keywords: ["ODARK AI", "Next.js", "TypeScript", "AI Assistant", "Chat", "Image Generation", "Web Search", "shadcn/ui"],
  authors: [{ name: "ODARK Server" }],
  icons: {
    icon: "/favicon.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "ODARK AI Assistant",
    description: "Advanced AI assistant with multiple capabilities",
    url: "https://github.com/odarkserver/AL",
    siteName: "ODARK AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ODARK AI Assistant",
    description: "Advanced AI assistant with chat, image generation, and web search",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProviderWrapper>
          {children}
          <Toaster />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
