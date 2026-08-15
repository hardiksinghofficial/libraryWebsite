"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SkillCardProps {
  name: string;
  icon: React.ReactNode | string;
  iconColor?: string;
  description?: string;
}

export default function SkillCard({
  name,
  icon,
  iconColor = "text-black dark:text-white",
  description,
}: SkillCardProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  const lightShadow = {
    boxShadow: `
      rgba(0, 0, 0, 0.5) 0px 15px 25px,
      rgba(0, 0, 0, 0.35) 0px 10px 15px,
      rgba(0, 0, 0, 0.25) 0px 4px 6px
    `,
  };

  const darkShadow = {
    boxShadow: `
      rgba(200, 200, 200, 0.2) 2px 2px 6px,
      rgba(160, 160, 160, 0.15) 0px 6px 10px
    `,
  };

  const iconClasses = cn(
    "transition-transform duration-500 group-hover:scale-110",
    iconColor
  );

  return (
    <div
      className="group relative w-full h-full p-6 rounded-2xl flex flex-col items-start justify-start gap-5 transition-all duration-500 bg-white dark:bg-[#0b0c10] border border-zinc-200 dark:border-zinc-800 hover:-translate-y-2 overflow-hidden"
      style={isDarkMode ? darkShadow : lightShadow}
    >
      {/* Subtle hover gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-transparent dark:from-zinc-900 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm group-hover:shadow-md transition-shadow duration-500">
        {typeof icon === "string" ? (
          <Image
            src={icon}
            alt={name}
            width={32}
            height={32}
            className={iconClasses}
          />
        ) : (
          <div className={cn("text-3xl", iconClasses)}>{icon}</div>
        )}
      </div>
      <div className="relative flex flex-col gap-2 z-10">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
