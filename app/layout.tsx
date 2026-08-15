import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { metrophobic, jetbrainsMono, poppins } from "./font";
import { Navbar } from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import Preloader from "@/components/Preloader";
import { LightPullThemeSwitcher } from "@/components/ui/light-pull-theme-switcher";
import { Cursor } from "@/components/ui/Cursor";
import { Toaster } from "sonner";


import initialData from "@/data/portfolio.json";

export const metadata: Metadata = {
  title: {
    default: "Insight Library Satna | Premium Self Study Zone",
    template: "%s | Insight Library Satna"
  },
  description: "Insight Library in Satna (M.P.) is the ultimate self-study zone. Enjoy high-speed Wi-Fi, fully air-conditioned spaces, RO purified water, and a distraction-free environment for competitive exam preparation.",
  keywords: [
    "Insight Library Satna", 
    "Best Library in Satna", 
    "Self Study Zone Satna", 
    "Reading Room Satna", 
    "Library near Chris Jyoti School", 
    "Insight Library",
    "Study space Satna"
  ],
  authors: [{ name: "Insight Library" }],
  openGraph: {
    title: "Insight Library Satna | Premium Self Study Zone",
    description: "Premium self-study space in Satna with high-speed Wi-Fi, AC, and quiet zones for focused exam preparation.",
    url: "https://insightlibrary.vercel.app",
    siteName: "Insight Library",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={poppins.className}
      >
        <Providers>
          {/* <CustomCursor /> */}
          <Cursor />
          {/* <ThemeToggle /> */}
          <LightPullThemeSwitcher />
          <Preloader />
          <ScrollProgress />
          <Navbar />
          {children}
          <Toaster richColors position="bottom-right"/>
        </Providers>
      </body>
    </html>
  );
}
