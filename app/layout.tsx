import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "CookFlow — AI cooking to-do list",
  description:
    "Turn your day into an actionable cooking plan: timed tasks, a grocery list, smart substitutions, and a budget check — powered by Google Gemini.",
  applicationName: "CookFlow",
  authors: [{ name: "CookFlow" }],
  keywords: ["meal planning", "AI", "Gemini", "grocery list", "budget cooking"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9faf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0c0b" },
  ],
};

// Runs before hydration to apply the saved/system theme and prevent a flash of
// the wrong color scheme. Kept tiny and dependency-free.
const themeScript = `(function(){try{var k='cookflow:theme:v1',t=localStorage.getItem(k);if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var e=document.documentElement;e.classList.toggle('dark',t==='dark');e.style.colorScheme=t;}catch(e){}})();`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
         * Browsers blank out the `nonce` content attribute after using it (a
         * security feature), so the server-rendered nonce won't match the
         * client's — suppress the resulting hydration warning. The nonce itself
         * is still required for the production CSP to allow this inline script.
         */}
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
