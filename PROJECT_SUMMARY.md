# CYODA Project Summary

## Project Idea
CYODA stands for "Choose Your Own Dating Adventure".

The project is a mobile-first website intended to be reached from a URL or QR code printed on a t-shirt. Someone sees the t-shirt, opens the site on their phone, and is invited into a playful compatibility journey.

The premise is:

> You are either interested in the chap wearing the t-shirt, or just curious what the URL was about.

The experience should feel like an interactive story rather than a form. It should be flirtatious, funny, low-pressure, respectful, and easy to use on a phone.

## Product Decisions So Far
- Framework: React + Vite + TypeScript.
- Target: mobile-first web app, suitable for QR-code traffic.
- Public identity level: first name only.
- No public photo, surname, phone number, or direct contact details on the landing page.
- Tone: playful flirt, not crude or pushy.
- First screen: two large choices.
- Curious visitors should get an explanation, then still be allowed to play.
- Interested and curious entries should be tracked as app state:
  - `entryMode: "interested"`
  - `entryMode: "curious"`

## Landing Page Spec
Primary copy:

> Are you interested in [FirstName], the chap wearing this t-shirt?  
> Or just curious what the URL was about?

Primary actions:
- `I'm interested`
- `Just curious`

If the visitor chooses `I'm interested`:
- Start the compatibility adventure.
- Set `entryMode` to `"interested"`.

If the visitor chooses `Just curious`:
- Show an explanation screen with this copy:

> Fair. Very fair.  
> This is a tiny choose-your-own dating adventure printed on a t-shirt because apparently subtlety was unavailable.

- Include:
  - `Start the adventure`
  - `Back`
- `Start the adventure` continues into the CYOA with `entryMode` set to `"curious"`.

## Current Repo State
The repo has been scaffolded locally as a minimal React/Vite app.

Files currently present:
- `package.json`
- `index.html`
- `tsconfig.json`
- `vite.config.ts`
- `src/main.tsx`
- `src/styles.css`

The implemented local starter currently includes:
- A configurable first name constant, currently `Mike`.
- A mobile-first landing page.
- A curious explanation screen.
- A first CYOA compatibility question for opening date energy.
- A selectable result note after the visitor chooses a date energy.
- Hash-based navigation:
  - `#/`
  - `#/curious`
  - `#/adventure?mode=interested`
  - `#/adventure?mode=curious`

Important note: `npm install` was started locally but interrupted before completion, so an online Codex session should install dependencies fresh.

Update: the local build was continued after that interruption. Dependencies now install cleanly, `package-lock.json` exists, and `npm run build` passes.

## Suggested Next Prompt For Online Codex
Use this prompt to continue from a phone:

```text
Please continue building this CYODA React/Vite project. Read PROJECT_SUMMARY.md first. Run npm install, run the build, then continue expanding the CYOA story. Verify the mobile landing flow at 360px, 390px, and 430px widths. Keep the tone playful, respectful, and mobile-first.
```

## Next Implementation Steps
1. Run `npm install`.
2. Run `npm run build`.
3. Start the dev server with `npm run dev`.
4. Verify the landing page on mobile widths:
   - 360px
   - 390px
   - 430px
5. Confirm:
   - Both CTAs are visible and thumb-friendly.
   - `I'm interested` enters the adventure as `interested`.
   - `Just curious` opens the explanation screen.
   - `Start the adventure` enters as `curious`.
   - `Back` and browser navigation do not trap the visitor.
6. Add the next CYOA branch after the opening date energy question.

## Design Direction
The site should feel like a tiny story app discovered in the wild, not like a dating profile or marketing page.

Recommended visual direction:
- Mobile-first, full-screen composition.
- Large readable type.
- Two clear thumb-friendly buttons.
- Warm but not beige-only palette.
- A little theatrical charm.
- No dense forms on the first screen.
- No account creation.
- No pressure language.

## Future CYOA Ideas
Possible first compatibility branches:
- Ideal first date energy:
  - Quiet coffee and good conversation.
  - Something chaotic and memorable.
  - Food first, feelings later.
- Communication style:
  - Direct and sincere.
  - Banter-heavy.
  - Slow burn.
- Date outcome examples:
  - Coffee and chemistry.
  - Museum date with suspiciously strong opinions.
  - Picnic with excellent snacks.
  - Respectfully incompatible, but with style.

## Deployment Goal
Eventually deploy as a fast static site suitable for a t-shirt URL/QR code.

Good deployment options:
- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages
