---
version: alpha
name: Nubelson Fernandes
description: Quiet, editorial personal site. Inter body copy, Newsreader headings, an achromatic palette, hairline dividers and no shadows. Content comes from Notion; the shell stays out of the way.
colors:
  background: "#fafafa"
  foreground: "#171717"
  primary: "#171717"
  on-primary: "#fafafa"
  muted-foreground: "#525252"
  subtle-foreground: "#717171"
  muted-surface: "#f2f2f2"
  card: "#f0f0f0"
  popover: "#ffffff"
  border: "#ebebeb"
  input: "#e5e5e5"
  ring: "#737373"
  destructive: "#e7000b"
  dark-background: "#111111"
  dark-foreground: "#ededed"
  dark-primary: "#e5e5e5"
  dark-muted-foreground: "#9e9e9e"
  dark-subtle-foreground: "#8c8c8c"
  dark-surface: "#1a1a1a"
  dark-border: "#212121"
  dark-input: "#262626"
  dark-ring: "#9e9e9e"
  dark-destructive: "#ff6467"
typography:
  heading-article:
    fontFamily: Newsreader
    fontSize: 1.75rem
    fontWeight: 500
    lineHeight: 34px
    letterSpacing: "-0.015em"
  heading-page:
    fontFamily: Newsreader
    fontSize: 1.25rem
    fontWeight: 500
    lineHeight: 26px
    letterSpacing: "-0.01em"
  heading-section:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: 600
    lineHeight: 26px
    letterSpacing: "-0.01em"
  heading-minor:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 600
    lineHeight: 22px
  body-article:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 26px
    letterSpacing: "-0.006em"
  body-regular:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 22px
    letterSpacing: "-0.006em"
  body-small:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 20px
  body-xs:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 16px
  mono:
    fontFamily: Geist Mono
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.625
rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 10px
  xl: 14px
  pill: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 14px
  lg: 20px
  xl: 32px
  section: 56px
  column: 672px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-regular}"
    rounded: "{rounded.lg}"
    padding: 10px
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.subtle-foreground}"
    typography: "{typography.body-regular}"
    rounded: "{rounded.lg}"
    padding: 10px
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-regular}"
    rounded: "{rounded.lg}"
    padding: 10px
  reaction-pill:
    backgroundColor: transparent
    textColor: "{colors.subtle-foreground}"
    typography: "{typography.body-regular}"
    rounded: "{rounded.pill}"
    padding: 10px
  card-surface:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
  popover:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
  input:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    typography: "{typography.body-regular}"
    rounded: "{rounded.lg}"
    padding: 10px
---

# Design System: Nubelson Fernandes
**Project ID:** `nublson` (this repository; there is no linked Stitch project)

The design lives in code: color and radius tokens in `src/app/globals.css` (OKLCH, with the sRGB hex companions listed above), type in `src/components/typography.tsx`, controls in `src/components/ui/`. This file translates those into design language so a person or a tool can produce new screens that belong to the same site.

## 1. Visual Theme & Atmosphere

A **quiet, bookish reading surface**. The site reads like a well-set personal journal rather than a portfolio landing page: one narrow column of text, a serif only for titles, a grayscale palette with no brand hue, and structure drawn with hairlines instead of boxes or shadows.

The mood is **calm, sparse and typographic**. Density is low. Sections are separated by long vertical pauses, and within a section everything is flush-left and stacked. Nothing competes with the words and the occasional cover image. Interaction is felt, not seen: text darkens on hover, rows settle a hair on press, icons cross-fade. Emphasis comes from **weight, size and ink darkness**, never from color.

The two themes are the same page in two lighting conditions. Light mode is **warm paper white with near-black ink**. Dark mode is **soft charcoal with chalk-white ink**, slightly lifted so it never reads as pure black. The structure, spacing and type are identical across both.

## 2. Color Palette & Roles

The palette is **achromatic**: every working color is a gray. The single chroma in the system is a red reserved for errors. Interaction states use opacity and the muted fill, not new hues.

### Light mode

- **Paper (`#fafafa`)**: the page canvas. A hair off pure white so images and the white popover still read as lifted.
- **Ink (`#171717`)**: headings, titles, active links, and the fill of the primary button. The darkest value on the page.
- **On-ink (`#fafafa`)**: text and icons sitting on an Ink surface, such as the primary button label.
- **Reading gray (`#525252`)**: body copy in articles and descriptions. Deliberately softer than Ink so headings pop without being larger.
- **Whisper gray (`#717171`)**: metadata, dates, section labels, navigation and footer links, inactive icons. The default "quiet" voice; it darkens to Ink on hover. Holds roughly 4.6:1 against Paper.
- **Muted fill (`#f2f2f2`)**: hover and pressed backgrounds for rows, ghost buttons and the active reaction pill. Also the skeleton pulse color.
- **Card fill (`#f0f0f0`)**: project-icon monograms and any contained surface. A step darker than Muted fill so it stays visible on Paper.
- **Popover white (`#ffffff`)**: the hover-card background, the only pure white in the system.
- **Hairline (`#ebebeb`)**: list dividers, section rules, the line above the reactions row.
- **Control stroke (`#e5e5e5`)**: input borders, code-block borders and the inset ring on reaction pills. Slightly firmer than Hairline so controls read as controls.
- **Focus ring (`#737373`)**: the 2px keyboard-focus outline, offset 2px, and the 3px soft ring on inputs. Holds about 4.5:1 against Paper.
- **Image outline (black at 10%)**: a 1px inset edge on cover images so a light photo does not melt into the page.
- **Error red (`#e7000b`)**: validation errors, destructive actions, and failed states such as "couldn't save". Never decorative.

### Dark mode

- **Charcoal (`#111111`)**: the page canvas.
- **Chalk (`#ededed`)**: headings and active text.
- **Chalk button (`#e5e5e5`)**: the primary button fill, with Ink (`#171717`) for its label. Primary and foreground swap roles.
- **Reading gray (`#9e9e9e`)** and **Whisper gray (`#8c8c8c`)**: body copy and metadata, same roles as in light mode.
- **Raised surface (`#1a1a1a`)**: cards, popovers, muted hover fills and skeletons all share this one step above the canvas.
- **Hairline (`#212121`)** and **Control stroke (`#262626`)**: dividers and input or code borders.
- **Focus ring (`#9e9e9e`)**, **Image outline (white at 10%)**, **Error red (`#ff6467`)**: as in light mode, lifted for contrast.

## 3. Typography Rules

Three families, each with one job.

- **Newsreader** (serif, optical sizing on) carries the **titles only**: the article title and the page title. Medium weight, never bold. It gives the site its editorial voice.
- **Inter** carries **everything else**: body, section headings, labels, controls, metadata. Stylistic sets `cv11` and `ss01` are on for the single-storey a and open digit shapes. Numbers in dates, counts and tables use **tabular figures** so columns stay aligned.
- **Geist Mono** is for **code only**, inside the code block.

The scale is small and tight. Base body text is **14px on a 22px line** with a faint **negative tracking (−0.006em)**. Nothing on the page is larger than 28px.

- **Article title**: Newsreader, 24px on 30px, stepping up to **28px on 34px** from tablet width, medium weight, tracking −0.015em, balanced line wrapping. Used once, at the top of a post.
- **Page title**: Newsreader, **20px on 26px**, medium, tracking −0.01em. The Home, About, Writing and Projects headers.
- **Section heading**: Inter, **15px on 26px, semibold**, tracking −0.01em. Headings inside article bodies (Notion heading 1 and 2 both land here) so they sit in the text rather than above it.
- **Minor heading**: Inter, **14px on 22px, semibold**. Notion heading 3 and small subheads.
- **Article body**: Inter, **15px on 26px**, Reading gray. One step up from UI text so long reads breathe; the line is generous (about 1.73).
- **UI body**: Inter, **14px on 22px**, Reading gray. Descriptions on index pages, row text, button labels.
- **Small**: 13px on 20px, Whisper gray. Captions and secondary rows.
- **Extra small**: 12px on 16px, Whisper gray. Tooltips and fine print.
- **Section label**: 14px, **regular weight**, Whisper gray, lowercase feel. Section titles like "Projects" or "Writing" are intentionally quieter than the content under them; the "All" link beside them matches.

Rules: headings are Ink, body is Reading gray, metadata is Whisper gray. Lower emphasis by switching to the quieter token, not by lowering opacity. Descriptions and ledes cap at a **60-character measure** so they never run the full column.

## 4. Component Stylings

* **Buttons:** Compact and softly rounded. The **default** size is **32px** tall with **10px** corners (about a third of the height), 14px medium text and 16px icons; large is 36px with the same corners and type. The two smaller sizes tighten everything: **small** is 28px tall with **8px** corners, 12.8px text and 14px icons; **extra small** is 24px tall with 8px corners, 12px text and 12px icons. Icon-only variants are square at the same heights. The **primary** button is a solid Ink fill with On-ink text; hover fades the fill to 80%. **Outline** sits on the page background with a Hairline stroke and takes the Muted fill on hover. **Ghost** is bare text in Whisper gray that darkens to Ink and gains the Muted fill on hover; it is the house style for icon controls such as the theme toggle. **Destructive** is a 10% Error-red tint with Error-red text, never a solid red block. Pressing nudges the button down one pixel. Focus shows the ring color as both border and a 3px halo.

* **Reaction pills:** The like, dislike, save and share controls at the end of a post are **pill-shaped** (fully rounded), **28px** tall, drawn with a **1px inset stroke** in Control-stroke gray instead of a border, in Whisper gray text with tabular counts. Hover takes the Muted fill; the selected pill keeps the Muted fill and Ink text. Press scales the pill to 96%; a tapped icon pops to 120% and back over 300ms. When a reaction's icon changes state (for example save to saved), both icons stay mounted and **cross-fade over 200ms on the house easing**, the outgoing one shrinking to 80% with a 2px blur.

* **Theme toggle:** A ghost icon button in Whisper gray that darkens to Ink. Its sun and moon cross-fade too, but with a **stronger, snappier swap**: 200ms on a standard ease (`cubic-bezier(0.2, 0, 0, 1)`), the outgoing icon shrinking to 25% with a 4px blur. This is the one control that does not use the house easing; new icon swaps should copy the reaction pills, not the toggle.

* **Cards and containers:** The site has almost no cards. Grouping is done with **hairlines**: post lists are bounded by a top and bottom rule with 1px dividers between rows, and the reactions row sits under a single rule. Where a contained surface is needed it uses the Card fill at **10px radius** with **no shadow**. The one true floating surface is the **link hover card**: Popover white, 10px radius, a 1px 10% Ink ring and a medium shadow, scaling in from 95% over 100ms. **Tooltips** invert: Ink background, Paper text, 12px type, **8px radius**, with a small rotated-square arrow.

* **Lists and rows:** Post rows are **full-width tap targets** with title left and date right on one baseline, 10px of vertical padding, no background. Hovering one row fades its siblings to Whisper gray so the hovered title stands out. Project rows are a **16px icon plus text** grid with 10px horizontal and 8px vertical padding, **10px radius**, and the Muted fill on hover; the description beneath lifts from Whisper to Reading gray. External rows carry a small up-right arrow that nudges one pixel out on hover. Any pressed row settles to **98% scale** (not smaller, so wide rows don't jump).

* **Inputs and forms:** **32px** tall, **10px radius**, a 1px Control-stroke border on a **transparent** background (30% Control stroke in dark mode), 10px horizontal padding, **Reading-gray** placeholder (one step darker than the metadata gray, so placeholders read as text, not chrome). Focus swaps the border to the Focus-ring gray and adds a 3px halo at half opacity. Invalid fields take an Error-red border and a 20% Error-red halo in light mode; in dark mode the border drops to half opacity and the halo rises to 40% so it still shows on Charcoal. Disabled fields drop to 50% opacity.

* **Code blocks:** A **10px-radius** container with a 1px Control-stroke border (and a faint 30% Control-stroke tint in dark mode). A sans-serif language title sits top-left in Ink; the copy button fades in at top-right on hover or focus. Code is Geist Mono at 14px with a relaxed line height; syntax colors come from the server-side highlighter in grays.

* **Images:** Cover images and thumbnails are **10px-rounded**, edge-to-edge in the column, 16:9 in article headers, with a 1px inset **Image outline** at 10% so light photos hold their edge. They fade in over a blurred placeholder over 300ms. Captions are 14px Reading gray, 8px below.

* **Icons:** Lucide, **16px** in controls and **14px** in rows, drawn at a **1.5px stroke** so they match the type weight. Project icons are emoji, a 16px image, or a 16px **4px-rounded** Card-fill monogram with a 10px letter in Whisper gray.

* **Skeletons:** Muted-fill blocks with **8px radius**, a slow pulse, and the exact line boxes of the content they stand in for. They do not animate in; the real content fades in over 200ms when it replaces them.

## 5. Layout Principles

- **One narrow column.** Everything, header and footer included, sits in a centered column capped at **672px** with **16px side gutters**. There is no sidebar and no multi-column grid; project lists and post lists are single-column stacks inside it.

- **Long vertical pauses between sections.** Top-level blocks on a page are separated by **56px** (48px under tablet width). The header has 32px above the logo and 56px below it (24px and 48px on phones). The footer sits 64px under the last block with 40px below it. These gaps are the loudest thing on the page and should not be filled.

- **Tight rhythm inside a section.** A section label and its content are **14px** apart. Page heroes stack title, meta line and description at **20px**; article heroes open up to **32px** between title group, lede and cover. Article paragraphs and blocks are **18px** apart. Related inline items (icon and label, date and category) sit 6 to 8px apart.

- **Flush left, baseline aligned.** All text starts on the left edge of the column. Two-ended rows (title and date, section label and "All", views and reactions) align on the **baseline** with the second item pushed to the right edge. Nothing is centered.

- **Chrome is minimal.** The header is a 24px logo and a theme toggle. Primary navigation lives in the **footer** as a row of Whisper-gray links, with the copyright beside them from 480px wide. Content owns the fold.

- **Motion is subtle and brief.** One house easing (`cubic-bezier(0.23, 1, 0.32, 1)`, a fast-out settle) governs page entrances, color changes, presses and reaction icons; the theme toggle is the single exception noted above. Color changes take 150ms; page blocks rise 6px and fade in over 500ms, staggered 60ms apart, in CSS so it runs without JavaScript; streamed content fades in over 200ms. Reduced-motion preferences collapse all of it to instant.

- **Honest without JavaScript.** Every list, article and image renders in the initial HTML. Only the reactions row waits on the client, behind a skeleton that matches its exact shape so nothing shifts.

### Do

- Keep the palette gray. Introduce color only through content (cover images, favicons, emoji).
- Reserve Error red for real errors and irreversible actions.
- Use Whisper gray for anything secondary, and let hover bring it up to Ink.
- Draw separation with a hairline or a fill step, never a shadow.
- Give every control a visible focus ring and a reduced-motion fallback.

### Don't

- Add an accent color, a gradient, or a saturated call to action.
- Use shadows beyond the hover card, or any glass or blur surface.
- Widen the column, center text, or break content into a grid.
- Set body text below 13px, or any title above 28px.
- Mix in another typeface; Newsreader for titles, Inter for the rest, Geist Mono for code.

Validate the front matter with `npx @google/design.md lint DESIGN.md`. Format spec: https://github.com/google-labs-code/design.md
