export default function CareersPage() {
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
          LEAF Careers
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
          Growing Together
        </h1>

        <p
          style={{
            color: "#666",
            fontSize: "1.2rem",
            lineHeight: 1.8,
            marginBottom: "24px",
          }}
        >
          LEAF is temporarily a private business, and we cannot currently
          provide guaranteed pay for people who want to help us support local
          businesses and creators.
        </p>

        <p
          style={{
            color: "#666",
            fontSize: "1.2rem",
            lineHeight: 1.8,
            marginBottom: "24px",
          }}
        >
          That said, we are open to working with people who want to contribute.
          For eligible projects that are not direct donations, we can offer a
          <strong style={{ color: "#048243" }}> 40/60 deal</strong> for the
          people who help direct, record, plan, or edit the project. The exact
          arrangement can be discussed and agreed upon before work begins.
        </p>

        <p
          style={{
            color: "#666",
            fontSize: "1.2rem",
            lineHeight: 1.8,
            marginBottom: "40px",
          }}
        >
          If you are interested, have questions, or simply want to learn more,
          we would love to hear from you. There is no need to have a perfect
          resume or a long list of experience — just tell us a little about
          yourself and how you would like to help.
        </p>

        <a
          href="mailto:media@theleafagency.org"
          className="primary-btn"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            borderRadius: "999px",
            fontWeight: 700,
            fontSize: "15px",
            marginRight: "12px",
          }}
        >
          Email LEAF
        </a>

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
