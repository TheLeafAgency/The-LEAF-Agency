import ServicesBotanical from "@/components/ServicesBotanical";
import AnimatedServiceContent from "@/components/AnimatedServiceContent";

const services = [
  {
    slug: "marketing",
    title: "Marketing",
    eyebrow: "Strategy & Direction",
    description: "Marketing is the foundation behind an advertisement that knows who it is speaking to and why that audience should care.",
    detail: "LEAF can help shape the direction of a campaign, from understanding the business and its audience to developing ideas, messaging, and promotional concepts that fit the goal. The focus is not simply on making something look good; it is on giving the creative work a purpose.",
    includes: ["Campaign direction", "Audience-focused ideas", "Promotional concepts"],
  },
  {
    slug: "filming",
    title: "Filming",
    eyebrow: "Production",
    description: "Filming turns an idea into something people can actually see, whether that means a commercial, social clip, product piece, or larger production.",
    detail: "LEAF can help plan and capture the footage needed for an advertisement. We can work around the location, people, products, and story involved in the shoot so the footage is captured with the final advertisement in mind.",
    includes: ["Commercial filming", "Product footage", "Social content"],
  },
  {
    slug: "product",
    title: "Product",
    eyebrow: "Show What You Sell",
    description: "Product advertising puts the thing you sell at the center and gives people a reason to notice it.",
    detail: "We can create product-focused visuals and advertising concepts that show how a product looks, works, feels, or fits into someone's life. The approach can range from straightforward product presentation to a more developed creative campaign.",
    includes: ["Product advertising", "Product visuals", "Promotional concepts"],
  },
  {
    slug: "copywriting",
    title: "Copywriting",
    eyebrow: "Words That Work",
    description: "The right words can turn an interesting visual into an advertisement that actually communicates something.",
    detail: "LEAF can develop headlines, taglines, calls to action, campaign language, website copy, and other written material used to communicate a business or product. The writing is shaped around the audience, the platform, and the message the business needs to deliver.",
    includes: ["Headlines & taglines", "Ad copy", "Calls to action"],
  },
  {
    slug: "editing",
    title: "Editing",
    eyebrow: "Bring It Together",
    description: "Editing takes the pieces of a production and turns them into a finished piece of content.",
    detail: "If you already have footage, LEAF can help shape it into an advertisement or social piece. Editing can involve pacing, structure, visual choices, sound, text, and the overall flow of the final piece so that the finished result feels intentional.",
    includes: ["Video editing", "Ad assembly", "Social-ready cuts"],
  },
  {
    slug: "social-media",
    title: "Social Media",
    eyebrow: "Stay Visible",
    description: "Social media gives businesses a place to keep their audience connected to what they are doing.",
    detail: "LEAF can create content and creative concepts designed for social platforms, from short-form videos to promotional graphics and campaign ideas. The goal is to give the business material it can consistently use without losing its identity.",
    includes: ["Social campaigns", "Short-form content", "Promotional posts"],
  },
  {
    slug: "public-events",
    title: "Public Events",
    eyebrow: "Take It Outside",
    description: "Public events can turn advertising into an experience people can physically see and participate in.",
    detail: "LEAF can help businesses develop advertising concepts for public events, launches, pop-ups, activations, and other in-person promotional opportunities. We can help shape the creative direction and the materials needed to make the event feel connected to the brand.",
    includes: ["Event concepts", "Pop-up promotion", "Brand activations"],
  },
  {
    slug: "authentic-ads",
    title: "Authentic Ads",
    eyebrow: "Real Stories",
    description: "Authentic advertising focuses on making an advertisement feel connected to the real business, people, and story behind it.",
    detail: "Instead of forcing every business into the same advertising formula, LEAF can build creative around what makes that business genuinely different. That might mean real people, real locations, real products, or a story that customers can recognize themselves in.",
    includes: ["Story-driven ads", "Real business features", "Human-centered creative"],
  },
  {
    slug: "brand",
    title: "Brand",
    eyebrow: "Build Recognition",
    description: "A strong brand gives all of your advertising something consistent to build from.",
    detail: "LEAF can help businesses develop creative that feels recognizable across advertisements, products, social media, and other customer touchpoints. The work can support a new identity or help an existing business bring its visual and verbal presence together.",
    includes: ["Brand direction", "Creative consistency", "Visual identity support"],
  },
];

export default function ServicesPage() {
  return (
    <main className="services-page">
        <ServicesBotanical />
        <section className="services-hero" id="services-top">
          <svg className="services-hero-botanical services-hero-botanical-left" viewBox="0 0 260 520" aria-hidden="true">
            <path d="M18 500 C45 390 62 290 92 205 C118 132 145 72 215 20" />
            <path d="M72 315 C48 275 34 244 28 198" />
            <path d="M103 222 C138 190 170 157 186 116" />
            <path d="M54 370 C92 350 118 323 135 286" />
            <path className="hero-leaf" d="M28 198 C2 180 0 150 12 126 C40 133 53 157 28 198Z" />
            <path className="hero-leaf" d="M186 116 C196 82 222 68 246 76 C240 105 219 120 186 116Z" />
            <path className="hero-leaf" d="M135 286 C154 259 181 251 202 263 C188 288 164 297 135 286Z" />
            <path className="hero-leaf" d="M92 205 C68 183 65 155 78 136 C101 148 111 174 92 205Z" />
          </svg>
          <svg className="services-hero-botanical services-hero-botanical-right" viewBox="0 0 260 520" aria-hidden="true">
            <path d="M242 500 C215 390 198 290 168 205 C142 132 115 72 45 20" />
            <path d="M188 315 C212 275 226 244 232 198" />
            <path d="M157 222 C122 190 90 157 74 116" />
            <path d="M206 370 C168 350 142 323 125 286" />
            <path className="hero-leaf" d="M232 198 C258 180 260 150 248 126 C220 133 207 157 232 198Z" />
            <path className="hero-leaf" d="M74 116 C64 82 38 68 14 76 C20 105 41 120 74 116Z" />
            <path className="hero-leaf" d="M125 286 C106 259 79 251 58 263 C72 288 96 297 125 286Z" />
            <path className="hero-leaf" d="M168 205 C192 183 195 155 182 136 C159 148 149 174 168 205Z" />
          </svg>
          <div className="container services-hero-inner">
            <p className="services-eyebrow">What We Do</p>
            <h1>Our Services</h1>
            <p>
              Advertising is more than one finished video. Explore the different
              ways LEAF can help plan, create, shape, and put your ideas into motion.
            </p>
          </div>
        </section>

        <nav className="services-jump-nav" aria-label="Services sections">
          <div className="services-jump-inner">
            <a href="/" className="services-jump-home">LEAF</a>
            <div className="services-jump-links">
              {services.map((service) => (
                <a key={service.slug} href={`#${service.slug}`}>
                  {service.title}
                </a>
              ))}
            </div>
          </div>
        </nav>

        <div className="services-detail-list">
          {services.map((service, index) => (
            <section
              key={service.slug}
              id={service.slug}
              className="service-detail-section"
            >
              <div className="container service-detail-inner">
                <div className={`service-media-slot service-media-${index % 2 === 0 ? "left" : "right"}`} aria-hidden="true">
                  <div className="service-media-stack">
                    <div className="service-media-placeholder service-media-card service-media-card-back-three">Photo / Video</div>
                    <div className="service-media-placeholder service-media-card service-media-card-back-two">Photo / Video</div>
                    <div className="service-media-placeholder service-media-card service-media-card-back-one">Photo / Video</div>
                    <div className="service-media-placeholder service-media-card service-media-card-front">Photo / Video</div>
                    <div className="service-media-placeholder service-media-card service-media-card-front-top">Photo / Video</div>
                  </div>
                </div>
                <AnimatedServiceContent variant="center">
                  <div className="service-detail-copy">
                  <p className="services-eyebrow">{service.eyebrow}</p>
                  <h2>{service.title}</h2>
                  <p className="service-detail-lead">{service.description}</p>
                  <p className="service-detail-body">{service.detail}</p>
                  <div className="service-detail-includes">
                    {service.includes.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  </div>
                </AnimatedServiceContent>
              </div>
            </section>
          ))}
        </div>

        <section className="services-ending">
          <div className="container">
            <p className="services-eyebrow">And beyond</p>
            <h2>Have something else in mind?</h2>
            <p>
              These are some of the ways we work, but they are not a box.
              If your business has an idea that does not fit neatly into one
              category, bring it to LEAF and we can figure out the creative path together.
            </p>
            <a href="/get-started" className="primary-btn">Get Started</a>
          </div>
        </section>
      </main>
  );
}
