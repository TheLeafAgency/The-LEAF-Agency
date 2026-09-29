const services = [
  {
    slug: "marketing",
    title: "Marketing",
    description: "Strategic marketing designed to help your business reach the right audience and grow.",
  },
  {
    slug: "filming",
    title: "Filming",
    description: "Professional video production for advertisements, campaigns, social media, and more.",
  },
  {
    slug: "product",
    title: "Product",
    description: "Creative product-focused content that presents what you sell in its best light.",
  },
  {
    slug: "copywriting",
    title: "Copywriting",
    description: "Clear, engaging copy for advertisements, campaigns, websites, and social media.",
  },
  {
    slug: "editing",
    title: "Editing",
    description: "Polished video and visual editing that turns your footage into finished content.",
  },
  {
    slug: "social-media",
    title: "Social Media",
    description: "Content and creative designed to give your social presence a stronger identity.",
  },
];

export default function ServicesPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F3F0E7",
        padding: "120px 24px 100px",
      }}
    >
      <div className="container" style={{ maxWidth: "1200px" }}>
        <div style={{ textAlign: "center", maxWidth: "850px", margin: "0 auto" }}>
          <p
            style={{
              color: "#048243",
              fontWeight: 700,
              letterSpacing: "4px",
              marginBottom: "18px",
              textTransform: "uppercase",
            }}
          >
            What We Do
          </p>

          <h1
            style={{
              fontFamily: '"BPMF Huninn", sans-serif',
              fontSize: "clamp(3.5rem, 8vw, 6rem)",
              lineHeight: 1,
              color: "#048243",
              marginBottom: "28px",
            }}
          >
            Our Services
          </h1>

          <p style={{ color: "#666", fontSize: "1.2rem", lineHeight: 1.8 }}>
            Explore the different ways LEAF can help bring your business,
            brand, or idea to life.
          </p>
        </div>

        <div
          style={{
            marginTop: "70px",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "24px",
          }}
        >
          {services.map((service) => (
            <a
              key={service.slug}
              href={`/services/${service.slug}`}
              className="service-card"
              style={{
                minHeight: "230px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#048243",
                  marginBottom: "18px",
                }}
              />
              <h2
                style={{
                  color: "#1E1E1E",
                  fontSize: "1.6rem",
                  marginBottom: "12px",
                }}
              >
                {service.title}
              </h2>
              <p style={{ color: "#6B7280", lineHeight: 1.6 }}>
                {service.description}
              </p>
            </a>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "55px" }}>
          <p
            style={{
              color: "#048243",
              fontFamily: '"BPMF Huninn", sans-serif',
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              lineHeight: 1.1,
              marginBottom: "26px",
            }}
          >
            And much more!
          </p>

          <a
            href="/get-started"
            className="primary-btn"
            style={{
              display: "inline-block",
              padding: "14px 30px",
              borderRadius: "999px",
              fontWeight: 700,
            }}
          >
            Get Started
          </a>
        </div>

        <div style={{ textAlign: "center", marginTop: "35px" }}>
          <a
            href="/"
            className="secondary-btn"
            style={{
              display: "inline-block",
              padding: "12px 28px",
              borderRadius: "999px",
              fontWeight: 700,
            }}
          >
            Back Home
          </a>
        </div>
      </div>
    </main>
  );
}
