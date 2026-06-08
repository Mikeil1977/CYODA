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
  | "emotionalRegulation"
  | "conflictStyle"
  | "directness"
  | "reciprocity"
  | "respectForBoundaries"
  | "privacyTrust"
  | "repairCapacity"
  | "generosity"
  | "pressureControlRisk"
  | "entitlement"
  | "resentment"
  | "control"
  | "contempt";

export type ChoiceType = "score" | "gate" | "redFlag" | "topicUnlock" | "toneShift";

export type InventoryItemId =
  | "rain_wet_excuse"
  | "spare_pub_chair"
  | "badly_rehearsed_phone_call"
  | "fruit_machine_truth"
  | "perfect_day_menu"
  | "politically_hazardous_pint"
  | "beer_mat_with_delusions"
  | "warm_not_yet"
  | "borrowed_spotlight"
  | "unguarded_confidence"
  | "late_reply_receipt"
  | "wrong_pint_apology"
  | "lightly_used_dad_joke"
  | "unnecessary_but_revealing_advice";

export type InventoryItemVariant = {
  id: string;
  label: string;
  description?: string;
  signalCue?: string;
  conversationPrompt?: string;
};

export type InventoryItem = {
  id: InventoryItemId;
  label: string;
  description?: string;
  variants?: Record<string, InventoryItemVariant>;
};

export type InventoryEntry = {
  itemId: InventoryItemId;
  variantId: string;
};

export type ChoiceEffect = {
  collectItems?: InventoryEntry[];
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
  signalCue?: string;
  effects?: ChoiceEffect;
};

export type Node = {
  id: string;
  questionCue?: string;
  title: string;
  text: string[];
  choices: Choice[];
};

export type EndingTemplate = {
  id: string;
  reflectionType?: "relationship" | "inventory";
  title: string;
  summary: string;
};

export type StoryData = {
  startNodeId: string;
  items?: Partial<Record<InventoryItemId, InventoryItem>>;
  nodes: Record<string, Node>;
  endings: Record<string, EndingTemplate>;
};

export type HistoryItem = {
  nodeId: string;
  choiceId: string;
  label: string;
  type: ChoiceType;
  signalCue?: string;
  effects: ChoiceEffect | undefined;
};

export type StoryState = {
  nodeId: string;
  conversationState: ConversationState;
  scores: Partial<Record<ScoreDimension, number>>;
  inventory: InventoryEntry[];
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
