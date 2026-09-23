import FadeInOnScroll from "@/components/FadeInOnScroll";

export default function ContactSection() {
  return (
    <FadeInOnScroll>
      <section
        id="contact"
        style={{
          padding: "110px 0 90px",
          background: "var(--leaf-green-deep)",
          color: "var(--leaf-white-dove)",
          scrollMarginTop: "80px",
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "1000px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#78A987",
              fontWeight: 700,
              letterSpacing: "4px",
              marginBottom: "18px",
              textTransform: "uppercase",
            }}
          >
            Let's Stay Connected
          </p>

          <h2
            style={{
              fontFamily: '"BPMF Huninn", sans-serif',
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              lineHeight: 1,
              marginBottom: "28px",
            }}
          >
            Have a Question?
          </h2>

          <p
            style={{
              maxWidth: "760px",
              margin: "0 auto 22px",
              fontSize: "1.15rem",
              lineHeight: 1.8,
              color: "#E8EEE9",
            }}
          >
            Whether you have a question about our services, want to learn more
            about how LEAF works, have a concern, or simply want to talk through
            an idea, we would love to hear from you. You do not need to have
            everything figured out before reaching out.
          </p>

          <p
            style={{
              maxWidth: "760px",
              margin: "0 auto 38px",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "#D1DDD4",
            }}
          >
            Send us an email and tell us what is on your mind. Our team can
            help point you in the right direction, answer questions about
            getting started, or help you figure out what kind of advertising
            support makes sense for your business.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <a
              href="mailto:theleafagency@outlook.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "15px 24px",
                borderRadius: "999px",
                background: "var(--leaf-white-dove)",
                color: "var(--leaf-green-deep)",
                fontWeight: 700,
                transition: "transform 0.3s ease, background 0.3s ease",
              }}
            >
              theleafagency@outlook.com
            </a>

        </a>
          </div>

          <p
            style={{
              marginTop: "32px",
              color: "#AFC2B5",
              fontSize: "0.95rem",
              lineHeight: 1.6,
            }}
          >
            Prefer email? Either address is a great place to start. We are
            happy to hear from you.
          </p>
        </div>
      </section>
    </FadeInOnScroll>
  );
}
