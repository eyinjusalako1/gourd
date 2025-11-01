# Dashboard Mobile-First Wireframe
## Gathered - Youth Fellowship Dashboard

**Target Width:** 375px - 414px (Mobile-first)  
**Font Family:** Poppins (primary), Nunito Sans (fallback)  
**Color Palette:** Navy (#0F1433), Gold (#D4AF37), White (#FFFFFF)

---

## 📱 Layout Structure

```
┌─────────────────────────────────────┐
│         HEADER (Sticky)              │
│  ┌─────────────────────────────┐    │
│  │ Logo    Welcome back, John  │    │
│  │         [Notification] [⚙️]  │    │
│  └─────────────────────────────┘    │
├─────────────────────────────────────┤
│                                       │
│  ┌─────────────────────────────┐    │
│  │   VERSE OF THE DAY          │    │
│  │   ┌─────────────────────┐  │    │
│  │   │ "For where two or    │  │    │
│  │   │  three gather..."    │  │    │
│  │   │  - Matthew 18:20     │  │    │
│  │   └─────────────────────┘  │    │
│  │   Gold border + glow        │    │
│  └─────────────────────────────┘    │
│                                       │
│  ┌─────────────────────────────┐    │
│  │ YOUR FELLOWSHIP ACTIVITY    │    │
│  │ ┌───────────────────────┐  │    │
│  │ │ [ICON] Young Adults   │  │    │
│  │ │        "Join us this  │  │    │
│  │ │        Sunday..."     │  │    │
│  │ │        [Join] [💬 3]  │  │    │
│  │ └───────────────────────┘  │    │
│  │ ┌───────────────────────┐  │    │
│  │ │ [ICON] Campus CFF      │  │    │
│  │ │        "Prayer request │  │    │
│  │ │        for exams..."   │  │    │
│  │ │        [Pray] [💬 5]   │  │    │
│  │ └───────────────────────┘  │    │
│  │ ┌───────────────────────┐  │    │
│  │ │ [ICON] Women's Circle  │  │    │
│  │ │        "Testimony..."  │  │    │
│  │ │        [Like] [💬 8]   │  │    │
│  │ └───────────────────────┘  │    │
│  └─────────────────────────────┘    │
│                                       │
│  ┌─────────────────────────────┐    │
│  │   UPCOMING EVENTS            │    │
│  │   [< Scroll >]               │    │
│  │   ┌───┐ ┌───┐ ┌───┐         │    │
│  │   │📅 │ │📅 │ │📅 │         │    │
│  │   │Sun│ │Wed│ │Fri│         │    │
│  │   │Gat│ │Pra│ │Ret│         │    │
│  │   │[RS│ │[RS│ │[RS│         │    │
│  │   │ VP]│ │ VP]│ │ VP]│         │    │
│  │   └───┘ └───┘ └───┘         │    │
│  └─────────────────────────────┘    │
│                                       │
│  ┌─────────────────────────────┐    │
│  │   QUICK ACTIONS               │    │
│  │   ┌─────┐ ┌─────┐ ┌─────┐  │    │
│  │   │💬   │ │🙏   │ │📅   │  │    │
│  │   │Share│ │Pray │ │Event│  │    │
│  │   └─────┘ └─────┘ └─────┘  │    │
│  └─────────────────────────────┘    │
│                                       │
│  ┌─────────────────────────────┐    │
│  │   COMMUNITY HIGHLIGHT         │    │
│  │   "This week, 32 believers   │    │
│  │    gathered in 5 fellowships"│    │
│  │   Gold gradient background   │    │
│  └─────────────────────────────┘    │
│                                       │
├─────────────────────────────────────┤
│  BOTTOM NAV (Fixed)                   │
│  [🏠] [👥] [📅] [💬] [👤]           │
│   Home Fellowships Events Msgs Profile│
│   (Active: Gold highlight)           │
└─────────────────────────────────────┘
```

---

## 🎨 Component Specifications

### 1. Header Section
**Height:** 72px (sticky, top-0, z-50)  
**Background:** #0F1433 (Navy)  
**Border:** Bottom border, #D4AF37/30 (Gold, 30% opacity)

```
┌─────────────────────────────────────┐
│ [Logo]  Welcome back, John!  🔔 ⚙️ │
│         Your fellowship awaits      │
└─────────────────────────────────────┘
```

**Spacing:**
- Padding: 16px horizontal, 12px vertical
- Logo: 40x40px
- Font size: 18px (title), 14px (subtitle)
- Icon buttons: 44x44px (touch target)

---

### 2. Verse of the Day Card
**Dimensions:** Full width, auto height  
**Padding:** 24px  
**Border:** 2px solid #D4AF37 (Gold)  
**Border Radius:** 16px (rounded-2xl)  
**Background:** rgba(255,255,255,0.05) with gold glow effect

```
┌─────────────────────────────────────┐
│   Verse of the Day                  │
│   ┌─────────────────────────────┐  │
│   │ "For where two or three     │  │
│   │  gather in my name,         │  │
│   │  there am I with them."     │  │
│   │                              │  │
│   │  - Matthew 18:20            │  │
│   └─────────────────────────────┘  │
│                                     │
│   [Share Verse]                     │
└─────────────────────────────────────┘
```

**Visual Effects:**
- Subtle gold glow: box-shadow: 0 0 20px rgba(212, 175, 55, 0.2)
- Gradient overlay: bg-gradient-to-r from-[#F5C451]/5 to-transparent

---

### 3. Fellowship Activity Feed
**Container:** Full width cards, vertical stack  
**Spacing:** 16px between cards  
**Card Height:** Auto (min 120px)

**Card Structure:**
```
┌─────────────────────────────────────┐
│ [Icon]  Fellowship Name      2h ago │
│         ┌───────────────────────┐   │
│         │ Activity Content...   │   │
│         │ (2-3 line preview)    │   │
│         └───────────────────────┘   │
│         [Action Button] [💬 3]      │
└─────────────────────────────────────┘
```

**Card Styling:**
- Background: rgba(255,255,255,0.05)
- Border: 1px solid rgba(212, 175, 55, 0.3)
- Border Radius: 12px (rounded-xl)
- Padding: 16px
- Icon: 40x40px colored circle with icon
- Typography: 16px title, 14px content, 12px metadata
- Action buttons: 80px wide, gold border, white text

**Activity Types:**
- Event: Blue icon (#3B82F6)
- Prayer: Purple icon (#A855F7)
- Testimony: Green icon (#10B981)
- Announcement: Orange icon (#F97316)

---

### 4. Upcoming Events Section
**Container:** Horizontal scroll (snap-to-card)  
**Card Width:** 280px (snap-point)  
**Spacing:** 12px between cards

```
┌─────────────────────────────────────┐
│   Upcoming Events         [View All>]│
│   ┌─────┐ ┌─────┐ ┌─────┐         │
│   │📅   │ │📅   │ │📅   │         │
│   │Sun  │ │Wed  │ │Fri  │         │
│   │8 AM │ │7 PM │ │9 AM │         │
│   │     │ │     │ │     │         │
│   │[RSVP│ │[RSVP│ │[RSVP│         │
│   │ 12] │ │ 8]  │ │ 15] │         │
│   └─────┘ └─────┘ └─────┘ ┘         │
│   ← → (scroll indicators)          │
└─────────────────────────────────────┘
```

**Card Styling:**
- Fixed width: 280px
- Height: 180px
- Snap scrolling: scroll-snap-type: x mandatory
- Card snap: scroll-snap-align: center
- Shadow: 0 4px 12px rgba(0,0,0,0.15)
- RSVP button: Full width at bottom, gold background

---

### 5. Quick Actions Row
**Layout:** 3-column grid, equal width  
**Button Size:** Minimum 88x88px (touch target)  
**Spacing:** 12px gap

```
┌─────────────────────────────────────┐
│   Quick Actions                      │
│   ┌──────┐ ┌──────┐ ┌──────┐       │
│   │  💬  │ │  🙏  │ │  📅  │       │
│   │ Share│ │ Pray │ │Event │       │
│   │Encour│ │Reque │ │      │       │
│   │agment│ │  st  │ │      │       │
│   └──────┘ └──────┘ └──────┘       │
└─────────────────────────────────────┘
```

**Button Styling:**
- Background: rgba(255,255,255,0.05)
- Border: 2px solid #D4AF37 (Gold)
- Border Radius: 12px
- Icon: 32x32px, gold color
- Text: 12px, white, centered below icon
- Hover: bg-white/10, scale-105

---

### 6. Community Highlight
**Container:** Full width card  
**Background:** Gradient from #D4AF37 to #F5C451  
**Text Color:** #0F1433 (Navy for contrast)

```
┌─────────────────────────────────────┐
│   Community Highlight                │
│   ┌─────────────────────────────┐   │
│   │  "This week, 32 believers  │   │
│   │   gathered in 5 fellowships│   │
│   │   Let's keep building!"    │   │
│   └─────────────────────────────┘   │
│   Rotates between:                   │
│   - Scripture verses                 │
│   - Encouraging messages            │
│   - Community stats                 │
└─────────────────────────────────────┘
```

**Styling:**
- Border Radius: 16px
- Padding: 24px
- Font: 16px, bold
- Text alignment: Center

---

### 7. Bottom Navigation
**Height:** 80px (including safe area)  
**Background:** #0F1433 (Navy)  
**Border:** Top border, #D4AF37/30

```
┌─────────────────────────────────────┐
│  [🏠]  [👥]  [📅]  [💬]  [👤]        │
│  Home  Fellowships Events Msgs Profile│
│                                       │
│  Active tab: Gold glow + underline   │
│  Inactive: White/60 opacity          │
└─────────────────────────────────────┘
```

**Tab Styling:**
- Icon: 24x24px
- Text: 12px, medium weight
- Active: #F5C451 (Gold), glow effect
- Inactive: rgba(255,255,255,0.6)
- Touch target: 60x60px minimum
- Spacing: Equal distribution

---

## 📏 Spacing System

**Vertical Spacing:**
- Between sections: 24px (space-y-6)
- Between cards: 16px (gap-4)
- Card internal padding: 16px-24px
- Section padding: 16px horizontal (px-4)

**Horizontal Spacing:**
- Container max-width: 448px (max-w-md)
- Container padding: 16px (px-4)
- Card gaps: 12px-16px

---

## 🎨 Visual Effects

**Shadows:**
- Cards: 0 4px 12px rgba(0,0,0,0.15)
- Active buttons: 0 0 20px rgba(212, 175, 55, 0.3)
- Hover states: 0 8px 16px rgba(0,0,0,0.2)

**Gradients:**
- Gold accents: from-[#D4AF37] to-[#F5C451]]
- Card overlays: from-[#F5C451]/5 to-transparent
- Community highlight: from-[#D4AF37] to-[#F5C451]

**Transitions:**
- All interactive elements: 200ms ease-in-out
- Hover scale: scale-105 (transform)
- Active state: scale-95 (pressed effect)

---

## 📱 Responsive Breakpoints

**Mobile First (375px - 414px):**
- Primary target width
- Single column layout
- Touch-optimized tap targets (min 44x44px)

**Tablet (768px+):**
- Max width: 768px (centered)
- 2-column grid for quick actions
- Larger card sizes

---

## ♿ Accessibility

**Touch Targets:**
- Minimum: 44x44px (WCAG AA)
- Recommended: 48x48px (comfortable)
- Spacing between: 8px minimum

**Text Sizes:**
- Headings: 18px-24px
- Body: 16px
- Captions: 14px
- Small: 12px

**Contrast:**
- Text on Navy: White (#FFFFFF)
- Text on Gold: Navy (#0F1433)
- Minimum contrast ratio: 4.5:1

---

## 🎯 Interaction States

**Cards:**
- Default: bg-white/5, border-[#D4AF37]/30
- Hover: bg-white/10, border-[#D4AF37]/50
- Active: scale-95, bg-white/15

**Buttons:**
- Default: bg-[#F5C451], text-[#0F1433]
- Hover: bg-[#D4AF37], scale-105
- Active: scale-95, shadow-lg
- Disabled: opacity-50, cursor-not-allowed

**Navigation:**
- Active: text-[#F5C451], glow effect
- Inactive: text-white/60
- Hover: text-white/80

---

## 🔄 Scroll Behavior

**Vertical Scrolling:**
- Smooth scroll: scroll-behavior: smooth
- Overscroll: Overscroll-behavior: contain
- Sticky header: position: sticky, top: 0

**Horizontal Scrolling (Events):**
- Snap points: scroll-snap-type: x mandatory
- Hide scrollbar: -webkit-scrollbar: none
- Swipe gestures: Touch-friendly

---

## 📋 Content Hierarchy

**Priority Order:**
1. Verse of the Day (spiritual anchor)
2. Fellowship Activity (community engagement)
3. Upcoming Events (action items)
4. Quick Actions (tools)
5. Community Highlight (encouragement)

**Visual Weight:**
- Verse: Gold border + glow (highest)
- Activity: Medium cards with icons
- Events: Smaller, horizontal cards
- Actions: Large icons, clear labels
- Highlight: Gradient background (eye-catching)

---

This wireframe ensures a warm, community-centered experience optimized for youth fellowship engagement! 🌿


