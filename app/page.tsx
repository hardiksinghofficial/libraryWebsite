'use client';
import {Home} from "@/components/navPages/Home"
import { Projects } from '@/components/navPages/Projects';
import Contact from '@/components/navPages/Contact';
import SkillsSection from "@/components/navPages/Skills";
import Offers from "@/components/navPages/Offers";
import Footer from "@/components/Footer";


export default function HomePage() {
  return (
    <main className={`flex flex-col items-center justify-center scroll-smooth`}>
      <Home/>
      <Projects/>
      <SkillsSection/>
      <Offers/>
      <Contact/>
      <Footer/>
    </main>
  );
}
