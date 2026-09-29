import Navbar from "@/components/Navbar";

const services: Record<string, { title: string; description: string; details: string }> = {
  marketing: { title: "Marketing", description: "Strategic marketing designed to help your business reach the right audience and grow.", details: "We help turn your goals into a clear marketing direction, from understanding your audience to shaping campaigns that fit your business." },
  filming: { title: "Filming", description: "Professional video production for advertisements, campaigns, social media, and more.", details: "From planning a shoot to capturing footage, we create visual content with the final advertisement in mind." },
  product: { title: "Product", description: "Creative product-focused content that presents what you sell in its best light.", details: "We create advertising and visual content that puts your product at the center and helps customers understand what makes it worth their attention." },
  copywriting: { title: "Copywriting", description: "Clear, engaging copy for advertisements, campaigns, websites, and social media.", details: "We develop headlines, messaging, calls to action, and other written material around the audience and platform." },
  editing: { title: "Editing", description: "Polished video and visual editing that turns your footage into finished content.", details: "Already have footage? We can shape it into a finished advertisement or social piece with purposeful pacing and structure." },
  "social-media": { title: "Social Media", description: "Content and creative designed to give your social presence a stronger identity.", details: "We create social-ready content that keeps your business visually consistent and gives your audience a reason to pay attention." },
  "public-events": { title: "Public Events", description: "Advertising concepts for events, launches, pop-ups, and in-person experiences.", details: "We help shape the creative direction and promotional materials that connect an event back to the business and its audience." },
  "authentic-ads": { title: "Authentic Ads", description: "Advertising built around the real people, products, places, and stories behind a business.", details: "Rather than forcing every business into the same formula, we can build creative around what makes that business genuinely different." },
  brand: { title: "Brand", description: "Creative direction that helps your business become recognizable and consistent.", details: "We help bring visual and verbal elements together so advertisements, products, social media, and other customer touchpoints feel connected." },
};

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services[slug];

  if (!service) {
    return (
      <main style={{ minHeight: "100vh", background: "#F3F0E7", padding: "140px 24px", textAlign: "center" }}>
        <h1 style={{ color: "#048243", fontFamily: '"BPMF Huninn", sans-serif', fontSize: "clamp(3rem, 8vw, 5rem)" }}>Service Not Found</h1>
        <a href="/services" className="secondary-btn" style={{ display: "inline-block", marginTop: "30px", padding: "12px 28px", borderRadius: "999px", fontWeight: 700 }}>Back to Services</a>
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "#F3F0E7", padding: "140px 24px 100px" }}>
        <div className="container" style={{ maxWidth: "900px", textAlign: "center" }}>
          <p style={{ color: "#048243", fontWeight: 700, letterSpacing: "4px", marginBottom: "18px", textTransform: "uppercase" }}>LEAF Service</p>
          <h1 style={{ fontFamily: '"BPMF Huninn", sans-serif', fontSize: "clamp(3.5rem, 9vw, 6rem)", lineHeight: 1, color: "#048243", marginBottom: "28px" }}>{service.title}</h1>
          <p style={{ maxWidth: "720px", margin: "0 auto 28px", color: "#555", fontSize: "1.25rem", lineHeight: 1.8 }}>{service.description}</p>
          <p style={{ maxWidth: "720px", margin: "0 auto", color: "#666", fontSize: "1.1rem", lineHeight: 1.9 }}>{service.details}</p>
          <div style={{ marginTop: "48px", display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/get-started" className="primary-btn" style={{ display: "inline-block", padding: "14px 30px", borderRadius: "999px", fontWeight: 700 }}>Get Started</a>
            <a href="/services" className="secondary-btn" style={{ display: "inline-block", padding: "12px 28px", borderRadius: "999px", fontWeight: 700 }}>All Services</a>
          </div>
        </div>
      </main>
    </>
  );
}
