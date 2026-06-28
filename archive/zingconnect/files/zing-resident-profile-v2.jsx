import { useState, useEffect, useRef } from "react";

// ─── RESIDENT LIST (mock — in production this is a Google Sheet lookup) ───────
const RESIDENT_LIST = [
  { flat: "B-304", tower: "Tower B", phone: "9876543210" },
  { flat: "A-102", tower: "Tower A", phone: "9123456789" },
  { flat: "C-501", tower: "Tower C", phone: "9988776655" },
  { flat: "B-201", tower: "Tower B", phone: "9871234567" },
  { flat: "D-403", tower: "Tower D", phone: "9999888877" },
  { flat: "A-301", tower: "Tower A", phone: "9876501234" },
];

// Multiple profiles per flat — each phone is a unique profile
const REGISTERED = {
  "B-304-9876543210": {
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
      { type: "vendor", text: "You added Ramesh Kumar", sub: "First vendor you added — welcome to the community!", date: "2 months ago", emoji: "🎉" },
    ],
  }
};

// ─── LEVELS ───────────────────────────────────────────────────────────────────
const LEVELS = [
  { name: "New Resident",       min: 0,  max: 2,   color: "#97a0af", bg: "#f4f5f7", emoji: "🌱", weight: "—",    perks: ["Browse all vendors", "Call & WhatsApp vendors"] },
  { name: "Active Member",      min: 3,  max: 9,   color: "#0066cc", bg: "#e8f4ff", emoji: "⭐", weight: "1.0x", perks: ["Add vendors to directory", "Leave ratings and reviews", "1.0x review weight"] },
  { name: "Community Champion", min: 10, max: 24,  color: "#ff5b1f", bg: "#fff0eb", emoji: "🏆", weight: "1.2x", perks: ["1.2x review weight", "Top Contributor badge visible on reviews", "Priority flag review by admin"] },
  { name: "Society Guardian",   min: 25, max: 999, color: "#00875a", bg: "#e3fcef", emoji: "👑", weight: "1.5x", perks: ["1.5x review weight", "Backup admin access to pending queue", "Society Guardian badge"] },
];

function getLevel(total) { return LEVELS.find(l => total >= l.min && total <= l.max) || LEVELS[0]; }
function getNextLevel(level) { return LEVELS[LEVELS.indexOf(level) + 1] || null; }
function getLevelProgress(total, level) {
  const next = getNextLevel(level);
  if (!next) return 100;
  return Math.min(100, Math.round(((total - level.min) / (next.min - level.min)) * 100));
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
function normFlat(s) {
  // Normalise B304, b-304, B 304, B-304 → B-304
  const clean = s.trim().toUpperCase().replace(/\s+/g, "").replace(/[^A-Z0-9]/g, "");
  const letter = clean.match(/^[A-Z]+/)?.[0] || "";
  const number = clean.match(/[0-9]+$/)?.[0] || "";
  if (!letter || !number) return s.trim().toUpperCase();
  return `${letter}-${number}`;
}
function normPhone(s) { return s.trim().replace(/\D/g, "").slice(-10); }
function maskPhone(p) { return `****${p.slice(-4)}`; }

// ─── ICONS ────────────────────────────────────────────────────────────────────
const WA = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const Stars = ({ n }) => (
  <span style={{ letterSpacing: "-0.5px" }}>
    {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= n ? "#f59e0b" : "#e2e8f0", fontSize: "12px" }}>★</span>)}
  </span>
);

const Spinner = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
    <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" />
  </svg>
);

// ─── WELCOME SCREEN ───────────────────────────────────────────────────────────
function WelcomeScreen({ onJoin, onSignIn }) {
  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 28px 24px" }}>

        {/* Logo */}
        <div style={{ width: "76px", height: "76px", borderRadius: "22px", background: "linear-gradient(135deg,#ff5b1f,#ffab00)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", marginBottom: "32px", boxShadow: "0 12px 40px #ff5b1f55" }}>⚡</div>

        <h1 style={{ color: "#fff", fontSize: "30px", fontWeight: "900", letterSpacing: "-1.5px", margin: "0 0 10px", lineHeight: 1.15, textAlign: "center" }}>
          Your society.<br />Your trusted vendors.
        </h1>
        <p style={{ color: "#555", fontSize: "14px", lineHeight: 1.7, margin: "0 0 36px", maxWidth: "280px", textAlign: "center" }}>
          Zing Connect is built by Lotus Zing residents, for Lotus Zing residents. Real people. Real reviews. Always free.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", gap: "0", marginBottom: "44px", background: "#111", borderRadius: "14px", overflow: "hidden", border: "1px solid #1a1a1a", width: "100%", maxWidth: "320px" }}>
          {[["62", "Vendors"], ["48", "Residents"], ["4.7★", "Avg Rating"]].map(([val, label], i) => (
            <div key={label} style={{ flex: 1, padding: "14px 8px", textAlign: "center", borderRight: i < 2 ? "1px solid #1a1a1a" : "none" }}>
              <div style={{ fontSize: "18px", fontWeight: "900", color: "#fff" }}>{val}</div>
              <div style={{ fontSize: "9px", color: "#444", marginTop: "3px", letterSpacing: "0.5px" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ width: "100%", maxWidth: "320px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <button onClick={onJoin} style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "none", background: "#ff5b1f", color: "#fff", fontSize: "15px", fontWeight: "800", cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.3px" }}>
            Join as a resident →
          </button>
          <button onClick={onSignIn} style={{ width: "100%", padding: "15px", borderRadius: "12px", border: "1px solid #222", background: "transparent", color: "#888", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
            Already verified? Sign in
          </button>
        </div>
      </div>

      {/* Bottom note */}
      <div style={{ padding: "16px 28px 32px", textAlign: "center" }}>
        <p style={{ fontSize: "10px", color: "#2a2a2a", margin: 0, lineHeight: 1.6 }}>
          🔒 Verification uses your WhatsApp number matched against the official Lotus Zing resident list. Your data stays within the society.
        </p>
      </div>
    </div>
  );
}

// ─── VERIFICATION FORM ────────────────────────────────────────────────────────
function VerifyScreen({ mode, onVerified, onBack }) {
  const [flat, setFlat] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const phoneRef = useRef(null);
  const isJoin = mode === "join";

  // Normalise flat display as user types
  const handleFlat = (e) => {
    setFlat(e.target.value);
    setError(""); setFieldErrors({});
  };

  // Phone — digits only, max 10
  const handlePhone = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
    setError(""); setFieldErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!flat.trim()) errs.flat = "Flat number is required";
    const normF = normFlat(flat);
    if (flat.trim() && !/^[A-Za-z]/.test(flat.trim())) errs.flat = "Format: B-304 or A-102";
    if (!phone) errs.phone = "WhatsApp number is required";
    if (phone && phone.length < 10) errs.phone = "Enter a valid 10-digit number";
    if (isJoin && !agreed) errs.agreed = "Please accept to continue";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setLoading(true); setError("");

    setTimeout(() => {
      const normF = normFlat(flat);
      const normP = normPhone(phone);
      const inList = RESIDENT_LIST.find(r => r.flat === normF);
      const match = RESIDENT_LIST.find(r => r.flat === normF && r.phone === normP);
      const key = `${normF}-${normP}`;
      const profile = REGISTERED[key];

      if (!inList) {
        setError("This flat number isn't in our resident list. Check for typos, or contact your community manager.");
        setLoading(false); return;
      }
      if (!match) {
        setError("The WhatsApp number doesn't match our record for this flat. If you've changed your number, contact your community manager.");
        setLoading(false); return;
      }
      if (isJoin && profile) {
        setError("This flat and number are already verified. Use Sign In instead.");
        setLoading(false); return;
      }
      onVerified({ flat: normF, phone: normP, tower: match.tower, isNew: isJoin, profile });
    }, 1800);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "20px 20px 0" }}>
        <button onClick={onBack} style={{ background: "#111", border: "1px solid #222", borderRadius: "8px", color: "#888", cursor: "pointer", fontSize: "16px", padding: "6px 12px", lineHeight: 1 }}>←</button>
        <div style={{ color: "#fff", fontSize: "16px", fontWeight: "800" }}>{isJoin ? "Join Zing Connect" : "Sign in"}</div>
      </div>

      <div style={{ flex: 1, padding: "24px 24px 32px" }}>

        {/* Context pill */}
        <div style={{ background: "#111", borderRadius: "10px", padding: "12px 14px", marginBottom: "24px", border: "1px solid #1a1a1a" }}>
          <div style={{ fontSize: "11px", color: "#555", lineHeight: 1.6 }}>
            {isJoin
              ? "We verify your identity using your flat number and WhatsApp number against the official Lotus Zing resident list. One-time only — you'll never be asked again."
              : "Enter your flat number and WhatsApp number to access your profile."
            }
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Flat number */}
          <div>
            <label style={{ display: "block", fontSize: "10px", color: fieldErrors.flat ? "#ff6b6b" : "#555", fontWeight: "700", marginBottom: "6px", letterSpacing: "0.8px", textTransform: "uppercase" }}>
              Flat Number {fieldErrors.flat && <span style={{ color: "#ff6b6b", textTransform: "none", letterSpacing: 0, fontWeight: "400" }}>· {fieldErrors.flat}</span>}
            </label>
            <input
              placeholder="e.g. B-304 or A-102"
              value={flat} onChange={handleFlat} onKeyDown={handleKeyDown}
              onBlur={() => flat && setFlat(normFlat(flat))}
              style={{ width: "100%", padding: "14px 16px", borderRadius: "10px", border: `1.5px solid ${fieldErrors.flat ? "#de350b" : "#1a1a1a"}`, background: "#111", fontSize: "15px", color: "#fff", outline: "none", fontFamily: "inherit", boxSizing: "border-box", letterSpacing: "1px", fontWeight: "700", textTransform: "uppercase" }}
            />
          </div>

          {/* WhatsApp number */}
          <div>
            <label style={{ display: "block", fontSize: "10px", color: fieldErrors.phone ? "#ff6b6b" : "#555", fontWeight: "700", marginBottom: "6px", letterSpacing: "0.8px", textTransform: "uppercase" }}>
              WhatsApp Number {fieldErrors.phone && <span style={{ color: "#ff6b6b", textTransform: "none", letterSpacing: 0, fontWeight: "400" }}>· {fieldErrors.phone}</span>}
            </label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: "5px" }}>
                <WA size={12} /><span style={{ color: "#444", fontSize: "13px", fontWeight: "700" }}>+91</span>
                <span style={{ color: "#2a2a2a", fontSize: "13px" }}>|</span>
              </div>
              <input
                ref={phoneRef}
                placeholder="10-digit number"
                value={phone} onChange={handlePhone} onKeyDown={handleKeyDown}
                type="tel" inputMode="numeric"
                style={{ width: "100%", padding: "14px 16px 14px 66px", borderRadius: "10px", border: `1.5px solid ${fieldErrors.phone ? "#de350b" : "#1a1a1a"}`, background: "#111", fontSize: "15px", color: "#fff", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
              />
              {phone.length > 0 && (
                <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "10px", color: phone.length === 10 ? "#00875a" : "#555" }}>
                  {phone.length}/10
                </div>
              )}
            </div>
          </div>

          {/* Consent checkbox — only on join */}
          {isJoin && (
            <div>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
                <div
                  onClick={() => { setAgreed(!agreed); setFieldErrors(p => ({ ...p, agreed: "" })); }}
                  style={{ width: "20px", height: "20px", borderRadius: "5px", border: `1.5px solid ${fieldErrors.agreed ? "#de350b" : agreed ? "#ff5b1f" : "#333"}`, background: agreed ? "#ff5b1f" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px", cursor: "pointer", transition: "all .15s" }}
                >
                  {agreed && <span style={{ color: "#fff", fontSize: "12px", fontWeight: "900" }}>✓</span>}
                </div>
                <span style={{ fontSize: "11px", color: "#555", lineHeight: 1.6 }}>
                  I confirm I am a resident of Lotus Zing, Sector 168, Noida. I understand my flat number will be used to verify contributions and stored securely. {fieldErrors.agreed && <span style={{ color: "#ff6b6b" }}>Required.</span>}
                </span>
              </label>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ background: "#1a0505", border: "1px solid #5c1a1a", borderRadius: "10px", padding: "12px 14px", fontSize: "11px", color: "#ff6b6b", lineHeight: 1.6 }}>
              <div style={{ fontWeight: "700", marginBottom: "4px" }}>⚠️ Couldn't verify</div>
              {error}
              {error.includes("community manager") && (
                <a
                  href="https://wa.me/919876543210?text=Hi%2C%20I%20need%20help%20verifying%20my%20Zing%20Connect%20account"
                  target="_blank" rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "8px", color: "#4ade80", fontWeight: "700", textDecoration: "none", fontSize: "11px" }}
                >
                  <WA size={11} /> Message community manager →
                </a>
              )}
            </div>
          )}

          {/* Privacy note */}
          <div style={{ background: "#040f04", borderRadius: "8px", padding: "10px 12px", border: "1px solid #0a2a0a" }}>
            <div style={{ fontSize: "10px", color: "#3a6a3a", lineHeight: 1.6 }}>
              🔒 Your WhatsApp number is matched against the official resident list and stored as an encrypted hash. It is never shown to other residents or vendors.
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ padding: "16px", borderRadius: "12px", border: "none", background: loading ? "#222" : "#ff5b1f", color: loading ? "#555" : "#fff", fontSize: "15px", fontWeight: "800", cursor: loading ? "default" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all .2s" }}
          >
            {loading ? <><Spinner /> Verifying...</> : isJoin ? "Verify my identity →" : "Sign in →"}
          </button>

          {/* Switch mode */}
          <div style={{ textAlign: "center", fontSize: "11px", color: "#444" }}>
            {isJoin
              ? <>Already verified? <button onClick={() => { onBack(); setTimeout(() => {}, 100); }} style={{ background: "none", border: "none", color: "#ff5b1f", cursor: "pointer", fontFamily: "inherit", fontSize: "11px", fontWeight: "700" }}>Sign in instead</button></>
              : <>New resident? <button onClick={() => { onBack(); }} style={{ background: "none", border: "none", color: "#ff5b1f", cursor: "pointer", fontFamily: "inherit", fontSize: "11px", fontWeight: "700" }}>Join instead</button></>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SUCCESS SCREEN ───────────────────────────────────────────────────────────
function SuccessScreen({ data, onContinue }) {
  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 28px", textAlign: "center" }}>
      <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#00875a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "38px", marginBottom: "24px", boxShadow: "0 0 50px #00875a55", animation: "popIn .5s cubic-bezier(0.34,1.56,0.64,1) both" }}>✓</div>
      <h2 style={{ color: "#fff", fontSize: "26px", fontWeight: "900", letterSpacing: "-1px", margin: "0 0 6px" }}>
        {data.isNew ? "You're verified!" : "Welcome back!"}
      </h2>
      <p style={{ color: "#555", fontSize: "13px", margin: "0 0 6px" }}>{data.isNew ? "Welcome to Zing Connect," : "Signed in as"}</p>
      <p style={{ color: "#ff5b1f", fontSize: "24px", fontWeight: "900", margin: "0 0 8px", letterSpacing: "-0.5px" }}>{data.flat} · {data.tower}</p>
      <p style={{ color: "#333", fontSize: "11px", margin: "0 0 36px" }}>WhatsApp {maskPhone(data.phone)}</p>

      {data.isNew && (
        <div style={{ background: "#111", borderRadius: "14px", padding: "16px", marginBottom: "32px", width: "100%", maxWidth: "320px", border: "1px solid #1a1a1a", textAlign: "left" }}>
          <div style={{ fontSize: "10px", color: "#444", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>You can now</div>
          {["➕  Add vendors you trust to the directory", "⭐  Rate and review service providers", "🏠  Track vendors you currently employ", "🔥  Build your community contributor level"].map(text => (
            <div key={text} style={{ fontSize: "12px", color: "#aaa", marginBottom: "8px" }}>{text}</div>
          ))}
        </div>
      )}

      <button onClick={onContinue} style={{ width: "100%", maxWidth: "320px", padding: "16px", borderRadius: "12px", border: "none", background: "#ff5b1f", color: "#fff", fontSize: "15px", fontWeight: "800", cursor: "pointer", fontFamily: "inherit" }}>
        {data.isNew ? "Go to my profile →" : "Continue to profile →"}
      </button>

      <style>{`@keyframes popIn{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}

// ─── PROFILE SCREEN ───────────────────────────────────────────────────────────
function ProfileScreen({ data, onSignOut }) {
  const [tab, setTab] = useState("home");
  const p = data.profile || {
    contributions: { vendorsAdded: 0, reviewsLeft: 0, employed: 0, helpfulVotes: 0 },
    impact: { residentsHelped: 0, callsTriggered: 0, reviewsRead: 0 },
    employedVendors: [], reviews: [], activity: [],
    memberSince: "Just now",
  };
  const total = p.contributions.vendorsAdded + p.contributions.reviewsLeft + p.contributions.employed;
  const level = getLevel(total);
  const nextLevel = getNextLevel(level);
  const progress = getLevelProgress(total, level);

  return (
    <div style={{ background: "#f4f5f7", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>

      {/* HERO HEADER */}
      <div style={{ background: "linear-gradient(160deg,#000 0%,#0d0d0d 60%,#150800 100%)", paddingBottom: 0 }}>

        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "7px", background: "#ff5b1f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>⚡</div>
            <span style={{ color: "#444", fontSize: "12px" }}>Zing Connect</span>
          </div>
          <button onClick={onSignOut} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "6px 12px", color: "#555", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>Sign out</button>
        </div>

        {/* Identity */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "0 20px 20px" }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "18px", background: `linear-gradient(135deg,${level.bg},#fff)`, border: `2px solid ${level.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>{level.emoji}</div>
            <div style={{ position: "absolute", bottom: "-3px", right: "-3px", background: "#00875a", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", border: "2px solid #000" }}>✓</div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px", flexWrap: "wrap" }}>
              <span style={{ color: "#fff", fontSize: "22px", fontWeight: "900", letterSpacing: "-0.5px" }}>{data.flat}</span>
              <span style={{ fontSize: "10px", background: `${level.color}22`, color: level.color, border: `1px solid ${level.color}44`, padding: "2px 7px", borderRadius: "4px", fontWeight: "800" }}>{level.emoji} {level.name}</span>
            </div>
            <div style={{ color: "#555", fontSize: "11px", marginBottom: "10px" }}>{data.tower} · Member since {p.memberSince} · {maskPhone(data.phone)}</div>

            {/* Level progress */}
            {nextLevel ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ fontSize: "9px", color: "#444" }}>{total} contributions</span>
                  <span style={{ fontSize: "9px", color: "#444" }}>{nextLevel.min} for {nextLevel.emoji} {nextLevel.name}</span>
                </div>
                <div style={{ height: "5px", background: "#1a1a1a", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${level.color},${nextLevel.color})`, borderRadius: "3px", transition: "width 1s ease" }} />
                </div>
                <div style={{ fontSize: "9px", color: "#333", marginTop: "4px" }}>{nextLevel.min - total} more to unlock {nextLevel.emoji} {nextLevel.name}</div>
              </div>
            ) : (
              <div style={{ fontSize: "11px", color: level.color, fontWeight: "700" }}>👑 Maximum level achieved</div>
            )}
          </div>
        </div>

        {/* Impact stats */}
        <div style={{ display: "flex", gap: "1px" }}>
          {[
            [p.impact.residentsHelped, "Helped", "#ff5b1f"],
            [p.impact.callsTriggered, "Calls triggered", "#0066cc"],
            [p.impact.reviewsRead, "Profile views", "#00875a"],
            [total, "Contributions", "#888"],
          ].map(([val, label, color]) => (
            <div key={label} style={{ flex: 1, padding: "11px 6px", background: "#0a0a0a", textAlign: "center" }}>
              <div style={{ fontSize: "17px", fontWeight: "900", color, letterSpacing: "-0.5px" }}>{val}</div>
              <div style={{ fontSize: "8px", color: "#333", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex" }}>
          {[["home","Home"],["employed","Employed"],["reviews","Reviews"],["level","Level"]].map(([v, l]) => (
            <button key={v} onClick={() => setTab(v)} style={{ flex: 1, padding: "12px 4px", border: "none", background: "#0a0a0a", cursor: "pointer", fontSize: "10px", fontWeight: "700", fontFamily: "inherit", color: tab === v ? "#ff5b1f" : "#333", borderBottom: tab === v ? "2px solid #ff5b1f" : "2px solid transparent", transition: "all .15s" }}>{l}</button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "14px 14px 80px" }}>

        {/* ── HOME TAB ── */}
        {tab === "home" && (
          <div>
            {/* New user empty state */}
            {total === 0 && (
              <div style={{ background: "#fff", borderRadius: "14px", padding: "24px", marginBottom: "10px", border: "1px solid #ebecf0", textAlign: "center" }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>🌱</div>
                <div style={{ fontSize: "15px", fontWeight: "800", color: "#172b4d", marginBottom: "6px" }}>Start contributing</div>
                <div style={{ fontSize: "12px", color: "#97a0af", lineHeight: 1.6, marginBottom: "16px" }}>Add a vendor you trust or leave a review to start building your reputation in Lotus Zing.</div>
                <button style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#ff5b1f", color: "#fff", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>Browse the directory →</button>
              </div>
            )}

            {/* Perks */}
            <div style={{ background: "#fff", borderRadius: "12px", padding: "14px", marginBottom: "10px", border: "1px solid #ebecf0" }}>
              <div style={{ fontSize: "10px", color: "#97a0af", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>Your access · {level.emoji} {level.name}</div>
              {level.perks.map(perk => (
                <div key={perk} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "7px" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: level.bg, border: `1px solid ${level.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: level.color, flexShrink: 0 }}>✓</div>
                  <span style={{ fontSize: "12px", color: "#344563" }}>{perk}</span>
                </div>
              ))}
              {nextLevel && (
                <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #f4f5f7" }}>
                  <div style={{ fontSize: "10px", color: "#c1c7d0", marginBottom: "6px" }}>Unlock with {nextLevel.emoji} {nextLevel.name}</div>
                  {nextLevel.perks.map(perk => (
                    <div key={perk} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", opacity: 0.45 }}>
                      <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#f4f5f7", border: "1px solid #ebecf0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", flexShrink: 0 }}>🔒</div>
                      <span style={{ fontSize: "12px", color: "#97a0af" }}>{perk}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity feed */}
            {p.activity.length > 0 && (
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
            )}
          </div>
        )}

        {/* ── EMPLOYED TAB ── */}
        {tab === "employed" && (
          <div>
            <div style={{ background: "#fff", borderRadius: "10px", padding: "10px 14px", marginBottom: "10px", border: "1px solid #ebecf0", fontSize: "11px", color: "#97a0af", lineHeight: 1.6 }}>
              Vendors you've confirmed employing. Their household count updates automatically.
            </div>
            {p.employedVendors.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: "12px", padding: "32px 20px", border: "1px solid #ebecf0", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "10px" }}>🏠</div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#172b4d", marginBottom: "6px" }}>No vendors added yet</div>
                <div style={{ fontSize: "11px", color: "#97a0af" }}>Go to the directory and tap "I Employ This" on vendors you regularly use.</div>
              </div>
            ) : p.employedVendors.map(v => (
              <div key={v.id} style={{ background: "#fff", borderRadius: "12px", padding: "14px", marginBottom: "8px", border: "1px solid #ebecf0" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "10px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#e3fcef", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", border: "1.5px solid #b3f5d8" }}>{v.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "800", color: "#172b4d" }}>{v.name}</div>
                        <div style={{ fontSize: "11px", color: "#97a0af" }}>{v.category} · {v.id}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "9px", color: "#97a0af" }}>Employing since</div>
                        <div style={{ fontSize: "11px", fontWeight: "700", color: "#344563" }}>{v.since}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "5px", marginTop: "6px" }}>
                      <span style={{ fontSize: "10px", background: "#f4f5f7", color: "#6b778c", padding: "3px 8px", borderRadius: "6px" }}>{v.households ? `🏠 ${v.households} households` : `⭐ ${v.rating} · ${v.hired} hires`}</span>
                      <span style={{ fontSize: "10px", background: v.capacity === "available" ? "#e3fcef" : "#ffebe6", color: v.capacity === "available" ? "#00875a" : "#de350b", padding: "3px 8px", borderRadius: "6px", fontWeight: "700" }}>{v.capacity === "available" ? "🟢 Available" : "🔴 Likely full"}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <a href={`tel:+91`} style={{ flex: 1, padding: "9px", borderRadius: "8px", background: "#172b4d", color: "#fff", fontSize: "11px", textDecoration: "none", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontFamily: "inherit" }}>📞 Call</a>
                  <a href="https://wa.me/91" target="_blank" rel="noreferrer" style={{ flex: 1, padding: "9px", borderRadius: "8px", background: "#e3fcef", color: "#00875a", fontSize: "11px", textDecoration: "none", fontWeight: "700", border: "1.5px solid #b3f5d8", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", fontFamily: "inherit" }}><WA size={11} /> WhatsApp</a>
                  <button style={{ padding: "9px 14px", borderRadius: "8px", border: "1.5px solid #ffebe6", background: "#fff", color: "#de350b", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>✕ Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── REVIEWS TAB ── */}
        {tab === "reviews" && (
          <div>
            <div style={{ background: "#fff", borderRadius: "10px", padding: "10px 14px", marginBottom: "10px", border: "1px solid #ebecf0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: "800", color: "#172b4d" }}>Your review credibility</div>
                <div style={{ fontSize: "10px", color: "#97a0af", marginTop: "2px" }}>Your reviews carry {level.weight} weight in the ranking algorithm</div>
              </div>
              <div style={{ fontSize: "22px", fontWeight: "900", color: level.color }}>{level.weight}</div>
            </div>

            {p.reviews.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: "12px", padding: "32px 20px", border: "1px solid #ebecf0", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "10px" }}>⭐</div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#172b4d", marginBottom: "6px" }}>No reviews yet</div>
                <div style={{ fontSize: "11px", color: "#97a0af" }}>After calling a vendor, leave a quick rating. It helps your neighbours make better decisions.</div>
              </div>
            ) : p.reviews.map((r, i) => (
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
                <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#344563", lineHeight: 1.5, borderLeft: "2px solid #ebecf0", paddingLeft: "10px" }}>{r.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "10px", background: "#e3fcef", color: "#00875a", padding: "3px 8px", borderRadius: "6px", fontWeight: "700" }}>👍 {r.helpful} found helpful</span>
                  <button style={{ background: "none", border: "none", color: "#97a0af", cursor: "pointer", fontSize: "10px", fontFamily: "inherit" }}>Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── LEVEL TAB ── */}
        {tab === "level" && (
          <div>
            {/* Current level hero */}
            <div style={{ background: "#fff", borderRadius: "14px", padding: "20px", marginBottom: "10px", border: "1px solid #ebecf0", textAlign: "center" }}>
              <div style={{ fontSize: "52px", marginBottom: "8px" }}>{level.emoji}</div>
              <div style={{ fontSize: "22px", fontWeight: "900", color: level.color, letterSpacing: "-0.5px", marginBottom: "4px" }}>{level.name}</div>
              <div style={{ fontSize: "12px", color: "#97a0af" }}>{total} total contributions · Review weight: <strong style={{ color: level.color }}>{level.weight}</strong></div>
              {nextLevel && (
                <div style={{ margin: "16px 0 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#97a0af", marginBottom: "6px" }}>
                    <span>{level.name}</span><span>{nextLevel.emoji} {nextLevel.name}</span>
                  </div>
                  <div style={{ height: "8px", background: "#f4f5f7", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${level.color},${nextLevel.color})`, borderRadius: "4px", transition: "width 1.5s ease" }} />
                  </div>
                  <div style={{ fontSize: "11px", color: "#344563", marginTop: "8px", fontWeight: "700" }}>{nextLevel.min - total} contributions to {nextLevel.emoji} {nextLevel.name}</div>
                </div>
              )}
            </div>

            {/* All levels */}
            {LEVELS.map((l, i) => {
              const isCurrent = l.name === level.name;
              const isPast = i < LEVELS.indexOf(level);
              return (
                <div key={l.name} style={{ background: "#fff", borderRadius: "12px", padding: "14px", marginBottom: "8px", border: `1.5px solid ${isCurrent ? l.color : "#ebecf0"}`, opacity: isPast || isCurrent ? 1 : 0.55 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                    <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: l.bg, border: `1.5px solid ${l.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{l.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "14px", fontWeight: "800", color: "#172b4d" }}>{l.name}</span>
                        {isCurrent && <span style={{ fontSize: "8px", background: l.bg, color: l.color, border: `1px solid ${l.color}44`, padding: "2px 6px", borderRadius: "4px", fontWeight: "800" }}>CURRENT</span>}
                        {isPast && <span style={{ fontSize: "8px", background: "#e3fcef", color: "#00875a", border: "1px solid #b3f5d8", padding: "2px 6px", borderRadius: "4px", fontWeight: "800" }}>✓ ACHIEVED</span>}
                      </div>
                      <div style={{ fontSize: "10px", color: "#97a0af", marginTop: "2px" }}>{l.min === 0 ? "Starting level" : `${l.min}+ contributions`} · {l.weight} review weight</div>
                    </div>
                  </div>
                  {l.perks.map(perk => (
                    <div key={perk} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                      <span style={{ fontSize: "10px", color: isPast || isCurrent ? l.color : "#c1c7d0" }}>{isPast || isCurrent ? "✓" : "○"}</span>
                      <span style={{ fontSize: "11px", color: isPast || isCurrent ? "#344563" : "#97a0af" }}>{perk}</span>
                    </div>
                  ))}
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
          <span style={{ fontSize: "11px", color: "#97a0af" }}>Zing Connect · {data.flat}</span>
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
  const [screen, setScreen] = useState("welcome");
  const [mode, setMode] = useState("join");
  const [verifiedData, setVerifiedData] = useState(null);

  const handleVerified = (data) => { setVerifiedData(data); setScreen("success"); };
  const handleContinue = () => setScreen("profile");
  const handleSignOut = () => { setVerifiedData(null); setScreen("welcome"); };

  if (screen === "welcome") return (
    <WelcomeScreen
      onJoin={() => { setMode("join"); setScreen("verify"); }}
      onSignIn={() => { setMode("signin"); setScreen("verify"); }}
    />
  );
  if (screen === "verify") return (
    <VerifyScreen mode={mode} onVerified={handleVerified} onBack={() => setScreen("welcome")} />
  );
  if (screen === "success") return <SuccessScreen data={verifiedData} onContinue={handleContinue} />;
  if (screen === "profile") return <ProfileScreen data={verifiedData} onSignOut={handleSignOut} />;
}
