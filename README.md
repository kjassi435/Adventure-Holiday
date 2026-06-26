# Adventure Holiday Destination — Premium Edition

A multi-page static website with **Deep Emerald & Gold** luxury styling, **GSAP scroll animations**, video hero, infinite destination marquees, Google-style reviews, and a full package catalogue.

> Tagline: _Explore More. Create Memories._

---

## File Structure

```
new web zcode/
├── index.html      Home (video hero, trust bar, services, packages, process, reviews, marquees)
├── packages.html   6 service categories + 12 bookable packages
├── about.html      Story, founder, at-a-glance, stats, vision/mission, accreditations
├── contact.html    Enquiry form with package dropdown, info cards, Google Map
├── css/style.css   Full design system (emerald + gold, Fraunces serif, responsive)
├── js/main.js      GSAP reveals, marquees, counters, nav, form validation + prefill
└── README.md       You are here
```

## How to Run

Open `index.html` in any browser. For the best experience (video hero, fonts, map):

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Hosting

Upload the entire folder to any static host — Netlify, Vercel, GitHub Pages, Cloudflare Pages, or your cPanel. No build step, no server-side code.

---

## ⚠️ REPLACE THESE — Dummy Data Flags

The following content is **placeholder** and must be replaced with real data before the site goes live:

### Founder / Director (about.html)
- **Photo** — `about.html` line ~112: the Unsplash `photo-1560250097-0b93528c311a` is a stock face. Replace with the real founder's portrait.
- **Name** — Currently "Mr. Rajesh Verma". Replace with the actual director's name.
- **Role** — Currently "Founder & Managing Director". Adjust as needed.
- **Message** — The quoted founder's message is placeholder copy. Replace with the real message.

### Company Facts (about.html + index.html)
- **Year Established** — Currently "2014". Update to the actual founding year.
- **Years Experience** — Currently "11+". Derived from founding year — update if the year changes.
- **Travellers Count** — Currently "5,000+". Replace with the real number.
- **Destinations** — Currently "50+". Update to match the real catalogue.
- **Google Rating** — Currently "4.9". Replace with the actual Google rating.

### Package Prices (packages.html + index.html)
All package prices are **dummy starting-from figures** (₹9,999 – ₹59,999). Replace with real pricing.

| Package | Current Price | File |
|---------|-------------|------|
| Jim Corbett Wildlife Safari | ₹18,999 | packages.html |
| Ranthambore Tiger Reserve | ₹22,499 | packages.html |
| Kerala Honeymoon | ₹38,999 | packages.html |
| Shimla-Manali Honeymoon | ₹29,999 | packages.html |
| Manali Family Adventure | ₹26,499 | packages.html |
| Nainital Lake Retreat | ₹14,999 | packages.html |
| Goa Beach Holiday | ₹15,999 | packages.html |
| Rajasthan Royal Heritage | ₹42,999 | packages.html |
| Andaman Island Escape | ₹44,999 | packages.html |
| Rishikesh Adventure & Camping | ₹9,999 | packages.html |
| Shimla Hill Retreat | ₹19,999 | packages.html |
| Dubai International Getaway | ₹59,999 | packages.html |

### Google Reviews (index.html)
Three review cards are fictional placeholders:
- **Priya Sharma** (New Delhi, 2 weeks ago) — replace with a real review
- **Rohit & Neha Agarwal** (Gurgaon, 1 month ago) — replace with a real review
- **Amit Verma** (Noida, 3 weeks ago) — replace with a real review

The reviewer photos are Unsplash stock faces. Consider using Google profile photos or initials.

### Accreditations (about.html)
Currently listed: "IATA Accredited", "Ministry of Tourism", "4.9★ Google Rating", "Verified Travel Agency". Replace with actual certifications the company holds.

### Social Media Links (all pages)
All social media `<a href="#">` links point to `#`. Replace with real Facebook, Instagram, WhatsApp, and YouTube profile URLs.

---

## Swapping Images

All photography uses **remote Unsplash URLs**. To replace:

| Section | File | What to Change |
|---------|------|---------------|
| Hero video | `index.html` `<video>` | Replace `<source src="...">` with your own video file |
| Hero poster | `index.html` `<video poster="...">` | Replace poster URL |
| Trust bar intro image | `index.html` split | `<img src="...">` near "Who We Are" |
| Featured packages (3) | `index.html` pkg cards | Three `<img src="...">` |
| CTA band | `index.html` / all | `.cta__media img` |
| Destination marquees (16 cards) | `index.html` marquee tracks | `.dest-card img` |
| Package cards (12) | `packages.html` | Twelve `<img src="...">` |
| About story images (2) | `about.html` split-duo | Two `<img src="...">` |
| Founder photo | `about.html` | `.founder__photo img` |
| Review avatars (3) | `index.html` | `.review-card__who img` |
| Page hero banners | all interior pages | `.page-hero__media` background-image |

> Tip: put your own photos in an `images/` folder and reference them as `images/my-photo.jpg`.

---

## External Dependencies (CDN)

| Library | Version | CDN | Purpose |
|---------|---------|-----|---------|
| Google Fonts (Fraunces, Inter) | latest | fonts.googleapis.com | Typography |
| GSAP Core | 3.12.5 | cdnjs.cloudflare.com | Scroll animations |
| GSAP ScrollTrigger | 3.12.5 | cdnjs.cloudflare.com | Scroll-triggered reveals |
| Unsplash Images | — | images.unsplash.com | Stock photography |
| Pexels Video | — | videos.pexels.com | Hero background video |
| Google Maps Embed | — | maps.google.com | Contact page map |

No npm, no build tools, no server required.

---

## Features

- ✅ Full-screen **video hero** with poster fallback
- ✅ **Infinite destination marquees** (2 strips, pause on hover)
- ✅ **Google Reviews** widget with official G logo + star ratings
- ✅ **How We Work** 4-step process section
- ✅ **12 bookable packages** with price, duration, inclusions
- ✅ **6 service categories** (clear hierarchy above packages)
- ✅ **Founder/Director** section with photo + message
- ✅ **At a Glance** facts (founded, experience, HQ, stats)
- ✅ **Accreditations** bar
- ✅ **GSAP ScrollTrigger** animations (reduced-motion safe)
- ✅ **Animated stat counters**
- ✅ **Transparent→solid navbar** on scroll
- ✅ **Contact form** with validation, mailto fallback, URL param prefill (`?package=Name`)
- ✅ **Fully responsive** (desktop → mobile)
- ✅ No "duplicate contact" — single contact page, correct routing

---

© Adventure Holiday Destination. All rights reserved.
