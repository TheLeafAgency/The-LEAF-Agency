export default function CareersPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F3F0E7",
        padding: "120px 24px 80px",
        fontFamily: '"Neuton", serif',
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
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
            fontFamily: '"Neuton", serif',
            fontSize: "clamp(3.5rem, 9vw, 6rem)",
            lineHeight: 1,
            color: "#048243",
            marginBottom: "24px",
            fontWeight: 700,
          }}
        >
          Work With LEAF
        </h1>

        <h2
          style={{
            color: "#048243",
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            marginBottom: "24px",
            fontWeight: 700,
          }}
        >
          Want to help businesses grow?
        </h2>

        <div
          style={{
            color: "#666",
            fontSize: "1.15rem",
            lineHeight: 1.8,
            textAlign: "left",
          }}
        >
          <p style={{ marginBottom: "24px" }}>
            The LEAF Agency is currently a private, growing business, so we
            aren&apos;t able to offer guaranteed salaries or traditional
            employment positions just yet.
          </p>

          <p style={{ marginBottom: "24px" }}>
            Instead, we offer a <strong style={{ color: "#048243" }}>project-based 40/60 revenue split</strong> for people who contribute to our productions.
          </p>

          <p style={{ marginBottom: "18px" }}>Here&apos;s how it works:</p>

          <p style={{ marginBottom: "18px" }}>
            <strong style={{ color: "#048243" }}>60% goes to The LEAF Agency</strong> to cover the company&apos;s operations, equipment, marketing, growth, and other business expenses.
          </p>

          <p style={{ marginBottom: "14px" }}>
            <strong style={{ color: "#048243" }}>40% is set aside for the people who directly contribute to the project.</strong> This includes but not limited to:
          </p>

          <ul
            style={{
              margin: "0 0 28px 24px",
              paddingLeft: "18px",
            }}
          >
            <li>Directing</li>
            <li>Filming &amp; camera work</li>
            <li>Creative development &amp; storytelling</li>
            <li>Video editing</li>
            <li>Design &amp; visual work</li>
            <li>Sound</li>
            <li>Production &amp; planning</li>
            <li>Supervision</li>
          </ul>

          <p style={{ marginBottom: "36px" }}>
            The 40% is divided among the contributors based on their role and
            level of involvement in that specific project. <strong style={{ color: "#048243" }}>Your exact share will be agreed upon before you begin working on a project</strong>, so you&apos;ll know what you&apos;re contributing to and what you&apos;ll receive.
          </p>

          <section
            style={{
              background: "rgba(4, 130, 67, 0.06)",
              border: "1px solid rgba(4, 130, 67, 0.18)",
              borderRadius: "22px",
              padding: "28px",
              marginBottom: "36px",
            }}
          >
            <h2
              style={{
                color: "#048243",
                fontSize: "1.8rem",
                marginBottom: "16px",
                textAlign: "center",
                fontWeight: 700,
              }}
            >
              An Example
            </h2>

            <p style={{ marginBottom: "14px" }}>
              If LEAF receives <strong style={{ color: "#048243" }}>$1,000</strong> for a project, <strong style={{ color: "#048243" }}>$400 is allocated to the production contributors</strong> and <strong style={{ color: "#048243" }}>$600 remains with LEAF</strong>.
            </p>

            <p style={{ marginBottom: "14px" }}>
              If four people each contribute equally, they could each receive
              <strong style={{ color: "#048243" }}> 10% of the total project revenue</strong> ($100 each).
            </p>

            <p>
              The split can change depending on how many people are involved
              and how much each person contributes.
            </p>
          </section>

          <section style={{ marginBottom: "36px" }}>
            <h2
              style={{
                color: "#048243",
                fontSize: "1.8rem",
                marginBottom: "16px",
                textAlign: "center",
                fontWeight: 700,
              }}
            >
              A Few Things to Know
            </h2>

            <p style={{ marginBottom: "18px" }}>
              At this stage, working with LEAF is <strong style={{ color: "#048243" }}>project-based</strong>, meaning we cannot guarantee a certain number of projects, hours, or income.
            </p>

            <p style={{ marginBottom: "18px" }}>
              We&apos;re building LEAF from the ground up, and we&apos;re looking for
              people who want to gain real production experience, build their
              portfolios, collaborate with other creatives, and grow alongside
              the company.
            </p>

            <p>
              If you&apos;re interested in filmmaking, editing, directing,
              storytelling, photography, design, production, or advertising,
              we&apos;d love to hear from you.
            </p>
          </section>

          <div style={{ textAlign: "center" }}>
            <h2
              style={{
                color: "#048243",
                fontSize: "1.35rem",
                marginBottom: "20px",
                fontWeight: 700,
              }}
            >
              Have questions or interested in working with us?
            </h2>

            <a
              href="mailto:media@theleafagency.org"
              className="primary-btn"
              style={{
                display: "inline-block",
                padding: "13px 28px",
                borderRadius: "999px",
                fontWeight: 700,
                fontSize: "15px",
                marginRight: "12px",
                cursor: "pointer",
                fontFamily: '"Neuton", serif',
              }}
            >
              Email LEAF
            </a>

            <a
              href="/"
              className="secondary-btn"
              style={{
                display: "inline-block",
                padding: "13px 28px",
                borderRadius: "999px",
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
                fontFamily: '"Neuton", serif',
              }}
            >
              Back Home
            </a>

            <p
              style={{
                marginTop: "20px",
                color: "#048243",
                fontWeight: 600,
              }}
            >
              media@theleafagency.org
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
