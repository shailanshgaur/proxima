import { useState } from "react";

const vendors = [
  { id:1, vendorId:"ZC-0001", name:"Anita Didi", category:"Cook", tier:"residential", phone:"9876500003", rating:4.9, reviewCount:21, households:7, veteran:true, verified:true, radius:"1 km", availability:"Mornings · 7–10am", capacity:"full", emoji:"🍳",
    tags:["South Indian","Pure Veg","North Indian","Punctual","Hygienic","Kids Friendly"],
    summary:"Anita has been in Lotus Zing for 14 months, currently employed by 7 households. Known for South Indian and North Indian cooking, clean kitchen habits, and consistent punctuality.",
    reviews:[{text:"Amazing sambar and rasam, very hygienic kitchen habits.",by:"Tower B · Verified",stars:5},{text:"Punctual and trustworthy, been with us 8 months.",by:"Tower A · Verified",stars:5}]},
  { id:2, vendorId:"ZC-0002", name:"Priya Services", category:"Housekeeping", tier:"residential", phone:"9123400005", rating:4.5, reviewCount:17, households:11, veteran:true, verified:true, radius:"2 km", availability:"Morning & Evening", capacity:"possibly-full", emoji:"🧹",
    tags:["Sweeping & Mopping","Utensils","Never Misses","Trustworthy","Pets Friendly"],
    summary:"Priya serves 11 households — the most in the society. Known for reliability, she always sends a substitute when unavailable. Currently possibly at capacity.",
    reviews:[{text:"Never lets us down, been with us over a year.",by:"Tower C · Verified",stars:5},{text:"Works without supervision, very thorough.",by:"Tower B · Verified",stars:4}]},
  { id:3, vendorId:"ZC-0003", name:"Sunita Cook", category:"Cook", tier:"residential", phone:"9222200008", rating:4.3, reviewCount:9, households:3, veteran:false, verified:true, radius:"1 km", availability:"Flexible timing", capacity:"available", emoji:"🍳",
    tags:["North Indian","Non-Veg","Flexible Timing","Variety"],
    summary:"Sunita recently joined and is employed by 3 households. Specialises in North Indian and non-vegetarian cooking with flexible timing.",
    reviews:[{text:"Good variety of dishes, flexible with timing.",by:"Tower D · Verified",stars:4}]},
  { id:4, vendorId:"ZC-0004", name:"Ramesh Kumar", category:"Plumber", tier:"oncall", phone:"9810000001", rating:4.7, reviewCount:12, hired:8, veteran:false, verified:true, radius:"2 km", availability:"Same day available", capacity:"available", emoji:"🔧",
    tags:["Leakage Fix","Bathroom Fitting","Punctual","Transparent Pricing","Same Day"],
    summary:"8 verified hires, 4.7 rating. Consistently praised for punctuality and fair pricing. Available same day for urgent calls.",
    reviews:[{text:"Fixed bathroom leakage in 2 hours, charged fairly.",by:"Sector 168 · Verified",stars:5},{text:"Reliable, brings own tools, very clean work.",by:"Sector 168 · Verified",stars:4}]},
  { id:5, vendorId:"ZC-0005", name:"Vijay AC Repair", category:"AC Technician", tier:"oncall", phone:"9678900007", rating:4.6, reviewCount:14, hired:9, veteran:false, verified:true, radius:"5 km", availability:"Weekdays + Weekends", capacity:"available", emoji:"❄️",
    tags:["Gas Refill R32","Deep Service","Voltas","Expert","Affordable"],
    summary:"9 verified hires. Multi-brand expertise. Residents trust him most for gas refills and deep servicing.",
    reviews:[{text:"Serviced 3 ACs in one visit, very efficient.",by:"Sector 168 · Verified",stars:5}]},
  { id:6, vendorId:"ZC-0006", name:"Suresh Electricals", category:"Electrician", tier:"oncall", phone:"9911000002", rating:4.2, reviewCount:8, hired:5, veteran:false, verified:true, radius:"5 km", availability:"Mon–Sat", capacity:"available", emoji:"⚡",
    tags:["Wiring","Fan Installation","MCB Issues","Affordable"],
    summary:"Handles general electrical work. Known for affordable rates. Available Monday to Saturday.",
    reviews:[{text:"Fixed the fan wiring issue quickly, affordable.",by:"Sector 168 · Verified",stars:4}]},
];

const categories = ["All","Cook","Housekeeping","Plumber","Electrician","AC Technician","Carpenter","Painter","Driver","Nanny"];

const capacityMeta = {
  available: { label:"🟢 Likely available", color:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0" },
  "possibly-full": { label:"🟡 Possibly full", color:"#d97706", bg:"#fffbeb", border:"#fde68a" },
  full: { label:"🔴 Likely full", color:"#dc2626", bg:"#fef2f2", border:"#fecaca" },
};

const tierMeta = {
  residential: { label:"Residential", color:"#15803d", bg:"#f0fdf4", border:"#bbf7d0", dot:"#22c55e" },
  oncall: { label:"On-Call", color:"#1d4ed8", bg:"#eff6ff", border:"#bfdbfe", dot:"#3b82f6" },
};

const WA = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>;

const Stars = ({ n }) => <span style={{letterSpacing:"-1px",fontSize:"11px"}}>{[1,2,3,4,5].map(i=><span key={i} style={{color:i<=n?"#f59e0b":"#d1d5db"}}>★</span>)}</span>;

export default function App() {
  const [cat, setCat] = useState("All");
  const [tier, setTier] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);
  const [lang, setLang] = useState("en");
  const [hired, setHired] = useState({});
  const [notHelpful, setNotHelpful] = useState({});
  const [showAdd, setShowAdd] = useState(false);

  const list = vendors
    .filter(v => tier==="all" || v.tier===tier)
    .filter(v => cat==="All" || v.category===cat)
    .filter(v => !q || v.name.toLowerCase().includes(q.toLowerCase()) || v.vendorId.toLowerCase().includes(q.toLowerCase()) || v.category.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{background:"#faf7f2",minHeight:"100vh",fontFamily:"system-ui,sans-serif"}}>

      {/* Header */}
      <div style={{background:"#1a1008",position:"sticky",top:0,zIndex:50}}>

        {/* Logo row */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px 10px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{width:"34px",height:"34px",borderRadius:"10px",background:"linear-gradient(135deg,#ff5b1f,#ffab00)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"17px"}}>⚡</div>
            <div>
              <div style={{color:"#fff",fontSize:"17px",fontWeight:"900",letterSpacing:"-0.8px",lineHeight:1}}>Zing Connect</div>
              <div style={{color:"#6b5a3e",fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",marginTop:"1px"}}>Lotus Zing · Sector 168</div>
            </div>
          </div>
          <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
            <div style={{fontSize:"10px",color:"#6b5a3e",display:"flex",alignItems:"center",gap:"4px"}}>
              <span style={{width:"6px",height:"6px",borderRadius:"50%",background:"#22c55e",display:"inline-block",boxShadow:"0 0 5px #22c55e"}}/>
              62 vendors
            </div>
            <div style={{display:"flex",background:"#2a1e0f",borderRadius:"20px",padding:"2px",border:"1px solid #3d2e1a"}}>
              {["EN","हि"].map((l,i)=>(
                <button key={l} onClick={()=>setLang(i===0?"en":"hi")} style={{padding:"4px 11px",borderRadius:"16px",border:"none",background:(lang==="en"&&i===0)||(lang==="hi"&&i===1)?"#ff5b1f":"transparent",color:(lang==="en"&&i===0)||(lang==="hi"&&i===1)?"#fff":"#6b5a3e",fontSize:"11px",fontWeight:"800",cursor:"pointer",transition:"all .15s"}}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{padding:"0 18px 12px"}}>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",fontSize:"13px",color:"#6b5a3e"}}>🔍</span>
            <input
              placeholder={lang==="hi"?"नाम या सेवा खोजें...":"Search by name, service or ID..."}
              value={q} onChange={e=>setQ(e.target.value)}
              style={{width:"100%",padding:"10px 14px 10px 34px",borderRadius:"12px",border:"none",background:"#2a1e0f",fontSize:"13px",color:"#fff",outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}
            />
          </div>
        </div>
      </div>

      {/* Tier + Category strip */}
      <div style={{background:"#fff",borderBottom:"1px solid #f0ebe3",position:"sticky",top:"118px",zIndex:40}}>
        {/* Tier */}
        <div style={{display:"flex",gap:"0",borderBottom:"1px solid #f0ebe3"}}>
          {[["all","All"],["residential","🏠 Residential"],["oncall","🔧 On-Call"]].map(([v,l])=>(
            <button key={v} onClick={()=>setTier(v)} style={{
              flex:1,padding:"9px 4px",border:"none",background:"transparent",cursor:"pointer",fontSize:"11px",fontWeight:"700",transition:"all .15s",fontFamily:"inherit",
              color:tier===v?"#ff5b1f":"#b0a090",
              borderBottom:tier===v?"2px solid #ff5b1f":"2px solid transparent",
            }}>{l}</button>
          ))}
        </div>
        {/* Categories */}
        <div style={{display:"flex",gap:"6px",overflowX:"auto",padding:"10px 14px",scrollbarWidth:"none"}}>
          {categories.map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={{
              padding:"5px 13px",borderRadius:"20px",border:cat===c?"none":"1px solid #e8e0d5",
              background:cat===c?"#1a1008":"transparent",
              color:cat===c?"#ff5b1f":"#b0a090",
              fontSize:"11px",whiteSpace:"nowrap",cursor:"pointer",fontWeight:cat===c?"700":"400",transition:"all .15s",fontFamily:"inherit",
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{maxWidth:"640px",margin:"0 auto",padding:"14px 14px 80px"}}>

        {/* Stats bar */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
          <span style={{fontSize:"11px",color:"#b0a090"}}>{list.length} provider{list.length!==1?"s":""}</span>
          <button onClick={()=>setShowAdd(!showAdd)} style={{padding:"6px 14px",borderRadius:"20px",background:showAdd?"#1a1008":"transparent",border:"1px solid #1a1008",color:showAdd?"#ff5b1f":"#1a1008",fontSize:"11px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
            {showAdd?"✕ Close":"+ Add vendor"}
          </button>
        </div>

        {/* Add form */}
        {showAdd && (
          <div style={{background:"#fff",borderRadius:"16px",padding:"18px",marginBottom:"14px",border:"1px solid #f0ebe3",boxShadow:"0 2px 16px #0000000a"}}>
            <div style={{fontSize:"14px",fontWeight:"700",color:"#1a1008",marginBottom:"12px"}}>Add a provider or rate one</div>
            <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
              {["Vendor name","Phone number","Your flat number (e.g. B-304)"].map(p=>(
                <input key={p} placeholder={p} style={{padding:"10px 12px",borderRadius:"10px",border:"1px solid #e8e0d5",fontSize:"13px",outline:"none",fontFamily:"inherit",color:"#1a1008",background:"#faf7f2"}}/>
              ))}
              <select style={{padding:"10px 12px",borderRadius:"10px",border:"1px solid #e8e0d5",fontSize:"13px",color:"#b0a090",background:"#faf7f2",outline:"none",fontFamily:"inherit"}}>
                <option>Select service type</option>
                {categories.slice(1).map(c=><option key={c}>{c}</option>)}
              </select>
              <div style={{display:"flex",gap:"5px"}}>
                {[1,2,3,4,5].map(n=><button key={n} style={{flex:1,padding:"9px",borderRadius:"8px",border:"1px solid #e8e0d5",background:"#faf7f2",fontSize:"16px",cursor:"pointer"}}>{"★".repeat(n)}</button>)}
              </div>
              <textarea placeholder="Your experience (optional)..." rows={2} style={{padding:"10px 12px",borderRadius:"10px",border:"1px solid #e8e0d5",fontSize:"13px",resize:"vertical",background:"#faf7f2",outline:"none",fontFamily:"inherit"}}/>
              <div style={{fontSize:"10px",color:"#b0a090",padding:"8px 10px",background:"#f0fdf4",borderRadius:"8px",border:"1px solid #bbf7d0"}}>🔒 Your flat number is used for verification only and will never be shown publicly.</div>
              <button style={{padding:"11px",borderRadius:"10px",border:"none",background:"#1a1008",color:"#ff5b1f",fontSize:"13px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit"}}>Submit →</button>
            </div>
          </div>
        )}

        {/* Cards */}
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {list.map((v,i)=>{
            const cap = capacityMeta[v.capacity] || capacityMeta.available;
            const tm = tierMeta[v.tier];
            const isOpen = open===v.id;
            const isRes = v.tier==="residential";
            const isHired = hired[v.id];

            return (
              <div key={v.id} style={{
                background:"#fff",
                borderRadius:"18px",
                overflow:"hidden",
                boxShadow:"0 1px 4px #00000008, 0 4px 20px #00000005",
                border:"1px solid #f0ebe3",
                animation:`up .35s ease both`,
                animationDelay:`${i*.05}s`,
                transition:"box-shadow .2s",
              }}>
                {/* Capacity color strip at top */}
                <div style={{height:"3px",background:cap.color,opacity:.7}}/>

                <div style={{padding:"14px 16px 12px"}}>
                  {/* Row 1: Avatar + Name + Tier + Medal */}
                  <div style={{display:"flex",gap:"12px",alignItems:"flex-start"}}>

                    {/* Big avatar */}
                    <div style={{
                      width:"52px",height:"52px",borderRadius:"16px",
                      background:`linear-gradient(135deg,${tm.bg},#fff)`,
                      border:`1.5px solid ${tm.border}`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:"24px",flexShrink:0,
                    }}>{v.emoji}</div>

                    <div style={{flex:1,minWidth:0}}>
                      {/* Name + verified + medal */}
                      <div style={{display:"flex",alignItems:"center",gap:"5px",flexWrap:"wrap"}}>
                        <span style={{fontSize:"15px",fontWeight:"800",color:"#1a1008",letterSpacing:"-0.3px"}}>{v.name}</span>
                        {v.verified && <span style={{fontSize:"9px",color:"#16a34a",background:"#f0fdf4",border:"1px solid #bbf7d0",padding:"1px 5px",borderRadius:"4px",fontWeight:"800"}}>✓ Verified</span>}
                        {i<3 && <span style={{fontSize:"14px"}}>{["🥇","🥈","🥉"][i]}</span>}
                        {v.veteran && <span style={{fontSize:"9px",color:"#d97706",background:"#fffbeb",border:"1px solid #fde68a",padding:"1px 5px",borderRadius:"4px",fontWeight:"800"}}>⭐ Veteran</span>}
                        {!v.veteran && v.reviewCount<5 && <span style={{fontSize:"9px",color:"#ff5b1f",background:"#fff7f4",border:"1px solid #ffd5c8",padding:"1px 5px",borderRadius:"4px",fontWeight:"800"}}>✨ New</span>}
                      </div>

                      {/* Category + Tier pill */}
                      <div style={{display:"flex",alignItems:"center",gap:"6px",marginTop:"3px"}}>
                        <span style={{fontSize:"11px",color:"#b0a090"}}>{v.category}</span>
                        <span style={{width:"3px",height:"3px",borderRadius:"50%",background:"#e8e0d5",display:"inline-block"}}/>
                        <span style={{fontSize:"9px",fontWeight:"700",color:tm.color,background:tm.bg,border:`1px solid ${tm.border}`,padding:"1px 6px",borderRadius:"4px"}}>{tm.label}</span>
                        <span style={{width:"3px",height:"3px",borderRadius:"50%",background:"#e8e0d5",display:"inline-block"}}/>
                        <span style={{fontSize:"9px",color:"#b0a090",fontFamily:"monospace"}}>{v.vendorId}</span>
                      </div>

                      {/* Key trust signal */}
                      <div style={{marginTop:"5px"}}>
                        {isRes ? (
                          <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                            <span style={{fontSize:"13px",fontWeight:"800",color:"#16a34a"}}>{v.households}</span>
                            <span style={{fontSize:"11px",color:"#b0a090"}}>households currently employing</span>
                          </div>
                        ) : (
                          <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                            <Stars n={v.rating}/>
                            <span style={{fontSize:"12px",fontWeight:"800",color:"#1a1008"}}>{v.rating}</span>
                            <span style={{fontSize:"11px",color:"#b0a090"}}>· {v.reviewCount} reviews · {v.hired} hires</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Availability + Capacity */}
                  <div style={{display:"flex",alignItems:"center",gap:"8px",marginTop:"10px",padding:"8px 10px",background:"#faf7f2",borderRadius:"10px"}}>
                    <span style={{fontSize:"10px",color:cap.color,fontWeight:"700",flex:1}}>{cap.label}</span>
                    <span style={{width:"1px",height:"12px",background:"#e8e0d5"}}/>
                    <span style={{fontSize:"10px",color:"#b0a090"}}>🕐 {v.availability}</span>
                    <span style={{width:"1px",height:"12px",background:"#e8e0d5"}}/>
                    <span style={{fontSize:"10px",color:"#b0a090"}}>📍 {v.radius}</span>
                  </div>

                  {/* Row 3: Top tags (3 max) */}
                  <div style={{display:"flex",gap:"5px",marginTop:"8px",flexWrap:"wrap"}}>
                    {v.tags.slice(0,4).map(tag=>(
                      <span key={tag} style={{padding:"3px 9px",borderRadius:"20px",background:"#faf7f2",color:"#7a6a55",fontSize:"10px",border:"1px solid #e8e0d5"}}>{tag}</span>
                    ))}
                    {v.tags.length>4 && <span style={{padding:"3px 9px",borderRadius:"20px",background:"#faf7f2",color:"#c0b0a0",fontSize:"10px",border:"1px solid #e8e0d5"}}>+{v.tags.length-4}</span>}
                  </div>

                  {/* Row 4: Action buttons */}
                  <div style={{display:"flex",gap:"8px",marginTop:"10px",alignItems:"center"}}>
                    <a href={`tel:${v.phone}`} style={{
                      flex:1,padding:"9px 0",borderRadius:"10px",background:"#1a1008",color:"#fff",
                      fontSize:"12px",fontFamily:"inherit",textDecoration:"none",fontWeight:"700",
                      display:"flex",alignItems:"center",justifyContent:"center",gap:"4px",
                    }}>
                      📞 {v.capacity==="available"?"Call":"Call to Check"}
                    </a>
                    <a href={`https://wa.me/91${v.phone}`} target="_blank" rel="noreferrer" style={{
                      flex:1,padding:"9px 0",borderRadius:"10px",background:"#f0fdf4",color:"#16a34a",
                      fontSize:"12px",fontFamily:"inherit",textDecoration:"none",fontWeight:"700",
                      border:"1px solid #bbf7d0",display:"flex",alignItems:"center",justifyContent:"center",gap:"5px",
                    }}>
                      <WA/> WhatsApp
                    </a>
                    <button onClick={()=>setHired(p=>({...p,[v.id]:!p[v.id]}))} style={{
                      padding:"9px 12px",borderRadius:"10px",border:"1px solid #e8e0d5",
                      background:isHired?"#faf7f2":"transparent",
                      color:isHired?"#ff5b1f":"#b0a090",
                      fontSize:"11px",fontWeight:"700",cursor:"pointer",fontFamily:"inherit",transition:"all .15s",
                    }}>
                      {isHired?"✓ Hired":"+ Hire"}
                    </button>
                  </div>

                  {/* Expand toggle */}
                  <button onClick={()=>setOpen(isOpen?null:v.id)} style={{
                    width:"100%",marginTop:"8px",padding:"6px",borderRadius:"8px",
                    background:"transparent",border:"1px solid #f0ebe3",
                    color:"#c0b0a0",fontSize:"10px",cursor:"pointer",fontFamily:"inherit",
                    display:"flex",alignItems:"center",justifyContent:"center",gap:"4px",
                  }}>
                    {isOpen ? "▲ Hide profile & reviews" : `▼ Profile summary · ${v.reviews.length} review${v.reviews.length!==1?"s":""}`}
                  </button>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div style={{borderTop:"1px solid #f0ebe3",padding:"14px 16px"}}>

                    {/* Summary */}
                    <div style={{marginBottom:"12px"}}>
                      <div style={{fontSize:"9px",color:"#ff5b1f",fontWeight:"800",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"6px"}}>⚡ AUTO-GENERATED PROFILE SUMMARY</div>
                      <p style={{margin:0,fontSize:"12px",color:"#7a6a55",lineHeight:1.7,fontStyle:"italic",borderLeft:"2px solid #f0ebe3",paddingLeft:"10px"}}>{v.summary}</p>
                    </div>

                    {/* All tags */}
                    <div style={{marginBottom:"12px"}}>
                      <div style={{fontSize:"9px",color:"#b0a090",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"6px"}}>All confirmed tags</div>
                      <div style={{display:"flex",gap:"5px",flexWrap:"wrap"}}>
                        {v.tags.map(tag=>(
                          <span key={tag} style={{padding:"3px 9px",borderRadius:"20px",background:"#faf7f2",color:"#7a6a55",fontSize:"10px",border:"1px solid #e8e0d5"}}>✓ {tag}</span>
                        ))}
                      </div>
                    </div>

                    {/* Reviews */}
                    <div style={{fontSize:"9px",color:"#b0a090",letterSpacing:"1px",textTransform:"uppercase",marginBottom:"8px"}}>Resident reviews</div>
                    {v.reviews.map((r,idx)=>(
                      <div key={idx} style={{background:"#faf7f2",borderRadius:"10px",padding:"10px 12px",marginBottom:"6px",border:"1px solid #f0ebe3"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"5px"}}>
                          <span style={{fontSize:"9px",color:"#b0a090"}}>{r.by}</span>
                          <Stars n={r.stars}/>
                        </div>
                        <p style={{margin:"0 0 6px",fontSize:"12px",color:"#5a4a35",lineHeight:1.5}}>{r.text}</p>
                        <button onClick={()=>setNotHelpful(p=>({...p,[`${v.id}-${idx}`]:true}))} style={{
                          background:"none",border:"none",fontSize:"9px",cursor:"pointer",fontFamily:"inherit",
                          color:notHelpful[`${v.id}-${idx}`]?"#dc2626":"#c0b0a0",padding:0,
                        }}>
                          {notHelpful[`${v.id}-${idx}`]?"✓ Flagged as not helpful":"Flag as not helpful"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {list.length===0 && (
            <div style={{textAlign:"center",padding:"48px 20px",color:"#b0a090"}}>
              <div style={{fontSize:"40px",marginBottom:"12px"}}>🔍</div>
              <div style={{fontSize:"14px",fontWeight:"700",color:"#5a4a35",marginBottom:"6px"}}>No providers found</div>
              <div style={{fontSize:"12px"}}>Know someone good? <button onClick={()=>setShowAdd(true)} style={{background:"none",border:"none",color:"#ff5b1f",cursor:"pointer",fontSize:"12px",fontWeight:"700",fontFamily:"inherit"}}>Add them →</button></div>
            </div>
          )}
        </div>
      </div>

      {/* Floating footer */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(250,247,242,0.92)",backdropFilter:"blur(12px)",borderTop:"1px solid #f0ebe3",padding:"10px 0",textAlign:"center"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:"5px"}}>
          <div style={{width:"14px",height:"14px",borderRadius:"4px",background:"linear-gradient(135deg,#ff5b1f,#ffab00)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8px"}}>⚡</div>
          <span style={{fontSize:"10px",color:"#b0a090",fontWeight:"600"}}>Zing Connect · Lotus Zing</span>
          <span style={{width:"3px",height:"3px",borderRadius:"50%",background:"#d0c8bc",display:"inline-block"}}/>
          <span style={{fontSize:"10px",color:"#c0b0a0"}}>3 browsing now</span>
        </div>
      </div>

      <style>{`
        @keyframes up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        ::-webkit-scrollbar{display:none}
        *{box-sizing:border-box}
        input::placeholder,textarea::placeholder{color:#b0a090}
      `}</style>
    </div>
  );
}
