const services = [
  {
    icon: "📤",
    title: "Publish My Ad",
    description:
      "Already have a finished advertisement? We'll optimize and publish it across the platforms you choose.",
  },
  {
    icon: "✂️",
    title: "Edit My Video",
    description:
      "Need a professional touch? We'll edit your footage into polished, engaging content.",
  },
  {
    icon: "💡",
    title: "I Have an Idea",
    description:
      "Bring us your vision and we'll turn it into a complete advertisement from concept to completion.",
  },
  {
    icon: "🌱",
    title: "Do Everything For Me",
    description:
      "From planning and filming to editing and publishing, LEAF handles the entire process.",
  },
];

export default function ServiceCards() {
  return (
    <section
      style={{
        padding: "100px 0",
        background: "#ffffff",
      }}
    >
      <div className="container">
        <div
          style={{
            textAlign: "center",
            marginBottom: "60px",
          }}
        >
          <h2
            style={{
              fontSize: "3rem",
              fontWeight: 800,
              marginBottom: "15px",
            }}
          >
            Choose How We Can Help
          </h2>

          <p
            style={{
              color: "#6B7280",
              fontSize: "1.1rem",
            }}
          >
            Pick the option that best matches where your business is today.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "25px",
          }}
        >
          {services.map((service) => (
            <button
              key={service.title}
              className="service-card"
              style={{
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                }}
              >
                {service.icon}
              </div>

              <div className="service-title">
                {service.title}
              </div>

              <div className="service-description">
                {service.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
