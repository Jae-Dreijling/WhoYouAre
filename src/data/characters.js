// The character data model. Every field a persona can have — behavioral and
// visual — lives here, so a suggestion or a themed screen is just this data
// read back at the right moment (see PLAN.md).

export function makeId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function blankCharacter(overrides = {}) {
  return {
    id: makeId(),
    isProtected: false,
    identity: { name: '', tagline: '', bio: '', source: 'custom' },
    visual: {
      primaryColor: '#6C4CE0',
      accentColor: '#FF8A5C',
      profilePictureId: null, // Phase 2: IndexedDB reference
      widgetImageIds: [], // Phase 2: IndexedDB references
    },
    values: { mottos: [], selfTalk: '' },
    foodHealth: { favoriteSnack: '', eatingStyle: '', activityLevel: '' },
    hobbies: [],
    socialStyle: { treatOthers: '', tone: '', conflictStyle: '', groupStyle: '' },
    aesthetic: '',
    doDonts: { dos: [], donts: [] },
    ...overrides,
  };
}

// "You" — always exists, starts blank, gets filled in by the user (Phase 3).
export function createYouCharacter() {
  return blankCharacter({
    id: 'you',
    isProtected: true,
    identity: { name: 'You', tagline: 'Your own current self', bio: '', source: 'you' },
  });
}

function healthNutCharacter() {
  return blankCharacter({
    id: 'health-nut',
    identity: {
      name: 'Health Nut Almond Person',
      tagline: 'Clean eating, big energy',
      bio: 'Lives for a good workout and a handful of almonds. Balanced, active, and always up for a morning walk.',
      source: 'built-in',
    },
    visual: {
      primaryColor: '#3FA34D',
      accentColor: '#D9A56C',
      profilePictureId: null,
      widgetImageIds: [],
    },
    values: {
      mottos: ['Progress, not perfection.', 'Fuel your body right.', 'Small habits, big results.'],
      selfTalk: 'Takes a breath and reframes stress as a chance to reset.',
    },
    foodHealth: {
      favoriteSnack: 'A handful of raw almonds',
      eatingStyle: 'Whole foods, minimal sugar, drinks a lot of water',
      activityLevel: 'Very active — moves every day',
    },
    hobbies: ['Morning runs', 'Meal prepping', 'Yoga', 'Hiking'],
    socialStyle: {
      treatOthers: 'Encouraging, leads by example',
      tone: 'Warm and grounded',
      conflictStyle: 'Calm, direct, no drama',
      groupStyle: "Quietly motivating, checks in on people's wellbeing",
    },
    aesthetic: 'Athleisure, neutral tones, always has a water bottle nearby',
    doDonts: {
      dos: ['Always makes time to move', 'Preps snacks ahead of time'],
      donts: ['Never skips breakfast', "Doesn't do fad diets"],
    },
  });
}

function busyBeeCharacter() {
  return blankCharacter({
    id: 'busy-bee',
    identity: {
      name: 'Super Social Busy Bee',
      tagline: 'Always got plans',
      bio: 'Calendar always full, phone always buzzing. Thrives around people and never wants to miss a moment.',
      source: 'built-in',
    },
    visual: {
      primaryColor: '#F5B400',
      accentColor: '#FF4D8D',
      profilePictureId: null,
      widgetImageIds: [],
    },
    values: {
      mottos: ['Say yes to the plan.', 'People first.', "There's always time for one more coffee."],
      selfTalk: 'Talks it out loud with a friend before spiraling.',
    },
    foodHealth: {
      favoriteSnack: "Iced coffee and whatever's on the table",
      eatingStyle: 'Eats on the go, loves trying new spots with friends',
      activityLevel: "Busy, not gym-obsessed — energy comes from people",
    },
    hobbies: ['Group hangouts', 'Trying new restaurants', 'Planning events', 'Dancing'],
    socialStyle: {
      treatOthers: 'Warm, inclusive, remembers small details about people',
      tone: 'Upbeat and expressive',
      conflictStyle: "Talks it out immediately, hates letting things fester",
      groupStyle: 'The connector — introduces people, keeps the group chat alive',
    },
    aesthetic: 'Bold colors, statement accessories, always camera-ready',
    doDonts: {
      dos: ['Always replies to texts fast', 'Makes new people feel welcome'],
      donts: ['Never cancels plans last minute', "Doesn't let a friend eat alone"],
    },
  });
}

export function createStarterCharacters() {
  return [createYouCharacter(), healthNutCharacter(), busyBeeCharacter()];
}

export function createBlankCustomCharacter() {
  return blankCharacter();
}
