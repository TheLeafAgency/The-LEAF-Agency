export default function Navbar() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid #E5E7EB",
        zIndex: 1000,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "80px",
        }}
      >
        <a
          href="#top"
          className="leaf-logo"
          aria-label="Go to home page"
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#048243",
            letterSpacing: "1px",
            textDecoration: "none",
            borderBottom: "2px solid transparent",
            paddingBottom: "4px",
            transition: "all 0.3s ease",
          }}
        >
          LEAF
        </a>

        <nav
          style={{
            display: "flex",
            gap: "42px",
            alignItems: "center",
          }}
        >
          <a href="#services" className="nav-link">
            Services
          </a>

          <a href="#portfolio" className="nav-link">
            Portfolio
          </a>

          <a href="#about" className="nav-link">
            About
          </a>

          <a href="#contact" className="nav-link">
            Contact
          </a>

          <a
            href="#services"
            className="hero-button primary-btn"
            style={{
              display: "inline-block",
              padding: "12px 26px",
              borderRadius: "999px",
              fontWeight: 700,
              fontSize: "15px",
            }}
          >
            Get Started
          </a>
        </nav>
      </div>
    </header>
  );
}
