import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Header } from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocaleLore — GenAI Cultural Odyssey & Local Resident Guide",
  description:
    "Discover authentic destinations, read immersive local stories, discover hidden artisan crafts, and explore walking routes through the eyes of local residents, powered by Google Gemini.",
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
