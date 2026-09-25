---
name: Genius Lab
description: One continuous white survey paper on which business complexity resolves into insight; brand navy as instruments and objects, signal blue as the live detail, one glass exception for the agent, and a single chamfered navy block to close.
colors:
  navy: "#101440"
  navy-950: "#070a25"
  navy-900: "#0b0e32"
  navy-800: "#171c52"
  navy-700: "#252b6a"
  navy-300: "#a4a8cf"
  paper: "oklch(96.6% 0.004 240)"
  white: "#ffffff"
  cloud-3: "#dfe2ee"
  signal: "#5577ff"
  signal-ink: "#2f4fe0"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5.6vw, 5.5rem)"
    fontWeight: 560
    lineHeight: 1
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 118"
  hero:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4.6vw, 4.4rem)"
    fontWeight: 560
    lineHeight: 0.98
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 112"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4.4vw, 4.25rem)"
    fontWeight: 560
    lineHeight: 1.02
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.2vw, 3rem)"
    fontWeight: 560
    lineHeight: 0.98
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 108"
  title-wide:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.375
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 118"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
    fontVariation: "'wdth' 100"
  body-sm:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.5
    fontVariation: "'wdth' 100"
  label-mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0"
    fontFeature: "'tnum'"
rounded:
  none: "0"
  glass-window: "28px"
  glass-bubble: "20px"
  glass-tail: "6px"
  pill: "9999px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 3.5rem)"
  nav-h: "4.25rem"
  shell-max: "1480px"
  section-sm: "6rem"
  section-md: "8rem"
  section-lg: "10rem"
components:
  button-navy:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "0 16px 0 20px"
    height: "44px"
  button-navy-hover:
    backgroundColor: "{colors.navy-700}"
  button-navy-lg:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "0 24px 0 28px"
    height: "56px"
  button-white:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "0 16px 0 20px"
    height: "44px"
  button-white-hover:
    backgroundColor: "{colors.cloud-3}"
  nav-link:
    textColor: "{colors.navy}"
    typography: "{typography.body-sm}"
  layer-step-active:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    typography: "{typography.label-mono}"
    rounded: "{rounded.none}"
    height: "36px"
    width: "48px"
  agent-state-active:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    typography: "{typography.label-mono}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "32px"
  chat-window:
    backgroundColor: "rgb(255 255 255 / 0.35)"
    textColor: "{colors.navy}"
    rounded: "{rounded.glass-window}"
  chat-bubble-user:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.glass-bubble}"
    padding: "10px 16px"
  chat-bubble-agent:
    backgroundColor: "rgb(255 255 255 / 0.8)"
    textColor: "{colors.navy}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.glass-bubble}"
    padding: "10px 16px"
  chat-composer:
    backgroundColor: "rgb(255 255 255 / 0.75)"
    textColor: "{colors.navy}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "0 6px 0 20px"
    height: "48px"
  play-button:
    backgroundColor: "rgb(255 255 255 / 0.15)"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    size: "80px"
  portal-module-tile:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    size: "40px"
  portal-module-tile-hover:
    backgroundColor: "{colors.signal-ink}"
  portal-preview:
    backgroundColor: "{colors.navy-950}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
  segment-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    rounded: "{rounded.none}"
    padding: "24px"
  voice-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    rounded: "{rounded.none}"
    padding: "24px"
  voice-feature:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "40px"
  video-cover:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
---

# Design System: Genius Lab

Scope: this system governs Version 2, the Genius Lab brand direction (`/v2`, `src/app/v2/page.tsx`, `src/components/v2/*`, plus the OrbKit orb in `src/components/ui/shdr-01.tsx` and `orbkit-core.tsx`, and the shared `src/components/ui/Reveal.tsx`). Version 1 at `/` is a retained comparison page and is not governed by this file. Version 2 shares Version 1's paper ground (`paper`) and its survey terrain, redrawn in brand navy. The other Version 1 tokens (`paper-2`, `paper-3`, `ink-*`, `rule*`, `survey-*`, `on-survey*`) still live in `globals.css` and must not be used on new Version 2 surfaces.

## Overview

**Creative North Star: "The Instrumented Page"**

The page is one continuous sheet of cool white survey paper. Business complexity is measured on it, and the reader watches an agent read it. The hero is Version 1's survey terrain, now drawn in brand navy: loose points on the text side become a triangulated network, and the network resolves into contour lines rising to metric summits, where a signal-blue agent opens chamfered insight cards. From the hero to the last testimonial there are no bands, no alternating grounds and no rules between sections. The problem chart, the layer stack, the Second Brain sphere, the agent, the Genius Portal, the managed-service ring, the audience cards, the film and the testimonials all sit directly on the same paper, separated by space alone.

Blue is a detail, not a surface. Signal Ink marks what is live on paper: the agent point, the complexity curve, ordinals of the active item, lit hubs, sweeps and selected markers. Navy appears on paper only as objects the reader uses or watches: layer plates and the crown, the orb halo, the managed seal, icon tiles, the user's chat bubble, active chips, buttons, the product preview, the film cover and the featured testimonial. The terrain returns twice, drawn in light on navy: on the film cover and in the closing block. The story ends in a single navy block, the CTA and footer, entered through a 45-degree chamfer cut into its top-right corner.

One material exception is deliberate. The agent is the only thing on the page that talks, so it alone gets a soft, rounded, frosted glass window over colour blooms, with rounded bubbles and a pill composer. The same glass reappears only on the film's play button, and circles hold people only in avatars. Everything else stays square or chamfered. Type is Archivo, driven by its width axis, with Geist Mono for anything the machine prints. The page is calm, premium and executive: one instrument per idea, and motion that shows reading and resolution rather than decoration.

**Key Characteristics:**
- One continuous paper surface from hero to testimonials, separated by section spacing, with no bands or section rules.
- Hero: contour terrain in navy, read by a Signal Ink agent that opens chamfered insight cards on metric rises.
- Blue as detail: Signal Ink for live marks on paper, Signal for live marks on navy, never as a surface.
- Navy as object: plates, crown, halo, seal, icon tiles, bubble, chips, buttons, preview, film cover, featured quote.
- Square or top-right chamfered corners everywhere except the agent's glass window, the play button and avatars.
- Spectral colour lives only inside the orb and the chat avatar.
- Hexagons only as layer plates, their ghost outlines, the decision crown and the chamfer.
- One closing navy block (CTA and footer) with a 45-degree chamfered top edge and terrain drawn in light.
- Archivo on its width axis, and Geist Mono for machine-voice text only.
- Every canvas, loop, scroll stage and scripted conversation has a resolved, still state under reduced motion.

## Colors

The palette is paper and white, one navy family used as ink and object, and a two-step signal blue that marks what is live.

### Primary
- **Genius Navy** (navy): The logo navy. Headlines and ink on paper, contour and network lines at graded opacity, plates and crown, the managed seal, portal icon tiles, the user chat bubble, active chips and stepper cells, buttons, the orb halo, the film cover, the featured testimonial, and the ground of the closing block.
- **Signal Ink** (signal-ink): The live colour on paper. The hero agent point and visited contour, the complexity curve and its hatched gap, active ordinals and chapter timestamps, lit Second Brain hubs, hub chips, the topic timer line, the managed sweep, list squares and diamonds, segment illustration highlights and hover bars, the send state, and the text-link hover underline.
- **Signal Blue** (signal): The live colour on navy and inside plates. The active plate's edge light and glow, highlighted points, bars and trend lines on plates, the beam into the crown, the active state-chip diamond, dashboard series, the testimonial quote mark, the bloom in the CTA and film cover, sphere pulses and glow, and the text selection.

### Neutral
- **Paper** (paper): The page, from the hero to the testimonials. It is also the halo stroke behind canvas labels, the ground of segment illustrations, and the fill of hollow diagram nodes.
- **White** (white): Segment and testimonial cards, insight cards (at 0.97), the chat window's glass (at 0.35) and agent bubbles (at 0.8), the white button, and ink inside navy at graded opacity.
- **Night Navy** (navy-950): The header over navy, the mobile menu, the portal preview, and the film cover's bottom scrim.
- **Deep Navy** (navy-900), **Raised Navy** (navy-800) and **Edge Navy** (navy-700): Isometric side faces of plates. Edge Navy is also the navy button's hover.
- **Mist Indigo** (navy-300): The underside of the layer-stack crown, and the scrollbar thumb.
- **Cloud 3** (cloud-3): Hover state of the white button.

### Named Rules
**The One Paper Rule.** Everything before the closing block sits on the same paper. Do not add section bands, alternate grounds, horizontal rules between sections, or wave-line fields. Sections are separated by space alone (section-sm, section-md, section-lg). Rules inside a section (ruled lists, the portal strip, chapter lines) are allowed.

**The Blue Detail Rule.** Signal blue appears as strokes, points, pulses, sweeps, small squares, glows on live points, short labels, and the hover fill of an icon tile or avatar. Use Signal Ink on paper and Signal on navy. It never fills a card, panel or band, and never sets running text.

**The Navy Object Rule.** On paper, a solid navy area is always an object the reader uses or watches: a plate, the crown, the orb halo, the seal, an icon tile, a chat bubble, an active chip, a button, the product preview, the film cover or the featured testimonial. It is never a decorative band.

**The Graded Ink Rule.** Hierarchy uses one ink at fixed opacities. On paper, navy is 1.0 for headings, 0.7 for body and navigation, 0.55 to 0.65 for secondary copy, 0.4 to 0.5 for ordinals, labels and idle items, 0.3 to 0.35 for axes and baselines, and 0.07 to 0.12 for rules and gridlines. On navy, white follows the same steps: 0.7 for body and links, 0.55 to 0.65 for secondary text, 0.08 to 0.15 for rules.

**The Spectrum Stays Home Rule.** Spectral colour appears only inside the OrbKit orb and the chat avatar's conic ring. The soft blooms behind the chat glass (Signal, a pale cyan and navy, heavily blurred) exist only to make the glass read as glass.

**The One Block Rule.** The CTA and footer are one continuous navy ground, both marked `data-ground="dark"` so the header switches to the white logo. It is entered once, through the chamfered edge, and never interrupted.

## Typography

**Display Font:** Archivo, variable width axis (with ui-sans-serif, system-ui)
**Body Font:** Archivo at normal width ('wdth' 100)
**Label/Mono Font:** Geist Mono, tabular numerals (with ui-monospace)

**Character:** A geometric, extended voice that echoes the wordmark. Width does the work that weight and colour would do elsewhere: expanded for headlines, wide for names and statements, normal for reading, and mono for anything the machine prints, including labels drawn inside canvases and diagrams.

### Hierarchy
- **Display** (560, clamp(2.5rem, 5.6vw, 5.5rem), 1): At 'wdth' 118. The closing CTA headline only, capped at 16ch.
- **Hero** (560, clamp(2.25rem, 4.6vw, 4.4rem), 0.98): At 'wdth' 112, in navy, capped at 19ch, set in two lines that enter in sequence.
- **Headline** (560, clamp(2.25rem, 4.4vw, 4.25rem), 1.02): At 'wdth' 112. The shared section headline (`h2Class`), capped at 13 to 18ch. Inside the pinned problem frame it steps down to clamp(2.5rem, 3.6vw, 3.75rem) at line-height 1 so headline, copy and counters fit beside the chart.
- **Title** (560, clamp(1.75rem, 3.2vw, 3rem), 0.98): At 'wdth' 108. Layer names and the outcome name in the stack, paired with a Signal Ink mono ordinal. The film cover title uses the same voice at clamp(1.5rem, 3vw, 2.75rem), 'wdth' 112.
- **Title Wide** (500, 1.0625 to 1.5rem, 'wdth' 118, -0.02em): Names and statements: portal modules, Second Brain topics, managed steps ("We build it."), segment names, the portal strip statement, and the featured testimonial at clamp(1.375rem, 2.2vw, 1.875rem).
- **Body** (400, 1.125rem, 1.625): Paragraphs of 40 to 60ch, navy at 0.7 on paper and white at 0.7 on navy.
- **Body Small** (500, 0.9375rem): Buttons, navigation, legends, chat text, list items and card copy.
- **Label Mono** (400 to 600, 0.6875 to 0.8125rem, or 10 to 13px inside canvases, tabular): Metric names and values, counters, hub names, agent states, reasoning steps, ordinals, timestamps, captions and "Illustrative" labels.

### Named Rules
**The Width Axis Rule.** Set hierarchy on the width axis first. Headlines use 'wdth' 108 to 118, names and statements 118, and reading text 100. No other display face is used.

**The Machine Voice Rule.** Use Geist Mono only for text a system would print: metrics, figures, ordinals, timestamps, table names, states and sources. Never use it for headings, sentences addressed to the reader, or labels placed above headings.

## Layout

- **Shell:** The content shell is capped at 1480px with a fluid side gutter (gutter). Content sits on a 12-column grid at `lg`: copy usually takes 4 to 6 columns and the instrument takes the rest (5/7 for layers and the Second Brain, 4/8 for problem and portal, 6/6 for managed).
- **Hero:** Full viewport height (100dvh). The terrain canvas fills the section, masked to fade in over the top 120px beneath the transparent header. Copy is bottom-anchored on the left.
- **Header:** Fixed at `nav-h`. Transparent at the top, paper at 95% with a hairline once scrolled, Night Navy at 95% over `data-ground="dark"`. The logo crossfades between the navy and white files.
- **Section rhythm:** Sections pad section-sm, then section-md at `sm`, then section-lg at `lg`. The closing CTA pads one step deeper (7rem, 9rem, 11rem). No dividers between sections.
- **Scroll stages:** The problem chart (200vh track) pins under the header with its headline, copy and counters inside the pinned frame; on phones the headline and copy read before the pin and the counters follow the chart. The layer stack (420vh track) pins full-height. Both are driven by scroll progress through a spring.
- **Centred instruments:** Agents is a centred single column (46rem) with the orb above the state chips and chat window. Section headers elsewhere are left-aligned, sometimes with the supporting line bottom-aligned on the right (film, testimonials).
- **Card grids:** Segments run 1, 2, then 4 columns with 16px gaps. Testimonials run a 5-column featured card spanning two rows beside a 2-by-2 grid of white cards.
- **Closing block:** The CTA's chamfer cuts into the paper above; the footer continues on the same navy with no seam.
- **Mobile:** The problem chart switches to a 600 by 560 portrait viewBox with larger stage labels. The layer stepper becomes 3px progress bars. Insight cards narrow to 176px. The orb drops from 280px to 220px below 640px. The portal systems strip scrolls horizontally. Primary navigation moves into a full-screen Night Navy menu that opens with a clip-path wipe.

## Elevation & Depth

Structure is flat and depth is drawn. The terrain gets its relief from contour lines (navy at 0.34, every fourth an index contour at 0.62 and 1.15px). Plates and the crown get theirs from isometric side faces in navy steps. The sphere gets its depth from two link passes (navy at 0.12 behind, 0.3 in front) and node opacity that scales with depth. Light is used only where something is live: the Signal glow behind the sphere, the active plate's glow, the seal light in the managed ring, the Signal blooms in the film cover and CTA, and the orb itself. Real shadows are reserved for things that float: the glass chat window and its bubbles, the glass play button, and white testimonial cards as they lift on hover.

### Shadow Vocabulary
- **Header hairline** (`box-shadow: 0 1px 0 rgb(16 20 64 / 0.1)` on paper; `0 1px 0 rgb(255 255 255 / 0.08)` on navy): Separates the solid header from content.
- **Ghost edge** (`box-shadow: inset 0 0 0 1px rgb(16 20 64 / 0.18 to 0.25)` on paper; white at 0.25 to 0.28 on navy, rising to 0.7 on hover; white at 0.08 inside the portal preview's tiles): Idle chips, upcoming stepper cells, the menu toggle, ghost buttons and dashboard tiles. It is inset so chamfer clipping cannot remove it.
- **Glass lift** (`box-shadow: 0 40px 90px -40px rgb(16 20 64 / 0.45), inset 0 1px 0 rgb(255 255 255 / 0.9)`): The agent chat window only.
- **Bubble lift** (`0 8px 20px -12px rgb(16 20 64 / 0.6)` for the user; `0 8px 24px -16px rgb(16 20 64 / 0.35)` for the agent): Chat bubbles only.
- **Composer well** (`box-shadow: inset 0 1px 2px rgb(16 20 64 / 0.06)`): The pill composer inside the chat window.
- **Play lift** (`box-shadow: 0 20px 50px -10px rgb(0 0 0 / 0.5), inset 0 1px 0 rgb(255 255 255 / 0.5)`): The glass play button on the film cover.
- **Card hover lift** (`box-shadow: 0 28px 50px -36px rgb(16 20 64 / 0.55)` with a 2px rise over 500ms): Square white testimonial cards on hover.

### Named Rules
**The Drawn Depth Rule.** When something needs to feel stacked or raised as structure, draw it with contours, isometric faces or depth-weighted points. Shadows belong only to floating things: the glass, its bubbles, the play button and hovering square cards.

**The Glass Rule.** Backdrop blur appears only on the agent chat window (white at 0.35, blur 40px, saturate 150%, with a white fallback at 0.9 where backdrop-filter is unsupported), the play button (white at 0.15, blur 12px) and the film's placeholder dialog scrim. Glass always sits over colour or imagery so it reads as glass.

## Shapes

Corners are square (rounded.none) or cut at 45 degrees on the top-right with `clip-path: polygon(0 0, calc(100% - N) 0, 100% N, 100% 100%, 0 100%)`. The chamfer grows with the object: 8px on portal icon tiles, 10px on insight cards, 12px on buttons, 18px on segment cards, 22px on the portal preview, 24px on the featured testimonial, 28px on the film cover, and 48px (120px at `lg`) on the closing block's top edge. Small markers are 5 to 8px squares, rotated 45 degrees (or clipped to a diamond) when they mark a state, choice or inclusion.

Hexagons are flat-top and squashed vertically to 0.42 (`src/lib/hex.ts`). They are the four isometric plates, their dashed ghost outlines, and the decision crown at the top of the layer stack. The chamfer is the fourth use: a single 45-degree cut from the same geometry as the wordmark.

Circles are data and diagrams: terrain points, metric dots, network and sphere nodes, rings around live points, scatter points, donut rings, the round navy orb halo, the managed ring with its four stage nodes and navy seal, and the portal systems nodes and hub.

The glass exception is the only rounded material: the chat window (glass-window), its bubbles (glass-bubble with a glass-tail corner towards the speaker), the pill composer, the round send button and workspace pill inside it, the round play button, and circular avatars.

**The Chamfer Rule.** Cut only the top-right corner, at 45 degrees. Never add a border radius to a container or control outside the glass exception.

**The Glass Exception Rule.** Rounded corners are confined to the agent chat window and everything inside it, the play button, and avatars. They do not spread to cards, buttons, chips, panels or inputs elsewhere.

**The Three Hexagons Rule.** A hexagon means a layer, the decision it produces, or the chamfer that echoes the wordmark. It is never a tile, cell, honeycomb or background pattern.

## Components

### Buttons
Chamfered, direct and weighted. Each button pairs a label with a Phosphor arrow that moves 4px on hover.
- **Shape:** Square with a 12px top-right chamfer.
- **Navy (primary on paper):** Navy fill, white text, 44px high (56px large). Hover moves to Edge Navy. Hero and header.
- **White (primary on navy):** White fill, navy text. Hover moves to Cloud 3. CTA, header over navy, and the mobile menu.
- **Ghost:** Transparent with a Ghost edge. It exists in the button API but no Version 2 section places one.
- **Press:** Every control scales to 0.97 on active (160ms, ease-out-strong). Colours transition over 200ms.
- **Text link:** "See how it works" and "Watch it in action" are underlined at a 6px offset with the ink at 0.3; the underline turns Signal Ink on paper and the text brightens on navy.

### Navigation
- A fixed header that reads the ground beneath it (see Layout). Links (Capabilities, Second Brain, Genius Portal, Clients) are Body Small at 0.7 and rise to 1.0 on hover. The version switch and "Talk to us" sit at the right; the button swaps navy and white with the ground.
- Below `lg`, a 44px square ghost toggle opens a full-screen Night Navy menu. Menu links are headline-voiced at 2rem, separated by white/10 hairlines, and staggered by 45ms.

### Version Switch
Two 44px mono cells ("V1", "V2") in a 36px, 1px frame. The current cell is filled in the ground's ink.

### Insight Field (signature, hero)
A canvas terrain on paper, running from loose navy points, to a triangulated network (edges at navy 0.1 to 0.28), to 13 contour levels rising to metric summits. Each rise carries a mono metric name haloed in paper. A Signal Ink agent point (5.5px, with a breathing ring) springs from rise to rise, outlines the visited contour, and opens a white insight card: 214px (176px mobile), 10px chamfer, navy/0.16 edge, a rotated Signal Ink square, a mono "AI AGENT" label, a mono value at 22px, and a Signal Ink note, joined to the rise by a navy/0.3 leader. The pointer raises a spring-damped hill. "Illustrative insights" sits bottom-right. It draws one resolved frame under reduced motion and pauses offscreen.

### Problem Chart
A pinned revenue-versus-complexity chart on paper, with the headline, copy and four mono counters (Systems, Reports, Manual handoffs, People in a decision) held in the same pinned frame and counting up with scroll. Revenue is a 2.5px navy line and complexity a 2.5px Signal Ink line. Past the crossing, the gap fills with a 45-degree Signal Ink hatch at 0.35 and is labelled "The cost of complexity". A dashed navy cursor carries a paper-filled revenue dot and a solid Signal Ink complexity dot, and stage labels brighten as it passes. The legend carries an "Illustrative" mono tag.

### Isometric Layer Stack (signature)
Titled "One intelligence and execution layer across your business". Four flat-top hexagon plates on paper, each with a navy gradient top face, 22px side faces in navy steps, white/0.12 face edges and a white mesh clipped to the face. The foundation's mesh converges on a white core. Analytics carries a lifted scatter: white stems rising from shadow ellipses to white points, one Signal hot point, and a dashed 2.2px Signal trend line through them. BI carries a bar series with a dashed trend. AI carries arched agent links. Unbuilt plates wait as dashed navy outlines. Plates drop in on scroll, dashed Signal Ink risers flow between them, and the active plate takes a white-to-signal edge light and a Signal glow. A Signal beam feeds the navy crown with a Mist Indigo underside. Copy pairs a Signal Ink mono ordinal with a Title and a ruled list with 5px Signal Ink squares.

### Layer Stepper
Square mono cells, 36px high. Active is navy with white text, completed is navy at 0.1, upcoming carries a Ghost edge. On mobile it becomes 3px bars in navy and navy/0.15.

### Second Brain Sphere (signature)
A canvas knowledge graph on paper, drawn as an Obsidian-style sphere of eight hubs (Systems, Tables, Metrics, Dashboards, Processes, Customers, Operations, Finance) and several hundred notes. It rotates constantly about its own axis (0.24 rad/s); a drag nudges it and it settles back. Links are navy at 0.12 behind and 0.3 in front; lit links are Signal Ink at 0.55, and Signal pulses run along edges. Hub labels are mono, haloed in paper, and switch to Archivo in Signal Ink when lit. A soft Signal glow at 0.16 sits behind. Beside it, three context topics (Semantic, Business, Event) form a ruled accordion: Signal Ink mono ordinal when open, a Title Wide name, a body line and Signal Ink hub chips (28px, Signal Ink at 0.08, mono). The topics auto-cycle every 5.2s, shown by a 1px Signal Ink timer line along the open row, until the reader picks one; each topic lights its hubs on the sphere. Under reduced motion the sphere stops, pulses stop and topics do not cycle. It pauses offscreen.

### Agent Orb and Conversation (signature)
The OrbKit SHDR-01 orb (`AgentOrb`, 280px, or 220px below 640px) sits on a round navy radial halo at 118% of the orb. It carries the spectral colour. Its states are idle, thinking and speaking, echoed by a row of 32px square mono state chips: navy with a rotated Signal square when active, a Ghost edge with navy/0.5 text when idle.

Below it sits the glass exception: a frosted chat window (glass-window corners, 1px white border, navy/10 ring, white at 0.35 with backdrop blur, the Glass lift) over three blurred blooms (Signal at 0.45, pale cyan at 0.45, navy at 0.2). A title bar holds the round spectral avatar, "Genius agent" with a live status line, and a mono "Finance workspace" pill. The thread holds rounded bubbles: the user in navy with the tail at bottom-right, the agent in white at 0.8 with a white border and the tail at bottom-left, each with the Bubble lift. While thinking, a bubble shows three bouncing Signal Ink dots and mono read-steps whose round dots turn Signal Ink when complete. While speaking, the answer arrives word by word with a Signal Ink caret. The composer is a 48px pill in white at 0.75 with the Composer well and a 36px round send button that goes from navy/0.1, to navy, to Signal Ink as it sends. "Illustrative conversation" sits beneath. Under reduced motion it shows one resolved exchange with the orb idle.

### Genius Portal
On paper. Six modules (Connectors, Data Transformation, Analytics, Governance, Automation, AI Agents) form a ruled list (navy/10 rules): a 40px navy icon tile with an 8px chamfer and an 18px Phosphor icon, turning Signal Ink on hover, then a navy/40 mono ordinal, a Title Wide name and a navy/65 line. Beside it, the executive dashboard is open: a Night Navy preview with a 22px chamfer, app chrome and icon rail on white/10 rules, KPI tiles in white at 0.04 with an inset white/8 edge, a revenue-vs-plan area chart in Signal with a dashed white plan line and a square white callout, region bars, a channel donut and a business-unit table, captioned as illustrative. Below, a strip opens on a navy/12 rule: the Title Wide statement "Keep the technology that already runs the business." beside six ringed paper nodes curving into a navy hub with a dashed white ring and a Signal centre.

### Managed Ring
A ring that never stops turning (9s per turn, motion-safe) around a navy seal with a white check and a white/0.7 mono "DELIVERED READY". The track is navy at 0.14 and 18px, over a dotted navy/0.35 line; a Signal Ink gradient sweep with a white leading dot rotates on it. Four paper stage nodes (Design, Build, Run, Improve) with 1.5px navy strokes sit at the quarters, and a soft Signal light sits under the seal. Copy pairs Signal Ink mono ordinals with Title Wide steps on navy/12 rules, then a row of 32px square inclusion chips (navy at 0.05, with Signal Ink diamonds).

### Segment Cards
Four white cards with an 18px chamfer and 24px padding: a navy/40 mono ordinal, a bespoke 2:1 line illustration on a paper panel (portfolio heat grid, merging networks, entity consolidation, operating trend inside a band), a Title Wide name, a line of copy, and a ruled outcome list with 6px Signal Ink squares. On hover the card rises 4px, the illustration panel tints to Signal Ink at 0.06, and a 2px Signal Ink bar draws along the bottom edge.

### Film (Action)
A 16:9 navy cover with a 28px chamfer, drawn from the terrain: white contours at rising opacity, one index contour in pale signal, a Signal bloom, and a drawn agent point with a white insight card. A Night Navy scrim rises from the bottom under a Title-voiced "From complexity to clarity" and a mono caption. The cover scales to 1.03 on hover. The centred glass play button (80px, 96px at `sm`) is a white/0.15 circle with a white/0.5 border, backdrop blur, the Play lift and a pinging ring. Opening it shows a placeholder dialog with a square ghost close button. Beneath, three chapters sit on navy/12 rules with Signal Ink mono timestamps.

### Testimonials
Labelled as illustrative placeholders. One featured navy card (24px chamfer, 32 to 40px padding) with a Signal bloom in its top-right corner, a filled Signal quote mark, the quote in Title Wide, and a 48px round avatar with initials on a blue-to-white conic ring. Five square white cards with a navy/10 edge carry the quote at navy/0.85, a navy/10 rule, and a 36px round initials avatar at navy/0.06 that turns Signal Ink on hover, with the Card hover lift.

### Closing Block
- **CTA:** Navy, `data-ground="dark"`, entered through the 48px (120px at `lg`) chamfer. The terrain is drawn in light: 13 white contours rising from 0.06 in 0.022 steps, one index contour in pale signal at 0.9 and 1.8px, under a Signal bloom at 0.45. Display headline, white/0.7 body, a large white button and a text link to the film.
- **Footer:** The same navy with no seam: the white logo and a line at white/0.65, three link columns at white/0.7, and a white/12 rule above the legal line.

### Motion
Reveals are visible by default and only enhanced with JS: `data-reveal="up"` rises 14px and fades in; plain `data-reveal` wipes in by clip-path. One shared observer arms them, and a 1.2s sweep shows anything already on screen or passed, so no content can stay hidden. Hero lines enter on load in sequence. Loops (risers, dash flow, the managed sweep, pings, sphere rotation, topic timer) are all gated by reduced motion.

## Do's and Don'ts

### Do:
- **Do** keep the page one continuous paper surface until the closing block, separated only by section spacing.
- **Do** draw the hero as contour terrain in navy, read by a Signal Ink agent that opens chamfered insight cards on metric rises, and bring the terrain back in light on navy for the film cover and CTA.
- **Do** use Signal Ink for live marks on paper and Signal for live marks on navy, as strokes, points, sweeps, small squares, short labels and glows.
- **Do** make every solid navy area on paper an object: plate, crown, halo, seal, icon tile, bubble, chip, button, preview, film cover or featured quote.
- **Do** close with one uninterrupted navy block (CTA and footer) marked `data-ground="dark"`, entered through a 48px (120px at `lg`) chamfer.
- **Do** take the layer plates and the decision crown from `src/lib/hex.ts`: flat-top, with a 0.42 vertical squash.
- **Do** chamfer only the top-right corner at 45 degrees (8px to 28px on objects) and keep every other corner square.
- **Do** keep rounded corners and glass inside the agent chat window, the play button and avatars.
- **Do** set hierarchy with graded navy on paper and graded white on navy.
- **Do** use an inset ghost edge, not an outer ring or shadow, on chamfered elements.
- **Do** give each audience card a bespoke line illustration in navy and Signal Ink on paper.
- **Do** label every demo figure, question, conversation, testimonial or interface preview as illustrative.
- **Do** use the official logo files: `logo_dark_blue.png` on paper, `logo_white.png` on navy.
- **Do** give every canvas, loop, scroll stage and scripted conversation a resolved, still state under `prefers-reduced-motion`, and pause canvases offscreen.

### Don't:
- **Don't** divide the paper with bands, alternating grounds, horizontal section rules or wave-line fields.
- **Don't** fill cards, panels or large areas with solid signal blue, and don't set running text in it.
- **Don't** use hexagons as tiles, cells, honeycombs or decoration.
- **Don't** use border radius on containers or controls outside the glass exception.
- **Don't** let spectral or rainbow colour leave the orb and the chat avatar, and don't use purple or violet gradients anywhere else.
- **Don't** put an outer box-shadow or ring on a chamfered element; the clip-path removes it.
- **Don't** turn the terrain into a map: no coastlines, place names, compass roses or grid references. Contours carry metrics.
- **Don't** build structure with drop shadows; shadows belong only to the glass, its bubbles, the play button and hovering square cards.
- **Don't** use the Version 1 ink, rule or survey tokens on Version 2 surfaces. Paper is the only shared token.
- **Don't** set headings, or labels above headings, in Geist Mono.
- **Don't** use generic icon-heading-text feature cards or a dashboard screenshot as the hero.
