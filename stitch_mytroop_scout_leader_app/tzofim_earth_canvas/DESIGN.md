---
name: Tzofim Earth & Canvas
colors:
  surface: '#fcf9f1'
  surface-dim: '#dcdad2'
  surface-bright: '#fcf9f1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3eb'
  surface-container: '#f1eee6'
  surface-container-high: '#ebe8e0'
  surface-container-highest: '#e5e2da'
  on-surface: '#1c1c17'
  on-surface-variant: '#4d453c'
  inverse-surface: '#31312b'
  inverse-on-surface: '#f3f1e9'
  outline: '#7f756b'
  outline-variant: '#d1c4b9'
  surface-tint: '#715b3e'
  primary: '#715b3e'
  on-primary: '#ffffff'
  primary-container: '#8b7355'
  on-primary-container: '#0a0400'
  inverse-primary: '#dfc29f'
  secondary: '#665d4d'
  on-secondary: '#ffffff'
  secondary-container: '#eee1cc'
  on-secondary-container: '#6c6353'
  tertiary: '#705b3b'
  on-tertiary: '#ffffff'
  tertiary-container: '#8b7352'
  on-tertiary-container: '#090400'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#fcdeba'
  primary-fixed-dim: '#dfc29f'
  on-primary-fixed: '#281903'
  on-primary-fixed-variant: '#574329'
  secondary-fixed: '#eee1cc'
  secondary-fixed-dim: '#d1c5b1'
  on-secondary-fixed: '#211b0e'
  on-secondary-fixed-variant: '#4e4637'
  tertiary-fixed: '#fcdeb6'
  tertiary-fixed-dim: '#dfc29c'
  on-tertiary-fixed: '#271902'
  on-tertiary-fixed-variant: '#574326'
  background: '#fcf9f1'
  on-background: '#1c1c17'
  surface-variant: '#e5e2da'
  camel-accent: '#9E825D'
  deep-khaki-brown: '#7A6548'
  canvas-cream: '#F5F1E6'
  sand-light: '#E2DACB'
  forest-khaki-text: '#383428'
  forest-khaki-dark: '#322E23'
  muted-khaki-text: '#6E6754'
  card-surface: '#FFFFFF'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
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
  gutter-sm: 0.75rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system translates the organic, time-honored discipline of the Tzofim youth movement into an earthy, warm minimalist mobile toolset. Designed intentionally for Madrichim (youth leaders) operating in field environments, outdoor camps, and community clubhouses (Shevet), the aesthetic pairs natural raw canvas tones with modern editorial discipline.

The visual identity relies on **Warm Minimalist Tactility**:
- **Atmosphere:** Grounded, sun-warmed, and serene. In place of synthetic greens and stark clinical whites, the environment shifts toward warm sand, weathered field canvas, light desert khaki, and camel leather accents.
- **Tone:** Practical, trustworthy, warm, and mature. It projects structured leadership without feeling stiff or bureaucratic.
- **Motion & Response:** Grounded and physical. Cards lift gently, toggles slide with deliberate inertia, and transitions recall turning heavy parchment leaves in a scout field notebook.
- **RTL-Native Ergonomics:** Built ground-up for right-to-left interaction, giving visual weight to the right leading edges, accommodating bilingual Hebrew and English data, and clustering high-frequency interactions within single-thumb reach.

## Colors

The palette directly honors the scouting heritage: desert sand, khaki uniforms, hemp ropes, canvas tents, and sun-bleached olive wood.

- **Primary Action (`#8B7355` / Warm Khaki Camel):** Drives primary interactive triggers, active tab selections, and key status affirmations. High-contrast labels on primary buttons must remain crisp pure white (`#FFFFFF`).
- **Secondary Tone (`#D2C6B2` / Light Warm Khaki):** Forms container backdrops, segmented controls, inactive card borders, and chip badges.
- **Tertiary Accent (`#A38A67` / Desert Sandstone):** Used for auxiliary highlights, active step indicators, and tertiary badges.
- **Neutral Canvas (`#F7F4EC` / Soft Warm Cream):** The foundational viewport surface. Replaces cold whites to minimize outdoor glare under bright daylight while providing a warm parchment feel.
- **Surfaces (`#FFFFFF`):** High-density cards, modal sheets, and floating bars sit in pure white, popping crisply against the `#F7F4EC` cream canvas.
- **Typography & High Contrast (`#383428` & `#322E23` / Deep Forest Khaki):** Delivers deep, near-black contrast while maintaining an organic earthy undertone.
- **Secondary Copy (`#6E6754` / Muted Field Khaki):** Handles helper text, timestamps, captions, and empty-state iconography with legible warmth.

## Typography

Typography prioritizes open, geometric legibility across both Latin and Hebrew forms, maintaining balanced counter-spaces and warm terminal curves.

- **Scale & Contrast:** Display and Headline roles employ weights `700` and `800` to give clear authority to scouting ranks, group numbers, and operational dates. Body roles stay at `400` and `500` to preserve reading flow across small mobile viewports.
- **RTL & Number Handling:** When rendering RTL copy, ensure numbers, dates, and callout times are wrapped with bidirectional isolation (`dir="ltr"` or `unicode-bidi: isolate`) to prevent punctuation and parentheses transposition.
- **Vertical Spacing:** Generous line heights give room for mixed diacritics and bilingual titles without vertical collision.

## Layout & Spacing

The layout is optimized for high-intensity mobile use, where one-handed ergonomics and legible spacing take precedence over visual clutter.

- **Grid Architecture:** 
  - **Mobile (360px - 599px):** 4-column fluid layout, `16px` outer margin, `16px` gutter. Critical actions anchor within the lower screen boundary.
  - **Tablet (600px - 1023px):** 8-column layout, `24px` margin, `16px` gutter. Double-pane side-by-side roster and lesson management.
  - **Desktop (1024px+):** 12-column fixed grid with maximum content width of 1120px, centered on canvas with `32px` margins.
- **Rhythm & Touch Bounding:** Primary buttons, list rows, and multi-state chips strictly honor a minimum 48px height target to guarantee tap reliability during movement in outdoor environments.
- **Bottom Buffer:** Bottom views enforce a `space-xl` (32px) buffer plus native safe area padding (`env(safe-area-inset-bottom)`) so primary sheets and bottom action bars do not obscure scrollable lists.

## Elevation & Depth

Visual depth is conveyed through tactile surface layering and warm, earth-tinted ambient shadows instead of harsh, synthetic grays. Pure white surfaces lift off the `#F7F4EC` warm cream background with gentle optical weight:

- **Level 0 (Canvas Surface):** Soft cream (`#F7F4EC` or `#F5F1E6`). Flat, zero shadow.
- **Level 1 (Cards, Modules, Input Fields):** `#FFFFFF` surfaces with an ambient shadow: `0px 4px 18px rgba(56, 52, 40, 0.06)`. Accompanied by a 1px border tinted in `rgba(56, 52, 40, 0.05)` to maintain separation in bright sunlight.
- **Level 2 (Dropdowns, Floating Toolbars, Bottom Navigation):** Raised `#FFFFFF` containers with `0px 8px 24px rgba(56, 52, 40, 0.10)`.
- **Level 3 (Modals, Action Sheets, Floating Buttons):** Elevated floating elements using `0px 12px 32px rgba(56, 52, 40, 0.16)` over a warm scrim (`rgba(50, 46, 35, 0.35)`).
- **Surface Transitions:** Pressed states on white cards reduce elevation to Level 0 with a subtle background shift to `#E2DACB` (Light Sand).

## Shapes

The design language balances structural discipline with approachable, rounded corners:

- **Cards, Content Modules & Panels:** Default to `rounded-lg` (16px / 1rem) for an inviting, warm tactile shape that feels like thick cardboard or folded canvas sheets.
- **Buttons, Toggles & Filters:** Full-pill rounding (`rounded-full` / 9999px) for tap-friendly triggers, quick attendance toggles, and search badges.
- **Inputs & Dropdown Boxes:** Softened 10px–12px corners providing clear input affordances while retaining structural alignment with grid boundaries.

## Components

### Buttons
- **Primary:** Full-pill shaped, background `#8B7355` (Warm Khaki Camel), text `#FFFFFF` (`label-lg`). Tap feedback drops scale to `0.98` with background shifting to `#7A6548`. Minimum 48px height.
- **Secondary:** Full-pill shaped, background `#E2DACB`, text `#383428` (`label-lg`). Active state fills with `#D2C6B2`.
- **Ghost / Tertiary:** Transparent background, `#383428` text, with an optional 1.5px border in `#D2C6B2`.

### Cards & Activity Tiles
- Background `#FFFFFF`, rounded 16px, padding `space-md` (16px), Level 1 ambient shadow.
- Header row features an earthy badge or section category on the left, with title aligned right in `#383428` (`headline-sm`).
- Border treatment uses `1px solid rgba(56, 52, 40, 0.06)` for outdoor edge contrast.

### Chips & Badges
- **Status Badges:** Small pill tags with 4px vertical and 10px horizontal padding. Approved/Present uses `#E2DACB` background with `#383428` text. Priority/Campfire uses `#A38A67` background with `#FFFFFF` text.
- **Interactive Filter Chips:** Unselected chips use `#FFFFFF` with a 1px border `#D2C6B2` and `#383428` copy. Selected chips shift to `#8B7355` fill with `#FFFFFF` copy.

### Input Fields & Search
- Surface `#FFFFFF`, border `1.5px solid #D2C6B2`, rounded 12px, 48px minimum height, right-aligned text in `#383428`.
- Focus state activates `#8B7355` border with an ambient ring: `0 0 0 3px rgba(139, 115, 85, 0.20)`.
- Trailing and leading icons (search, datepicker, clear) rendered in `#6E6754`.

### Attendance Roster Rows & Multi-Segment Toggles
- Roster items set inside `#FFFFFF` cards: youth scout name and rank right-aligned, status indicator or neckerchief icon on the far right, and segmented toggle anchored left.
- Segmented control utilizes a `#F5F1E6` track with a sliding `#8B7355` or `#E2DACB` indicator pill to switch between Present, Absent, and Late.

### Checkboxes & Radio Buttons
- 22px × 22px bounding box with 6px rounded corners (checkbox) or circular (radio).
- Inactive: `#FFFFFF` fill with `2px solid #D2C6B2`.
- Active: `#8B7355` fill with pure white `#FFFFFF` checkmark or interior dot.

### Specialized Scout Movement Modules
- **Camp Lesson Tracker:** Stacked chronological steps connected by a 2px vertical guide rail in `#D2C6B2`. Completed milestones render with solid `#8B7355` node points; pending items render with `#FFFFFF` fills and `#D2C6B2` borders.
- **Rope & Knot Knowledge Badges:** Small tactile square cards (72px × 72px) with 12px rounding, featuring line-art knot illustrations in `#7A6548` over a `#F5F1E6` background.