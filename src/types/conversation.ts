export type ConversationState =
  | "neutral"
  | "warm"
  | "playful"
  | "curious"
  | "guarded"
  | "challenged"
  | "tense"
  | "flat"
  | "closed"
  | "ended";

export type ScoreDimension =
  | "openness"
  | "humour"
  | "curiosity"
  | "empathy"
  | "accountability"
  | "pluralism"
  | "politicalNuance"
  | "antiAuthoritarianism"
  | "emotionalMaturity"
  | "conflictStyle"
  | "directness"
  | "respectForBoundaries"
  | "entitlement"
  | "resentment"
  | "control"
  | "contempt";

export type ChoiceType = "score" | "gate" | "redFlag" | "topicUnlock" | "toneShift";

export type ChoiceEffect = {
  scores?: Partial<Record<ScoreDimension, number>>;
  state?: ConversationState;
  redFlags?: string[];
  unlockTopics?: string[];
};

export type Choice = {
  id: string;
  label: string;
  response?: string;
  nextId: string;
  type: ChoiceType;
  effects?: ChoiceEffect;
};

export type Node = {
  id: string;
  title: string;
  text: string[];
  choices: Choice[];
};

export type EndingTemplate = {
  id: string;
  title: string;
  summary: string;
};

export type StoryData = {
  startNodeId: string;
  nodes: Record<string, Node>;
  endings: Record<string, EndingTemplate>;
};

export type HistoryItem = {
  nodeId: string;
  choiceId: string;
  label: string;
  type: ChoiceType;
  effects: ChoiceEffect | undefined;
};

export type StoryState = {
  nodeId: string;
  conversationState: ConversationState;
  scores: Partial<Record<ScoreDimension, number>>;
  redFlags: string[];
  unlockedTopics: string[];
  history: HistoryItem[];
  endingId: string | null;
};

export type EndingReflection = {
  reached: string;
  worked: string[];
  cooled: string[];
  outcome: string;
};

export type Names = {
  playerName: string;
  friendName: string;
  subjectName: string;
};
