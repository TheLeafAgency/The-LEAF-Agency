import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import ServiceCards from "@/components/ServiceCards";

export default function Home() {
  return (
    <main id="top">
      <Navbar />
      <Hero />
      <ServicesSection />
      <ServiceCards />
    </main>
  );
}
