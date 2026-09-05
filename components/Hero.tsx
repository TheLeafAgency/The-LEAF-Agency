export default function Hero() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(180deg, #ffffff 0%, #f8fff3 60%, #ffffff 100%)",
        paddingTop: "80px",
      }}
    >
      <div
        className="container"
        style={{
          textAlign: "center",
          maxWidth: "1000px",
        }}
      >
        <p
          style={{
            color: "#8BE04E",
            fontWeight: 700,
            letterSpacing: "4px",
            marginBottom: "18px",
            textTransform: "uppercase",
          }}
        >
          Welcome to LEAF Agency
        </p>

        <h1
          style={{
            fontFamily: '"BPMF Huninn", sans-serif',
            fontSize: "clamp(4rem, 10vw, 7rem)",
            lineHeight: 1,
            color: "#8BE04E",
            marginBottom: "30px",
          }}
        >
          LEAF IT TO US!
        </h1>

        <p
          style={{
            fontSize: "1.35rem",
            color: "#666",
            lineHeight: 1.8,
            maxWidth: "760px",
            margin: "0 auto",
          }}
        >
          Whether you already have an advertisement, need one professionally
          edited, or want an entire campaign created from scratch, LEAF handles
          the creative process so you can focus on growing your business.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "50px",
            flexWrap: "wrap",
          }}
        >
          <button className="hero-button primary-btn">
            Get Started
          </button>

          <button className="hero-button secondary-btn">
            View Portfolio
          </button>
        </div>

        <div
          style={{
            marginTop: "80px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "6px",
              borderRadius: "999px",
              background: "#8BE04E",
              opacity: 0.4,
            }}
          />
        </div>
      </div>
    </section>
  );
}
