---
name: Tzofim Nature Minimalist
colors:
  surface: '#e9ffed'
  surface-dim: '#c7e0cd'
  surface-bright: '#e9ffed'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e0fae6'
  surface-container: '#daf4e1'
  surface-container-high: '#d5efdb'
  surface-container-highest: '#cfe9d5'
  on-surface: '#0a2014'
  on-surface-variant: '#434840'
  inverse-surface: '#1f3528'
  inverse-on-surface: '#ddf7e3'
  outline: '#747970'
  outline-variant: '#c4c8be'
  surface-tint: '#4d6447'
  primary: '#4d6447'
  on-primary: '#ffffff'
  primary-container: '#829b7a'
  on-primary-container: '#1d3219'
  inverse-primary: '#b4ceaa'
  secondary: '#5a6154'
  on-secondary: '#ffffff'
  secondary-container: '#dbe2d2'
  on-secondary-container: '#5e6558'
  tertiary: '#695d44'
  on-tertiary: '#ffffff'
  tertiary-container: '#a09376'
  on-tertiary-container: '#352c16'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cfeac5'
  primary-fixed-dim: '#b4ceaa'
  on-primary-fixed: '#0b2009'
  on-primary-fixed-variant: '#364c31'
  secondary-fixed: '#dee5d5'
  secondary-fixed-dim: '#c2c9b9'
  on-secondary-fixed: '#171d14'
  on-secondary-fixed-variant: '#42493d'
  tertiary-fixed: '#f1e1c0'
  tertiary-fixed-dim: '#d4c5a6'
  on-tertiary-fixed: '#221b07'
  on-tertiary-fixed-variant: '#50462e'
  background: '#e9ffed'
  on-background: '#0a2014'
  surface-variant: '#cfe9d5'
typography:
  display-lg:
    fontFamily: Heebo
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Heebo
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Heebo
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Heebo
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Heebo
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Heebo
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Heebo
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Heebo
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Heebo
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Heebo
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is tailored for Israeli youth movement leaders (Madrichim) managing day-to-day scouting operations, lesson planning, and group logistics. The aesthetic translates the rugged, outdoor ethos of the Tzofim into a refined, calming, and exceptionally organized mobile interface.

The design philosophy blends **Modern Warm Minimalism** with tactile outdoor influences:
- **Atmosphere:** Natural, grounded, and orderly. The interface eschews clinical stark whites in favor of an organic warm canvas, emulating parchment, field notebooks, canvas tents, and forest foliage.
- **Tone:** Empathetic, supportive, youthful yet mature enough to instill leadership and confidence.
- **Motion & Interaction:** Fluid, gentle, and deliberate. Transitions mimic soft page turns and gentle settling cards, avoiding frantic or aggressive micro-animations.
- **RTL-Native Thinking:** Purpose-built from the ground up for modern Hebrew, honoring right-to-left optical balance, typographic hierarchy, and natural thumb ergonomics for one-handed mobile field use.

## Colors

The palette draws directly from the physical uniforms, ropes, tarps, and eucalyptus groves characteristic of Israeli scout camps:

- **Primary Background (`#F6F3E9`):** A warm, calm linen-cream that coats full-screen viewports, reducing glare under intense Mediterranean daylight while preserving an approachable, non-corporate aesthetic.
- **Surface & Containers (`#FFFFFF`):** Crisp pure white applied exclusively to floating modules, bottom sheets, navigation bars, and actionable cards to establish crisp optical separation against the warm canvas.
- **Primary / Brand Action (`#829B7A`):** A soft, natural Sage Green. Used for primary buttons, active tab indicators, selected switches, and key affirmations. High-contrast text on this color must use `#FFFFFF`.
- **Secondary Accent (`#DCE3D3`):** Light Khaki. Utilized for subtle chip backgrounds, tag containers, selected state backdrops, and active progress step fills.
- **Warm Highlight (`#E8D8B8`):** Light Sand / Cordage tone. Applied for warm badges, pinned items, warning states, campfire/evening event highlights, and honorary achievements.
- **Text & High Contrast (`#304638`):** Deep Forest Scout Green. Serves as the primary functional text color, delivering near-black legibility with a distinctly botanical, organic character.
- **Muted / Secondary Text (`#647A6B`):** A soft slate-sage providing balanced typographic hierarchy for secondary descriptions, timestamps, and placeholder states without resorting to harsh synthetic grays.

## Typography

Typography relies uniformly on **Heebo**, a geometric sans-serif specifically optimized for modern Hebrew orthography and paired bilingual legibility:

- **RTL Baseline:** The application is natively set to `dir="rtl"` with default `text-align: right`. Number strings, phone numbers, and time formats retain bidirectional isolation (`unicode-bidi: isolate; direction: ltr` when embedded).
- **Weight Contrast:** Hebrew forms benefit substantially from clear weight steps; heavy headers (`700` and `800`) provide authoritative guidance, while body copy (`400` and `500`) maintains crisp counter-spaces even on low-cost handheld devices.
- **Line Heights:** Generous line-heights prevent ascenders and descenders from colliding when combining Hebrew diacritics or standard text alongside numeric identifiers.

## Layout & Spacing

The layout is built for fluid touch ergonomics on compact and standard mobile form factors (360px – 430px wide viewports) with fluid stretch up to tablet screens:

- **Mobile Viewport Structure:** 4-column fluid layout with a rigid `16px` (`margin`) outer canvas padding and `16px` (`gutter`) column spacing.
- **Rhythm & Touch Targets:** All interactive controls observe a minimum bounding box of 48px height to enable confident single-thumb operation during outdoor physical activities.
- **Bottom Navigation Anchor:** Critical actions, sheet triggers, and navigation nodes are anchored to the lower 40% of the display for thumb reachability, respecting native safe area insets (`env(safe-area-inset-bottom)`).
- **Scroll Buffering:** Scrollable containers maintain a `space-xl` (32px) buffer at bottom viewports to avoid overlapping with floating action elements or home indicators.

## Elevation & Depth

Visual hierarchy uses physical material separation rather than aggressive dark drop shadows. Depth is achieved via crisp white surfaces resting gently atop the warm `#F6F3E9` background:

- **Level 0 (Base Canvas):** Flat `#F6F3E9`. No shadow. Used for global background surfaces and inactive grouped track areas.
- **Level 1 (Standard Card & Module):** `#FFFFFF` surface with an ambient, tinted drop shadow: `0px 4px 16px rgba(48, 70, 56, 0.05)`. This soft pine-tinted shadow anchors content softly without harshness.
- **Level 2 (Active Sheets & Modals):** `#FFFFFF` surface elevated above backdrop scrim (`rgba(48, 70, 56, 0.3)`), using shadow `0px 8px 30px rgba(48, 70, 56, 0.12)`.
- **Level 3 (Floating Controls / FAB):** `#829B7A` or `#FFFFFF` pill using `0px 6px 20px rgba(48, 70, 56, 0.18)` for clear spatial detachment during scroll.
- **Ghost Outlines:** Instead of heavy bounding lines, cards employ a subtle border (`1px solid rgba(48, 70, 56, 0.04)`) to retain crisp definition in high-brightness outdoor ambient lighting.

## Shapes

The geometric signature combines soft organic corners with structural discipline:

- **Default Modules & Cards (`rounded-2xl` / 16px):** Core functional containers, attendance tiles, lesson builder modules, and list groupings feature smooth, friendly 16px corners.
- **Chips, Badges & Small Inputs (`rounded-lg` / 10px):** Form controls and metadata tags maintain structured, soft curves.
- **Pill Terminals (`rounded-full` / 9999px):** Primary call-to-action buttons, active attendance toggles, status pills, and floating action triggers use full pill rounding to suggest touch friendliness and tactile comfort.

## Components

### Buttons
- **Primary:** Full-pill shaped, background `#829B7A`, text `#FFFFFF` (14px Bold Heebo). Active state reduces scale to `0.98` with a subtle background shift to `#6E8766`. Minimum height 48px.
- **Secondary:** Full-pill shaped, background `#DCE3D3`, text `#304638` (14px Bold Heebo).
- **Subtle / Ghost:** Transparent background with `#304638` text and an optional `#DCE3D3` border.

### Cards & Activity Tiles
- Background `#FFFFFF`, rounded 16px, padding `space-md` (16px), elevation Level 1.
- Header row aligns title right (`#304638`, `headline-sm`) with an icon or badge anchored to the left.
- Interactive list cards feature an active state using a gentle `#DCE3D3` (Light Khaki) wash.

### Chips & Badges
- **Status Badges:** Small pill containers with 4px vertical / 10px horizontal padding. Completed/Approved uses `#DCE3D3` fill with `#304638` text. Urgent/Highlight uses `#E8D8B8` with `#304638` text.
- **Filter Chips:** Inactive uses `#FFFFFF` with 1px border `rgba(48, 70, 56, 0.08)`. Active uses `#829B7A` fill with `#FFFFFF` text.

### Form Inputs & Search
- Surface `#FFFFFF`, border `1.5px solid #DCE3D3`, rounded 12px, height 48px, text aligned right (`#304638`).
- Focus state switches border to `#829B7A` with a soft glow: `0 0 0 3px rgba(130, 155, 122, 0.25)`.
- Leading/Trailing icons (e.g., search glass, clear icon) in `#647A6B`.

### Lists & Attendance Toggles
- Roster items feature an avatar or scout neckerchief (Anivah) badge on the far right, scout name and role centered, and a toggle on the far left.
- Attendance toggles feature a three-segment pill (Present / Absent / Late) with smooth sliding background indicator in `#829B7A` or `#E8D8B8`.

### Checkboxes & Radios
- Rounded 6px (checkbox) or circular (radio), 20x20px dimension.
- Inactive: `#FFFFFF` fill with `2px solid #DCE3D3`.
- Active: `#829B7A` solid fill with `#FFFFFF` checkmark or center pip.

### Iconography Style
- 2px consistent stroke, rounded terminals and joins. 
- Outline-only aesthetic drawn from outdoor symbols: fleur-de-lis / scout knot, tent, campfire, compass, rope, flag, water canteen, and calendar.
- Default color `#304638`, muted color `#647A6B`, active/highlight color `#829B7A`.