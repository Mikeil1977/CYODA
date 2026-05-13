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

const createInitialStoryState = (): StoryState => ({
  nodeId: story.startNodeId,
  conversationState: "neutral",
  scores: {},
  redFlags: [],
  unlockedTopics: [],
  history: [],
  endingId: null,
});

const story: StoryData = {
  startNodeId: "rain_pub",
  nodes: {
    rain_pub: {
      id: "rain_pub",
      title: "Union Street Rain",
      text: [
        "The rain appears out of nowhere, hard and bright under the streetlights on Union Street.",
        "You and {friendName} have been out for dinner and a few drinks. Music drifts up from a nearby pub, one of those songs that makes bad weather feel like a plot device.",
      ],
      choices: [
        {
          id: "go_inside",
          label: "Go inside",
          nextId: "pub_entry",
          type: "toneShift",
          effects: { state: "neutral", scores: { openness: 1 } },
        },
        {
          id: "rain_taxi",
          label: "Go to the taxi rank and wait in the rain",
          nextId: "ending_taxi_home",
          type: "gate",
          effects: { state: "ended" },
        },
      ],
    },
    pub_entry: {
      id: "pub_entry",
      title: "The Bar Below",
      text: [
        "You go down the steps into the bar. It is not too busy: a few regulars at the bar, a few empty tables, and two staff members moving through the low amber light.",
        "The music is loud enough to enjoy, but not so loud that conversation has to become theatre.",
      ],
      choices: [
        {
          id: "sit_bar",
          label: "Take a stool at the bar",
          nextId: "bar_stool",
          type: "score",
          effects: { state: "warm", scores: { openness: 1 } },
        },
        {
          id: "take_table",
          label: "Take a table",
          nextId: "table_route",
          type: "gate",
          effects: { state: "flat" },
        },
      ],
    },
    table_route: {
      id: "table_route",
      title: "A Table Apart",
      text: [
        "You and {friendName} take a table. A staff member brings menus and mentions that the kitchen is close to last orders.",
        "A man arrives at the bar, clearly a regular, but the shape of the evening never quite turns toward him. {friendName}'s phone rings, and the moment thins out.",
      ],
      choices: [
        {
          id: "let_it_pass",
          label: "Let the evening stay quiet",
          nextId: "ending_polite_unfinished",
          type: "gate",
          effects: { state: "flat" },
        },
      ],
    },
    bar_stool: {
      id: "bar_stool",
      title: "Regulars",
      text: [
        "You and {friendName} take a couple of stools at the bar and order drinks.",
        "While you are waiting, {subjectName} comes in. He says hello to the regulars and the bar staff, and someone starts pouring his pint before he asks.",
        "{friendName}'s phone rings. She gives you an apologetic look and steps outside to take it.",
        "The regulars are talking about Boris Johnson and the pandemic. One of them, Stevie, turns slightly. 'What do you think?'",
      ],
      choices: [
        {
          id: "boris_good",
          label: "I think everyone should leave poor Boris alone. He was just doing his best.",
          nextId: "ending_poor_fit",
          type: "gate",
          effects: { state: "closed", scores: { politicalNuance: -2, empathy: -1 } },
        },
        {
          id: "boris_bad",
          label: "Only Trump and Bolsonaro did worse. He should be ashamed of that Superman of Capitalism speech.",
          nextId: "join_offer",
          type: "score",
          effects: { state: "curious", scores: { politicalNuance: 2, antiAuthoritarianism: 2, humour: 1 } },
        },
        {
          id: "boris_neutral",
          label: "I don't really know. I avoid politics when I can.",
          nextId: "neutral_followup",
          type: "toneShift",
          effects: { state: "guarded", scores: { politicalNuance: -1 } },
        },
      ],
    },
    neutral_followup: {
      id: "neutral_followup",
      title: "A Softer Door",
      text: [
        "'Hard to avoid politics in a global pandemic,' Stevie says, but he lets it go.",
        "{subjectName} softens the moment with a dry aside about pub conversations going from weather to constitutional crisis in under five minutes.",
      ],
      choices: [
        {
          id: "hang_around",
          label: "Hang around and wait for {friendName} to return",
          nextId: "join_offer",
          type: "score",
          effects: { state: "curious", scores: { openness: 1 } },
        },
        {
          id: "take_drinks_back",
          label: "Take your drinks back to the table",
          nextId: "return_table_choice",
          type: "gate",
          effects: { state: "flat" },
        },
      ],
    },
    join_offer: {
      id: "join_offer",
      title: "An Invitation",
      text: [
        "Stevie and {subjectName} both nod along.",
        "'Well said. What's your name?' {subjectName} asks.",
        "'{playerName}.'",
        "'What brings you in tonight, {playerName}?'",
        "You explain you have been out with {friendName} for dinner and a few drinks. He says he kind of knows {friendName}, then nods toward the regulars. 'Do you want to join us while you wait for her to come back?'",
      ],
      choices: [
        {
          id: "join_regulars",
          label: "Sure",
          nextId: "religion_question",
          type: "score",
          effects: { state: "warm", scores: { openness: 1, curiosity: 1 } },
        },
        {
          id: "return_table",
          label: "No thanks, I'll just take these drinks and wait over there.",
          nextId: "return_table_choice",
          type: "gate",
          effects: { state: "guarded" },
        },
      ],
    },
    return_table_choice: {
      id: "return_table_choice",
      title: "Back At The Table",
      text: [
        "You take the drinks back to the table. {friendName} is still outside, pacing under the awning with her phone pressed to one ear.",
        "The regulars are still laughing at the bar. {subjectName} catches your eye once, then looks away with the careful politeness of someone not wanting to crowd you.",
      ],
      choices: [
        {
          id: "join_after_table",
          label: "Finish these here, then go and join them",
          nextId: "religion_question",
          type: "score",
          effects: { state: "warm", scores: { openness: 1, directness: 1 } },
        },
        {
          id: "leave_with_jill",
          label: "Leave with {friendName} when she comes back",
          nextId: "ending_taxi_home",
          type: "gate",
          effects: { state: "ended" },
        },
      ],
    },
    religion_question: {
      id: "religion_question",
      title: "Religion",
      text: [
        "{friendName} is still outside. You join the regulars properly, and the conversation wanders, as pub conversations do.",
        "Eventually it lands on religion. {subjectName} looks over. 'What about you, do you follow a particular religion?'",
      ],
      choices: [
        {
          id: "religion_yes",
          label: "Yes, devoutly.",
          nextId: "ending_values_mismatch",
          type: "gate",
          effects: { state: "flat", scores: { pluralism: -1 } },
        },
        {
          id: "religion_no",
          label: "Nope, atheist.",
          nextId: "accountability_question",
          type: "score",
          effects: { state: "warm", scores: { directness: 1, pluralism: 1 } },
        },
        {
          id: "religion_kinda",
          label: "Not really. I was brought up with one, but I don't practise anymore.",
          nextId: "accountability_question",
          type: "score",
          effects: { state: "warm", scores: { pluralism: 1, curiosity: 1 } },
        },
      ],
    },
    accountability_question: {
      id: "accountability_question",
      title: "What Sticks",
      text: [
        "Religion fades into old relationships, as if the bar has collectively decided this is now a documentary.",
        "Victoria, stacking glasses at the far end of the bar, asks with cheerful bluntness: 'So what did your last relationship actually teach you?'",
      ],
      choices: [
        {
          id: "learned_repair",
          label: "That being right is less useful than learning how to repair things.",
          nextId: "space_question",
          type: "score",
          effects: { state: "warm", scores: { accountability: 2, emotionalMaturity: 2, empathy: 1 } },
        },
        {
          id: "learned_slowly",
          label: "That I can get defensive at first, but I do come back and own my part.",
          nextId: "space_question",
          type: "score",
          effects: { state: "curious", scores: { accountability: 1, emotionalMaturity: 1 } },
        },
        {
          id: "all_exes",
          label: "Honestly? That some people are just unhinged. Every ex has been hard work.",
          nextId: "ending_accountability_cools",
          type: "redFlag",
          effects: { state: "closed", redFlags: ["blame-only relationship history"], scores: { accountability: -3, empathy: -1, resentment: 2 } },
        },
      ],
    },
    space_question: {
      id: "space_question",
      title: "Space",
      text: [
        "{subjectName} looks at his pint for a second. 'If someone you like says they need a bit of space, what do you do with that?'",
        "It is asked lightly, but not emptily.",
      ],
      choices: [
        {
          id: "give_space",
          label: "Give them space. If they want to talk later, they know where I am.",
          nextId: "bad_day_question",
          type: "score",
          effects: { state: "warm", scores: { respectForBoundaries: 2, emotionalMaturity: 1 } },
        },
        {
          id: "ask_once",
          label: "Ask once if they need anything from me, then leave them be.",
          nextId: "bad_day_question",
          type: "score",
          effects: { state: "curious", scores: { respectForBoundaries: 2, empathy: 1 } },
        },
        {
          id: "explain_first",
          label: "They can have space after they explain exactly what I did wrong.",
          nextId: "ending_space_pressure",
          type: "redFlag",
          effects: { state: "closed", redFlags: ["conditional respect for space"], scores: { respectForBoundaries: -3, control: 2 } },
        },
      ],
    },
    bad_day_question: {
      id: "bad_day_question",
      title: "A Bad Day",
      text: [
        "Sarah appears long enough to drop a bowl of crisps on the bar and steal one for herself.",
        "'Right then,' she says. 'When you've had a dreadful day and you're being prickly, what do you do with that?'",
        "{subjectName} gives her a look. She ignores it entirely.",
      ],
      choices: [
        {
          id: "name_prickly",
          label: "Say I'm prickly, ask for ten minutes, then come back like a grown-up.",
          nextId: "apology_question",
          type: "score",
          effects: { state: "warm", scores: { emotionalMaturity: 2, accountability: 1, conflictStyle: 1 } },
        },
        {
          id: "own_mess",
          label: "I can be difficult when I'm hurt, but I try not to make someone else decode me.",
          nextId: "apology_question",
          type: "score",
          effects: { state: "curious", scores: { emotionalMaturity: 1, accountability: 2, empathy: 1 } },
        },
        {
          id: "should_know",
          label: "If someone really knows me, they should know how to handle me.",
          nextId: "ending_emotional_weather",
          type: "redFlag",
          effects: { state: "closed", redFlags: ["outsourced emotional regulation"], scores: { emotionalMaturity: -2, entitlement: 2, accountability: -1 } },
        },
      ],
    },
    apology_question: {
      id: "apology_question",
      title: "Apologies",
      text: [
        "Stevie snorts. 'And what counts as a proper apology, then? Since apparently we're solving humanity before last orders.'",
        "{subjectName} smiles, but he is listening.",
      ],
      choices: [
        {
          id: "impact_apology",
          label: "Name what I did, listen to the impact, and change the bit that hurt them.",
          nextId: "attention_question",
          type: "score",
          effects: { state: "warm", scores: { accountability: 2, empathy: 2, conflictStyle: 1 } },
        },
        {
          id: "clumsy_apology",
          label: "Probably apologise badly first, then try again when I stop panicking.",
          nextId: "attention_question",
          type: "score",
          effects: { state: "playful", scores: { accountability: 1, humour: 1, emotionalMaturity: 1 } },
        },
        {
          id: "felt_that_way",
          label: "I mean, I'll say sorry if it calms things down.",
          nextId: "ending_accountability_cools",
          type: "redFlag",
          effects: { state: "closed", redFlags: ["performative apology"], scores: { accountability: -2, empathy: -1 } },
        },
      ],
    },
    attention_question: {
      id: "attention_question",
      title: "Someone Else's Moment",
      text: [
        "The conversation swerves again when Stevie tells a story about Sarah accidentally becoming the main event at someone else's birthday.",
        "'Be honest,' Sarah says. 'If someone you're seeing gets all the attention in a room, how do you take it?'",
      ],
      choices: [
        {
          id: "enjoy_their_moment",
          label: "Enjoy watching them have their moment. That's a nice thing, surely.",
          nextId: "dad_jokes",
          type: "score",
          effects: { state: "warm", scores: { empathy: 2, emotionalMaturity: 1 } },
        },
        {
          id: "notice_then_recover",
          label: "I might feel shy for a second, but I wouldn't make it their problem.",
          nextId: "dad_jokes",
          type: "score",
          effects: { state: "curious", scores: { accountability: 1, emotionalMaturity: 1 } },
        },
        {
          id: "hate_invisible",
          label: "I'd hate being made to feel invisible. I don't compete for attention.",
          nextId: "ending_attention_cools",
          type: "redFlag",
          effects: { state: "closed", redFlags: ["competitive attention"], scores: { entitlement: 2, resentment: 1, empathy: -1 } },
        },
      ],
    },
    dad_jokes: {
      id: "dad_jokes",
      title: "Bad Jokes",
      text: [
        "The conversation moves on again. The regulars and bar staff start telling terrible dad jokes with the absolute confidence of people who know they are awful.",
        "{subjectName} watches you over the rim of his glass, clearly curious what you will do with this level of nonsense.",
      ],
      choices: [
        {
          id: "dismiss_jokes",
          label: "\"Oh ha ha, very good,\" you say.",
          nextId: "joke_dismissed",
          type: "toneShift",
          effects: { state: "guarded", scores: { humour: -1 } },
        },
        {
          id: "join_jokes",
          label: "Join in laughing with the bad jokes and tell one of your own.",
          nextId: "odonoghues_invite",
          type: "score",
          effects: { state: "playful", scores: { humour: 2, openness: 1 } },
        },
      ],
    },
    joke_dismissed: {
      id: "joke_dismissed",
      title: "The Laugh Does Not Land",
      text: [
        "Nobody is offended. The room simply moves on without you quite inside it.",
        "Last orders comes and goes. {friendName} texts to say she is heading home, and the easiest thing is suddenly also the kindest thing.",
      ],
      choices: [
        {
          id: "get_taxi",
          label: "Get a taxi home",
          nextId: "ending_taxi_home",
          type: "gate",
          effects: { state: "ended" },
        },
      ],
    },
    odonoghues_invite: {
      id: "odonoghues_invite",
      title: "Last Orders",
      text: [
        "'Ha. Good one,' {subjectName} says.",
        "A few more jokes later, the bar staff call last orders. {subjectName} introduces you to Victoria and Sarah, then asks if you fancy joining them for a drink after they close.",
        "He excuses himself for a moment. Sarah smiles. 'I think he might like you a bit.' Victoria nods like this is not news.",
        "'Gonna join us for some pool and darts?' Sarah asks.",
      ],
      choices: [
        {
          id: "maybe_for_bit",
          label: "Maybe for a bit",
          nextId: "walk_to_ods",
          type: "score",
          effects: { state: "warm", scores: { openness: 1, directness: 1 } },
        },
        {
          id: "go_home_now",
          label: "No thanks, I'm going back to wait for {friendName} at home.",
          nextId: "ending_taxi_home",
          type: "gate",
          effects: { state: "ended" },
        },
      ],
    },
    walk_to_ods: {
      id: "walk_to_ods",
      title: "Between Pubs",
      text: [
        "When {subjectName} returns, he looks pleased to see you are still there. Sarah and Victoria head off to get a table.",
        "Outside, the rain has stopped and the air feels fresh and sharp. {subjectName} positions himself between you and the wind, hands in his jacket pockets.",
        "It looks as if he is very subtly offering you an arm, but he has not said anything.",
      ],
      choices: [
        {
          id: "take_arm",
          label: "[Slip your arm through his and into your coat pocket] \"That wind bites, doesn't it?\"",
          nextId: "walk_arm",
          type: "score",
          effects: { state: "warm", scores: { directness: 1, openness: 1 } },
        },
        {
          id: "keep_coat",
          label: "[Pull your own coat tighter] \"That wind has come up a bit, hasn't it?\"",
          nextId: "walk_coat",
          type: "toneShift",
          effects: { state: "curious", scores: { respectForBoundaries: 1 } },
        },
      ],
    },
    walk_arm: {
      id: "walk_arm",
      title: "Arm In Arm",
      text: [
        "{subjectName} smiles when you take his arm.",
        "'It's not far.'",
        "He seems a little more confident as you walk. Crossing the cobbles, you slip, but because you are holding his arm you do not fall.",
      ],
      choices: [
        {
          id: "keep_walking",
          label: "Keep walking to the bar",
          nextId: "ods_evening_arm",
          type: "score",
          effects: { state: "warm", scores: { openness: 1 } },
        },
      ],
    },
    walk_coat: {
      id: "walk_coat",
      title: "Close Enough",
      text: [
        "'It's not far,' {subjectName} says.",
        "You walk together to O'Donoghues. Crossing the cobbles, you slip, but catch yourself before you fall.",
        "He half-reaches toward you, then thinks better of making a production of it.",
      ],
      choices: [
        {
          id: "keep_walking",
          label: "Keep walking to the bar",
          nextId: "ods_evening_coat",
          type: "score",
          effects: { state: "curious", scores: { respectForBoundaries: 1 } },
        },
      ],
    },
    ods_evening_arm: {
      id: "ods_evening_arm",
      title: "Pool And Darts",
      text: [
        "At O'Donoghues, you find a table for four. {subjectName} offers to get you a drink while you wait for Sarah and Victoria.",
        "They arrive soon after. The four of you chat, play pool, and throw a few deeply average darts.",
        "It gets late. {subjectName} steps away, and Sarah leans in. 'He's not going to make a move, by the way. If you're interested, you'll have to make it clear.'",
      ],
      choices: [
        {
          id: "ask_mike_home",
          label: "Ask {subjectName} if he'd mind walking you home",
          nextId: "walk_home",
          type: "score",
          effects: { state: "warm", scores: { directness: 2, openness: 1 } },
        },
        {
          id: "ask_girls_taxi",
          label: "Ask Sarah and Victoria if they'd mind walking you to a taxi",
          nextId: "ending_late_taxi",
          type: "gate",
          effects: { state: "ended" },
        },
      ],
    },
    ods_evening_coat: {
      id: "ods_evening_coat",
      title: "Pool And Darts",
      text: [
        "At O'Donoghues, you find a table for four. {subjectName} offers to get you a drink while you wait for Sarah and Victoria.",
        "They arrive soon after. The four of you chat, play pool, and throw a few deeply average darts.",
        "It gets late. {subjectName} steps away, and Sarah leans in. 'He's not going to make a move, by the way. If you're interested, you'll have to make it clear.'",
      ],
      choices: [
        {
          id: "ask_mike_home",
          label: "Ask {subjectName} if he'd mind walking you home",
          nextId: "walk_home",
          type: "score",
          effects: { state: "warm", scores: { directness: 2, respectForBoundaries: 1 } },
        },
        {
          id: "ask_girls_taxi",
          label: "Ask Sarah and Victoria if they'd mind walking you to a taxi",
          nextId: "ending_late_taxi",
          type: "gate",
          effects: { state: "ended" },
        },
      ],
    },
    walk_home: {
      id: "walk_home",
      title: "Walking Home",
      text: [
        "'No problem,' {subjectName} says.",
        "He offers you his arm as you leave the building and head towards {friendName}'s place.",
        "The clouds have cleared. It is a crisp, clear night, and the wind is still cool.",
        "'You know, {playerName}, if I've not made it clear with my terrible flirting style, I think you're pretty nice.'",
        "'I picked up on it, yeah.'",
        "The wind cuts between the buildings, so you both pause for a second in a sheltered alcove.",
        "You're both standing close, facing each other in the shelter of the alcove.",
        "{subjectName} looks deep into your eyes and hesitates.",
        "'What is it?' you ask.",
        "'Well, {playerName}. I was just thinking about how great it would be to kiss you just now.'",
      ],
      choices: [
        {
          id: "step_in",
          label: "[Step closer and look up] \"Really?\"",
          nextId: "alcove_boundary",
          type: "score",
          effects: { state: "warm", scores: { directness: 2, openness: 1 } },
        },
        {
          id: "maybe_next_time_first",
          label: "[Smile, step back out of the alcove and take his arm again] \"Maybe next time...\"",
          nextId: "number_exchange_warm",
          type: "score",
          effects: { state: "warm", scores: { respectForBoundaries: 2, emotionalMaturity: 1 } },
        },
      ],
    },
    alcove_boundary: {
      id: "alcove_boundary",
      title: "The Alcove",
      text: [
        "{subjectName} starts to lean in. For a second, it looks like the whole night is about to tip over into the kiss.",
        "Then he stops himself and laughs once, softly, like he has had to catch up with his own better judgement.",
        "'I really want to,' he says. 'But I've rushed in too fast in the past after a couple of drinks, and I don't want to do that here. Let's wait until next time.'",
        "For a second, the air between you changes shape. Then the choice is yours: make the moment easy, or make him carry it.",
      ],
      choices: [
        {
          id: "respect_warmly",
          label: "Smile: 'Next time sounds worth waiting for.'",
          nextId: "number_exchange_warm",
          type: "score",
          effects: { state: "warm", scores: { respectForBoundaries: 3, emotionalMaturity: 2 } },
        },
        {
          id: "accept_awkwardly",
          label: "Feel embarrassed, but nod and take his arm again",
          nextId: "number_exchange_awkward",
          type: "score",
          effects: { state: "guarded", scores: { respectForBoundaries: 2, emotionalMaturity: 1 } },
        },
        {
          id: "tease_pressure",
          label: "'Come on. Don't be such a tease.'",
          nextId: "walk_home_cool",
          type: "redFlag",
          effects: { state: "closed", redFlags: ["boundary pressure"], scores: { respectForBoundaries: -3, entitlement: 2 } },
        },
        {
          id: "sulk_accuse",
          label: "'Right. So you led me on then.'",
          nextId: "walk_home_cool",
          type: "redFlag",
          effects: { state: "closed", redFlags: ["punishing a boundary"], scores: { respectForBoundaries: -2, control: 2, accountability: -1 } },
        },
      ],
    },
    number_exchange_warm: {
      id: "number_exchange_warm",
      title: "The Number",
      text: [
        "{subjectName}'s shoulders ease.",
        "'I still really would like to give you my number, if you'd like to meet again sometime.'",
        "'I'd like that.'",
        "'Here, what's your number?'",
        "He types it in, rings it, and smiles when your phone lights up.",
        "Then he offers his arm again and walks you the rest of the way home, easy and warm in the crisp night air.",
      ],
      choices: [
        {
          id: "say_goodnight",
          label: "Say goodnight",
          nextId: "ending_good_next_time",
          type: "score",
          effects: { state: "warm", scores: { openness: 1 } },
        },
      ],
    },
    number_exchange_awkward: {
      id: "number_exchange_awkward",
      title: "Still Walking",
      text: [
        "For a second your face burns. Then you nod and take his arm again.",
        "{subjectName} gives you a careful smile, grateful that the night has not had to become a negotiation.",
        "'I still hope this doesn't make the number thing weird,' he says. 'I'd like to see you again.'",
        "'I'd like that.'",
        "He types in your number, rings it, and waits for your phone to light up before walking you the rest of the way home.",
      ],
      choices: [
        {
          id: "say_goodnight_after_wobble",
          label: "Say goodnight",
          nextId: "ending_hopeful_awkward",
          type: "score",
          effects: { state: "curious", scores: { accountability: 1 } },
        },
      ],
    },
    walk_home_cool: {
      id: "walk_home_cool",
      title: "The Walk Continues",
      text: [
        "{subjectName} goes quiet for a moment, then nods toward the pavement.",
        "'Come on. I said I'd walk you home.'",
        "He does. He keeps to his word, stays kind, and leaves enough space between you that the cold air can do what it likes.",
      ],
      choices: [
        {
          id: "finish_the_walk",
          label: "Let the walk finish",
          nextId: "ending_boundary_redflag",
          type: "gate",
          effects: { state: "ended" },
        },
      ],
    },
  },
  endings: {
    ending_taxi_home: {
      id: "ending_taxi_home",
      title: "Taxi Home",
      summary: "You arrive cold and damp at {friendName}'s place. The adventure ends quietly, with rain on the windows and no number in your phone.",
    },
    ending_late_taxi: {
      id: "ending_late_taxi",
      title: "The Taxi Rank",
      summary: "Sarah and Victoria walk you to a taxi. The rain comes back, the queue moves slowly, and the night closes politely rather than romantically.",
    },
    ending_poor_fit: {
      id: "ending_poor_fit",
      title: "Poor Fit",
      summary: "The conversation does not explode. It simply cools. Some rooms tell you quite quickly when they are not yours.",
    },
    ending_values_mismatch: {
      id: "ending_values_mismatch",
      title: "Different Frequencies",
      summary: "No one is wrong for having a worldview, but this one changes the shape of the evening. The route fades before it becomes a date.",
    },
    ending_polite_unfinished: {
      id: "ending_polite_unfinished",
      title: "Polite, But Unfinished",
      summary: "A pleasant enough night, but the story never quite finds its doorway. You leave with dry socks as the main achievement.",
    },
    ending_accountability_cools: {
      id: "ending_accountability_cools",
      title: "The Room Cools",
      summary: "No one argues. The conversation simply stops leaning forward. Some answers make a room smaller.",
    },
    ending_space_pressure: {
      id: "ending_space_pressure",
      title: "A Quiet Exit",
      summary: "{subjectName} does not debate it. The evening stays polite, but something careful in him steps back.",
    },
    ending_emotional_weather: {
      id: "ending_emotional_weather",
      title: "The Weather Turns",
      summary: "No one puts it cruelly, but the answer settles heavily. Needing care is human; making someone else carry the whole weather of you is different.",
    },
    ending_attention_cools: {
      id: "ending_attention_cools",
      title: "Out Of Tune",
      summary: "The laugh around the bar softens into something more careful. This crowd can handle nerves; it has less room for scorekeeping.",
    },
    ending_good_next_time: {
      id: "ending_good_next_time",
      title: "Good Night, Next Time",
      summary: "You make the moment easy instead of making him manage your feelings. He walks you home warm and smiling, with his number now waiting in your phone.",
    },
    ending_hopeful_awkward: {
      id: "ending_hopeful_awkward",
      title: "Hopeful, If A Little Awkward",
      summary: "You wobble, then recover. He notices the effort, walks you home gently, and still gives you his number before the night closes.",
    },
    ending_boundary_redflag: {
      id: "ending_boundary_redflag",
      title: "The Moment Cools",
      summary: "He still walks you home because he said he would. Attraction was there, but the conversation is careful now, and no number is offered.",
    },
  },
};

function fill(text: string, names: Names) {
  return text
    .replaceAll("{playerName}", names.playerName)
    .replaceAll("{friendName}", names.friendName)
    .replaceAll("{subjectName}", names.subjectName);
}

function isTruthyFlag(value: string | null) {
  return value !== null && value !== "0" && value.toLowerCase() !== "false";
}

function isDevModeEnabled() {
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

function getNextStoryState(prev: StoryState, choice: Choice): StoryState {
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
}

function App() {
  const devMode = isDevModeEnabled();
  const [names, setNames] = useState<Names>(defaultNames);
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<StoryState>(() => createInitialStoryState());
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
    setState(createInitialStoryState());
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
      <main className="app">
        <section className="card landing-card">
          <h1>A choose-your-own dating adventure</h1>
          <p className="sub landing-origin">You found the URL on Mike's t&#8209;shirt.</p>
          <p>Instead of dating websites and first-or-zero dates, this is a tiny story to see if we might click.</p>

          <div className="landing-fields">
            <label>Your name<input value={names.playerName} autoComplete="given-name" onChange={(e) => setNames((n) => ({ ...n, playerName: e.target.value }))} /></label>
            <label>Friend's name<input value={names.friendName} onChange={(e) => setNames((n) => ({ ...n, friendName: e.target.value }))} /></label>
          </div>

          <div className="choices landing-actions">
            <button type="button" onClick={startAdventure}>I'm interested</button>
            <button type="button" className="secondary-button" onClick={leaveForGoogle}>Not for me</button>
          </div>

          {devMode ? (
            <div className="dev-name-fields" aria-label="Developer name controls">
              <p className="meta">Dev mode: Mike's name can be changed for testing.</p>
              <label>Person at bar<input value={names.subjectName} onChange={(e) => setNames((n) => ({ ...n, subjectName: e.target.value }))} /></label>
            </div>
          ) : null}
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <section className="card">
        {devMode && previousStates.length > 0 ? (
          <div className="dev-tools" aria-label="Developer navigation">
            <button type="button" className="secondary-button" onClick={handleBack}>Back</button>
            <span>{previousStates.length} step{previousStates.length === 1 ? "" : "s"}</span>
          </div>
        ) : null}
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
            <p>{fill(ending.summary, names)}</p>
            <button onClick={resetStory}>Play again</button>
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
