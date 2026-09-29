const serviceLinks = [
  ["Marketing", "/services/marketing"],
  ["Filming", "/services/filming"],
  ["Product", "/services/product"],
  ["Copywriting", "/services/copywriting"],
  ["Editing", "/services/editing"],
  ["Social Media", "/services/social-media"],
  ["Public Events", "/services/public-events"],
  ["Authentic Ads", "/services/authentic-ads"],
  ["Brand", "/services/brand"],
];

function ServiceMenuLinks() {
  return (
    <>
      {serviceLinks.map(([label, href]) => (
        <a key={href} href={href}>
          <span className="service-menu-leaf" aria-hidden="true">🍃</span>
          {label}
        </a>
      ))}
    </>
  );
}

export default function Navbar() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        background: "#F3F0E7",
        backdropFilter: "blur(14px)",
        borderBottom: "2px solid #048243",
        zIndex: 1000,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: "80px",
        }}
      >
        <a
          href="/"
          className="leaf-logo"
          aria-label="Go to home page"
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#048243",
            letterSpacing: "1px",
            textDecoration: "none",
            borderBottom: "2px solid transparent",
            paddingBottom: "1px",
            transition: "all 0.3s ease",
          }}
        >
          LEAF
        </a>

        <nav className="desktop-nav">
          <a href="/#about" className="nav-link">About</a>
          <div className="nav-services-dropdown">
            <a href="/services" className="nav-link nav-services-trigger">Services</a>
            <div className="nav-services-menu">
              <a href="/services" className="services-menu-all">All Services</a>
              <ServiceMenuLinks />
            </div>
          </div>
          <a href="/portfolio" className="nav-link">Portfolio</a>
          <a href="/careers" className="nav-link">Careers</a>
          <a href="/#contact" className="nav-link">Contact</a>
          <a
            href="/get-started"
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

        <details className="mobile-nav">
          <summary aria-label="Open navigation menu">Menu</summary>
          <nav className="mobile-nav-menu">
            <a href="/#about">About</a>
            <div className="mobile-service-group">
              <a href="/services">Services</a>
              <div className="mobile-service-links">
                <ServiceMenuLinks />
              </div>
            </div>
            <a href="/portfolio">Portfolio</a>
            <a href="/careers">Careers</a>
            <a href="/#contact">Contact</a>
            <a href="/get-started" className="mobile-nav-cta">Get Started</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
