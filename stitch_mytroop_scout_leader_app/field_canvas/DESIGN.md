---
name: Field & Canvas
colors:
  surface: '#fff9ec'
  surface-dim: '#dfd9cd'
  surface-bright: '#fff9ec'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f3e6'
  surface-container: '#f4ede0'
  surface-container-high: '#eee8db'
  surface-container-highest: '#e8e2d5'
  on-surface: '#1e1c14'
  on-surface-variant: '#45483e'
  inverse-surface: '#333028'
  inverse-on-surface: '#f6f0e3'
  outline: '#75786d'
  outline-variant: '#c5c8ba'
  surface-tint: '#516537'
  primary: '#384b21'
  on-primary: '#ffffff'
  primary-container: '#4f6336'
  on-primary-container: '#c7dea6'
  inverse-primary: '#b7ce97'
  secondary: '#4b6451'
  on-secondary: '#ffffff'
  secondary-container: '#cae7ce'
  on-secondary-container: '#4f6955'
  tertiary: '#494537'
  on-tertiary: '#ffffff'
  tertiary-container: '#615c4e'
  on-tertiary-container: '#ddd5c3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3ebb2'
  primary-fixed-dim: '#b7ce97'
  on-primary-fixed: '#102000'
  on-primary-fixed-variant: '#3a4c22'
  secondary-fixed: '#cdead1'
  secondary-fixed-dim: '#b1ceb6'
  on-secondary-fixed: '#072011'
  on-secondary-fixed-variant: '#334c3a'
  tertiary-fixed: '#eae2d0'
  tertiary-fixed-dim: '#cdc6b4'
  on-tertiary-fixed: '#1f1b10'
  on-tertiary-fixed-variant: '#4b4639'
  background: '#fff9ec'
  on-background: '#1e1c14'
  surface-variant: '#e8e2d5'
typography:
  display-lg:
    fontFamily: Epilogue
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Epilogue
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Epilogue
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Epilogue
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.005em
  headline-sm:
    fontFamily: Epilogue
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Public Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Public Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Public Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2.5rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system embodies the ethos of modern scouting and open-air stewardship: communal, grounded, resourceful, and deeply connected to the natural world. It translates traditional outdoor heritage into a calm, contemporary editorial workspace. The target audience comprises youth leaders, outdoor educators, community organizers, and field coordinators who require clarity and calm under active conditions.

The emotional signature is airy, disciplined, and refreshing—evoking sunlit canvas tents, sun-bleached rope, pressed field journals, and pine needle canopies.

### Style Movements
The aesthetic bridges **Warm Minimalist Editorial** with **Tactile Utility**:
- **Airy Negative Space:** Interfaces breathe through generous margins and soft, mist-tinted backdrops rather than clinical stark whites.
- **Organic Earth Tones:** Layered textiles, paper, and foliage replace artificial digital neons.
- **Utilitarian Elegance:** Structured metadata badges, precise typographic alignments, and purposeful toolbars ground the organic palette into a high-utility production system.

## Colors

The palette draws inspiration directly from field uniforms, canvas tarps, and coastal Mediterranean grove flora. 

### Role Allocations

- **Canvas & Sand (Surfaces & Backdrops):**
  - App Canvas Base: `#F5F2EB` (Sun-bleached linen)
  - Surface Subdued: `#E8E2D5` (Warm field khaki)
  - Surface Container / Muted Borders: `#DFD7C5` (Sandy canvas border)
- **Foliage & Meadow (Accents & Highlights):**
  - Surface Tint Light: `#EAF6EC` (Morning dew)
  - Interactive Wash & Soft Badges: `#DFF2E1` (Soft pasture)
  - Focus Ring & Accent Fill: `#CBE8CF` (Fresh eucalyptus)
- **Olive & Canopy (Action & Hierarchy):**
  - Interactive Action Default: `#4F6336` (Scout olive green)
  - Interactive Action Hover: `#5D6E43` (Sunlit canopy)
  - Interactive Action Active / Focus: `#3B4D29` (Deep pine root)
- **Deep Umber Olive (Typography & Semantics):**
  - Text Primary: `#24331E` (Crisp dark olive trunk; minimum 7:1 contrast on canvas)
  - Text Secondary: `#475440` (Weathered moss)
  - Text Subtle / Disabled: `#7A8772` (Stone lichen)

### Usage Rules
- Never use pure black (`#000000`) or pure digital white (`#FFFFFF`) in raw layouts. Use `#FDFCF7` for card foregrounds and high-contrast badges.
- Primary buttons and active states must consistently use `#4F6336` with inverted `#FDFCF7` typography to ensure immediate readability and distinct affordance.

## Typography

The typographic system combines the structured, geometric character of **Epilogue** for display titles with the civic legibility and balanced proportions of **Public Sans** for functional interface text.

- **Epilogue (Headlines):** Imparts an artisanal, scout-journal quality. It captures weight without feeling industrial or tech-heavy.
- **Public Sans (Body & System Labels):** Originally crafted for clear, accessible governance systems, it provides absolute clarity when rendering coordinates, lists, badges, and rosters.

Headings should avoid all-caps, maintaining a thoughtful, bookish tone. Labels and utility badges use medium-to-semibold weights with micro-letterspacing for elevated legibility across khaki surfaces.

## Layout & Spacing

The layout is built on a responsive 12-column fluid grid on desktop (conforming to a maximum container width of `1320px`), an 8-column layout on tablet, and a 4-column layout on mobile devices.

### Layout Rhythm
- **Canvas Boundaries:** Margins transition smoothly from `1.25rem` on mobile to `2.5rem` on wide desktop screens to preserve an open, breathable canvas.
- **Structural Density:** Spacing between disparate major sections uses generous intervals (`space-xl`), while component internals are structured strictly along an 8pt step scale (`space-xs`, `space-sm`, `space-md`, `space-lg`).
- **Reflow Architecture:** Dual-pane inspection views (e.g., troop lists alongside field detail cards) sit side-by-side on desktop views (`>= 1024px`), stack sequentially on tablet displays (`< 1024px`), and transition into dedicated full-width sheets on mobile screens (`< 640px`).

## Elevation & Depth

To remain faithful to natural materials, depth avoids artificial drop shadows and glowing neon envelopes. Instead, spatial hierarchy is communicated via **tonal stratification** and **diffused earth cast shadows**.

### Tonal Tiers
1. **Foundation Level (Canvas):** `#F5F2EB` serves as the outdoor ground plane.
2. **Sheet / Card Level (Lifted Canvas):** Cards sit on `#FDFCF7` or soft tint `#EAF6EC`, cleanly separated from the canvas using a hairline border of `#DFD7C5`.
3. **Floating Overlays & Menus:** Dropdowns, popovers, and sticky toolbars take `#FDFCF7` bordered with `#CBE8CF`.

### Shadow Signature
When tactile depth is required for interactive lift (modals, active drags, and floating action modules), use an ultra-diffused shadow tinted with deep olive instead of neutral gray:
`0 8px 24px -4px rgba(36, 51, 30, 0.08), 0 2px 6px -1px rgba(36, 51, 30, 0.04)`

This tint anchors floating elements to the earthy background naturally without feeling synthetic.

## Shapes

The design system employs a **Soft** shape geometry (`roundedness: 1`).

- **Standard Elements (0.25rem / 4px):** Checkboxes, tags, input fields, and compact buttons maintain a trimmed, field-kit look with structured corners.
- **Containers & Cards (0.5rem / 8px):** Primary content cards, list panels, and modals feature gentle corner rounding reminiscent of archival pocket folders.
- **Pill Exceptions:** Filter chips and status tags can adopt fully rounded pill radii (`9999px`) to create organic differentiation against structural card frames.

## Components

### Buttons
- **Primary Action:** Solid `#4F6336` background, `#FDFCF7` text, font weight 600. Hover state transitions to `#5D6E43`. Pressed state settles to `#3B4D29`. Border radius is `0.25rem`. Padding is `0.625rem 1.25rem`.
- **Secondary (Khaki Outline):** `#FDFCF7` background with a 1.5px solid `#DFD7C5` border and `#24331E` text. Hover shifts background to `#E8E2D5`.
- **Ghost (Field Green):** Transparent background with `#4F6336` text. Hover adopts `#EAF6EC`.

### Chips & Badges
- **Status / Activity Badges:** Soft pill shape (`9999px`), `0.25rem 0.75rem` padding. Rendered in `#DFF2E1` fill with `#24331E` text. 
- **Filter Chips:** Light khaki container (`#E8E2D5`) with subtle `#DFD7C5` border. When selected, transitions to `#4F6336` fill with `#FDFCF7` text.

### Inputs & Text Areas
- Background sits at `#FDFCF7` to create crisp separation from `#F5F2EB` layouts.
- Resting border: 1px solid `#DFD7C5`. Text color: `#24331E`.
- Focus state: 1.5px border in `#4F6336` with a soft outer ring in `#CBE8CF` (3px spread).
- Placeholder text: `#7A8772`.

### Checkboxes & Radios
- Box size: `1.125rem` square with `0.25rem` radius for checkboxes; full circle for radios.
- Unchecked state: `#FDFCF7` background with 1.5px `#DFD7C5` border.
- Checked state: `#4F6336` fill with an interior `#FDFCF7` checkmark icon.

### Cards
- Base surface is `#FDFCF7` encased in a crisp 1px `#DFD7C5` border.
- Optional header accent stripe: A subtle top border or section header wash using `#EAF6EC`.
- Cards never rely on heavy blur effects; content segments inside cards are separated by `#E8E2D5` hairlines.

### Lists & Rosters
- List rows maintain an alternating or clean hairline structure (`#E8E2D5` row divider).
- Row hover states reveal a gentle background transition to `#EAF6EC`.
- Metadata (timestamps, roll numbers, gear badges) uses `label-sm` rendered in `#475440`.