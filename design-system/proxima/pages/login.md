# Login — Design Overrides

## Purpose

Entry point for returning residents. Two-stage passwordless flow: collect email, then verify a 6-digit OTP. The visual goal is confident trust — the dark page, centered card, and ochre glow signal a polished product before the user types a single character.

---

## Layout

- Full-viewport column: `minHeight: 100dvh`, `display: flex`, `alignItems: center`, `justifyContent: center`
- Content constrained to `maxWidth: 360px`, centred, `padding: 24px 16px`
- Page background: radial ochre glow layered over `bgDeep`
  ```
  radial-gradient(ellipse 80% 50% at 50% -10%, rgba(224,123,57,0.08) 0%, transparent 60%),
  #020203
  ```
  The glow is positioned above the viewport (`-10%`) so it bleeds in from the top — warmth without distraction.
- Card entrance: `animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both`

---

## Key Components

### Brand mark (above card)
- Container: `display: inline-flex`, `alignItems: center`, `gap: 10px`
- Icon square: `36x36px`, `borderRadius: 10px`
- Icon background: `linear-gradient(135deg, #e07b39 0%, #c96f2f 100%)`
- Icon glow: `boxShadow: 0 0 20px rgba(224,123,57,0.20)`
- Person SVG inside (white, `18x18`): circle `cx=9 cy=7 r=3.5` + arc path `M2 17 c0-3.866 3.134-7 7-7 s7 3.134 7 7`
- Wordmark: `fontSize: 20px`, `fontWeight: 700`, `color: #EDEDEF`, `letterSpacing: -0.03em`

### Card shell
- Background: `rgba(255,255,255,0.04)` — translucent surface, not opaque
- Border: `1px solid rgba(255,255,255,0.08)`
- Border radius: `14px`
- `overflow: hidden` (clips the top accent stripe to the card edge)
- `backdropFilter: blur(20px)` + `-webkit-` prefix

### Top accent stripe
- `height: 1px` div, first child of card
- Background: `linear-gradient(90deg, transparent 0%, rgba(224,123,57,0.33) 50%, transparent 100%)`
- Not a border — this is a standalone 1px element so it clips correctly at card corners

### Card inner padding
- `padding: 28px 24px`

### Stage: Email
- Heading: `fontSize: 20px`, `fontWeight: 700`, `color: #EDEDEF`, `letterSpacing: -0.02em`
- Sub-copy: `fontSize: 13px`, `color: #8A8F98`
- Email input: standard `Input` atom (see below)
- "Continue" CTA: standard `PrimaryBtn` atom — disabled when `!email`
- Footer link: `fontSize: 12px`, `color: #4A4D56` — "No account?" with ochre `#e07b39` anchor

### Stage: OTP
- Back button: text-only, `fontSize: 13px`, `color: #8A8F98` default, `#EDEDEF` on hover
  - Left chevron SVG: `14x14`, path `M9 2L4 7l5 5`, `strokeWidth: 1.5`, `strokeLinecap: round`
  - No background, no border — purely typographic affordance
- Countdown / resend: shown as `hint` prop on Field label row
  - While `countdown > 0`: `color: #4A4D56`, shows seconds remaining
  - When expired: `color: #e07b39`, `fontWeight: 600`, "Resend" as clickable span

### OTP input (unique treatment)
```
fontSize:      24px
fontWeight:    700
fontFamily:    ui-monospace, 'SF Mono', monospace
letterSpacing: 0.3em
textAlign:     center
padding:       13px 16px
borderRadius:  8px
border:        1px solid rgba(255,255,255,0.08)
backgroundColor: #0d0d0f
color:         #EDEDEF
```
Focus ring: `borderColor: #e07b39`, `boxShadow: 0 0 0 3px rgba(224,123,57,0.20)`
- `inputMode: numeric`, `maxLength: 6`, strips non-digits on change
- "Verify code" CTA disabled until `otp.length === 6`

### Standard Input atom
```
padding:         10px 12px
fontSize:        15px
fontFamily:      Inter, system-ui
borderRadius:    8px
border:          1px solid rgba(255,255,255,0.08)
backgroundColor: #0d0d0f
color:           #EDEDEF
```
Focus: `borderColor: #e07b39`, `boxShadow: 0 0 0 3px rgba(224,123,57,0.20)`
Transition: `border-color 200ms ease, box-shadow 200ms ease`

### PrimaryBtn atom
```
width:           100%
padding:         11px
borderRadius:    8px
fontWeight:      600
fontSize:        14px
letterSpacing:   -0.01em
```
Enabled: `backgroundColor: #e07b39`, `boxShadow: 0 0 0 1px rgba(224,123,57,0.25)`
Hover: `backgroundColor: #c96f2f`, `boxShadow: 0 0 20px rgba(224,123,57,0.20)`
Press: `transform: scale(0.98)`
Disabled: `backgroundColor: rgba(255,255,255,0.06)`, `color: #4A4D56`, `cursor: not-allowed`
Transition: `all 200ms cubic-bezier(0.16,1,0.3,1)`

### Field label row
- `display: flex`, `justifyContent: space-between`, `alignItems: baseline`
- Label: `fontSize: 12px`, `fontWeight: 500`, `color: #8A8F98`, `letterSpacing: 0.04em`
- Hint slot (right side): used for countdown/resend in OTP stage

### ErrorBox
```
background:   rgba(248,113,113,0.08)
border:       1px solid rgba(248,113,113,0.18)
borderRadius: 8px
padding:      10px 12px
fontSize:     13px
color:        #f87171
fontWeight:   500
```
Appears above the first field, `marginBottom: 14px`

### Legal footer (below card)
- `fontSize: 11px`, `color: #4A4D56`, `marginTop: 20px`, `lineHeight: 1.6`
- "Terms of Service" and "Privacy Policy" — linked in real implementation

---

## Deviations from MASTER

| Topic | MASTER default | Login override | Reason |
|---|---|---|---|
| OTP input font size | 15px (standard input) | 24px | Digits need to be scannable at arm's length |
| OTP letter-spacing | none | 0.3em | Separates digits visually without splitting into individual boxes |
| OTP font family | Inter | SF Mono / monospace | Monospace ensures equal-width digits for alignment |
| Page glow opacity | — | rgba(224,123,57,0.08) | Login is slightly warmer than Signup (0.06) — first impression |
| Back affordance | — | Text button with chevron SVG | Provides stage escape without competing with the primary action |
| Card top stripe | — | rgba(224,123,57,0.33) at 50% | Consistent with Signup; higher opacity than success stripe |

---

## Anti-patterns specific to this page

- Do not use separate digit boxes for OTP — single input with monospace + letter-spacing reads cleaner
- Do not show both stages simultaneously as a multi-step wizard — swap DOM, do not stack
- Do not auto-submit when 6 digits are entered — user must press "Verify code" (reduces accidental submission)
- Do not surface "No account? Create one" on the OTP stage — that link belongs only on the email stage
- Do not use `autofill` attributes on the email field in a way that triggers browser credential UI before the user intends
- Do not animate the card out when transitioning from email to OTP stage — replace form content in-place, no slide animation
- Do not use a spinner that replaces the button text without disabling the button — disable + change label text simultaneously
