# Signup — Design Overrides

## Purpose

Profile completion step that follows email verification. The user has already proven their email; this screen collects the three data points needed to place them in a society: full name, flat number, and society selection. Progress visualization (step 1 complete, step 2 active) confirms they are one step away from the product.

---

## Layout

- Identical outer shell to Login: `minHeight: 100dvh`, `display: flex`, `alignItems: center`, `justifyContent: center`, `padding: 24px 16px`
- Page background: same radial glow pattern as Login but at slightly lower opacity
  ```
  radial-gradient(ellipse 80% 50% at 50% -10%, rgba(224,123,57,0.06) 0%, transparent 60%),
  #020203
  ```
  Signup gets `0.06` vs Login's `0.08` — the user is now committed, slightly cooler tone is appropriate.
- Content constrained to `maxWidth: 360px`
- Card entrance: `animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both`

---

## Key Components

### Brand mark (above card)
- Identical to Login brand mark: `36x36px` ochre gradient square, person SVG, wordmark
- `boxShadow: 0 0 20px rgba(224,123,57,0.20)`

### Card shell
- Same as Login: `rgba(255,255,255,0.04)` bg, `1px solid rgba(255,255,255,0.08)` border, `borderRadius: 14px`, `overflow: hidden`, `backdropFilter: blur(20px)`

### Top accent stripe
- Same as Login: `height: 1px`, `linear-gradient(90deg, transparent, rgba(224,123,57,0.33), transparent)`
- Not green — this is still an onboarding screen, not a success screen

### Step progress indicator
Located at the top of the card inner content, `marginBottom: 24px`.

Layout: `display: flex`, `alignItems: center`, `gap: 8px`

**Step 1 — completed:**
- Circle: `24x24px`, `borderRadius: 50%`, `backgroundColor: #e07b39`
- Checkmark SVG inside: `11x11`, path `M2 5.5l2.5 2.5 5-5`, `stroke: white`, `strokeWidth: 1.5`, `strokeLinecap: round`, `strokeLinejoin: round`

**Connector line:**
- `flex: 1`, `height: 1px`
- `background: linear-gradient(90deg, #e07b39, rgba(224,123,57,0.25))`
- Fades from ochre (completed side) to dim ochre (pending side)

**Step 2 — active:**
- Circle: `24x24px`, `borderRadius: 50%`, `border: 2px solid #e07b39`, `backgroundColor: rgba(224,123,57,0.10)`
- "2" label: `fontSize: 11px`, `fontWeight: 700`, `color: #e07b39`

### Card heading
- `fontSize: 20px`, `fontWeight: 700`, `color: #EDEDEF`, `letterSpacing: -0.02em`
- Sub-copy: `fontSize: 13px`, `color: #8A8F98` — "Last step — where do you live?"

### Full name input
- Standard `Input` atom: `padding: 10px 12px`, `fontSize: 15px`, `borderRadius: 8px`, `border: 1px solid rgba(255,255,255,0.08)`, `backgroundColor: #0d0d0f`
- `autoFocus` on this field
- Placeholder: "Priya Sharma"
- Focus ring: `borderColor: #e07b39`, `boxShadow: 0 0 0 3px rgba(224,123,57,0.20)`
- Field `marginBottom: 14px`

### Flat number input
- Same `Input` atom treatment
- Placeholder: "A-501"

### Society select
Positioned last, `marginBottom: 24px` (extra space before CTA).

Wrapper: `position: relative`

Select element:
```
padding:         10px 36px 10px 12px   (right padding makes room for chevron)
appearance:      none
fontSize:        15px
borderRadius:    8px
border:          1px solid rgba(255,255,255,0.08)
backgroundColor: #0d0d0f
cursor:          pointer
```
Placeholder option `value=""`: color `#4A4D56` (subtle — not yet selected)
Selected option: color `#EDEDEF`
Focus ring: same ochre treatment as other inputs

Chevron SVG (right-inset, non-interactive):
```
position:        absolute
right:           12px
top:             50%
transform:       translateY(-50%)
pointerEvents:   none
width/height:    12x12
```
Path: `M2 4l4 4 4-4`, `stroke: #8A8F98`, `strokeWidth: 1.5`, `strokeLinecap: round`, `strokeLinejoin: round`

Society options populated from Supabase `societies` table; fallback list hardcoded as: Mahindra Apts, Lodha Park, Prestige Towers.

### CTA button
- Standard `PrimaryBtn` atom behavior (see Login overrides)
- Label: "Create account" / "Creating account…" during submit
- `disabled` condition: `loading || !form.name || !form.flatNumber || !form.societyId`
- All three fields must be non-empty strings to enable — enforced at render time, not only on submit
- Disabled visual: `backgroundColor: rgba(255,255,255,0.06)`, `color: #4A4D56`

### ErrorBox
- Same as Login: red tinted box above first field, `marginBottom: 14px`
- Possible messages: "Name is required", "Flat number is required", "Select your society"
- Validated in order on submit — only one error shown at a time

---

## Deviations from MASTER

| Topic | MASTER default | Signup override | Reason |
|---|---|---|---|
| Page glow opacity | — | rgba(224,123,57,0.06) | Slightly cooler than Login — user is mid-funnel, not at first impression |
| Progress indicator | None | Step 1 filled + Step 2 outlined | Communicates "almost done" without adding a page |
| Society field | Standard input | Custom select with hidden native `<select>` + chevron SVG | Constrained to known societies; custom chrome matches dark theme |
| Select right-padding | 12px symmetric | 36px right, 12px left | Creates safe zone for the absolutely-positioned chevron |
| Connector line gradient | N/A | Left ochre, right dim ochre | Directional — reads as progress flowing left to right |
| CTA disabled condition | Single required field | All 3 fields non-empty | Three required fields; CTA should never fire with partial data |

---

## Anti-patterns specific to this page

- Do not use a stepper with "Next" between name and flat fields — they are all on one screen, one submit
- Do not replace the native `<select>` with a custom dropdown listbox — native select works for the MVP and avoids focus management complexity
- Do not show the step progress indicator below the heading — it must appear above the heading so users see it before reading the form
- Do not pre-fill societyId with the first option — placeholder `value=""` keeps the disabled state truthful
- Do not validate inline on every keystroke for name/flat — only validate on submit or blur to avoid annoying the user mid-type
- Do not use a multi-step wizard that navigates to a new route — all three fields live on one route (`/signup`)
- Do not omit the `flexShrink: 0` on step circles — without it, the circles compress on narrow viewports
