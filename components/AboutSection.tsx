import FadeInOnScroll from "@/components/FadeInOnScroll";

export default function AboutSection() {
  return (
    <FadeInOnScroll>
      <section
        id="about"
        style={{
          padding: "100px 0 150px",
          background: "rgba(243, 240, 231, 0.90)",
          scrollMarginTop: "80px",
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "900px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: '"BPMF Huninn", sans-serif',
              fontSize: "clamp(3.5rem, 8vw, 6rem)",
              lineHeight: 1,
              color: "#048243",
              marginBottom: "30px",
            }}
          >
            Who We Are
          </h2>

          <p
            style={{
              color: "#666",
              fontSize: "1.2rem",
              lineHeight: 1.9,
              margin: "0 auto",
            }}
          >
            The LEAF Agency aims to help local and corporate businesses in a way
            that business leaders can feel comfortable, while also being able to
            get an affordable price. The LEAF Agency is here to make time,
            listen, and provide quality advertising for any business or product.
            We believe great advertising starts with understanding the people
            and ideas behind each business. Our goal is to make the creative
            process feel approachable, personal, and worthwhile.
          </p>
        </div>
      </section>
    </FadeInOnScroll>
  );
}
