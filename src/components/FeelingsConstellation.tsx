import { useEffect, useMemo, useRef, useState } from "react";

type SubNode = {
  id: string;
  label: string;
  body: string[];
  thoughts: string[];
  needs: string[];
  blurb: string;
};

type PrimaryNode = {
  id: string;
  label: string;
  blurb: string;
  body: string[];
  thoughts: string[];
  needs: string[];
  subs: SubNode[];
};

const PRIMARIES: PrimaryNode[] = [
  {
    id: "overstimulated",
    label: "Overstimulated",
    blurb:
      "Your system is taking in more than it can comfortably process right now. This is a signal, not a failure.",
    body: ["Tight chest or jaw", "Buzzing skin", "Ringing ears", "Shallow breath"],
    thoughts: ["“I need everyone to stop.”", "“It’s all too loud.”", "“I can’t think.”"],
    needs: ["Lower light or sound", "A quiet room for 10 minutes", "Heavy blanket or pressure"],
    subs: [
      { id: "buzzing", label: "Buzzing", blurb: "A vibrating, restless energy under the skin.",
        body: ["Skin tingles", "Foot tapping", "Inner trembling"],
        thoughts: ["“I can’t sit still.”", "“Get it out of me.”"],
        needs: ["Slow exhale", "Gentle movement", "Cool water"] },
      { id: "trapped", label: "Trapped", blurb: "Like the room got smaller and the exits disappeared.",
        body: ["Held breath", "Clenched hands", "Heat in the chest"],
        thoughts: ["“I have to leave.”", "“I’m stuck.”"],
        needs: ["Permission to step away", "Open window", "A clear next step"] },
      { id: "flooded", label: "Flooded", blurb: "Too much input arriving all at once.",
        body: ["Tears rising", "Overwhelmed gaze", "Hands over ears"],
        thoughts: ["“I can’t hold this.”", "“Everything is happening.”"],
        needs: ["A pause", "Dim light", "One thing at a time"] },
      { id: "irritable", label: "Irritable", blurb: "Sensory edges sharpened by depleted capacity.",
        body: ["Tense shoulders", "Snappy voice", "Gritted teeth"],
        thoughts: ["“Why is everyone like this?”", "“Don’t touch me.”"],
        needs: ["Space alone", "Food and water", "Soft texture"] },
      { id: "sensory", label: "Sensory overload", blurb: "Lights, sounds, textures stacking past your threshold.",
        body: ["Visual blur", "Sound feels sharp", "Skin feels raw"],
        thoughts: ["“Make it stop.”", "“I can’t process this.”"],
        needs: ["Headphones or earplugs", "Sunglasses", "A dark, quiet corner"] },
    ],
  },
  {
    id: "understimulated",
    label: "Understimulated",
    blurb: "Your system is searching for input. Restlessness here is information, not laziness.",
    body: ["Heavy limbs", "Foggy head", "Hungry-but-not-for-food feeling"],
    thoughts: ["“Nothing feels good.”", "“I need something but I don’t know what.”"],
    needs: ["Music with a beat", "A walk outside", "Texture, taste, novelty"],
    subs: [
      { id: "restless", label: "Restless", blurb: "An itch for movement or change.",
        body: ["Bouncing leg", "Shifting in seat"], thoughts: ["“I have to do something.”"],
        needs: ["Stand up and stretch", "Step outside"] },
      { id: "bored", label: "Bored", blurb: "Not lazy — under-fed by your environment.",
        body: ["Slumped posture", "Glazed eyes"], thoughts: ["“This is unbearable.”"],
        needs: ["A small novel task", "Sensory variety"] },
      { id: "flat", label: "Flat", blurb: "The colour has drained out of things.",
        body: ["Slow movement", "Quiet voice"], thoughts: ["“Nothing matters much.”"],
        needs: ["Sunlight", "A warm drink", "Gentle company"] },
      { id: "seeking", label: "Seeking", blurb: "Reaching for input that turns the lights back on.",
        body: ["Scrolling", "Snacking", "Channel-flipping"], thoughts: ["“Where is the spark?”"],
        needs: ["Intentional input: music, movement, texture"] },
    ],
  },
  {
    id: "shutdown",
    label: "Shutdown",
    blurb: "Your nervous system has pulled the shutters down to protect you. This is a freeze response, not weakness.",
    body: ["Cold hands", "Heavy body", "Slow blinking"],
    thoughts: ["“I can’t talk.”", "“Please don’t ask anything of me.”"],
    needs: ["No demands", "Warmth", "Quiet presence, no questions"],
    subs: [
      { id: "frozen", label: "Frozen", blurb: "Body and words stop arriving.",
        body: ["Stillness", "Blank face"], thoughts: ["“I’m not here.”"],
        needs: ["Time", "A blanket", "Soft lighting"] },
      { id: "mute", label: "Nonverbal", blurb: "Words are temporarily out of reach. They will come back.",
        body: ["Tight throat"], thoughts: ["“I can’t find words.”"],
        needs: ["Texting instead of talking", "Yes/no questions only"] },
      { id: "numb", label: "Numb", blurb: "Feeling has been turned down to a whisper.",
        body: ["Distant from body"], thoughts: ["“I don’t feel anything.”"],
        needs: ["Warm water on hands", "A grounding object"] },
      { id: "withdrawn", label: "Withdrawn", blurb: "A pull inward, away from people and tasks.",
        body: ["Curling up", "Avoiding eyes"], thoughts: ["“Leave me be.”"],
        needs: ["Permission to disappear for a while"] },
    ],
  },
  {
    id: "masking",
    label: "Masking",
    blurb: "You are performing a version of yourself that feels safer to others. It costs energy to keep up.",
    body: ["Tense smile", "Held shoulders", "Careful voice"],
    thoughts: ["“Am I doing this right?”", "“Don’t let them see.”"],
    needs: ["A space where you don’t have to perform", "Solo recovery time"],
    subs: [
      { id: "hyperaware", label: "Hyperaware", blurb: "Tracking every face, tone, and pause around you.",
        body: ["Darting eyes", "Held breath"], thoughts: ["“What did that look mean?”"],
        needs: ["Lower social load", "A trusted person"] },
      { id: "scripting", label: "Scripting", blurb: "Rehearsing words before they leave your mouth.",
        body: ["Internal rehearsal"], thoughts: ["“Say it the right way.”"],
        needs: ["Spaces where unscripted is safe"] },
      { id: "people", label: "People pleasing", blurb: "Shaping yourself around what you sense others want.",
        body: ["Forced smile", "Yes before you mean it"], thoughts: ["“Don’t disappoint them.”"],
        needs: ["Practice with small no’s", "Recovery time"] },
      { id: "hangover", label: "Social hangover", blurb: "The cost of masking, arriving after the fact.",
        body: ["Exhaustion", "Sound sensitivity"], thoughts: ["“I need a day to recover.”"],
        needs: ["Solitude", "Low light", "No plans"] },
      { id: "disconnected", label: "Disconnected from self", blurb: "You can’t quite find where you end and the performance begins.",
        body: ["Foggy sense of self"], thoughts: ["“I don’t know what I actually feel.”"],
        needs: ["Quiet, unstructured time", "Journaling, art, movement"] },
    ],
  },
  {
    id: "burnedout",
    label: "Burned Out",
    blurb: "You’ve been running on reserves for too long. This is a deep recovery state, not a bad mood.",
    body: ["Heavy fatigue", "Reduced tolerance", "Sleep that doesn’t restore"],
    thoughts: ["“I can’t do this anymore.”", "“Everything is too much.”"],
    needs: ["Real rest", "Reduced demands", "Compassion, not productivity"],
    subs: [
      { id: "depleted", label: "Depleted", blurb: "The tank is empty. Forcing it makes it worse.",
        body: ["Aching body", "Low appetite"], thoughts: ["“I have nothing left.”"],
        needs: ["Permission to do less", "Nourishing food"] },
      { id: "regression", label: "Skill regression", blurb: "Things you usually do easily feel impossible.",
        body: ["Fumbled words"], thoughts: ["“Why can’t I do this anymore?”"],
        needs: ["Fewer expectations", "Smaller steps"] },
      { id: "loss", label: "Loss of joy", blurb: "Special interests and comforts feel grey.",
        body: ["Heaviness in chest"], thoughts: ["“Even the things I love feel hard.”"],
        needs: ["No pressure to feel better quickly"] },
      { id: "irritable2", label: "Easily overwhelmed", blurb: "Your threshold for input has dropped close to the floor.",
        body: ["Quick tears", "Quick anger"], thoughts: ["“Anything tips me over.”"],
        needs: ["A slow, low-stimulation week", "Boundaries from others"] },
    ],
  },
];

const CENTER = { id: "center", label: "Something feels off" };

// Polar layout for primary nodes around center
const PRIMARY_RADIUS = 36; // % of container
const SUB_RADIUS = 24; // around primary

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

export default function FeelingsConstellation() {
  const [activePrimary, setActivePrimary] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ kind: "center" | "primary" | "sub"; id: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Positions for primaries
  const primaryPositions = useMemo(() => {
    const map: Record<string, { x: number; y: number; angle: number }> = {};
    const n = PRIMARIES.length;
    PRIMARIES.forEach((p, i) => {
      const angle = -90 + (360 / n) * i; // start at top
      const { x, y } = polar(50, 50, PRIMARY_RADIUS, angle);
      map[p.id] = { x, y, angle };
    });
    return map;
  }, []);

  const subPositions = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {};
    PRIMARIES.forEach((p) => {
      const base = primaryPositions[p.id];
      const n = p.subs.length;
      // fan outward from center direction
      const baseAngle = base.angle;
      const spread = 70; // degrees
      p.subs.forEach((s, i) => {
        const t = n === 1 ? 0 : i / (n - 1) - 0.5;
        const a = baseAngle + t * spread;
        const { x, y } = polar(base.x, base.y, SUB_RADIUS, a);
        map[s.id] = { x, y };
      });
    });
    return map;
  }, [primaryPositions]);

  const detailContent = useMemo(() => {
    if (!selected) return null;
    if (selected.kind === "center") {
      return {
        label: CENTER.label,
        blurb:
          "Welcome. There’s no rush to name it perfectly. Pick whichever node feels closest, and you can change your mind anytime.",
        body: ["Notice your breath. Just notice — no need to change it."],
        thoughts: ["“I’m allowed to take a moment to check in.”"],
        needs: ["Curiosity, not judgment", "A slow exhale"],
      };
    }
    if (selected.kind === "primary") {
      const p = PRIMARIES.find((x) => x.id === selected.id)!;
      return { label: p.label, blurb: p.blurb, body: p.body, thoughts: p.thoughts, needs: p.needs };
    }
    for (const p of PRIMARIES) {
      const s = p.subs.find((x) => x.id === selected.id);
      if (s) return { label: s.label, blurb: s.blurb, body: s.body, thoughts: s.thoughts, needs: s.needs };
    }
    return null;
  }, [selected]);

  const handlePrimaryClick = (id: string) => {
    setActivePrimary((curr) => (curr === id ? null : id));
    setSelected({ kind: "primary", id });
  };

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <header className="px-6 pt-8 pb-2 max-w-7xl mx-auto">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">A gentle check-in</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-medium text-foreground/90 leading-snug">
            Neurodivergent Feelings Constellation
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
            Take your time. Tap whatever feels closest — nothing here is a test.
          </p>
        </div>
      </header>

      {/* Constellation */}
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-7xl aspect-[4/3] sm:aspect-[16/9] mt-2"
      >
        {/* SVG lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Lines from center to each primary */}
          {PRIMARIES.map((p) => {
            const pos = primaryPositions[p.id];
            return (
              <line
                key={`c-${p.id}`}
                className="nd-line"
                x1={50}
                y1={50}
                x2={pos.x}
                y2={pos.y}
                style={{
                  opacity: activePrimary && activePrimary !== p.id ? 0.2 : undefined,
                  animationDelay: `${0.1}s`,
                }}
              />
            );
          })}
          {/* Lines from active primary to its subs */}
          {activePrimary &&
            PRIMARIES.find((p) => p.id === activePrimary)!.subs.map((s, i) => {
              const from = primaryPositions[activePrimary];
              const to = subPositions[s.id];
              return (
                <line
                  key={`s-${s.id}`}
                  className="nd-line"
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  style={{ animationDelay: `${0.05 * i}s` }}
                />
              );
            })}
        </svg>

        {/* Center node */}
        <NodeButton
          x={50}
          y={50}
          size="center"
          floating
          onClick={() => setSelected({ kind: "center", id: "center" })}
          active={selected?.kind === "center"}
        >
          <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Begin here</span>
          <span className="mt-1 block text-base sm:text-lg font-medium text-foreground/85">
            {CENTER.label}
          </span>
        </NodeButton>

        {/* Primary nodes */}
        {PRIMARIES.map((p, i) => {
          const pos = primaryPositions[p.id];
          const dim = activePrimary && activePrimary !== p.id;
          return (
            <NodeButton
              key={p.id}
              x={pos.x}
              y={pos.y}
              size="primary"
              floating
              floatDelay={i * 0.6}
              onClick={() => handlePrimaryClick(p.id)}
              active={activePrimary === p.id}
              dim={!!dim}
            >
              <span className="text-sm sm:text-base font-medium text-foreground/85">{p.label}</span>
            </NodeButton>
          );
        })}

        {/* Sub nodes */}
        {activePrimary &&
          PRIMARIES.find((p) => p.id === activePrimary)!.subs.map((s, i) => {
            const pos = subPositions[s.id];
            return (
              <NodeButton
                key={s.id}
                x={pos.x}
                y={pos.y}
                size="sub"
                onClick={() => setSelected({ kind: "sub", id: s.id })}
                active={selected?.id === s.id}
                delay={i * 0.08}
              >
                <span className="text-xs sm:text-sm text-foreground/75">{s.label}</span>
              </NodeButton>
            );
          })}
      </div>

      {/* Detail panel */}
      <DetailPanel
        open={!!detailContent}
        onClose={() => setSelected(null)}
        content={detailContent}
      />

      <footer className="text-center text-xs text-muted-foreground py-10 px-6">
        This is a gentle reflection tool, not a diagnosis. Be kind to yourself.
      </footer>
    </div>
  );
}

function NodeButton({
  x,
  y,
  size,
  children,
  onClick,
  active,
  dim,
  floating,
  floatDelay = 0,
  delay = 0,
}: {
  x: number;
  y: number;
  size: "center" | "primary" | "sub";
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  dim?: boolean;
  floating?: boolean;
  floatDelay?: number;
  delay?: number;
}) {
  const sizeClass =
    size === "center"
      ? "nd-node-center px-7 py-5 sm:px-9 sm:py-6 min-w-[180px] sm:min-w-[220px]"
      : size === "primary"
      ? "nd-node-primary px-5 py-4 sm:px-6 sm:py-4 min-w-[140px] sm:min-w-[160px]"
      : "nd-node-secondary px-3.5 py-2 min-w-[96px]";

  return (
    <button
      onClick={onClick}
      className={[
        "absolute -translate-x-1/2 -translate-y-1/2 rounded-full text-center",
        "transition-all duration-500 ease-out",
        sizeClass,
        active ? "nd-glow scale-[1.03]" : "",
        dim ? "opacity-40" : "opacity-100",
        floating ? (size === "center" ? "nd-pulse-slow" : "nd-pulse") : "nd-fade-in",
        "hover:scale-[1.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
      ].join(" ")}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${(floating ? floatDelay : delay)}s`,
      }}
    >
      {children}
    </button>
  );
}


function DetailPanel({
  open,
  onClose,
  content,
}: {
  open: boolean;
  onClose: () => void;
  content: { label: string; blurb: string; body: string[]; thoughts: string[]; needs: string[] } | null;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop only on mobile bottom sheet */}
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 bg-foreground/5 backdrop-blur-[2px] transition-opacity duration-500 z-40",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden
      />
      <aside
        className={[
          "fixed z-50 bg-card/95 backdrop-blur-xl border border-border/60 shadow-2xl",
          "transition-all duration-500 ease-out",
          // Mobile: bottom sheet
          "left-3 right-3 bottom-3 rounded-3xl",
          // Desktop: side panel
          "sm:left-auto sm:bottom-6 sm:top-6 sm:right-6 sm:w-[380px] sm:rounded-3xl",
          open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      >
        {content && (
          <div className="p-6 sm:p-7 max-h-[70vh] sm:max-h-[calc(100vh-3rem)] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">You might be feeling</p>
                <h2 className="mt-1.5 text-xl font-medium text-foreground/90 leading-snug">
                  {content.label}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors text-xl leading-none -mt-1"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground/75">{content.blurb}</p>

            <Section title="Body cues" items={content.body} />
            <Section title="Thoughts" items={content.thoughts} />
            <Section title="Possible needs" items={content.needs} />

            <p className="mt-6 text-xs text-muted-foreground leading-relaxed">
              Take what resonates. Leave what doesn’t.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-6">
      <h3 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((it, i) => (
          <li
            key={i}
            className="text-[14.5px] leading-relaxed text-foreground/80 pl-4 relative"
          >
            <span className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-primary/50" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
