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
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#8BE04E",
            letterSpacing: "1px",
          }}
        >
          LEAF
        </h2>

        <nav
          style={{
            display: "flex",
            gap: "42px",
            alignItems: "center",
          }}
        >
          <a href="#" style={linkStyle}>
            Home
          </a>

          <a href="#" style={linkStyle}>
            Services
          </a>

          <a href="#" style={linkStyle}>
            Portfolio
          </a>

          <a href="#" style={linkStyle}>
            About
          </a>

          <a href="#" style={linkStyle}>
            Contact
          </a>

          <button
            style={{
              background: "#8BE04E",
              border: "none",
              padding: "12px 26px",
              borderRadius: "999px",
              fontWeight: 700,
              fontSize: "15px",
            }}
          >
            Get Started
          </button>
        </nav>
      </div>
    </header>
  );
}

const linkStyle = {
  fontWeight: 600,
  color: "#1E1E1E",
  textDecoration: "none",
  transition: ".3s",
};
