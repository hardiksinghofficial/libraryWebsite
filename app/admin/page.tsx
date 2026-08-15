"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Trash2, 
  Plus, 
  Lock, 
  Wrench, 
  Briefcase, 
  Search, 
  Sparkles, 
  LogOut,
  Settings,
  Image as ImageIcon,
  Gift,
  AlignLeft,
  Home
} from "lucide-react";
import { getAvailableIcons } from "@/lib/icons";
import { techIconMap } from "@/components/navPages/Projects";
import { jetbrainsMono } from "@/app/font";

interface Skill {
  name: string;
  icon: string;
  iconColor: string;
  category: string;
  description?: string;
}

interface Project {
  title: string;
  description: string;
  thumbnail: string | { name: string; data: string };
  techStack: string[];
  gradient: string;
  github: string;
  live: string;
  year: string;
  role: string;
}

interface Offer {
  title: string;
  description: string;
  icon: string;
  color: string;
  borderColor: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [activeTab, setActiveTab] = useState<"site" | "skills" | "projects" | "offers">("site");
  
  // Data State
  const [siteConfig, setSiteConfig] = useState({
    title: "Insight Library",
    logoImage: "",
    typewriterStrings: ["THE SELF STUDY ZONE", "FOCUS • LEARN • GROW", "ACHIEVE YOUR GOALS"],
    hero: {
      image: "",
      quote: "The best investment you can make is in yourself.",
      locationText: "Near Chris Jyoti School, Hotel Chandra View, Satna, (M.P.)"
    },
    contact: {
      phone: "+917999436719",
      whatsapp: "917999436719",
      mapUrl: "https://maps.google.com/?q=Near+Chris+Jyoti+School,+Hotel+Chandra+View,+Satna",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3628.499981932014!2d80.84138827496444!3d24.571935478118753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39847f5994f154d3%3A0xd9c8e32aebcd56b4!2sINSIGHT%20LIBRARY!5e0!3m2!1sen!2sin!4v1786779767504!5m2!1sen!2sin"
    },
    sectionHeaders: {
      features: { title: "Library Features & Amenities", subtitle: "Everything you need to stay focused and achieve your goals." },
      offers: { title: "Exclusive Offers", subtitle: "Take advantage of our special packages and discounts." },
      gallery: { title: "Inside Our Library", subtitle: "Take a look at our premium seating and facilities." },
      contact: { title: "Book My Seat", subtitle: "Fill out the form below to reserve your spot instantly!" }
    }
  });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [shifts, setShifts] = useState<string[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms State - Skill
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Features");
  const [newSkillIcon, setNewSkillIcon] = useState("FaBookOpen");
  const [newSkillColor, setNewSkillColor] = useState("text-cyan-300");
  const [newSkillDesc, setNewSkillDesc] = useState("");
  const [iconSearch, setIconSearch] = useState("");

  // Forms State - Site Settings
  const [newLogoFile, setNewLogoFile] = useState<{ name: string; data: string } | null>(null);
  const [newHeroFile, setNewHeroFile] = useState<{ name: string; data: string } | null>(null);

  // Forms State - Offers
  const [newOfferTitle, setNewOfferTitle] = useState("");
  const [newOfferDesc, setNewOfferDesc] = useState("");
  const [newOfferIcon, setNewOfferIcon] = useState("Clock");
  const [newOfferColor, setNewOfferColor] = useState("from-orange-500/20 to-transparent");
  const [newOfferBorder, setNewOfferBorder] = useState("border-orange-500/20");

  // Forms State - Project
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjRole, setNewProjRole] = useState("Full-Stack");
  const [newProjYear, setNewProjYear] = useState(new Date().getFullYear().toString());
  const [newProjGithub, setNewProjGithub] = useState("#");
  const [newProjLive, setNewProjLive] = useState("#");
  const [newProjFile, setNewProjFile] = useState<{ name: string; data: string } | null>(null);
  const [newProjGradient, setNewProjGradient] = useState("#14f195, rgb(13, 1, 60)");
  const [newProjTech, setNewProjTech] = useState<string[]>([]);

  // Available skill icons
  const allIcons = getAvailableIcons();
  const filteredIcons = allIcons.filter(
    (icon) =>
      icon.name.toLowerCase().includes(iconSearch.toLowerCase()) ||
      icon.key.toLowerCase().includes(iconSearch.toLowerCase())
  );

  // Common Tailwind color presets
  const colorPresets = [
    { name: "Cyan", class: "text-cyan-300", bg: "bg-cyan-300" },
    { name: "Teal", class: "text-teal-400", bg: "bg-teal-400" },
    { name: "Blue", class: "text-blue-500", bg: "bg-blue-500" },
    { name: "Indigo", class: "text-indigo-400", bg: "bg-indigo-400" },
    { name: "Purple", class: "text-purple-500", bg: "bg-purple-500" },
    { name: "Pink", class: "text-pink-500", bg: "bg-pink-500" },
    { name: "Red", class: "text-red-500", bg: "bg-red-500" },
    { name: "Orange", class: "text-orange-500", bg: "bg-orange-500" },
    { name: "Yellow", class: "text-yellow-400", bg: "bg-yellow-400" },
    { name: "Green", class: "text-green-500", bg: "bg-green-500" },
    { name: "Gray", class: "text-gray-400", bg: "bg-gray-400" }
  ];

  // Try retrieving password from sessionStorage on mount
  useEffect(() => {
    const savedPass = sessionStorage.getItem("admin_passphrase");
    if (savedPass) {
      setPassphrase(savedPass);
      // Validate saved pass on mount
      fetchPortfolioData(savedPass);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPortfolioData = async (pass: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        if (data.siteConfig) setSiteConfig({ ...siteConfig, ...data.siteConfig });
        setSkills(data.skills || []);
        setProjects(data.projects || []);
        setShifts(data.shifts || []);
        setOffers(data.offers || []);
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_passphrase", pass);
      } else {
        toast.error("Failed to load portfolio database.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error communicating with the API.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) {
      toast.warning("Please enter a passphrase.");
      return;
    }
    fetchPortfolioData(passphrase);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_passphrase");
    setIsAuthenticated(false);
    setPassphrase("");
    toast.success("Logged out successfully.");
  };

  const saveDatabase = async (updatedSkills: Skill[], updatedProjects: Project[], updatedShifts: string[] = shifts, updatedOffers: Offer[] = offers) => {
    const loadingToast = toast.loading("Saving changes to disk...");
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteConfig: siteConfig,
          skills: updatedSkills,
          projects: updatedProjects,
          shifts: updatedShifts,
          offers: updatedOffers,
          passphrase
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success(data.message || "Database saved!");
        setSkills(updatedSkills);
        setProjects(updatedProjects);
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.error || "Failed to save data.");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Network error. Failed to save.");
      console.error(err);
    }
  };

  // Add Skill handler
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) {
      toast.warning("Skill name is required.");
      return;
    }

    // Check if skill already exists in the same category
    if (skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase() && s.category === newSkillCategory)) {
      toast.error("This skill already exists in this category.");
      return;
    }

    const updatedSkills = [
      ...skills,
      {
        name: newSkillName.trim(),
        category: newSkillCategory,
        icon: newSkillIcon,
        iconColor: newSkillColor,
        description: newSkillDesc.trim()
      }
    ];

    saveDatabase(updatedSkills, projects);
    // Reset Form
    setNewSkillName("");
    setNewSkillDesc("");
    toast.success(`Prepared skill: ${newSkillName}`);
  };

  // Delete Skill handler
  const handleDeleteSkill = (indexToDelete: number) => {
    const skillToDelete = skills[indexToDelete];
    if (confirm(`Are you sure you want to delete ${skillToDelete.name}?`)) {
      const updatedSkills = skills.filter((_, i) => i !== indexToDelete);
      saveDatabase(updatedSkills, projects);
    }
  };

  // Add Project handler
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) {
      toast.warning("Project title is required.");
      return;
    }
    if (newProjTech.length === 0) {
      toast.warning("Please select at least one technology.");
      return;
    }

    const updatedProjects = [
      ...projects,
      {
        title: newProjTitle.trim(),
        description: newProjDesc.trim(),
        role: newProjRole.trim(),
        year: newProjYear.trim(),
        github: newProjGithub.trim(),
        live: newProjLive.trim(),
        thumbnail: newProjFile || "/project-placeholder.png",
        gradient: newProjGradient.trim(),
        techStack: newProjTech
      }
    ];

    saveDatabase(skills, updatedProjects);

    // Reset Project Form
    setNewProjTitle("");
    setNewProjDesc("");
    setNewProjTech([]);
    setNewProjFile(null);
    toast.success("New project added successfully!");
  };

  // Delete Project handler
  const handleDeleteProject = (indexToDelete: number) => {
    const projectToDelete = projects[indexToDelete];
    if (confirm(`Are you sure you want to delete "${projectToDelete.title}"?`)) {
      const updatedProjects = projects.filter((_, i) => i !== indexToDelete);
      saveDatabase(skills, updatedProjects);
    }
  };

  const handleTechCheckboxChange = (techKey: string) => {
    setNewProjTech(prev => 
      prev.includes(techKey) 
        ? prev.filter(t => t !== techKey)
        : [...prev, techKey]
    );
  };

  // ------------------- LOGIN RENDER -------------------
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-zinc-950 px-4 text-white ${jetbrainsMono.className}`}>
        <div className="absolute inset-0 bg-radial-gradient from-red-500/10 via-transparent to-transparent pointer-events-none" />
        
        <form 
          onSubmit={handleLogin}
          className="w-full max-w-md bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl relative z-10"
        >
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-red-500/20 text-red-500 flex items-center justify-center rounded-xl border border-red-500/30">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-center text-zinc-100">Admin Dashboard</h1>
            <p className="text-zinc-500 text-sm text-center">Please enter your passphrase to manage portfolio database.</p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-zinc-400">Passphrase</label>
              <input 
                type="password" 
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-orange-900/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Authenticating..." : "Access Dashboard"}
            </button>

            <a 
              href="/"
              className="text-center text-sm text-zinc-600 hover:text-zinc-400 transition-colors flex items-center justify-center gap-1 mt-2"
            >
              <Home className="w-4 h-4" /> Return to Website
            </a>
          </div>
        </form>
      </div>
    );
  }

  // ------------------- DASHBOARD RENDER -------------------
  return (
    <div className={`min-h-screen bg-zinc-950 text-white p-4 md:p-8 ${jetbrainsMono.className}`}>
      {/* Top Navbar */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 border-b border-zinc-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-red-500" /> Hardik's Admin Panel
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Directly managing portfolio JSON database file.</p>
        </div>
        <div className="flex gap-3">
          <a 
            href="/"
            target="_blank"
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-xl border border-zinc-800 transition-all text-sm flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> View Site
          </a>
          <button 
            onClick={handleLogout}
            className="bg-red-950/40 hover:bg-red-950/60 text-red-400 border border-red-900/50 px-4 py-2 rounded-xl transition-all text-sm flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("site")}
            className={`w-full text-left px-5 py-4 rounded-xl font-bold flex items-center gap-3 transition-all ${
              activeTab === "site" 
                ? "bg-gradient-to-r from-red-600/10 to-orange-600/10 border border-red-500/30 text-red-400" 
                : "bg-zinc-900/40 border border-zinc-800/60 text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200"
            }`}
          >
            <Settings className="w-5 h-5" /> Site Settings
          </button>
          <button 
            onClick={() => setActiveTab("skills")}
            className={`w-full text-left px-5 py-4 rounded-xl font-bold flex items-center gap-3 transition-all ${
              activeTab === "skills" 
                ? "bg-gradient-to-r from-red-600/10 to-orange-600/10 border border-red-500/30 text-red-400" 
                : "bg-zinc-900/40 border border-zinc-800/60 text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200"
            }`}
          >
            <Wrench className="w-5 h-5" /> Manage Features
          </button>
          <button 
            onClick={() => setActiveTab("projects")}
            className={`w-full text-left px-5 py-4 rounded-xl font-bold flex items-center gap-3 transition-all ${
              activeTab === "projects" 
                ? "bg-gradient-to-r from-red-600/10 to-orange-600/10 border border-red-500/30 text-red-400" 
                : "bg-zinc-900/40 border border-zinc-800/60 text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200"
            }`}
          >
            <ImageIcon className="w-5 h-5" /> Manage Gallery
          </button>
          <button 
            onClick={() => setActiveTab("offers")}
            className={`w-full text-left px-5 py-4 rounded-xl font-bold flex items-center gap-3 transition-all ${
              activeTab === "offers" 
                ? "bg-gradient-to-r from-red-600/10 to-orange-600/10 border border-red-500/30 text-red-400" 
                : "bg-zinc-900/40 border border-zinc-800/60 text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200"
            }`}
          >
            <Gift className="w-5 h-5" /> Manage Offers
          </button>

          <div className="mt-8 p-4 bg-zinc-900/30 border border-zinc-900 rounded-xl">
            <h4 className="text-xs text-zinc-600 uppercase font-bold tracking-wider mb-2">DB Status</h4>
            <div className="flex flex-col gap-1.5 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Total Skills:</span>
                <span className="font-bold text-zinc-200">{skills.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Projects:</span>
                <span className="font-bold text-zinc-200">{projects.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content Panel */}
        <div className="lg:col-span-9 flex flex-col gap-8">
          
          {/* TAB 0: SITE SETTINGS */}
          {activeTab === "site" && (
            <div className="flex flex-col gap-8">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-zinc-200 mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-red-500" /> Website Configuration
                </h3>
                
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    
                    let updatedConfig = { ...siteConfig };
                    if (newLogoFile) updatedConfig.logoImage = newLogoFile as any;
                    if (newHeroFile) {
                      updatedConfig.hero = updatedConfig.hero || {};
                      updatedConfig.hero.image = newHeroFile as any;
                    }
                    
                    const loadingToast = toast.loading("Saving site configuration...");
                    try {
                      const res = await fetch("/api/portfolio", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          siteConfig: updatedConfig,
                          skills,
                          projects,
                          shifts,
                          offers,
                          passphrase
                        })
                      });
                      if (res.ok) {
                        toast.dismiss(loadingToast);
                        toast.success("Site configuration saved!");
                        fetchPortfolioData(passphrase);
                        setNewLogoFile(null);
                        setNewHeroFile(null);
                      } else {
                        toast.dismiss(loadingToast);
                        toast.error("Failed to save site config.");
                      }
                    } catch (err) {
                      toast.dismiss(loadingToast);
                      toast.error("Network error.");
                    }
                  }} 
                  className="flex flex-col gap-6"
                >
                  
                  {/* BRANDING SECTION */}
                  <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-950/30 flex flex-col gap-4">
                    <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest border-b border-zinc-800 pb-2">Branding & Hero</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Website Title / Text Logo</label>
                        <input type="text" value={siteConfig.title} onChange={(e) => setSiteConfig({...siteConfig, title: e.target.value})} className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 text-sm" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Upload Custom Logo (Optional)</label>
                        <div className="flex items-center gap-4">
                          <input type="file" accept="image/*" onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setNewLogoFile({ name: file.name, data: reader.result as string });
                                reader.readAsDataURL(file);
                              }
                            }} className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 text-sm flex-1 text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 cursor-pointer" />
                          {(newLogoFile || siteConfig.logoImage) && (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-zinc-800 shrink-0 bg-white"><img src={newLogoFile ? newLogoFile.data : siteConfig.logoImage} alt="Logo" className="object-contain w-full h-full" /></div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Upload Hero Image</label>
                        <div className="flex items-center gap-4">
                          <input type="file" accept="image/*" onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setNewHeroFile({ name: file.name, data: reader.result as string });
                                reader.readAsDataURL(file);
                              }
                            }} className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 text-sm flex-1 text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 cursor-pointer" />
                          {(newHeroFile || siteConfig.hero?.image) && (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-zinc-800 shrink-0"><img src={newHeroFile ? newHeroFile.data : siteConfig.hero.image} alt="Hero" className="object-cover w-full h-full" /></div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Hero Quote</label>
                        <input type="text" value={siteConfig.hero?.quote || ""} onChange={(e) => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, quote: e.target.value} as any})} className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 text-sm" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Hero Location Text</label>
                        <input type="text" value={siteConfig.hero?.locationText || ""} onChange={(e) => setSiteConfig({...siteConfig, hero: {...siteConfig.hero, locationText: e.target.value} as any})} className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 text-sm" />
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Moving Text Phrases (Comma separated)</label>
                        <textarea value={siteConfig.typewriterStrings.join(", ")} onChange={(e) => setSiteConfig({...siteConfig, typewriterStrings: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})} rows={2} className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 text-sm resize-none" />
                      </div>
                    </div>
                  </div>

                  {/* CONTACT INFO */}
                  <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-950/30 flex flex-col gap-4">
                    <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest border-b border-zinc-800 pb-2">Contact & Location</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Phone Number (For Call Button)</label>
                        <input type="text" value={siteConfig.contact?.phone || ""} onChange={(e) => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, phone: e.target.value} as any})} placeholder="+91 XXXXX XXXXX" className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 text-sm" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">WhatsApp Number</label>
                        <input type="text" value={siteConfig.contact?.whatsapp || ""} onChange={(e) => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, whatsapp: e.target.value} as any})} placeholder="91XXXXXXXXXX" className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 text-sm" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Map Link (For Maps Button)</label>
                        <input type="text" value={siteConfig.contact?.mapUrl || ""} onChange={(e) => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, mapUrl: e.target.value} as any})} className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 text-sm" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Map Embed URL (For Contact Form)</label>
                        <input type="text" value={siteConfig.contact?.mapEmbedUrl || ""} onChange={(e) => setSiteConfig({...siteConfig, contact: {...siteConfig.contact, mapEmbedUrl: e.target.value} as any})} placeholder="https://www.google.com/maps/embed?..." className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* SEATS INFO */}
                  <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-950/30 flex flex-col gap-4">
                    <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest border-b border-zinc-800 pb-2">Seat Availability</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Available Seats</label>
                        <input type="number" value={(siteConfig as any).seats?.available ?? 42} onChange={(e) => setSiteConfig({...siteConfig, seats: {...(siteConfig as any).seats, available: parseInt(e.target.value)}} as any)} placeholder="e.g. 42" className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 text-sm" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Seats</label>
                        <input type="number" value={(siteConfig as any).seats?.total ?? 100} onChange={(e) => setSiteConfig({...siteConfig, seats: {...(siteConfig as any).seats, total: parseInt(e.target.value)}} as any)} placeholder="e.g. 100" className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 text-sm" />
                      </div>
                    </div>
                  </div>

                  {/* SHIFTS */}
                  <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-950/30 flex flex-col gap-4">
                    <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest border-b border-zinc-800 pb-2">Booking Shifts</h4>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Shift Options (Comma separated)</label>
                      <textarea value={shifts.join(",\n")} onChange={(e) => setShifts(e.target.value.split(",").map(s => s.trim()).filter(Boolean))} rows={4} className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 text-sm resize-none" placeholder="Full Day, Morning (7 AM - 12 PM)..." />
                    </div>
                  </div>

                  {/* SECTION HEADERS */}
                  <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-950/30 flex flex-col gap-4">
                    <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest border-b border-zinc-800 pb-2">Section Headers</h4>
                    <div className="grid grid-cols-1 gap-6">
                      {['offers', 'features', 'gallery', 'contact'].map(sec => {
                        const sectionData = (siteConfig.sectionHeaders as any)?.[sec] || { title: "", subtitle: "" };
                        return (
                          <div key={sec} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-zinc-900 rounded-lg">
                            <div className="flex flex-col gap-2">
                              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{sec} Title</label>
                              <input type="text" value={sectionData.title} onChange={(e) => {
                                const newHeaders = { ...siteConfig.sectionHeaders, [sec]: { ...sectionData, title: e.target.value } };
                                setSiteConfig({...siteConfig, sectionHeaders: newHeaders as any});
                              }} className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 text-sm" />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{sec} Subtitle</label>
                              <input type="text" value={sectionData.subtitle} onChange={(e) => {
                                const newHeaders = { ...siteConfig.sectionHeaders, [sec]: { ...sectionData, subtitle: e.target.value } };
                                setSiteConfig({...siteConfig, sectionHeaders: newHeaders as any});
                              }} className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 text-sm" />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-2">
                    <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 py-3 px-4 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2">
                      Save Full Configuration
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 1: SKILLS MANAGEMENT */}
          {activeTab === "skills" && (
            <div className="flex flex-col gap-8">
              
              {/* Form to Add Skill */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-zinc-200 mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-red-500" /> Add New Feature/Amenity
                </h3>
                <form onSubmit={handleAddSkill} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Feature/Amenity Name</label>
                    <input 
                      type="text" 
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="e.g. RO Drinking Water"
                      className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Category</label>
                    <select 
                      value={newSkillCategory}
                      onChange={(e) => setNewSkillCategory(e.target.value)}
                      className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm"
                    >
                      <option value="Features">Features</option>
                      <option value="Amenities">Amenities</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Description</label>
                    <textarea 
                      value={newSkillDesc}
                      onChange={(e) => setNewSkillDesc(e.target.value)}
                      placeholder="Write a compelling description for this feature..."
                      rows={2}
                      className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm resize-none"
                    />
                  </div>

                  {/* Icon Selector Grid */}
                  <div className="md:col-span-2 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Select Icon ({newSkillIcon})</label>
                      <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-xs">
                        <Search className="w-3.5 h-3.5 text-zinc-500" />
                        <input 
                          type="text" 
                          placeholder="Search icons..." 
                          value={iconSearch}
                          onChange={(e) => setIconSearch(e.target.value)}
                          className="bg-transparent focus:outline-none text-zinc-300 w-28"
                        />
                      </div>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 max-h-40 overflow-y-auto grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                      {filteredIcons.map((icon) => (
                        <button
                          key={icon.key}
                          type="button"
                          onClick={() => setNewSkillIcon(icon.key)}
                          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                            newSkillIcon === icon.key 
                              ? "bg-red-600/20 border border-red-500/60 text-red-400 scale-105" 
                              : "border border-zinc-800/40 hover:bg-zinc-800/40 text-zinc-400"
                          }`}
                        >
                          <span className="text-xl">{icon.element}</span>
                          <span className="text-[9px] truncate max-w-full mt-1.5">{icon.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selector */}
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Icon Color Class</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset.class}
                          type="button"
                          onClick={() => setNewSkillColor(preset.class)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                            newSkillColor === preset.class
                              ? "border-white/80 scale-105"
                              : "border-zinc-850 hover:bg-zinc-850"
                          } ${preset.class}`}
                        >
                          <span className={`w-3 h-3 rounded-full ${preset.bg}`} />
                          {preset.name}
                        </button>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      value={newSkillColor}
                      onChange={(e) => setNewSkillColor(e.target.value)}
                      placeholder="Custom CSS e.g. text-orange-500"
                      className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 py-3 px-4 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add to Features Grid
                    </button>
                  </div>
                </form>
              </div>

              {/* Features List by Category */}
              <div className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-zinc-200 mb-6">Current Features & Amenities Database</h3>
                
                <div className="flex flex-col gap-8">
                  {["Features", "Amenities"].map((category) => {
                    const catSkills = skills.filter(s => s.category === category);
                    return (
                      <div key={category} className="flex flex-col gap-3">
                        <h4 className="text-sm font-bold text-red-500/80 border-b border-zinc-800/80 pb-2">{category}</h4>
                        {catSkills.length === 0 ? (
                          <p className="text-xs text-zinc-650 italic">No features in this category.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {skills.map((skill, originalIndex) => {
                              if (skill.category !== category) return null;
                              return (
                                <div 
                                  key={originalIndex}
                                  className="flex justify-between items-center bg-zinc-900/60 border border-zinc-800/60 p-3 rounded-xl"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className={`text-xl ${skill.iconColor}`}>
                                      {allIcons.find(i => i.key === skill.icon)?.element || <Sparkles />}
                                    </span>
                                    <div>
                                      <p className="text-sm font-semibold">{skill.name}</p>
                                      {skill.description && <p className="text-[10px] text-zinc-400 truncate max-w-[150px]">{skill.description}</p>}
                                      <p className="text-[10px] text-zinc-550 mt-1">{skill.icon} • {skill.iconColor}</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteSkill(originalIndex)}
                                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Delete Feature"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PROJECTS MANAGEMENT */}
          {activeTab === "projects" && (
            <div className="flex flex-col gap-8">
              
              {/* Form to Add Gallery Item */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-zinc-200 mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-red-500" /> Add New Gallery Image
                </h3>
                
                <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Image Title</label>
                    <input 
                      type="text" 
                      value={newProjTitle}
                      onChange={(e) => setNewProjTitle(e.target.value)}
                      placeholder="e.g. Quiet Study Zone"
                      className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Location / Zone</label>
                    <input 
                      type="text" 
                      value={newProjRole}
                      onChange={(e) => setNewProjRole(e.target.value)}
                      placeholder="e.g. 1st Floor / Ground Floor"
                      className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Description</label>
                    <textarea 
                      value={newProjDesc}
                      onChange={(e) => setNewProjDesc(e.target.value)}
                      placeholder="Describe the ambiance and features visible in this area..."
                      rows={3}
                      className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Extra Link 1 (Optional)</label>
                    <input 
                      type="text" 
                      value={newProjGithub}
                      onChange={(e) => setNewProjGithub(e.target.value)}
                      placeholder="https://github.com/..."
                      className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Extra Link 2 (Optional)</label>
                    <input 
                      type="text" 
                      value={newProjLive}
                      onChange={(e) => setNewProjLive(e.target.value)}
                      placeholder="https://... (or #)"
                      className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Date / Year</label>
                    <input 
                      type="text" 
                      value={newProjYear}
                      onChange={(e) => setNewProjYear(e.target.value)}
                      placeholder="e.g. 2024"
                      className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Upload Gallery Image</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewProjFile({
                                name: file.name,
                                data: reader.result as string
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm flex-1 text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
                      />
                      {newProjFile && (
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-zinc-800 shrink-0">
                          <img 
                            src={newProjFile.data} 
                            alt="Preview" 
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Card Gradient Background</label>
                    <input 
                      type="text" 
                      value={newProjGradient}
                      onChange={(e) => setNewProjGradient(e.target.value)}
                      placeholder="e.g. #14f195, rgb(13, 1, 60)"
                      className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">Format: start-color, end-color (accepts Hex, RGB, HSL)</p>
                  </div>

                  {/* Amenities Multi-Select Checklist */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Amenities / Features tags (Select all that apply)</label>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                      {Object.keys(techIconMap).map((techKey) => {
                        const isChecked = newProjTech.includes(techKey);
                        return (
                          <label 
                            key={techKey}
                            className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-all border ${
                              isChecked 
                                ? "bg-red-600/10 border-red-500/50 text-red-400" 
                                : "border-zinc-900/60 bg-zinc-900/20 text-zinc-400 hover:bg-zinc-900/40"
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => handleTechCheckboxChange(techKey)}
                              className="hidden"
                            />
                            <span className="text-sm select-none capitalize">{techKey}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 py-3 px-4 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Save Gallery Image
                    </button>
                  </div>
                </form>
              </div>

              {/* Projects List */}
              <div className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-zinc-200 mb-6">Current Gallery Images</h3>
                
                {projects.length === 0 ? (
                  <p className="text-sm text-zinc-500 italic">No images found in database.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {projects.map((project, idx) => (
                      <div 
                        key={idx}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-900/50 border border-zinc-800/80 p-4 rounded-xl gap-4"
                      >
                        <div className="flex-1 flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-bold text-zinc-100">{project.title}</h4>
                            <span className="bg-zinc-850 px-2 py-0.5 rounded text-[10px] text-zinc-450 border border-zinc-800">{project.year}</span>
                            <span className="bg-orange-950/30 text-orange-400 px-2 py-0.5 rounded text-[10px] border border-orange-900/30">{project.role}</span>
                          </div>
                          <p className="text-xs text-zinc-450 line-clamp-2 leading-relaxed">{project.description}</p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {project.techStack.map(tech => (
                              <span key={tech} className="bg-zinc-950/80 border border-zinc-850/80 px-2 py-0.5 rounded text-[9px] text-zinc-500 capitalize">{tech}</span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteProject(idx)}
                          className="p-2.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all self-end md:self-center shrink-0 border border-zinc-800/40"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: OFFERS MANAGEMENT */}
          {activeTab === "offers" && (
            <div className="flex flex-col gap-8">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-zinc-200 mb-6 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-red-500" /> Add New Offer
                </h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newOfferTitle.trim()) {
                    toast.warning("Offer title is required.");
                    return;
                  }
                  const updatedOffers = [
                    ...offers,
                    {
                      title: newOfferTitle.trim(),
                      description: newOfferDesc.trim(),
                      icon: newOfferIcon,
                      color: newOfferColor,
                      borderColor: newOfferBorder
                    }
                  ];
                  saveDatabase(skills, projects, shifts, updatedOffers);
                  setNewOfferTitle("");
                  setNewOfferDesc("");
                  toast.success(`Added offer: ${newOfferTitle}`);
                }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Offer Title</label>
                    <input type="text" value={newOfferTitle} onChange={(e) => setNewOfferTitle(e.target.value)} placeholder="e.g. Early Bird Special" className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Icon (Lucide Icon Name)</label>
                    <input type="text" value={newOfferIcon} onChange={(e) => setNewOfferIcon(e.target.value)} placeholder="e.g. Clock, Users, Gift" className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm" />
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Description</label>
                    <textarea value={newOfferDesc} onChange={(e) => setNewOfferDesc(e.target.value)} placeholder="Join before 8 AM and get 10% off..." rows={2} className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm resize-none" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Gradient Color</label>
                    <input type="text" value={newOfferColor} onChange={(e) => setNewOfferColor(e.target.value)} placeholder="e.g. from-orange-500/20 to-transparent" className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Border Color</label>
                    <input type="text" value={newOfferBorder} onChange={(e) => setNewOfferBorder(e.target.value)} placeholder="e.g. border-orange-500/20" className="bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors text-sm" />
                  </div>

                  <div className="md:col-span-2">
                    <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 py-3 px-4 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> Save New Offer
                    </button>
                  </div>
                </form>
              </div>

              {/* Offers List */}
              <div className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-zinc-200 mb-6">Current Offers Database</h3>
                {offers.length === 0 ? (
                  <p className="text-sm text-zinc-500 italic">No offers found.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {offers.map((offer, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-zinc-900/50 border border-zinc-800/80 p-4 rounded-xl gap-4">
                        <div className="flex flex-col gap-1">
                          <h4 className="text-base font-bold text-zinc-100">{offer.title} <span className="text-xs text-zinc-500 font-normal">({offer.icon})</span></h4>
                          <p className="text-sm text-zinc-450">{offer.description}</p>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${offer.title}?`)) {
                              saveDatabase(skills, projects, shifts, offers.filter((_, i) => i !== idx));
                            }
                          }}
                          className="p-2.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-zinc-800/40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
