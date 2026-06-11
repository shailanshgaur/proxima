import { useState } from "react";

const vendors = [
  { id: 1, name: "Ramesh Kumar", category: "Plumber", phone: "9810000001", rating: 4.7, reviews: 12, tags: ["Reliable", "On-time"], verified: true, society: "Lotus Zing Only", radius: "2 km" },
  { id: 2, name: "Suresh Electricals", category: "Electrician", phone: "9911000002", rating: 4.2, reviews: 8, tags: ["Affordable"], verified: true, society: "Lotus Zing + Nearby", radius: "5 km" },
  { id: 3, name: "Anita Didi", category: "Cook", phone: "9876500003", rating: 4.9, reviews: 21, tags: ["Excellent", "Hygienic", "Punctual"], verified: true, society: "Lotus Zing Only", radius: "1 km" },
  { id: 4, name: "Mohan Carpentry", category: "Carpenter", phone: "9700100004", rating: 3.8, reviews: 5, tags: ["Good Work"], verified: false, society: "Lotus Zing + Nearby", radius: "8 km" },
  { id: 5, name: "Priya Maid Services", category: "Housekeeping", phone: "9123400005", rating: 4.5, reviews: 17, tags: ["Trustworthy", "Thorough"], verified: true, society: "Lotus Zing Only", radius: "2 km" },
  { id: 6, name: "Deepak Painting", category: "Painter", phone: "9345600006", rating: 4.1, reviews: 6, tags: ["Neat Work"], verified: false, society: "Lotus Zing + Nearby", radius: "10 km" },
  { id: 7, name: "Vijay AC Repair", category: "AC Technician", phone: "9678900007", rating: 4.6, reviews: 14, tags: ["Expert", "Affordable"], verified: true, society: "Lotus Zing + Nearby", radius: "5 km" },
  { id: 8, name: "Sunita Cook", category: "Cook", phone: "9222200008", rating: 4.3, reviews: 9, tags: ["Variety"], verified: false, society: "Lotus Zing Only", radius: "1 km" },
];

const categories = ["All", "Plumber", "Electrician", "Cook", "Carpenter", "Housekeeping", "Painter", "AC Technician"];

const categoryEmoji = {
  "Plumber": "🔧", "Electrician": "⚡", "Cook": "🍳",
  "Carpenter": "🪚", "Housekeeping": "🧹", "Painter": "🎨",
  "AC Technician": "❄️", "All": "✦"
};

const translations = {
  en: {
    subtitle: "Lotus Zing · Sector 168",
    title: "Vendor Directory",
    tagline: "Trusted helpers, reviewed by your neighbours",
    searchPlaceholder: "Search vendors...",
    topRated: "Top Rated",
    mostReviewed: "Most Reviewed",
    vendorsFound: (n) => `${n} vendor${n !== 1 ? "s" : ""} found`,
    addRate: "+ Add / Rate Vendor",
    close: "✕ Close",
    formTitle: "Add a Vendor or Submit a Review",
    vendorName: "Vendor Name",
    phoneNumber: "Phone Number",
    selectCategory: "Select Category",
    reviewPlaceholder: "Your review (optional)...",
    submit: "Submit →",
    call: "📞 Call",
    whatsapp: "WhatsApp",
    reviews: "reviews",
    withinRadius: (r) => `Within ${r}`,
    top: "TOP",
    lotusZingOnly: "Lotus Zing Only",
    lotusZingNearby: "Lotus Zing + Nearby",
    footer: "LOTUS ZING RESIDENT DIRECTORY · SECTOR 168",
    categoryLabels: {
      "All": "All", "Plumber": "Plumber", "Electrician": "Electrician",
      "Cook": "Cook", "Carpenter": "Carpenter", "Housekeeping": "Housekeeping",
      "Painter": "Painter", "AC Technician": "AC Technician"
    },
    tagLabels: {
      "Reliable": "Reliable", "On-time": "On-time", "Affordable": "Affordable",
      "Excellent": "Excellent", "Hygienic": "Hygienic", "Punctual": "Punctual",
      "Good Work": "Good Work", "Trustworthy": "Trustworthy", "Thorough": "Thorough",
      "Neat Work": "Neat Work", "Expert": "Expert", "Variety": "Variety"
    }
  },
  hi: {
    subtitle: "लोटस ज़िंग · सेक्टर 168",
    title: "विक्रेता डायरेक्टरी",
    tagline: "भरोसेमंद सहायक, पड़ोसियों द्वारा समीक्षित",
    searchPlaceholder: "विक्रेता खोजें...",
    topRated: "सर्वश्रेष्ठ रेटिंग",
    mostReviewed: "सर्वाधिक समीक्षित",
    vendorsFound: (n) => `${n} विक्रेता मिले`,
    addRate: "+ विक्रेता जोड़ें / रेट करें",
    close: "✕ बंद करें",
    formTitle: "विक्रेता जोड़ें या समीक्षा दें",
    vendorName: "विक्रेता का नाम",
    phoneNumber: "फोन नंबर",
    selectCategory: "श्रेणी चुनें",
    reviewPlaceholder: "आपकी समीक्षा (वैकल्पिक)...",
    submit: "जमा करें →",
    call: "📞 कॉल करें",
    whatsapp: "WhatsApp",
    reviews: "समीक्षाएं",
    withinRadius: (r) => `${r} के भीतर`,
    top: "शीर्ष",
    lotusZingOnly: "केवल लोटस ज़िंग",
    lotusZingNearby: "लोटस ज़िंग + आसपास",
    footer: "लोटस ज़िंग निवासी डायरेक्टरी · सेक्टर 168",
    categoryLabels: {
      "All": "सभी", "Plumber": "प्लंबर", "Electrician": "इलेक्ट्रीशियन",
      "Cook": "रसोइया", "Carpenter": "बढ़ई", "Housekeeping": "सफाई",
      "Painter": "पेंटर", "AC Technician": "AC तकनीशियन"
    },
    tagLabels: {
      "Reliable": "भरोसेमंद", "On-time": "समय पर", "Affordable": "किफायती",
      "Excellent": "उत्कृष्ट", "Hygienic": "स्वच्छ", "Punctual": "समयनिष्ठ",
      "Good Work": "अच्छा काम", "Trustworthy": "विश्वसनीय", "Thorough": "कुशल",
      "Neat Work": "साफ काम", "Expert": "विशेषज्ञ", "Variety": "विविधता"
    }
  }
};

const RatingStars = ({ rating }) => (
  <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ fontSize: "11px", color: i <= Math.round(rating) ? "#f59e0b" : "#d1d5db" }}>★</span>
    ))}
    <span style={{ fontSize: "12px", fontWeight: "700", color: "#1a1a1a", marginLeft: "4px" }}>{rating}</span>
  </div>
);

export default function VendorDirectory() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [lang, setLang] = useState("en");

  const t = translations[lang];

  const filtered = vendors
    .filter(v => activeCategory === "All" || v.category === activeCategory)
    .filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === "rating" ? b.rating - a.rating : b.reviews - a.reviews);

  return (
    <div style={{ fontFamily: lang === "hi" ? "'Noto Sans Devanagari', Georgia, serif" : "'Georgia', serif", minHeight: "100vh", background: "#f5f0eb" }}>

      {/* Header */}
      <div style={{ background: "#1a1a1a", padding: "28px 24px 22px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,91,31,0.15)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontSize: "20px" }}>🏡</span>
                <span style={{ color: "#ff5b1f", fontSize: "11px", fontFamily: "monospace", letterSpacing: "2px", textTransform: "uppercase" }}>{t.subtitle}</span>
              </div>
              <h1 style={{ color: "#fff", fontSize: "26px", fontWeight: "normal", margin: "0 0 4px", letterSpacing: "-0.5px" }}>{t.title}</h1>
              <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{t.tagline}</p>
            </div>
            {/* Language Toggle */}
            <div style={{ display: "flex", background: "#2a2a2a", borderRadius: "20px", padding: "3px", gap: "2px", flexShrink: 0 }}>
              {["en", "hi"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  padding: "5px 12px", borderRadius: "16px", border: "none",
                  background: lang === l ? "#ff5b1f" : "transparent",
                  color: lang === l ? "#fff" : "#888",
                  fontSize: "12px", fontWeight: "700", cursor: "pointer",
                  transition: "all 0.15s",
                }}>
                  {l === "en" ? "EN" : "हि"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 16px", maxWidth: "640px", margin: "0 auto" }}>

        {/* Search + Sort */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
          <input
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e0d8d0", background: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none" }}
          />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #e0d8d0", background: "#fff", fontSize: "13px", fontFamily: "inherit", color: "#555", outline: "none", cursor: "pointer" }}>
            <option value="rating">{t.topRated}</option>
            <option value="reviews">{t.mostReviewed}</option>
          </select>
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", marginBottom: "20px", scrollbarWidth: "none" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: "7px 14px", borderRadius: "20px",
              border: activeCategory === cat ? "none" : "1.5px solid #ddd",
              background: activeCategory === cat ? "#ff5b1f" : "#fff",
              color: activeCategory === cat ? "#fff" : "#555",
              fontSize: "13px", fontFamily: "inherit", whiteSpace: "nowrap",
              cursor: "pointer", fontWeight: activeCategory === cat ? "700" : "normal", transition: "all 0.15s",
            }}>
              {categoryEmoji[cat]} {t.categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Results count + Add button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <span style={{ fontSize: "13px", color: "#888" }}>{t.vendorsFound(filtered.length)}</span>
          <button onClick={() => setShowForm(!showForm)} style={{
            padding: "8px 16px", borderRadius: "20px", border: "none",
            background: "#1a1a1a", color: "#fff", fontSize: "12px",
            fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
          }}>
            {showForm ? t.close : t.addRate}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "20px", border: "1.5px solid #e0d8d0", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "normal", color: "#1a1a1a" }}>{t.formTitle}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[t.vendorName, t.phoneNumber].map(label => (
                <input key={label} placeholder={label} style={{ padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #e0d8d0", fontSize: "14px", fontFamily: "inherit", outline: "none", background: "#faf8f6" }} />
              ))}
              <select style={{ padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #e0d8d0", fontSize: "14px", fontFamily: "inherit", color: "#555", background: "#faf8f6", outline: "none" }}>
                <option>{t.selectCategory}</option>
                {categories.slice(1).map(c => <option key={c}>{t.categoryLabels[c]}</option>)}
              </select>
              <div style={{ display: "flex", gap: "8px" }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1.5px solid #e0d8d0", background: "#faf8f6", fontSize: "18px", cursor: "pointer" }}>{"★".repeat(n)}</button>
                ))}
              </div>
              <textarea placeholder={t.reviewPlaceholder} rows={2} style={{ padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #e0d8d0", fontSize: "14px", fontFamily: "inherit", resize: "vertical", background: "#faf8f6", outline: "none" }} />
              <button style={{ padding: "12px", borderRadius: "10px", border: "none", background: "#ff5b1f", color: "#fff", fontSize: "14px", fontFamily: "inherit", fontWeight: "700", cursor: "pointer" }}>
                {t.submit}
              </button>
            </div>
          </div>
        )}

        {/* Vendor Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((vendor, i) => (
            <div key={vendor.id} style={{
              background: "#fff", borderRadius: "16px", padding: "16px 18px",
              border: "1.5px solid #e8e0d8", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              position: "relative", overflow: "hidden",
              animation: "fadeUp 0.3s ease both", animationDelay: `${i * 0.05}s`,
            }}>
              {/* Rank badge */}
              {i < 3 && (
                <div style={{ position: "absolute", top: "10px", right: "12px", fontSize: "10px", fontFamily: "monospace", color: "#ff5b1f", letterSpacing: "1px" }}>
                  #{i+1} {i === 0 ? t.top : ""}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                {/* Avatar */}
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f5f0eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0, border: "1.5px solid #e0d8d0" }}>
                  {categoryEmoji[vendor.category]}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "700", color: "#1a1a1a" }}>{vendor.name}</span>
                    {vendor.verified && <span style={{ fontSize: "11px", color: "#22c55e" }}>✓</span>}
                  </div>
                  <div style={{ fontSize: "12px", color: "#888", marginBottom: "6px" }}>{t.categoryLabels[vendor.category]}</div>
                  <RatingStars rating={vendor.rating} />
                  <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}>{vendor.reviews} {t.reviews}</div>

                  {/* Society + Radius */}
                  <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                    <span style={{
                      padding: "3px 8px", borderRadius: "6px",
                      background: vendor.society === "Lotus Zing Only" ? "#fff7ed" : "#f0fdf4",
                      color: vendor.society === "Lotus Zing Only" ? "#c2410c" : "#15803d",
                      fontSize: "10px", fontWeight: "700",
                      border: vendor.society === "Lotus Zing Only" ? "1px solid #fed7aa" : "1px solid #bbf7d0",
                    }}>
                      📍 {vendor.society === "Lotus Zing Only" ? t.lotusZingOnly : t.lotusZingNearby}
                    </span>
                    <span style={{ padding: "3px 8px", borderRadius: "6px", background: "#f8fafc", color: "#64748b", fontSize: "10px", fontWeight: "600", border: "1px solid #e2e8f0" }}>
                      🔵 {t.withinRadius(vendor.radius)}
                    </span>
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", gap: "4px", marginTop: "6px", flexWrap: "wrap" }}>
                    {vendor.tags.map(tag => (
                      <span key={tag} style={{ padding: "2px 8px", borderRadius: "10px", background: "#f5f0eb", color: "#888", fontSize: "10px" }}>
                        {t.tagLabels[tag] || tag}
                      </span>
                    ))}
                  </div>

                  {/* Call + WhatsApp buttons */}
                  <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                    <a href={`tel:${vendor.phone}`} style={{
                      padding: "8px 16px", borderRadius: "10px",
                      background: "#f5f0eb", color: "#1a1a1a",
                      fontSize: "12px", fontFamily: "inherit",
                      textDecoration: "none", fontWeight: "700",
                      border: "1.5px solid #e0d8d0", display: "inline-flex", alignItems: "center", gap: "4px",
                    }}>
                      {t.call}
                    </a>
                    <a href={`https://wa.me/91${vendor.phone}`} target="_blank" rel="noreferrer" style={{
                      padding: "8px 16px", borderRadius: "10px",
                      background: "#dcfce7", color: "#15803d",
                      fontSize: "12px", fontFamily: "inherit",
                      textDecoration: "none", fontWeight: "700",
                      border: "1.5px solid #bbf7d0", display: "inline-flex", alignItems: "center", gap: "6px",
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#15803d">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      {t.whatsapp}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "32px", paddingBottom: "20px" }}>
          <p style={{ fontSize: "11px", color: "#bbb", letterSpacing: "1px", fontFamily: "monospace" }}>{t.footer}</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
