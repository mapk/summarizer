import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Text Summarizer",
  description: "Summarize any text to one word or a sentence using AI",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-oid="9:.m0oi">
      <body className={inter.className} data-oid="p7ydqp_">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          data-oid="h7pcckd"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
