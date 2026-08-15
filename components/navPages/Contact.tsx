"use client";
import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { jetbrainsMono } from "@/app/font";
import { toast } from "sonner";
import initialData from "@/data/portfolio.json";

export default function Contact() {
  const shiftsData = initialData.shifts && initialData.shifts.length > 0 ? initialData.shifts : [
    "Full Day",
    "Morning (7 AM - 12 PM)",
    "Afternoon (12 PM - 5 PM)",
    "Evening (5 PM - 10 PM)"
  ];
  
  const sectionHeaders = (initialData.siteConfig as any)?.sectionHeaders?.contact || {
    title: "Book My Seat",
    subtitle: "Fill out the form below to reserve your spot instantly!"
  };
  const whatsappNumber = (initialData.siteConfig as any)?.contact?.whatsapp || "917999436719";
  const mapEmbedUrl = (initialData.siteConfig as any)?.contact?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3628.499981932014!2d80.84138827496444!3d24.571935478118753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39847f5994f154d3%3A0xd9c8e32aebcd56b4!2sINSIGHT%20LIBRARY!5e0!3m2!1sen!2sin!4v1786779767504!5m2!1sen!2sin";

  const [form, setForm] = useState({ name: "", email: "", phone: "", shift: shiftsData[0] });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const message = `Hi, I would like to book a seat at Insight Library.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nShift: ${form.shift}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");

    toast.success("Redirecting to WhatsApp...");
    setForm({ name: "", email: "", phone: "", shift: shiftsData[0] });
    setLoading(false);
  };

  return (
    <div id="contact" className={`${jetbrainsMono.className} w-full max-w-4xl px-6 py-16 md:py-24 text-foreground`}>
      <div className="mx-auto text-center">
        <h2 className={` text-4xl md:text-6xl font-bold mb-6`}>
          {sectionHeaders.title}
        </h2>
        <p className="text-muted-foreground mb-10">{sectionHeaders.subtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-start mt-8">
        <form
          onSubmit={handleSubmit}
          className="flex-1 w-full flex flex-col gap-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={form.name}
            onChange={handleChange}
            className="rounded-lg p-3 bg-background border border-border focus:border-[#e8390d] focus:ring-[#e8390d] outline-none transition-colors duration-300"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            value={form.email}
            onChange={handleChange}
            className="rounded-lg p-3 bg-background border border-border focus:border-[#e8390d] focus:ring-[#e8390d] outline-none transition-colors duration-300"
          />

          <input
            type="tel"
            name="phone"
            required
            value={form.phone}
            onChange={handleChange}
            className="rounded-lg p-3 bg-background border border-border focus:border-[#e8390d] focus:ring-[#e8390d] outline-none transition-colors duration-300"
            placeholder="Phone Number (+91 XXXXX XXXXX)"
          />

          <select
            name="shift"
            value={form.shift}
            onChange={handleChange}
            className="rounded-lg p-3 bg-background border border-border focus:border-[#e8390d] focus:ring-[#e8390d] outline-none transition-colors duration-300"
          >
            {shiftsData.map((shift: string) => (
              <option key={shift} value={shift}>{shift}</option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 self-end w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold transition-all shadow-lg"
          >
            {loading ? "Sending..." : "Confirm Booking"} <Send size={16} />
          </button>
        </form>

        <div className="flex-1 w-full flex flex-col gap-4 h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow-lg border border-border bg-zinc-100 dark:bg-zinc-900 mt-8 md:mt-0">
          <iframe 
            src={mapEmbedUrl} 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Insight Library Location"
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
