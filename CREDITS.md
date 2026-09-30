# Credits and image sources

All stock images were graded to the Versa navy/cyan palette (duotone) with tools/grade.py and exported as WebP in public/img/.

## Team photography (client supplied)
- versa-photo-1.jpg to versa-photo-4.jpg, supplied by Versa Capital (/workspace/versa/uploads). Used as team-1..4 (subtle grade "g", duotone "d").

## Stock photography (Pexels License, free to use, attribution not required but given here)
- city-night: "Skyscrapers at Night" (downtown Montreal) by Julia Barrantes. https://www.pexels.com/photo/skyscrapers-at-night-15452183/
- facade-v: "Modern Architectural Building Facade Design" by Glenn Deblaere. https://www.pexels.com/photo/modern-architectural-building-facade-design-35528879/
- skyline: "Montreal Cityscape with Skyscrapers and Clouds" by Daoud Saeed. https://www.pexels.com/photo/montreal-cityscape-with-skyscrapers-and-clouds-38633406/
- equipment: "Advanced Industrial CNC Machine Close-Up" (Pexels). https://www.pexels.com/photo/advanced-industrial-cnc-machine-close-up-36522027/

## Logo
- Wordmark from https://versacapital.ca/wp-content/uploads/2021/01/image-1.png. The live site returned HTTP 429 (rate limited), so the identical file was retrieved from the Internet Archive snapshot of 2026-09-17: http://web.archive.org/web/20260917151554/https://versacapital.ca/wp-content/uploads/2021/01/image-1.png
- logo-navy.png is derived from it (white letters recoloured to #003459). The intro V mark is an SVG redrawn from the logo geometry and sampled colours.

## Generative
- CTA background lines: canvas drawing on the slant of the V stripes (src/main.js, vLines). No external asset.

## Libraries and fonts
- GSAP + ScrollTrigger (npm gsap), Lenis (npm lenis), Vite.
- Inter and Poppins from Google Fonts (SIL Open Font License).
