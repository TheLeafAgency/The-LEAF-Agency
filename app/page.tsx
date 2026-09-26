import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ServiceCards from "@/components/ServiceCards";
import ContactSection from "@/components/ContactSection";
import BotanicalGrowth from "@/components/BotanicalGrowth";

export default function Home() {
  return (
    <main id="top" className="leaf-botanical-page">
      <BotanicalGrowth />
      <Navbar />
      <Hero />
      <AboutSection />
      <ServicesSection />
      <ServiceCards />
      <ContactSection />
    </main>
  );
}
