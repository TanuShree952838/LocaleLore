import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Header } from "@/components/layout/Header";
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
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
