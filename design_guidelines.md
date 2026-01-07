# Belajar Ngaji - Design Guidelines

## Design Approach
**Reference-Based Hybrid**: Combining Duolingo's gamified learning UI with Islamic architectural principles (geometric patterns, elegant proportions). Inspiration from modern edtech platforms (Khan Academy, Coursera) adapted with Islamic visual language.

**Core Principles:**
- Clean, distraction-free learning interface
- Islamic geometric patterns as subtle accent elements
- Generous whitespace reflecting Islamic art's balance
- Progressive complexity (simple → detailed as user advances)

---

## Typography

**Primary Font**: Inter (via Google Fonts CDN) - clean, readable for UI
**Arabic/Display Font**: Amiri or Scheherazade New - for Arabic text and decorative headings

**Hierarchy:**
- Hero Heading: 4xl/5xl (60-72px), bold, generous line-height
- Section Titles: 2xl/3xl (36-48px), semibold
- Card Titles: xl (24px), semibold
- Body Text: base (16px), regular, line-height 1.7 for readability
- Captions/Labels: sm (14px), medium

**Arabic Text**: Increase size by 10-15% for better readability, right-align naturally

---

## Layout & Spacing

**Tailwind Units**: Consistent spacing using 4, 6, 8, 12, 16, 20, 24 (p-4, gap-6, h-8, py-12, etc.)

**Container Strategy:**
- Max-width: 7xl (1280px) for full sections
- Content max-width: 4xl (896px) for reading comfort
- Responsive padding: px-4 (mobile), px-8 (tablet), px-12 (desktop)

**Vertical Rhythm:**
- Section spacing: py-16 (mobile), py-24 (desktop)
- Component gaps: gap-8 to gap-12
- Card padding: p-6 to p-8

---

## Component Library

### Navigation
- Fixed top navbar with Islamic geometric border detail (1px bottom accent)
- Logo left, navigation center, CTA (Login/Start Learning) right
- Mobile: Hamburger menu with slide-in drawer

### Hero Section
- Full-width hero with background image (80vh)
- Centered content overlay with blurred-background buttons
- Headline + subheadline + dual CTAs (Start Free / View Courses)
- Floating stats cards (Students enrolled, Lessons completed, Success rate)

### Learning Dashboard
- Three-column grid (lg), two-column (md), single (mobile)
- Progress cards with circular progress indicators
- Course cards: Image top, title, progress bar, metadata (lessons, duration)

### Quiz Interface - Multi-Screen Flow

**Pre-Quiz Learning Material Screen:**
- Card-based layout (max-w-3xl centered)
- Material heading with lesson number badge
- Content area with scrollable text/images
- Islamic pattern dividers between sections
- Fixed bottom bar: "Ready for Quiz" button with chapter progress

**Quiz Question Screen:**
- Clean, focused layout
- Question counter badge (1/10)
- Large question text (text-2xl)
- Multiple choice options as large cards (hover states with subtle scale)
- Bottom navigation: Skip/Submit buttons
- Progress bar at top (thin, gold accent)

**Results Screen:**
- Celebration card with score display
- Breakdown: Correct/incorrect count with icons
- Review mistakes section (expandable cards)
- Next lesson CTA

### Feature Cards
- 2-column grid showcasing platform benefits
- Icon top (geometric Islamic patterns as icons), title, description
- Hover: Subtle lift effect (transform translate-y)

### Testimonials
- Horizontal scroll (mobile), 3-column grid (desktop)
- Cards with user photo, quote, name, achievement badge
- Islamic star/geometric rating display

### Footer
- Three-column layout: About/Quick Links/Contact
- Newsletter signup with Islamic pattern background
- Social media icons
- Trust badges (Certified Islamic scholars, verified content)

---

## Images

**Hero Section:**
- **Large hero image required** (full-width, 80vh)
- Image: Modern Muslim students studying together in bright, contemporary learning space
- Overlay: Subtle dark gradient (bottom to top, 60% opacity) for text readability
- CTAs on hero: Blurred background (backdrop-blur-md, bg-white/10 or bg-black/20)

**Course/Category Cards:**
- Thumbnail images (16:9 ratio): Islamic calligraphy, mosque architecture, Quran imagery
- Consistent treatment: Slight overlay on hover

**Learning Material Screens:**
- Contextual illustrations: Quranic verses with decorative borders, historical imagery
- Diagram images for complex concepts
- All images: Rounded corners (rounded-lg), subtle shadows

**Testimonial Photos:**
- Circular profile images (w-16 h-16)
- Diverse representation of students

**Background Patterns:**
- Subtle Islamic geometric SVG patterns as section backgrounds (10% opacity)
- Used sparingly in hero, footer, and section dividers

---

## Animations
Use sparingly:
- Page transitions: Simple fade-in
- Card hover: Subtle lift (2-4px)
- Progress bars: Smooth fill animation
- Quiz feedback: Check/cross icon pop-in