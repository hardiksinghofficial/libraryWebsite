"use client";
import React, { useEffect, useState } from "react";
import SkillCard from "../SkillCard";
import { jetbrainsMono } from "@/app/font";
import { getSkillIcon } from "@/lib/icons";
import initialData from "@/data/portfolio.json";
import { motion } from "framer-motion";

interface Skill {
  name: string;
  icon: string;
  iconColor: string;
  category: string;
  description?: string;
}

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>(initialData.skills);
  
  const sectionHeaders = (initialData as any)?.siteConfig?.sectionHeaders?.features || {
      title: "Library Features",
      subtitle: "Everything you need to stay focused and achieve your goals."
  };

  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch(`/api/portfolio?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.skills) {
            setSkills(data.skills);
          }
        }
      } catch (err) {
        console.error("Failed to fetch skills dynamically", err);
      }
    }
    fetchSkills();
  }, []);

  // Group skills by category
  const categories = [
    "Features",
    "Amenities"
  ];

  const skillCategories = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section id="skills" className={` ${jetbrainsMono.className} flex flex-col gap-10 py-16 px-4 w-full`}>
      <div className="flex flex-col items-center justify-center gap-2 mb-8">
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
      
      <div className="flex flex-col gap-12 w-full max-w-5xl mx-auto mt-6">
        {Object.entries(skillCategories).map(([category, list]) => {
          if (list.length === 0) return null;
          return (
            <div key={category} className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold text-center md:text-left text-zinc-800 dark:text-zinc-200 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {list.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <SkillCard 
                      name={skill.name}
                      icon={getSkillIcon(skill.icon)}
                      iconColor={skill.iconColor}
                      description={skill.description}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Seat Availability Banner */}
      {initialData.siteConfig?.seats && (
        <div className="mt-12 flex flex-col items-center justify-center p-8 bg-zinc-100 dark:bg-[#111] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg relative overflow-hidden">
          {/* Glow effect */}
          <div className={`absolute inset-0 ${initialData.siteConfig.seats.available > 0 ? 'bg-green-500/10' : 'bg-red-500/10'} blur-[100px] pointer-events-none`}></div>
          <h2 className={`text-3xl font-bold ${initialData.siteConfig.seats.available > 0 ? 'text-green-500' : 'text-red-500'} mb-2 z-10`}>
            {initialData.siteConfig.seats.available > 0 ? "SEATS AVAILABLE" : "SEATS FULL"}
          </h2>
          <p className="text-6xl font-black text-zinc-900 dark:text-white z-10">
            {initialData.siteConfig.seats.available} <span className="text-3xl text-zinc-400">/ {initialData.siteConfig.seats.total}</span>
          </p>
          <p className="text-zinc-500 mt-2 text-center z-10">
            {initialData.siteConfig.seats.available > 0 ? "Contact us to reserve your spot!" : "Join the waitlist today!"}
          </p>
        </div>
      )}
    </section>
  );
}
