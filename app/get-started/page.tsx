"use client";

import { useEffect, useRef, useState } from "react";

const serviceAreaZipCodes = new Set([
  "10001","10002","10003","10004","10005","10006","10007","10009","10010","10011","10012","10013","10014","10016","10017","10018","10019","10020","10021","10022","10023","10024","10025","10026","10027","10028","10029","10030","10031","10032","10033","10034","10035","10036","10037","10038","10039","10040","10044","10065","10069","10075","10103","10104","10105","10106","10107","10110","10111","10112","10115","10118","10119","10120","10121","10122","10123","10128","10152","10153","10154","10155","10158","10162","10165","10166","10167","10168","10169","10170","10171","10172","10173","10174","10175","10176","10177","10178","10179","10185","10280","10281","10282","10285","10286",
  "10301","10302","10303","10304","10305","10306","10307","10308","10309","10310","10312","10314",
  "10451","10452","10453","10454","10455","10456","10457","10458","10459","10460","10461","10462","10463","10464","10465","10466","10467","10468","10469","10470","10471","10472","10473","10474","10475",
  "11004","11005","11101","11102","11103","11104","11105","11106",
  "11201","11203","11204","11205","11206","11207","11208","11209","11210","11211","11212","11213","11214","11215","11216","11217","11218","11219","11220","11221","11222","11223","11224","11225","11226","11228","11229","11230","11231","11232","11233","11234","11235","11236","11237","11238","11239","11241","11242","11243","11249","11251",
  "10801","10802","10803","10804","10805","10701","10702","10703","10704","10705","10706","10707","10708","10709","10710","10601","10602","10603","10604","10605","10606","10607",
]);

const promotionOptions = [
  { icon: "🏙️", title: "Billboards", description: "Get your business, product, or message seen out in the world." },
  { icon: "📱", title: "Social Media", description: "Create content designed for social platforms and digital audiences." },
  { icon: "🎪", title: "Public Events", description: "Promote through events, pop-ups, activations, and experiences." },
  { icon: "📺", title: "Media", description: "Explore broader media opportunities for your business or campaign." },
  { icon: "🎬", title: "Authentic Ads", description: "Create an advertisement that feels genuine, memorable, and true to your brand." },
  { icon: "✍️", title: "Copywriting", description: "Develop the words, messaging, and written voice behind your promotion." },
];

const authenticAdOptions = [
  { icon: "📤", title: "Publish", description: "You already have an ad and want LEAF to help get it where it needs to go." },
  { icon: "✂️", title: "Edit", description: "You have footage or an existing ad and want LEAF to polish it." },
  { icon: "💡", title: "Idea", description: "You have the idea and want LEAF to turn it into an advertisement." },
  { icon: "🌱", title: "Everything", description: "You want LEAF to handle the process from concept through completion." },
];

const heardOptions = ["Social Media", "Google", "Friend or Family", "Another Business", "Event or Pop-Up", "Other"];

export default function GetStarted() {
  const [zipCode, setZipCode] = useState("");
  const [section, setSection] = useState(1);
  const [promoting, setPromoting] = useState<string[]>([]);
  const [authenticAdServices, setAuthenticAdServices] = useState<string[]>([]);
  const [howHeard, setHowHeard] = useState("");
  const [details, setDetails] = useState("");
  const sectionRefs = useRef<Record<number, HTMLElement | null>>({});

  const isServiceAreaZip = zipCode.length === 5 && serviceAreaZipCodes.has(zipCode);
  const showZipNotice = zipCode.length === 5 && !isServiceAreaZip;

  const whatSelections = ["Product", "Business", "Something Else"];
  const hasWhatSelection = promoting.some((item) => whatSelections.includes(item));
  const hasPromotionSelection = promoting.some((item) => promotionOptions.some((option) => option.title === item));
  const hasAuthenticAdSelection = authenticAdServices.length > 0;

  useEffect(() => {
    if (section <= 1) return;
    const target = sectionRefs.current[section];
    if (!target) return;
    window.setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }, [section]);

  function goToSection(nextSection: number) {
    setSection(nextSection);
  }

  function toggleSelection(value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) {
    setter((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  function toggleWhatSelection(value: string) {
    setPromoting((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  function togglePromotionSelection(value: string) {
    setPromoting((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#F3F0E7", padding: "120px 20px 100px" }}>
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>
        <a href="/" style={{ display: "inline-block", color: "#048243", fontWeight: 800, fontSize: "1.8rem", marginBottom: "45px" }}>LEAF</a>

        <div className="intro-heading">
          <p className="eyebrow">Let&apos;s get started</p>
          <h1>Let&apos;s build something for your business.</h1>
          <p className="intro-copy">We&apos;ll walk you through a few quick choices so we can understand what you are looking for.</p>
        </div>

        <div className="flow-stack">
          <section ref={(node) => { sectionRefs.current[1] = node; }} className="flow-card flow-card-active">
            <span className="step-number">01</span>
            <p className="eyebrow">First, tell us about you</p>
            <h2>Your business information</h2>

            <form onSubmit={(event) => { event.preventDefault(); goToSection(2); }}>
              <label style={labelStyle}>Company Name<input name="companyName" type="text" required style={inputStyle} placeholder="Your company name" /></label>
              <label style={labelStyle}>Email<input name="email" type="email" required style={inputStyle} placeholder="you@company.com" /></label>
              <label style={labelStyle}>Phone Number<input name="phone" type="tel" required style={inputStyle} placeholder="(555) 555-5555" /></label>

              <label style={labelStyle}>
                Company ZIP Code
                <input name="zipCode" type="text" inputMode="numeric" maxLength={5} required value={zipCode} onChange={(event) => setZipCode(event.target.value.replace(/\D/g, "").slice(0, 5))} style={{ ...inputStyle, borderColor: showZipNotice ? "#0B1F3A" : "#E5E7EB" }} placeholder="10001" aria-invalid={showZipNotice} />
                {showZipNotice && <span style={zipNoticeStyle}><strong>Good to know:</strong> We currently operate in NYC and nearby areas. Outside our service area? Some in-person promotion options may be limited, but we can still help with remote creative work.</span>}
              </label>

              <div className="heard-section">
                <div className="heard-heading"><span>How did you hear about us?</span><span className="optional-label">Optional</span></div>
                <div className="heard-grid" role="group" aria-label="How did you hear about us">
                  {heardOptions.map((option) => (
                    <button key={option} type="button" className={`heard-option ${howHeard === option ? "selected" : ""}`} onClick={() => setHowHeard(howHeard === option ? "" : option)} aria-pressed={howHeard === option}>{option}</button>
                  ))}
                </div>
              </div>

              <button type="submit" className="done-button">Done <span>→</span></button>
            </form>
          </section>

          {section >= 2 && (
            <section ref={(node) => { sectionRefs.current[2] = node; }} className="flow-card flow-card-reveal">
              <span className="step-number">02</span>
              <p className="eyebrow">What are you promoting?</p>
              <h2>Choose what you want LEAF to promote.</h2>
              <p className="section-copy">Pick one or as many as apply.</p>
              <div className="choice-grid three-column">
                {[
                  { icon: "📦", title: "Product", description: "A product, service, launch, or offer." },
                  { icon: "🏢", title: "Business", description: "Your business, brand, location, or company." },
                  { icon: "✨", title: "Something Else", description: "Something that does not fit either option." },
                ].map((choice) => <ChoiceButton key={choice.title} {...choice} selected={promoting.includes(choice.title)} onClick={() => toggleWhatSelection(choice.title)} />)}
              </div>
              <button type="button" className="done-button" disabled={!hasWhatSelection} onClick={() => goToSection(3)}>Done <span>→</span></button>
            </section>
          )}

          {section >= 3 && hasWhatSelection && (
            <section ref={(node) => { sectionRefs.current[3] = node; }} className="flow-card flow-card-reveal">
              <span className="step-number">03</span>
              <p className="eyebrow">How do you want to promote it?</p>
              <h2>Choose how you want people to see you.</h2>
              <p className="section-copy">Pick one or as many as you want. We can build around your choices.</p>
              <div className="choice-grid">
                {promotionOptions.map((choice) => {
                  const restricted = !isServiceAreaZip && (choice.title === "Billboards" || choice.title === "Public Events");
                  return <ChoiceButton key={choice.title} {...choice} description={restricted ? "Currently unavailable outside our service area." : choice.description} selected={promoting.includes(choice.title)} disabled={restricted} onClick={() => togglePromotionSelection(choice.title)} />;
                })}
              </div>
              {!isServiceAreaZip && <p className="limited-notice">Unfortunately, some options are limited because you are outside our service area. Remote creative services are still available.</p>}
              <button type="button" className="done-button" disabled={!hasPromotionSelection} onClick={() => goToSection(promoting.includes("Authentic Ads") ? 4 : 5)}>Done <span>→</span></button>
            </section>
          )}

          {section >= 4 && hasWhatSelection && promoting.includes("Authentic Ads") && (
            <section ref={(node) => { sectionRefs.current[4] = node; }} className="flow-card flow-card-reveal">
              <span className="step-number">04</span>
              <p className="eyebrow">Authentic ads</p>
              <h2>How do you want to approach your ad?</h2>
              <p className="section-copy">Choose one, several, or all four.</p>
              <div className="choice-grid">
                {authenticAdOptions.map((choice) => <ChoiceButton key={choice.title} {...choice} selected={authenticAdServices.includes(choice.title)} onClick={() => toggleSelection(choice.title, setAuthenticAdServices)} />)}
              </div>
              <button type="button" className="done-button" disabled={!hasAuthenticAdSelection} onClick={() => goToSection(5)}>Done <span>→</span></button>
            </section>
          )}

          {section >= 5 && hasWhatSelection && hasPromotionSelection && (!promoting.includes("Authentic Ads") || hasAuthenticAdSelection) && (
            <section ref={(node) => { sectionRefs.current[5] = node; }} className="flow-card flow-card-reveal final-card">
              <span className="step-number">{promoting.includes("Authentic Ads") ? "05" : "04"}</span>
              <p className="eyebrow">Now, make it yours</p>
              <h2>Tell us exactly what you have in mind.</h2>
              <p className="section-copy">This is where you tell us about your business, how you want to advertise, what you are hoping to achieve, and anything else that matters to you. Go into detail — the more you tell us, the better we can understand your vision.</p>
              {promoting.length > 0 && <div className="summary-box"><strong>You selected</strong><div className="summary-tags">{promoting.map((item) => <span key={item}>{item}</span>)}{authenticAdServices.map((item) => <span key={item}>{item}</span>)}</div></div>}
              <textarea value={details} onChange={(event) => setDetails(event.target.value)} rows={9} style={{ ...inputStyle, resize: "vertical", marginTop: "22px" }} placeholder="Tell us about your business, how you want to advertise, what you have in mind, and any details you think we should know. Go into detail!" />
              <button type="button" className="done-button" onClick={() => alert("Thanks! Your project details have been captured for the next step. Submission storage will be connected next.")}>Done <span>✓</span></button>
            </section>
          )}
        </div>
      </div>

      <style jsx>{`
        .intro-heading { margin-bottom: 48px; animation: fadeUp 0.7s ease both; }
        .eyebrow { color: #048243; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; font-size: 0.9rem; }
        .intro-heading h1 { font-family: "BPMF Huninn", sans-serif; color: #048243; font-size: clamp(3rem, 8vw, 5.6rem); line-height: 1.02; margin: 0 0 18px; }
        .intro-copy, .section-copy { color: #6B7280; line-height: 1.75; max-width: 700px; }
        .flow-stack { display: grid; gap: 28px; }
        .flow-card { position: relative; scroll-margin-top: 35px; background: #F3F0E7; border: 2px solid #D8E0D9; border-radius: 28px; padding: 48px; box-shadow: 0 20px 50px rgba(0,0,0,0.06); }
        .flow-card-active { border-color: #78A987; }
        .flow-card-reveal { animation: sweepIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .step-number { position: absolute; top: 28px; right: 32px; color: #048243; font-weight: 800; letter-spacing: 1px; font-size: 0.9rem; }
        .flow-card h2 { font-family: "BPMF Huninn", sans-serif; color: #048243; font-size: clamp(2.2rem, 5vw, 3.8rem); line-height: 1.05; margin: 0 0 14px; max-width: 650px; }

        .choice-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin-top: 30px; }
        .three-column { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .choice-button { position: relative; isolation: isolate; overflow: hidden; min-height: 200px; width: 100%; text-align: left; border: 2px solid #78A987; border-radius: 22px; padding: 32px; background: #F3F0E7; cursor: pointer; transform: translateZ(0); transition: transform 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease; }
        .choice-button:hover:not(:disabled) { transform: translateY(-5px) translateZ(0); border-color: #048243; box-shadow: 0 14px 28px rgba(4,130,67,0.12); }
        .choice-button:disabled { cursor: not-allowed; border-color: #C8CBC9; background: #E1E2E0; opacity: 0.78; }
        .choice-fill { position: absolute; inset: 0; background: #048243; transform: scale3d(0,1,1); transform-origin: left center; will-change: transform; backface-visibility: hidden; z-index: -1; transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1); }
        .choice-button.selected .choice-fill { transform: scale3d(1,1,1); }
        .choice-content { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: flex-start; gap: 0; }
        .choice-icon { display: block; font-size: 2.2rem; line-height: 1; margin-bottom: 14px; }
        .choice-title { display: block; width: 100%; font-size: 1.3rem; font-weight: 800; line-height: 1.2; color: #048243; margin-bottom: 8px; transition: color 0.2s ease; }
        .choice-description { display: block; width: 100%; color: #6B7280; line-height: 1.55; font-size: 0.98rem; transition: color 0.2s ease; }
        .choice-button.selected .choice-title, .choice-button.selected .choice-description { color: #F3F0E7; }
        .choice-button:disabled .choice-title, .choice-button:disabled .choice-description { color: #858887; }

        .heard-section { margin-bottom: 20px; }
        .heard-heading { display: flex; align-items: baseline; gap: 10px; margin-bottom: 10px; color: #1E1E1E; font-weight: 700; }
        .optional-label { color: #6B7280; font-size: 0.82rem; font-weight: 500; }
        .heard-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
        .heard-option { min-height: 50px; padding: 12px 14px; border: 2px solid #E5E7EB; border-radius: 12px; background: #FFFFFF; color: #1E1E1E; font: inherit; font-weight: 600; text-align: center; transition: border-color 0.25s ease, background 0.25s ease, color 0.25s ease, transform 0.2s ease; }
        .heard-option:hover { border-color: #78A987; transform: translateY(-2px); }
        .heard-option.selected { border-color: #048243; background: rgba(4,130,67,0.08); color: #048243; }

        .limited-notice { margin: 18px 0 0; text-align: center; color: #0B1F3A; font-weight: 700; line-height: 1.6; }
        .done-button { display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; margin-top: 28px; padding: 16px 28px; border: none; border-radius: 999px; background: #048243; color: white; font: inherit; font-weight: 800; font-size: 1rem; cursor: pointer; transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .done-button:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 12px 25px rgba(4,130,67,0.22); }
        .done-button:disabled { cursor: not-allowed; opacity: 0.55; }
        .summary-box { margin-top: 28px; padding: 20px; border-radius: 18px; background: rgba(4,130,67,0.06); border: 1px solid rgba(4,130,67,0.18); }
        .summary-box strong { color: #048243; }
        .summary-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
        .summary-tags span { padding: 7px 12px; border-radius: 999px; background: #048243; color: white; font-size: 0.85rem; font-weight: 700; }

        @keyframes sweepIn { from { opacity: 0; transform: translate3d(-100%, 18px, 0) skewX(-7deg); } to { opacity: 1; transform: translate3d(0, 0, 0) skewX(0deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 700px) {
          .flow-card { padding: 32px 22px; }
          .choice-grid, .three-column { grid-template-columns: 1fr; }
          .heard-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .step-number { top: 22px; right: 22px; }
        }
      `}</style>
    </main>
  );
}

function ChoiceButton({ icon, title, description, selected, disabled = false, onClick }: { icon: string; title: string; description: string; selected: boolean; disabled?: boolean; onClick: () => void; }) {
  return (
    <button type="button" className={`choice-button ${selected ? "selected" : ""}`} onClick={onClick} disabled={disabled} aria-pressed={selected}>
      <span className="choice-fill" aria-hidden="true" />
      <span className="choice-content">
        <span className="choice-icon">{icon}</span>
        <span className="choice-title">{title}</span>
        <span className="choice-description">{description}</span>
      </span>
    </button>
  );
}

const labelStyle: React.CSSProperties = { display: "block", color: "#1E1E1E", fontWeight: 700, marginBottom: "20px" };
const inputStyle: React.CSSProperties = { display: "block", width: "100%", marginTop: "8px", padding: "14px 16px", border: "2px solid #E5E7EB", borderRadius: "12px", background: "#FFFFFF", color: "#1E1E1E", font: "inherit", outline: "none" };
const zipNoticeStyle: React.CSSProperties = { display: "block", color: "#0B1F3A", fontSize: "0.92rem", lineHeight: 1.5, marginTop: "8px" };
