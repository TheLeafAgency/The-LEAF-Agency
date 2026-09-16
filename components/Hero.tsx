export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F3F0E7",
        paddingTop: "80px",
        overflow: "hidden",
      }}
    >
      {/* Portfolio area reserved behind the hero for future videos and images. */}
      <div
        id="portfolio"
        aria-label="LEAF portfolio"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "#F3F0E7",
        }}
      />

      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: "1000px",
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
          Welcome to LEAF Agency
        </p>

        <h1
          style={{
            fontFamily: '"BPMF Huninn", sans-serif',
            fontSize: "clamp(4rem, 10vw, 7rem)",
            lineHeight: 1,
            color: "#048243",
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
      </div>

      {/* Full-width divider matching the navbar divider. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "2px",
          background: "#048243",
          zIndex: 2,
        }}
      />
    </section>
  );
}
