"use client";

import { useState } from "react";

const serviceAreaZipCodes = new Set([
  "10001", "10002", "10003", "10004", "10005", "10006", "10007", "10009", "10010", "10011", "10012", "10013", "10014", "10016", "10017", "10018", "10019", "10020", "10021", "10022", "10023", "10024", "10025", "10026", "10027", "10028", "10029", "10030", "10031", "10032", "10033", "10034", "10035", "10036", "10037", "10038", "10039", "10040", "10044", "10065", "10069", "10075", "10103", "10104", "10105", "10106", "10107", "10110", "10111", "10112", "10115", "10118", "10119", "10120", "10121", "10122", "10123", "10128", "10152", "10153", "10154", "10155", "10158", "10162", "10165", "10166", "10167", "10168", "10169", "10170", "10171", "10172", "10173", "10174", "10175", "10176", "10177", "10178", "10179", "10185", "10280", "10281", "10282", "10285", "10286",
  "10301", "10302", "10303", "10304", "10305", "10306", "10307", "10308", "10309", "10310", "10312", "10314",
  "10451", "10452", "10453", "10454", "10455", "10456", "10457", "10458", "10459", "10460", "10461", "10462", "10463", "10464", "10465", "10466", "10467", "10468", "10469", "10470", "10471", "10472", "10473", "10474", "10475",
  "11004", "11005", "11101", "11102", "11103", "11104", "11105", "11106", "11354", "11355", "11356", "11357", "11358", "11360", "11361", "11362", "11363", "11364", "11365", "11366", "11367", "11368", "11369", "11370", "11371", "11372", "11373", "11374", "11375", "11377", "11378", "11379", "11385", "11411", "11412", "11413", "11414", "11415", "11416", "11417", "11418", "11419", "11420", "11421", "11422", "11423", "11426", "11427", "11428", "11429", "11430", "11432", "11433", "11434", "11435", "11436", "11691", "11692", "11693", "11694", "11697",
  "11201", "11203", "11204", "11205", "11206", "11207", "11208", "11209", "11210", "11211", "11212", "11213", "11214", "11215", "11216", "11217", "11218", "11219", "11220", "11221", "11222", "11223", "11224", "11225", "11226", "11228", "11229", "11230", "11231", "11232", "11233", "11234", "11235", "11236", "11237", "11238", "11239", "11241", "11242", "11243", "11249", "11251",
  "10801", "10802", "10803", "10804", "10805",
  "10701", "10702", "10703", "10704", "10705", "10706", "10707", "10708", "10709", "10710",
  "10601", "10602", "10603", "10604", "10605", "10606", "10607",
]);

export default function GetStarted() {
  const [zipCode, setZipCode] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isServiceAreaZip = zipCode.length === 5 && serviceAreaZipCodes.has(zipCode);
  const showZipNotice = zipCode.length === 5 && !isServiceAreaZip;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isServiceAreaZip) return;
    setSubmitted(true);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fff3 100%)",
        padding: "120px 20px 80px",
      }}
    >
      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >
        <a
          href="/"
          style={{
            display: "inline-block",
            color: "#048243",
            fontWeight: 800,
            fontSize: "1.8rem",
            marginBottom: "45px",
          }}
        >
          LEAF
        </a>

        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "50px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
          }}
        >
          <p
            style={{
              color: "#048243",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Let&apos;s get started
          </p>

          <h1
            style={{
              fontFamily: '"BPMF Huninn", sans-serif',
              color: "#048243",
              fontSize: "clamp(2.8rem, 7vw, 4.8rem)",
              lineHeight: 1.05,
              marginBottom: "18px",
            }}
          >
            Tell us about your business.
          </h1>

          <p
            style={{
              color: "#6B7280",
              lineHeight: 1.7,
              marginBottom: "35px",
            }}
          >
            Fill out the form below and a member of the LEAF team can learn a little
            more about you and your business.
          </p>

          {submitted ? (
            <div
              style={{
                padding: "24px",
                borderRadius: "16px",
                background: "#F7FFF2",
                color: "#036d39",
                fontWeight: 600,
                lineHeight: 1.6,
              }}
            >
              Thanks! We&apos;ve received your information and will be in touch.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label style={labelStyle}>
                Company Name
                <input name="companyName" type="text" required style={inputStyle} placeholder="Your company name" />
              </label>

              <label style={labelStyle}>
                Email
                <input name="email" type="email" required style={inputStyle} placeholder="you@company.com" />
              </label>

              <label style={labelStyle}>
                Phone Number
                <input name="phone" type="tel" required style={inputStyle} placeholder="(555) 555-5555" />
              </label>

              <label style={labelStyle}>
                Company ZIP Code {showZipNotice && <span style={{ color: "#0B1F3A" }}>*</span>}
                <input
                  name="zipCode"
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  required
                  value={zipCode}
                  onChange={(event) => setZipCode(event.target.value.replace(/\D/g, "").slice(0, 5))}
                  style={{ ...inputStyle, borderColor: showZipNotice ? "#0B1F3A" : "#E5E7EB" }}
                  placeholder="10001"
                  aria-invalid={showZipNotice}
                />
                {showZipNotice && (
                  <span
                    style={{
                      display: "block",
                      color: "#0B1F3A",
                      fontSize: "0.92rem",
                      lineHeight: 1.5,
                      marginTop: "8px",
                    }}
                  >
                    <strong>Good to know:</strong> We currently operate in NYC and nearby areas. Outside our service area? We can still create your ad remotely and send it straight to you!
                  </span>
                )}
              </label>

              <label style={labelStyle}>
                How did you hear about us?
                <select name="howHeard" required style={inputStyle} defaultValue="">
                  <option value="" disabled>Select an option</option>
                  <option value="social-media">Social Media</option>
                  <option value="google">Google</option>
                  <option value="friend">Friend or Family</option>
                  <option value="business">Another Business</option>
                  <option value="event">Event or Pop-Up</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <button
                type="submit"
                disabled={!isServiceAreaZip}
                className="hero-button primary-btn"
                style={{
                  width: "100%",
                  marginTop: "10px",
                  opacity: isServiceAreaZip ? 1 : 0.55,
                  cursor: isServiceAreaZip ? "pointer" : "not-allowed",
                }}
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 700,
  color: "#1E1E1E",
  marginBottom: "22px",
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: "9px",
  padding: "14px 16px",
  border: "1px solid #E5E7EB",
  borderRadius: "12px",
  fontFamily: "Inter, sans-serif",
  fontSize: "16px",
  color: "#1E1E1E",
  background: "white",
  outline: "none",
};
