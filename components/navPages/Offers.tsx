"use client";
import React from "react";
import { motion } from "framer-motion";
import { jetbrainsMono } from "@/app/font";
import * as LucideIcons from "lucide-react";
import initialData from "@/data/portfolio.json";

export default function Offers() {
  const offersData = initialData.offers && initialData.offers.length > 0 ? initialData.offers : [];
  const sectionHeaders = (initialData.siteConfig as any)?.sectionHeaders?.offers || {
    title: "Exclusive Offers",
    subtitle: "Take advantage of our special packages and discounts."
  };

  const getIcon = (iconName: string, defaultClass: string = "w-8 h-8 text-orange-500") => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Gift;
    return <IconComponent className={defaultClass} />;
  };

  return (
    <section id="offers" className={` ${jetbrainsMono.className} flex flex-col gap-10 py-16 px-4 w-full max-w-5xl mx-auto`}>
      <div className="flex flex-col items-center justify-center gap-2 mb-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl text-center font-bold"
        >
          {sectionHeaders.title}
        </motion.h1>
        <p className="text-muted-foreground text-center text-sm md:text-base px-4">
          {sectionHeaders.subtitle}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {offersData.map((offer: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative group w-full h-full p-6 rounded-2xl flex flex-col items-start gap-4 transition-all duration-300 bg-white dark:bg-[#0b0c10] border ${offer.borderColor} hover:-translate-y-2 overflow-hidden shadow-sm hover:shadow-md`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${offer.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
            
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 shadow-sm relative z-10">
              {getIcon(offer.icon, `w-8 h-8 ${offer.borderColor.replace('border-', 'text-').split('/')[0]}`)}
            </div>
            
            <div className="relative flex flex-col gap-2 z-10 mt-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                {offer.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                {offer.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
