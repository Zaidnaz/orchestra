import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"]
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"]
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  title: "New Horizon — Financial Crime Investigation Console",
  description: "Autonomous multi-agent AML investigation platform — from transaction signal to regulator-ready SAR in under 3 minutes."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem('nh-theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');}catch(e){}`
          }}
        />
      </head>
      <body className={`${jakarta.variable} ${spaceGrotesk.variable} ${plexMono.variable}`}>
        <SiteNav />
        <main className="shell app-shell">{children}</main>
      </body>
    </html>
  );
}
