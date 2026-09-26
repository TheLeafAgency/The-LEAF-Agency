import FadeInOnScroll from "@/components/FadeInOnScroll";

const services = [
  {
    title: "Marketing",
    description: "Strategic marketing designed to help your business reach the right audience and grow.",
  },
  {
    title: "Filming",
    description: "Professional video production for advertisements, campaigns, social media, and more.",
  },
  {
    title: "Media",
    description: "Creative media solutions that help your brand communicate clearly and stand out.",
  },
  {
    title: "Billboard Design",
    description: "Eye-catching billboard concepts built to make an impression from the street.",
  },
  {
    title: "Social Media",
    description: "Content and creative designed to give your social presence a stronger identity.",
  },
  {
    title: "Editing",
    description: "Polished video and visual editing that turns your footage into finished content.",
  },
  {
    title: "Brand",
    description: "Brand development that gives your business a recognizable and consistent identity.",
  },
  {
    title: "Product",
    description: "Creative product-focused content that presents what you sell in its best light.",
  },
  {
    title: "Copywriting",
    description: "Clear, engaging copy for advertisements, campaigns, websites, and social media.",
  },
];

export default function ServicesSection() {
  return (
    <FadeInOnScroll>
      <section
        id="services"
        style={{
          padding: "100px 0",
          background: "rgba(243, 240, 231, 0.90)",
          scrollMarginTop: "80px",
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "1200px",
            textAlign: "center",
          }}
        >
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

          <h2
            style={{
              fontFamily: '"BPMF Huninn", sans-serif',
              fontSize: "clamp(3.5rem, 8vw, 6rem)",
              lineHeight: 1,
              color: "#048243",
              marginBottom: "24px",
            }}
          >
            Our Services
          </h2>

          <p
            style={{
              maxWidth: "720px",
              margin: "0 auto",
              color: "#666",
              fontSize: "1.2rem",
              lineHeight: 1.8,
            }}
          >
            From the first idea to the finished advertisement, LEAF brings the
            creative pieces together to help your business grow.
          </p>

          <div
            style={{
              marginTop: "70px",
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "24px",
              textAlign: "left",
            }}
          >
            {services.map((service) => (
              <article
                key={service.title}
                className="service-card"
                style={{
                  minHeight: "210px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
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

                <h3
                  style={{
                    color: "#1E1E1E",
                    fontSize: "1.5rem",
                    marginBottom: "12px",
                  }}
                >
                  {service.title}
                </h3>

                <p
                  style={{
                    color: "#6B7280",
                    lineHeight: 1.6,
                  }}
                >
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </FadeInOnScroll>
  );
}
