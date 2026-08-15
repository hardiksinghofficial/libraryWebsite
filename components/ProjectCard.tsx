import Image from "next/image";
import React, { useEffect, useState } from "react";
import { techIconMap } from "./navPages/Projects";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

interface ProjectCardProps {
    title: string;
    description: string;
    thumbnail: string;
    techStack: string[];
    gradient: string;
    github?: string;
    live?: string;
    year?: string;
    role?: string;
    onClick?: () => void;
}

export default function ProjectCard({
    title,
    description,
    thumbnail,
    techStack,
    gradient,
    github,
    live,
    year,
    role,
    onClick,
}: ProjectCardProps) {
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

    // Extract the primary color from gradient string for the top glow
    const primaryColor = gradient.split(',')[0].trim();

    return (
        <div
            className="flex flex-col border border-zinc-200 dark:border-slate-800 rounded-2xl overflow-hidden group transition-all duration-300 bg-white dark:bg-[#0b0c10]"
            style={isDarkMode ? lightShadow : darkShadow}
        >
            {/* Top segment with gradient and image */}
            <div 
              className="relative pt-5 px-5 pb-0" 
              style={{ background: `radial-gradient(100% 100% at 50% 0%, ${primaryColor}55 0%, transparent 100%)` }}
            >
                {/* Spacer for top gradient */}
                <div className="h-4"></div>

                {/* Thumbnail */}
                <div className="flex justify-center mt-2 relative rounded-t-xl overflow-hidden shadow-2xl border-t border-x border-white/10 dark:border-white/5">
                   <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0b0c10] to-transparent z-10 top-[60%]"></div>
                   <Image
                       src={thumbnail}
                       alt={title}
                       width={500}
                       height={300}
                       className="object-cover w-full h-[100px] sm:h-[120px] relative z-0 transition-transform duration-500 group-hover:scale-105"
                   />
                </div>
            </div>

            {/* Content segment */}
            <div className="p-4 pt-1 flex flex-col flex-1 gap-4 z-20 bg-white dark:bg-[#0b0c10]">
                {/* Title & Desc */}
                <div className="flex flex-col gap-1 flex-1 mt-1">
                    <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white leading-tight">{title}</h2>
                    <p className="text-zinc-650 dark:text-zinc-400 text-[10px] sm:text-xs leading-relaxed line-clamp-2">{description}</p>
                </div>
            </div>
        </div>
    );
}
