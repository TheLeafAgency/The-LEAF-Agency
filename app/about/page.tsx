import Navbar from "@/components/Navbar";

const values = [
  {
    title: "Advertising With Purpose",
    paragraphs: [
      "We believe the best advertisements do more than sell a product or promote a service. They capture what makes a business special, communicate its values, and give people a genuine reason to connect with it.",
      "That is why we prioritize creativity, quality, and authenticity in everything we do. We believe effective advertising should feel human because it is made for humans. Rather than relying on AI-generated advertisements that can feel impersonal or disconnected from the people they are meant to reach, we focus on thoughtful creative work, genuine storytelling, and intentional production. We want every advertisement to have a clear purpose, a distinct identity, and the human touch that helps a message resonate.",
      "Every business is different, and its advertising should reflect that. We take the time to understand what makes each brand unique so the final result feels true to the people behind it—not like another generic advertisement lost in the crowd."
    ]
  },
  {
    title: "Open to Every Business. Built Around Your Vision.",
    paragraphs: [
      "We believe great ideas deserve the opportunity to be seen. LEAF welcomes businesses of all sizes and industries, along with products and services of all kinds. We approach every opportunity with an open mind, recognizing that every brand has its own audience, challenges, and potential.",
      "Our goal is to work with you to develop advertising that reaches the right people, communicates the right message, and supports your broader business goals. That means looking beyond the advertisement itself. We consider your audience, your objectives, your budget, and the most effective ways to bring your vision to life.",
      "We also believe quality advertising should be accessible. Our aim is to offer fair, transparent pricing that respects the value of our work while remaining mindful of your business's resources. We want every partnership to make sense for both sides, creating an opportunity for your business to grow while allowing us to continue delivering work we're proud of."
    ]
  },
  {
    title: "More Than a Client. A Partner.",
    paragraphs: [
      "At LEAF, we don't want you to feel like just another client on a list. We want you to be our partner.",
      "A meaningful partnership is built on communication, trust, collaboration, and a shared commitment to achieving something worthwhile. We want to understand your vision, listen to your ideas, be honest about what we can accomplish, and work alongside you to find the best approach for your business.",
      "Your success matters because the businesses we work with are more than projects. They are people, ambitions, and communities worth investing in. Our goal is not simply to deliver an advertisement and move on. It's to help you build a stronger connection with your audience, establish your brand's identity, and create opportunities for continued growth."
    ]
  }
];

export default function AboutPage() {
  return (
    <main className="about-page">
      <Navbar />
      <section className="about-hero">
        <div className="container about-hero-content">
          <img className="about-world-tree" src="/leaf-world-tree.svg" alt="A wide green-canopied tree with a brown trunk and roots" />
          <p className="about-eyebrow">The LEAF Agency</p>
          <h1>Who We Are</h1>
          <p className="about-tagline">Advertising Made Simple. Partnerships Made Meaningful.</p>
          <p className="about-intro">
            At LEAF Agency, we believe every hardworking business has a story worth telling.
            Behind every local shop, growing company, and thoughtfully created product are
            people who have invested their time, passion, and dedication into building
            something meaningful. Our mission is to help those businesses share their stories
            through authentic, compelling advertising that connects with real people.
          </p>
          <p className="about-intro">
            We understand that running a business takes more than a great idea. It takes
            determination, long hours, difficult decisions, and a commitment to the people
            you serve. We want to help those efforts receive the recognition they deserve.
            Whether you're a small local business looking to reach your first customers, an
            established company ready to grow, or a brand introducing a new product, LEAF is
            here to help you take that next step.
          </p>
        </div>
      </section>

      <div className="container about-values">
        {values.map((value) => (
          <section className="about-value-section" key={value.title}>
            <span className="about-section-ornament" aria-hidden="true">✦</span>
            <h2>{value.title}</h2>
            <div className="about-value-copy">
              {value.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="about-closing">
        <div className="container about-closing-content">
          <p className="about-eyebrow">Growing Together, One Story at a Time</p>
          <h2>Authentic Businesses Deserve Authentic Advertising.</h2>
          <p>
            We want to help hardworking people bring their ideas to life, give deserving
            brands a stronger voice, and create advertisements that people remember for the
            right reasons. Through quality creative work, fair pricing, thoughtful planning,
            and genuine collaboration, we strive to make advertising a more personal and
            rewarding experience for everyone involved.
          </p>
          <p className="about-final-line">Your business has a story. We want to help you tell it.</p>
          <a href="/get-started" className="hero-button primary-btn about-cta">Let's Work Together</a>
        </div>
      </section>
    </main>
  );
}
