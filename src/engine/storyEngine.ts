import type { Choice, EndingReflection, Names, ScoreDimension, StoryData, StoryState } from "../types/conversation";

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

function hasChoice(state: StoryState, choiceId: string) {
  return state.history.some((item) => item.choiceId === choiceId);
}

function hasAnyChoice(state: StoryState, choiceIds: string[]) {
  return choiceIds.some((choiceId) => hasChoice(state, choiceId));
}

function score(state: StoryState, dimension: ScoreDimension) {
  return state.scores[dimension] ?? 0;
}

function addUnique(items: string[], item: string) {
  if (!items.includes(item)) {
    items.push(item);
  }
}

function limitWithFallback(items: string[], fallback: string, limit = 3) {
  return (items.length > 0 ? items : [fallback]).slice(0, limit);
}

function getReachedLine(endingId: string | null) {
  switch (endingId) {
    case "ending_rain_taxi":
      return "The evening ended before the pub really began.";
    case "ending_table_unfinished":
      return "The evening reached the pub, but stayed at the table.";
    case "ending_left_with_friend":
      return "The evening reached the bar, but ended when {friendName} came back.";
    case "ending_jokes_not_your_crowd":
      return "The evening got as far as joining the regulars, but the room never quite felt like yours.";
    case "ending_after_last_orders_declined":
      return "The evening got as far as last orders and an invitation to O'Donoghues.";
    case "ending_late_taxi":
      return "The evening got as far as pool and darts at O'Donoghues.";
    case "ending_good_next_time":
      return "The evening got as far as a number exchange.";
    case "ending_hopeful_awkward":
      return "The evening got as far as a number exchange, after a slightly awkward minute.";
    case "ending_boundary_redflag":
      return "The evening got as far as the walk home, but cooled before a number was offered.";
    case "ending_poor_fit":
      return "The evening ended early, once the politics chat made the fit clear.";
    case "ending_values_mismatch":
      return "The evening ended around a values mismatch rather than a personal row.";
    default:
      return "The evening found its own stopping point.";
  }
}

function getOutcomeLine(endingId: string | null) {
  switch (endingId) {
    case "ending_good_next_time":
      return "{subjectName} would probably want to see you again.";
    case "ending_hopeful_awkward":
      return "{subjectName} would probably still want to see you again, just slowly.";
    case "ending_boundary_redflag":
      return "{subjectName} would probably leave it as one night.";
    case "ending_late_taxi":
      return "{subjectName} might remember the night fondly, but probably would not read it as a date.";
    case "ending_after_last_orders_declined":
    case "ending_jokes_not_your_crowd":
      return "It would probably stay as a decent pub conversation.";
    case "ending_rain_taxi":
    case "ending_table_unfinished":
    case "ending_left_with_friend":
      return "There was not really enough there for a spark to catch.";
    case "ending_poor_fit":
    case "ending_values_mismatch":
      return "You both probably did the sensible thing by letting it stay polite.";
    default:
      return "{subjectName} would probably take the evening as it landed.";
  }
}

export function getEndingReflection(state: StoryState): EndingReflection {
  const worked: string[] = [];
  const cooled: string[] = [];

  if (hasChoice(state, "go_inside")) {
    addUnique(worked, "You followed the music in instead of letting the weather decide the night.");
  }

  if (hasAnyChoice(state, ["sit_bar", "join_regulars", "join_after_table"])) {
    addUnique(worked, "You joined the conversation rather than staying safely at the edge.");
  }

  if (hasChoice(state, "boris_bad")) {
    addUnique(worked, "You were clear about what you thought, even in a pub politics conversation.");
  } else if (hasChoice(state, "boris_neutral")) {
    addUnique(cooled, "You kept the politics chat at arm's length.");
  }

  if (hasAnyChoice(state, ["religion_no", "religion_kinda", "faith_is_mine", "kind_more_than_certain"])) {
    addUnique(worked, "You handled values talk without turning it into a fight.");
  }

  if (hasAnyChoice(state, ["hard_to_know", "none_of_our_business", "didnt_start_tonight"])) {
    addUnique(worked, "You left room for missing context when the pub got awkward.");
  }

  if (hasAnyChoice(state, ["three_texts_not_space", "take_at_word", "type_send_none"])) {
    addUnique(worked, "You seemed to understand that giving someone room still counts when it is uncomfortable.");
  }

  if (hasAnyChoice(state, ["good_recovery", "need_a_minute", "bad_moods_allowed"])) {
    addUnique(worked, "You noticed the difference between having a bad mood and handing it to everyone else.");
  }

  if (hasAnyChoice(state, ["bad_building_worse_apology", "sorry_before_defending", "same_joke_too_late"])) {
    addUnique(worked, "You could keep things light without dodging the repair.");
  }

  if (hasAnyChoice(state, ["good_in_room", "enjoy_watching"])) {
    addUnique(worked, "You sounded generous about someone else being liked.");
  }

  if (hasChoice(state, "join_jokes")) {
    addUnique(worked, "You played along with the terrible jokes.");
  }

  if (hasChoice(state, "ask_mike_home")) {
    addUnique(worked, "You were direct enough when {subjectName} needed help reading the room.");
  }

  if (hasChoice(state, "respect_warmly")) {
    addUnique(worked, "You made the almost-kiss easy instead of making him manage your feelings.");
  }

  if (hasAnyChoice(state, ["take_table", "let_it_pass"])) {
    addUnique(cooled, "You kept the evening at a distance.");
  }

  if (hasAnyChoice(state, ["take_drinks_back", "return_table", "leave_with_jill"])) {
    addUnique(cooled, "You moved away when the conversation was starting to open.");
  }

  if (hasChoice(state, "boris_good")) {
    addUnique(cooled, "The politics chat exposed a values gap early on.");
  }

  if (hasChoice(state, "some_values_wrong")) {
    addUnique(cooled, "The religion chat narrowed quickly into right and wrong.");
  }

  if (hasChoice(state, "not_theology_over_pint")) {
    addUnique(cooled, "You kept the values chat closed down, which kept the room a little cooler.");
  }

  if (hasAnyChoice(state, ["what_did_he_do", "silence_says_plenty"])) {
    addUnique(cooled, "The awkward table moment brought out a quick read before there was much to go on.");
  }

  if (hasAnyChoice(state, ["depends_important", "hate_guessing"])) {
    addUnique(cooled, "The talk about space seemed to leave you wanting more certainty.");
  }

  if (hasChoice(state, "know_not_personal")) {
    addUnique(cooled, "Sarah's bad mood made it easy to expect other people to read around it.");
  }

  if (hasAnyChoice(state, ["engineering_critique", "beer_mats_survive"])) {
    addUnique(cooled, "The beer-mat apology stayed funny, but the repair got a little lost.");
  }

  if (hasAnyChoice(state, ["funny_unless_birthday", "quiet_minute", "compete_for_space"])) {
    addUnique(cooled, "Sarah's birthday story touched a nerve around attention and space.");
  }

  if (hasChoice(state, "dismiss_jokes")) {
    addUnique(cooled, "The regulars' humour did not really land for you.");
  }

  if (hasChoice(state, "go_home_now")) {
    addUnique(cooled, "You stepped out before the invitation had a chance to turn into anything.");
  }

  if (hasChoice(state, "ask_girls_taxi")) {
    addUnique(cooled, "You chose the safer exit instead of making the interest clearer.");
  }

  if (hasChoice(state, "accept_awkwardly")) {
    addUnique(cooled, "The almost-kiss made you wobble for a moment, but you recovered.");
  }

  if (hasAnyChoice(state, ["tease_pressure", "sulk_accuse"])) {
    addUnique(cooled, "The walk cooled when his slow-down became something he had to manage.");
  }

  if (score(state, "openness") >= 3) {
    addUnique(worked, "You kept saying yes to the night when it offered another turn.");
  }

  if (score(state, "respectForBoundaries") >= 3) {
    addUnique(worked, "You gave people room without treating it like rejection.");
  }

  if (score(state, "resentment") >= 2 || score(state, "entitlement") >= 2 || score(state, "control") >= 2) {
    addUnique(cooled, "Some moments made the conversation feel a bit more guarded.");
  }

  return {
    reached: getReachedLine(state.endingId),
    worked: limitWithFallback(worked, "You made choices that matched the kind of night you wanted."),
    cooled: limitWithFallback(cooled, "There were still moments where the evening stayed careful rather than easy.", 2),
    outcome: getOutcomeLine(state.endingId),
  };
}
