import type { Choice, Names, ScoreDimension, StoryData, StoryState } from "../types/conversation";

export function fill(text: string, names: Names) {
  return text
    .replaceAll("{playerName}", names.playerName)
    .replaceAll("{friendName}", names.friendName)
    .replaceAll("{subjectName}", names.subjectName);
}

export function isTruthyFlag(value: string | null) {
  return value !== null && value !== "0" && value.toLowerCase() !== "false";
}

export function isDevModeEnabled() {
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash;
  const hashQuery = hash.includes("?") ? hash.slice(hash.indexOf("?")) : "";
  const hashParams = new URLSearchParams(hashQuery);

  return (
    isTruthyFlag(params.get("dev")) ||
    isTruthyFlag(params.get("debug")) ||
    isTruthyFlag(hashParams.get("dev")) ||
    isTruthyFlag(hashParams.get("debug")) ||
    hash.toLowerCase() === "#dev"
  );
}

export function createInitialStoryState(story: StoryData): StoryState {
  return {
    nodeId: story.startNodeId,
    conversationState: "neutral",
    scores: {},
    redFlags: [],
    unlockedTopics: [],
    history: [],
    endingId: null,
  };
}

export function getNextStoryState(prev: StoryState, choice: Choice): StoryState {
  const nextScores = { ...prev.scores };
  Object.entries(choice.effects?.scores ?? {}).forEach(([k, v]) => {
    const key = k as ScoreDimension;
    nextScores[key] = (nextScores[key] ?? 0) + (v ?? 0);
  });

  const nextRedFlags = [...prev.redFlags, ...(choice.effects?.redFlags ?? [])];
  const nextTopics = [...new Set([...prev.unlockedTopics, ...(choice.effects?.unlockTopics ?? [])])];
  const nextNodeId = choice.nextId;
  const isEnding = nextNodeId.startsWith("ending_");

  return {
    ...prev,
    nodeId: isEnding ? prev.nodeId : nextNodeId,
    endingId: isEnding ? nextNodeId : null,
    conversationState: choice.effects?.state ?? prev.conversationState,
    scores: nextScores,
    redFlags: nextRedFlags,
    unlockedTopics: nextTopics,
    history: [
      ...prev.history,
      {
        nodeId: prev.nodeId,
        choiceId: choice.id,
        label: choice.label,
        type: choice.type,
        effects: choice.effects,
      },
    ],
  };
}

export function getScoreEntries(scores: StoryState["scores"]) {
  return Object.entries(scores)
    .filter((entry): entry is [ScoreDimension, number] => typeof entry[1] === "number")
    .sort(([a], [b]) => a.localeCompare(b));
}
