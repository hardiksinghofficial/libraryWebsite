"use client";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import React, { JSX, useEffect, useState } from "react";
import ProjectCard from "../ProjectCard";
import ProjectModal from "../ProjectModal";
import { jetbrainsMono } from "@/app/font";
import initialData from "@/data/portfolio.json";
import { motion, AnimatePresence } from "framer-motion";

import { Wifi, Snowflake, Plug, VolumeX, Star, Coffee, Monitor, BookOpen } from "lucide-react";

export const techIconMap: Record<string, JSX.Element> = {
  wifi: <Wifi className="text-blue-400" />,
  ac: <Snowflake className="text-cyan-400" />,
  charging: <Plug className="text-green-500" />,
  quiet: <VolumeX className="text-zinc-400" />,
  premium: <Star className="text-yellow-400" />,
  coffee: <Coffee className="text-orange-700" />,
  desktop: <Monitor className="text-purple-400" />,
  books: <BookOpen className="text-orange-400" />
};

interface Project {
  title: string;
  description: string;
  thumbnail: string;
  techStack: string[];
  gradient: string;
  github: string;
  live: string;
  year: string;
  role: string;
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>(initialData.projects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);
  
  const sectionHeaders = (initialData.siteConfig as any)?.sectionHeaders?.gallery || {
    title: "Inside Our Library",
    subtitle: "Take a look at our premium seating and facilities."
  };

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch(`/api/portfolio?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.projects) {
            setProjects(data.projects);
          }
        }
      } catch (err) {
        console.error("Failed to fetch projects dynamically", err);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div id="projects" className={`  ${jetbrainsMono.className} flex flex-col gap-10 items-center justify-center px-4 pb-20 w-full max-w-4xl`}>
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-2 mb-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl text-center font-bold"
        >
          {sectionHeaders.title}
        </motion.h1>
        <p className="text-zinc-500 text-center text-sm md:text-base px-4">
          {sectionHeaders.subtitle}
        </p>
      </div>

      {/* Cards Grid with Framer Motion */}
      <motion.div 
        layout 
        className={`${jetbrainsMono.className} grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-5xl px-4 md:px-0`}
      >
        <AnimatePresence mode="popLayout">
          {projects.slice(0, visibleCount).map((project, index) => (
            <motion.div
              key={project.title}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <ProjectCard
                {...project}
                onClick={() => setSelectedProject(project)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Show More/Less Button */}
      {projects.length > 8 && (
        <motion.div layout className="mt-4">
          <button
            onClick={() => setVisibleCount(prev => prev === 8 ? projects.length : 8)}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-white transition-all font-semibold text-sm cursor-pointer shadow-md group"
          >
            {visibleCount === 8 ? (
              <>
                See All Images 
                <ChevronDown className="w-4 h-4 text-[#e8390d] group-hover:translate-y-0.5 transition-transform" />
              </>
            ) : (
              <>
                See Fewer Images 
                <ChevronUp className="w-4 h-4 text-[#e8390d] group-hover:-translate-y-0.5 transition-transform" />
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          {...selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
