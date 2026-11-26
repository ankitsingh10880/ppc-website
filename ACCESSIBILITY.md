# Accessibility: WCAG 2.2 AA

Target: WCAG 2.2 Level AA, which covers everything in 2.1 AA. Draft 1 was checked with axe-core 4 (WCAG 2.0/2.1/2.2 A and AA rules plus best practices) on all 10 pages at desktop (1366 px) and phone (390 px) widths: **0 violations**. Keyboard behaviour was tested with a scripted browser.

| Requirement | How the site meets it |
|---|---|
| Landmarks (1.3.1) | Every page has `header`, `nav` (labelled "Main"), `main` and `footer`. Footer blocks and page sections are labelled with `aria-labelledby`. |
| Heading order (1.3.1, 2.4.6) | One `h1` per page, then `h2` for sections and `h3` within them. No levels are skipped. |
| Skip link (2.4.1) | "Skip to main content" is the first thing you reach with Tab and becomes visible when focused. |
| Keyboard (2.1.1, 2.1.2) | Everything is a real link or button. The Publications menu opens with Enter or Space and closes with Escape (focus goes back to the button), when you tab out of it, or when you click elsewhere. The mobile Menu button sets `aria-expanded`. |
| Visible focus (2.4.7, 2.4.11) | A 3 px outline with 3 px offset: rust on cream (8.9:1), cream on rust (8.9:1). Nothing hides focused elements. |
| Current page (2.4.8, best practice) | `aria-current="page"` on the active link, shown with a gold underline. Breadcrumbs on the Publications sub-pages. |
| Text contrast (1.4.3) | Body ink on cream 16.6:1; rust links and headings 8.9:1; muted captions 7.2:1; cream on rust 8.9:1. All pass 4.5:1. |
| Non-text contrast (1.4.11) | Form borders (#5C534D on white) 7.5:1; gold current-page marker on rust 3.8:1; buttons 8.9:1. All pass 3:1. Gold is never used for text on light backgrounds (only 2.3:1). |
| Link recognition (1.4.1) | Links in text are underlined, so they don't rely on colour alone. |
| Images (1.1.1) | The Parliament drawing and journal cover have descriptive `alt`. The header logo has empty `alt` because the club name beside it is the link text. Watermarks are CSS backgrounds, so screen readers skip them. Photo placeholders are labelled "Photo placeholder". |
| Forms (1.3.1, 3.3.1, 3.3.2, 4.1.3) | Every field has a visible `<label>`, with `autocomplete` for name and email. Required fields are marked with an asterisk and explained in text. Errors name the field and move focus to it. Results are announced through a `role="status"` live region. |
| Target size (2.5.8) | Buttons, nav links and form controls are at least 44 px tall. |
| Reflow and 200% text (1.4.4, 1.4.10) | Sizes use `rem` and `clamp`, with no fixed-height text boxes. Layouts collapse to one column at 768 px and the nav folds into a menu at 960 px, so 200% zoom and 320 px screens don't need sideways scrolling. |
| Reduced motion (2.3.3) | The only animation (the hero disc rising on load) and smooth scrolling are switched off when `prefers-reduced-motion` is set. |
| Language (3.1.1) | `<html lang="en-IN">`. |
| Page titles (2.4.2) | Each page has a unique title in the form "Page | Public Policy Club, FMS Delhi". |
| Windows High Contrast | `forced-colors` styles keep button and date-block borders visible. |

**Known gap.** The Journal PDF was designed for print and isn't tagged for screen readers. WCAG applies to documents a site publishes, so the Journal page says this and offers an accessible copy by email. To close the gap fully, publish each chapter as an HTML page in a later phase.

## How to re-test after content changes
1. **axe DevTools** (free browser extension): run on each changed page and fix anything flagged "Critical" or "Serious".
2. **Lighthouse** (Chrome DevTools → Lighthouse → Accessibility): aim for 100.
3. **Keyboard only**: unplug the mouse and Tab through the page. Can you reach and use everything, and can you always see where you are?
4. **Screen reader**: NVDA (free, Windows) or VoiceOver (built into Mac and iPhone; turn it on with Cmd+F5). Check that headings, links, images and form errors are read sensibly.
5. **Zoom to 200%** in the browser and check nothing is cut off or overlapping.
6. **New colours**: check contrast at webaim.org/resources/contrastchecker before using them.
