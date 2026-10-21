# Senan Qulamov — portfolio

Personal site for [48team.space](https://48team.space). Built with Next.js, Three.js, GSAP and Lenis.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run format     # Prettier
```

Node 20 or newer.

To open the development server from another device, list its full origin in `DEV_ORIGINS` before starting Next. Multiple origins are comma-separated:

```powershell
$env:DEV_ORIGINS = "http://192.168.1.20:3000,http://172.25.224.1:3000"
npm run dev
```

## Editing content

Almost everything you will want to change lives in `src/data`:

| File | What it holds |
| --- | --- |
| `profile.ts` | Name, email, phone, links, roles, the "Now" block |
| `projects.ts` | All projects: text, tech, links, images, colors |
| `essays.ts` | Essay titles, dates and tags. The text is in `src/content/essays/<slug>.md` |
| `home.ts` | Hero, story scenes, BidBary section, live lot demo, studio cards, contact doors |
| `services.ts` | Services, ways of working, process steps, FAQ |
| `pricing.ts` | Prices, packages, extras, timelines, budgets, call slots |
| `cv.ts` | The full CV on the Credits page |
| `books.ts` | The library |
| `press.ts` | Bios, talk topics, press facts |
| `lab.ts` | Lab experiment titles and descriptions |
| `assistant.ts` | Everything the Director knows, in English, Azerbaijani and Russian |
| `navigation.ts` | Page order in the menu and header |

Project screenshots are in `public/images/<project>/`. Add a file there and list its path in `projects.ts`.

## Translations

The site is written in English. `src/i18n/az.ts` and `src/i18n/ru.ts` map each English phrase to its translation, so to translate a new phrase add a line with the exact English text as the key. Text that is not in the dictionaries stays in English. The chosen language is kept in a `lang` cookie.

## Structure

```
src/
  app/            routes, metadata, sitemap, robots, share image, /api/contact
  components/     React markup for the shell and every page
  data/           content (see above)
  content/        essay text in Markdown
  i18n/           dictionaries and helpers
  experience/     everything that moves: WebGL, transitions, scroll, menu, sound, the Director
  lib/            small shared helpers
  styles/         one stylesheet per area, imported from index.css
```

React renders the markup. `src/experience` is plain TypeScript that brings it to life once the page is on screen. It starts from `components/shell/Experience.tsx`, and `experience/router.ts` runs the chrome transition around every Next.js navigation.

Useful places when changing behaviour:

- `experience/gl/scenes.ts`: where the chrome object sits and which shape it takes in each section
- `experience/gl/shaders.ts` and `experience/gl/engine.ts`: the WebGL object and post effects
- `experience/transitions.ts`: page transitions and the project opening
- `experience/scroll.ts`: scroll animations
- `experience/pages/*`: page-specific behaviour

## Email

Briefs from "Start a project" and talk invitations from the press kit go through `/api/contact`. Without configuration the site opens the visitor's mail app instead, so it works out of the box.

To deliver them by email, create a [Resend](https://resend.com) account, verify your domain, and set these environment variables:

```
RESEND_API_KEY=...
CONTACT_TO=qulamovsenan@gmail.com
CONTACT_FROM=Portfolio <hello@48team.space>
```

## Deploying to Vercel

1. Push the project to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository. The defaults are correct.
3. Optionally add the email variables above under **Settings → Environment Variables**.
4. Under **Settings → Domains**, add `48team.space` and follow the DNS instructions.
5. Turn on **Analytics** in the project if you want visitor stats. The tracking script is already included.

## Notes

- Visitors can turn effects down from the menu ("Reduce effects"). The site also respects the system reduced-motion setting.
- Sound is generated in the browser and stays off until the visitor chooses it.
- The SQL playground loads `public/vendor/sql-wasm.js` and its `.wasm` file, the browser build of sql.js 1.13.
