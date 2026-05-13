import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type ConversationState =
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

type ScoreDimension =
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

type ChoiceType = "score" | "gate" | "redFlag" | "topicUnlock" | "toneShift";

type ChoiceEffect = {
  scores?: Partial<Record<ScoreDimension, number>>;
  state?: ConversationState;
  redFlags?: string[];
  unlockTopics?: string[];
};

type Choice = {
  id: string;
  label: string;
  response?: string;
  nextId: string;
  type: ChoiceType;
  effects?: ChoiceEffect;
};

type Node = {
  id: string;
  title: string;
  text: string[];
  choices: Choice[];
};

type EndingTemplate = {
  id: string;
  title: string;
  summary: string;
};

type StoryData = {
  startNodeId: string;
  nodes: Record<string, Node>;
  endings: Record<string, EndingTemplate>;
};

type StoryState = {
  nodeId: string;
  conversationState: ConversationState;
  scores: Partial<Record<ScoreDimension, number>>;
  redFlags: string[];
  unlockedTopics: string[];
  history: Array<{ nodeId: string; choiceId: string; label: string }>;
  endingId: string | null;
};

type Names = {
  playerName: string;
  friendName: string;
  subjectName: string;
};

const defaultNames: Names = {
  playerName: "Sally",
  friendName: "Jill",
  subjectName: "Mike",
};

const story: StoryData = {
  startNodeId: "rain_pub",
  nodes: {
    rain_pub: {
      id: "rain_pub",
      title: "Rain Shelter",
      text: [
        "Rain turns biblical. You and {friendName} duck into a nearby pub with steamed-up windows and low amber light.",
        "Coats drip by the door. Someone laughs near the fruit machine. It smells like chips and wet wool.",
      ],
      choices: [{ id: "enter", label: "Shake off the rain and follow {friendName} to the bar", nextId: "intro_mike", type: "toneShift", effects: { state: "neutral" } }],
    },
    intro_mike: {
      id: "intro_mike",
      title: "Introductions",
      text: [
        "{friendName} spots someone at the bar. 'Oh! {subjectName}, this is {playerName}.'",
        "{subjectName} gives a slightly awkward smile. 'Hi. Rough weather for dramatic entrances.'",
      ],
      choices: [{ id: "intro_ack", label: "Smile and say hello", nextId: "jill_leaves", type: "toneShift", effects: { state: "warm", scores: { openness: 1 } } }],
    },
    jill_leaves: {
      id: "jill_leaves",
      title: "Twenty Minutes",
      text: [
        "{friendName}'s phone rings. She steps away, comes back apologetic, and says she has to deal with something nearby.",
        "'Twenty minutes, tops. Don't vanish.' Then she disappears into the rain, leaving you with {subjectName}.",
      ],
      choices: [
        {
          id: "avoid",
          label: "Nod politely, then retreat into your phone",
          nextId: "ending_nothing",
          type: "gate",
          effects: { state: "flat" },
        },
        {
          id: "engage",
          label: "Turn to {subjectName}: 'So... are we doing awkward silence or conversation?'",
          nextId: "light_banter",
          type: "score",
          effects: { state: "playful", scores: { humour: 2, openness: 1 } },
        },
      ],
    },
    light_banter: {
      id: "light_banter",
      title: "Opening Rhythm",
      text: [
        "{subjectName} laughs. 'Excellent. I vote conversation with occasional sarcasm.'",
        "The two of you find a rhythm: weather jokes, pub rankings, and a brief argument about whether crisps count as dinner.",
      ],
      choices: [
        {
          id: "kind_funny",
          label: "Keep it light and kind",
          response: "You match his dry humour without trying to win every line.",
          nextId: "politics_doorway",
          type: "score",
          effects: { state: "warm", scores: { humour: 2, empathy: 1, curiosity: 1 } },
        },
        {
          id: "oneup",
          label: "Go competitive and one-up every joke",
          response: "He still smiles, but starts watching his words.",
          nextId: "politics_doorway",
          type: "toneShift",
          effects: { state: "guarded", scores: { humour: -1, curiosity: -1, control: 1 } },
        },
      ],
    },
    politics_doorway: {
      id: "politics_doorway",
      title: "Politics Doorway",
      text: [
        "{subjectName} swirls his glass. 'Funny thing about politics. Everyone claims they want honesty until someone says something inconvenient.'",
        "He glances at you. 'What's your take?'",
      ],
      choices: [
        {
          id: "nuanced",
          label: "'Depends if it's honest, or just lazy cruelty dressed up as honesty.'",
          nextId: "worldview_depth",
          type: "score",
          effects: { state: "curious", scores: { politicalNuance: 2, empathy: 1, pluralism: 1 } },
        },
        {
          id: "offended",
          label: "'People are too easily offended now.'",
          nextId: "probe_offended",
          type: "gate",
          effects: { state: "challenged", scores: { resentment: 1 } },
        },
        {
          id: "ukip",
          label: "'Honestly, UKIP had the right idea in some ways.'",
          nextId: "probe_ukip",
          type: "gate",
          effects: { state: "challenged", scores: { politicalNuance: -1 } },
        },
      ],
    },
    probe_offended: {
      id: "probe_offended",
      title: "He Probes Once",
      text: [
        "{subjectName} nods slowly. 'Maybe. Or maybe some people got used to never being challenged. What sort of thing do you mean?'",
      ],
      choices: [
        {
          id: "bad_faith",
          label: "'Mostly bad-faith pile-ons where nobody listens.'",
          nextId: "worldview_depth",
          type: "score",
          effects: { state: "curious", scores: { politicalNuance: 2, empathy: 1, accountability: 1 } },
        },
        {
          id: "contemptuous",
          label: "'People should toughen up. If they're upset, that's their problem.'",
          nextId: "ending_redflag",
          type: "redFlag",
          effects: { state: "closed", redFlags: ["contempt", "difficulty tolerating disagreement"], scores: { contempt: 2, empathy: -2 } },
        },
      ],
    },
    probe_ukip: {
      id: "probe_ukip",
      title: "Clarify What You Mean",
      text: ["{subjectName} raises an eyebrow. 'That's doing a lot of work in one sentence. Which bit did you mean exactly?'"],
      choices: [
        {
          id: "services",
          label: "'Housing pressure, wages, public services, ignored working-class strain.'",
          nextId: "worldview_depth",
          type: "score",
          effects: { state: "challenged", scores: { politicalNuance: 1, curiosity: 1, pluralism: 1 } },
        },
        {
          id: "othering",
          label: "'Too many outsiders. People like that don't fit.'",
          nextId: "ending_redflag",
          type: "redFlag",
          effects: { state: "closed", redFlags: ["othering language", "high entitlement"], scores: { entitlement: 2, pluralism: -2 } },
        },
      ],
    },
    worldview_depth: {
      id: "worldview_depth",
      title: "Under the Surface",
      text: [
        "You move past headlines into values: fairness, power, responsibility, what happens when you're wrong.",
        "It's not about agreeing on everything. It's whether either of you can disagree without needing to dominate.",
      ],
      choices: [
        {
          id: "reflective",
          label: "'I can be stubborn, but I try to repair it when I get it wrong.'",
          nextId: "conflict_style",
          type: "topicUnlock",
          effects: { state: "warm", unlockTopics: ["conflict"], scores: { accountability: 2, emotionalMaturity: 2 } },
        },
        {
          id: "defensive",
          label: "'If people can't handle blunt truth, that's on them.'",
          nextId: "conflict_style",
          type: "toneShift",
          effects: { state: "guarded", scores: { accountability: -1, contempt: 1, directness: 1 } },
        },
      ],
    },
    conflict_style: {
      id: "conflict_style",
      title: "Conflict Style",
      text: [
        "{subjectName}: 'When you argue with someone you care about, do you go quiet, go loud, or go forensic?'",
      ],
      choices: [
        {
          id: "repair",
          label: "'I cool off, then come back and actually sort it.'",
          nextId: "jill_returns",
          type: "score",
          effects: { state: "curious", scores: { conflictStyle: 2, emotionalMaturity: 2, respectForBoundaries: 1 } },
        },
        {
          id: "punish",
          label: "'I don't shout. I just make sure they know they've messed up.'",
          nextId: "jill_returns",
          type: "redFlag",
          effects: { state: "tense", redFlags: ["need to dominate", "low accountability"], scores: { control: 2, accountability: -2 } },
        },
      ],
    },
    jill_returns: {
      id: "jill_returns",
      title: "Time's Up",
      text: [
        "{friendName} reappears, damp hair and apologetic face. 'I hate this, but I have to go now.'",
        "She looks between you and {subjectName}. The moment hangs.",
      ],
      choices: [
        { id: "leave", label: "Leave with {friendName}", nextId: "ending_sensible_exit", type: "gate", effects: { state: "ended" } },
        { id: "stay", label: "Stay for one more drink with {subjectName}", nextId: "stay_direct", type: "topicUnlock", effects: { state: "warm", scores: { directness: 1 } } },
        { id: "abrupt", label: "End it abruptly: 'Nice chat. Bye.'", nextId: "ending_polite", type: "toneShift", effects: { state: "flat" } },
      ],
    },
    stay_direct: {
      id: "stay_direct",
      title: "Choosing to Stay",
      text: [
        "You tell {friendName} you'll catch up later. She gives you a look that says she'll want details.",
        "{subjectName} is warm but a bit oblivious. He keeps talking like this might still be accidental.",
      ],
      choices: [
        {
          id: "clear_interest",
          label: "Be fairly direct: 'I'm enjoying this. I'd like to keep talking properly.'",
          nextId: "bartender_scene",
          type: "score",
          effects: { state: "playful", scores: { directness: 2, openness: 1 } },
        },
        {
          id: "wait_signal",
          label: "Wait for him to indicate interest first",
          nextId: "bartender_scene",
          type: "toneShift",
          effects: { state: "guarded", scores: { directness: -1 } },
        },
      ],
    },
    bartender_scene: {
      id: "bartender_scene",
      title: "Bar Staff Intervenes",
      text: [
        "{subjectName} heads to the loo. The bartender leans in with professional mischief.",
        "'If you like him, you'll need to make a move. He's got no clue.'",
      ],
      choices: [
        { id: "hopeless", label: "'Good to know. I can work with hopeless.'", nextId: "mike_returns", type: "score", effects: { state: "playful", scores: { humour: 1, directness: 1 } } },
        { id: "unless_interested", label: "'Not making a move unless I know he's interested.'", nextId: "mike_returns", type: "gate", effects: { state: "guarded", scores: { respectForBoundaries: 1, directness: -1 } } },
        { id: "tell_him", label: "'Can you tell him I like him?'", nextId: "mike_returns", type: "toneShift", effects: { state: "curious", scores: { directness: 0, openness: 1 } } },
        { id: "men_first", label: "'Men should make the first move.'", nextId: "mike_returns", type: "redFlag", effects: { state: "tense", redFlags: ["passive expectation", "rigid gender script"], scores: { entitlement: 1, directness: -2 } } },
        { id: "flirt_harder", label: "'I'll flirt harder and see if he catches up.'", nextId: "mike_returns", type: "score", effects: { state: "playful", scores: { humour: 1, directness: 0 } } },
        { id: "his_problem", label: "'No, if he can't tell, that's his problem.'", nextId: "mike_returns", type: "redFlag", effects: { state: "closed", redFlags: ["low accountability", "guardedness"], scores: { accountability: -1, contempt: 1 } } },
        { id: "leave_now", label: "Leave before he returns", nextId: "ending_missed_signal", type: "gate", effects: { state: "ended" } },
      ],
    },
    mike_returns: {
      id: "mike_returns",
      title: "He Returns",
      text: [
        "{subjectName} comes back, apologises for the queue, and picks up the thread like no social event just happened.",
        "You now decide whether to make your intent unmistakable or let the moment drift.",
      ],
      choices: [
        { id: "make_move", label: "Make a clear move and suggest meeting again", nextId: "ending_bartender_right", type: "score", effects: { state: "warm", scores: { directness: 2, openness: 1 } } },
        { id: "drift", label: "Keep it vague and call it a night", nextId: "ending_friendly_no_spark", type: "toneShift", effects: { state: "flat" } },
      ],
    },
  },
  endings: {
    ending_nothing: { id: "ending_nothing", title: "Rain Stopped, Nothing Happened", summary: "Not enough interaction to judge compatibility." },
    ending_redflag: { id: "ending_redflag", title: "Red Flag Exit", summary: "The conversation exposed serious mismatch and closed early." },
    ending_sensible_exit: { id: "ending_sensible_exit", title: "Good Conversation, Sensible Exit", summary: "You had substance and left at a natural stopping point." },
    ending_polite: { id: "ending_polite", title: "Polite Twenty Minutes", summary: "Courteous enough, but little momentum." },
    ending_missed_signal: { id: "ending_missed_signal", title: "Missed Signal", summary: "There was potential, but timing and clarity never aligned." },
    ending_bartender_right: { id: "ending_bartender_right", title: "The Bartender Was Right", summary: "You made a clear move when it mattered, and he finally clocked it." },
    ending_friendly_no_spark: { id: "ending_friendly_no_spark", title: "Friendly but No Spark", summary: "Warm conversation, but no decisive shift into something more." },
  },
};

function fill(text: string, names: Names) {
  return text
    .replaceAll("{playerName}", names.playerName)
    .replaceAll("{friendName}", names.friendName)
    .replaceAll("{subjectName}", names.subjectName);
}

function App() {
  const [names, setNames] = useState<Names>(defaultNames);
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<StoryState>({
    nodeId: story.startNodeId,
    conversationState: "neutral",
    scores: {},
    redFlags: [],
    unlockedTopics: [],
    history: [],
    endingId: null,
  });

  const node = story.nodes[state.nodeId];
  const ending = state.endingId ? story.endings[state.endingId] : null;

  const handleChoice = (choice: Choice) => {
    setState((prev) => {
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
        history: [...prev.history, { nodeId: prev.nodeId, choiceId: choice.id, label: choice.label }],
      };
    });
  };

  if (!started) {
    return (
      <main className="app">
        <section className="card">
          <h1>A Chance Encounter</h1>
          <p className="sub">A branching pub conversation prototype.</p>
          <label>Player name<input value={names.playerName} onChange={(e) => setNames((n) => ({ ...n, playerName: e.target.value || "Sally" }))} /></label>
          <label>Friend name<input value={names.friendName} onChange={(e) => setNames((n) => ({ ...n, friendName: e.target.value || "Jill" }))} /></label>
          <label>Person at bar<input value={names.subjectName} onChange={(e) => setNames((n) => ({ ...n, subjectName: e.target.value || "Mike" }))} /></label>
          <button onClick={() => setStarted(true)}>Start conversation</button>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <section className="card">
        {!ending && node ? (
          <>
            <h2>{node.title}</h2>
            {node.text.map((line) => <p key={line}>{fill(line, names)}</p>)}
            <div className="choices">
              {node.choices.map((choice) => (
                <button key={choice.id} onClick={() => handleChoice(choice)}>{fill(choice.label, names)}</button>
              ))}
            </div>
          </>
        ) : ending ? (
          <>
            <h2>Result: {ending.title}</h2>
            <p>{ending.summary}</p>
            <button onClick={() => { setStarted(false); setState({ nodeId: story.startNodeId, conversationState: "neutral", scores: {}, redFlags: [], unlockedTopics: [], history: [], endingId: null }); }}>Play again</button>
          </>
        ) : null}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
