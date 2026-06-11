import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const vendors = [
  {
    id: 1, vendorId: "ZC-0001", name: "Anita Didi", category: "Cook", tier: "residential",
    phone: "9876500003", rating: 4.9, reviews: 21, households: 7, veteran: true, verified: true,
    radius: "1 km", availability: "Morning 7–10am", capacity: "full",
    tags: [
      { label: "South Indian", type: "skill", confirmed: true, strong: true },
      { label: "North Indian", type: "skill", confirmed: true, strong: false },
      { label: "Pure Veg", type: "skill", confirmed: true, strong: true },
      { label: "Punctual", type: "trait", confirmed: true, strong: true },
      { label: "Hygienic", type: "trait", confirmed: true, strong: false },
      { label: "Kids Friendly", type: "compat", confirmed: true, strong: false },
      { label: "Morning Slot", type: "avail", confirmed: true, strong: false },
    ],
    summary: "Anita has been working in Lotus Zing for over 14 months and is currently employed by 7 households. She specialises in South Indian and North Indian cooking and is known for clean kitchen habits and consistent quality. Residents highlight her punctuality and ability to manage kitchens independently.",
    reviewList: [
      { text: "Makes amazing sambar and rasam, very hygienic kitchen habits.", display: "Verified Resident · Tower B", stars: 5, helpful: 8 },
      { text: "Punctual and trustworthy, been with us 8 months now.", display: "Verified Resident · Tower A", stars: 5, helpful: 6 },
    ]
  },
  {
    id: 2, vendorId: "ZC-0002", name: "Priya Maid Services", category: "Housekeeping", tier: "residential",
    phone: "9123400005", rating: 4.5, reviews: 17, households: 11, veteran: true, verified: true,
    radius: "2 km", availability: "Morning & Evening", capacity: "possibly-full",
    tags: [
      { label: "Sweeping & Mopping", type: "skill", confirmed: true, strong: true },
      { label: "Utensils", type: "skill", confirmed: true, strong: false },
      { label: "Trustworthy", type: "trait", confirmed: true, strong: true },
      { label: "Never Misses", type: "trait", confirmed: true, strong: true },
      { label: "Pets Friendly", type: "compat", confirmed: true, strong: false },
      { label: "WFH Friendly", type: "compat", confirmed: false, strong: false },
    ],
    summary: "Priya is one of the most widely employed housekeeping professionals in the society with 11 active households. Known for reliability and thoroughness, she rarely misses work and always provides a substitute when unavailable. Currently possibly at capacity.",
    reviewList: [
      { text: "Has been cleaning our home for over a year now, never lets us down.", display: "Verified Resident · Tower C", stars: 5, helpful: 11 },
      { text: "Very thorough, works without supervision.", display: "Verified Resident · Tower B", stars: 4, helpful: 5 },
    ]
  },
  {
    id: 3, vendorId: "ZC-0003", name: "Sunita Cook", category: "Cook", tier: "residential",
    phone: "9222200008", rating: 4.3, reviews: 9, households: 3, veteran: false, verified: true,
    radius: "1 km", availability: "Flexible", capacity: "available",
    tags: [
      { label: "North Indian", type: "skill", confirmed: true, strong: false },
      { label: "Non-Veg", type: "skill", confirmed: true, strong: false },
      { label: "Variety", type: "trait", confirmed: false, strong: false },
      { label: "Flexible Timing", type: "avail", confirmed: true, strong: false },
    ],
    summary: "Sunita joined Zing Connect recently and is currently employed by 3 households. She specialises in North Indian cooking and non-vegetarian dishes. Her flexible timing makes her a good fit for households with changing schedules.",
    reviewList: [
      { text: "Good variety of dishes, flexible with timing.", display: "Verified Resident · Tower D", stars: 4, helpful: 3 },
    ]
  },
  {
    id: 4, vendorId: "ZC-0004", name: "Ramesh Kumar", category: "Plumber", tier: "oncall",
    phone: "9810000001", rating: 4.7, reviews: 12, hired: 8, veteran: false, verified: true,
    radius: "2 km", availability: "Same Day Available", capacity: "available",
    tags: [
      { label: "Leakage Fix", type: "skill", confirmed: true, strong: true },
      { label: "Bathroom Fitting", type: "skill", confirmed: true, strong: false },
      { label: "Geyser Repair", type: "skill", confirmed: false, strong: false },
      { label: "Punctual", type: "trait", confirmed: true, strong: true },
      { label: "Transparent Pricing", type: "trait", confirmed: true, strong: false },
      { label: "Same Day", type: "avail", confirmed: true, strong: true },
    ],
    summary: "Ramesh is one of the most trusted plumbers in the society with 8 verified hires and a 4.7 rating. Residents consistently highlight his punctuality and transparent pricing. Available same day for urgent calls.",
    reviewList: [
      { text: "Fixed our bathroom leakage in 2 hours, came on time, charged fairly.", display: "Verified Resident · Sector 168", stars: 5, helpful: 7 },
      { text: "Reliable, brings his own tools, very clean work.", display: "Verified Resident · Sector 168", stars: 4, helpful: 4 },
    ]
  },
  {
    id: 5, vendorId: "ZC-0005", name: "Vijay AC Repair", category: "AC Technician", tier: "oncall",
    phone: "9678900007", rating: 4.6, reviews: 14, hired: 9, veteran: false, verified: true,
    radius: "5 km", availability: "Weekdays + Weekends", capacity: "available",
    tags: [
      { label: "Gas Refill R32", type: "skill", confirmed: true, strong: true },
      { label: "Deep Service", type: "skill", confirmed: true, strong: true },
      { label: "Daikin", type: "skill", confirmed: false, strong: false },
      { label: "Voltas", type: "skill", confirmed: true, strong: false },
      { label: "Expert", type: "trait", confirmed: true, strong: true },
      { label: "Affordable", type: "trait", confirmed: true, strong: false },
    ],
    summary: "Vijay is the society's go-to AC technician with 9 verified hires and expertise across multiple brands. Residents particularly trust him for gas refills and deep servicing. Available on weekdays and weekends.",
    reviewList: [
      { text: "Serviced 3 ACs in one visit, very efficient.", display: "Verified Resident · Sector 168", stars: 5, helpful: 9 },
    ]
  },
  {
    id: 6, vendorId: "ZC-0006", name: "Suresh Electricals", category: "Electrician", tier: "oncall",
    phone: "9911000002", rating: 4.2, reviews: 8, hired: 5, veteran: false, verified: true,
    radius: "5 km", availability: "Mon–Sat", capacity: "available",
    tags: [
      { label: "Wiring", type: "skill", confirmed: true, strong: false },
      { label: "Fan Installation", type: "skill", confirmed: true, strong: false },
      { label: "MCB Issues", type: "skill", confirmed: false, strong: false },
      { label: "Affordable", type: "trait", confirmed: true, strong: false },
      { label: "Weekend Available", type: "avail", confirmed: false, strong: false },
    ],
    summary: "Suresh handles general electrical work across the society. Known for affordable rates. Available Monday to Saturday.",
    reviewList: [
      { text: "Fixed the fan wiring issue quickly, affordable pricing.", display: "Verified Resident · Sector 168", stars: 4, helpful: 2 },
    ]
  },
  {
    id: 7, vendorId: "ZC-0007", name: "Mohan Carpentry", category: "Carpenter", tier: "oncall",
    phone: "9700100004", rating: 3.8, reviews: 5, hired: 2, veteran: false, verified: false,
    radius: "8 km", availability: "Weekends Preferred", capacity: "available",
    tags: [
      { label: "Furniture Repair", type: "skill", confirmed: true, strong: false },
      { label: "Door Fix", type: "skill", confirmed: false, strong: false },
      { label: "Good Work", type: "trait", confirmed: false, strong: false },
    ],
    summary: "Mohan handles furniture repairs and door fixes. Relatively new to the directory with 2 verified hires so far.",
    reviewList: [
      { text: "Fixed our wardrobe door, good work.", display: "Verified Resident · Sector 168", stars: 4, helpful: 1 },
    ]
  },
];

const categories = ["All", "Cook", "Housekeeping", "Plumber", "Electrician", "AC Technician", "Carpenter", "Painter", "Driver", "Nanny"];

const categoryEmoji = {
  "All": "✦", "Cook": "🍳", "Housekeeping": "🧹", "Plumber": "🔧",
  "Electrician": "⚡", "AC Technician": "❄️", "Carpenter": "🪚",
  "Painter": "🎨", "Driver": "🚗", "Nanny": "👶"
};

const contextTags = {
  "Cook": ["Pure Veg", "Jain", "Vegan", "Non-Veg", "South Indian", "North Indian", "Punjabi", "Bengali", "Morning Slot", "Full Day", "Kids Friendly", "Senior Friendly"],
  "Housekeeping": ["Sweeping & Mopping", "Utensils", "Laundry", "Full House", "Morning", "Evening", "Pets Friendly", "WFH Friendly"],
  "Plumber": ["Leakage Fix", "Bathroom Fitting", "Geyser", "Same Day", "Emergency", "Weekend Available"],
  "Electrician": ["Wiring", "Fan Installation", "MCB Issues", "CCTV", "Same Day", "Emergency"],
  "AC Technician": ["Gas Refill", "Deep Service", "Daikin", "Voltas", "LG", "Samsung", "Same Day"],
  "Carpenter": ["Furniture Repair", "Door Fix", "Modular Kitchen", "Wardrobe", "Weekend Available"],
  "Painter": ["Full House", "Single Room", "Waterproofing", "Texture Finish", "Weekend Available"],
  "Driver": ["School Drop", "Office Commute", "Airport", "Full Day", "Ladies Special"],
  "Nanny": ["Infant Care", "Toddler", "School Age", "Homework Help", "Live-In", "Hindi Speaking"],
};

const translations = {
  en: {
    tagline: "Your trusted neighbourhood service network",
    search: "Search by name, service or ID...",
    topRated: "Top Rated", mostReviewed: "Most Reviewed",
    found: (n) => `${n} provider${n !== 1 ? "s" : ""}`,
    add: "+ Add / Rate", close: "✕ Close",
    call: "Call", callCheck: "Call to Check", whatsapp: "WhatsApp",
    reviews: "reviews", households: (n) => `${n} households`,
    serving: "Serving", hired: (n) => `${n} hires`,
    veteran: "Veteran", newBadge: "NEW",
    residential: "Residential", oncall: "On-Call",
    available: "🟢 Likely Available", possiblyFull: "🟡 Possibly Full",
    full: "🔴 Likely Full", unknown: "⚪ Availability Unknown",
    share: "Share", notHelpful: "Not Helpful", showReviews: "Reviews", hideReviews: "Hide",
    profileSummary: "Profile Summary",
    confirmedTag: "✓", suggestedTag: "?",
    footer: "Powered by Zing Connect",
    browsing: "residents browsing",
    lastReview: "Last review 2 hrs ago",
    totalVendors: "vendors added",
    totalResidents: "by residents",
    milestone: "🎉 Lotus Zing just hit 50 vendors! Thank you community.",
    filterBy: "Filter by:",
    all: "All", residential2: "🏠 Residential", oncall2: "🔧 On-Call",
    formTitle: "Add a Provider or Rate One",
    vendorName: "Vendor Name", phone: "Phone Number",
    selectCat: "Select Service Type", flatNo: "Your Flat Number (e.g. B-304)",
    reviewPlaceholder: "Your experience (optional)...",
    submit: "Submit →",
    privacyNote: "🔒 Your flat number is used for verification only and will never be shown publicly.",
    availability: "Availability",
  },
  hi: {
    tagline: "आपका भरोसेमंद पड़ोस सेवा नेटवर्क",
    search: "नाम, सेवा या ID से खोजें...",
    topRated: "सर्वश्रेष्ठ", mostReviewed: "सर्वाधिक",
    found: (n) => `${n} सेवा प्रदाता`,
    add: "+ जोड़ें / रेट करें", close: "✕ बंद",
    call: "कॉल", callCheck: "कॉल कर पूछें", whatsapp: "WhatsApp",
    reviews: "समीक्षाएं", households: (n) => `${n} घर`,
    serving: "सेवारत", hired: (n) => `${n} बार काम`,
    veteran: "अनुभवी", newBadge: "नया",
    residential: "रेज़ीडेंशियल", oncall: "ऑन-कॉल",
    available: "🟢 संभवतः उपलब्ध", possiblyFull: "🟡 शायद भरे हुए",
    full: "🔴 संभवतः भरे हुए", unknown: "⚪ उपलब्धता अज्ञात",
    share: "शेयर", notHelpful: "उपयोगी नहीं", showReviews: "समीक्षाएं", hideReviews: "छुपाएं",
    profileSummary: "प्रोफाइल सारांश",
    confirmedTag: "✓", suggestedTag: "?",
    footer: "Zing Connect द्वारा",
    browsing: "निवासी ब्राउज़ कर रहे हैं",
    lastReview: "आखिरी समीक्षा 2 घंटे पहले",
    totalVendors: "विक्रेता जोड़े",
    totalResidents: "निवासियों द्वारा",
    milestone: "🎉 लोटस ज़िंग में 50 विक्रेता! धन्यवाद।",
    filterBy: "फ़िल्टर:",
    all: "सभी", residential2: "🏠 रेज़ीडेंशियल", oncall2: "🔧 ऑन-कॉल",
    formTitle: "प्रदाता जोड़ें या रेट करें",
    vendorName: "नाम", phone: "फोन नंबर",
    selectCat: "सेवा चुनें", flatNo: "आपका फ्लैट नंबर (जैसे B-304)",
    reviewPlaceholder: "आपका अनुभव (वैकल्पिक)...",
    submit: "जमा करें →",
    privacyNote: "🔒 आपका फ्लैट नंबर केवल सत्यापन के लिए है।",
    availability: "उपलब्धता",
  }
};

const RatingStars = ({ rating }) => (
  <div style={{ display: "flex", gap: "1px", alignItems: "center" }}>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ fontSize: "9px", color: i <= Math.round(rating) ? "#f59e0b" : "#2d3748" }}>★</span>
    ))}
    <span style={{ fontSize: "11px", fontWeight: "800", color: "#f1f5f9", marginLeft: "3px" }}>{rating}</span>
  </div>
);

const WhatsAppIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
  </svg>
);

export default function ZingConnect() {
  const [lang, setLang] = useState("en");
  const [tier, setTier] = useState("all");
  const [category, setCategory] = useState("All");
  const [activeTags, setActiveTags] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [expanded, setExpanded] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [employed, setEmployed] = useState({});
  const [hired, setHired] = useState({});
  const [notHelpful, setNotHelpful] = useState({});
  const [showMilestone, setShowMilestone] = useState(true);

  const t = translations[lang];

  const toggleTag = (tag) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const capacityLabel = (v) => {
    if (v.capacity === "available") return t.available;
    if (v.capacity === "possibly-full") return t.possiblyFull;
    if (v.capacity === "full") return t.full;
    return t.unknown;
  };

  const capacityColor = (v) => {
    if (v.capacity === "available") return "#22c55e";
    if (v.capacity === "possibly-full") return "#f59e0b";
    if (v.capacity === "full") return "#ef4444";
    return "#64748b";
  };

  const callLabel = (v) => v.capacity === "available" ? t.call : t.callCheck;

  const filtered = vendors
    .filter(v => tier === "all" || v.tier === tier)
    .filter(v => category === "All" || v.category === category)
    .filter(v => activeTags.length === 0 || activeTags.every(at => v.tags.some(vt => vt.label === at)))
    .filter(v =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase()) ||
      v.vendorId.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.tier === "residential" && b.tier === "residential") return b.households - a.households;
      return sortBy === "rating" ? b.rating - a.rating : b.reviews - a.reviews;
    });

  const tagColor = (type) => {
    if (type === "skill") return { bg: "#1e3a5f", color: "#93c5fd", border: "#1e40af" };
    if (type === "trait") return { bg: "#1a2e1a", color: "#86efac", border: "#14532d" };
    if (type === "compat") return { bg: "#2d1b69", color: "#c4b5fd", border: "#4c1d95" };
    if (type === "avail") return { bg: "#2d1f00", color: "#fcd34d", border: "#78350f" };
    return { bg: "#1e293b", color: "#94a3b8", border: "#334155" };
  };

  return (
    <div style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', system-ui" : "system-ui, sans-serif", minHeight: "100vh", background: "#080d14" }}>

      {/* Milestone Banner */}
      {showMilestone && (
        <div style={{ background: "linear-gradient(90deg, #ff5b1f22, #ff8c0022)", borderBottom: "1px solid #ff5b1f44", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: "#fb923c", fontWeight: "600" }}>{t.milestone}</span>
          <button onClick={() => setShowMilestone(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "13px" }}>✕</button>
        </div>
      )}

      {/* Header */}
      <div style={{ background: "#0d1520", borderBottom: "1px solid #1e293b", position: "sticky", top: 0, zIndex: 100 }}>

        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "linear-gradient(135deg, #ff5b1f, #ff8c00)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>⚡</div>
            <div>
              <div style={{ color: "#f1f5f9", fontSize: "16px", fontWeight: "900", letterSpacing: "-0.8px", lineHeight: 1 }}>Zing Connect</div>
              <div style={{ color: "#334155", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", marginTop: "2px" }}>Vendor Directory</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {/* Live dot */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#1e293b", padding: "4px 8px", borderRadius: "20px", border: "1px solid #334155" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
              <span style={{ fontSize: "9px", color: "#64748b" }}>3 {t.browsing}</span>
            </div>
            {/* Lang toggle */}
            <div style={{ display: "flex", background: "#1e293b", borderRadius: "20px", padding: "2px", gap: "1px", border: "1px solid #334155" }}>
              {["en", "hi"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 12px", borderRadius: "16px", border: "none", background: lang === l ? "#ff5b1f" : "transparent", color: lang === l ? "#fff" : "#64748b", fontSize: "11px", fontWeight: "800", cursor: "pointer", transition: "all 0.15s" }}>
                  {l === "en" ? "EN" : "हि"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live stats bar */}
        <div style={{ display: "flex", gap: "16px", padding: "8px 16px 10px", overflowX: "auto", scrollbarWidth: "none" }}>
          {[
            ["62", t.totalVendors, "#ff5b1f"],
            ["48", t.totalResidents, "#94a3b8"],
            [t.lastReview, "", "#475569"],
          ].map(([val, label, color], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color }}>{val}</span>
              {label && <span style={{ fontSize: "10px", color: "#334155" }}>{label}</span>}
            </div>
          ))}
        </div>

        {/* Tier Toggle */}
        <div style={{ display: "flex", gap: "6px", padding: "0 16px 10px" }}>
          {[["all", t.all], ["residential", t.residential2], ["oncall", t.oncall2]].map(([val, label]) => (
            <button key={val} onClick={() => { setTier(val); setCategory("All"); setActiveTags([]); }} style={{
              padding: "5px 12px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: "700", transition: "all 0.15s",
              background: tier === val ? (val === "residential" ? "#052e16" : val === "oncall" ? "#1e3a5f" : "#ff5b1f") : "#1e293b",
              color: tier === val ? (val === "residential" ? "#4ade80" : val === "oncall" ? "#93c5fd" : "#fff") : "#475569",
              border: tier === val ? (val === "residential" ? "1px solid #14532d" : val === "oncall" ? "1px solid #1e40af" : "none") : "1px solid transparent",
            }}>{label}</button>
          ))}
        </div>

        {/* Search + Sort */}
        <div style={{ display: "flex", gap: "8px", padding: "0 16px 10px" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "12px", color: "#334155" }}>🔍</span>
            <input placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "8px 12px 8px 30px", borderRadius: "10px", border: "1px solid #1e293b", background: "#1e293b", fontSize: "12px", outline: "none", color: "#f1f5f9", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ padding: "8px 10px", borderRadius: "10px", border: "1px solid #1e293b", background: "#1e293b", fontSize: "11px", color: "#64748b", outline: "none", cursor: "pointer", fontFamily: "inherit" }}>
            <option value="rating">{t.topRated}</option>
            <option value="reviews">{t.mostReviewed}</option>
          </select>
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", padding: "0 16px 10px", scrollbarWidth: "none" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => { setCategory(cat); setActiveTags([]); }} style={{
              padding: "5px 12px", borderRadius: "20px", border: category === cat ? "none" : "1px solid #1e293b",
              background: category === cat ? "#ff5b1f" : "#1e293b",
              color: category === cat ? "#fff" : "#475569",
              fontSize: "11px", whiteSpace: "nowrap", cursor: "pointer", fontWeight: category === cat ? "700" : "500", transition: "all 0.15s", fontFamily: "inherit",
            }}>
              {categoryEmoji[cat]} {cat}
            </button>
          ))}
        </div>

        {/* Context Tag Filters */}
        {category !== "All" && contextTags[category] && (
          <div style={{ padding: "0 16px 12px" }}>
            <div style={{ fontSize: "9px", color: "#334155", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>{t.filterBy}</div>
            <div style={{ display: "flex", gap: "5px", overflowX: "auto", scrollbarWidth: "none" }}>
              {contextTags[category].map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)} style={{
                  padding: "4px 10px", borderRadius: "20px", border: activeTags.includes(tag) ? "none" : "1px solid #1e293b",
                  background: activeTags.includes(tag) ? "#ff5b1f" : "#0f172a",
                  color: activeTags.includes(tag) ? "#fff" : "#475569",
                  fontSize: "10px", whiteSpace: "nowrap", cursor: "pointer", fontWeight: activeTags.includes(tag) ? "700" : "400", transition: "all 0.15s", fontFamily: "inherit",
                }}>{tag}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "12px 14px", maxWidth: "640px", margin: "0 auto" }}>

        {/* Results bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontSize: "11px", color: "#334155" }}>{t.found(filtered.length)}</span>
          <button onClick={() => setShowForm(!showForm)} style={{ padding: "6px 14px", borderRadius: "20px", border: "1px solid #ff5b1f", background: showForm ? "#ff5b1f" : "transparent", color: showForm ? "#fff" : "#ff5b1f", fontSize: "11px", cursor: "pointer", fontWeight: "700", transition: "all 0.15s", fontFamily: "inherit" }}>
            {showForm ? t.close : t.add}
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div style={{ background: "#0d1520", borderRadius: "14px", padding: "16px", marginBottom: "12px", border: "1px solid #1e293b" }}>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#f1f5f9", marginBottom: "12px" }}>{t.formTitle}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[t.vendorName, t.phone, t.flatNo].map(label => (
                <input key={label} placeholder={label} style={{ padding: "9px 12px", borderRadius: "8px", border: "1px solid #1e293b", fontSize: "12px", outline: "none", background: "#080d14", color: "#f1f5f9", fontFamily: "inherit" }} />
              ))}
              <select style={{ padding: "9px 12px", borderRadius: "8px", border: "1px solid #1e293b", fontSize: "12px", color: "#64748b", background: "#080d14", outline: "none", fontFamily: "inherit" }}>
                <option>{t.selectCat}</option>
                {categories.slice(1).map(c => <option key={c}>{c}</option>)}
              </select>
              <div style={{ display: "flex", gap: "5px" }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} style={{ flex: 1, padding: "8px", borderRadius: "7px", border: "1px solid #1e293b", background: "#080d14", fontSize: "14px", cursor: "pointer" }}>{"★".repeat(n)}</button>
                ))}
              </div>
              <textarea placeholder={t.reviewPlaceholder} rows={2} style={{ padding: "9px 12px", borderRadius: "8px", border: "1px solid #1e293b", fontSize: "12px", resize: "vertical", background: "#080d14", color: "#f1f5f9", outline: "none", fontFamily: "inherit" }} />
              <div style={{ background: "#080d14", borderRadius: "8px", padding: "8px 10px", border: "1px solid #1e3a5f", fontSize: "10px", color: "#475569" }}>{t.privacyNote}</div>
              <button style={{ padding: "10px", borderRadius: "8px", border: "none", background: "#ff5b1f", color: "#fff", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>{t.submit}</button>
            </div>
          </div>
        )}

        {/* Vendor Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map((vendor, i) => {
            const isExpanded = expanded === vendor.id;
            const isResidential = vendor.tier === "residential";
            const capColor = capacityColor(vendor);

            return (
              <div key={vendor.id} style={{
                background: "#0d1520",
                borderRadius: "14px",
                border: isResidential ? "1px solid #14532d" : "1px solid #1e293b",
                overflow: "hidden",
                animation: `fadeUp 0.3s ease both`,
                animationDelay: `${i * 0.04}s`,
                transition: "border-color 0.2s",
              }}>
                {/* Tier + Veteran row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px 0" }}>
                  <span style={{
                    fontSize: "8px", fontWeight: "800", padding: "2px 7px", borderRadius: "4px", letterSpacing: "0.8px", textTransform: "uppercase",
                    background: isResidential ? "#052e16" : "#1e3a5f",
                    color: isResidential ? "#4ade80" : "#93c5fd",
                    border: isResidential ? "1px solid #14532d" : "1px solid #1e40af",
                  }}>
                    {isResidential ? "🏠 " + t.residential : "🔧 " + t.oncall}
                  </span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {vendor.veteran && <span style={{ fontSize: "8px", fontWeight: "800", padding: "2px 6px", borderRadius: "4px", background: "#2d1b00", color: "#fcd34d", border: "1px solid #78350f" }}>⭐ {t.veteran}</span>}
                    {!vendor.veteran && vendor.reviews < 5 && <span style={{ fontSize: "8px", fontWeight: "800", padding: "2px 6px", borderRadius: "4px", background: "#ff5b1f22", color: "#ff5b1f", border: "1px solid #ff5b1f44" }}>✨ {t.newBadge}</span>}
                  </div>
                </div>

                {/* Main card content */}
                <div style={{ padding: "8px 12px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>

                    {/* Avatar */}
                    <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: isResidential ? "#052e16" : "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0, border: isResidential ? "1px solid #14532d" : "1px solid #1e40af" }}>
                      {categoryEmoji[vendor.category]}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "14px", fontWeight: "800", color: "#f1f5f9" }}>{vendor.name}</span>
                        {vendor.verified && <span style={{ fontSize: "9px", color: "#22c55e", background: "#052e16", border: "1px solid #14532d", padding: "1px 4px", borderRadius: "3px", fontWeight: "700" }}>✓</span>}
                        {i < 3 && <span style={{ fontSize: "13px" }}>{["🥇","🥈","🥉"][i]}</span>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "10px", color: "#475569" }}>{vendor.category}</span>
                        <span style={{ color: "#1e293b" }}>·</span>
                        {isResidential ? (
                          <span style={{ fontSize: "10px", color: "#4ade80", fontWeight: "700" }}>🏠 {t.serving} {t.households(vendor.households)}</span>
                        ) : (
                          <>
                            <RatingStars rating={vendor.rating} />
                            <span style={{ fontSize: "9px", color: "#334155" }}>({vendor.reviews})</span>
                          </>
                        )}
                        <span style={{ color: "#1e293b" }}>·</span>
                        <span style={{ fontSize: "9px", color: "#1e293b", fontFamily: "monospace" }}>{vendor.vendorId}</span>
                      </div>

                      {/* Capacity */}
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "4px" }}>
                        <span style={{ fontSize: "10px", color: capColor, fontWeight: "600" }}>{capacityLabel(vendor)}</span>
                        <span style={{ color: "#1e293b" }}>·</span>
                        <span style={{ fontSize: "10px", color: "#334155" }}>🔵 {vendor.radius}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", gap: "4px", marginTop: "8px", flexWrap: "wrap" }}>
                    {vendor.tags.map(tag => {
                      const tc = tagColor(tag.type);
                      return (
                        <span key={tag.label} style={{
                          padding: "2px 7px", borderRadius: "4px", fontSize: "9px", fontWeight: tag.confirmed ? "700" : "400",
                          background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`,
                          opacity: tag.confirmed ? 1 : 0.5,
                        }}>
                          {tag.confirmed ? (tag.strong ? "●" : "○") : "?"} {tag.label}
                        </span>
                      );
                    })}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
                    <a href={`tel:${vendor.phone}`} style={{ padding: "6px 12px", borderRadius: "8px", background: "#1e293b", color: "#f1f5f9", fontSize: "11px", textDecoration: "none", fontWeight: "700", border: "1px solid #334155", display: "flex", alignItems: "center", gap: "3px", fontFamily: "inherit" }}>
                      📞 {callLabel(vendor)}
                    </a>
                    <a href={`https://wa.me/91${vendor.phone}`} target="_blank" rel="noreferrer" style={{ padding: "6px 12px", borderRadius: "8px", background: "#052e16", color: "#4ade80", fontSize: "11px", textDecoration: "none", fontWeight: "700", border: "1px solid #14532d", display: "flex", alignItems: "center", gap: "4px", fontFamily: "inherit" }}>
                      <WhatsAppIcon /> {t.whatsapp}
                    </a>
                    {isResidential && (
                      <button onClick={() => setEmployed(p => ({ ...p, [vendor.id]: !p[vendor.id] }))} style={{
                        padding: "6px 12px", borderRadius: "8px", border: "none", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                        background: employed[vendor.id] ? "#052e16" : "#1e293b",
                        color: employed[vendor.id] ? "#4ade80" : "#475569",
                        border: employed[vendor.id] ? "1px solid #14532d" : "1px solid #334155",
                      }}>
                        {employed[vendor.id] ? "✓ Employing" : "+ I Employ"}
                      </button>
                    )}
                    {!isResidential && (
                      <button onClick={() => setHired(p => ({ ...p, [vendor.id]: !p[vendor.id] }))} style={{
                        padding: "6px 12px", borderRadius: "8px", border: "none", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                        background: hired[vendor.id] ? "#052e16" : "#1e293b",
                        color: hired[vendor.id] ? "#4ade80" : "#475569",
                        border: hired[vendor.id] ? "1px solid #14532d" : "1px solid #334155",
                      }}>
                        {hired[vendor.id] ? "✓ Hired" : "+ I Hired This"}
                      </button>
                    )}
                    <button onClick={() => {}} style={{ padding: "6px 10px", borderRadius: "8px", background: "transparent", color: "#334155", fontSize: "11px", fontWeight: "600", cursor: "pointer", border: "1px solid #1e293b", display: "flex", alignItems: "center", gap: "3px", fontFamily: "inherit" }}>
                      <ShareIcon /> {t.share}
                    </button>
                  </div>

                  {/* Expand toggle */}
                  <button onClick={() => setExpanded(isExpanded ? null : vendor.id)} style={{ marginTop: "8px", background: "none", border: "none", color: "#334155", fontSize: "10px", cursor: "pointer", padding: "0", fontFamily: "inherit" }}>
                    {isExpanded ? `▲ ${t.hideReviews}` : `▼ ${t.showReviews} (${vendor.reviewList.length}) · ${t.profileSummary}`}
                  </button>
                </div>

                {/* Expanded section */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid #1e293b", padding: "12px" }}>

                    {/* Profile Summary */}
                    <div style={{ background: "#080d14", borderRadius: "10px", padding: "10px 12px", marginBottom: "10px", border: "1px solid #1e293b" }}>
                      <div style={{ fontSize: "9px", color: "#ff5b1f", fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>⚡ {t.profileSummary} — AI Generated from {vendor.reviews} reviews</div>
                      <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8", lineHeight: 1.6, fontStyle: "italic" }}>{vendor.summary}</p>
                    </div>

                    {/* Reviews */}
                    {vendor.reviewList.map((r, idx) => (
                      <div key={idx} style={{ background: "#080d14", borderRadius: "8px", padding: "8px 10px", marginBottom: "6px", border: "1px solid #1e293b" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <span style={{ fontSize: "9px", color: "#334155" }}>{r.display}</span>
                          <RatingStars rating={r.stars} />
                        </div>
                        <p style={{ margin: "0 0 6px", fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>{r.text}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "9px", color: "#1e293b" }}>👍 {r.helpful} found helpful</span>
                          <button onClick={() => setNotHelpful(p => ({ ...p, [`${vendor.id}-${idx}`]: true }))} style={{
                            background: "none", border: "none", fontSize: "9px", cursor: "pointer", fontFamily: "inherit",
                            color: notHelpful[`${vendor.id}-${idx}`] ? "#ef4444" : "#334155",
                          }}>
                            {notHelpful[`${vendor.id}-${idx}`] ? "✓ Flagged" : t.notHelpful}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* No results */}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</div>
            <div style={{ fontSize: "14px", color: "#475569", marginBottom: "8px" }}>No providers found</div>
            <div style={{ fontSize: "12px", color: "#334155" }}>Know someone good? <button onClick={() => setShowForm(true)} style={{ background: "none", border: "none", color: "#ff5b1f", cursor: "pointer", fontSize: "12px", fontWeight: "700", fontFamily: "inherit" }}>Add them →</button></div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "28px", paddingBottom: "24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "14px", height: "14px", borderRadius: "4px", background: "linear-gradient(135deg, #ff5b1f, #ff8c00)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px" }}>⚡</div>
            <span style={{ fontSize: "10px", color: "#1e293b" }}>{t.footer}</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { display: none; }
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #334155; }
      `}</style>
    </div>
  );
}
