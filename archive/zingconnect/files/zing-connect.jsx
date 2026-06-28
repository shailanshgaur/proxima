import { useState } from "react";

const vendors = [
  { id: 1, vendorId: "ZC-0001", name: "Ramesh Kumar", category: "Plumber", phone: "9810000001", rating: 4.7, reviews: 12, tags: ["Reliable", "On-time"], verified: true, society: "Open", radius: "2 km", tier: "open", hired: 8 },
  { id: 2, vendorId: "ZC-0002", name: "Suresh Electricals", category: "Electrician", phone: "9911000002", rating: 4.2, reviews: 8, tags: ["Affordable"], verified: true, society: "Open", radius: "5 km", tier: "open", hired: 5 },
  { id: 3, vendorId: "ZC-0003", name: "Anita Didi", category: "Cook", phone: "9876500003", rating: 4.9, reviews: 21, tags: ["Excellent", "Hygienic", "Punctual"], verified: true, society: "Society Verified", radius: "1 km", tier: "society", households: 7, veteran: true },
  { id: 4, vendorId: "ZC-0004", name: "Mohan Carpentry", category: "Carpenter", phone: "9700100004", rating: 3.8, reviews: 5, tags: ["Good Work"], verified: false, society: "Open", radius: "8 km", tier: "open", hired: 2 },
  { id: 5, vendorId: "ZC-0005", name: "Priya Maid Services", category: "Housekeeping", phone: "9123400005", rating: 4.5, reviews: 17, tags: ["Trustworthy", "Thorough"], verified: true, society: "Society Verified", radius: "2 km", tier: "society", households: 11, veteran: true },
  { id: 6, vendorId: "ZC-0006", name: "Deepak Painting", category: "Painter", phone: "9345600006", rating: 4.1, reviews: 6, tags: ["Neat Work"], verified: false, society: "Open", radius: "10 km", tier: "open", hired: 3 },
  { id: 7, vendorId: "ZC-0007", name: "Vijay AC Repair", category: "AC Technician", phone: "9678900007", rating: 4.6, reviews: 14, tags: ["Expert", "Affordable"], verified: true, society: "Open", radius: "5 km", tier: "open", hired: 9 },
  { id: 8, vendorId: "ZC-0008", name: "Sunita Cook", category: "Cook", phone: "9222200008", rating: 4.3, reviews: 9, tags: ["Variety"], verified: false, society: "Society Verified", radius: "1 km", tier: "society", households: 3, veteran: false },
];

const sampleReviews = {
  1: [
    { text: "Fixed our leakage same day, very professional.", display: "Verified Resident · Sector 168", stars: 5 },
    { text: "Reasonable rates, came on time.", display: "Verified Resident · Sector 168", stars: 4 },
  ],
  3: [
    { text: "Makes amazing dal tadka, very hygienic.", display: "Verified Resident · Tower B", stars: 5 },
    { text: "Punctual and trustworthy, been with us 8 months.", display: "Verified Resident · Tower A", stars: 5 },
  ],
  5: [
    { text: "Has been cleaning our home for over a year now.", display: "Verified Resident · Tower C", stars: 5 },
    { text: "Very thorough, never misses a corner.", display: "Verified Resident · Tower B", stars: 4 },
  ],
  7: [
    { text: "Serviced 3 ACs in one visit, very efficient.", display: "Verified Resident · Sector 168", stars: 5 },
    { text: "Knows his stuff, fixed the issue in 30 mins.", display: "Verified Resident · Sector 167", stars: 4 },
  ],
};

const categories = ["All", "Cook", "Housekeeping", "Plumber", "Electrician", "Carpenter", "Painter", "AC Technician"];
const categoryEmoji = {
  "Plumber": "🔧", "Electrician": "⚡", "Cook": "🍳",
  "Carpenter": "🪚", "Housekeeping": "🧹", "Painter": "🎨",
  "AC Technician": "❄️", "All": "✦"
};

const societyCategories = ["Cook", "Housekeeping"];

const translations = {
  en: {
    tagline: "Your trusted neighbourhood service network",
    searchPlaceholder: "Search by name or service...",
    topRated: "Top Rated", mostReviewed: "Most Reviewed",
    vendorsFound: (n) => `${n} provider${n !== 1 ? "s" : ""}`,
    addRate: "+ Add / Rate", close: "✕ Close",
    formTitle: "Add a Provider or Rate One",
    vendorName: "Name", phoneNumber: "Phone Number",
    selectCategory: "Select Service Type",
    reviewPlaceholder: "Your experience (optional)...",
    submit: "Submit →", call: "Call", whatsapp: "WhatsApp",
    reviews: "reviews", withinRadius: (r) => `Within ${r}`,
    top: "TOP", footer: "Powered by Zing Connect",
    societyVerified: "Society Verified", openDirectory: "Open Directory",
    households: (n) => `${n} households`, currentlyServing: "Serving",
    hireBtn: "I Hired This", veteran: "Veteran",
    showReviews: "Reviews", hideReviews: "Hide",
    tierLabel: { society: "Society Verified", open: "Open Directory" },
    categoryLabels: { "All": "All", "Plumber": "Plumber", "Electrician": "Electrician", "Cook": "Cook", "Carpenter": "Carpenter", "Housekeeping": "Housekeeping", "Painter": "Painter", "AC Technician": "AC Tech" },
    tagLabels: { "Reliable": "Reliable", "On-time": "On-time", "Affordable": "Affordable", "Excellent": "Excellent", "Hygienic": "Hygienic", "Punctual": "Punctual", "Good Work": "Good Work", "Trustworthy": "Trustworthy", "Thorough": "Thorough", "Neat Work": "Neat Work", "Expert": "Expert", "Variety": "Variety" }
  },
  hi: {
    tagline: "आपका भरोसेमंद पड़ोस सेवा नेटवर्क",
    searchPlaceholder: "नाम या सेवा खोजें...",
    topRated: "सर्वश्रेष्ठ", mostReviewed: "सर्वाधिक समीक्षित",
    vendorsFound: (n) => `${n} सेवा प्रदाता`,
    addRate: "+ जोड़ें / रेट करें", close: "✕ बंद",
    formTitle: "सेवा प्रदाता जोड़ें या रेट करें",
    vendorName: "नाम", phoneNumber: "फोन नंबर",
    selectCategory: "सेवा चुनें",
    reviewPlaceholder: "आपका अनुभव (वैकल्पिक)...",
    submit: "जमा करें →", call: "कॉल", whatsapp: "WhatsApp",
    reviews: "समीक्षाएं", withinRadius: (r) => `${r} के भीतर`,
    top: "शीर्ष", footer: "Zing Connect द्वारा संचालित",
    societyVerified: "सोसाइटी वेरिफाइड", openDirectory: "ओपन डायरेक्टरी",
    households: (n) => `${n} घर`, currentlyServing: "सेवारत",
    hireBtn: "मैंने रखा", veteran: "अनुभवी",
    showReviews: "समीक्षाएं", hideReviews: "छुपाएं",
    tierLabel: { society: "सोसाइटी वेरिफाइड", open: "ओपन डायरेक्टरी" },
    categoryLabels: { "All": "सभी", "Plumber": "प्लंबर", "Electrician": "इलेक्ट्रीशियन", "Cook": "रसोइया", "Carpenter": "बढ़ई", "Housekeeping": "सफाई", "Painter": "पेंटर", "AC Technician": "AC टेक" },
    tagLabels: { "Reliable": "भरोसेमंद", "On-time": "समय पर", "Affordable": "किफायती", "Excellent": "उत्कृष्ट", "Hygienic": "स्वच्छ", "Punctual": "समयनिष्ठ", "Good Work": "अच्छा काम", "Trustworthy": "विश्वसनीय", "Thorough": "कुशल", "Neat Work": "साफ काम", "Expert": "विशेषज्ञ", "Variety": "विविधता" }
  }
};

const RatingStars = ({ rating, small }) => (
  <div style={{ display: "flex", gap: "1px", alignItems: "center" }}>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ fontSize: small ? "9px" : "10px", color: i <= Math.round(rating) ? "#f59e0b" : "#334155" }}>★</span>
    ))}
    <span style={{ fontSize: small ? "10px" : "11px", fontWeight: "700", color: "#f1f5f9", marginLeft: "3px" }}>{rating}</span>
  </div>
);

const WhatsAppIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function ZingConnect() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTier, setActiveTier] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [lang, setLang] = useState("en");
  const [hoveredId, setHoveredId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [hiredIds, setHiredIds] = useState({});

  const t = translations[lang];

  const filtered = vendors
    .filter(v => activeTier === "all" || v.tier === activeTier)
    .filter(v => activeCategory === "All" || v.category === activeCategory)
    .filter(v =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase()) ||
      v.vendorId.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.tier === "society" && b.tier === "society") return b.households - a.households;
      return sortBy === "rating" ? b.rating - a.rating : b.reviews - a.reviews;
    });

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);
  const toggleHired = (id) => setHiredIds(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', system-ui, sans-serif" : "system-ui, sans-serif", minHeight: "100vh", background: "#0f172a" }}>

      {/* Header */}
      <div style={{ background: "#0f172a", padding: "0", borderBottom: "1px solid #1e293b", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "9px", background: "linear-gradient(135deg, #ff5b1f, #ff8c00)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>⚡</div>
            <div>
              <div style={{ color: "#f1f5f9", fontSize: "15px", fontWeight: "800", letterSpacing: "-0.5px", lineHeight: 1 }}>Zing Connect</div>
              <div style={{ color: "#475569", fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "1px" }}>Vendor Directory</div>
            </div>
          </div>
          <div style={{ display: "flex", background: "#1e293b", borderRadius: "20px", padding: "3px", gap: "2px", border: "1px solid #334155" }}>
            {["en", "hi"].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 12px", borderRadius: "16px", border: "none", background: lang === l ? "#ff5b1f" : "transparent", color: lang === l ? "#fff" : "#64748b", fontSize: "11px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" }}>
                {l === "en" ? "EN" : "हि"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding: "4px 16px 12px" }}>
          <p style={{ color: "#334155", fontSize: "11px", margin: 0 }}>{t.tagline}</p>
        </div>

        {/* Tier toggle */}
        <div style={{ display: "flex", gap: "6px", padding: "0 16px 10px" }}>
          {[["all", "All"], ["society", "🔒 " + t.societyVerified], ["open", "🌐 " + t.openDirectory]].map(([val, label]) => (
            <button key={val} onClick={() => setActiveTier(val)} style={{
              padding: "5px 12px", borderRadius: "8px", border: "none",
              background: activeTier === val ? (val === "society" ? "#1e3a5f" : val === "open" ? "#1a2e1a" : "#1e293b") : "#1e293b",
              color: activeTier === val ? (val === "society" ? "#60a5fa" : val === "open" ? "#4ade80" : "#f1f5f9") : "#475569",
              fontSize: "11px", fontWeight: "700", cursor: "pointer", transition: "all 0.15s",
              border: activeTier === val ? (val === "society" ? "1px solid #1e40af" : val === "open" ? "1px solid #14532d" : "1px solid #334155") : "1px solid transparent",
            }}>{label}</button>
          ))}
        </div>

        {/* Search */}
        <div style={{ padding: "0 16px 10px", display: "flex", gap: "8px" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "12px", color: "#475569" }}>🔍</span>
            <input placeholder={t.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "8px 12px 8px 30px", borderRadius: "10px", border: "1px solid #1e293b", background: "#1e293b", fontSize: "12px", fontFamily: "inherit", outline: "none", color: "#f1f5f9", boxSizing: "border-box" }} />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ padding: "8px 10px", borderRadius: "10px", border: "1px solid #1e293b", background: "#1e293b", fontSize: "11px", fontFamily: "inherit", color: "#94a3b8", outline: "none", cursor: "pointer" }}>
            <option value="rating">{t.topRated}</option>
            <option value="reviews">{t.mostReviewed}</option>
          </select>
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "0 16px 12px", scrollbarWidth: "none" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: "5px 12px", borderRadius: "20px",
              border: activeCategory === cat ? "none" : "1px solid #1e293b",
              background: activeCategory === cat ? "#ff5b1f" : "#1e293b",
              color: activeCategory === cat ? "#fff" : "#64748b",
              fontSize: "11px", fontFamily: "inherit", whiteSpace: "nowrap",
              cursor: "pointer", fontWeight: activeCategory === cat ? "700" : "500", transition: "all 0.15s",
            }}>
              {categoryEmoji[cat]} {t.categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "12px 14px", maxWidth: "640px", margin: "0 auto" }}>

        {/* Results bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontSize: "11px", color: "#475569" }}>{t.vendorsFound(filtered.length)}</span>
          <button onClick={() => setShowForm(!showForm)} style={{ padding: "6px 12px", borderRadius: "20px", border: "1px solid #ff5b1f", background: showForm ? "#ff5b1f" : "transparent", color: showForm ? "#fff" : "#ff5b1f", fontSize: "11px", fontFamily: "inherit", cursor: "pointer", fontWeight: "700", transition: "all 0.15s" }}>
            {showForm ? t.close : t.addRate}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div style={{ background: "#1e293b", borderRadius: "14px", padding: "16px", marginBottom: "12px", border: "1px solid #334155" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: "700", color: "#f1f5f9" }}>{t.formTitle}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[t.vendorName, t.phoneNumber].map(label => (
                <input key={label} placeholder={label} style={{ padding: "9px 12px", borderRadius: "8px", border: "1px solid #334155", fontSize: "12px", fontFamily: "inherit", outline: "none", background: "#0f172a", color: "#f1f5f9" }} />
              ))}
              <select style={{ padding: "9px 12px", borderRadius: "8px", border: "1px solid #334155", fontSize: "12px", fontFamily: "inherit", color: "#94a3b8", background: "#0f172a", outline: "none" }}>
                <option>{t.selectCategory}</option>
                {categories.slice(1).map(c => <option key={c}>{t.categoryLabels[c]}</option>)}
              </select>
              <input placeholder="Flat Number (e.g. B-304)" style={{ padding: "9px 12px", borderRadius: "8px", border: "1px solid #334155", fontSize: "12px", fontFamily: "inherit", outline: "none", background: "#0f172a", color: "#f1f5f9" }} />
              <div style={{ display: "flex", gap: "5px" }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} style={{ flex: 1, padding: "8px", borderRadius: "7px", border: "1px solid #334155", background: "#0f172a", fontSize: "14px", cursor: "pointer" }}>{"★".repeat(n)}</button>
                ))}
              </div>
              <textarea placeholder={t.reviewPlaceholder} rows={2} style={{ padding: "9px 12px", borderRadius: "8px", border: "1px solid #334155", fontSize: "12px", fontFamily: "inherit", resize: "vertical", background: "#0f172a", color: "#f1f5f9", outline: "none" }} />
              <div style={{ background: "#0f172a", borderRadius: "8px", padding: "8px 10px", border: "1px solid #1e3a5f", fontSize: "10px", color: "#475569" }}>
                🔒 Your flat number is used for verification only and will not be publicly shown.
              </div>
              <button style={{ padding: "10px", borderRadius: "8px", border: "none", background: "#ff5b1f", color: "#fff", fontSize: "12px", fontFamily: "inherit", fontWeight: "700", cursor: "pointer" }}>{t.submit}</button>
            </div>
          </div>
        )}

        {/* Vendor Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map((vendor, i) => {
            const isExpanded = expandedId === vendor.id;
            const isHired = hiredIds[vendor.id];
            const reviews = sampleReviews[vendor.id] || [];
            const isSociety = vendor.tier === "society";

            return (
              <div key={vendor.id}
                onMouseEnter={() => setHoveredId(vendor.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: hoveredId === vendor.id ? "#1a2435" : "#161f2e",
                  borderRadius: "14px", padding: "12px 14px",
                  border: isSociety ? "1px solid #1e3a5f" : hoveredId === vendor.id ? "1px solid #ff5b1f33" : "1px solid #1e293b",
                  animation: "fadeUp 0.3s ease both", animationDelay: `${i * 0.04}s`, transition: "all 0.2s",
                }}
              >
                {/* Tier pill */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{
                    fontSize: "9px", fontWeight: "700", padding: "2px 7px", borderRadius: "4px",
                    background: isSociety ? "#1e3a5f" : "#1a2e1a",
                    color: isSociety ? "#60a5fa" : "#4ade80",
                    border: isSociety ? "1px solid #1e40af" : "1px solid #14532d",
                    letterSpacing: "0.5px", textTransform: "uppercase",
                  }}>
                    {isSociety ? "🔒 " + t.tierLabel.society : "🌐 " + t.tierLabel.open}
                  </span>
                  {vendor.veteran && (
                    <span style={{ fontSize: "9px", fontWeight: "700", padding: "2px 7px", borderRadius: "4px", background: "#2d1b00", color: "#fbbf24", border: "1px solid #78350f" }}>
                      ⭐ {t.veteran}
                    </span>
                  )}
                </div>

                {/* Main row */}
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px", flexShrink: 0, border: "1px solid #334155" }}>
                    {categoryEmoji[vendor.category]}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: "#f1f5f9" }}>{vendor.name}</span>
                      {vendor.verified && <span style={{ fontSize: "9px", color: "#22c55e", background: "#052e16", border: "1px solid #166534", padding: "1px 4px", borderRadius: "3px", fontWeight: "700" }}>✓</span>}
                      {i < 3 && <span style={{ fontSize: "12px" }}>{["🥇","🥈","🥉"][i]}</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "10px", color: "#64748b" }}>{t.categoryLabels[vendor.category]}</span>
                      <span style={{ color: "#334155", fontSize: "9px" }}>·</span>
                      {isSociety ? (
                        <span style={{ fontSize: "10px", color: "#60a5fa", fontWeight: "700" }}>
                          🏠 {t.currentlyServing} {t.households(vendor.households)}
                        </span>
                      ) : (
                        <RatingStars rating={vendor.rating} small />
                      )}
                      <span style={{ color: "#334155", fontSize: "9px" }}>·</span>
                      <span style={{ color: "#334155", fontSize: "9px", fontFamily: "monospace" }}>{vendor.vendorId}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
                    <a href={`tel:${vendor.phone}`} style={{ padding: "6px 10px", borderRadius: "8px", background: "#1e293b", color: "#f1f5f9", fontSize: "11px", fontFamily: "inherit", textDecoration: "none", fontWeight: "700", border: "1px solid #334155", display: "flex", alignItems: "center", gap: "3px" }}>
                      📞 {t.call}
                    </a>
                    <a href={`https://wa.me/91${vendor.phone}`} target="_blank" rel="noreferrer" style={{ padding: "6px 9px", borderRadius: "8px", background: "#052e16", color: "#4ade80", fontSize: "11px", fontFamily: "inherit", textDecoration: "none", fontWeight: "700", border: "1px solid #14532d", display: "flex", alignItems: "center", gap: "3px" }}>
                      <WhatsAppIcon />
                    </a>
                  </div>
                </div>

                {/* Tags + radius */}
                <div style={{ display: "flex", gap: "4px", marginTop: "8px", flexWrap: "wrap" }}>
                  <span style={{ padding: "2px 6px", borderRadius: "4px", background: "#0f172a", color: "#475569", fontSize: "9px", border: "1px solid #1e293b" }}>
                    🔵 {vendor.radius}
                  </span>
                  {vendor.tags.map(tag => (
                    <span key={tag} style={{ padding: "2px 6px", borderRadius: "4px", background: "#0f172a", color: "#475569", fontSize: "9px", border: "1px solid #1e293b" }}>
                      {t.tagLabels[tag] || tag}
                    </span>
                  ))}
                </div>

                {/* Bottom actions */}
                <div style={{ display: "flex", gap: "6px", marginTop: "10px", alignItems: "center" }}>
                  {/* Hire button for open tier, Hired counter for society tier */}
                  {isSociety ? (
                    <button onClick={() => toggleHired(vendor.id)} style={{
                      padding: "5px 12px", borderRadius: "7px", border: "none",
                      background: isHired ? "#1e3a5f" : "#1e293b",
                      color: isHired ? "#60a5fa" : "#475569",
                      fontSize: "10px", fontFamily: "inherit", fontWeight: "700", cursor: "pointer",
                      border: isHired ? "1px solid #1e40af" : "1px solid #334155",
                    }}>
                      {isHired ? "✓ Currently Employing" : "+ I Employ This Person"}
                    </button>
                  ) : (
                    <button onClick={() => toggleHired(vendor.id)} style={{
                      padding: "5px 12px", borderRadius: "7px", border: "none",
                      background: isHired ? "#052e16" : "#1e293b",
                      color: isHired ? "#4ade80" : "#475569",
                      fontSize: "10px", fontFamily: "inherit", fontWeight: "700", cursor: "pointer",
                      border: isHired ? "1px solid #14532d" : "1px solid #334155",
                    }}>
                      {isHired ? "✓ " + t.hireBtn : "+ " + t.hireBtn}
                    </button>
                  )}

                  {reviews.length > 0 && (
                    <button onClick={() => toggleExpand(vendor.id)} style={{
                      padding: "5px 12px", borderRadius: "7px",
                      background: "transparent", color: "#475569",
                      fontSize: "10px", fontFamily: "inherit", fontWeight: "600", cursor: "pointer",
                      border: "1px solid #1e293b",
                    }}>
                      {isExpanded ? t.hideReviews : `${t.showReviews} (${reviews.length})`}
                    </button>
                  )}
                </div>

                {/* Reviews */}
                {isExpanded && reviews.length > 0 && (
                  <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {reviews.map((r, idx) => (
                      <div key={idx} style={{ background: "#0f172a", borderRadius: "8px", padding: "8px 10px", border: "1px solid #1e293b" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <span style={{ fontSize: "9px", color: "#475569" }}>{r.display}</span>
                          <RatingStars rating={r.stars} small />
                        </div>
                        <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", lineHeight: 1.4 }}>{r.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "28px", paddingBottom: "24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: "linear-gradient(135deg, #ff5b1f, #ff8c00)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px" }}>⚡</div>
            <span style={{ fontSize: "10px", color: "#334155" }}>{t.footer}</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { display: none; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
