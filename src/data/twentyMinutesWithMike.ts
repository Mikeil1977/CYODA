import type { Names, StoryData } from "../types/conversation";

export const defaultNames: Names = {
  playerName: "Sally",
  friendName: "Jill",
  subjectName: "Mike",
};

export const story: StoryData = {
  startNodeId: "rain_pub",
  nodes: {
    rain_pub: {
      id: "rain_pub",
      title: "Union Street Rain",
      text: [
        "It starts raining hard while you and {friendName} are walking along Union Street.",
        "You have been out for dinner and a few drinks. You can hear music coming from a pub down some steps nearby.",
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
        "You go down the steps into the bar.",
        "It's not too busy. There are a few regulars at the bar, a few empty tables, and two members of bar staff working.",
        "The music is loud enough to enjoy but not so loud that you can't easily hold a conversation.",
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
      title: "At A Table",
      text: [
        "You and {friendName} take a table. A staff member brings over menus and says the kitchen is close to last orders.",
        "A man comes in and goes to the bar. He seems to know everyone. {friendName}'s phone rings before anything else happens.",
      ],
      choices: [
        {
          id: "let_it_pass",
          label: "Stay at the table",
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
        "While you are waiting, {subjectName} comes in. He says hello to the regulars and the bar staff. Someone starts pouring his pint before he asks.",
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
      title: "Politics",
      text: [
        "'Hard to avoid politics in a global pandemic,' Stevie says. He leaves it at that.",
        "{subjectName} gives a small shrug. 'To be fair, pub conversations do go from weather to constitutional crisis quite quickly.'",
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
        "You explain that you have been out with {friendName} for dinner and a few drinks.",
        "He says he kind of knows {friendName}, then nods towards the regulars. 'Do you want to join us while you wait for her to come back?'",
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
        "You take the drinks back to the table. {friendName} is still outside with her phone pressed to one ear.",
        "The regulars are still laughing at the bar. {subjectName} catches your eye once and then looks away.",
      ],
      choices: [
        {
          id: "join_after_table",
          label: "Finish your drink, then go and join them",
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
        "{friendName} is still outside. You join the regulars properly.",
        "The conversation moves around a bit and eventually lands on religion.",
        "{subjectName} looks over. 'What about you, do you follow a particular religion?'",
      ],
      choices: [
        {
          id: "religion_yes",
          label: "Yes, devoutly",
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
      title: "Old Relationships",
      text: [
        "The conversation moves on to old relationships.",
        "Victoria is stacking glasses at the far end of the bar. Without looking up she says, 'So what did your last relationship actually teach you?'",
      ],
      choices: [
        {
          id: "learned_repair",
          label: "That being right is less useful than learning how to fix things afterwards",
          nextId: "space_question",
          type: "score",
          effects: { state: "warm", scores: { accountability: 2, emotionalMaturity: 2, empathy: 1 } },
        },
        {
          id: "learned_slowly",
          label: "That I can get defensive, but I do come back and own my part",
          nextId: "space_question",
          type: "score",
          effects: { state: "curious", scores: { accountability: 1, emotionalMaturity: 1 } },
        },
        {
          id: "all_exes",
          label: "Honestly? Some people are just hard work. Every ex has been a nightmare",
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
        "He says it casually, but he does seem interested in the answer.",
      ],
      choices: [
        {
          id: "give_space",
          label: "Give them space. If they want to talk later, they know where I am",
          nextId: "bad_day_question",
          type: "score",
          effects: { state: "warm", scores: { respectForBoundaries: 2, emotionalMaturity: 1 } },
        },
        {
          id: "ask_once",
          label: "Ask once if they need anything from me, then leave them be",
          nextId: "bad_day_question",
          type: "score",
          effects: { state: "curious", scores: { respectForBoundaries: 2, empathy: 1 } },
        },
        {
          id: "explain_first",
          label: "They can have space after they explain exactly what I did wrong",
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
        "Sarah appears long enough to drop a bowl of crisps on the bar. She steals one for herself.",
        "'Right then,' she says. 'When you've had a dreadful day and you're being prickly, what do you do with that?'",
        "{subjectName} gives her a look. She ignores it entirely.",
      ],
      choices: [
        {
          id: "name_prickly",
          label: "Say I'm prickly, ask for ten minutes, then come back like a grown-up",
          nextId: "apology_question",
          type: "score",
          effects: { state: "warm", scores: { emotionalMaturity: 2, accountability: 1, conflictStyle: 1 } },
        },
        {
          id: "own_mess",
          label: "I can be difficult when I'm hurt, but I try not to make someone else decode me",
          nextId: "apology_question",
          type: "score",
          effects: { state: "curious", scores: { emotionalMaturity: 1, accountability: 2, empathy: 1 } },
        },
        {
          id: "should_know",
          label: "If someone really knows me, they should know how to handle me",
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
        "Stevie snorts. 'And what counts as a proper apology, then? Since we're apparently sorting out humanity before last orders.'",
        "{subjectName} smiles, but he is listening.",
      ],
      choices: [
        {
          id: "impact_apology",
          label: "Say what I did, listen to why it hurt them, and change the bit that hurt them",
          nextId: "attention_question",
          type: "score",
          effects: { state: "warm", scores: { accountability: 2, empathy: 2, conflictStyle: 1 } },
        },
        {
          id: "clumsy_apology",
          label: "Probably apologise badly first, then try again when I stop panicking",
          nextId: "attention_question",
          type: "score",
          effects: { state: "playful", scores: { accountability: 1, humour: 1, emotionalMaturity: 1 } },
        },
        {
          id: "felt_that_way",
          label: "I mean, I'll say sorry if it calms things down",
          nextId: "ending_accountability_cools",
          type: "redFlag",
          effects: { state: "closed", redFlags: ["performative apology"], scores: { accountability: -2, empathy: -1 } },
        },
      ],
    },
    attention_question: {
      id: "attention_question",
      title: "Attention",
      text: [
        "Stevie tells a story about Sarah accidentally becoming the main event at someone else's birthday.",
        "'Be honest,' Sarah says. 'If someone you're seeing gets all the attention in a room, how do you take it?'",
      ],
      choices: [
        {
          id: "enjoy_their_moment",
          label: "Enjoy watching them have their moment. That's a nice thing, surely",
          nextId: "dad_jokes",
          type: "score",
          effects: { state: "warm", scores: { empathy: 2, emotionalMaturity: 1 } },
        },
        {
          id: "notice_then_recover",
          label: "I might feel shy for a second, but I wouldn't make it their problem",
          nextId: "dad_jokes",
          type: "score",
          effects: { state: "curious", scores: { accountability: 1, emotionalMaturity: 1 } },
        },
        {
          id: "hate_invisible",
          label: "I'd hate being made to feel invisible. I don't compete for attention",
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
        "The conversation moves on again. The regulars and bar staff start telling terrible dad jokes.",
        "{subjectName} watches over the rim of his glass to see what you make of it.",
      ],
      choices: [
        {
          id: "dismiss_jokes",
          label: "\"Oh ha ha, very good,\" you say",
          nextId: "joke_dismissed",
          type: "toneShift",
          effects: { state: "guarded", scores: { humour: -1 } },
        },
        {
          id: "join_jokes",
          label: "Laugh along and tell one of your own",
          nextId: "odonoghues_invite",
          type: "score",
          effects: { state: "playful", scores: { humour: 2, openness: 1 } },
        },
      ],
    },
    joke_dismissed: {
      id: "joke_dismissed",
      title: "Not Your Crowd",
      text: [
        "Nobody is offended, but the jokes do not really land for you.",
        "Last orders comes and goes. {friendName} texts to say she is heading home. It seems easiest to call it a night.",
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
        "He excuses himself for a moment. Sarah smiles. 'I think he might like you a bit.' Victoria nods while she keeps working.",
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
        "When {subjectName} returns, he looks pleased that you are still there. Sarah and Victoria head off to get a table.",
        "Outside, the rain has stopped and the air is cold.",
        "{subjectName} walks beside you with his hands in his jacket pockets. It looks like he might be offering you his arm, but he does not say anything.",
      ],
      choices: [
        {
          id: "take_arm",
          label: "[Take his arm] \"That wind bites, doesn't it?\"",
          nextId: "walk_arm",
          type: "score",
          effects: { state: "warm", scores: { directness: 1, openness: 1 } },
        },
        {
          id: "keep_coat",
          label: "[Pull your coat tighter] \"That wind has come up a bit, hasn't it?\"",
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
      title: "Walking Over",
      text: [
        "'It's not far,' {subjectName} says.",
        "You walk together to O'Donoghues. Crossing the cobbles, you slip, but catch yourself before you fall.",
        "He half-reaches towards you, then stops himself.",
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
        "They arrive soon after. The four of you chat, play pool, and throw a few average darts.",
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
        "They arrive soon after. The four of you chat, play pool, and throw a few average darts.",
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
        "The clouds have cleared. It is a crisp, clear night, and the wind is still cold.",
        "'You know, {playerName}, if I've not made it clear with my terrible flirting style, I think you're pretty nice.'",
        "'I picked up on it, yeah.'",
        "You stop for a moment in a sheltered alcove, out of the wind.",
        "You are standing close, facing each other.",
        "{subjectName} looks at you and hesitates.",
        "'What is it?' you ask.",
        "'Well, {playerName}. I was just thinking about how great it would be to kiss you just now.'",
      ],
      choices: [
        {
          id: "step_in",
          label: "[Step closer] \"Really?\"",
          nextId: "alcove_boundary",
          type: "score",
          effects: { state: "warm", scores: { directness: 2, openness: 1 } },
        },
        {
          id: "maybe_next_time_first",
          label: "[Smile and take his arm again] \"Maybe next time...\"",
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
        "{subjectName} starts to lean in.",
        "Then he stops himself and gives a small, awkward laugh.",
        "'I really want to,' he says. 'But I've rushed in too fast in the past after a couple of drinks, and I don't want to do that here. Let's wait until next time.'",
        "He looks like he means both parts of that.",
      ],
      choices: [
        {
          id: "respect_warmly",
          label: "Smile: 'Next time sounds worth waiting for'",
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
        "{subjectName} relaxes a little.",
        "'I still really would like to give you my number, if you'd like to meet again sometime.'",
        "'I'd like that.'",
        "'Here, what's your number?'",
        "He types it in and rings it. Your phone lights up.",
        "Then he offers his arm again and walks you the rest of the way home.",
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
        "For a second you feel embarrassed. Then you nod and take his arm again.",
        "{subjectName} gives you a careful smile.",
        "'I still hope this doesn't make the number thing weird,' he says. 'I'd like to see you again.'",
        "'I'd like that.'",
        "He types in your number and rings it. Your phone lights up. Then he walks you the rest of the way home.",
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
        "{subjectName} goes quiet for a moment, then nods towards the pavement.",
        "'Come on. I said I'd walk you home.'",
        "He does walk you home. He keeps his word, but he gives you a bit more space.",
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
      summary: "You arrive cold and damp at {friendName}'s home. It was a wet walk and not much of an adventure.",
    },
    ending_late_taxi: {
      id: "ending_late_taxi",
      title: "The Taxi Rank",
      summary: "Sarah and Victoria walk you to a taxi. The rain starts again and the queue moves slowly. It was a decent night, but not a date.",
    },
    ending_poor_fit: {
      id: "ending_poor_fit",
      title: "Poor Fit",
      summary: "The conversation carries on politely, but it is clear enough. {subjectName}'s not for you.",
    },
    ending_values_mismatch: {
      id: "ending_values_mismatch",
      title: "Different Views",
      summary: "Nobody makes a big deal of it, but the conversation does not really recover. {subjectName}'s not for you.",
    },
    ending_polite_unfinished: {
      id: "ending_polite_unfinished",
      title: "Polite, But Unfinished",
      summary: "It is a pleasant enough night, but nothing much happens. You head home without a number.",
    },
    ending_accountability_cools: {
      id: "ending_accountability_cools",
      title: "The Chat Cools",
      summary: "Nobody argues. The chat just gets a bit harder after that. {subjectName}'s not for you.",
    },
    ending_space_pressure: {
      id: "ending_space_pressure",
      title: "A Quiet Exit",
      summary: "{subjectName} does not argue. The evening stays polite, but he seems more careful after that.",
    },
    ending_emotional_weather: {
      id: "ending_emotional_weather",
      title: "Hard Work",
      summary: "Nobody says anything cruel, but the answer lands badly. Everyone has hard days. Making someone else manage all of them is different.",
    },
    ending_attention_cools: {
      id: "ending_attention_cools",
      title: "Not Quite Right",
      summary: "The chat carries on, but it feels a bit less easy. This probably is not the right fit.",
    },
    ending_good_next_time: {
      id: "ending_good_next_time",
      title: "Good Night, Next Time",
      summary: "{subjectName} walks you home. You have his number in your phone, and next time feels like a real possibility.",
    },
    ending_hopeful_awkward: {
      id: "ending_hopeful_awkward",
      title: "Hopeful, If A Little Awkward",
      summary: "It is a little awkward for a minute, but you both recover. He still gives you his number and walks you home.",
    },
    ending_boundary_redflag: {
      id: "ending_boundary_redflag",
      title: "No Number",
      summary: "He still walks you home because he said he would. He is polite, but the night is done. No number is offered.",
    },
  },
};

