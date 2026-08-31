# The Threading House — Static HTML/CSS/JS Site

This is a plain **HTML, CSS &amp; JavaScript** conversion of the original Angular
project. No build step, no Node, no framework — just open `index.html` in a
browser, or upload the whole folder to any static host.

## Why it's split into multiple pages

The original app was a single Angular page that rendered **every** section
(hero, about, services, pricing, gallery, testimonials, footer) on first
load. That's a lot of markup, images and CSS for a visitor who only wants
directions or the price list.

This version splits each section into its **own page**, and each page only
loads the CSS/JS it actually needs:

| Page               | Loads                              | Contains                          |
|---------------------|-------------------------------------|------------------------------------|
| `index.html`        | `common.css`, `home.css`            | Hero banner + quick links          |
| `about.html`        | `common.css`, `about.css`           | Our Story + Services grid          |
| `package.html`      | `common.css`, `package.css`, `package.js` | Pricing, tabbed by category |
| `gallery.html`      | `common.css`, `gallery.css`, `gallery.js` | Photo gallery + "See More"  |
| `testimonials.html` | `common.css`, `testimonials.css`    | Client reviews                     |
| `contact.html`      | `common.css`, `contact.css`         | Address, hours, map, phone         |

`index.html` no longer has to parse the pricing table, the full gallery, or
the testimonial cards just to show the hero — so it loads noticeably lighter
and faster.

## Folder structure

```
├── index.html
├── about.html
├── package.html
├── gallery.html
├── testimonials.html
├── contact.html
├── assets/
│   └── images/        (logo, service icons, gallery & testimonial photos)
├── css/
│   ├── common.css     (variables, navbar, footer — used on every page)
│   ├── home.css
│   ├── about.css
│   ├── package.css
│   ├── gallery.css
│   ├── testimonials.css
│   └── contact.css
├── js/
│   ├── common.js       (mobile nav toggle, active-link highlight)
│   ├── package.js       (pricing category tab switching)
│   └── gallery.js       (gallery "See More" reveal)
└── README.md
```

## Glitches found in the original and fixed here

1. **Duplicate global class names.** The Angular version relied on
   component-level CSS scoping, so `.shape-1`, `.section-title`, `.container`
   etc. were reused unscoped in several components. Once merged into plain
   global stylesheets those names would collide and one section's animation
   would bleed into another's. Fixed by namespacing every shared class under
   its parent section (`.gallery .shape-7`, `.footer .shape-1`, etc.) and by
   splitting the CSS per page so unrelated sections never load together.
2. **Broken image paths.** Images were referenced as bare filenames
   (`logo.png`) which only resolved because Angular copied `public/` to the
   site root. All paths now correctly point to `assets/images/...`.
3. **Non-functional nav links across pages.** The original nav used
   `scrollIntoView` on section IDs that only existed on one single page.
   Since the site is now multi-page, nav links point to the correct page
   (and `#hash` for in-page sections like Services), and the current page's
   link is auto-highlighted via `common.js`.
4. **Missing "Testimonials" link.** The Testimonials section existed but had
   no nav entry. Added it to the navbar on every page.
5. **Service icons dead-ended.** Clicking a service icon in "Our Story" used
   to scroll to a pricing section on the same page; it now links straight to
   `package.html`, which still works now that pricing is on its own page.
6. **Empty/incomplete contact info.** The footer had a stray empty `<p></p>`
   under "Contact." Replaced with a working `tel:` link and, on the Contact
   page, a WhatsApp link and an embedded map.
7. **Mobile nav menu leftover state.** The Angular toggle never closed the
   mobile menu after a link was tapped. `common.js` now closes it
   automatically on link click.
8. **`<DIV>` invalid casing / stray commented-out markup** from the original
   templates were cleaned up.

## Running locally

Just double-click `index.html`, or serve the folder with any static server,
e.g.:

```bash
npx serve .
# or
python3 -m http.server 8000
```
