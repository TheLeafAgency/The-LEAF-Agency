"use client";

import { useState } from "react";

export default function CreateAccount() {
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleAccountSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStep(2);
  }

  function handleVerificationSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (verificationCode.length !== 6) return;
    setSubmitted(true);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fff3 100%)",
        padding: "100px 20px 80px",
      }}
    >
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        <a
          href="/"
          style={{
            display: "inline-block",
            color: "#048243",
            fontWeight: 800,
            fontSize: "1.8rem",
            marginBottom: "35px",
          }}
        >
          LEAF
        </a>

        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "48px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
          }}
        >
          {submitted ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🌱</div>
              <h1
                style={{
                  fontFamily: '"BPMF Huninn", sans-serif',
                  color: "#048243",
                  fontSize: "3rem",
                  marginBottom: "15px",
                }}
              >
                Welcome to LEAF!
              </h1>
              <p style={{ color: "#6B7280", lineHeight: 1.7 }}>
                Your account is ready. We&apos;re excited to work together and
                bring your ideas to life.
              </p>
            </div>
          ) : step === 1 ? (
            <>
              <p
                style={{
                  color: "#048243",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Join LEAF
              </p>

              <h1
                style={{
                  fontFamily: '"BPMF Huninn", sans-serif',
                  color: "#048243",
                  fontSize: "clamp(2.8rem, 7vw, 4.5rem)",
                  lineHeight: 1.05,
                  marginBottom: "18px",
                }}
              >
                Welcome to LEAF!
              </h1>

              <p style={{ color: "#6B7280", lineHeight: 1.7, marginBottom: "32px" }}>
                Let&apos;s work together. Create your account and take the first
                step toward turning your ideas into something people remember.
              </p>

              <form onSubmit={handleAccountSubmit}>
                <label style={labelStyle}>
                  Name
                  <input name="name" type="text" required style={inputStyle} placeholder="Your name" autoComplete="name" />
                </label>

                <label style={labelStyle}>
                  Email
                  <input name="email" type="email" required style={inputStyle} placeholder="you@example.com" autoComplete="email" />
                </label>

                <label style={labelStyle}>
                  Password
                  <input name="password" type="password" required minLength={8} style={inputStyle} placeholder="At least 8 characters" autoComplete="new-password" />
                </label>

                <button
                  type="submit"
                  className="hero-button primary-btn"
                  style={{ width: "100%", marginTop: "8px" }}
                >
                  Continue
                </button>
              </form>
            </>
          ) : (
            <>
              <p
                style={{
                  color: "#048243",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Step 2 of 2
              </p>

              <h1
                style={{
                  fontFamily: '"BPMF Huninn", sans-serif',
                  color: "#048243",
                  fontSize: "clamp(2.5rem, 7vw, 4rem)",
                  lineHeight: 1.05,
                  marginBottom: "18px",
                }}
              >
                Verify your email.
              </h1>

              <p style={{ color: "#6B7280", lineHeight: 1.7, marginBottom: "30px" }}>
                Enter the 6-digit verification code we sent to your email to
                finish creating your LEAF account.
              </p>

              <form onSubmit={handleVerificationSubmit}>
                <label style={labelStyle}>
                  Verification Code
                  <input
                    name="verificationCode"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    required
                    value={verificationCode}
                    onChange={(event) =>
                      setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    style={{ ...inputStyle, letterSpacing: "6px", textAlign: "center", fontSize: "22px" }}
                    placeholder="000000"
                  />
                </label>

                <button
                  type="submit"
                  className="hero-button primary-btn"
                  style={{ width: "100%", marginTop: "8px", opacity: verificationCode.length === 6 ? 1 : 0.55 }}
                  disabled={verificationCode.length !== 6}
                >
                  Verify & Create Account
                </button>
              </form>

              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  display: "block",
                  margin: "18px auto 0",
                  border: "none",
                  background: "transparent",
                  color: "#048243",
                  fontWeight: 700,
                }}
              >
                Go back
              </button>
            </>
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
