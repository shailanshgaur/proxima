---
title: Proxima Design System
version: 1.0.0
theme: dark
north_star: "The Night Dispatch"
tokens:
  color:
    bgDeep: "#020203"
    bg: "#050506"
    elevated: "#0d0d0f"
    border: "rgba(255,255,255,0.08)"
    borderHover: "rgba(255,255,255,0.16)"
    ink: "#EDEDEF"
    muted: "#8A8F98"
    subtle: "#4A4D56"
    ochre: "#e07b39"
    ochreDark: "#c96f2f"
    ochreGlow: "rgba(224,123,57,0.20)"
    ochreDim: "rgba(224,123,57,0.10)"
    ochreBorder: "rgba(224,123,57,0.25)"
    successText: "#4ade80"
    successBg: "rgba(74,222,128,0.08)"
    successBorder: "rgba(74,222,128,0.18)"
    errText: "#f87171"
    errBg: "rgba(248,113,113,0.08)"
    errBorder: "rgba(248,113,113,0.18)"
  radius:
    default: "8px"
    lg: "14px"
    full: "9999px"
  font:
    sans: "Inter, -apple-system, system-ui, sans-serif"
    mono: "ui-monospace, 'SF Mono', monospace"
  motion:
    ease: "cubic-bezier(0.16, 1, 0.3, 1)"
    duration:
      fast: "120ms"
      base: "220ms"
      slow: "400ms"
---

# Proxima Design System

## Overview

**North Star: "The Night Dispatch"**

It is 11pm. A resident's water heater has failed. Children need hot showers before school. The resident opens Proxima. The screen does not greet them with cheerful gradients or a colorful homepage hero — it opens into a near-black environment, calm and purposeful, and surfaces the two closest plumbers in their building complex. One name glows in warm ochre. Tap. Booked in 90 seconds.

That is the emotional contract of this design system. Dark because the world goes dark when things break. Warm ochre because help is near, human, and lit like a window across the courtyard. No decoration for decoration's sake. Every visual decision either reduces friction in urgent moments or builds quiet confidence that this platform knows your neighborhood.

**What this system is not:**
- Generic SaaS (Figma blue, teal primaries, white card grids)
- Overly playful (doodles, gradient washes, emoji as icons)
- Clinical or banking-formal (cold grays, serif type, excessive whitespace)
- Invisible architecture (surfaces that hide the humans behind the services)

**Design Principles (from PRODUCT.md):**
1. Proximity first — distance is always visible; nearest vendor wins by default
2. Trust through neighbors — specific reviews, vendor names, jobs done in your society
3. Speed over perfect — 3-tap booking, confirmation in 15 minutes
4. Hyperlocal narrative — "find someone nearby, book today" not "find anyone, eventually"
5. Earned rating — ratings mean something only when tied to real work in your neighborhood

---

## Colors

### Philosophy

The palette is structured as three stacked grounds — void, ground, raised — that create a sense of layered physical depth without shadows. Text uses a warm white rather than pure white to prevent eye-strain on long sessions. A single accent, Ember Orange, carries all interactive energy. It was chosen over typical blues or teals because it reads as warmth and urgency simultaneously, aligning with the hyperlocal, neighborhood-light metaphor.

All accent interactions use glow, not shadow. Shadows connote material weight; glows connote emitted light — a subtle but critical distinction for a system where "help is nearby and warm."

### Background Hierarchy

| Token | Hex | Name | Usage |
|-------|-----|------|-------|
| `bgDeep` | `#020203` | Midnight Void | Page background, full-bleed screens |
| `bg` | `#050506` | Deep Ground | Default body, scrollable areas |
| `elevated` | `#0d0d0f` | Raised Surface | Cards, modals, bottom sheets, inputs |

### Text Hierarchy

| Token | Hex | Name | Usage |
|-------|-----|------|-------|
| `ink` | `#EDEDEF` | Warm White | Primary body text, labels, headings |
| `muted` | `#8A8F98` | Slate Muted | Secondary text, timestamps, subtitles |
| `subtle` | `#4A4D56` | Quiet Gray | Placeholder text, disabled labels, dividers |

**Contrast:**
- `ink` on `bg`: 14.3:1 — passes WCAG AAA
- `muted` on `bg`: 4.8:1 — passes WCAG AA
- `subtle` on `bg`: 2.1:1 — decorative/disabled only; never sole conveyor of meaning

### Accent

| Token | Hex | Name | Usage |
|-------|-----|------|-------|
| `ochre` | `#e07b39` | Ember Orange | Primary buttons, active states, focus rings, CTA text |
| `ochreDark` | `#c96f2f` | Deep Ember | Button hover, pressed state, active nav item |

**Contrast:** `ochre` on `bg`: 7.1:1 — passes WCAG AA for large text and UI components.

### Semantic

| Token | Hex | Name | Usage |
|-------|-----|------|-------|
| `successText` | `#4ade80` | Confirm Green | Booking confirmed, availability, positive status |
| `errText` | `#f87171` | Alert Red | Errors, failed OTP, unavailable, destructive actions |

Semantic colors always appear with a supporting background tint (`successBg`, `errBg`) and border (`successBorder`, `errBorder`) so color is never the sole conveyor of meaning.

### Surface & Border Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `surface` | `rgba(255,255,255,0.04)` | Hover tint on list rows |
| `surfaceHover` | `rgba(255,255,255,0.07)` | Pressed tint on list rows |
| `border` | `rgba(255,255,255,0.08)` | Default hairline border on all elevated surfaces |
| `borderHover` | `rgba(255,255,255,0.16)` | Border brightens on interactive elements on hover |
| `ochreGlow` | `rgba(224,123,57,0.20)` | Box-glow on primary action hover |
| `ochreDim` | `rgba(224,123,57,0.10)` | Subtle ochre tint backgrounds |
| `ochreBorder` | `rgba(224,123,57,0.25)` | Focused input border, active card accent |

---

## Typography

### Philosophy

Single typeface — Inter. Chosen for its optical clarity at small sizes on low-brightness screens, neutral personality that defers to content, and excellent number rendering for prices, distances, and ratings. No display serif, no decorative type. The copy does the character work; the type stays out of the way.

### Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| `display` | 28px / 1.75rem | 700 | 1.2 | Screen titles, auth header |
| `heading` | 20px / 1.25rem | 600 | 1.3 | Section headings, card vendor name |
| `subheading` | 17px / 1.0625rem | 500 | 1.4 | Category labels, modal titles |
| `body` | 15px / 0.9375rem | 400 | 1.5 | Default body text, descriptions |
| `label` | 13px / 0.8125rem | 500 | 1.4 | Form labels, chip labels, nav items |
| `caption` | 12px / 0.75rem | 400 | 1.4 | Timestamps, secondary metadata |
| `micro` | 10px / 0.625rem | 500 | 1.3 | Badges, count indicators, distance pills |
| `mono` | 15px / 0.9375rem | 400 | 1.5 | OTP digits, numeric codes |

### Rules

- Minimum body text size: 13px. Never set navigable or meaningful text below 12px.
- Letter-spacing: `display` and `heading` at `-0.01em`; `label` and `caption` at `+0.01em` for readability at small sizes.
- All monetary values (`₹1,200`) use `fontMono` to prevent digit-width jitter.
- Line lengths: 45–75 characters per line for body text. Single-column mobile layouts naturally enforce this.
- `-webkit-font-smoothing: antialiased` is set globally; do not override it.

---

## Elevation

### Philosophy

Elevation in Proxima is flat-by-default with glow. No box-shadows exist in the system. Depth is communicated through:

1. **Background tint progression** — `bgDeep` → `bg` → `elevated` creates three stacked layers visible to the eye without any shadow rendering
2. **Hairline borders** — `border: rgba(255,255,255,0.08)` defines the edge of every elevated surface; the border brightens to `0.16` on hover/focus to signal interactivity
3. **Glow (primary only)** — `box-shadow: 0 0 20px rgba(224,123,57,0.20)` appears only on primary CTA hover. This is the single expressive elevation moment in the system. It is reserved, intentional, and should never be applied to decorative elements.

### Elevation Levels

| Level | Background | Border | Shadow | Usage |
|-------|-----------|--------|--------|-------|
| 0 — Void | `#020203` | none | none | Full-bleed splash, map canvas |
| 1 — Ground | `#050506` | none | none | Page body, scroll container |
| 2 — Raised | `#0d0d0f` | `rgba(255,255,255,0.08)` | none | Cards, inputs, modals |
| 3 — Floating | `#0d0d0f` + blur | `rgba(255,255,255,0.10)` | none | Bottom sheets, dropdowns, toasts |
| CTA Hover | primary button | `ochreGlow border` | `0 0 20px rgba(224,123,57,0.20)` | Primary button hover only |

### Prohibited Patterns

- No `box-shadow: 0 2px 8px rgba(0,0,0,X)` — shadow-based depth is banned
- No `drop-shadow` filters
- No layering more than three stacked surfaces (Void → Ground → Raised is the maximum)
- The ochre glow must never appear on non-interactive elements

---

## Components

Each component is documented with a self-contained HTML+CSS sidecar. All classes use the `ds-` prefix. No Tailwind. No external icon references — all icons are inlined SVG.

---

### PrimaryButton

The system's main call-to-action. Ember Orange fill, Warm White label. The hover glow is the system's single expressive moment — do not suppress it.

**States:** default, hover, focus-visible, active, disabled, loading

```html
<style>
  .ds-btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 24px;
    height: 52px;
    min-width: 120px;
    background: #e07b39;
    color: #EDEDEF;
    font-family: Inter, -apple-system, system-ui, sans-serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.01em;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    transition: background 220ms cubic-bezier(0.16, 1, 0.3, 1),
                box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1),
                transform 120ms cubic-bezier(0.16, 1, 0.3, 1);
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  .ds-btn-primary:hover {
    background: #c96f2f;
    box-shadow: 0 0 20px rgba(224,123,57,0.20);
  }
  .ds-btn-primary:focus-visible {
    outline: 2px solid #e07b39;
    outline-offset: 3px;
    box-shadow: 0 0 20px rgba(224,123,57,0.20);
  }
  .ds-btn-primary:active {
    background: #c96f2f;
    transform: scale(0.97);
    box-shadow: none;
  }
  .ds-btn-primary:disabled,
  .ds-btn-primary[aria-disabled="true"] {
    background: rgba(224,123,57,0.30);
    color: rgba(237,237,239,0.40);
    cursor: not-allowed;
    box-shadow: none;
    pointer-events: none;
  }
  .ds-btn-primary--loading {
    pointer-events: none;
    opacity: 0.75;
  }
  .ds-btn-primary--loading .ds-btn-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(237,237,239,0.25);
    border-top-color: #EDEDEF;
    border-radius: 50%;
    animation: ds-spin 600ms linear infinite;
  }
  @keyframes ds-spin {
    to { transform: rotate(360deg); }
  }
</style>

<!-- Default -->
<button class="ds-btn-primary" type="button">Book Now</button>

<!-- Loading -->
<button class="ds-btn-primary ds-btn-primary--loading" type="button" aria-label="Booking...">
  <span class="ds-btn-spinner" role="status" aria-hidden="true"></span>
  Booking...
</button>

<!-- Disabled -->
<button class="ds-btn-primary" type="button" disabled>No vendors available</button>
```

**Spec:**
- Height: 52px (touch target ≥48dp)
- Radius: `9999px` (pill)
- Min-width: 120px
- Full-width variant: `width: 100%`
- Never stack two primary buttons. One CTA per screen section.

---

### GhostButton

Secondary actions. Transparent fill, ochre border, ochre text. Used for "Skip", "View all", "Cancel".

**States:** default, hover, focus-visible, active, disabled

```html
<style>
  .ds-btn-ghost {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 20px;
    height: 44px;
    background: transparent;
    color: #e07b39;
    font-family: Inter, -apple-system, system-ui, sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.01em;
    border: 1px solid rgba(224,123,57,0.25);
    border-radius: 9999px;
    cursor: pointer;
    transition: background 220ms cubic-bezier(0.16, 1, 0.3, 1),
                border-color 220ms cubic-bezier(0.16, 1, 0.3, 1),
                color 220ms cubic-bezier(0.16, 1, 0.3, 1);
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  .ds-btn-ghost:hover {
    background: rgba(224,123,57,0.10);
    border-color: rgba(224,123,57,0.50);
    color: #EDEDEF;
  }
  .ds-btn-ghost:focus-visible {
    outline: 2px solid #e07b39;
    outline-offset: 3px;
  }
  .ds-btn-ghost:active {
    background: rgba(224,123,57,0.15);
    transform: scale(0.97);
  }
  .ds-btn-ghost:disabled,
  .ds-btn-ghost[aria-disabled="true"] {
    color: #4A4D56;
    border-color: rgba(74,77,86,0.30);
    cursor: not-allowed;
    pointer-events: none;
  }
</style>

<!-- Default -->
<button class="ds-btn-ghost" type="button">View all vendors</button>

<!-- Destructive ghost (cancel/delete) -->
<button class="ds-btn-ghost ds-btn-ghost--danger" type="button">Cancel booking</button>
<style>
  .ds-btn-ghost--danger {
    color: #f87171;
    border-color: rgba(248,113,113,0.25);
  }
  .ds-btn-ghost--danger:hover {
    background: rgba(248,113,113,0.08);
    border-color: rgba(248,113,113,0.50);
    color: #EDEDEF;
  }
</style>
```

---

### VendorCard

The primary browseable unit. Shows vendor photo, name, service category, rating, distance, and jobs-in-society count. Distance and neighbor-proof are always visible — they are the trust signals that differentiate Proxima from generic marketplaces.

```html
<style>
  .ds-vendor-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    background: #0d0d0f;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    cursor: pointer;
    transition: background 220ms cubic-bezier(0.16, 1, 0.3, 1),
                border-color 220ms cubic-bezier(0.16, 1, 0.3, 1);
    text-decoration: none;
    color: inherit;
    -webkit-tap-highlight-color: transparent;
    position: relative;
  }
  .ds-vendor-card:hover {
    background: #111113;
    border-color: rgba(255,255,255,0.16);
  }
  .ds-vendor-card:focus-visible {
    outline: 2px solid #e07b39;
    outline-offset: 2px;
  }
  .ds-vendor-card:active {
    background: rgba(255,255,255,0.04);
  }
  .ds-vendor-card__avatar {
    width: 52px;
    height: 52px;
    border-radius: 9999px;
    background: rgba(224,123,57,0.10);
    border: 1px solid rgba(224,123,57,0.25);
    flex-shrink: 0;
    object-fit: cover;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 700;
    color: #e07b39;
  }
  .ds-vendor-card__body {
    flex: 1;
    min-width: 0;
  }
  .ds-vendor-card__name {
    font-size: 15px;
    font-weight: 600;
    color: #EDEDEF;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: -0.01em;
  }
  .ds-vendor-card__category {
    font-size: 13px;
    font-weight: 400;
    color: #8A8F98;
    margin-top: 2px;
  }
  .ds-vendor-card__meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
  }
  .ds-vendor-card__rating {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 500;
    color: #EDEDEF;
  }
  .ds-vendor-card__rating svg {
    flex-shrink: 0;
  }
  .ds-vendor-card__distance {
    font-size: 12px;
    font-weight: 500;
    color: #e07b39;
    background: rgba(224,123,57,0.10);
    border: 1px solid rgba(224,123,57,0.25);
    border-radius: 9999px;
    padding: 2px 8px;
  }
  .ds-vendor-card__proof {
    font-size: 11px;
    font-weight: 500;
    color: #4ade80;
    background: rgba(74,222,128,0.08);
    border: 1px solid rgba(74,222,128,0.18);
    border-radius: 9999px;
    padding: 2px 8px;
  }
  .ds-vendor-card__arrow {
    margin-left: auto;
    flex-shrink: 0;
    color: #4A4D56;
    transition: color 220ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .ds-vendor-card:hover .ds-vendor-card__arrow {
    color: #8A8F98;
  }
</style>

<a class="ds-vendor-card" href="#" role="article" aria-label="Ramesh Kumar, Plumber, 4.9 stars, 120m away, 14 jobs in your society">
  <div class="ds-vendor-card__avatar" aria-hidden="true">R</div>
  <div class="ds-vendor-card__body">
    <div class="ds-vendor-card__name">Ramesh Kumar</div>
    <div class="ds-vendor-card__category">Plumber &middot; Pipe repair</div>
    <div class="ds-vendor-card__meta">
      <span class="ds-vendor-card__rating" aria-label="4.9 stars">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="#e07b39" aria-hidden="true">
          <path d="M6 1l1.4 2.8L10.6 4.3l-2.3 2.2.54 3.15L6 8.1l-2.84 1.55.54-3.15L1.4 4.3l3.2-.5L6 1z"/>
        </svg>
        4.9
      </span>
      <span class="ds-vendor-card__distance">120m away</span>
      <span class="ds-vendor-card__proof">14 jobs here</span>
    </div>
  </div>
  <svg class="ds-vendor-card__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</a>
```

**Spec:**
- Minimum height: 84px
- Avatar: 52px circle, ochre tint background when no photo
- Distance pill: always visible, always ochre — it is the primary differentiator
- "Jobs here" proof badge: shown only when count ≥ 1; green semantic color
- Never show a vendor card without distance. Never.

---

### SearchInput

Full-width search bar with inline search icon and clear action. Used on the home/discovery screen.

```html
<style>
  .ds-search-wrap {
    position: relative;
    width: 100%;
  }
  .ds-search-wrap__icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #4A4D56;
    transition: color 220ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .ds-search-wrap:focus-within .ds-search-wrap__icon {
    color: #8A8F98;
  }
  .ds-search-input {
    width: 100%;
    height: 52px;
    padding: 0 48px 0 46px;
    background: #0d0d0f;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 9999px;
    color: #EDEDEF;
    font-family: Inter, -apple-system, system-ui, sans-serif;
    font-size: 15px;
    font-weight: 400;
    transition: border-color 220ms cubic-bezier(0.16, 1, 0.3, 1),
                background 220ms cubic-bezier(0.16, 1, 0.3, 1);
    outline: none;
  }
  .ds-search-input::placeholder {
    color: #4A4D56;
  }
  .ds-search-input:hover {
    border-color: rgba(255,255,255,0.16);
    background: #111113;
  }
  .ds-search-input:focus {
    border-color: rgba(224,123,57,0.25);
    background: #111113;
    box-shadow: 0 0 0 3px rgba(224,123,57,0.08);
  }
  .ds-search-input:focus-visible {
    outline: 2px solid #e07b39;
    outline-offset: 2px;
  }
  .ds-search-clear {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: rgba(255,255,255,0.07);
    border-radius: 50%;
    color: #8A8F98;
    cursor: pointer;
    transition: background 150ms ease, color 150ms ease;
  }
  .ds-search-clear:hover {
    background: rgba(255,255,255,0.12);
    color: #EDEDEF;
  }
  .ds-search-clear:focus-visible {
    outline: 2px solid #e07b39;
    outline-offset: 2px;
  }
  .ds-search-clear[hidden] { display: none; }
</style>

<div class="ds-search-wrap" role="search">
  <svg class="ds-search-wrap__icon" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="5.25" stroke="currentColor" stroke-width="1.5"/>
    <path d="M12 12l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
  <input
    class="ds-search-input"
    type="search"
    placeholder="Search electricians, plumbers..."
    aria-label="Search for services"
    autocomplete="off"
    spellcheck="false"
  />
  <button class="ds-search-clear" type="button" aria-label="Clear search" hidden>
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>
</div>
```

---

### OtpInput

Six-digit OTP entry for phone authentication. Monospace digits, one box per digit. On mobile, triggers numeric keypad.

```html
<style>
  .ds-otp-group {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
  }
  .ds-otp-cell {
    width: 48px;
    height: 56px;
    background: #0d0d0f;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: #EDEDEF;
    font-family: ui-monospace, 'SF Mono', monospace;
    font-size: 22px;
    font-weight: 600;
    text-align: center;
    letter-spacing: 0;
    caret-color: #e07b39;
    transition: border-color 220ms cubic-bezier(0.16, 1, 0.3, 1),
                background 220ms cubic-bezier(0.16, 1, 0.3, 1);
    outline: none;
  }
  .ds-otp-cell::placeholder {
    color: #4A4D56;
  }
  .ds-otp-cell:hover {
    border-color: rgba(255,255,255,0.16);
  }
  .ds-otp-cell:focus {
    border-color: rgba(224,123,57,0.25);
    background: #111113;
    box-shadow: 0 0 0 3px rgba(224,123,57,0.08);
  }
  .ds-otp-cell:focus-visible {
    outline: 2px solid #e07b39;
    outline-offset: 2px;
  }
  .ds-otp-cell--filled {
    border-color: rgba(224,123,57,0.35);
    color: #e07b39;
  }
  .ds-otp-cell--error {
    border-color: rgba(248,113,113,0.50);
    background: rgba(248,113,113,0.06);
    color: #f87171;
  }
  .ds-otp-error {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    font-size: 13px;
    font-weight: 500;
    color: #f87171;
    justify-content: center;
  }
  .ds-otp-error svg { flex-shrink: 0; }
</style>

<div class="ds-otp-group" role="group" aria-label="One-time password, 6 digits">
  <input class="ds-otp-cell" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" aria-label="OTP digit 1" autocomplete="one-time-code"/>
  <input class="ds-otp-cell" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" aria-label="OTP digit 2"/>
  <input class="ds-otp-cell" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" aria-label="OTP digit 3"/>
  <input class="ds-otp-cell" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" aria-label="OTP digit 4"/>
  <input class="ds-otp-cell" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" aria-label="OTP digit 5"/>
  <input class="ds-otp-cell" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" aria-label="OTP digit 6"/>
</div>

<!-- Error state -->
<p class="ds-otp-error" role="alert" aria-live="polite">
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="6" stroke="#f87171" stroke-width="1.3"/>
    <path d="M7 4v3.5" stroke="#f87171" stroke-width="1.3" stroke-linecap="round"/>
    <circle cx="7" cy="10" r="0.7" fill="#f87171"/>
  </svg>
  Incorrect code. 2 attempts remaining.
</p>
```

---

### Pill / Badge

Small inline labels for status, category, and social proof. Three variants: default, success, error.

```html
<style>
  .ds-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 9999px;
    font-family: Inter, -apple-system, system-ui, sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    white-space: nowrap;
    line-height: 1.3;
  }
  /* Default / neutral */
  .ds-pill--neutral {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.10);
    color: #8A8F98;
  }
  /* Accent / category */
  .ds-pill--accent {
    background: rgba(224,123,57,0.10);
    border: 1px solid rgba(224,123,57,0.25);
    color: #e07b39;
  }
  /* Success / confirmed / available */
  .ds-pill--success {
    background: rgba(74,222,128,0.08);
    border: 1px solid rgba(74,222,128,0.18);
    color: #4ade80;
  }
  /* Error / unavailable */
  .ds-pill--error {
    background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.18);
    color: #f87171;
  }
  /* Count badge (numeric) */
  .ds-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: 9999px;
    background: #e07b39;
    color: #020203;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0;
  }
</style>

<!-- Category pill -->
<span class="ds-pill ds-pill--accent">Plumbing</span>

<!-- Available -->
<span class="ds-pill ds-pill--success">Available now</span>

<!-- Busy -->
<span class="ds-pill ds-pill--error">Busy today</span>

<!-- Neutral -->
<span class="ds-pill ds-pill--neutral">5km range</span>

<!-- Count badge -->
<span class="ds-badge" aria-label="3 notifications">3</span>
```

---

### BottomNav

Persistent bottom navigation bar for the four core destinations: Home, Search, Bookings, Profile.

```html
<style>
  .ds-bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 64px;
    padding-bottom: env(safe-area-inset-bottom);
    background: #0d0d0f;
    border-top: 1px solid rgba(255,255,255,0.08);
  }
  .ds-bottom-nav__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    min-width: 48px;
    min-height: 48px;
    padding: 4px 16px;
    color: #4A4D56;
    background: transparent;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    transition: color 220ms cubic-bezier(0.16, 1, 0.3, 1),
                background 220ms cubic-bezier(0.16, 1, 0.3, 1);
    -webkit-tap-highlight-color: transparent;
    text-decoration: none;
  }
  .ds-bottom-nav__item:hover {
    color: #8A8F98;
    background: rgba(255,255,255,0.04);
  }
  .ds-bottom-nav__item:focus-visible {
    outline: 2px solid #e07b39;
    outline-offset: 2px;
  }
  .ds-bottom-nav__item[aria-current="page"] {
    color: #e07b39;
  }
  .ds-bottom-nav__label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.02em;
    line-height: 1;
  }
</style>

<nav class="ds-bottom-nav" aria-label="Main navigation">
  <!-- Home -->
  <a class="ds-bottom-nav__item" href="/" aria-current="page" aria-label="Home">
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M3 10l8-7 8 7v9a1 1 0 01-1 1h-4v-5H8v5H4a1 1 0 01-1-1V10z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>
    <span class="ds-bottom-nav__label">Home</span>
  </a>

  <!-- Search -->
  <a class="ds-bottom-nav__item" href="/search" aria-label="Search services">
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M15 15l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <span class="ds-bottom-nav__label">Search</span>
  </a>

  <!-- Bookings -->
  <a class="ds-bottom-nav__item" href="/bookings" aria-label="My bookings">
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="16" height="15" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <path d="M7 2v4M15 2v4M3 9h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M7 13h4M7 16h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <span class="ds-bottom-nav__label">Bookings</span>
  </a>

  <!-- Profile -->
  <a class="ds-bottom-nav__item" href="/profile" aria-label="My profile">
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="8" r="3.5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M4 19c0-3.866 3.134-7 7-7h2a7 7 0 017 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <span class="ds-bottom-nav__label">Profile</span>
  </a>
</nav>
```

**Spec:**
- Height: 64px + `env(safe-area-inset-bottom)` for iPhone notch
- Active: `ochre` color, no background tint (color alone suffices at this size)
- Touch targets: 48x48 minimum per WCAG
- 4 items maximum. A fifth item makes targets too small on 375px screens.

---

### AuthCard

The centered card used on the phone-entry and OTP screens. Sits on `bgDeep` and floats as a `Raised Surface`.

```html
<style>
  .ds-auth-root {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    background: #020203;
  }
  .ds-auth-card {
    width: 100%;
    max-width: 400px;
    background: #0d0d0f;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 32px 28px;
  }
  .ds-auth-card__wordmark {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 32px;
  }
  .ds-auth-card__logo-mark {
    width: 36px;
    height: 36px;
    background: rgba(224,123,57,0.10);
    border: 1px solid rgba(224,123,57,0.25);
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ds-auth-card__brand-name {
    font-size: 18px;
    font-weight: 700;
    color: #EDEDEF;
    letter-spacing: -0.02em;
  }
  .ds-auth-card__heading {
    font-size: 22px;
    font-weight: 700;
    color: #EDEDEF;
    letter-spacing: -0.02em;
    margin-bottom: 8px;
  }
  .ds-auth-card__sub {
    font-size: 14px;
    font-weight: 400;
    color: #8A8F98;
    margin-bottom: 28px;
    line-height: 1.5;
  }
  .ds-auth-card__form-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
  }
  .ds-auth-card__label {
    font-size: 13px;
    font-weight: 500;
    color: #8A8F98;
    letter-spacing: 0.01em;
  }
  .ds-auth-card__phone-row {
    display: flex;
    gap: 8px;
  }
  .ds-auth-card__country {
    width: 72px;
    height: 52px;
    flex-shrink: 0;
    background: #0d0d0f;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: #EDEDEF;
    font-size: 15px;
    font-weight: 500;
    text-align: center;
    outline: none;
    cursor: pointer;
    transition: border-color 220ms cubic-bezier(0.16, 1, 0.3, 1);
    -webkit-appearance: none;
  }
  .ds-auth-card__country:focus {
    border-color: rgba(224,123,57,0.25);
    box-shadow: 0 0 0 3px rgba(224,123,57,0.08);
  }
  .ds-auth-card__country:focus-visible {
    outline: 2px solid #e07b39;
    outline-offset: 2px;
  }
  .ds-auth-card__phone {
    flex: 1;
    height: 52px;
    padding: 0 16px;
    background: #0d0d0f;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: #EDEDEF;
    font-family: Inter, -apple-system, system-ui, sans-serif;
    font-size: 15px;
    font-weight: 400;
    outline: none;
    transition: border-color 220ms cubic-bezier(0.16, 1, 0.3, 1),
                background 220ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .ds-auth-card__phone::placeholder { color: #4A4D56; }
  .ds-auth-card__phone:hover { border-color: rgba(255,255,255,0.16); }
  .ds-auth-card__phone:focus {
    border-color: rgba(224,123,57,0.25);
    background: #111113;
    box-shadow: 0 0 0 3px rgba(224,123,57,0.08);
  }
  .ds-auth-card__phone:focus-visible {
    outline: 2px solid #e07b39;
    outline-offset: 2px;
  }
  .ds-auth-card__terms {
    font-size: 12px;
    color: #4A4D56;
    line-height: 1.5;
    margin-top: 16px;
    text-align: center;
  }
  .ds-auth-card__terms a {
    color: #8A8F98;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .ds-auth-card__terms a:hover { color: #EDEDEF; }
</style>

<div class="ds-auth-root">
  <div class="ds-auth-card" role="main">
    <div class="ds-auth-card__wordmark">
      <div class="ds-auth-card__logo-mark" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="4" fill="#e07b39" opacity="0.8"/>
          <circle cx="9" cy="9" r="7" stroke="#e07b39" stroke-width="1.2" opacity="0.4"/>
        </svg>
      </div>
      <span class="ds-auth-card__brand-name">Proxima</span>
    </div>

    <h1 class="ds-auth-card__heading">Your society, your vendors.</h1>
    <p class="ds-auth-card__sub">Enter your number to find trusted neighbors for any home service.</p>

    <div class="ds-auth-card__form-row">
      <label class="ds-auth-card__label" for="phone">Mobile number</label>
      <div class="ds-auth-card__phone-row">
        <select class="ds-auth-card__country" aria-label="Country code">
          <option value="+91">+91</option>
        </select>
        <input
          class="ds-auth-card__phone"
          id="phone"
          type="tel"
          inputmode="numeric"
          placeholder="98765 43210"
          autocomplete="tel"
          maxlength="10"
        />
      </div>
    </div>

    <button class="ds-btn-primary" type="submit" style="width:100%">Send OTP</button>

    <p class="ds-auth-card__terms">
      By continuing, you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.
    </p>
  </div>
</div>
```

---

## Do's and Don'ts

### Do's

**DO: Show distance on every vendor card.**
Distance is the primary differentiator. Proxima's core promise is proximity. A vendor card without a visible distance is not a Proxima component — it belongs to a generic marketplace. Every card must show the distance pill in ochre.

**DO: Use "jobs in your society" as a trust signal whenever count is > 0.**
Generic marketplaces show global ratings from strangers. Proxima shows specific proof from your building. This is the Earned Rating principle — always surface it when available. Use the `ds-pill--success` green badge.

**DO: Keep booking to 3 taps maximum.**
Speed over perfect. The system exists for urgency — broken AC at 3pm, no hot water at 11pm. Every extra screen is friction that drives the resident to WhatsApp instead.

**DO: Reserve the ochre glow exclusively for primary actions.**
The `box-shadow: 0 0 20px rgba(224,123,57,0.20)` hover effect signals "this is what you tap next." If it appears on decorative elements, images, or secondary buttons, it loses its directional meaning.

**DO: Use `Confirm Green` with a background tint AND a border — never color alone.**
WCAG AA requires color is not the sole conveyor of meaning. Every semantic state (success, error) must pair its text color with a supporting background tint and icon or text label.

**DO: Respect `env(safe-area-inset-bottom)` on BottomNav.**
The bottom navigation must account for iPhone Home Indicator safe area. Omitting this causes the nav to be obscured on modern iOS devices.

**DO: Use `font-weight: 700` for display headings and `font-weight: 500` for labels.**
Inter's optical weight on dark backgrounds benefits from intentional weight steps. Do not use `font-weight: 400` for headings.

**DO: Apply `antialiased` font smoothing globally.**
The `ds-auth-root` and `body` must carry `-webkit-font-smoothing: antialiased`. On dark backgrounds, sub-pixel rendering bloats strokes and destroys the typographic precision Inter was designed for.

---

### Don'ts

**DON'T: Use white surfaces, light backgrounds, or card grids resembling generic SaaS.**
The PRODUCT.md anti-reference calls out "Generic SaaS (Figma blue, teal primary, white surfaces, card grids)" by name. The three-level dark background hierarchy (Midnight Void → Deep Ground → Raised Surface) is non-negotiable. No component in this system should ever render on a white or light background.

**DON'T: Use gradients as decorative elements.**
Per PRODUCT.md: "Overly playful (doodles, gradients, emoji as icons)" is explicitly listed as an anti-reference. Background gradients, gradient text, rainbow overlays, and aurora/mesh effects are banned. The only acceptable gradient is an extremely subtle `linear-gradient` used to soften a bottom-edge fade on scroll containers.

**DON'T: Use emoji as icons or decorative elements in UI.**
PRODUCT.md anti-references "emoji as icons" directly. All iconography must be inline SVG with `currentColor` stroke. Emoji are ambiguous across platforms, cannot be styled, and violate the system's controlled palette.

**DON'T: Show a vendor card without the distance.**
This violates the Proximity First design principle and regresses the product to looking like a generic marketplace. If distance data is unavailable (e.g., location permission denied), show a skeleton or prompt for location — never render the card without it.

**DON'T: Stack two primary buttons on one screen.**
PrimaryButton carries the system's single expressive moment (ochre glow). Two primary buttons create competing calls-to-action and dilute the urgency signal. Use one PrimaryButton + one GhostButton or plain text link for secondary actions.

**DON'T: Use box-shadows for elevation.**
The elevation philosophy is explicit: no box-shadows. Depth is achieved through background tints and hairline borders. Shadow-based elevation belongs to Material Design, not the Night Dispatch aesthetic. A developer importing a UI library that injects `box-shadow` styles must override them to `none`.

**DON'T: Set body text below 13px or navigable text below 12px.**
PRODUCT.md specifies "Touch targets ≥48dp" and "Contrast ≥4.5:1 for body text." At sizes below 13px on dark backgrounds, even Inter at `antialiased` fails the contrast requirement for meaningful text. Use `caption` (12px) only for timestamps and secondary decorative metadata, and never for interactive labels.

**DON'T: Omit vendor names and faces in favor of category-only listings.**
PRODUCT.md anti-references "Invisible unless you search (no community proof, no personalities)." Vendor cards must always display the vendor's name. Anonymous service categories without a human identity destroy the trust-through-neighbors principle that makes Proxima different from a classified ad board.

**DON'T: Apply the ochre glow to non-interactive elements.**
Glow on images, vendor photos, section headers, or decorative borders trains the eye to ignore it. When the primary CTA glows, the glow is a directional affordance. Overusing it makes it noise.

**DON'T: Use teal, purple, or blue as accent colors.**
These are the generic SaaS palette. The system uses a single accent: Ember Orange (#e07b39). Even for informational states (info badges, tooltips), use neutral grays rather than introducing a blue semantic color.
