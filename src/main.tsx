import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { EndingScreen } from "./components/EndingScreen";
import { LandingScreen } from "./components/LandingScreen";
import { StoryScreen } from "./components/StoryScreen";
import { defaultNames, story } from "./data/twentyMinutesWithMike";
import { createInitialStoryState, getNextStoryState, isDevModeEnabled } from "./engine/storyEngine";
import type { Choice, Names, StoryState } from "./types/conversation";
import "./styles.css";

function App() {
  const devMode = isDevModeEnabled();
  const [names, setNames] = useState<Names>(defaultNames);
  const [started, setStarted] = useState(false);
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
    setStarted(false);
  };

  const startAdventure = () => {
    setNames((n) => ({
      playerName: n.playerName.trim() || defaultNames.playerName,
      friendName: n.friendName.trim() || defaultNames.friendName,
      subjectName: n.subjectName.trim() || defaultNames.subjectName,
    }));
    setStarted(true);
  };

  const leaveForGoogle = () => {
    window.location.assign("https://www.google.com");
  };

  if (!started) {
    return (
      <LandingScreen
        devMode={devMode}
        names={names}
        onLeave={leaveForGoogle}
        onNamesChange={setNames}
        onStart={startAdventure}
      />
    );
  }

  if (ending) {
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
