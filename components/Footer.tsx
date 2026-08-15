"use client";
import { jetbrainsMono } from "@/app/font";
import initialData from "@/data/portfolio.json";

export default function Footer() {
  return (
    <footer
      className={`${jetbrainsMono.className} w-full text-muted-foreground border-t border-border py-6 px-4 flex items-center justify-center gap-3 text-sm`}
    >
      <p className="text-center">
        © {new Date().getFullYear()} {(initialData as any).siteConfig?.title || "Insight Library"}. All rights reserved.
      </p>
    </footer>
  );
}
