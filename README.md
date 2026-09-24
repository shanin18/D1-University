# D1 University landing page

A customizable React + Tailwind CSS skeleton based on the supplied desktop/mobile reference. Uses Vite and Embla Carousel. All copy, statistics, testimonials, university marks, and event details are illustrative placeholders. The artwork is CSS, so no external images or fonts are required.

## Run

```sh
npm install
npm run dev
```

`npm run build` creates the production site in `dist`. `npm run preview` serves that build.

## Customize

- `src/data.js`: programs, statistics, partner names, events, testimonials, FAQs.
- `src/App.jsx`: section markup and reusable interaction components.
- `src/styles.css`: Tailwind theme tokens, responsive layout, animation, and component styles. Start with `--color-brand`, `--font-display`, and `.container`.
- Replace `.hero-art`, `.event-art`, and the text-based partner marks with your final assets.

## Interactions

- Logo marquee: duplicated identical tracks for a seamless CSS loop; pauses on hover or with its pause button. Reduced-motion mode provides a manually scrollable strip.
- Statistics: count up once when entering the viewport, with requestAnimationFrame cleanup and final values exposed to screen readers.
- Events and FAQ: animated single-open accordions, with expandable buttons and inert collapsed panels. Clicking an open item closes it.
- Testimonials: Embla `loop: true` repositions slides continuously. Touch dragging, previous/next buttons, pagination, and left/right keyboard arrows are supported. Keep enough cards to fill more than the visible viewport (six supplied; three visible on desktop). No autoplay to interrupt reading.
- Mobile menu: expanded state, Escape to close, closes when selecting a link.
- Event inquiries: native modal with focus management, required name/email validation, and a locally generated copyable inquiry. **No backend, registration, email sending, or data storage is connected.** Connect your service before launch.
- Scroll reveal, hover transitions, skip navigation, visible focus states, and system reduced-motion support.

## Browser checks

```sh
npx playwright install chromium
npx playwright test
```

Checks desktop and mobile layouts, FAQ behavior, carousel wrapping, inquiry validation, reduced-motion counters, and navigation.
