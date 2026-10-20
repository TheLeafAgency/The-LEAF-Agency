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

function WorldTreeMark() {
  return (
    <svg className="about-world-tree" viewBox="0 0 720 230" role="img" aria-label="A stylized tree with wide-reaching branches">
      <g className="about-tree-branches">
        <path d="M360 206 C356 160 363 119 360 76 C357 54 347 37 328 20" />
        <path d="M359 119 C325 106 300 83 277 61 C258 43 235 39 211 44" />
        <path d="M359 139 C321 133 291 119 262 98 C234 79 210 76 184 84" />
        <path d="M359 157 C322 157 292 148 265 134 C235 118 211 120 188 132" />
        <path d="M361 119 C395 106 420 83 443 61 C462 43 485 39 509 44" />
        <path d="M361 139 C399 133 429 119 458 98 C486 79 510 76 536 84" />
        <path d="M361 157 C398 157 428 148 455 134 C485 118 509 120 532 132" />
        <path d="M360 77 C382 62 398 43 402 20" />
        <path d="M328 20 C306 17 288 22 275 36" />
        <path d="M402 20 C424 17 442 22 455 36" />
        <path d="M360 206 C343 211 327 215 307 216" />
        <path d="M360 206 C377 211 393 215 413 216" />
      </g>
      <g className="about-tree-leaves">
        <path d="M211 44 C192 24 166 25 150 41 C169 57 193 57 211 44Z" />
        <path d="M277 61 C271 35 250 20 227 26 C233 49 252 63 277 61Z" />
        <path d="M184 84 C162 66 137 70 124 90 C145 103 168 101 184 84Z" />
        <path d="M262 98 C249 75 226 67 207 79 C220 100 241 107 262 98Z" />
        <path d="M188 132 C165 116 142 123 133 144 C155 154 175 150 188 132Z" />
        <path d="M265 134 C246 116 224 117 210 136 C230 151 251 151 265 134Z" />
        <path d="M509 44 C528 24 554 25 570 41 C551 57 527 57 509 44Z" />
        <path d="M443 61 C449 35 470 20 493 26 C487 49 468 63 443 61Z" />
        <path d="M536 84 C558 66 583 70 596 90 C575 103 552 101 536 84Z" />
        <path d="M458 98 C471 75 494 67 513 79 C500 100 479 107 458 98Z" />
        <path d="M532 132 C555 116 578 123 587 144 C565 154 545 150 532 132Z" />
        <path d="M455 134 C474 116 496 117 510 136 C490 151 469 151 455 134Z" />
        <path d="M328 20 C313 2 292 3 281 16 C294 31 313 32 328 20Z" />
        <path d="M402 20 C417 2 438 3 449 16 C436 31 417 32 402 20Z" />
      </g>
      <path className="about-tree-trunk" d="M360 204 C350 172 355 146 360 119 C365 146 370 172 360 204Z" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <main className="about-page">
      <Navbar />
      <section className="about-hero">
        <div className="container about-hero-content">
          <WorldTreeMark />
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
