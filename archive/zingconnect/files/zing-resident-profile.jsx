import { useState } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const RESIDENT_LIST = [
  { flat: "B-304", tower: "Tower B", phone: "9876543210" },
  { flat: "A-102", tower: "Tower A", phone: "9123456789" },
  { flat: "C-501", tower: "Tower C", phone: "9988776655" },
  { flat: "B-201", tower: "Tower B", phone: "9871234567" },
  { flat: "D-403", tower: "Tower D", phone: "9999888877" },
];

const MOCK_PROFILE = {
  flat: "B-304", tower: "Tower B", phone: "9876543210",
  verifiedAt: "January 2025", memberSince: "Jan 2025",
  contributions: { vendorsAdded: 3, reviewsLeft: 7, employed: 2, helpfulVotes: 12 },
  impact: { residentsHelped: 23, callsTriggered: 8, reviewsRead: 142 },
  employedVendors: [
    { id: "ZC-0001", name: "Anita Didi", category: "Cook", emoji: "🍳", since: "March 2024", capacity: "full", rating: 4.9, households: 7 },
    { id: "ZC-0005", name: "Vijay AC Repair", category: "AC Technician", emoji: "❄️", since: "June 2024", capacity: "available", rating: 4.6, hired: 9 },
  ],
  reviews: [
    { vendor: "Ramesh Kumar", emoji: "🔧", stars: 5, text: "Fixed bathroom leakage in 2 hours, charged fairly.", date: "2 days ago", helpful: 7 },
    { vendor: "Anita Didi", emoji: "🍳", stars: 5, text: "Amazing sambar and rasam, very hygienic kitchen habits.", date: "3 weeks ago", helpful: 8 },
    { vendor: "Priya Services", emoji: "🧹", stars: 4, text: "Never lets us down, been with us over a year.", date: "1 month ago", helpful: 5 },
  ],
  activity: [
    { type: "review", text: "You reviewed Ramesh Kumar", sub: "5 stars · 7 residents found it helpful", date: "2 days ago", emoji: "⭐" },
    { type: "vendor", text: "You added Vijay AC Repair", sub: "Now has 14 reviews from your suggestion", date: "1 week ago", emoji: "➕" },
    { type: "employ", text: "You confirmed employing Anita Didi", sub: "She's now serving 7 households", date: "2 weeks ago", emoji: "🏠" },
    { type: "review", text: "You reviewed Anita Didi", sub: "5 stars · 8 residents found it helpful", date: "3 weeks ago", emoji: "⭐" },
    { type: "vendor", text: "You added Priya Services", sub: "Now has 17 reviews", date: "1 month ago", emoji: "➕" },
    { type: "review", text: "You reviewed Priya Services", sub: "4 stars · 5 residents found it helpful", date: "1 month ago", emoji: "⭐" },
    { type: "vendor", text: "You added Ramesh Kumar", sub: "First vendor you added to Zing Connect", date: "2 months ago", emoji: "🎉" },
  ],
};

const LEVELS = [
  { name: "New Resident", min: 0, max: 2, color: "#97a0af", bg: "#f4f5f7", emoji: "🌱", perks: ["Browse all vendors", "Call & WhatsApp vendors"] },
  { name: "Active Member", min: 3, max: 9, color: "#0066cc", bg: "#e8f4ff", emoji: "⭐", perks: ["Add vendors", "Leave reviews", "1.0x review weight"] },
  { name: "Community Champion", min: 10, max: 24, color: "#ff5b1f", bg: "#fff0eb", emoji: "🏆", perks: ["1.2x review weight", "Top Contributor badge", "Priority flag review"] },
  { name: "Society Guardian", min: 25, max: 999, color: "#00875a", bg: "#e3fcef", emoji: "👑", perks: ["1.5x review weight", "Backup admin access", "Society Guardian badge"] },
];

const WA = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const Stars = ({ n }) => (
  <span style={{ letterSpacing: "-0.5px" }}>
    {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= n ? "#f59e0b" : "#e2e8f0", fontSize: "12px" }}>★</span>)}
  </span>
);

// ─── LEVEL HELPERS ────────────────────────────────────────────────────────────

function getLevel(total) {
  return LEVELS.find(l => total >= l.min && total <= l.max) || LEVELS[0];
}

function getLevelProgress(total) {
  const level = getLevel(total);
  const next = LEVELS[LEVELS.indexOf(level) + 1];
  if (!next) return 100;
  const range = next.min - level.min;
  const progress = total - level.min;
  return Math.min(100, Math.round((progress / range) * 100));
}

// ─── SCREENS ─────────────────────────────────────────────────────────────────

function OnboardingScreen({ onVerify }) {
  const [flat, setFlat] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1=welcome, 2=form

  const verify = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const match = RESIDENT_LIST.find(r =>
        r.flat.toLowerCase() === flat.toLowerCase().trim() &&
        r.phone === phone.trim()
      );
      if (match) {
        onVerify(match);
      } else {
        setError("We couldn't verify these details. Please check your flat number and WhatsApp number, or contact your community manager.");
      }
      setLoading(false);
    }, 1500);
  };

  if (step === 1) return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column" }}>
      {/* Hero */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "linear-gradient(135deg,#ff5b1f,#ffab00)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "34px", marginBottom: "28px", boxShadow: "0 8px 32px #ff5b1f44" }}>⚡</div>
        <h1 style={{ color: "#fff", fontSize: "32px", fontWeight: "900", letterSpacing: "-1.5px", margin: "0 0 12px", lineHeight: 1.1 }}>
          Your society.<br />Your trusted vendors.
        </h1>
        <p style={{ color: "#666", fontSize: "14px", lineHeight: 1.7, margin: "0 0 40px", maxWidth: "280px" }}>
          Zing Connect is built by Lotus Zing residents, for Lotus Zing residents. Every review. Every rating. Real people. Real experiences.
        </p>
        {/* Social proof */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "48px" }}>
          {[["62", "Vendors"], ["48", "Residents"], ["4.7★", "Avg Rating"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: "900", color: "#fff" }}>{val}</div>
              <div style={{ fontSize: "10px", color: "#555", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>
        <button onClick={() => setStep(2)} style={{ width: "100%", maxWidth: "320px", padding: "16px", borderRadius: "12px", border: "none", background: "#ff5b1f", color: "#fff", fontSize: "15px", fontWeight: "800", cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.3px" }}>
          Join as a resident →
        </button>
        <div style={{ marginTop: "14px", fontSize: "11px", color: "#444" }}>Already verified? <button onClick={() => setStep(2)} style={{ background: "none", border: "none", color: "#ff5b1f", cursor: "pointer", fontFamily: "inherit", fontSize: "11px", fontWeight: "700" }}>Sign in →</button></div>
      </div>
      {/* Bottom note */}
      <div style={{ padding: "16px 24px 32px", textAlign: "center" }}>
        <p style={{ fontSize: "10px", color: "#333", margin: 0 }}>🔒 Your data stays within Lotus Zing. We never share it outside.</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "18px 20px" }}>
        <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "20px", padding: 0 }}>←</button>
        <div style={{ color: "#fff", fontSize: "16px", fontWeight: "800" }}>Verify your residency</div>
      </div>

      <div style={{ flex: 1, padding: "8px 24px 32px" }}>
        {/* Explainer */}
        <div style={{ background: "#111", borderRadius: "12px", padding: "14px", marginBottom: "28px", border: "1px solid #222" }}>
          <div style={{ fontSize: "12px", color: "#666", lineHeight: 1.6 }}>
            We verify your identity using your flat number and WhatsApp number against the official Lotus Zing resident list. This is a one-time step — you'll never be asked again.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Flat number */}
          <div>
            <label style={{ display: "block", fontSize: "11px", color: "#555", fontWeight: "700", marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Flat Number</label>
            <input
              placeholder="e.g. B-304, A-102"
              value={flat} onChange={e => setFlat(e.target.value)}
              style={{ width: "100%", padding: "14px 16px", borderRadius: "10px", border: `1.5px solid ${error ? "#de350b" : "#222"}`, background: "#111", fontSize: "14px", color: "#fff", outline: "none", fontFamily: "inherit", boxSizing: "border-box", letterSpacing: "1px", fontWeight: "700" }}
            />
          </div>

          {/* WhatsApp number */}
          <div>
            <label style={{ display: "block", fontSize: "11px", color: "#555", fontWeight: "700", marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>WhatsApp Number</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "12px", color: "#555", display: "flex", alignItems: "center", gap: "4px" }}>
                <WA /> <span style={{ color: "#444", fontSize: "12px" }}>+91</span>
              </div>
              <input
                placeholder="10-digit number"
                value={phone} onChange={e => setPhone(e.target.value)}
                type="tel" maxLength={10}
                style={{ width: "100%", padding: "14px 16px 14px 60px", borderRadius: "10px", border: `1.5px solid ${error ? "#de350b" : "#222"}`, background: "#111", fontSize: "14px", color: "#fff", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "#1a0505", border: "1px solid #5c1a1a", borderRadius: "8px", padding: "10px 12px", fontSize: "11px", color: "#ff6b6b", lineHeight: 1.5 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Privacy note */}
          <div style={{ background: "#0a1a0a", borderRadius: "8px", padding: "10px 12px", border: "1px solid #1a3a1a" }}>
            <div style={{ fontSize: "10px", color: "#4a7a4a", lineHeight: 1.5 }}>
              🔒 Your WhatsApp number is matched against the official resident list. It is stored as an encrypted hash and never displayed publicly.
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={verify}
            disabled={!flat || !phone || loading}
            style={{ padding: "15px", borderRadius: "10px", border: "none", background: flat && phone && !loading ? "#ff5b1f" : "#222", color: flat && phone && !loading ? "#fff" : "#555", fontSize: "14px", fontWeight: "800", cursor: flat && phone ? "pointer" : "default", fontFamily: "inherit", transition: "all .2s", marginTop: "4px" }}
          >
            {loading ? "Verifying..." : "Verify my identity →"}
          </button>

          <div style={{ textAlign: "center", fontSize: "10px", color: "#333" }}>
            Can't verify? Contact Shailansh on the society WhatsApp group.
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({ resident, onContinue }) {
  const [animDone, setAnimDone] = useState(false);
  setTimeout(() => setAnimDone(true), 600);

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", textAlign: "center" }}>
      {/* Check animation */}
      <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#00875a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", marginBottom: "24px", boxShadow: "0 0 40px #00875a66", animation: "popIn .5s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}>✓</div>
      <h2 style={{ color: "#fff", fontSize: "26px", fontWeight: "900", letterSpacing: "-1px", margin: "0 0 8px" }}>You're verified!</h2>
      <p style={{ color: "#888", fontSize: "13px", margin: "0 0 6px" }}>Welcome to Zing Connect,</p>
      <p style={{ color: "#ff5b1f", fontSize: "22px", fontWeight: "900", margin: "0 0 32px", letterSpacing: "-0.5px" }}>{resident.flat} · {resident.tower}</p>

      {/* What you can do now */}
      <div style={{ background: "#111", borderRadius: "14px", padding: "16px", marginBottom: "32px", width: "100%", maxWidth: "320px", border: "1px solid #222", textAlign: "left" }}>
        <div style={{ fontSize: "10px", color: "#555", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>You can now</div>
        {[
          ["➕", "Add vendors you trust"],
          ["⭐", "Rate and review service providers"],
          ["🏠", "Track vendors you employ"],
          ["🔥", "Build your contributor reputation"],
        ].map(([emoji, text]) => (
          <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span style={{ fontSize: "14px" }}>{emoji}</span>
            <span style={{ fontSize: "12px", color: "#ccc" }}>{text}</span>
          </div>
        ))}
      </div>

      <button onClick={onContinue} style={{ width: "100%", maxWidth: "320px", padding: "15px", borderRadius: "10px", border: "none", background: "#ff5b1f", color: "#fff", fontSize: "14px", fontWeight: "800", cursor: "pointer", fontFamily: "inherit" }}>
        Go to my profile →
      </button>

      <style>{`@keyframes popIn { from { transform: scale(0); opacity: 0 } to { transform: scale(1); opacity: 1 } }`}</style>
    </div>
  );
}

function ProfileScreen({ resident }) {
  const [tab, setTab] = useState("home");
  const p = MOCK_PROFILE;
  const totalContribs = p.contributions.vendorsAdded + p.contributions.reviewsLeft + p.contributions.employed;
  const level = getLevel(totalContribs);
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];
  const progress = getLevelProgress(totalContribs);

  return (
    <div style={{ background: "#f4f5f7", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>

      {/* HERO HEADER */}
      <div style={{ background: "linear-gradient(160deg, #000 0%, #111 60%, #1a0a00 100%)", padding: "24px 20px 0" }}>

        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "7px", background: "#ff5b1f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>⚡</div>
            <span style={{ color: "#555", fontSize: "12px" }}>Zing Connect</span>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button style={{ background: "#1a1a1a", border: "none", borderRadius: "8px", padding: "6px 12px", color: "#888", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>Settings</button>
          </div>
        </div>

        {/* Profile identity */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "20px" }}>
          {/* Avatar */}
          <div style={{ position: "relative" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: `linear-gradient(135deg, ${level.bg}, #fff)`, border: `2px solid ${level.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>
              {level.emoji}
            </div>
            <div style={{ position: "absolute", bottom: "-4px", right: "-4px", background: "#00875a", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", border: "2px solid #000" }}>✓</div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
              <span style={{ color: "#fff", fontSize: "20px", fontWeight: "900", letterSpacing: "-0.5px" }}>{p.flat}</span>
              <span style={{ fontSize: "11px", background: `${level.color}22`, color: level.color, border: `1px solid ${level.color}44`, padding: "2px 7px", borderRadius: "4px", fontWeight: "700" }}>{level.emoji} {level.name}</span>
            </div>
            <div style={{ color: "#666", fontSize: "12px", marginBottom: "8px" }}>{p.tower} · Lotus Zing · Member since {p.memberSince}</div>

            {/* Level progress bar */}
            {nextLevel && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "9px", color: "#444" }}>{totalContribs} contributions</span>
                  <span style={{ fontSize: "9px", color: "#444" }}>{nextLevel.min} for {nextLevel.emoji} {nextLevel.name}</span>
                </div>
                <div style={{ height: "4px", background: "#1a1a1a", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${level.color}, ${nextLevel.color})`, borderRadius: "2px", transition: "width 1s ease" }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Impact stats — MMT style */}
        <div style={{ display: "flex", gap: "1px", marginBottom: "0" }}>
          {[
            [p.impact.residentsHelped, "Helped", "#ff5b1f"],
            [p.impact.callsTriggered, "Calls triggered", "#0066cc"],
            [p.impact.reviewsRead, "Views", "#00875a"],
            [p.contributions.vendorsAdded, "Added", "#888"],
          ].map(([val, label, color]) => (
            <div key={label} style={{ flex: 1, padding: "12px 8px", background: "#0d0d0d", textAlign: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: "900", color, letterSpacing: "-0.5px" }}>{val}</div>
              <div style={{ fontSize: "9px", color: "#444", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", marginTop: "1px" }}>
          {[["home","Home"],["employed","Employed"],["reviews","Reviews"],["level","My Level"]].map(([v, l]) => (
            <button key={v} onClick={() => setTab(v)} style={{
              flex: 1, padding: "11px 4px", border: "none", background: "#0d0d0d", cursor: "pointer",
              fontSize: "10px", fontWeight: "700", fontFamily: "inherit", transition: "all .15s",
              color: tab === v ? "#ff5b1f" : "#444",
              borderBottom: tab === v ? "2px solid #ff5b1f" : "2px solid transparent",
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "14px 14px 80px" }}>

        {/* ── HOME ── */}
        {tab === "home" && (
          <div>
            {/* Perks unlocked */}
            <div style={{ background: "#fff", borderRadius: "12px", padding: "14px", marginBottom: "10px", border: "1px solid #ebecf0" }}>
              <div style={{ fontSize: "10px", color: "#97a0af", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>Your access level · {level.emoji} {level.name}</div>
              {level.perks.map(perk => (
                <div key={perk} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: level.bg, border: `1px solid ${level.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: level.color, flexShrink: 0 }}>✓</div>
                  <span style={{ fontSize: "12px", color: "#344563" }}>{perk}</span>
                </div>
              ))}
              {nextLevel && (
                <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #f4f5f7" }}>
                  <div style={{ fontSize: "10px", color: "#97a0af", marginBottom: "6px" }}>Unlock at {nextLevel.emoji} {nextLevel.name} ({nextLevel.min - totalContribs} more contributions)</div>
                  {nextLevel.perks.map(perk => (
                    <div key={perk} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", opacity: 0.4 }}>
                      <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#f4f5f7", border: "1px solid #ebecf0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#97a0af", flexShrink: 0 }}>🔒</div>
                      <span style={{ fontSize: "12px", color: "#97a0af" }}>{perk}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity feed */}
            <div style={{ background: "#fff", borderRadius: "12px", padding: "14px", border: "1px solid #ebecf0" }}>
              <div style={{ fontSize: "10px", color: "#97a0af", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>Recent activity</div>
              {p.activity.map((act, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: i < p.activity.length - 1 ? "14px" : "0", paddingBottom: i < p.activity.length - 1 ? "14px" : "0", borderBottom: i < p.activity.length - 1 ? "1px solid #f4f5f7" : "none" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: act.type === "review" ? "#fff0eb" : act.type === "vendor" ? "#e8f4ff" : "#e3fcef", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>{act.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "12px", fontWeight: "700", color: "#172b4d" }}>{act.text}</div>
                    <div style={{ fontSize: "11px", color: "#97a0af", marginTop: "2px" }}>{act.sub}</div>
                    <div style={{ fontSize: "10px", color: "#c1c7d0", marginTop: "2px" }}>{act.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EMPLOYED ── */}
        {tab === "employed" && (
          <div>
            <div style={{ fontSize: "11px", color: "#97a0af", marginBottom: "10px", background: "#fff", borderRadius: "10px", padding: "10px 12px", border: "1px solid #ebecf0" }}>
              Vendors you've confirmed employing. These count towards their household score and help other residents trust them.
            </div>
            {p.employedVendors.map(v => (
              <div key={v.id} style={{ background: "#fff", borderRadius: "12px", padding: "14px", marginBottom: "8px", border: "1px solid #ebecf0" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#e3fcef", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", border: "1.5px solid #b3f5d8" }}>{v.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "800", color: "#172b4d" }}>{v.name}</div>
                        <div style={{ fontSize: "11px", color: "#97a0af" }}>{v.category} · {v.id}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "10px", color: "#97a0af" }}>Since</div>
                        <div style={{ fontSize: "11px", fontWeight: "700", color: "#344563" }}>{v.since}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                      <span style={{ fontSize: "10px", background: "#f4f5f7", color: "#6b778c", padding: "3px 8px", borderRadius: "6px" }}>
                        {v.households ? `🏠 ${v.households} households` : `⭐ ${v.rating} rating`}
                      </span>
                      <span style={{ fontSize: "10px", background: v.capacity === "available" ? "#e3fcef" : "#ffebe6", color: v.capacity === "available" ? "#00875a" : "#de350b", padding: "3px 8px", borderRadius: "6px", fontWeight: "700" }}>
                        {v.capacity === "available" ? "🟢 Available" : "🔴 Likely full"}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                  <a href={`tel:${v.id}`} style={{ flex: 1, padding: "8px", borderRadius: "8px", background: "#172b4d", color: "#fff", fontSize: "11px", textDecoration: "none", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontFamily: "inherit" }}>📞 Call</a>
                  <a href={`https://wa.me/91`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: "8px", borderRadius: "8px", background: "#e3fcef", color: "#00875a", fontSize: "11px", textDecoration: "none", fontWeight: "700", border: "1.5px solid #b3f5d8", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontFamily: "inherit" }}><WA /> WhatsApp</a>
                  <button style={{ padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #ffebe6", background: "#ffebe6", color: "#de350b", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>✕ Remove</button>
                </div>
              </div>
            ))}
            <div style={{ textAlign: "center", padding: "16px", fontSize: "12px", color: "#97a0af" }}>
              Want to add a vendor you employ?<br />
              <button style={{ background: "none", border: "none", color: "#0066cc", cursor: "pointer", fontSize: "12px", fontWeight: "700", fontFamily: "inherit", marginTop: "4px" }}>Go to directory →</button>
            </div>
          </div>
        )}

        {/* ── REVIEWS ── */}
        {tab === "reviews" && (
          <div>
            {/* Credibility pill */}
            <div style={{ background: "#fff", borderRadius: "10px", padding: "10px 14px", marginBottom: "10px", border: "1px solid #ebecf0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "800", color: "#172b4d" }}>Your review credibility</div>
                <div style={{ fontSize: "10px", color: "#97a0af", marginTop: "2px" }}>Your reviews carry {level.name === "Community Champion" ? "1.2x" : level.name === "Society Guardian" ? "1.5x" : "1.0x"} weight in the ranking algorithm</div>
              </div>
              <div style={{ fontSize: "20px", fontWeight: "900", color: level.color }}>{level.name === "Community Champion" ? "1.2x" : level.name === "Society Guardian" ? "1.5x" : "1.0x"}</div>
            </div>

            {p.reviews.map((r, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "14px", marginBottom: "8px", border: "1px solid #ebecf0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "20px" }}>{r.emoji}</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "800", color: "#172b4d" }}>{r.vendor}</div>
                      <div style={{ fontSize: "10px", color: "#97a0af" }}>{r.date}</div>
                    </div>
                  </div>
                  <Stars n={r.stars} />
                </div>
                <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#344563", lineHeight: 1.5 }}>{r.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ fontSize: "10px", color: "#00875a", background: "#e3fcef", padding: "3px 8px", borderRadius: "6px", fontWeight: "700" }}>👍 {r.helpful} found helpful</div>
                  <button style={{ background: "none", border: "none", color: "#97a0af", cursor: "pointer", fontSize: "10px", fontFamily: "inherit" }}>Edit review</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── LEVEL ── */}
        {tab === "level" && (
          <div>
            <div style={{ background: "#fff", borderRadius: "12px", padding: "16px", marginBottom: "10px", border: "1px solid #ebecf0", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "8px" }}>{level.emoji}</div>
              <div style={{ fontSize: "20px", fontWeight: "900", color: level.color, letterSpacing: "-0.5px" }}>{level.name}</div>
              <div style={{ fontSize: "12px", color: "#97a0af", marginTop: "4px" }}>{totalContribs} total contributions</div>
              {nextLevel && (
                <div style={{ margin: "16px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#97a0af", marginBottom: "6px" }}>
                    <span>{level.name}</span>
                    <span>{nextLevel.emoji} {nextLevel.name}</span>
                  </div>
                  <div style={{ height: "8px", background: "#f4f5f7", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${level.color}, ${nextLevel.color})`, borderRadius: "4px", transition: "width 1.5s ease" }} />
                  </div>
                  <div style={{ fontSize: "11px", color: "#344563", marginTop: "8px", fontWeight: "700" }}>
                    {nextLevel.min - totalContribs} more contributions to reach {nextLevel.emoji} {nextLevel.name}
                  </div>
                </div>
              )}
            </div>

            {/* All levels */}
            {LEVELS.map((l, i) => {
              const isCurrentLevel = l.name === level.name;
              const isPast = LEVELS.indexOf(l) < LEVELS.indexOf(level);
              return (
                <div key={l.name} style={{ background: "#fff", borderRadius: "12px", padding: "14px", marginBottom: "8px", border: `1.5px solid ${isCurrentLevel ? l.color : "#ebecf0"}`, opacity: isPast || isCurrentLevel ? 1 : 0.5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: l.bg, border: `1.5px solid ${l.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{l.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "800", color: "#172b4d" }}>{l.name}</span>
                        {isCurrentLevel && <span style={{ fontSize: "9px", background: l.bg, color: l.color, border: `1px solid ${l.color}44`, padding: "2px 6px", borderRadius: "4px", fontWeight: "700" }}>CURRENT</span>}
                        {isPast && <span style={{ fontSize: "9px", background: "#e3fcef", color: "#00875a", border: "1px solid #b3f5d8", padding: "2px 6px", borderRadius: "4px", fontWeight: "700" }}>✓ ACHIEVED</span>}
                      </div>
                      <div style={{ fontSize: "10px", color: "#97a0af", marginTop: "2px" }}>{l.min === 0 ? "Starting level" : `${l.min}+ contributions`}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {l.perks.map(perk => (
                      <div key={perk} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "9px", color: isPast || isCurrentLevel ? l.color : "#c1c7d0" }}>{isPast || isCurrentLevel ? "✓" : "○"}</span>
                        <span style={{ fontSize: "11px", color: isPast || isCurrentLevel ? "#344563" : "#97a0af" }}>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)", borderTop: "1px solid #ebecf0", padding: "10px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "14px", height: "14px", borderRadius: "4px", background: "#ff5b1f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px" }}>⚡</div>
          <span style={{ fontSize: "11px", color: "#97a0af" }}>Zing Connect</span>
        </div>
        <button style={{ background: "#172b4d", border: "none", borderRadius: "8px", padding: "8px 16px", color: "#fff", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>
          Browse Directory →
        </button>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("onboarding"); // onboarding | success | profile
  const [resident, setResident] = useState(null);

  const handleVerify = (r) => {
    setResident(r);
    setScreen("success");
  };

  const handleContinue = () => setScreen("profile");

  if (screen === "onboarding") return <OnboardingScreen onVerify={handleVerify} />;
  if (screen === "success") return <SuccessScreen resident={resident} onContinue={handleContinue} />;
  return <ProfileScreen resident={resident} />;
}
