# ishaanmehrotra.com — personal portfolio

A static site: hand-written HTML and CSS with about 80 lines of vanilla JavaScript. No build step, no framework, no backend. Clone it, open `index.html`, and it works.

The home page is one scrolling document. Nothing is hidden behind a button, and the JavaScript is optional — with it disabled, every section and every project still renders.

## Structure

```
index.html          The whole home page
assets/
  style.css         All styling. Design tokens are at the top of the file.
  app.js            Two things: the project filters, and the nav highlight.
  img/              Photos, plus figures cropped from the source PDFs
projects/           Six project case studies, one page each
docs/               Public-safe project PDFs
```

Every path is relative, so the site works at a repository subpath as well as at a root domain.

## Running it locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Serving it rather than opening the file directly matches how GitHub Pages serves it.

## Notes on the build

- **Typography:** Instrument Serif for display and Inter for body, loaded from Google Fonts as a progressive enhancement over a designed fallback stack (Iowan Old Style / Georgia and the system sans). Blocking the font request degrades gracefully.
- **Color:** a token system at the top of `style.css`. Every text-and-background pair clears WCAG AA contrast; the lowest is 5.07:1.
- **Layout shift:** every image carries explicit `width` and `height` matching the real file, so lazy loading costs nothing. Measured CLS is 0.000.
- **Accessibility:** skip link, one `h1` per page, headings in order, `aria-pressed` on the filter buttons, `aria-current` on the active nav link, descriptive alt text on every image, visible focus rings, and a `prefers-reduced-motion` path that disables the smooth scroll and every transition.
- **Responsive:** the sticky nav goes from one row to two at 1000px, and `scroll-margin-top` on each section changes with it so an anchored heading never lands underneath the bar.

## License

The code is free to borrow. The written content, photographs and project documents are not.
