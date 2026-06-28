# Booking Confirmation — Design Overrides

## Purpose

Terminal success state after a booking is created. The primary job is emotional payoff: the user took the leap and booked. Secondary job is reference — the details table gives them what they need to remember (who, when, what, ID). The page is intentionally spare: one action, one piece of information hierarchy, nothing to second-guess.

---

## Layout

- Full-viewport centered column: `minHeight: 100dvh`, `display: flex`, `alignItems: center`, `justifyContent: center`, `padding: 24px 16px`
- Page background: green radial glow, not ochre — differentiates this screen from auth flow
  ```
  radial-gradient(ellipse 70% 40% at 50% 30%, rgba(74,222,128,0.04) 0%, transparent 60%),
  #020203
  ```
  Glow positioned at `50% 30%` (upper-center) — subtle warmth, not a spotlight. Opacity `0.04` keeps it subliminal.
- Content: `maxWidth: 360px`, centered
- Card entrance: `opacity` + `translateY` driven by a `visible` state flag set after an 80ms `setTimeout`
  ```
  opacity:    visible ? 1 : 0
  transform:  visible ? translateY(0) : translateY(16px)
  transition: opacity 400ms ease, transform 400ms ease
  ```
  The short delay prevents the card from flashing in before paint.

---

## Key Components

### Card shell
- Same as Login/Signup: `rgba(255,255,255,0.04)` bg, `1px solid rgba(255,255,255,0.08)` border, `borderRadius: 14px`, `overflow: hidden`, `backdropFilter: blur(20px)`

### Top accent stripe
- `height: 1px`, first child of card
- Background: `linear-gradient(90deg, transparent, rgba(74,222,128,0.33), transparent)`
- Green, not ochre — this is the only page where the accent stripe deviates from the brand ochre

### Card inner
- `padding: 32px 24px` (extra vertical vs auth pages — content needs more breathing room)
- `textAlign: center` on the wrapper div

### Success circle
```
width:            60px
height:           60px
borderRadius:     50%
backgroundColor:  rgba(74,222,128,0.08)     (t.successBg)
border:           1px solid rgba(74,222,128,0.18)   (t.successBorder)
display:          flex
alignItems:       center
justifyContent:   center
margin:           0 auto 20px
```
Entrance animation (tied to `visible` state, with 100ms delay after card fade-in):
```
opacity:    visible ? 1 : 0
transform:  visible ? scale(1) : scale(0.5)
transition: opacity 400ms ease 100ms,
            transform 500ms cubic-bezier(0.34,1.4,0.64,1) 100ms
```
The `cubic-bezier(0.34,1.4,0.64,1)` spring overshoot gives the circle a satisfying "pop" into place.

Glow when visible:
```
boxShadow: 0 0 24px rgba(74,222,128,0.15)
```
When `!visible`: `boxShadow: none`

Checkmark SVG inside (`26x26`, viewBox `0 0 24 24`):
```
path d="M5 13l4 4L19 7"
stroke:          #4ade80   (t.successText)
strokeWidth:     2
strokeLinecap:   round
strokeLinejoin:  round
fill:            none
```
This is an SVG path — not a Unicode character, not an emoji, not a text checkmark.

### Heading and sub-copy
- Heading: "Booking confirmed", `fontSize: 20px`, `fontWeight: 700`, `color: #EDEDEF`, `letterSpacing: -0.02em`, `marginBottom: 6px`
- Sub-copy: "Raj will respond within 15 minutes.", `fontSize: 14px`, `color: #8A8F98`, `lineHeight: 1.5`, `marginBottom: 28px`

### Divider
- `height: 1px`, `backgroundColor: rgba(255,255,255,0.08)`, `marginBottom: 20px`
- Used twice: above and below the details table

### Details table
`display: flex`, `flexDirection: column`, `gap: 14px`, `marginBottom: 28px`, `textAlign: left`

Four rows in order:
| Label | Value | Treatment |
|---|---|---|
| Service | AC Repair | Standard |
| Provider | Raj | Standard |
| Scheduled | Today, 4:00 PM | Standard |
| Booking | BK-2024-7293 | Monospace |

Each row: `display: flex`, `justifyContent: space-between`, `alignItems: center`
- Label: `fontSize: 13px`, `color: #8A8F98`, `fontWeight: 500`
- Value (standard): `fontSize: 13px`, `fontWeight: 600`, `color: #EDEDEF`, `fontFamily: Inter`
- Value (monospace): `fontFamily: ui-monospace, 'SF Mono', monospace`, `letterSpacing: 0.04em`

The Booking ID row is the only monospace value. It uses `letterSpacing: 0.04em` — just enough to feel like a reference code without impeding readability.

### CTA button
- Standard `PrimaryBtn` atom: `width: 100%`, `padding: 11px`, `borderRadius: 8px`
- Background: `#e07b39` (ochre) — reverts to brand color even on the green success screen
- Label: "Back to services"
- `onClick` navigates to `/home`
- `marginBottom: 10px` to separate from the helper text below

Hover: `backgroundColor: #c96f2f`, `boxShadow: 0 0 20px rgba(224,123,57,0.20), 0 0 0 1px rgba(224,123,57,0.25)`
Press: `transform: scale(0.98)`
Default box-shadow: `0 0 0 1px rgba(224,123,57,0.25)`

### Helper text
- `fontSize: 12px`, `color: #4A4D56`
- "Updates will be sent to your email"

---

## Deviations from MASTER

| Topic | MASTER default | Confirmation override | Reason |
|---|---|---|---|
| Page glow color | Ochre | Green `rgba(74,222,128,0.04)` | Success context demands a semantic shift from brand color to outcome color |
| Glow position | Top (`50% -10%`) | Upper-center (`50% 30%`) | Confirmation is full-viewport centered; glow at 30% frames the card without being above viewport |
| Top accent stripe | Ochre `rgba(224,123,57,0.33)` | Green `rgba(74,222,128,0.33)` | Only page where stripe deviates — reinforces success state at the card edge |
| Success circle | N/A | 60px spring-animated circle | Most prominent pixel on the page; must feel rewarding, not just informational |
| Checkmark | N/A | SVG path, green stroke | SVG is crisp at all pixel densities; no text/emoji fallback permitted |
| Circle entrance | N/A | `cubic-bezier(0.34,1.4,0.64,1)` spring | Satisfying overshoot; auth pages use standard ease-out |
| Card padding | `28px 24px` | `32px 24px` | Confirmation has fixed, sparse content — extra vertical space prevents the card feeling cramped |
| CTA color | — | Ochre `#e07b39` (not green) | User is done with the success moment; ochre CTA re-grounds them in the product brand |
| Monospace field | OTP input only | Booking ID value in details table | Reference codes must be scannable; same monospace token used consistently |
| Card entrance | `fadeUp` CSS animation | JS-driven `opacity`/`translateY` via state | Allows coordinating the circle's pop animation (100ms after card) as a choreographed sequence |

---

## Anti-patterns specific to this page

- Do not use a Unicode checkmark (`✓`) or emoji (`✅`) — SVG path only
- Do not use green for the CTA button — green is a semantic state color on this screen; the action button must be ochre to remain recognizable as the primary action
- Do not remove the 80ms mount delay — without it, on fast connections the card flashes in without the entrance animation firing
- Do not add additional CTAs (e.g. "Add to calendar", "Share") on the MVP — one action, one screen
- Do not use `animation:` CSS keyframe for the card entrance on this page — the JS state approach is required because the circle animation depends on the same `visible` flag
- Do not show the green glow at full `rgba(74,222,128,1.0)` or even 0.08+ — it must stay subliminal (`0.04`); this is a dark UI, not a health dashboard
- Do not reorder the details table rows — Service / Provider / Scheduled / Booking is the canonical order (what → who → when → reference)
- Do not use a loading state on this page — it renders with data already in scope; if data is missing, the caller page is responsible for blocking navigation
