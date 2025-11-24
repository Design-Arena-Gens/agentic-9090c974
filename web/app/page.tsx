
'use client';

import { useMemo, useState } from "react";

type EnergyLevel = "low" | "medium" | "high";

type Rhythm = {
  name: string;
  signature: string;
  feel: string;
  description: string;
  defaultTempo: [number, number];
};

type Instrument = {
  name: string;
  role: string;
  tier: "core" | "color" | "accent";
  color: string;
};

type Scale = {
  name: string;
  mood: string;
  cadences: string[];
  ornamentation: string;
  primaryNotes: string[];
};

type SectionBlueprint = {
  id: string;
  name: string;
  energy: EnergyLevel;
  defaultLength: number;
  anchor: string;
  spotlights: string[];
  comment: string;
};

type SectionPlan = {
  id: string;
  name: string;
  energy: EnergyLevel;
  length: number;
  approximateSeconds: number;
  instrumentation: string[];
  spotlight: string;
  texture: string;
  comment: string;
  anchor: string;
};

type FocusProfile = {
  name: string;
  description: string;
  energyTilt: EnergyLevel;
};

type ArrangementPlan = {
  rhythm: Rhythm;
  scale: Scale;
  focus: FocusProfile;
  sections: SectionPlan[];
  harmonicIdeas: string[];
  ornaments: string[];
  transitions: string[];
  mix: string[];
  dynamics: string[];
};

const tempoRange = { min: 72, max: 118 };

const kabyleRhythms: Rhythm[] = [
  {
    name: "Ameziane 6/8",
    signature: "6/8",
    feel: "Bal swing lumineux",
    description:
      "Pulse en 3+3, idéal pour les mélodies aériennes et les couplets narratifs.",
    defaultTempo: [84, 102],
  },
  {
    name: "Assirem 4/4",
    signature: "4/4",
    feel: "Pulsation droite",
    description:
      "Ancre contemporaine qui accepte des guitares modernes et un bendir appuyé.",
    defaultTempo: [92, 110],
  },
  {
    name: "Tamurt 12/8",
    signature: "12/8",
    feel: "Ternaire ample",
    description:
      "Atmosphère cérémonielle, parfaite pour des refrains majestueux et des voix en choeur.",
    defaultTempo: [76, 94],
  },
];

const kabyleScales: Scale[] = [
  {
    name: "Mode Hijaz sur Ré",
    mood: "Intense et mystique",
    cadences: [
      "Dm - C - Dsus4 - D",
      "Dm - C - Bb - C",
      "Dm(9) - Gm - Bb - C",
    ],
    ornamentation:
      "Accentuer le demi-ton sensible (C#) avec des glissandi tenus par la mandole ou l'imzad.",
    primaryNotes: ["Ré", "Fa", "Fa#", "La", "Do"],
  },
  {
    name: "Mode Aâssif sur Mi",
    mood: "Clair et rêveur",
    cadences: [
      "Em - D - C - D",
      "Em(9) - Cadd9 - D - Em",
      "Em - G - D - C",
    ],
    ornamentation:
      "Jouer sur les secondes majeures (F#) et les retards vocaux pour laisser respirer le texte.",
    primaryNotes: ["Mi", "Sol", "La", "Si", "Ré"],
  },
  {
    name: "Mode Zenati sur Do",
    mood: "Épique et contemplatif",
    cadences: [
      "C - Bb - Ab - G",
      "Cm - Bb - Ab - G",
      "C(add9) - F - Em - G",
    ],
    ornamentation:
      "Doubler la tonique et la quinte en drone pour construire un tapis harmonique ample.",
    primaryNotes: ["Do", "Mi", "Fa#", "Sol", "Bb"],
  },
];

const kabyleMoods = [
  {
    label: "Lumière nostalgique",
    description:
      "Mélancolie lumineuse qui évoque la montagne après la pluie.",
  },
  {
    label: "Fête villageoise",
    description:
      "Énergie collective, refrains participatifs et pulsation ancrée.",
  },
  {
    label: "Veillée intime",
    description:
      "Ambiance feu de camp, voix proche et arrangement minimaliste.",
  },
];

const focusProfiles: FocusProfile[] = [
  {
    name: "Voix narrative",
    description:
      "Mettre le texte au centre avec des réponses instrumentales légères et progressives.",
    energyTilt: "medium",
  },
  {
    name: "Danse collective",
    description:
      "Préparer des appels/réponses et accentuer les appuis de bendir pour entraîner la foule.",
    energyTilt: "high",
  },
  {
    name: "Contemplation rêveuse",
    description:
      "Créer des nappes flottantes, utiliser l'imzad et la flûte pour souligner les images du texte.",
    energyTilt: "low",
  },
];

const kabyleInstruments: Instrument[] = [
  {
    name: "Mandole kabyle",
    role: "Arpèges métalliques et base harmonique traditionnelle",
    tier: "core",
    color: "border-amber-200 bg-amber-100 text-amber-900",
  },
  {
    name: "Guitare folk",
    role: "Strumming chaud et soutien harmonique moderne",
    tier: "core",
    color: "border-stone-300 bg-stone-100 text-stone-900",
  },
  {
    name: "Bendir",
    role: "Pulsation principale et appuis sur le 1/4",
    tier: "core",
    color: "border-orange-300 bg-orange-100 text-orange-900",
  },
  {
    name: "Chœurs féminins",
    role: "Réponses collectives et enveloppe émotionnelle",
    tier: "core",
    color: "border-emerald-300 bg-emerald-100 text-emerald-900",
  },
  {
    name: "T'bol (grand tambour)",
    role: "Renfort basse et montée finale",
    tier: "color",
    color: "border-red-300 bg-red-100 text-red-900",
  },
  {
    name: "Imzad",
    role: "Lignes mélodiques longues et vibrato expressif",
    tier: "color",
    color: "border-rose-300 bg-rose-100 text-rose-900",
  },
  {
    name: "Flûte gasba",
    role: "Ornementation aérienne et contre-chants",
    tier: "color",
    color: "border-sky-300 bg-sky-100 text-sky-900",
  },
  {
    name: "Synthé ambient",
    role: "Coussins harmoniques modernes et espace granulaire",
    tier: "accent",
    color: "border-purple-300 bg-purple-100 text-purple-900",
  },
  {
    name: "Guitare électrique douce",
    role: "Delay subtil et lignes contemporaines",
    tier: "accent",
    color: "border-indigo-300 bg-indigo-100 text-indigo-900",
  },
];

const baseSections: SectionBlueprint[] = [
  {
    id: "intro",
    name: "Azul (Intro)",
    energy: "low",
    defaultLength: 16,
    anchor: "Installer le mode et le rythme sans percussion forte",
    spotlights: [
      "Mandole en arpèges ouverts",
      "Drone de synthé ambient discret",
      "Flûte gasba sur notes tenues",
    ],
    comment:
      "Laisser respirer les premières mesures et annoncer le thème principal par une variation libre.",
  },
  {
    id: "verse1",
    name: "Avernas (Couplet 1)",
    energy: "medium",
    defaultLength: 32,
    anchor: "Mettre le texte au premier plan avec un groove léger",
    spotlights: [
      "Voix lead proche et dynamique",
      "Mandole en picking syncopé",
      "Bendir en balancement doux",
    ],
    comment:
      "Introduire progressivement la pulsation, en soulignant la fin de chaque phrase.",
  },
  {
    id: "refrain",
    name: "Anefrah (Refrain)",
    energy: "high",
    defaultLength: 24,
    anchor: "Créer un moment fédérateur et ouvert",
    spotlights: [
      "Chœurs féminins en réponse",
      "T'bol pour accentuer les appuis forts",
      "Guitare électrique en doublage mélodique",
    ],
    comment:
      "Élargir le spectre sonore et soutenir la voix avec des tenues longues.",
  },
  {
    id: "bridge",
    name: "Asirem (Pont)",
    energy: "medium",
    defaultLength: 20,
    anchor: "Suspendre le temps avant la relance finale",
    spotlights: [
      "Imzad en glissandi",
      "Bendir sur les contretemps",
      "Voix parlée ou chuchotée",
    ],
    comment:
      "Proposer une variation harmonique ou un jeu de textures pour surprendre l'auditeur.",
  },
  {
    id: "finale",
    name: "Takfarinas (Finale)",
    energy: "high",
    defaultLength: 28,
    anchor: "Clore dans l'énergie du cercle de danse",
    spotlights: [
      "Chœurs et lead en unisson",
      "T'bol et bendir en renfort collectif",
      "Mandole en frappes staccato",
    ],
    comment:
      "Amplifier les appuis finaux puis laisser s'éteindre sur une coda instrumentale courte.",
  },
];

const vocalTextures = [
  "Lead ample doublée à l'octave inférieure sur les cadences",
  "Voix veloutée posée sur un bourdon continu",
  "Call & response lead / chœurs sur les deux dernières mesures",
  "Sifflement ou souffle rythmique avant chaque reprise de refrain",
];

const dynamicContours = [
  "Commencer mezzo-piano puis ouvrir en forté lumineux au refrain",
  "Introduire un break à vide juste avant chaque relance",
  "Accentuer les temps faibles avec des crescendi de bendir",
  "Faire respirer la fin du pont avec un decrescendo progressif",
];

const transitionIdeas = [
  "Glissando d'imzad vers la dominante",
  "Rappel du motif de flûte avec delay inversé",
  "Break de bendir sur deux mesures suivi d'un retour collectif",
  "Modulation passagère de la basse sur la quarte avant le refrain",
];

const mixTouches = [
  "Panoramiser légèrement le bendir pour dynamiser le groove",
  "Utiliser un slap-back court sur la voix lead pour conserver l'intimité",
  "Empiler la mandole avec une piste DI saturée discrète",
  "Appliquer une reverb à plaque sur les chœurs pour ouvrir l'espace",
];

const ornamentIdeas = [
  "Mordants rapides sur la fin des phrases vocales.",
  "Portamento montant de la flûte pour annoncer les refrains.",
  "Bourdon en quinte tenu sous la voix principale.",
  "Attaques simultanées bendir / t'bol sur la mesure 4.",
  "Notes mortes de mandole pour texturer les couplets.",
  "Trémolo d'imzad sur les tenues finales.",
];

const energyInstrumentHints: Record<EnergyLevel, string[]> = {
  low: ["Mandole kabyle", "Guitare folk", "Flûte gasba"],
  medium: ["Mandole kabyle", "Bendir", "Chœurs féminins"],
  high: ["Bendir", "T'bol (grand tambour)", "Chœurs féminins"],
};

const instrumentMap = new Map<string, Instrument>(
  kabyleInstruments.map((instrument) => [instrument.name, instrument]),
);

const defaultInstrumentSelection = kabyleInstruments
  .filter((instrument) => instrument.tier === "core")
  .map((instrument) => instrument.name);

function createSeededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i += 1) {
    const code = seed.charCodeAt(i);
    h = Math.imul(h ^ code, 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
  };
}

function pickList<T>(items: readonly T[], count: number, random: () => number) {
  if (items.length <= count) {
    return [...items];
  }
  const pool = [...items];
  const selection: T[] = [];
  while (selection.length < count && pool.length > 0) {
    const index = Math.floor(random() * pool.length);
    selection.push(pool.splice(index, 1)[0] as T);
  }
  return selection;
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values));
}

export default function Home() {
  const [songTitle, setSongTitle] = useState("Thilleli n Waman");
  const [artistName, setArtistName] = useState("Auteur·rice kabyle");
  const [tempo, setTempo] = useState(96);
  const [mood, setMood] = useState(kabyleMoods[0]?.label ?? "");
  const [scale, setScale] = useState(kabyleScales[0]?.name ?? "");
  const [rhythm, setRhythm] = useState(kabyleRhythms[0]?.name ?? "");
  const [focus, setFocus] = useState(focusProfiles[0]?.name ?? "");
  const [lyrics, setLyrics] = useState("");
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>(
    defaultInstrumentSelection,
  );

  const moodLookup = useMemo(
    () => new Map(kabyleMoods.map((entry) => [entry.label, entry] as const)),
    [],
  );
  const focusLookup = useMemo(
    () => new Map(focusProfiles.map((entry) => [entry.name, entry] as const)),
    [],
  );

  const arrangement = useMemo<ArrangementPlan>(() => {
    const seed = [
      songTitle.trim().toLowerCase(),
      artistName.trim().toLowerCase(),
      tempo,
      mood,
      scale,
      rhythm,
      focus,
      lyrics.trim().toLowerCase(),
      selectedInstruments.join("-"),
    ].join("|");

    const random = createSeededRandom(seed);
    const selectedRhythm =
      kabyleRhythms.find((item) => item.name === rhythm) ?? kabyleRhythms[0];
    const scaleInfo = kabyleScales.find((item) => item.name === scale) ?? kabyleScales[0];
    const focusInfo = focusLookup.get(focus) ?? focusProfiles[0];

    const colorTier = kabyleInstruments
      .filter((instrument) => instrument.tier === "color")
      .map((instrument) => instrument.name);
    const accentTier = kabyleInstruments
      .filter((instrument) => instrument.tier === "accent")
      .map((instrument) => instrument.name);

    const sections: SectionPlan[] = baseSections.map((section) => {
      const extras =
        section.energy === "high"
          ? pickList(colorTier, 2, random)
          : pickList(colorTier, 1, random);
      const accent = random() > 0.55 ? pickList(accentTier, 1, random) : [];

      const instrumentation = uniqueStrings([
        ...selectedInstruments,
        ...(energyInstrumentHints[section.energy] ?? []),
        ...extras,
        ...accent,
      ]).slice(0, 8);

      const texture = pickList(vocalTextures, 1, random)[0] ?? vocalTextures[0];
      const spotlight = pickList(section.spotlights, 1, random)[0] ?? section.spotlights[0];
      const length = Math.max(8, Math.round(section.defaultLength * (0.9 + random() * 0.25)));
      const approximateSeconds = Math.max(
        15,
        Math.round((length * 60) / Math.max(tempo, 40)),
      );

      return {
        id: section.id,
        name: section.name,
        energy: section.energy,
        length,
        approximateSeconds,
        instrumentation,
        spotlight,
        texture,
        comment: section.comment,
        anchor: section.anchor,
      };
    });

    const harmonicIdeas = pickList(scaleInfo.cadences, 3, random).map((cadence) => {
      const articulation =
        random() > 0.5 ? "laisser la basse en drone" : "orchestrer en arpèges brisés";
      return `${cadence} • ${articulation}`;
    });

    const ornamentExtras: string[] = [];
    if (selectedInstruments.includes("Imzad")) {
      ornamentExtras.push(
        "Glissandi d'imzad pour souligner les respirations du texte.",
      );
    }
    if (selectedInstruments.includes("Synthé ambient")) {
      ornamentExtras.push(
        "Pad granulaire accordé sur la quinte pour épaissir le pont.",
      );
    }

    const ornaments = uniqueStrings([
      ...ornamentExtras,
      ...pickList(ornamentIdeas, 4, random),
    ]);

    const transitions = pickList(transitionIdeas, 3, random);
    const mix = pickList(mixTouches, 3, random);
    const dynamics = pickList(dynamicContours, 3, random);

    return {
      rhythm: selectedRhythm,
      scale: scaleInfo,
      focus: focusInfo,
      sections,
      harmonicIdeas,
      ornaments,
      transitions,
      mix,
      dynamics,
    };
  }, [
    artistName,
    focus,
    focusLookup,
    lyrics,
    mood,
    rhythm,
    scale,
    selectedInstruments,
    songTitle,
    tempo,
  ]);

  const toggleInstrument = (name: string) => {
    setSelectedInstruments((prev) =>
      prev.includes(name)
        ? prev.filter((value) => value !== name)
        : [...prev, name],
    );
  };

  const moodInfo = moodLookup.get(mood);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-amber-900/90 to-slate-900 text-stone-100">
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-20 pt-16">
        <header className="rounded-3xl border border-white/10 bg-white/5 px-8 py-10 backdrop-blur-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="uppercase tracking-[0.3em] text-xs text-amber-300/80">
                Atelier d&apos;arrangements kabyles
              </p>
              <h1 className="text-4xl font-semibold tracking-tight">
                Modelez un arrangement enraciné et moderne
              </h1>
              <p className="text-base text-stone-200/80">
                Ajustez le rythme, la couleur modale et l&apos;orchestration. Les propositions se recalculent instantanément.
              </p>
            </div>
            <div className="rounded-2xl bg-amber-100/10 px-5 py-4 text-right text-sm text-amber-200/90">
              <p className="font-semibold">Identité préservée</p>
              <p className="text-amber-100/70">
                Instruments traditionnels, textures contemporaines, narration vivante.
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm lg:col-span-3">
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-xs uppercase tracking-[0.3em] text-stone-200/70">Titre</span>
                <input
                  value={songTitle}
                  onChange={(event) => setSongTitle(event.target.value)}
                  className="rounded-xl border border-white/10 bg-stone-900/40 px-4 py-3 text-base text-stone-100 outline-none transition focus:border-amber-200/60 focus:ring-2 focus:ring-amber-300/40"
                  placeholder="Titre de la chanson"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-xs uppercase tracking-[0.3em] text-stone-200/70">Auteur·rice / Collecte</span>
                <input
                  value={artistName}
                  onChange={(event) => setArtistName(event.target.value)}
                  className="rounded-xl border border-white/10 bg-stone-900/40 px-4 py-3 text-base text-stone-100 outline-none transition focus:border-amber-200/60 focus:ring-2 focus:ring-amber-300/40"
                  placeholder="Nom de l'interprète"
                />
              </label>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-xs uppercase tracking-[0.3em] text-stone-200/70">Ambiance</span>
                <select
                  value={mood}
                  onChange={(event) => setMood(event.target.value)}
                  className="rounded-xl border border-white/10 bg-stone-900/50 px-4 py-3 text-base text-stone-100 outline-none transition focus:border-amber-200/60 focus:ring-2 focus:ring-amber-300/40"
                >
                  {kabyleMoods.map((option) => (
                    <option key={option.label} value={option.label} className="bg-stone-900 text-stone-100">
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-xs uppercase tracking-[0.3em] text-stone-200/70">Focalisation</span>
                <select
                  value={focus}
                  onChange={(event) => setFocus(event.target.value)}
                  className="rounded-xl border border-white/10 bg-stone-900/50 px-4 py-3 text-base text-stone-100 outline-none transition focus:border-amber-200/60 focus:ring-2 focus:ring-amber-300/40"
                >
                  {focusProfiles.map((option) => (
                    <option key={option.name} value={option.name} className="bg-stone-900 text-stone-100">
                      {option.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-xs uppercase tracking-[0.3em] text-stone-200/70">Mode / Échelle</span>
                <select
                  value={scale}
                  onChange={(event) => setScale(event.target.value)}
                  className="rounded-xl border border-white/10 bg-stone-900/50 px-4 py-3 text-base text-stone-100 outline-none transition focus:border-amber-200/60 focus:ring-2 focus:ring-amber-300/40"
                >
                  {kabyleScales.map((option) => (
                    <option key={option.name} value={option.name} className="bg-stone-900 text-stone-100">
                      {option.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-stone-200/70">
                  <span>Tempo</span>
                  <span className="text-stone-100">{tempo} bpm</span>
                </div>
                <input
                  type="range"
                  min={tempoRange.min}
                  max={tempoRange.max}
                  value={tempo}
                  onChange={(event) => setTempo(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-stone-800 accent-amber-300"
                />
              </label>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-xs uppercase tracking-[0.3em] text-stone-200/70">Rythme principal</span>
                <select
                  value={rhythm}
                  onChange={(event) => setRhythm(event.target.value)}
                  className="rounded-xl border border-white/10 bg-stone-900/50 px-4 py-3 text-base text-stone-100 outline-none transition focus:border-amber-200/60 focus:ring-2 focus:ring-amber-300/40"
                >
                  {kabyleRhythms.map((option) => (
                    <option key={option.name} value={option.name} className="bg-stone-900 text-stone-100">
                      {option.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-xs uppercase tracking-[0.3em] text-stone-200/70">Mots-clés / Images</span>
                <input
                  value={lyrics}
                  onChange={(event) => setLyrics(event.target.value)}
                  placeholder="Images, thèmes, mots saillants…"
                  className="rounded-xl border border-white/10 bg-stone-900/40 px-4 py-3 text-base text-stone-100 outline-none transition focus:border-amber-200/60 focus:ring-2 focus:ring-amber-300/40"
                />
              </label>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-200/70">Palette instrumentale</p>
              <div className="flex flex-wrap gap-3">
                {kabyleInstruments.map((instrument) => {
                  const isActive = selectedInstruments.includes(instrument.name);
                  const baseClass = "rounded-2xl border px-4 py-2 text-sm transition";
                  return (
                    <button
                      key={instrument.name}
                      type="button"
                      onClick={() => toggleInstrument(instrument.name)}
                      className={
                        isActive
                          ? `${baseClass} ${instrument.color} shadow-[0_0_25px_rgba(255,224,178,0.18)]`
                          : `${baseClass} border-white/10 bg-stone-900/40 text-stone-200 hover:border-amber-200/40 hover:text-amber-100`
                      }
                      title={instrument.role}
                    >
                      {instrument.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">Ambiance sélectionnée</p>
              <h2 className="mt-2 text-xl font-semibold text-amber-100">{mood}</h2>
              <p className="mt-2 text-sm text-stone-200/80">{moodInfo?.description}</p>
              <div className="mt-4 rounded-2xl border border-amber-100/20 bg-amber-100/10 p-4 text-sm text-amber-100/80">
                <p className="font-semibold uppercase tracking-[0.2em] text-xs text-amber-200/70">Focus interprétatif</p>
                <p className="mt-1 font-medium text-amber-100">{arrangement.focus.name}</p>
                <p className="mt-2 text-amber-100/80">{arrangement.focus.description}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-200/70">Rythme structurant</p>
              <h3 className="mt-2 text-lg font-semibold text-stone-50">
                {arrangement.rhythm.name} • {arrangement.rhythm.signature}
              </h3>
              <p className="mt-2 text-sm text-stone-200/80">{arrangement.rhythm.description}</p>
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-stone-900/40 px-4 py-3 text-xs uppercase tracking-[0.3em] text-stone-200/70">
                <span>Plage conseillée</span>
                <span>
                  {arrangement.rhythm.defaultTempo[0]} – {arrangement.rhythm.defaultTempo[1]} bpm
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-200/70">Mode & texture</p>
              <h3 className="mt-2 text-lg font-semibold text-stone-50">{arrangement.scale.name}</h3>
              <p className="text-sm text-stone-200/80">{arrangement.scale.mood}</p>
              <div className="mt-4 space-y-3 text-sm text-stone-200/80">
                <div>
                  <p className="font-semibold text-stone-100/90">Notes pivots</p>
                  <p>{arrangement.scale.primaryNotes.join(' · ')}</p>
                </div>
                <div>
                  <p className="font-semibold text-stone-100/90">Ornementation</p>
                  <p>{arrangement.scale.ornamentation}</p>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 px-8 py-10 backdrop-blur-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">Architecture proposée</p>
              <h2 className="text-2xl font-semibold text-stone-50">
                Parcours dramaturgique de « {songTitle || 'votre chanson'} »
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-stone-100/70">
              <span className="rounded-full border border-white/20 bg-stone-900/40 px-3 py-1">
                Tempo actuel : {tempo} bpm
              </span>
              <span className="rounded-full border border-white/20 bg-stone-900/40 px-3 py-1">
                Instruments actifs : {selectedInstruments.length}
              </span>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {arrangement.sections.map((section) => (
              <article
                key={section.id}
                className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-stone-900/40 p-6"
              >
                <header className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-stone-200/70">{section.anchor}</p>
                    <h3 className="mt-2 text-lg font-semibold text-stone-50">{section.name}</h3>
                  </div>
                  <div className="flex flex-col items-end text-xs uppercase tracking-[0.3em] text-stone-200/70">
                    <span>{section.energy.toUpperCase()}</span>
                    <span>{section.length} mesures</span>
                    <span>≈ {section.approximateSeconds} s</span>
                  </div>
                </header>
                <div className="space-y-3 text-sm text-stone-200/80">
                  <p>
                    <span className="font-semibold text-stone-50">Point focal : </span>
                    {section.spotlight}
                  </p>
                  <p>
                    <span className="font-semibold text-stone-50">Texture vocale : </span>
                    {section.texture}
                  </p>
                  <p>{section.comment}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {section.instrumentation.map((name) => {
                    const instrument = instrumentMap.get(name);
                    const badgeColor = instrument?.color ?? "border-stone-400 bg-stone-200 text-stone-900";
                    return (
                      <span
                        key={`${section.id}-${name}`}
                        className={`rounded-full border px-3 py-1 text-xs font-medium text-stone-900 ${badgeColor}`}
                        title={instrument?.role}
                      >
                        {name}
                      </span>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-200/70">Progression harmonique</p>
            <ul className="mt-4 space-y-3 text-sm text-stone-200/80">
              {arrangement.harmonicIdeas.map((idea) => (
                <li
                  key={idea}
                  className="rounded-2xl border border-white/10 bg-stone-900/40 px-4 py-3"
                >
                  {idea}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-200/70">Dynamiques & transitions</p>
            <div className="mt-4 space-y-4 text-sm text-stone-200/80">
              <div>
                <p className="font-semibold text-stone-100/90">Gestuelle dynamique</p>
                <ul className="mt-2 space-y-2">
                  {arrangement.dynamics.map((dynamic) => (
                    <li
                      key={dynamic}
                      className="rounded-2xl border border-white/10 bg-stone-900/40 px-4 py-2"
                    >
                      {dynamic}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-stone-100/90">Ponts & transitions</p>
                <ul className="mt-2 space-y-2">
                  {arrangement.transitions.map((transition) => (
                    <li
                      key={transition}
                      className="rounded-2xl border border-white/10 bg-stone-900/40 px-4 py-2"
                    >
                      {transition}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-200/70">Ornements & mixage</p>
            <div className="mt-4 space-y-4 text-sm text-stone-200/80">
              <div>
                <p className="font-semibold text-stone-100/90">Idées d&apos;ornementation</p>
                <ul className="mt-2 space-y-2">
                  {arrangement.ornaments.map((ornament) => (
                    <li
                      key={ornament}
                      className="rounded-2xl border border-white/10 bg-stone-900/40 px-4 py-2"
                    >
                      {ornament}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-stone-100/90">Touches de mixage</p>
                <ul className="mt-2 space-y-2">
                  {arrangement.mix.map((tip) => (
                    <li
                      key={tip}
                      className="rounded-2xl border border-white/10 bg-stone-900/40 px-4 py-2"
                    >
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
