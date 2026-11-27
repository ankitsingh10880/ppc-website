# Public Policy Club, FMS Delhi: website (draft 1)

A static website: plain HTML, CSS and a little JavaScript. There is no build step, no framework and no database. Any free static host can serve the folder as it is, and anyone who can edit a text file can update it.

Visitor analytics come from **Umami**, a free, open-source tool the club hosts itself (step 4). The site works fully before Umami is set up.

---

## 1. What's in the folder

```
index.html                 Home: hero, motivation, mission, vision, foundation, what we do
about.html                 About the club, goals, activities
team.html                  Team rosters: Team 2027, Team 2026 and Founding Team (newest first)
journal.html               Publications > Journal (Volume I, 2025)
article-of-the-week.html   Publications > Article of the Week
events.html                Upcoming and past events
gallery.html               Event photos (none yet)
contact.html               Contact form, email, social links, partner with us
privacy.html               What the site collects
404.html                   "Page not found"
assets/css/style.css       All styling. Colours and fonts are set at the top.
assets/js/main.js          Mobile menu, Publications dropdown, forms, analytics impressions
assets/img/                Logo, parliament line art, favicons, journal cover
assets/docs/               The journal PDF
assets/fonts/              Self-hosted fonts (Zilla Slab, Public Sans; free licence)
ACCESSIBILITY.md           How the site meets WCAG 2.2 AA, and how to test it
```

## 2. Site map and page layouts

```
Home
├── About
├── Team ─────────── Team 2027 / Team 2026 / Founding Team
├── Publications
│   ├── Journal
│   └── Article of the Week
├── Events ───────── Upcoming / Past
├── Gallery
├── Contact ──────── #partner (Partner with us)
└── Privacy (footer link)
```

Every page shares the same **header** (logo, club name, navigation; on phones the navigation folds into a "Menu" button) and the same **footer** (newsletter signup, links, contact, privacy).

| Page | Layout |
|---|---|
| Home | Rust-coloured hero: headline and two buttons on the left; on the right, the cream half-circle from the logo with the old Parliament drawing rising into it. Then: Motivation (heading left, text and faculty quote right), Mission and Vision side by side and divided by a column, a Foundation timeline, a "What we do" list linking to the Journal, Article of the Week and Events. |
| Inner pages | Rust title band with the Parliament drawing as a faint watermark, then content on cream. |
| Team | Team 2027 first, then the Faculty Convener (name and designation), Team 2026 and the Founding Team, on alternating backgrounds. Each section groups names by role (e.g. President, Executive Members, Associate Members, Founders) in columns, with a rust heading per role. A "Want to join?" note sits under the current year. |
| Journal | Cover image left; title, description, Read and Download buttons, and the five chapters on the right. |
| Article of the Week | Title, author, date, body; earlier articles listed below. |
| Events | Laid out like a parliamentary order paper: a date block on the left; title, when, where, format, speakers, description and a Register button on the right. |
| Gallery | Grid of photos with captions. |
| Contact | Form left; email, social links and partnership details right. |

## 3. Put the site online (free, plus the domain)

**Recommended: GitHub Pages.** It's free, has HTTPS, supports a custom domain, keeps a history of every change, and lets you edit files in the browser.

1. Create a GitHub account using the club's official email address.
2. Create a new **public** repository named, for example, `ppc-website`.
3. Choose **Add file → Upload files**, drag in everything in this folder (keep the `assets` folder structure), then select **Commit changes**.
4. Go to **Settings → Pages**. Under "Build and deployment", set Source to **Deploy from a branch**, Branch to **main**, and folder to **/ (root)**. Save.
5. After about a minute the site is live at `https://<account>.github.io/ppc-website/`.

**Connect your domain** (the only cost):
1. Buy the domain from any registrar (e.g. Namecheap, GoDaddy, Hostinger).
2. In GitHub **Settings → Pages → Custom domain**, enter it (e.g. `www.ppcfms.in`) and save.
3. At the registrar, add a `CNAME` record for `www` pointing to `<account>.github.io`. For the bare domain, add the four `A` records GitHub lists on that same settings page.
4. Once the domain shows as verified, tick **Enforce HTTPS**.

Alternatives: Cloudflare Pages or Netlify also host static sites for free, and both let you drag and drop the folder.

## 4. Analytics dashboard: self-hosted Umami (free)

Umami gives you a login-protected dashboard showing page views, unique visitors, visit duration, bounce rate, referrers, pages, countries, browsers, operating systems, devices, and the custom events this site sends. It uses no cookies and never stores raw IP addresses. The data sits in a database the club owns.

**What runs where**

| Component | Service (free tier) | Role |
|---|---|---|
| Tracking script | Served by your Umami app | Sends page views and events from the website |
| Ingestion API and dashboard | Umami on **Vercel** (Hobby plan) | Receives events and shows charts; login required |
| Database | **Neon** Postgres (free plan) | Stores the raw events |
| Event hooks | `data-umami-event` attributes in the HTML, plus `assets/js/main.js` | Clicks on key buttons, and impressions of sections and cards |

**Setup (about 30 minutes, once)**
1. Create a **Neon** account with the club email. Create a project in the Singapore or Mumbai region (whichever is closest) and copy the connection string (`postgresql://…`).
2. Create a **Vercel** account with the same email. Fork `github.com/umami-software/umami` to the club's GitHub, then **Import** it in Vercel.
3. In Vercel's environment variables, add `DATABASE_URL` set to the Neon connection string. Deploy.
4. Open the Vercel URL and log in with Umami's default credentials (`admin` / `umami`). **Immediately** go to Settings → Profile and change the password. Then rename the user to the club's official email so it becomes the single master admin.
5. In Umami, **Settings → Websites → Add website**, enter the site's domain, and copy the **Website ID** and **tracking code**.
6. In every `.html` file, find the line marked `ANALYTICS:` in the `<head>`. Remove the `<!--` and `-->` around the script tag on the next line, and replace `YOUR-UMAMI-APP.vercel.app` and `YOUR-WEBSITE-ID` with your values. Use your editor's find-and-replace across all files.

Umami's install guides: docs.umami.is (see "Running on Vercel" and "Running on Neon").

**What the site sends**
| Event name | When | Extra data |
|---|---|---|
| page view | every page load | page, referrer, device, browser, OS, country |
| `cta-hero-journal`, `cta-hero-events` | Home page buttons | — |
| `home-link-journal` / `-aotw` / `-events` | "What we do" links | — |
| `journal-open`, `journal-download` | Journal buttons | `volume` |
| `event-register`, `event-recap` | Event buttons | `event` |
| `contact-submit`, `newsletter-signup` | successful form sends | — |
| `impression` | a tagged section or card is at least half on screen (once per page load) | `item`, `page` |

To track a new button, add `data-umami-event="name"` to it. To count views of a new section, add `data-impression="name"`.

**Privacy and retention.** Umami doesn't set cookies or store IP addresses; it identifies a visit with a hash that changes over time. The privacy page says this. Umami keeps data until you delete it: once a year, delete events older than 13 months from Umami's website settings, or ask a technical member to run a delete query on Neon. Neon's free storage is more than enough for a club site.

## 5. Forms (contact and newsletter)

A static site can't send email itself, so the forms post to **Google Forms** (free, no submission limit, responses land in a Google Sheet). Until they are connected, the forms show "This form is not connected yet. Email us at …".

### Create the two Google Forms (use the club Google account)

The script `tools/google-forms-setup.gs` does all of this in one run: it builds the Contact form (Name, Email, Topic, Message) and the Newsletter form (Email), links each to a response Sheet, applies the settings the website needs, and sets up the email alert described below.

1. Signed in to the club Google account, go to **script.google.com → New project**. Replace the sample code with the whole of `tools/google-forms-setup.gs`, and name the project "PPC Website Forms".
2. Pick **setupForms** in the function menu at the top → **Run**.
3. Google asks for permission. Choose the club account → **Advanced** → **Go to PPC Website Forms** → **Allow**. This is normal for your own script.
4. The execution log, and an email to you, lists each form's `action` URL and its `entry.NNN` field IDs. Use them in the next step (or send them to whoever updates the website).

Running it again is safe: it reuses the forms it already made. Don't rename or delete questions in either form afterwards.

To make the forms by hand instead: use exactly those question titles, give Topic the same five options as the dropdown in `contact.html`, and in **Settings** turn **off** "Collect email addresses" and any "requires sign-in" option, or Google silently rejects the website's submissions.

### Connect them to the site

If you used the script, its output already gives each form's `action` URL and `entry.NNN` IDs: skip to step 3. Otherwise, for each form: ⋮ → **Get pre-filled link**, type a sample answer in every question, click **Get link**, copy it. It looks like
`https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=pp_url&entry.111=Test&entry.222=...`

1. Take the part up to `/viewform` and change it to `/formResponse`. That is the form's action URL.
2. Each `entry.NNN` belongs to one question, in the order you filled them in.
3. In `contact.html`, set the Contact form's `action` to its action URL, and change the `name` of each field to its `entry.NNN` (`name` → Name's entry, `email` → Email's, `topic` → Topic's, `message` → Message's).
4. In every page's footer, set the newsletter form's `action` to the Newsletter action URL and the email field's `name` to its `entry.NNN` (find-and-replace across all files).

Send a test from the live site and check it appears under the form's **Responses** tab.

### Email each contact message to the club inbox

The setup script installs this automatically. Every Contact submission is emailed to `publicpolicyclub@fms.edu` with the name, email, topic and message, and Reply-To set to the sender, so you can answer straight from Gmail (free, up to about 100 emails a day). To change the inbox, edit `CLUB_INBOX` at the top of the script in Apps Script. If an email doesn't arrive, check **Executions** in the Apps Script project for the error.

For the **Newsletter** form there is no per-sign-up email; addresses collect in its response Sheet. Export them when you send the Article of the Week.

## 6. Updating content (no coding needed)

Edit files on GitHub (open the file, select the pencil icon, make changes, **Commit changes**). The live site updates in about a minute. Every editable spot is marked with a comment in capitals (`<!-- EVENTS: … -->`, `<!-- TEAM: … -->` and so on) that explains what to do.

| Task | Where | How |
|---|---|---|
| Add, update or remove an event | `events.html` | See section 7, "Managing events (for admins)". |
| New Article of the Week | `article-of-the-week.html` | Add last week's title to "Earlier articles" (the first time, un-comment that section, see the ARCHIVE comment in the file), then replace the title, author, date and body. |
| Add team members | `team.html` | Add an `<li>` with the name to the right role's `<ul class="roster">`. For a new year, copy the newest `<section>` and follow the `TEAM:` comment inside it. |
| Add photos | `gallery.html` | Upload to `assets/img/gallery/` (about 1200 px wide) and add a `<li>` using the commented `<figure>` block. **Always describe the photo in `alt`.** |
| New journal volume | `journal.html` | Upload the PDF to `assets/docs/`, then copy the volume section and update it. |
| Change colours or fonts | `assets/css/style.css` | Top of the file. Re-check contrast (see ACCESSIBILITY.md) before changing a colour. |

## 7. Managing events (for admins)

All event data lives in one file: **`events.html`**. There is no database; each event is a block of HTML you copy, edit and move.

The page has two lists:

- **Upcoming** (`<ol class="events">`): events that haven't happened yet, **soonest first**.
- **Past** (`<ol class="events events--past">`): finished events, **most recent first**.

### What an event block looks like

Every event is one `<li class="event"> … </li>` block. Here is a full upcoming event, with notes on each line (the `<!-- … -->` notes are for this guide only; you don't need to paste them):

```html
<li class="event" data-impression="event-budget-2027">                 <!-- event ID, for analytics -->
  <p class="event-date"><time datetime="2027-02-05">                    <!-- date as YYYY-MM-DD -->
    <span class="day">05</span><span class="month">Feb</span><span class="year">2027</span>  <!-- date as shown -->
  </time></p>
  <div>
    <h3>Union Budget 2027: what it means for business</h3>             <!-- title -->
    <dl class="event-meta">
      <dt>When</dt><dd>5 February 2027, 5:00 pm to 6:30 pm</dd>
      <dt>Where</dt><dd>Room 101, FMS</dd>
      <dt>Format</dt><dd>Roundtable</dd>
      <dt>Speakers</dt><dd>Speaker Name, Designation</dd>             <!-- optional: delete this line if none -->
    </dl>
    <p class="prose">One or two sentences on what the event covers and who it's for.</p>  <!-- description -->
    <div class="btn-row"><a class="btn" href="https://forms.gle/your-form" target="_blank" rel="noopener noreferrer" data-umami-event="event-register" data-umami-event-event="budget-2027">Register</a></div>  <!-- Register link; same event ID -->
  </div>
</li>
```

### Multi-day events

For an event that runs over more than one day:

- Add the class `event-date--range` to the date block: `<p class="event-date event-date--range">`. This shrinks the day number so the range fits.
- Show the days as a range in the day span, with an en dash: `<span class="day">27–28</span>`. Set the `<time datetime="…">` around the date block to the first day.
- In the "When" line, use one `<time>` per day: `<dd><time datetime="2026-11-27">27</time> and <time datetime="2026-11-28">28 November 2026</time></dd>`.

### Fields

| Field | Where in the block | Format / notes |
|---|---|---|
| Event ID | `data-impression="event-…"` and `data-umami-event-event="…"` | A short, unique, lowercase name with hyphens, e.g. `budget-2027`. Use the **same ID in both places** so analytics can match views to clicks. |
| Date (machine) | `<time datetime="…">` | `YYYY-MM-DD`, e.g. `2027-02-05` |
| Date (shown) | `day` / `month` / `year` spans | Day as two digits, month as three letters (`Feb`), year as four digits |
| Title | `<h3>` | Short and specific |
| When | `<dt>When</dt><dd>…</dd>` | e.g. `5 February 2027, 5:00 pm to 6:30 pm` |
| Where | `<dt>Where</dt><dd>…</dd>` | Room and building, or "Online" |
| Format | `<dt>Format</dt><dd>…</dd>` | e.g. Guest lecture, Roundtable, Workshop, Mock parliament |
| Speakers *(optional)* | `<dt>Speakers</dt><dd>…</dd>` | Name, Designation. Delete the whole line if there are no named speakers. |
| Description | `<p class="prose">` | One or two sentences |
| Register link *(upcoming only)* | `href="…"` on the Register button | The full registration form URL. Keep `target="_blank" rel="noopener noreferrer"` so it opens in a new tab. |

### Add an event

1. Open `events.html` and find the Upcoming list (`<ol class="events">`).
2. Copy an existing `<li class="event"> … </li>` block (or the example above).
3. Paste it in date order: the soonest event goes at the top of the list.
4. Change every field in the table above, including a new event ID in both places.
5. Commit the change and check the Events page.

### Update an event

Find the event by its title or event ID and change only the fields that have changed. If the date changes, update **both** the `datetime` value and the day / month / year spans, and move the block if the order changes.

### When an event is over

1. Cut the whole `<li class="event"> … </li>` block out of Upcoming.
2. Paste it at the **top** of the Past list (`<ol class="events events--past">`). If the Past section is hidden (its `<section>` tag ends in `hidden>`), delete the word `hidden` so the section shows.
3. Replace the Register button with a "See photos" button: add `btn--ghost` to the class, link it to the gallery and change the event name to `event-recap`:
   ```html
   <div class="btn-row"><a class="btn btn--ghost" href="gallery.html" data-umami-event="event-recap" data-umami-event-event="budget-2027">See photos</a></div>
   ```
4. Optionally reword the description in the past tense.

### Remove an event

Delete its whole `<li class="event"> … </li>` block, from `<li` to the matching `</li>`. Make sure you don't leave a stray tag behind.

### The "No events scheduled" message

Directly below the Upcoming list there is a `<div class="empty events-empty">` with the message "No events scheduled right now". It **appears automatically** when the Upcoming list has no events, and hides itself as soon as you add one. You don't need to touch it, and **do not delete that div**, or the empty Upcoming section will show nothing at all.

## 8. Placeholders to replace before launch

- `YOUR_FORM_ENDPOINT`: connect the Google Forms (section 5); and the Umami script (section 4)
- Team members
- Mission, Vision and Motivation are **drafts** written from the club proposal and Dr. Dwivedi's foreword. Get them approved.

## 9. Planned next phase (dynamic site)

When content updates become frequent, the plan is to move events, articles and team members into a database or a headless CMS, so members fill in a form instead of editing HTML. The page designs and CSS stay the same; only the way content gets into the pages changes. Umami already runs on Postgres, so the same Neon account can hold the content database too.
