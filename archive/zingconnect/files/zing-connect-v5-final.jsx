import { useState } from "react";

const vendors = [
  {
    id:1, vendorId:"ZC-0001", name:"Anita Didi", category:"Cook", tier:"residential",
    phone:"9876500003", rating:4.9, reviewCount:21, households:7, hiredThisWeek:3,
    veteran:true, verified:true, radius:"1 km", availability:"Mornings · 7–10am",
    capacity:"full", emoji:"🍳", photo:"https://i.pravatar.cc/80?img=47", responseTime:"Usually responds same day",
    lastActive:"Active 2 days ago", trending:true,
    tags:["South Indian","Pure Veg","North Indian","Punctual","Kids Friendly"],
    summary:"Anita has been in Lotus Zing for 14 months, currently employed by 7 households. Known for South Indian and North Indian cooking, clean kitchen habits, and consistent punctuality.",
    reviews:[
      {text:"Amazing sambar and rasam, very hygienic kitchen habits.",by:"Tower B · Verified",stars:5,ago:"3 days ago"},
      {text:"Punctual and trustworthy, been with us 8 months.",by:"Tower A · Verified",stars:5,ago:"2 weeks ago"}
    ]
  },
  {
    id:2, vendorId:"ZC-0002", name:"Priya Services", category:"Housekeeping", tier:"residential",
    phone:"9123400005", rating:4.5, reviewCount:17, households:11, hiredThisWeek:2,
    veteran:true, verified:true, radius:"2 km", availability:"Morning & Evening",
    capacity:"possibly-full", emoji:"🧹", photo:"https://i.pravatar.cc/80?img=49", responseTime:"Responds within a day",
    lastActive:"Active today", trending:false,
    tags:["Sweeping & Mopping","Never Misses","Trustworthy","Pets Friendly"],
    summary:"Priya serves 11 households — the most in the society. Known for reliability, she always sends a substitute when unavailable.",
    reviews:[
      {text:"Never lets us down, been with us over a year.",by:"Tower C · Verified",stars:5,ago:"1 week ago"},
      {text:"Works without supervision, very thorough.",by:"Tower B · Verified",stars:4,ago:"3 weeks ago"}
    ]
  },
  {
    id:3, vendorId:"ZC-0003", name:"Sunita Cook", category:"Cook", tier:"residential",
    phone:"9222200008", rating:4.3, reviewCount:9, households:3, hiredThisWeek:1,
    veteran:false, verified:true, radius:"1 km", availability:"Flexible timing",
    capacity:"available", emoji:"🍳", photo:"https://i.pravatar.cc/80?img=44", responseTime:"Responds within 2 hours",
    lastActive:"Active today", trending:false,
    tags:["North Indian","Non-Veg","Flexible Timing"],
    summary:"Sunita recently joined and is employed by 3 households. Specialises in North Indian and non-vegetarian cooking with flexible timing.",
    reviews:[{text:"Good variety of dishes, flexible with timing.",by:"Tower D · Verified",stars:4,ago:"5 days ago"}]
  },
  {
    id:4, vendorId:"ZC-0004", name:"Ramesh Kumar", category:"Plumber", tier:"oncall",
    phone:"9810000001", rating:4.7, reviewCount:12, hired:8, hiredThisWeek:4,
    veteran:false, verified:true, radius:"2 km", availability:"Same day available",
    capacity:"available", emoji:"🔧", photo:"https://i.pravatar.cc/80?img=12", responseTime:"Usually responds within 1 hr",
    lastActive:"Active today", trending:true,
    tags:["Leakage Fix","Bathroom Fitting","Transparent Pricing","Same Day"],
    summary:"8 verified hires, 4.7 rating. Consistently praised for punctuality and fair pricing. Available same day for urgent calls.",
    reviews:[
      {text:"Fixed bathroom leakage in 2 hours, charged fairly.",by:"Sector 168 · Verified",stars:5,ago:"1 day ago"},
      {text:"Reliable, brings own tools, very clean work.",by:"Sector 168 · Verified",stars:4,ago:"1 week ago"}
    ]
  },
  {
    id:5, vendorId:"ZC-0005", name:"Vijay AC Repair", category:"AC Technician", tier:"oncall",
    phone:"9678900007", rating:4.6, reviewCount:14, hired:9, hiredThisWeek:5,
    veteran:false, verified:true, radius:"5 km", availability:"Weekdays + Weekends",
    capacity:"available", emoji:"❄️", photo:"https://i.pravatar.cc/80?img=15", responseTime:"Usually responds within 2 hrs",
    lastActive:"Active today", trending:false,
    tags:["Gas Refill R32","Deep Service","Voltas","Expert"],
    summary:"9 verified hires. Multi-brand expertise. Residents trust him most for gas refills and deep servicing.",
    reviews:[{text:"Serviced 3 ACs in one visit, very efficient.",by:"Sector 168 · Verified",stars:5,ago:"2 days ago"}]
  },
  {
    id:6, vendorId:"ZC-0006", name:"Suresh Electricals", category:"Electrician", tier:"oncall",
    phone:"9911000002", rating:4.2, reviewCount:8, hired:5, hiredThisWeek:2,
    veteran:false, verified:true, radius:"5 km", availability:"Mon–Sat",
    capacity:"available", emoji:"⚡", photo:"https://i.pravatar.cc/80?img=59", responseTime:"Responds within a day",
    lastActive:"Active yesterday", trending:false,
    tags:["Wiring","Fan Installation","MCB Issues","Affordable"],
    summary:"Handles general electrical work. Known for affordable rates. Available Monday to Saturday.",
    reviews:[{text:"Fixed the fan wiring issue quickly, affordable.",by:"Sector 168 · Verified",stars:4,ago:"4 days ago"}]
  },
];

const categories = ["All","Cook","Housekeeping","Plumber","Electrician","AC Technician","Carpenter","Painter","Driver","Nanny"];

// PSYCHOLOGICAL capacity signals — scarcity language from MMT/booking apps
const capConfig = {
  available:      { label:"Available now", sub:"Likely open to new work", color:"#00875a", bg:"#e3fcef", pill:"#00875a", urgency:false },
  "possibly-full":{ label:"Filling up fast", sub:"May not take more households", color:"#ff8b00", bg:"#fff4e5", pill:"#ff8b00", urgency:true },
  full:           { label:"Likely full", sub:"Call to check availability", color:"#de350b", bg:"#ffebe6", pill:"#de350b", urgency:true },
};

const WA = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const Star = ({ filled }) => <span style={{ color: filled ? "#f59e0b" : "#e2e8f0", fontSize: "12px" }}>★</span>;
const Stars = ({ n }) => <>{[1,2,3,4,5].map(i => <Star key={i} filled={i <= Math.round(n)} />)}</>;

export default function App() {
  const [cat, setCat] = useState("All");
  const [tier, setTier] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);
  const [hired, setHired] = useState({});
  const [notHelpful, setNotHelpful] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [lang, setLang] = useState("en");

  const list = vendors
    .filter(v => tier === "all" || v.tier === tier)
    .filter(v => cat === "All" || v.category === cat)
    .filter(v => !q || v.name.toLowerCase().includes(q.toLowerCase()) || v.category.toLowerCase().includes(q.toLowerCase()) || v.vendorId.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ background: "#f4f5f7", minHeight: "100vh", fontFamily: "'system-ui', -apple-system, sans-serif" }}>

      {/* UBER-STYLE HEADER — dark, bold, confident */}
      <div style={{ background: "#000", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#ff5b1f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>⚡</div>
            <div>
              <div style={{ color: "#fff", fontSize: "18px", fontWeight: "900", letterSpacing: "-1px", lineHeight: 1 }}>Zing Connect</div>
              <div style={{ color: "#888", fontSize: "10px", marginTop: "1px" }}>Lotus Zing · Sector 168</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* MMT-style live activity pill */}
            <div style={{ background: "#111", borderRadius: "20px", padding: "5px 10px", display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00c853", boxShadow: "0 0 6px #00c853" }} />
              <span style={{ color: "#999", fontSize: "10px" }}>3 browsing</span>
            </div>
            <div style={{ display: "flex", background: "#111", borderRadius: "20px", padding: "2px", gap: "1px" }}>
              {["EN", "हि"].map((l, i) => (
                <button key={l} onClick={() => setLang(i === 0 ? "en" : "hi")} style={{ padding: "4px 12px", borderRadius: "16px", border: "none", background: (i === 0 && lang === "en") || (i === 1 && lang === "hi") ? "#ff5b1f" : "transparent", color: (i === 0 && lang === "en") || (i === 1 && lang === "hi") ? "#fff" : "#666", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* UBER-style search bar */}
        <div style={{ padding: "0 18px 14px" }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>🔍</span>
            <input
              placeholder={lang === "hi" ? "नाम या सेवा खोजें..." : "Search vendors, services, or ID..."}
              value={q} onChange={e => setQ(e.target.value)}
              style={{ width: "100%", padding: "12px 14px 12px 38px", borderRadius: "10px", border: "none", background: "#1a1a1a", fontSize: "13px", color: "#fff", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
            />
          </div>
        </div>
      </div>

      {/* SOCIETY HERO BANNER */}
      <div style={{ position: "relative", height: "120px", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"
          alt="Lotus Zing Society"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))", display: "flex", alignItems: "flex-end", padding: "12px 18px" }}>
          <div>
            <div style={{ color: "#fff", fontSize: "12px", fontWeight: "800", letterSpacing: "0.5px" }}>LOTUS ZING · SECTOR 168, NOIDA</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "10px", marginTop: "2px" }}>Your trusted community vendor network</div>
          </div>
        </div>
      </div>

      {/* MMT-STYLE STATS TICKER */}
      <div style={{ background: "#fff", borderBottom: "1px solid #ebecf0", padding: "10px 18px", display: "flex", gap: "20px", overflowX: "auto", scrollbarWidth: "none" }}>
        {[
          ["62", "vendors listed", "#ff5b1f"],
          ["48", "active residents", "#0066cc"],
          ["₹24,000+", "saved this month", "#00875a"],
          ["4 hrs ago", "last review", "#888"],
        ].map(([val, label, color]) => (
          <div key={label} style={{ flexShrink: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: "800", color }}>{val}</div>
            <div style={{ fontSize: "9px", color: "#97a0af", marginTop: "1px" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* NOBROKER-STYLE TIER TABS */}
      <div style={{ background: "#fff", borderBottom: "1px solid #ebecf0" }}>
        <div style={{ display: "flex" }}>
          {[["all", "All Vendors"], ["residential", "🏠 Residential"], ["oncall", "🔧 On-Call"]].map(([v, l]) => (
            <button key={v} onClick={() => setTier(v)} style={{
              flex: 1, padding: "11px 4px", border: "none", background: "transparent", cursor: "pointer",
              fontSize: "11px", fontWeight: "700", fontFamily: "inherit", transition: "all .15s",
              color: tier === v ? "#0066cc" : "#97a0af",
              borderBottom: tier === v ? "2px solid #0066cc" : "2px solid transparent",
            }}>{l}</button>
          ))}
        </div>
        {/* Category pills */}
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "8px 14px 10px", scrollbarWidth: "none" }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: "5px 13px", borderRadius: "20px",
              border: cat === c ? "none" : "1px solid #ebecf0",
              background: cat === c ? "#0066cc" : "#fff",
              color: cat === c ? "#fff" : "#6b778c",
              fontSize: "11px", whiteSpace: "nowrap", cursor: "pointer", fontWeight: cat === c ? "700" : "400", transition: "all .15s", fontFamily: "inherit",
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "12px 12px 80px" }}>

        {/* Results bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ fontSize: "11px", color: "#97a0af", fontWeight: "600" }}>{list.length} provider{list.length !== 1 ? "s" : ""} found</span>
          <button onClick={() => setShowAdd(!showAdd)} style={{ padding: "7px 14px", borderRadius: "6px", background: showAdd ? "#0066cc" : "#fff", border: "1.5px solid #0066cc", color: showAdd ? "#fff" : "#0066cc", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>
            {showAdd ? "✕ Close" : "+ Add Vendor"}
          </button>
        </div>

        {/* Add Form */}
        {showAdd && (
          <div style={{ background: "#fff", borderRadius: "12px", padding: "16px", marginBottom: "12px", border: "1px solid #ebecf0", boxShadow: "0 2px 8px #00000010" }}>
            <div style={{ fontSize: "14px", fontWeight: "800", color: "#172b4d", marginBottom: "12px" }}>Add a provider or rate one</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["Vendor name", "Phone number", "Your flat number (e.g. B-304)"].map(p => (
                <input key={p} placeholder={p} style={{ padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #ebecf0", fontSize: "13px", outline: "none", fontFamily: "inherit", color: "#172b4d" }} />
              ))}
              <select style={{ padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #ebecf0", fontSize: "13px", color: "#97a0af", background: "#fff", outline: "none", fontFamily: "inherit" }}>
                <option>Select service type</option>
                {categories.slice(1).map(c => <option key={c}>{c}</option>)}
              </select>
              <div style={{ display: "flex", gap: "5px" }}>
                {[1,2,3,4,5].map(n => <button key={n} style={{ flex: 1, padding: "9px", borderRadius: "8px", border: "1.5px solid #ebecf0", background: "#fff", fontSize: "16px", cursor: "pointer" }}>{"★".repeat(n)}</button>)}
              </div>
              <textarea placeholder="Your experience (optional)..." rows={2} style={{ padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #ebecf0", fontSize: "13px", resize: "vertical", outline: "none", fontFamily: "inherit" }} />
              <div style={{ fontSize: "10px", color: "#97a0af", padding: "8px 10px", background: "#f4f5f7", borderRadius: "6px" }}>🔒 Your flat number is used for verification only and never shown publicly.</div>
              <button style={{ padding: "11px", borderRadius: "8px", border: "none", background: "#0066cc", color: "#fff", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>Submit →</button>
            </div>
          </div>
        )}

        {/* CARDS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {list.map((v, i) => {
            const cap = capConfig[v.capacity] || capConfig.available;
            const isOpen = open === v.id;
            const isRes = v.tier === "residential";
            const isHired = hired[v.id];

            return (
              <div key={v.id} style={{
                background: "#fff", borderRadius: "12px", overflow: "hidden",
                boxShadow: "0 1px 3px #00000012, 0 4px 16px #00000008",
                border: "1px solid #ebecf0",
                animation: `up .3s ease both`, animationDelay: `${i * .05}s`,
              }}>

                {/* MMT-style urgency strip at top */}
                {cap.urgency && (
                  <div style={{ background: cap.bg, padding: "5px 14px", display: "flex", alignItems: "center", gap: "6px", borderBottom: `1px solid ${cap.color}22` }}>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: cap.color }}>⚡ {cap.label}</span>
                    <span style={{ fontSize: "10px", color: cap.color, opacity: 0.7 }}>· {cap.sub}</span>
                  </div>
                )}

                <div style={{ padding: "14px" }}>

                  {/* NOBROKER-style top row */}
                  <div style={{ display: "flex", gap: "12px" }}>

                    {/* Avatar — real photo with category badge */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <img
                        src={v.photo}
                        alt={v.name}
                        style={{ width: "56px", height: "56px", borderRadius: "12px", objectFit: "cover", display: "block", border: `2px solid ${isRes ? "#b3f5d8" : "#b3d4f5"}` }}
                        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(v.name)}&size=56&background=${isRes ? "e3fcef" : "e8f4ff"}&color=${isRes ? "00875a" : "0066cc"}&bold=true&font-size=0.4`; }}
                      />
                      {/* Category emoji badge */}
                      <div style={{ position: "absolute", bottom: "-4px", right: "-4px", width: "20px", height: "20px", borderRadius: "6px", background: isRes ? "#e3fcef" : "#e8f4ff", border: `1.5px solid ${isRes ? "#b3f5d8" : "#b3d4f5"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }}>
                        {v.emoji}
                      </div>
                      {/* UBER-style online dot */}
                      <div style={{ position: "absolute", top: "2px", right: "2px", width: "9px", height: "9px", borderRadius: "50%", background: v.lastActive.includes("today") ? "#00c853" : "#ffa000", border: "2px solid #fff" }} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Name + badges */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "6px" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "15px", fontWeight: "800", color: "#172b4d", letterSpacing: "-0.3px" }}>{v.name}</span>
                            {v.verified && (
                              <span style={{ fontSize: "9px", background: "#e3fcef", color: "#00875a", border: "1px solid #b3f5d8", padding: "1px 5px", borderRadius: "4px", fontWeight: "800" }}>✓ Verified</span>
                            )}
                          </div>
                          <div style={{ fontSize: "11px", color: "#6b778c", marginTop: "2px" }}>
                            {v.category} · <span style={{ color: "#97a0af", fontFamily: "monospace", fontSize: "10px" }}>{v.vendorId}</span>
                          </div>
                        </div>

                        {/* MMT-style badge stack top right */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "3px", flexShrink: 0 }}>
                          {i < 3 && <span style={{ fontSize: "14px" }}>{["🥇","🥈","🥉"][i]}</span>}
                          {v.veteran && <span style={{ fontSize: "8px", background: "#fffae6", color: "#ff8b00", border: "1px solid #ffe57f", padding: "2px 6px", borderRadius: "4px", fontWeight: "800" }}>⭐ VETERAN</span>}
                          {v.trending && <span style={{ fontSize: "8px", background: "#ffebe6", color: "#de350b", border: "1px solid #ffbdad", padding: "2px 6px", borderRadius: "4px", fontWeight: "800" }}>🔥 TRENDING</span>}
                        </div>
                      </div>

                      {/* UBER-style big trust signal */}
                      <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
                        {isRes ? (
                          <div style={{ background: "#f4f5f7", borderRadius: "8px", padding: "6px 10px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <div>
                              <div style={{ fontSize: "20px", fontWeight: "900", color: "#172b4d", lineHeight: 1, letterSpacing: "-1px" }}>{v.households}</div>
                              <div style={{ fontSize: "9px", color: "#97a0af", marginTop: "1px" }}>households</div>
                            </div>
                            <div style={{ width: "1px", height: "28px", background: "#ebecf0" }} />
                            <div>
                              <div style={{ fontSize: "20px", fontWeight: "900", color: "#172b4d", lineHeight: 1, letterSpacing: "-1px" }}>{v.hiredThisWeek}</div>
                              <div style={{ fontSize: "9px", color: "#97a0af", marginTop: "1px" }}>hired this week</div>
                            </div>
                          </div>
                        ) : (
                          <div style={{ background: "#f4f5f7", borderRadius: "8px", padding: "6px 10px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <span style={{ fontSize: "20px", fontWeight: "900", color: "#172b4d", letterSpacing: "-1px" }}>{v.rating}</span>
                                <Stars n={v.rating} />
                              </div>
                              <div style={{ fontSize: "9px", color: "#97a0af", marginTop: "1px" }}>{v.reviewCount} reviews</div>
                            </div>
                            <div style={{ width: "1px", height: "28px", background: "#ebecf0" }} />
                            <div>
                              <div style={{ fontSize: "20px", fontWeight: "900", color: "#172b4d", lineHeight: 1, letterSpacing: "-1px" }}>{v.hiredThisWeek}</div>
                              <div style={{ fontSize: "9px", color: "#97a0af", marginTop: "1px" }}>hired this week</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* NOBROKER-style info row */}
                  <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "10px", color: "#6b778c", background: "#f4f5f7", padding: "4px 8px", borderRadius: "6px" }}>🕐 {v.availability}</span>
                    <span style={{ fontSize: "10px", color: "#6b778c", background: "#f4f5f7", padding: "4px 8px", borderRadius: "6px" }}>📍 {v.radius}</span>
                    <span style={{ fontSize: "10px", color: "#6b778c", background: "#f4f5f7", padding: "4px 8px", borderRadius: "6px" }}>💬 {v.responseTime}</span>
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", gap: "4px", marginTop: "8px", flexWrap: "wrap" }}>
                    {v.tags.slice(0, 3).map(tag => (
                      <span key={tag} style={{ padding: "3px 8px", borderRadius: "20px", background: "#f4f5f7", color: "#6b778c", fontSize: "10px", border: "1px solid #ebecf0" }}>{tag}</span>
                    ))}
                    {v.tags.length > 3 && <span style={{ padding: "3px 8px", borderRadius: "20px", background: "#f4f5f7", color: "#97a0af", fontSize: "10px", border: "1px solid #ebecf0" }}>+{v.tags.length - 3} more</span>}
                  </div>

                  {/* PSYCHOLOGICAL — capacity signal */}
                  {!cap.urgency && (
                    <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "5px" }}>
                      <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: cap.color }} />
                      <span style={{ fontSize: "10px", color: cap.color, fontWeight: "700" }}>{cap.label}</span>
                      <span style={{ fontSize: "10px", color: "#97a0af" }}>· {cap.sub}</span>
                    </div>
                  )}

                  {/* MMT + UBER style CTA buttons */}
                  <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                    <a href={`tel:${v.phone}`} style={{
                      flex: 2, padding: "10px 0", borderRadius: "8px",
                      background: cap.urgency ? cap.color : "#172b4d",
                      color: "#fff", fontSize: "12px", fontFamily: "inherit",
                      textDecoration: "none", fontWeight: "800",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
                    }}>
                      📞 {v.capacity === "available" ? "Call Now" : "Call to Check"}
                    </a>
                    <a href={`https://wa.me/91${v.phone}`} target="_blank" rel="noreferrer" style={{
                      flex: 1, padding: "10px 0", borderRadius: "8px",
                      background: "#e3fcef", color: "#00875a", fontSize: "12px", fontFamily: "inherit",
                      textDecoration: "none", fontWeight: "800", border: "1.5px solid #b3f5d8",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
                    }}>
                      <WA /> Chat
                    </a>
                    <button onClick={() => setHired(p => ({ ...p, [v.id]: !p[v.id] }))} style={{
                      flex: 1, padding: "10px 0", borderRadius: "8px", border: `1.5px solid ${isHired ? "#00875a" : "#ebecf0"}`,
                      background: isHired ? "#e3fcef" : "#fff",
                      color: isHired ? "#00875a" : "#97a0af",
                      fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit",
                    }}>
                      {isHired ? "✓ Hired" : isRes ? "+ Employ" : "+ Hired"}
                    </button>
                  </div>

                  {/* Expand */}
                  <button onClick={() => setOpen(isOpen ? null : v.id)} style={{
                    width: "100%", marginTop: "8px", padding: "7px", borderRadius: "8px",
                    background: "#f4f5f7", border: "none", color: "#6b778c",
                    fontSize: "10px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {isOpen ? "▲ Hide details" : `▼ View profile · ${v.reviews.length} review${v.reviews.length !== 1 ? "s" : ""}`}
                  </button>
                </div>

                {/* EXPANDED */}
                {isOpen && (
                  <div style={{ borderTop: "1px solid #ebecf0", padding: "14px", background: "#fafbfc" }}>

                    {/* AI Summary — MMT "about property" style */}
                    <div style={{ marginBottom: "14px" }}>
                      <div style={{ fontSize: "10px", color: "#ff5b1f", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>⚡ Smart Profile Summary</div>
                      <p style={{ margin: 0, fontSize: "12px", color: "#344563", lineHeight: 1.7, background: "#fff", padding: "10px 12px", borderRadius: "8px", border: "1px solid #ebecf0" }}>{v.summary}</p>
                    </div>

                    {/* All tags */}
                    <div style={{ marginBottom: "14px" }}>
                      <div style={{ fontSize: "10px", color: "#97a0af", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Confirmed by residents</div>
                      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                        {v.tags.map(tag => (
                          <span key={tag} style={{ padding: "4px 10px", borderRadius: "20px", background: "#fff", color: "#344563", fontSize: "10px", border: "1px solid #ebecf0", fontWeight: "600" }}>✓ {tag}</span>
                        ))}
                      </div>
                    </div>

                    {/* Reviews — NoBroker review style */}
                    <div style={{ fontSize: "10px", color: "#97a0af", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Resident reviews</div>
                    {v.reviews.map((r, idx) => (
                      <div key={idx} style={{ background: "#fff", borderRadius: "10px", padding: "10px 12px", marginBottom: "8px", border: "1px solid #ebecf0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", overflow: "hidden", border: "1.5px solid #ebecf0" }}>
                              <img src={`https://i.pravatar.cc/24?img=${(v.id * 13 + idx * 7) % 70}`} alt={r.by} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            <div>
                              <div style={{ fontSize: "10px", fontWeight: "700", color: "#344563" }}>{r.by}</div>
                              <div style={{ fontSize: "9px", color: "#97a0af" }}>{r.ago}</div>
                            </div>
                          </div>
                          <Stars n={r.stars} />
                        </div>
                        <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#344563", lineHeight: 1.5 }}>{r.text}</p>
                        <button onClick={() => setNotHelpful(p => ({ ...p, [`${v.id}-${idx}`]: true }))} style={{
                          background: "none", border: "none", fontSize: "9px", cursor: "pointer",
                          color: notHelpful[`${v.id}-${idx}`] ? "#de350b" : "#97a0af",
                          padding: 0, fontFamily: "inherit",
                        }}>
                          {notHelpful[`${v.id}-${idx}`] ? "✓ Flagged" : "Not helpful"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {list.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 20px", background: "#fff", borderRadius: "12px", border: "1px solid #ebecf0" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
              <div style={{ fontSize: "15px", fontWeight: "800", color: "#172b4d", marginBottom: "6px" }}>No providers found</div>
              <div style={{ fontSize: "12px", color: "#97a0af" }}>Know someone good? <button onClick={() => setShowAdd(true)} style={{ background: "none", border: "none", color: "#0066cc", cursor: "pointer", fontSize: "12px", fontWeight: "700", fontFamily: "inherit" }}>Add them →</button></div>
            </div>
          )}
        </div>
      </div>

      {/* UBER-style bottom bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderTop: "1px solid #ebecf0", padding: "10px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: "#ff5b1f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px" }}>⚡</div>
          <span style={{ fontSize: "11px", color: "#97a0af", fontWeight: "600" }}>Zing Connect</span>
        </div>
        <span style={{ fontSize: "10px", color: "#c1c7d0" }}>Community powered · Always free</span>
      </div>

      <style>{`
        @keyframes up { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        ::-webkit-scrollbar { display:none }
        * { box-sizing:border-box }
        input::placeholder, textarea::placeholder { color:#97a0af }
      `}</style>
    </div>
  );
}
