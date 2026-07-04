import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocaleLore — Your Local Travel Guide",
  description:
    "Get a personal, day-by-day travel plan from a local guide: the best places to visit, where to eat, walking routes, local crafts, and the stories behind each spot. Powered by Google Gemini.",
  applicationName: "LocaleLore",
  authors: [{ name: "LocaleLore" }],
  keywords: ["travel planning", "cultural heritage", "hidden gems", "artisan discovery", "Gemini AI", "My Local Guide"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d17" },
  ],
};

const themeScript = `(function(){try{var k='localelore:theme:v1',t=localStorage.getItem(k);if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var e=document.documentElement;e.classList.toggle('dark',t==='dark');e.style.colorScheme=t;}catch(e){}})();`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
