import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { EndingScreen } from "./components/EndingScreen";
import { GameSelectScreen } from "./components/GameSelectScreen";
import { PuzzleScreen } from "./components/PuzzleScreen";
import { QuickQuestionsScreen } from "./components/QuickQuestionsScreen";
import { StoryScreen } from "./components/StoryScreen";
import { defaultNames, story } from "./data/twentyMinutesWithMike";
import { createInitialStoryState, getNextStoryState, isDevModeEnabled } from "./engine/storyEngine";
import type { Choice, Names, StoryState } from "./types/conversation";
import "./styles.css";

type AppView = "gameSelect" | "quickQuestions" | "puzzle" | "story";

function App() {
  const devMode = isDevModeEnabled();
  const [names] = useState<Names>(defaultNames);
  const [view, setView] = useState<AppView>("gameSelect");
  const [state, setState] = useState<StoryState>(() => createInitialStoryState(story));
  const [previousStates, setPreviousStates] = useState<StoryState[]>([]);

  const node = story.nodes[state.nodeId];
  const ending = state.endingId ? story.endings[state.endingId] : null;

  const handleChoice = (choice: Choice) => {
    setPreviousStates((prev) => [...prev, state]);
    setState((prev) => getNextStoryState(prev, choice));
  };

  const handleBack = () => {
    setPreviousStates((prev) => {
      const previous = prev[prev.length - 1];
      if (!previous) return prev;

      setState(previous);
      return prev.slice(0, -1);
    });
  };

  const resetStory = () => {
    setPreviousStates([]);
    setState(createInitialStoryState(story));
    setView("gameSelect");
  };

  const leaveForGoogle = () => {
    window.location.assign("https://www.google.com");
  };

  if (view === "gameSelect") {
    return (
      <GameSelectScreen
        onLeave={leaveForGoogle}
        onPuzzle={() => setView("puzzle")}
        onQuickQuestions={() => setView("quickQuestions")}
      />
    );
  }

  if (view === "quickQuestions") {
    return <QuickQuestionsScreen devMode={devMode} onBack={() => setView("gameSelect")} />;
  }

  if (view === "puzzle") {
    return <PuzzleScreen onBack={() => setView("gameSelect")} />;
  }

  if (view === "story" && ending) {
    return (
      <EndingScreen
        devMode={devMode}
        ending={ending}
        names={names}
        previousStepsCount={previousStates.length}
        state={state}
        onBack={handleBack}
        onReset={resetStory}
      />
    );
  }

  if (view === "story") {
    return (
      <StoryScreen
        devMode={devMode}
        names={names}
        node={node}
        previousStepsCount={previousStates.length}
        state={state}
        onBack={handleBack}
        onChoice={handleChoice}
      />
    );
  }

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
