import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowLeft, Heart, HelpCircle, Sparkles } from "lucide-react";
import "./styles.css";

const config = {
  firstName: "Mike",
};

type EntryMode = "interested" | "curious";
type DateEnergyId = "quiet" | "chaotic" | "food";
type ViewState =
  | { screen: "landing"; entryMode: null }
  | { screen: "curious"; entryMode: null }
  | { screen: "adventure"; entryMode: EntryMode };

function parseHash(): ViewState {
  const hash = window.location.hash.replace(/^#\/?/, "");

  if (hash.startsWith("curious")) {
    return { screen: "curious", entryMode: null };
  }

  if (hash.startsWith("adventure")) {
    const search = hash.includes("?") ? hash.slice(hash.indexOf("?")) : "";
    const params = new URLSearchParams(search);
    const mode = params.get("mode");

    return {
      screen: "adventure",
      entryMode: mode === "curious" ? "curious" : "interested",
    };
  }

  return { screen: "landing", entryMode: null };
}

function navigate(path: string) {
  window.location.hash = path;
}

function App() {
  const [view, setView] = useState<ViewState>(() => parseHash());

  useEffect(() => {
    const handleNavigation = () => setView(parseHash());

    window.addEventListener("hashchange", handleNavigation);
    return () => window.removeEventListener("hashchange", handleNavigation);
  }, []);

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className="phone-stage" aria-live="polite">
        <div className="story-mark" aria-hidden="true">
          <Sparkles size={20} strokeWidth={2.3} />
        </div>

        {view.screen === "landing" && (
          <LandingScreen
            firstName={config.firstName}
            onInterested={() => navigate("/adventure?mode=interested")}
            onCurious={() => navigate("/curious")}
          />
        )}

        {view.screen === "curious" && (
          <CuriousScreen
            onBack={() => navigate("/")}
            onStart={() => navigate("/adventure?mode=curious")}
          />
        )}

        {view.screen === "adventure" && view.entryMode && (
          <AdventureScreen
            entryMode={view.entryMode}
            onBack={() => navigate(view.entryMode === "curious" ? "/curious" : "/")}
          />
        )}
      </section>
    </main>
  );
}

type LandingScreenProps = {
  firstName: string;
  onInterested: () => void;
  onCurious: () => void;
};

function LandingScreen({ firstName, onInterested, onCurious }: LandingScreenProps) {
  return (
    <div className="screen landing-screen">
      <p className="microcopy">Choose your own dating adventure</p>
      <h1>
        Are you interested in {firstName}, the chap wearing this t-shirt?
      </h1>
      <p className="lede">Or just curious what the URL was about?</p>

      <div className="choice-stack" aria-label="Choose how you arrived here">
        <button className="choice-button primary" type="button" onClick={onInterested}>
          <span className="choice-icon" aria-hidden="true">
            <Heart size={22} fill="currentColor" strokeWidth={2.1} />
          </span>
          <span>I&rsquo;m interested</span>
        </button>

        <button className="choice-button secondary" type="button" onClick={onCurious}>
          <span className="choice-icon" aria-hidden="true">
            <HelpCircle size={23} strokeWidth={2.2} />
          </span>
          <span>Just curious</span>
        </button>
      </div>
    </div>
  );
}

type CuriousScreenProps = {
  onBack: () => void;
  onStart: () => void;
};

function CuriousScreen({ onBack, onStart }: CuriousScreenProps) {
  return (
    <div className="screen curious-screen">
      <button className="back-button" type="button" onClick={onBack}>
        <ArrowLeft size={19} strokeWidth={2.4} />
        <span>Back</span>
      </button>

      <div className="screen-copy">
        <p className="microcopy">Fair. Very fair.</p>
        <h2>
          This is a tiny choose-your-own dating adventure printed on a t-shirt
          because apparently subtlety was unavailable.
        </h2>
        <p className="supporting-copy">
          You can inspect the premise from a safe distance, or press the big button
          and see what sort of date story your choices accidentally invent.
        </p>
      </div>

      <button className="choice-button primary" type="button" onClick={onStart}>
        <span className="choice-icon" aria-hidden="true">
          <Sparkles size={22} strokeWidth={2.3} />
        </span>
        <span>Start the adventure</span>
      </button>
    </div>
  );
}

type AdventureIntroProps = {
  entryMode: EntryMode;
  onBack: () => void;
};

const dateEnergyOptions: Array<{
  id: DateEnergyId;
  label: string;
  result: string;
}> = [
  {
    id: "quiet",
    label: "Quiet coffee and good conversation",
    result:
      "A strong start. Low drama, high signal, and plenty of room for suspiciously specific opinions.",
  },
  {
    id: "chaotic",
    label: "Something chaotic and memorable",
    result:
      "Dangerously promising. This path may involve mini golf, a weird museum, or a story that improves with retelling.",
  },
  {
    id: "food",
    label: "Food first, feelings later",
    result:
      "Practical, excellent, and emotionally well-catered. Compatibility improves sharply in the presence of chips.",
  },
];

function AdventureScreen({ entryMode, onBack }: AdventureIntroProps) {
  const [selectedEnergy, setSelectedEnergy] = useState<DateEnergyId | null>(null);
  const selectedOption = dateEnergyOptions.find(
    (option) => option.id === selectedEnergy,
  );
  const accentCopy =
    entryMode === "interested"
      ? "Excellent. Bold, charming, and already better than most dating apps."
      : "Curiosity is a perfectly respectable doorway. No romantic paperwork required.";

  return (
    <div className="screen adventure-screen">
      <button className="back-button" type="button" onClick={onBack}>
        <ArrowLeft size={19} strokeWidth={2.4} />
        <span>Back</span>
      </button>

      <div className="screen-copy">
        <p className="microcopy">Adventure started</p>
        <h2>{accentCopy}</h2>
        <p className="supporting-copy">
          Entry mode: <strong>{entryMode}</strong>. First compatibility test:
          date energy.
        </p>
      </div>

      <div className="question-panel">
        <p className="question-kicker">Pick one</p>
        <h3>What should the opening date energy be?</h3>

        <div className="adventure-options" aria-label="Choose the first date energy">
          {dateEnergyOptions.map((option) => (
            <button
              className="adventure-option"
              data-selected={selectedEnergy === option.id}
              key={option.id}
              type="button"
              onClick={() => setSelectedEnergy(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {selectedOption && (
          <div className="result-note" role="status">
            {selectedOption.result}
          </div>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
