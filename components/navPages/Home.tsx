'use client';

import React, { useState } from 'react';
import Lottie from 'lottie-react';
import Typewriter from 'typewriter-effect';
import scrollDownAnimation from '@/public/scroll-down.json';
import { jetbrainsMono } from '@/app/font';
import { MapPin, Phone, MessageCircle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import Socials from '../Socials';
import { InteractiveHoverButton } from '../ui/interactive-hover-button';
import initialData from "@/data/portfolio.json";
export function Home() {
    const [isHovered, setIsHovered] = useState(false);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/resume.pdf';
        link.download = 'Hardik_Singh_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div id='home' className="w-full max-w-4xl flex flex-col items-center justify-center px-4 md:px-6 pt-24 pb-16 sm:min-h-[90vh] relative">
            <div className="flex flex-col-reverse md:flex-row items-center md:items-start justify-between gap-10 w-full max-w-5xl">
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight flex items-center gap-4 flex-wrap">
                            Welcome to 
                            {initialData.siteConfig?.logoImage ? (
                                <img src={initialData.siteConfig.logoImage} alt="Logo" className="h-12 md:h-16 inline-block object-contain" />
                            ) : (
                                <span className='text-[#e8390d] inline-block'>{initialData.siteConfig?.title || "Insight Library"}</span>
                            )}
                        </h1>
                        <span
                            className="text-4xl sm:text-5xl"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            style={{
                                transformOrigin: '70% 70%',
                                animation: isHovered ? 'wave 1.2s ease-in-out infinite' : 'none',
                                display: 'inline-block',
                            }}
                        >
                            📚
                        </span>
                    </div>
                    <p className={` ${jetbrainsMono.className} flex items-start sm:items-center mt-6 text-[#dd431d] gap-2 text-sm sm:text-base`}> 
                        <MapPin className="shrink-0 mt-0.5 sm:mt-0" size={18} /> 
                        {initialData.siteConfig?.hero?.locationText || "Near Chris Jyoti School, Hotel Chandra View, Satna, (M.P.)"}
                    </p>

                    <span className="tailwind-wrapper mt-6 text-xl sm:text-2xl md:text-3xl font-medium block text-left text-zinc-800 dark:text-zinc-200">
                        <Typewriter
                            options={{
                                strings: initialData.siteConfig?.typewriterStrings?.length ? initialData.siteConfig.typewriterStrings : ['THE SELF STUDY ZONE', 'FOCUS • LEARN • GROW', 'ACHIEVE YOUR GOALS'],
                                autoStart: true,
                                loop: true,
                                delay: 20,
                                deleteSpeed: 5,
                            }}
                        />
                    </span>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8 w-full sm:w-auto">
                        <a href={`https://wa.me/${initialData.siteConfig?.contact?.whatsapp || "917999436719"}`} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] hover:border-[#e8390d] dark:hover:border-[#e8390d] hover:text-[#e8390d] transition-all text-sm font-semibold shadow-sm w-full sm:w-auto">
                            <FaWhatsapp size={18} />
                            WhatsApp
                        </a>
                        <a href={`tel:${initialData.siteConfig?.contact?.phone || "+917999436719"}`} className="group flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] hover:border-[#e8390d] dark:hover:border-[#e8390d] hover:text-[#e8390d] transition-all text-sm font-semibold shadow-sm w-full sm:w-auto">
                            <Phone size={16} />
                            Call Us
                        </a>
                        <a href={initialData.siteConfig?.contact?.mapUrl || "https://maps.google.com/?q=Near+Chris+Jyoti+School,+Hotel+Chandra+View,+Satna"} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0b0c10] hover:border-[#e8390d] dark:hover:border-[#e8390d] hover:text-[#e8390d] transition-all text-sm font-semibold shadow-sm w-full sm:w-auto">
                            <MapPin size={16} />
                            Maps
                        </a>
                    </div>

                    {/* Seat Availability Badge */}
                    {initialData.siteConfig?.seats && (
                        <div className="mt-8 flex items-center gap-3 bg-red-500/10 border border-red-500/30 px-4 py-3 rounded-xl w-fit">
                            <div className="relative flex h-3 w-3">
                              {initialData.siteConfig.seats.available > 0 && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              )}
                              <span className={`relative inline-flex rounded-full h-3 w-3 ${initialData.siteConfig.seats.available > 0 ? 'bg-red-500' : 'bg-zinc-500'}`}></span>
                            </div>
                            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                {initialData.siteConfig.seats.available > 0 ? (
                                    <>Fast Filling! <span className="text-red-500">{initialData.siteConfig.seats.available} Seats</span> Left out of {initialData.siteConfig.seats.total}</>
                                ) : (
                                    <span className="text-zinc-500">Currently Full ({initialData.siteConfig.seats.total} / {initialData.siteConfig.seats.total}) - Contact for Waitlist</span>
                                )}
                            </span>
                        </div>
                    )}

                    <p
                        className={`mt-4 text-sm sm:text-lg dark:text-zinc-500 text-justify leading-relaxed flex flex-col gap-2 ${jetbrainsMono.className}`}
                    >
                        &quot;{initialData.siteConfig?.hero?.quote || "The best investment you can make is in yourself."}&quot;
                    </p>
                </div>

                <div
                    className="w-40 h-40 sm:w-56 sm:h-56 md:w-70 md:h-70 relative shrink-0 rounded-full overflow-hidden transition-all duration-300 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-4 border-zinc-200 dark:border-zinc-700 mx-auto md:mx-0 mt-8 md:mt-0"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className={`transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'} w-full h-full flex items-center justify-center`}>
                        {initialData.siteConfig?.hero?.image ? (
                            <img src={initialData.siteConfig.hero.image} alt="Hero" className="w-full h-full object-cover" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 dark:text-zinc-500">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                        )}
                    </div>
                </div>

            </div>

            {/* Scroll Down Animation */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-14 z-10 hidden md:block">
                <Lottie animationData={scrollDownAnimation} loop />
            </div>
        </div>
    );
}
