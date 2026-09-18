# WhoYouAre — Product Plan

## Elevator pitch
A mood-driven personality guide. When you feel like "being" a certain kind of person today — the disciplined athlete, the chill nerd, the confident extrovert — you pick that character as your **Current Persona**, and the app gives you real, actionable guidance for living like them: what to eat, what to do with your free time, how to talk to people, how to carry yourself. It's not roleplay chat with a character — it's a guide *to* roleplaying *as* one, in real life.

## The insight / problem
People already do this informally ("what would my confident self do here?", "channeling my inner disciplined self today"). There's no tool that turns a character/archetype into a concrete, structured set of daily behaviors. Habit apps are behavior-first with no identity hook; roleplay/chat apps are conversation-first with no real-world action. This sits in between: **identity-first, action-oriented**.

## Core loop
1. User browses/searches characters (pre-built archetypes or custom-made).
2. User taps one to set it as their **Current Persona** — stays active until manually changed (no time-boxing in v1, see Open Questions).
3. Throughout the day, the app surfaces persona-flavored suggestions contextually (morning, meals, downtime, social situations).
4. User can open the persona's profile any time for a fuller reference (values, habits, likes, how they'd handle things).
5. Optional: light logging/reflection ("How'd it feel being Marcus today?") to build a sense of progress over time.

## Character profile — data model
Each character/persona is defined by structured fields so suggestions can be generated consistently:

- **Identity**: name, archetype/tagline (e.g. "The Disciplined Athlete"), short bio, source (built-in, custom, or "you")
- **Visual identity**:
  - Profile picture — one, the character's main portrait (avatar, switcher, profile header)
  - Color scheme — primary + accent color, drives the whole app's look while this persona is active
  - Widget image gallery — an open-ended pool of images the user can add to; the app pulls from this pool as decorative art placed at the sides of / between sections on various pages (purely aesthetic, not tied to specific fields)
- **Values & mindset**: 3–5 core beliefs or mottos; how they self-talk under stress
- **Food & health**: favorite snack, general eating style, activity level
- **Hobbies & interests**: ranked list of things they'd do with free time
- **Social style**: how they treat others, communication tone, how they handle conflict, how they show up in groups
- **Aesthetic/style** (optional): how they dress, speak, or present themselves
- **Do's and don'ts**: quick-glance behavior guardrails ("would never skip a workout," "always checks in on friends")

This model is the backbone — every suggestion the app shows is just this data surfaced at the right moment, not generated from nothing. The visual identity fields are just as core as the behavioral ones: switching persona should feel like the whole app changed skin, not just the text on one screen.

### Starter characters (v1)
- **You** — the main character, fully customizable, meant to represent the user's own identity/name/picture/colors from the start. Behaves like a custom character for content purposes (see Suggestion engine below) since its fields start blank.
- **Health Nut Almond Person** — the "health nut" archetype (clean eating, almonds as the signature snack, active hobbies). Ships with hand-authored suggestion content.
- **Super Social Busy Bee** — the highly social, always-on-the-go archetype (packed calendar, people-first suggestions, high-energy tone). Ships with hand-authored suggestion content.

Users can create additional custom characters, and can edit or delete any character **except "You," which always exists** (it can be renamed/reset but not removed) — this guarantees there's always a valid Current Persona.

## Contextual suggestions
Same data, different moments in the app:

| Context | Surfaced from profile |
|---|---|
| Meal time / snack cravings | Food & health |
| "I'm bored" / free time | Hobbies & interests |
| Before a social event / messaging someone | Social style |
| Morning check-in | Values & mindset (motto for the day) |
| Stressful moment | Self-talk / mindset |
| Getting dressed | Aesthetic/style |

Suggestions should feel like *tips from the character*, not generic advice — tone and specificity matter more than novelty.

**Suggestion engine — hybrid approach**: every character (built-in or custom) gets a *templated* suggestion generated from whatever's in their structured fields (e.g. "Grab your [favorite snack]" / "You've got some free time — how about [top hobby]?"). This templated layer is the baseline and is what powers "You" and any user-created custom character. On top of that, the two fixed starter archetypes (Health Nut Almond Person, Super Social Busy Bee) get hand-authored blurbs that override the template where they exist, for richer, more personality-specific copy. Build the template engine first (Phase 4) since it's what makes every character work at all; layer hand-authored overrides in afterward.

## Key screens (draft)
1. **Home / Persona Switcher** — grid or list of characters, big "Current Persona" indicator, quick-switch.
2. **Persona Profile** — full reference sheet for a character (all fields above).
3. **Right Now** — a single contextual suggestion card based on time of day / user-tapped situation ("I'm eating," "I'm free," "I'm about to talk to someone").
4. **Library** — browse built-in archetypes, search/filter by trait or vibe.
5. **Create/Customize** — build your own character (manually, or from a favorite fictional character/real person as inspiration — careful with IP/likeness, see Open Questions).
6. **Journal (optional, later phase)** — lightweight log of which persona you wore each day and how it went.

## What this is NOT
- Not a chatbot you talk *to* as the character.
- Not a social/roleplay-with-others app.
- Not therapy or clinical identity work — frame as lighthearted self-improvement/lifestyle, not psychological treatment.

## Visual tone
**Playful / gamified**: bold, saturated per-character color schemes, big character art, energetic copy. Should feel like a lifestyle/habit game, not a clinical journal — this drives every visual decision starting in Phase 0 (spacing can be tighter/punchier, components can have more personality — shadows, rounded shapes, motion — than a minimal design would allow).

## Tech direction
**Web app first**: React + Vite, built to be installable as a PWA (home-screen icon, works offline-ish). No login/backend for the MVP — everything (characters, profile pictures, widget image gallery, current persona) persists on-device. Profile pictures and the widget image gallery are stored in **IndexedDB**, not localStorage — localStorage is string-only and capped around 5–10MB, which photos would blow through fast; IndexedDB handles binary blobs and much larger totals. Structured character data (text fields, color scheme) can live in localStorage or IndexedDB alongside it. A native wrapper (Capacitor) or React Native rebuild is a later option once the concept is proven, not a v1 concern.

**Data safety**: since everything lives only in the browser, clearing site data wipes all characters and uploaded images with no recovery. Add a simple **export/import** (download a JSON + image bundle, re-import it later or on another device) early — cheap to build, and it's the only backup path until accounts/sync exist.

## Build phases

### Phase 0 — Visual foundation
Nothing character-specific yet — just prove the app can reskin itself.
- Project scaffold (React + Vite), base routing, empty screen shells (Home, Profile, Library)
- Core design system: typography, spacing, shared components (cards, buttons, nav bar)
- Theming mechanism: CSS custom properties for primary/accent color, driven by whatever persona is "active," tested with placeholder colors
- Placeholder widget-image slot on Home to prove the layout can host small images

### Phase 1 — Character data + switching
- Character data model in code (identity, visual identity, values, food/health, hobbies, social style, do's/don'ts)
- Persistence layer: structured fields in localStorage, images in IndexedDB
- Seed the 3 starter characters: **You** (blank/customizable, undeletable), **Health Nut Almond Person**, **Super Social Busy Bee**
- Persona Switcher UI (pick your Current Persona) + Home page actually reskinning (color scheme + widget images) based on the active one
- Basic export/import (download/re-upload a JSON + image bundle) — cheap insurance before users start investing in photos/custom characters

### Phase 2 — Profile pictures & full profile view
- Full Persona Profile screen showing every field
- Profile picture upload (crop/resize) for "You" and any character
- Widget image gallery: upload/manage an open-ended pool of images per character, rendered as decorative art around pages

### Phase 3 — Create, edit, delete characters
- "Create Character" form: all profile fields + picture + color scheme + widget image gallery
- Edit any existing character (including the 2 fixed starters; "You" is editable but undeletable)
- Delete character, guarded so "You" can never be removed and a Current Persona always exists

### Phase 4 — Contextual suggestions ("Right Now")
- Build the templated suggestion engine first: generates tips from any character's structured fields (this is what makes "You" and every custom character work)
- Right Now screen: tap a situation (eating, free time, about to socialize, stressed, getting dressed) → get a suggestion for the active persona
- Layer hand-authored blurbs on top for the 2 fixed starter archetypes, overriding the template where they exist

### Phase 5 — Polish & stretch goals
- Smooth transition/animation when switching persona (the reskin should feel satisfying, not jarring — fits the playful/gamified tone)
- Onboarding flow for first-time users (set up "You" first)
- Optional: journal/reflection log, streaks, local notifications/nudges, AI-generated suggestions for custom characters, time-boxed personas ("for today," "for the next hour")

Each phase should end with something visibly running and clickable — nothing stays "just data" for more than one phase.

## Monetization ideas (not decided)
- Free tier: built-in characters + basic suggestions
- Paid: premium character packs, custom character creation, AI-personalized suggestions
- One-time purchase vs subscription — TBD

## Resolved decisions (from planning review)
- **Visual tone**: playful/gamified (see Visual tone section).
- **Widget images**: profile picture (one) + an open-ended widget image gallery used as decorative art, not tied to specific fields.
- **Suggestion engine**: hybrid — templated from structured fields as the baseline (works for "You" and custom characters), hand-authored overrides for the 2 fixed starter archetypes.
- **Time-boxed persona**: deferred out of MVP, moved to Phase 5 stretch goals.
- **Image persistence**: IndexedDB, not localStorage (size/binary limits).
- **"You" character**: undeletable, guarantees a valid Current Persona always exists.

## Open questions
- **Custom characters based on real/fictional people**: how to handle likeness/IP — likely safest to encourage "inspired by" archetypes rather than exact copyrighted characters.
- **Notifications**: opt-in nudges could be a big engagement driver but need to avoid feeling gimmicky or spammy — revisit once Phase 5 is in scope.
- **Widget image placement rules**: the gallery is open-ended, but where exactly do images get pulled from it and how often do they rotate (random per visit? fixed per page?) — worth a quick decision during Phase 0/2 build, not blocking now.
