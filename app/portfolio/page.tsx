export default function PortfolioPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: "#F3F0E7",
        padding: "120px 24px",
      }}
    >
      <div style={{ maxWidth: "900px" }}>
        <p
          style={{
            color: "#048243",
            fontWeight: 700,
            letterSpacing: "4px",
            marginBottom: "20px",
            textTransform: "uppercase",
          }}
        >
          LEAF Portfolio
        </p>

        <h1
          style={{
            fontFamily: '"BPMF Huninn", sans-serif',
            fontSize: "clamp(3.5rem, 9vw, 6rem)",
            lineHeight: 1,
            color: "#048243",
            marginBottom: "28px",
          }}
        >
          Still Setting Our Roots!
        </h1>

        <p
          style={{
            color: "#666",
            fontSize: "1.2rem",
            lineHeight: 1.8,
            marginBottom: "40px",
          }}
        >
          We are just getting started. Check back soon to see the businesses,
          brands, and projects LEAF has worked with.
        </p>

        <a
          href="/"
          className="secondary-btn"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            borderRadius: "999px",
            fontWeight: 700,
            fontSize: "15px",
          }}
        >
          Back Home
        </a>
      </div>
    </main>
  );
}
