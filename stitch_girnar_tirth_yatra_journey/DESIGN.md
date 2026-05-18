# Design System: Sacred Cinema

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **The Digital Sanctuary**. 

Moving away from the utilitarian "app-like" feel of modern interfaces, this system treats the digital screen as a sacred space. It draws inspiration from the light-and-shadow interplay of ancient temples at dawn. We break the "template" look by utilizing **intentional asymmetry**, where content isn't trapped in a rigid center-column but flows like a ritual path. Overlapping elements—such as a stone-carved heading bleeding over a high-resolution image—create a sense of physical depth and "Editorial Grandeur" that feels curated, not generated.

## 2. Colors
Our palette is rooted in the earth and the divine. We use deep shadows to create focus and metallic accents to guide the spirit.

### Palette Roles
- **Primary (`#e6c364`):** The "Sacred Gold." Used for primary calls to divine action and key branding moments.
- **Secondary (`#ffb68c`):** "Spiritual Saffron." Reserved for highlights, notifications, or active states that require warmth.
- **Surface (`#131313`):** The "Deep Charcoal." The foundation of the sanctuary.
- **On-Surface (`#e5e2e1`):** "Cream/Off-white." Used for body text to ensure a soft, low-strain reading experience against the dark void.

### The "No-Line" Rule
Designers are prohibited from using 1px solid borders to section off content. Traditional dividers are "visual noise" that breaks immersion. Boundaries must be defined through:
- **Background Shifts:** Use `surface-container-low` (`#1c1b1b`) transitions to define a new content block.
- **Tonal Transitions:** A soft gradient from `surface` to `surface-container` is preferred over a hard edge.

### Surface Hierarchy & Nesting
Treat the UI as a series of nested physical layers. 
- Use `surface-container-lowest` (`#0e0e0e`) for the most distant background elements.
- Use `surface-container-highest` (`#353534`) for the most prominent interactive cards.
By nesting a "higher" surface inside a "lower" one, you create a natural, sophisticated lift without the need for dated drop shadows.

### The "Glass & Gradient" Rule
To capture the "Shopify Editions" aesthetic, floating elements (like navigation bars or modal overlays) must utilize **Glassmorphism**.
- **Fill:** `surface` at 60% opacity.
- **Effect:** `backdrop-blur` (20px - 40px).
- **Edge:** A subtle gradient stroke transitioning from `primary` (#e6c364) to `primary-container` (#c9a84c) at 20% opacity.

## 3. Typography
The typography is a dialogue between the eternal and the modern.

- **Display & Headlines (Newsreader/Cinzel):** These are our "Stone-Carved" elements. Large scale (`display-lg` at 3.5rem) with tighter letter spacing. Use these for poetic statements or section starts. They should feel authoritative and timeless.
- **Body & Titles (Manrope/Lato):** Our "Modern Guide." We use Manrope for its high legibility and neutral tone, allowing the headings to take center stage. 
- **Hierarchy of Scale:** We use an aggressive contrast between display and body text. A `display-lg` title paired with a `body-md` description creates an editorial, high-end feel often found in luxury digital journals.

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering**, not structural scaffolding.

- **The Layering Principle:** Instead of shadows, we stack surfaces. A card using `surface-container-high` placed on a `surface` background creates a "soft lift."
- **Ambient Shadows:** If a component must float (e.g., a custom cursor or a priority modal), use an ultra-diffused shadow.
    - **Shadow Color:** `#000000` at 12% opacity.
    - **Blur:** 60px - 100px.
    - **Offset:** 20px Y-axis.
- **The "Ghost Border" Fallback:** If a container requires a boundary for accessibility, use the `outline-variant` (`#4d4637`) at 15% opacity. It should be felt, not seen.
- **Cinematic Motion:** Depth is also reinforced through parallax. Background images should move at 0.5x the scroll speed of the foreground text to create an "immersive window" effect.

## 5. Components

### Buttons
- **Primary:** Filled with `primary` (`#e6c364`), text in `on-primary`. No rounded corners (use `sm` scale: 0.125rem) for a sharp, architectural look.
- **Secondary:** Transparent background with a "Ghost Border" and `primary` text.
- **Interaction:** On hover, a subtle inner glow (box-shadow: inset 0 0 10px `#C9A84C`).

### Immersive Cards
- **Construction:** Use `surface-variant` with a 20px backdrop blur.
- **Constraint:** No divider lines. Separate "Title" from "Description" using 24px of vertical white space from our spacing scale.
- **Border:** Use a 1px gradient stroke using `primary` at 20% opacity.

### Cinematic Scroll Indicator
- A vertical line in the bottom center of the hero. 
- **Style:** 1px wide, 60px tall. 
- **Animation:** A "bead" of `primary-fixed` light that travels from top to bottom in a slow, meditative loop.

### Custom Cursor
- **The "Seeker":** A 12px circle of `primary` with a 40px outer ring (outline-variant at 20% opacity).
- **Interaction:** On hovering interactive elements, the outer ring expands to 60px and the inner dot disappears, creating a "lens" effect.

### Input Fields
- **Style:** Underline only (2px `outline-variant`). No boxes. 
- **Active State:** The underline transforms into a `primary` to `secondary` gradient.

## 6. Do's and Don'ts

### Do
- **Use White Space:** Treat negative space as "breathing room" for the soul.
- **Asymmetric Grids:** Offset images from text blocks to create a rhythmic, non-standard flow.
- **High-Resolution Imagery:** Only use cinematic, high-contrast photography. If an image is too bright, apply a 40% black overlay.

### Don't
- **Don't use 100% Black:** Pure `#000000` is too harsh. Stick to the `surface` tokens (`#131313`).
- **Don't use Standard Shadows:** Avoid small, muddy "drop shadows" that look like default CSS.
- **Don't use Rounded Buttons:** Large "pill" buttons (`rounded-full`) break the "Stone-Carved" architectural aesthetic. Keep corners sharp or subtly softened (`sm`).
- **Don't Over-Animate:** Movement should be slow, eased (cubic-bezier), and intentional. Avoid "bouncy" or "snappy" UI animations.