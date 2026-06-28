# Home — Design Overrides

## Purpose

The resident's primary discovery surface. Shows vendors within the user's society, sortable by distance or rating, with a live search filter. The visual language shifts from "auth screen" (centered card on void) to "content screen" (full-height layout with persistent chrome). Dark surfaces and the blurred sticky header keep the UI ambient while vendor cards carry all the density.

---

## Layout

- Full viewport: `minHeight: 100dvh`, `backgroundColor: #050506`, `paddingBottom: 72px` (clears bottom nav)
- Two fixed chrome layers: sticky header (top) and fixed bottom nav
- Main content: `maxWidth: 560px`, `margin: 0 auto`, `padding: 14px 16px`, `display: flex`, `flexDirection: column`, `gap: 8px`
- `fontFamily: Inter, -apple-system, system-ui, sans-serif` on root element

---

## Key Components

### Sticky header
```
position:         sticky
top:              0
zIndex:           20
backgroundColor:  rgba(5,5,6,0.85)
borderBottom:     1px solid rgba(255,255,255,0.08)
backdropFilter:   blur(20px) saturate(180%)
-webkit-:         blur(20px) saturate(180%)
padding:          14px 16px
```
Content constrained to `maxWidth: 560px`, `margin: 0 auto`.

Header has two rows:
1. Title + sort pills row (`display: flex`, `justifyContent: space-between`, `alignItems: center`, `marginBottom: 12px`)
2. Search bar (full-width)

**Title row — left side:**
- Mini brand mark: `22x22px`, `borderRadius: 6px`, ochre gradient background, person SVG (`11x11` viewport clipped from `18x18` viewBox)
- Label: "Services nearby", `fontSize: 15px`, `fontWeight: 700`, `color: #EDEDEF`, `letterSpacing: -0.02em`

**Sort pills:**
Two buttons: "Nearest" (`distance`) and "Top rated" (`rating`)

Active pill:
```
backgroundColor: rgba(224,123,57,0.10)
border:          1px solid rgba(224,123,57,0.25)
color:           #e07b39
fontWeight:      600
```
Inactive pill:
```
backgroundColor: transparent
border:          1px solid rgba(255,255,255,0.08)
color:           #8A8F98
```
Both: `padding: 4px 12px`, `borderRadius: 9999px`, `fontSize: 12px`, `fontFamily: Inter`, `transition: all 200ms ease`

### Search bar
```
position:         relative
backgroundColor:  #0d0d0f    (elevated — one step above bg)
border:           1px solid rgba(255,255,255,0.08)
borderRadius:     8px
padding:          9px 12px 9px 30px
fontSize:         14px
color:            #EDEDEF
```
Search icon (left-inset, non-interactive):
```
position:         absolute
left:             11px
top:              50%
transform:        translateY(-50%)
pointerEvents:    none
```
Icon SVG `14x14`: circle `cx=6 cy=6 r=4` + path `M9.5 9.5L12 12`, `stroke: #4A4D56`, `strokeWidth: 1.5`

Focus ring: `borderColor: #e07b39`, `boxShadow: 0 0 0 3px rgba(224,123,57,0.20)`
Placeholder: "Search AC repair, plumbing…"

Filtering logic: case-insensitive match on `vendor.name` OR any item in `vendor.categories`

### Vendor card
```
backgroundColor:  rgba(255,255,255,0.04)     (t.surface — not opaque)
border:           1px solid rgba(255,255,255,0.08)
borderRadius:     14px
padding:          16px
transition:       all 200ms cubic-bezier(0.16,1,0.3,1)
```
Hover state:
```
backgroundColor:  rgba(255,255,255,0.07)     (t.surfaceHover)
border:           1px solid rgba(255,255,255,0.16)
transform:        translateY(-1px)
```

**Staggered entry animation:**
```
animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) {idx * 0.06}s both
```
- Each card uses its list index to compute `animationDelay`: card 0 = 0s, card 1 = 0.06s, card 2 = 0.12s, etc.
- Keyframe: `from { opacity: 0; transform: translateY(10px); }` → `to { opacity: 1; transform: translateY(0); }`

**Card internal layout:**

Row 1 — name + rating badge (`display: flex`, `justifyContent: space-between`, `alignItems: flex-start`, `marginBottom: 12px`):
- Vendor name: `fontSize: 16px`, `fontWeight: 700`, `color: #EDEDEF`, `letterSpacing: -0.01em`
- Category: `fontSize: 12px`, `color: #8A8F98`, `fontWeight: 500`

Rating badge:
```
backgroundColor: rgba(224,123,57,0.10)
border:          1px solid rgba(224,123,57,0.25)
padding:         3px 9px
borderRadius:    9999px
display:         flex
alignItems:      center
gap:             5px
```
Star SVG inside (`10x10`): 5-point star path, `fill: #e07b39`
Rating value: `fontSize: 13px`, `fontWeight: 700`, `color: #e07b39`
Review count: `fontSize: 11px`, `color: #4A4D56`

Separator: `height: 1px`, `backgroundColor: rgba(255,255,255,0.08)`, `marginBottom: 12px`

Metadata pills row (`display: flex`, `gap: 6px`, `flexWrap: wrap`, `marginBottom: 12px`):

Three pill types:
1. **Neutral — distance** (`{vendor.distance.toFixed(1)} km`): `backgroundColor: rgba(255,255,255,0.05)`, `border: 1px solid rgba(255,255,255,0.08)`, `color: #8A8F98`
2. **Neutral — response time** (`~{vendor.response_time}`): same as distance pill
3. **Green — jobs nearby** (`{vendor.jobs_this_month} jobs nearby`): only rendered when `vendor.jobs_this_month > 0`
   ```
   backgroundColor: rgba(74,222,128,0.08)
   border:          1px solid rgba(74,222,128,0.18)
   color:           #4ade80
   ```

All pills: `padding: 3px 9px`, `borderRadius: 9999px`, `fontSize: 12px`, `fontWeight: 500`

Review snippet (when present): `fontSize: 13px`, `color: #8A8F98`, `fontStyle: italic`, `lineHeight: 1.55`, quoted with `"` characters, `marginBottom: 14px`

Book CTA: standard `PrimaryBtn` atom at card width (`width: 100%`), label "Book {firstName}" where firstName = `vendor.name.split(' ')[0]`

### Skeleton loading state
Shown while `loading === true`, replaces card list. Three placeholder cards identical in shell to vendor cards, each with three shimmer bars:
```
background: linear-gradient(90deg,
  rgba(255,255,255,0.04) 25%,
  rgba(255,255,255,0.08) 50%,
  rgba(255,255,255,0.04) 75%)
backgroundSize: 800px 100%
animation: shimmer 1.6s infinite linear
```
Shimmer keyframe: `0% { backgroundPosition: -800px 0; }` → `100% { backgroundPosition: 800px 0; }`

### Empty state
Centered, `padding: 60px 0`, `color: #8A8F98`, `fontSize: 14px`
- With search term: `No results for "{search}"`
- Without search term: `No vendors nearby yet.`

### Bottom nav
```
position:         fixed
bottom:           0
left:             0
right:            0
height:           60px
backgroundColor:  rgba(5,5,6,0.92)
borderTop:        1px solid rgba(255,255,255,0.08)
backdropFilter:   blur(20px)
-webkit-:         blur(20px)
display:          flex
alignItems:       center
justifyContent:   space-around
padding:          0 8px
```
Three nav buttons: Home, Bookings, Profile

Each button:
```
display:        flex
flexDirection:  column
alignItems:     center
gap:            3px
fontSize:       11px
minHeight:      44px
justifyContent: center
padding:        4px 24px
```
Active (Home): `color: #e07b39`, `fontWeight: 600`
Inactive: `color: #4A4D56`, `fontWeight: 400`
Hover on inactive: `color: #8A8F98`
Transition: `color 200ms cubic-bezier(0.16,1,0.3,1)`

Nav SVG icons (`18x18`, `stroke: currentColor`, `strokeWidth: 1.5`):
- **Home**: house outline, `d="M2 8l7-6 7 6v8a1 1 0 01-1 1H3a1 1 0 01-1-1V8z"` + door cutout
- **Bookings**: rounded rectangle `2.5,2.5 13x13 rx2` + two horizontal lines
- **Profile**: circle `cx=9 cy=6 r=3` + arc path `M3 16c0-3.314 2.686-6 6-6s6 2.686 6 6`

---

## Deviations from MASTER

| Topic | MASTER default | Home override | Reason |
|---|---|---|---|
| Page background | `#050506` flat | `#050506` — no radial glow | Home is a content surface; glow is reserved for auth/confirmation funnels |
| Surface | Card-on-void | Continuous scroll | Multiple vendors need scannable list, not individual centered cards |
| Header position | Static | `position: sticky` with blur | Persistent access to sort and search without scrolling back up |
| Header bg opacity | N/A | `rgba(5,5,6,0.85)` | Shows content blurring behind header — signals scrollability |
| Sort control | N/A | Pill group (Nearest / Top rated) | Two options map directly to pill toggle, no dropdown needed |
| Search bg | `rgba(255,255,255,0.04)` surface | `#0d0d0f` elevated | Search needs slightly more contrast against the sticky header bg |
| Bottom nav | N/A | Fixed, blurred, 60px | Mobile-first navigation; 44px tap targets per accessibility guidance |
| Card animation | None | Staggered fadeUp 0.06s/card | Gives the list a sense of materialization rather than instant dump |
| Rating badge | N/A | Ochre pill with star SVG | Trust signal at highest visual prominence in the card |
| Green jobs pill | N/A | Shown only when > 0 | Social proof only renders when data is real; never show "0 jobs nearby" |

---

## Anti-patterns specific to this page

- Do not use a page-level radial glow — this is not an auth/confirmation screen
- Do not animate cards on every re-render (e.g. when search changes) — animation fires once on mount via `both` fill mode
- Do not use a flat opaque header — the blur+transparency communicates depth and scrollability
- Do not use text "Home" or "Bookings" as primary navigation affordance without the accompanying SVG icon
- Do not use `fill="currentColor"` on the bottom nav icons — they use `stroke="currentColor"` outline style; a fill star in the nav would break visual consistency
- Do not show the "jobs nearby" pill with a zero value — conditional rendering on `jobs_this_month > 0` is required
- Do not render more than 3 shimmer skeleton cards regardless of expected result count
- Do not make the sort pills full-width — they are compact affordances within the header row, not standalone controls
- Do not animate the sticky header on scroll — no JS scroll tracking; CSS `position: sticky` handles this natively
