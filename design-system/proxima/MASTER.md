# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Proxima
**Theme:** Dark Cinema
**Last Updated:** 2026-06-12
**Source of truth:** `src/lib/ui.ts`

---

## Global Rules

### Color Palette

| Role | Value | Token (`t.*`) | Notes |
|------|-------|---------------|-------|
| Background page | `#020203` | `t.bgDeep` | Midnight Void — never use pure black |
| Background default | `#050506` | `t.bg` | Deep Ground |
| Elevated surface | `#0d0d0f` | `t.elevated` | Raised Surface, used for inputs + modals |
| Card surface | `rgba(255,255,255,0.04)` | `t.surface` | Translucent — not an opaque hex |
| Card surface hover | `rgba(255,255,255,0.07)` | `t.surfaceHover` | Subtle lift on hover |
| Primary text | `#EDEDEF` | `t.ink` | Warm White |
| Secondary text | `#8A8F98` | `t.muted` | Slate Muted |
| Tertiary / disabled | `#4A4D56` | `t.subtle` | Quiet Gray |
| Accent primary | `#e07b39` | `t.ochre` | Ember Orange — the only CTA color |
| Accent hover | `#c96f2f` | `t.ochreDark` | Deep Ember |
| Accent glow | `rgba(224,123,57,0.20)` | `t.ochreGlow` | Focus ring + hover glow |
| Accent dim | `rgba(224,123,57,0.10)` | `t.ochreDim` | Subtle tint bg |
| Accent border | `rgba(224,123,57,0.25)` | `t.ochreBorder` | Selected state borders |
| Border default | `rgba(255,255,255,0.08)` | `t.border` | Hairline, near-invisible |
| Border hover | `rgba(255,255,255,0.16)` | `t.borderHover` | Interactive feedback |
| Success text | `#4ade80` | `t.successText` | |
| Success bg | `rgba(74,222,128,0.08)` | `t.successBg` | |
| Success border | `rgba(74,222,128,0.18)` | `t.successBorder` | |
| Error text | `#f87171` | `t.errText` | |
| Error bg | `rgba(248,113,113,0.08)` | `t.errBg` | |
| Error border | `rgba(248,113,113,0.18)` | `t.errBorder` | |

**Color rule:** The palette is entirely dark. There are no light or neutral backgrounds anywhere in the product.

---

### Typography

| Property | Value |
|----------|-------|
| Body font | `Inter, -apple-system, system-ui, sans-serif` |
| Mono font | `ui-monospace, 'SF Mono', monospace` |

**Scale:**

| Role | Size | Weight | Tracking | Line Height |
|------|------|--------|----------|-------------|
| Heading | 20px–32px | 700–800 | -0.02em | 1.2 |
| Body | 15px | 400–500 | 0 | 1.5 |
| Label / caption | 12px | 500 | +0.04em | 1.4 |

**Rules:**
- Headings always use tight negative tracking (-0.02em)
- Body copy: 15px, never smaller than 13px for readable text
- Labels and metadata: 12px, uppercase tracking only when used as a category tag
- No Google Fonts import — Inter is loaded via system/Next.js font stack

---

### Spacing

| Token | Value |
|-------|-------|
| 4px | Tight gaps, icon-to-label |
| 8px | Inline spacing, small gaps |
| 12px | Compact padding |
| 16px | Standard element padding |
| 20px | Card inner padding |
| 24px | Section sub-padding |
| 28px | Medium section gap |
| 32px | Large section gap |
| 48px | Section margins, hero padding |

Base unit is 4px. All spacing values are multiples of 4.

---

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `t.radius` | `8px` | Inputs, small buttons, pills |
| `t.radiusLg` | `14px` | Cards, modals, panels |
| `t.radiusFull` | `9999px` | Status pills, tags |

---

### Motion

| Property | Value |
|----------|-------|
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` — expo-out |
| Default duration | 200ms |
| Micro transitions | 150ms (opacity, color) |
| Enter animations | 250–300ms |

All interactive elements use the expo-out curve. No linear or ease-in-out. Always respect `prefers-reduced-motion`.

---

## Component Specs

### Cards

```css
.card {
  background: rgba(255,255,255,0.04);
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 20px;
  transition: border-color 200ms cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.card:hover {
  border-color: rgba(255,255,255,0.16);
  /* NO box-shadow — dark cinema spec uses glow only on interactive accent elements */
}
```

### Inputs

```css
.input {
  background: #0d0d0f;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 12px 16px;
  color: #EDEDEF;
  font-size: 15px;
  transition: border-color 200ms cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

.input::placeholder {
  color: #4A4D56;
}

.input:focus {
  outline: none;
  border-color: #e07b39;
  box-shadow: 0 0 0 3px rgba(224,123,57,0.20);
}
```

### Buttons — Primary

```css
.btn-primary {
  background: #e07b39;
  color: #EDEDEF;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 200ms cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary:hover {
  background: #c96f2f;
  box-shadow: 0 0 20px rgba(224,123,57,0.20);
}

.btn-primary:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(224,123,57,0.20);
}
```

### Buttons — Ghost

```css
.btn-ghost {
  background: transparent;
  color: #EDEDEF;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-ghost:hover {
  border-color: rgba(255,255,255,0.16);
}
```

### Pills / Tags

```css
/* Default pill */
.pill {
  background: rgba(255,255,255,0.05);
  border-radius: 9999px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #8A8F98;
}

/* Success pill */
.pill-success {
  background: rgba(74,222,128,0.08);
  border: 1px solid rgba(74,222,128,0.18);
  color: #4ade80;
  border-radius: 9999px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
}

/* Error pill */
.pill-error {
  background: rgba(248,113,113,0.08);
  border: 1px solid rgba(248,113,113,0.18);
  color: #f87171;
  border-radius: 9999px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
}
```

### Modals / Overlays

```css
.modal-overlay {
  background: rgba(2,2,3,0.80);
  backdrop-filter: blur(8px);
}

.modal {
  background: #0d0d0f;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 32px;
  max-width: 520px;
  width: 90%;
}
```

---

## Anti-Patterns (Do NOT Use)

These are **hard rules**. No exceptions.

| Forbidden | Why |
|-----------|-----|
| Light backgrounds (`#fff`, `#f8fafc`, cream, sand, warm neutrals) | Breaks dark cinema identity |
| Red CTAs (`#DC2626`, `#ef4444`, or any pure red for actions) | Red is reserved for errors only — accent is Ember Orange |
| Pure black (`#000000`) | Too flat — minimum background is `#020203` |
| `box-shadow` on cards or layout elements | Dark surfaces don't cast light shadows — use border changes |
| Glow on non-interactive elements | Glow (ochre) is reserved for hover/focus states on interactive elements |
| Emoji as icons | SVG only (Lucide, Heroicons, or custom) |
| Side-stripe borders (left-border accent decoration) | Dated pattern — use pill or badge instead |
| Gradient text (`background-clip: text`) | Conflicts with flat cinema aesthetic |
| `transform: translateY(-2px)` on card hover | Use border-color change instead — no layout-shifting hovers |
| `opacity: 0.9` as a hover state | Use explicit color token (`t.ochreDark`) |
| Missing `cursor: pointer` | All clickable elements must declare it |
| Instant state changes | All interactive elements require transitions (150–200ms minimum) |
| Invisible focus states | Focus ring must be visible — use `0 0 0 3px rgba(224,123,57,0.20)` |

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] All backgrounds use dark cinema palette — no light values
- [ ] Accent color is `#e07b39` (ochre) — not red, not blue, not purple
- [ ] No `#000000` — use `#020203` as the darkest surface
- [ ] No `box-shadow` on cards — border-color transitions only
- [ ] Inputs use `#0d0d0f` background with ochre focus ring
- [ ] All buttons have visible focus states (`box-shadow: 0 0 0 3px rgba(224,123,57,0.20)`)
- [ ] No emoji used as icons — SVG only
- [ ] `cursor: pointer` on all clickable elements
- [ ] All transitions use `cubic-bezier(0.16, 1, 0.3, 1)` at 150–200ms
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
- [ ] Text contrast: `#EDEDEF` on `#050506` passes WCAG AA
